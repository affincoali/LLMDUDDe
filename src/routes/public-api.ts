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

// Get trending agents (by views in last 7 days)
publicApi.get('/trending', async (c) => {
  try {
    const DB = c.env.DB;
    const limit = parseInt(c.req.query('limit') || '6');
    
    const agents = await DB.prepare(`
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE a.status = 'APPROVED'
        AND a.created_at >= date('now', '-7 days')
      GROUP BY a.id
      ORDER BY a.view_count DESC
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

// Get newly added agents
publicApi.get('/newly-added', async (c) => {
  try {
    const DB = c.env.DB;
    const limit = parseInt(c.req.query('limit') || '6');
    
    const agents = await DB.prepare(`
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE a.status = 'APPROVED'
      GROUP BY a.id
      ORDER BY a.created_at DESC
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

// Get popular categories
publicApi.get('/categories/popular', async (c) => {
  try {
    const DB = c.env.DB;
    const limit = parseInt(c.req.query('limit') || '12');
    
    const categories = await DB.prepare(`
      SELECT 
        c.*,
        COUNT(a.id) as agent_count,
        SUM(CASE WHEN a.created_at >= date('now', '-7 days') THEN 1 ELSE 0 END) as recent_additions
      FROM categories c
      LEFT JOIN agents a ON c.id = a.category_id AND a.status = 'APPROVED'
      GROUP BY c.id
      HAVING agent_count > 0
      ORDER BY agent_count DESC
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
    
    // Get first category ID for similar agents
    const firstCategoryId = agent.category_ids ? agent.category_ids.split(',')[0] : null;
    
    // Get similar agents (same category)
    const similar = await DB.prepare(`
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT c.name) as category_names
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE ac.category_id = ? 
        AND a.id != ? 
        AND a.status = 'APPROVED'
      GROUP BY a.id
      ORDER BY a.upvote_count DESC
      LIMIT 4
    `).bind(firstCategoryId, agent.id).all();
    
    return c.json({
      success: true,
      data: {
        agent,
        similar: similar.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return c.json({ success: false, error: 'Failed to fetch agent' }, 500);
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
