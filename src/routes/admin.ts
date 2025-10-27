import { Hono } from 'hono';
import type { Bindings, Agent } from '../types';
import { requireAdmin, requireModerator } from '../lib/auth';
import { updateCategoryCount, updateTagCount } from '../lib/db';

const admin = new Hono<{ Bindings: Bindings }>();

// All admin routes require authentication
admin.use('/*', requireModerator);

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
admin.get('/stats', async (c) => {
  try {
    const { DB } = c.env;
    
    const stats = await DB.batch([
      DB.prepare('SELECT COUNT(*) as count FROM agents'),
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE status = "PENDING"'),
      DB.prepare('SELECT COUNT(*) as count FROM users'),
      DB.prepare('SELECT COUNT(*) as count FROM reviews'),
      DB.prepare('SELECT COUNT(*) as count FROM categories WHERE is_active = 1')
    ]);
    
    return c.json({
      success: true,
      data: {
        total_agents: stats[0].results[0].count || 0,
        pending_agents: stats[1].results[0].count || 0,
        total_users: stats[2].results[0].count || 0,
        total_reviews: stats[3].results[0].count || 0,
        total_categories: stats[4].results[0].count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

/**
 * GET /api/admin/agents/pending
 * Get all pending agents
 */
admin.get('/agents/pending', async (c) => {
  try {
    const { DB } = c.env;
    
    const result = await DB.prepare(`
      SELECT a.*, u.name as submitter_name, u.email as submitter_email
      FROM agents a
      LEFT JOIN users u ON a.submitted_by_id = u.id
      WHERE a.status = 'PENDING'
      ORDER BY a.submitted_at DESC
    `).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching pending agents:', error);
    return c.json({ success: false, error: 'Failed to fetch pending agents' }, 500);
  }
});

/**
 * GET /api/admin/agents/:id
 * Get agent by ID for admin review
 */
admin.get('/agents/:id', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    
    const agent = await DB.prepare(`
      SELECT a.*, u.name as submitter_name, u.email as submitter_email
      FROM agents a
      LEFT JOIN users u ON a.submitted_by_id = u.id
      WHERE a.id = ?
    `).bind(agentId).first();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    // Get categories
    const categories = await DB.prepare(`
      SELECT c.* FROM categories c
      INNER JOIN agent_categories ac ON c.id = ac.category_id
      WHERE ac.agent_id = ?
    `).bind(agentId).all();
    
    // Get tags
    const tags = await DB.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN agent_tags at ON t.id = at.tag_id
      WHERE at.agent_id = ?
    `).bind(agentId).all();
    
    return c.json({
      success: true,
      data: {
        ...agent,
        categories: categories.results || [],
        tags: tags.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return c.json({ success: false, error: 'Failed to fetch agent' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:id/approve
 * Approve a pending agent
 */
admin.put('/agents/:id/approve', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const user = c.get('user');
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    if (agent.status !== 'PENDING') {
      return c.json({ success: false, error: 'Agent is not pending' }, 400);
    }
    
    await DB.prepare(`
      UPDATE agents 
      SET status = 'APPROVED', 
          approved_at = CURRENT_TIMESTAMP,
          approved_by_id = ?,
          published_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(user.id, agentId).run();
    
    // Update category counts
    const agentCategories = await DB.prepare(
      'SELECT category_id FROM agent_categories WHERE agent_id = ?'
    ).bind(agentId).all();
    
    for (const ac of agentCategories.results || []) {
      await updateCategoryCount(DB, ac.category_id);
    }
    
    // Update tag counts
    const agentTags = await DB.prepare(
      'SELECT tag_id FROM agent_tags WHERE agent_id = ?'
    ).bind(agentId).all();
    
    for (const at of agentTags.results || []) {
      await updateTagCount(DB, at.tag_id);
    }
    
    return c.json({
      success: true,
      message: 'Agent approved successfully'
    });
  } catch (error) {
    console.error('Error approving agent:', error);
    return c.json({ success: false, error: 'Failed to approve agent' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:id/reject
 * Reject a pending agent
 */
admin.put('/agents/:id/reject', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const user = c.get('user');
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    if (agent.status !== 'PENDING') {
      return c.json({ success: false, error: 'Agent is not pending' }, 400);
    }
    
    await DB.prepare(`
      UPDATE agents 
      SET status = 'REJECTED', 
          approved_at = CURRENT_TIMESTAMP,
          approved_by_id = ?
      WHERE id = ?
    `).bind(user.id, agentId).run();
    
    return c.json({
      success: true,
      message: 'Agent rejected'
    });
  } catch (error) {
    console.error('Error rejecting agent:', error);
    return c.json({ success: false, error: 'Failed to reject agent' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:id
 * Update agent details
 */
admin.put('/agents/:id', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const data = await c.req.json();
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    const {
      name,
      tagline,
      description,
      website_url,
      pricing_model,
      is_open_source,
      featured_tier
    } = data;
    
    await DB.prepare(`
      UPDATE agents 
      SET name = ?,
          tagline = ?,
          description = ?,
          website_url = ?,
          pricing_model = ?,
          is_open_source = ?,
          featured_tier = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name || agent.name,
      tagline || agent.tagline,
      description || agent.description,
      website_url || agent.website_url,
      pricing_model || agent.pricing_model,
      is_open_source !== undefined ? (is_open_source ? 1 : 0) : agent.is_open_source,
      featured_tier || agent.featured_tier,
      agentId
    ).run();
    
    return c.json({
      success: true,
      message: 'Agent updated successfully'
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    return c.json({ success: false, error: 'Failed to update agent' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:id
 * Delete an agent (admin only)
 */
admin.delete('/agents/:id', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    await DB.prepare('DELETE FROM agents WHERE id = ?')
      .bind(agentId)
      .run();
    
    return c.json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return c.json({ success: false, error: 'Failed to delete agent' }, 500);
  }
});

export default admin;
