import { Hono } from 'hono';
import type { Bindings } from '../types';
import { requireAuth } from '../lib/auth';

const users = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/users/:id
 * Get user profile
 */
users.get('/:id', async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    
    const user = await DB.prepare(
      'SELECT id, name, email, image, role, created_at FROM users WHERE id = ?'
    ).bind(userId).first();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    // Get user's submitted agents count
    const agentsCount = await DB.prepare(
      'SELECT COUNT(*) as count FROM agents WHERE submitted_by_id = ?'
    ).bind(userId).first<{ count: number }>();
    
    // Get user's upvotes count
    const upvotesCount = await DB.prepare(
      'SELECT COUNT(*) as count FROM upvotes WHERE user_id = ?'
    ).bind(userId).first<{ count: number }>();
    
    // Get user's reviews count
    const reviewsCount = await DB.prepare(
      'SELECT COUNT(*) as count FROM reviews WHERE user_id = ?'
    ).bind(userId).first<{ count: number }>();
    
    return c.json({
      success: true,
      data: {
        ...user,
        stats: {
          agents_submitted: agentsCount?.count || 0,
          upvotes_given: upvotesCount?.count || 0,
          reviews_written: reviewsCount?.count || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ success: false, error: 'Failed to fetch user' }, 500);
  }
});

/**
 * GET /api/users/:id/agents
 * Get user's submitted agents
 */
users.get('/:id/agents', async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    
    const result = await DB.prepare(
      'SELECT * FROM agents WHERE submitted_by_id = ? ORDER BY created_at DESC'
    ).bind(userId).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching user agents:', error);
    return c.json({ success: false, error: 'Failed to fetch user agents' }, 500);
  }
});

/**
 * GET /api/users/:id/upvotes
 * Get user's upvoted agents
 */
users.get('/:id/upvotes', requireAuth, async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');
    
    // Only allow users to see their own upvotes
    if (currentUser.id !== userId) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    
    const result = await DB.prepare(`
      SELECT a.* FROM agents a
      INNER JOIN upvotes u ON a.id = u.agent_id
      WHERE u.user_id = ?
      ORDER BY u.created_at DESC
    `).bind(userId).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching user upvotes:', error);
    return c.json({ success: false, error: 'Failed to fetch user upvotes' }, 500);
  }
});

/**
 * GET /api/users/:id/reviews
 * Get user's reviews
 */
users.get('/:id/reviews', async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    
    const result = await DB.prepare(`
      SELECT r.*, a.name as agent_name, a.slug as agent_slug
      FROM reviews r
      INNER JOIN agents a ON r.agent_id = a.id
      WHERE r.user_id = ? AND r.status = 'APPROVED'
      ORDER BY r.created_at DESC
    `).bind(userId).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return c.json({ success: false, error: 'Failed to fetch user reviews' }, 500);
  }
});

export default users;
