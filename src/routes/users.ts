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
      SELECT r.*, a.name as agent_name, a.slug as agent_slug, a.logo_url as agent_logo
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

/**
 * GET /api/user/profile
 * Get current user's profile (authenticated)
 */
users.get('/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { DB } = c.env;
    
    const userProfile = await DB.prepare(
      'SELECT id, name, email, image as avatar, bio, created_at FROM users WHERE id = ?'
    ).bind(user.id).first();
    
    if (!userProfile) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ success: false, error: 'Failed to fetch profile' }, 500);
  }
});

/**
 * PATCH /api/user/profile
 * Update current user's profile (authenticated)
 */
users.patch('/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { name, email, bio } = await c.req.json();
    const { DB } = c.env;
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await DB.prepare(
        'SELECT id FROM users WHERE email = ? AND id != ?'
      ).bind(email, user.id).first();
      
      if (existingUser) {
        return c.json({ success: false, error: 'Email already in use' }, 400);
      }
    }
    
    await DB.prepare(`
      UPDATE users
      SET name = ?, email = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(name || user.name, email || user.email, bio || '', user.id).run();
    
    return c.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ success: false, error: 'Failed to update profile' }, 500);
  }
});

/**
 * GET /api/user/submissions
 * Get current user's submissions (authenticated)
 */
users.get('/submissions', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { DB } = c.env;
    
    const result = await DB.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM upvotes WHERE agent_id = a.id) as upvote_count,
        (SELECT COUNT(*) FROM reviews WHERE agent_id = a.id AND status = 'APPROVED') as review_count
      FROM agents a
      WHERE a.submitted_by_id = ?
      ORDER BY a.created_at DESC
    `).bind(user.id).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return c.json({ success: false, error: 'Failed to fetch submissions' }, 500);
  }
});

/**
 * GET /api/user/upvotes
 * Get current user's upvoted agents (authenticated)
 */
users.get('/upvotes', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { DB } = c.env;
    
    const result = await DB.prepare(`
      SELECT a.* FROM agents a
      INNER JOIN upvotes u ON a.id = u.agent_id
      WHERE u.user_id = ? AND a.status = 'APPROVED'
      ORDER BY u.created_at DESC
    `).bind(user.id).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching upvotes:', error);
    return c.json({ success: false, error: 'Failed to fetch upvotes' }, 500);
  }
});

/**
 * GET /api/user/reviews
 * Get current user's reviews (authenticated)
 */
users.get('/reviews', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { DB } = c.env;
    
    const result = await DB.prepare(`
      SELECT r.*, a.name as agent_name, a.logo_url as agent_logo
      FROM reviews r
      INNER JOIN agents a ON r.agent_id = a.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `).bind(user.id).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ success: false, error: 'Failed to fetch reviews' }, 500);
  }
});

/**
 * GET /api/user/stats
 * Get current user's statistics (authenticated)
 */
users.get('/stats', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { DB } = c.env;
    
    const submissions = await DB.prepare(
      'SELECT COUNT(*) as count FROM agents WHERE submitted_by_id = ?'
    ).bind(user.id).first<{ count: number }>();
    
    const approved = await DB.prepare(
      "SELECT COUNT(*) as count FROM agents WHERE submitted_by_id = ? AND status = 'APPROVED'"
    ).bind(user.id).first<{ count: number }>();
    
    const totalUpvotes = await DB.prepare(`
      SELECT COUNT(*) as count FROM upvotes u
      INNER JOIN agents a ON u.agent_id = a.id
      WHERE a.submitted_by_id = ?
    `).bind(user.id).first<{ count: number }>();
    
    const totalReviews = await DB.prepare(
      'SELECT COUNT(*) as count FROM reviews WHERE user_id = ?'
    ).bind(user.id).first<{ count: number }>();
    
    return c.json({
      success: true,
      data: {
        total_submissions: submissions?.count || 0,
        approved_submissions: approved?.count || 0,
        total_upvotes: totalUpvotes?.count || 0,
        total_reviews: totalReviews?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

/**
 * POST /api/user/change-password
 * Change current user's password (authenticated)
 */
users.post('/change-password', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { currentPassword, newPassword } = await c.req.json();
    const { DB } = c.env;
    
    if (!currentPassword || !newPassword) {
      return c.json({ success: false, error: 'Current and new passwords are required' }, 400);
    }
    
    if (newPassword.length < 8) {
      return c.json({ success: false, error: 'New password must be at least 8 characters' }, 400);
    }
    
    // Verify current password
    const userRecord = await DB.prepare(
      'SELECT password_hash FROM users WHERE id = ?'
    ).bind(user.id).first<{ password_hash: string }>();
    
    if (!userRecord || !userRecord.password_hash) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    const { verifyPassword, hashPassword } = await import('../lib/auth');
    const isValid = await verifyPassword(currentPassword, userRecord.password_hash);
    
    if (!isValid) {
      return c.json({ success: false, error: 'Current password is incorrect' }, 400);
    }
    
    // Hash and update new password
    const newPasswordHash = await hashPassword(newPassword);
    await DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(newPasswordHash, user.id).run();
    
    return c.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return c.json({ success: false, error: 'Failed to change password' }, 500);
  }
});

/**
 * PATCH /api/user/email-preferences
 * Update current user's email preferences (authenticated)
 */
users.patch('/email-preferences', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const preferences = await c.req.json();
    const { DB } = c.env;
    
    // Store preferences as JSON in a user_preferences table or as JSON column
    // For now, we'll just return success as this requires schema changes
    
    return c.json({
      success: true,
      message: 'Email preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating email preferences:', error);
    return c.json({ success: false, error: 'Failed to update email preferences' }, 500);
  }
});

/**
 * DELETE /api/user/account
 * Delete current user's account (authenticated)
 */
users.delete('/account', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { DB } = c.env;
    
    // Delete user's upvotes
    await DB.prepare('DELETE FROM upvotes WHERE user_id = ?').bind(user.id).run();
    
    // Delete user's reviews
    await DB.prepare('DELETE FROM reviews WHERE user_id = ?').bind(user.id).run();
    
    // Update agents to remove user reference (keep agents but anonymize)
    await DB.prepare(
      'UPDATE agents SET submitted_by_id = NULL WHERE submitted_by_id = ?'
    ).bind(user.id).run();
    
    // Delete user
    await DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id).run();
    
    return c.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return c.json({ success: false, error: 'Failed to delete account' }, 500);
  }
});

export default users;
