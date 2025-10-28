import { Hono } from 'hono';
import type { Bindings } from '../types';
import { authenticateToken } from '../lib/auth';

const saves = new Hono<{ Bindings: Bindings }>();

/**
 * POST /api/saves/:agentId
 * Save/bookmark an agent
 */
saves.post('/:agentId', async (c) => {
  try {
    // Authenticate user
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const user = await authenticateToken(token);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const agentId = parseInt(c.req.param('agentId'));
    if (isNaN(agentId)) {
      return c.json({ success: false, error: 'Invalid agent ID' }, 400);
    }

    const { DB } = c.env;

    // Check if agent exists
    const agent = await DB.prepare(
      'SELECT id FROM agents WHERE id = ?'
    ).bind(agentId).first();

    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }

    // Check if already saved
    const existingSave = await DB.prepare(
      'SELECT id FROM saved_agents WHERE user_id = ? AND agent_id = ?'
    ).bind(user.id, agentId).first();

    if (existingSave) {
      return c.json({ success: false, error: 'Agent already saved' }, 400);
    }

    // Save the agent
    await DB.prepare(
      'INSERT INTO saved_agents (user_id, agent_id) VALUES (?, ?)'
    ).bind(user.id, agentId).run();

    return c.json({
      success: true,
      message: 'Agent saved successfully'
    });
  } catch (error) {
    console.error('Save agent error:', error);
    return c.json({ success: false, error: 'Failed to save agent' }, 500);
  }
});

/**
 * DELETE /api/saves/:agentId
 * Unsave/remove bookmark from an agent
 */
saves.delete('/:agentId', async (c) => {
  try {
    // Authenticate user
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const user = await authenticateToken(token);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const agentId = parseInt(c.req.param('agentId'));
    if (isNaN(agentId)) {
      return c.json({ success: false, error: 'Invalid agent ID' }, 400);
    }

    const { DB } = c.env;

    // Delete the save
    const result = await DB.prepare(
      'DELETE FROM saved_agents WHERE user_id = ? AND agent_id = ?'
    ).bind(user.id, agentId).run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: 'Save not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Agent unsaved successfully'
    });
  } catch (error) {
    console.error('Unsave agent error:', error);
    return c.json({ success: false, error: 'Failed to unsave agent' }, 500);
  }
});

/**
 * GET /api/saves
 * Get all saved agents for current user
 */
saves.get('/', async (c) => {
  try {
    // Authenticate user
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const user = await authenticateToken(token);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const { DB } = c.env;

    // Get all saved agents
    const savedAgents = await DB.prepare(`
      SELECT 
        a.id, a.name, a.slug, a.tagline, a.description,
        a.logo_url, a.pricing_model, a.upvote_count, a.view_count,
        sa.created_at as saved_at
      FROM saved_agents sa
      JOIN agents a ON sa.agent_id = a.id
      WHERE sa.user_id = ? AND a.status = 'APPROVED'
      ORDER BY sa.created_at DESC
    `).bind(user.id).all();

    return c.json({
      success: true,
      data: savedAgents.results || []
    });
  } catch (error) {
    console.error('Get saved agents error:', error);
    return c.json({ success: false, error: 'Failed to get saved agents' }, 500);
  }
});

/**
 * GET /api/saves/check/:agentId
 * Check if agent is saved by current user
 */
saves.get('/check/:agentId', async (c) => {
  try {
    // Authenticate user
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, saved: false });
    }

    const token = authHeader.substring(7);
    const user = await authenticateToken(token);
    
    if (!user) {
      return c.json({ success: false, saved: false });
    }

    const agentId = parseInt(c.req.param('agentId'));
    if (isNaN(agentId)) {
      return c.json({ success: false, error: 'Invalid agent ID' }, 400);
    }

    const { DB } = c.env;

    // Check if saved
    const existingSave = await DB.prepare(
      'SELECT id FROM saved_agents WHERE user_id = ? AND agent_id = ?'
    ).bind(user.id, agentId).first();

    return c.json({
      success: true,
      saved: !!existingSave
    });
  } catch (error) {
    console.error('Check saved status error:', error);
    return c.json({ success: false, saved: false });
  }
});

export default saves;
