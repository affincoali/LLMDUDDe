import { Context, Next } from 'hono';
import type { Bindings } from '../types';

/**
 * Middleware for rate limiting submissions
 * Limit: 5 submissions per day per user
 */
export async function rateLimitSubmissions(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }

    const { DB } = c.env;
    
    // Get submissions count in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const result = await DB.prepare(`
      SELECT COUNT(*) as count
      FROM agents
      WHERE submitted_by_id = ? AND created_at > ?
    `).bind(user.id, oneDayAgo).first<{ count: number }>();

    // Rate limit removed - allow unlimited submissions for demo
    // const submissionCount = result?.count || 0;
    // if (submissionCount >= 5) {
    //   return c.json({
    //     success: false,
    //     error: 'Rate limit exceeded.',
    //     retryAfter: '24 hours'
    //   }, 429);
    // }

    await next();
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
}

/**
 * Middleware to check for duplicate URLs (spam detection)
 */
export async function checkDuplicateUrl(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  try {
    // Body MUST be already set by sanitizeRequestBody middleware
    const body = c.get('sanitizedBody');
    
    if (!body) {
      console.error('checkDuplicateUrl: sanitizedBody not found in context');
      return c.json({
        success: false,
        error: 'Request body not available'
      }, 400);
    }
    
    const websiteUrl = body.websiteUrl || body.website_url;

    if (!websiteUrl) {
      await next();
      return;
    }

    const { DB } = c.env;
    
    // Check if URL already exists
    const existing = await DB.prepare(
      'SELECT id, name, status FROM agents WHERE website_url = ?'
    ).bind(websiteUrl).first();

    if (existing) {
      // Allow resubmission if previous was rejected
      if (existing.status === 'REJECTED') {
        await next();
        return;
      }
      
      return c.json({
        success: false,
        error: `This URL has already been submitted: "${existing.name}". Status: ${existing.status}`,
        existingAgent: {
          id: existing.id,
          name: existing.name,
          status: existing.status
        }
      }, 409);
    }

    await next();
  } catch (error) {
    console.error('Duplicate URL check error:', error);
    // Don't block on error, continue to next middleware
    await next();
  }
}

/**
 * Middleware to verify email before allowing submission
 */
export async function requireEmailVerification(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }

    const { DB } = c.env;
    
    // Check if user's email is verified
    const userRecord = await DB.prepare(
      'SELECT email_verified FROM users WHERE id = ?'
    ).bind(user.id).first<{ email_verified: number }>();

    if (!userRecord || !userRecord.email_verified) {
      return c.json({
        success: false,
        error: 'Please verify your email address before submitting an agent',
        action: 'VERIFY_EMAIL'
      }, 403);
    }

    await next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
}

/**
 * CSRF Token generation and validation
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

export async function validateCsrfToken(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  try {
    const method = c.req.method;
    
    // Only validate CSRF on state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await next();
      return;
    }

    const csrfToken = c.req.header('X-CSRF-Token');
    const sessionToken = c.req.header('Authorization')?.replace('Bearer ', '');

    if (!csrfToken || !sessionToken) {
      return c.json({
        success: false,
        error: 'CSRF token missing'
      }, 403);
    }

    // In production, validate CSRF token from session storage
    // For now, we just check it exists
    // TODO: Implement proper CSRF token validation with session storage

    await next();
  } catch (error) {
    console.error('CSRF validation error:', error);
    return c.json({ success: false, error: 'CSRF validation failed' }, 403);
  }
}

/**
 * Sanitize rich text content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and dangerous attributes
  // In production, use a library like DOMPurify or sanitize-html
  
  let sanitized = html;
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // Only allow safe tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const tagPattern = /<\/?(\w+)[^>]*>/gi;
  
  sanitized = sanitized.replace(tagPattern, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      // For anchor tags, only allow href attribute
      if (tag.toLowerCase() === 'a') {
        const hrefMatch = match.match(/href\s*=\s*["']([^"']*)["']/i);
        if (hrefMatch && hrefMatch[1].startsWith('http')) {
          return `<${tag} href="${hrefMatch[1]}" target="_blank" rel="noopener noreferrer">`;
        }
        return '';
      }
      return match;
    }
    return '';
  });
  
  return sanitized;
}

/**
 * Middleware to sanitize request body HTML fields
 */
export async function sanitizeRequestBody(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  try {
    // Check if body was already read by previous middleware
    let body = c.get('sanitizedBody');
    if (!body) {
      try {
        body = await c.req.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON body:', jsonError);
        return c.json({
          success: false,
          error: 'Invalid JSON in request body'
        }, 400);
      }
    }
    
    // Ensure body is not null/undefined
    if (!body || typeof body !== 'object') {
      console.error('Body is not an object:', typeof body);
      return c.json({
        success: false,
        error: 'Request body must be a JSON object'
      }, 400);
    }
    
    // Sanitize description field if present
    if (body.description && typeof body.description === 'string') {
      body.description = sanitizeHtml(body.description);
    }
    
    // Sanitize any other HTML fields
    if (body.features && Array.isArray(body.features)) {
      body.features = body.features.map((f: string) => 
        typeof f === 'string' ? sanitizeHtml(f) : f
      );
    }
    
    // Store sanitized body back to context
    c.set('sanitizedBody', body);
    
    await next();
  } catch (error) {
    console.error('Sanitization middleware error:', error);
    return c.json({
      success: false,
      error: 'Failed to process request body'
    }, 500);
  }
}

/**
 * Check if user has admin or moderator role
 */
export function requireAdminOrModerator(roles: string[] = ['ADMIN', 'MODERATOR']) {
  return async (c: Context<{ Bindings: Bindings }>, next: Next) => {
    const user = c.get('user');
    
    if (!user) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }
    
    if (!roles.includes(user.role)) {
      return c.json({
        success: false,
        error: 'Insufficient permissions. Admin or Moderator role required.'
      }, 403);
    }
    
    await next();
  };
}

/**
 * Log API requests for audit trail
 */
export async function auditLog(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  const start = Date.now();
  const user = c.get('user');
  
  await next();
  
  const duration = Date.now() - start;
  
  // Log request details
  console.log({
    timestamp: new Date().toISOString(),
    method: c.req.method,
    path: c.req.path,
    userId: user?.id || 'anonymous',
    statusCode: c.res.status,
    duration: `${duration}ms`
  });
  
  // In production, store audit logs in database
  // TODO: Implement audit log storage
}
