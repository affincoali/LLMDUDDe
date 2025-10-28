import { Hono } from 'hono';
import type { Context } from 'hono';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Submit a review (requires auth)
app.post('/submit', async (c: Context) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, message: 'Authentication required' }, 401);
    }

    const { agent_id, rating, review_title, review_summary } = await c.req.json();

    // Validation
    if (!agent_id || !rating || !review_title || !review_summary) {
      return c.json({ success: false, message: 'All fields are required' }, 400);
    }

    if (rating < 1 || rating > 5) {
      return c.json({ success: false, message: 'Rating must be between 1 and 5' }, 400);
    }

    if (review_title.length > 100) {
      return c.json({ success: false, message: 'Review title must be 100 characters or less' }, 400);
    }

    if (review_summary.length < 20 || review_summary.length > 2000) {
      return c.json({ success: false, message: 'Review must be between 20 and 2000 characters' }, 400);
    }

    // Check for URLs in review (not allowed)
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\b[a-z]+\.(com|net|org|io|ai|co)\b)/gi;
    if (urlRegex.test(review_title) || urlRegex.test(review_summary)) {
      return c.json({ success: false, message: 'Links are not allowed in reviews' }, 400);
    }

    // Check if agent exists
    const agent = await c.env.DB.prepare('SELECT id FROM agents WHERE id = ?').bind(agent_id).first();
    if (!agent) {
      return c.json({ success: false, message: 'Agent not found' }, 404);
    }

    // Check if user already reviewed this agent
    const existing = await c.env.DB.prepare(
      'SELECT id FROM reviews WHERE user_id = ? AND agent_id = ?'
    ).bind(user.id, agent_id).first();

    if (existing) {
      return c.json({ success: false, message: 'You have already reviewed this agent' }, 400);
    }

    // Insert review (status = PENDING by default)
    const result = await c.env.DB.prepare(`
      INSERT INTO reviews (user_id, agent_id, rating, review_title, review_summary, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)
    `).bind(user.id, agent_id, rating, review_title, review_summary).run();

    return c.json({
      success: true,
      message: 'Review submitted successfully! It will appear after admin approval.',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return c.json({ success: false, message: 'Failed to submit review' }, 500);
  }
});

// Get reviews for an agent (only approved)
app.get('/agent/:agent_id', async (c: Context) => {
  try {
    const agent_id = c.req.param('agent_id');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;

    // Get reviews with user info
    const reviews = await c.env.DB.prepare(`
      SELECT 
        r.id,
        r.rating,
        r.review_title,
        r.review_summary,
        r.helpful_count,
        r.created_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.agent_id = ? AND r.status = 'APPROVED'
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(agent_id, limit, offset).all();

    // Get total count
    const countResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM reviews WHERE agent_id = ? AND status = "APPROVED"'
    ).bind(agent_id).first<{ total: number }>();

    // Get rating stats
    const stats = await c.env.DB.prepare(`
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      WHERE agent_id = ? AND status = 'APPROVED'
    `).bind(agent_id).first();

    return c.json({
      success: true,
      data: {
        reviews: reviews.results,
        stats,
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          pages: Math.ceil((countResult?.total || 0) / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ success: false, message: 'Failed to fetch reviews' }, 500);
  }
});

export default app;
