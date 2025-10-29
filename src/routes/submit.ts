import { Hono } from 'hono';
import type { Bindings } from '../types';
import { requireAuth } from '../lib/auth';
import { agentSubmissionSchema, validateData } from '../lib/validation';
import { 
  rateLimitSubmissions, 
  checkDuplicateUrl, 
  requireEmailVerification,
  sanitizeRequestBody 
} from '../lib/middleware';
import { sendEmail, getSubmissionConfirmationEmail } from '../lib/email';

const submit = new Hono<{ Bindings: Bindings }>();

/**
 * Generate URL-friendly slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * POST /api/submit
 * Submit a new agent for review
 * 
 * Requirements:
 * - User must be authenticated
 * - Email must be verified
 * - Rate limit: 5 submissions per day
 * - No duplicate URLs
 * - Complete validation with Zod
 */
submit.post(
  '/',
  requireAuth,
  requireEmailVerification,
  rateLimitSubmissions,
  sanitizeRequestBody,
  checkDuplicateUrl,
  async (c) => {
    try {
      const user = c.get('user');
      const body = c.get('sanitizedBody') || await c.req.json();
      
      if (!body) {
        return c.json({
          success: false,
          error: 'Request body is empty'
        }, 400);
      }
      
      // Validate with comprehensive Zod schema
      const validation = validateData(agentSubmissionSchema, body);
      if (!validation.success) {
        return c.json({
          success: false,
          error: 'Validation failed',
          errors: validation.errors
        }, 400);
      }

      const data = validation.data!;
      const { DB } = c.env;

      // Generate slug
      const baseSlug = generateSlug(data.name);
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug
      while (true) {
        const existing = await DB.prepare(
          'SELECT id FROM agents WHERE slug = ?'
        ).bind(slug).first();
        
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Insert agent
      const agentResult = await DB.prepare(`
        INSERT INTO agents (
          name, slug, tagline, description, website_url,
          pricing_model, is_open_source, github_url,
          logo_url, cover_image,
          status, submitted_by_id,
          twitter_url, linkedin_url, discord_url,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        data.name,
        slug,
        data.tagline,
        data.description,
        data.websiteUrl,
        data.pricingModel,
        data.isOpenSource ? 1 : 0,
        data.githubUrl || null,
        data.logoUrl || null,
        data.coverUrl || null,
        user.id,
        data.socialLinks?.twitter || null,
        data.socialLinks?.linkedin || null,
        data.socialLinks?.discord || null
      ).run();

      if (!agentResult.success) {
        return c.json({
          success: false,
          error: 'Failed to create agent submission'
        }, 500);
      }

      const agentId = agentResult.meta.last_row_id;

      // Insert categories (many-to-many)
      if (data.categories && data.categories.length > 0) {
        for (const categoryId of data.categories) {
          await DB.prepare(`
            INSERT INTO agent_categories (agent_id, category_id)
            VALUES (?, ?)
          `).bind(agentId, categoryId).run();
        }
      }

      // Insert tags
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          // Get or create tag
          let tag = await DB.prepare(
            'SELECT id FROM tags WHERE name = ?'
          ).bind(tagName).first<{ id: number }>();

          if (!tag) {
            const tagResult = await DB.prepare(
              'INSERT INTO tags (name, slug) VALUES (?, ?)'
            ).bind(tagName, generateSlug(tagName)).run();
            tag = { id: tagResult.meta.last_row_id as number };
          }

          // Link tag to agent
          await DB.prepare(`
            INSERT INTO agent_tags (agent_id, tag_id)
            VALUES (?, ?)
          `).bind(agentId, tag.id).run();
        }
      }

      // Insert features
      if (data.features && data.features.length > 0) {
        for (const feature of data.features) {
          await DB.prepare(`
            INSERT INTO agent_features (agent_id, feature)
            VALUES (?, ?)
          `).bind(agentId, feature).run();
        }
      }

      // Insert use cases
      if (data.useCases && data.useCases.length > 0) {
        for (const useCase of data.useCases) {
          await DB.prepare(`
            INSERT INTO agent_use_cases (agent_id, use_case)
            VALUES (?, ?)
          `).bind(agentId, useCase).run();
        }
      }

      // Insert screenshots
      if (data.screenshots && data.screenshots.length > 0) {
        for (let i = 0; i < data.screenshots.length; i++) {
          await DB.prepare(`
            INSERT INTO agent_screenshots (agent_id, image_url, display_order)
            VALUES (?, ?, ?)
          `).bind(agentId, data.screenshots[i], i + 1).run();
        }
      }

      // Send confirmation email (if Resend API key is configured)
      const resendApiKey = c.env.RESEND_API_KEY;
      if (resendApiKey) {
        await sendEmail(resendApiKey, {
          to: user.email,
          subject: 'Agent Submission Received - AI Agents Directory',
          html: getSubmissionConfirmationEmail(user.name, data.name)
        }).catch(err => console.error('Submission confirmation email failed:', err));
      }

      return c.json({
        success: true,
        message: 'Agent submitted successfully and is pending review',
        data: {
          id: agentId,
          slug,
          name: data.name,
          status: 'PENDING',
          estimatedReviewTime: '24-48 hours'
        }
      }, 201);

    } catch (error) {
      console.error('Agent submission error:', error);
      return c.json({
        success: false,
        error: 'Failed to submit agent. Please try again.'
      }, 500);
    }
  }
);

export default submit;
