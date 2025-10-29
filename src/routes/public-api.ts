// Public API endpoints for frontend functionality
import { Hono } from 'hono';
import type { Bindings } from '../types';

const publicApi = new Hono<{ Bindings: Bindings }>();

// Get public statistics
publicApi.get('/stats', async (c) => {
  try {
    const DB = c.env.DB;
    
    const stats = await DB.batch([
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE status = "APPROVED"'),
      DB.prepare('SELECT COUNT(*) as count FROM categories WHERE is_active = 1'),
      DB.prepare('SELECT SUM(upvote_count) as count FROM agents WHERE status = "APPROVED"'),
      DB.prepare('SELECT SUM(view_count) as count FROM agents WHERE status = "APPROVED"')
    ]);
    
    return c.json({
      success: true,
      data: {
        total_agents: stats[0].results[0].count || 0,
        total_categories: stats[1].results[0].count || 0,
        total_upvotes: stats[2].results[0].count || 0,
        total_views: stats[3].results[0].count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

// Get trending agents (by views in last 7 days) - OPTIMIZED
publicApi.get('/trending', async (c) => {
  try {
    const DB = c.env.DB;
    const limit = parseInt(c.req.query('limit') || '6');
    
    // Simplified query without JOINs for speed
    const agents = await DB.prepare(`
      SELECT id, name, slug, logo_url, tagline, pricing_model, upvote_count, view_count, is_open_source
      FROM agents 
      WHERE status = 'APPROVED'
        AND created_at >= date('now', '-7 days')
      ORDER BY view_count DESC
      LIMIT ?
    `).bind(limit).all();
    
    return c.json({
      success: true,
      data: agents.results || []
    });
  } catch (error) {
    console.error('Error fetching trending agents:', error);
    return c.json({ success: false, error: 'Failed to fetch trending agents' }, 500);
  }
});

// Get newly added agents - OPTIMIZED
publicApi.get('/newly-added', async (c) => {
  try {
    const DB = c.env.DB;
    const limit = parseInt(c.req.query('limit') || '6');
    
    // Simplified query without JOINs for speed
    const agents = await DB.prepare(`
      SELECT id, name, slug, logo_url, tagline, pricing_model, upvote_count, view_count, is_open_source
      FROM agents
      WHERE status = 'APPROVED'
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(limit).all();
    
    return c.json({
      success: true,
      data: agents.results || []
    });
  } catch (error) {
    console.error('Error fetching newly added agents:', error);
    return c.json({ success: false, error: 'Failed to fetch newly added agents' }, 500);
  }
});

// Get all approved agents - OPTIMIZED for agents listing page
publicApi.get('/agents', async (c) => {
  try {
    const DB = c.env.DB;
    
    // Simple query without JOINs for maximum speed
    const agents = await DB.prepare(`
      SELECT id, name, slug, logo_url, tagline, description, pricing_model, 
             upvote_count, view_count, is_open_source, created_at, review_count
      FROM agents
      WHERE status = 'APPROVED'
      ORDER BY view_count DESC
    `).all();
    
    return c.json({
      success: true,
      data: agents.results || []
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return c.json({ success: false, error: 'Failed to fetch agents' }, 500);
  }
});

// Get popular categories
publicApi.get('/categories/popular', async (c) => {
  try {
    const DB = c.env.DB;
    const limit = parseInt(c.req.query('limit') || '12');
    
    const categories = await DB.prepare(`
      SELECT 
        c.*,
        COUNT(ac.agent_id) as agent_count,
        0 as recent_additions
      FROM categories c
      LEFT JOIN agent_categories ac ON c.id = ac.category_id
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY agent_count DESC, c.display_order ASC
      LIMIT ?
    `).bind(limit).all();
    
    return c.json({
      success: true,
      data: categories.results || []
    });
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500);
  }
});

// Toggle upvote for an agent
publicApi.post('/:id/upvote', async (c) => {
  try {
    const DB = c.env.DB;
    const agentId = c.req.param('id');
    const userId = c.get('user')?.id; // Optional - can upvote without login
    
    if (!userId) {
      // Guest upvote - just increment count (no toggle)
      await DB.prepare('UPDATE agents SET upvote_count = upvote_count + 1 WHERE id = ?')
        .bind(agentId)
        .run();
      
      return c.json({
        success: true,
        action: 'upvoted',
        message: 'Upvote recorded'
      });
    }
    
    // Check if user already upvoted
    const existing = await DB.prepare('SELECT id FROM upvotes WHERE agent_id = ? AND user_id = ?')
      .bind(agentId, userId)
      .first();
    
    if (existing) {
      // Remove upvote
      await DB.prepare('DELETE FROM upvotes WHERE agent_id = ? AND user_id = ?')
        .bind(agentId, userId)
        .run();
      
      await DB.prepare('UPDATE agents SET upvote_count = upvote_count - 1 WHERE id = ?')
        .bind(agentId)
        .run();
      
      return c.json({
        success: true,
        action: 'removed',
        message: 'Upvote removed'
      });
    } else {
      // Add upvote
      await DB.prepare('INSERT INTO upvotes (agent_id, user_id) VALUES (?, ?)')
        .bind(agentId, userId)
        .run();
      
      await DB.prepare('UPDATE agents SET upvote_count = upvote_count + 1 WHERE id = ?')
        .bind(agentId)
        .run();
      
      return c.json({
        success: true,
        action: 'upvoted',
        message: 'Upvote added'
      });
    }
  } catch (error) {
    console.error('Error toggling upvote:', error);
    return c.json({ success: false, error: 'Failed to toggle upvote' }, 500);
  }
});

// Track agent clicks
publicApi.post('/:id/click', async (c) => {
  try {
    const DB = c.env.DB;
    const agentId = c.req.param('id');
    
    await DB.prepare('UPDATE agents SET click_count = click_count + 1 WHERE id = ?')
      .bind(agentId)
      .run();
    
    return c.json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return c.json({ success: false, error: 'Failed to track click' }, 500);
  }
});

// Increment view count
publicApi.post('/:id/view', async (c) => {
  try {
    const DB = c.env.DB;
    const agentId = c.req.param('id');
    
    await DB.prepare('UPDATE agents SET view_count = view_count + 1 WHERE id = ?')
      .bind(agentId)
      .run();
    
    return c.json({
      success: true,
      message: 'View tracked'
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return c.json({ success: false, error: 'Failed to track view' }, 500);
  }
});

// Newsletter subscription
publicApi.post('/newsletter/subscribe', async (c) => {
  try {
    const DB = c.env.DB;
    const { email } = await c.req.json();
    
    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'Valid email required' }, 400);
    }
    
    // Check if already subscribed
    const existing = await DB.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?')
      .bind(email)
      .first();
    
    if (existing) {
      return c.json({
        success: true,
        message: 'You are already subscribed!'
      });
    }
    
    // Add subscriber
    await DB.prepare('INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, CURRENT_TIMESTAMP)')
      .bind(email)
      .run();
    
    return c.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return c.json({ success: false, error: 'Failed to subscribe' }, 500);
  }
});

// Get agent by slug with full details
publicApi.get('/:slug/details', async (c) => {
  try {
    const DB = c.env.DB;
    const slug = c.req.param('slug');
    
    const agent = await DB.prepare(`
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.id) as category_ids,
        u.name as submitter_name
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      LEFT JOIN users u ON a.submitted_by_id = u.id
      WHERE a.slug = ? AND a.status = 'APPROVED'
      GROUP BY a.id
    `).bind(slug).first();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    // OPTIMIZED BATCH QUERY - reduced limits for speed
    const [features, useCases, faqs, pricingPlans, screenshots, pros, cons, reviews, reviewStats] = await Promise.all([
      DB.prepare('SELECT * FROM features WHERE agent_id = ? ORDER BY display_order ASC LIMIT 10').bind(agent.id).all(),
      DB.prepare('SELECT * FROM use_cases WHERE agent_id = ? ORDER BY display_order ASC LIMIT 5').bind(agent.id).all(),
      DB.prepare('SELECT * FROM agent_faqs WHERE agent_id = ? ORDER BY display_order ASC LIMIT 5').bind(agent.id).all(),
      DB.prepare('SELECT * FROM pricing_plans WHERE agent_id = ? ORDER BY display_order ASC LIMIT 5').bind(agent.id).all(),
      DB.prepare('SELECT * FROM agent_screenshots WHERE agent_id = ? ORDER BY display_order ASC LIMIT 8').bind(agent.id).all(),
      DB.prepare('SELECT * FROM agent_pros_cons WHERE agent_id = ? AND type = "PRO" ORDER BY display_order ASC LIMIT 5').bind(agent.id).all(),
      DB.prepare('SELECT * FROM agent_pros_cons WHERE agent_id = ? AND type = "CON" ORDER BY display_order ASC LIMIT 5').bind(agent.id).all(),
      DB.prepare('SELECT r.*, u.name as user_name, u.image as user_image FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.agent_id = ? AND r.status = "APPROVED" ORDER BY r.created_at DESC LIMIT 5').bind(agent.id).all(),
      DB.prepare('SELECT COUNT(*) as total_reviews, AVG(rating) as average_rating, SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5, SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4, SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3, SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2, SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1 FROM reviews WHERE agent_id = ? AND status = "APPROVED"').bind(agent.id).first()
    ]);
    
    // Get similar agents (ultra-fast query - indexed columns only, limit 3)
    const firstCategoryId = agent.category_ids ? agent.category_ids.split(',')[0] : null;
    const similar = firstCategoryId ? await DB.prepare(`
      SELECT a.id, a.name, a.slug, a.logo_url, a.tagline, a.upvote_count
      FROM agents a
      JOIN agent_categories ac ON a.id = ac.agent_id
      WHERE ac.category_id = ? AND a.id != ? AND a.status = 'APPROVED'
      ORDER BY a.upvote_count DESC
      LIMIT 3
    `).bind(firstCategoryId, agent.id).all() : { results: [] };
    
    // Skip alternatives for speed (can be added back if needed)
    const alternatives = { results: [] };
    
    return c.json({
      success: true,
      data: {
        agent,
        features: features.results || [],
        useCases: useCases.results || [],
        faqs: faqs.results || [],
        pricingPlans: pricingPlans.results || [],
        screenshots: screenshots.results || [],
        pros: pros.results || [],
        cons: cons.results || [],
        reviews: reviews.results || [],
        reviewStats: reviewStats || {},
        similar: similar.results || [],
        alternatives: alternatives.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return c.json({ success: false, error: 'Failed to fetch agent' }, 500);
  }
});

// Get current vote count for an agent (for real-time updates)
publicApi.get('/:id/vote-count', async (c) => {
  try {
    const DB = c.env.DB;
    const agentId = c.req.param('id');
    
    const agent = await DB.prepare('SELECT id, upvote_count FROM agents WHERE id = ?')
      .bind(agentId)
      .first();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    // Check if current user has upvoted
    let user_upvoted = false;
    const user = c.get('user');
    if (user) {
      const upvote = await DB.prepare('SELECT id FROM upvotes WHERE agent_id = ? AND user_id = ?')
        .bind(agentId, user.id)
        .first();
      user_upvoted = !!upvote;
    }
    
    return c.json({
      success: true,
      data: {
        agent_id: agent.id,
        upvote_count: agent.upvote_count,
        user_upvoted
      }
    });
  } catch (error) {
    console.error('Error fetching vote count:', error);
    return c.json({ success: false, error: 'Failed to fetch vote count' }, 500);
  }
});

// Search agents
publicApi.get('/search', async (c) => {
  try {
    const DB = c.env.DB;
    const query = c.req.query('q') || '';
    const limit = parseInt(c.req.query('limit') || '20');
    
    if (!query || query.length < 2) {
      return c.json({ success: true, data: [] });
    }
    
    const agents = await DB.prepare(`
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT c.name) as category_names
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE a.status = 'APPROVED'
        AND (
          a.name LIKE ? 
          OR a.tagline LIKE ? 
          OR a.description LIKE ?
          OR a.keywords LIKE ?
        )
      GROUP BY a.id
      ORDER BY a.upvote_count DESC
      LIMIT ?
    `).bind(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, limit).all();
    
    return c.json({
      success: true,
      data: agents.results || []
    });
  } catch (error) {
    console.error('Error searching agents:', error);
    return c.json({ success: false, error: 'Search failed' }, 500);
  }
});

export default publicApi;
