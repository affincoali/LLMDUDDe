import { Hono } from 'hono';
import type { Bindings } from '../types';

const leaderboardApi = new Hono<{ Bindings: Bindings }>();

// GET /api/leaderboard/views - Get leaderboard by view count
leaderboardApi.get('/views', async (c) => {
  try {
    const DB = c.env.DB;
    const timeRange = c.req.query('timeRange') || 'all'; // all, 30d, 7d
    const category = c.req.query('category') || '';
    const limit = parseInt(c.req.query('limit') || '50');
    
    let dateFilter = '';
    if (timeRange === '30d') {
      dateFilter = "AND a.created_at >= date('now', '-30 days')";
    } else if (timeRange === '7d') {
      dateFilter = "AND a.created_at >= date('now', '-7 days')";
    }
    
    let categoryFilter = '';
    if (category) {
      categoryFilter = `AND EXISTS (
        SELECT 1 FROM agent_categories ac 
        JOIN categories c ON ac.category_id = c.id 
        WHERE ac.agent_id = a.id AND c.slug = '${category}'
      )`;
    }
    
    const query = `
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.logo_url,
        a.tagline,
        a.view_count,
        a.upvote_count,
        a.review_count,
        a.pricing_model,
        GROUP_CONCAT(DISTINCT c.name) as category_names
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE a.status = 'APPROVED' ${dateFilter} ${categoryFilter}
      GROUP BY a.id
      ORDER BY a.view_count DESC
      LIMIT ?
    `;
    
    const result = await DB.prepare(query).bind(limit).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching view leaders:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch view leaders'
    }, 500);
  }
});

// GET /api/leaderboard/upvotes - Get leaderboard by upvote count
leaderboardApi.get('/upvotes', async (c) => {
  try {
    const DB = c.env.DB;
    const timeRange = c.req.query('timeRange') || 'all';
    const category = c.req.query('category') || '';
    const limit = parseInt(c.req.query('limit') || '50');
    
    let dateFilter = '';
    if (timeRange === '30d') {
      dateFilter = "AND a.created_at >= date('now', '-30 days')";
    } else if (timeRange === '7d') {
      dateFilter = "AND a.created_at >= date('now', '-7 days')";
    }
    
    let categoryFilter = '';
    if (category) {
      categoryFilter = `AND EXISTS (
        SELECT 1 FROM agent_categories ac 
        JOIN categories c ON ac.category_id = c.id 
        WHERE ac.agent_id = a.id AND c.slug = '${category}'
      )`;
    }
    
    const query = `
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.logo_url,
        a.tagline,
        a.view_count,
        a.upvote_count,
        a.review_count,
        a.pricing_model,
        GROUP_CONCAT(DISTINCT c.name) as category_names
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE a.status = 'APPROVED' ${dateFilter} ${categoryFilter}
      GROUP BY a.id
      ORDER BY a.upvote_count DESC
      LIMIT ?
    `;
    
    const result = await DB.prepare(query).bind(limit).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching upvote leaders:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch upvote leaders'
    }, 500);
  }
});

// GET /api/leaderboard/reviews - Get leaderboard by review count
leaderboardApi.get('/reviews', async (c) => {
  try {
    const DB = c.env.DB;
    const timeRange = c.req.query('timeRange') || 'all';
    const category = c.req.query('category') || '';
    const limit = parseInt(c.req.query('limit') || '50');
    
    let dateFilter = '';
    if (timeRange === '30d') {
      dateFilter = "AND a.created_at >= date('now', '-30 days')";
    } else if (timeRange === '7d') {
      dateFilter = "AND a.created_at >= date('now', '-7 days')";
    }
    
    let categoryFilter = '';
    if (category) {
      categoryFilter = `AND EXISTS (
        SELECT 1 FROM agent_categories ac 
        JOIN categories c ON ac.category_id = c.id 
        WHERE ac.agent_id = a.id AND c.slug = '${category}'
      )`;
    }
    
    const query = `
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.logo_url,
        a.tagline,
        a.view_count,
        a.upvote_count,
        a.review_count,
        a.average_rating,
        a.pricing_model,
        GROUP_CONCAT(DISTINCT c.name) as category_names
      FROM agents a
      LEFT JOIN agent_categories ac ON a.id = ac.agent_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE a.status = 'APPROVED' ${dateFilter} ${categoryFilter}
      GROUP BY a.id
      ORDER BY a.review_count DESC
      LIMIT ?
    `;
    
    const result = await DB.prepare(query).bind(limit).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching review leaders:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch review leaders'
    }, 500);
  }
});

export default leaderboardApi;
