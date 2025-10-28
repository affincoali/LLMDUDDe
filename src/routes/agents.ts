import { Hono } from 'hono';
import type { Bindings, Agent, User } from '../types';
import { 
  generateSlug, 
  paginate, 
  getAgentWithRelations, 
  incrementViewCount,
  incrementClickCount,
  updateUpvoteCount
} from '../lib/db';
import { getCurrentUser } from '../lib/auth';

const agents = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/agents
 * List all agents with filtering and pagination
 */
agents.get('/', async (c) => {
  try {
    const { DB } = c.env;
    const user = await getCurrentUser(c);
    
    // Get query parameters
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status') || 'APPROVED';
    const category_id = c.req.query('category_id');
    const pricing_model = c.req.query('pricing_model');
    const search = c.req.query('search');
    
    // Map sort aliases to actual column names
    const sortParam = c.req.query('sort') || 'created_at';
    const sortMap: { [key: string]: string } = {
      'newest': 'created_at',
      'popular': 'upvote_count',
      'trending': 'view_count',
      'name': 'name'
    };
    const sort = sortMap[sortParam] || sortParam;
    const order = c.req.query('order') || 'DESC';
    
    // Build query
    let whereConditions = ['status = ?'];
    let params: any[] = [status];
    
    if (category_id) {
      whereConditions.push('id IN (SELECT agent_id FROM agent_categories WHERE category_id = ?)');
      params.push(category_id);
    }
    
    if (pricing_model) {
      whereConditions.push('pricing_model = ?');
      params.push(pricing_model);
    }
    
    if (search) {
      whereConditions.push('(name LIKE ? OR tagline LIKE ? OR description LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Validate sort column to prevent SQL injection
    const validSortColumns = ['created_at', 'updated_at', 'name', 'upvote_count', 'view_count', 'published_at'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'created_at';
    
    // Validate order
    const orderDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const query = `
      SELECT * FROM agents 
      WHERE ${whereClause}
      ORDER BY ${sortColumn} ${orderDirection}
    `;
    
    const countQuery = `SELECT COUNT(*) as count FROM agents WHERE ${whereClause}`;
    
    const result = await paginate<Agent>(DB, query, countQuery, params, page, limit);
    
    return c.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return c.json({ success: false, error: 'Failed to fetch agents' }, 500);
  }
});

/**
 * GET /api/agents/stats
 * Get overall statistics
 */
agents.get('/stats', async (c) => {
  try {
    const { DB } = c.env;
    
    const stats = await DB.batch([
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE status = "APPROVED"'),
      DB.prepare('SELECT COUNT(*) as count FROM categories WHERE is_active = 1'),
      DB.prepare('SELECT COUNT(*) as count FROM reviews WHERE status = "APPROVED"'),
      DB.prepare('SELECT COUNT(*) as count FROM upvotes')
    ]);
    
    return c.json({
      success: true,
      data: {
        total_agents: stats[0].results[0].count || 0,
        total_categories: stats[1].results[0].count || 0,
        total_reviews: stats[2].results[0].count || 0,
        total_upvotes: stats[3].results[0].count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

/**
 * GET /api/agents/:slug
 * Get single agent by slug with all relations
 */
agents.get('/:slug', async (c) => {
  try {
    const { DB } = c.env;
    const slug = c.req.param('slug');
    const user = await getCurrentUser(c);
    
    // Get agent by slug
    const agent = await DB.prepare('SELECT * FROM agents WHERE slug = ?')
      .bind(slug)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    // Increment view count
    await incrementViewCount(DB, agent.id);
    
    // Get agent with relations
    const agentWithRelations = await getAgentWithRelations(DB, agent.id, user?.id);
    
    return c.json({
      success: true,
      data: agentWithRelations
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return c.json({ success: false, error: 'Failed to fetch agent' }, 500);
  }
});

/**
 * POST /api/agents/submit
 * Submit a new agent for review
 */
agents.post('/submit', async (c) => {
  try {
    const { DB } = c.env;
    const data = await c.req.json();
    
    const { 
      name, 
      tagline, 
      description, 
      website_url, 
      pricing_model = 'FREE',
      is_open_source = false,
      submitter_email
    } = data;
    
    if (!name || !website_url || !submitter_email) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: name, website_url, submitter_email' 
      }, 400);
    }
    
    // Generate slug
    const slug = generateSlug(name);
    
    // Check if slug exists
    const existing = await DB.prepare('SELECT id FROM agents WHERE slug = ?')
      .bind(slug)
      .first();
    
    if (existing) {
      return c.json({ 
        success: false, 
        error: 'An agent with this name already exists' 
      }, 400);
    }
    
    // Get or create submitter user
    let user = await DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(submitter_email)
      .first<User>();
    
    if (!user) {
      // Create new user
      const userResult = await DB.prepare(`
        INSERT INTO users (email, name, role, email_verified)
        VALUES (?, ?, 'USER', 0)
      `).bind(submitter_email, submitter_email.split('@')[0], ).run();
      
      user = await DB.prepare('SELECT * FROM users WHERE id = ?')
        .bind(userResult.meta.last_row_id)
        .first<User>();
    }
    
    if (!user) {
      return c.json({ success: false, error: 'Failed to create user' }, 500);
    }
    
    // Create agent
    const result = await DB.prepare(`
      INSERT INTO agents (
        name, slug, tagline, description, website_url,
        pricing_model, is_open_source, status, submitted_by_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `).bind(
      name, 
      slug, 
      tagline || '', 
      description || '', 
      website_url,
      pricing_model,
      is_open_source ? 1 : 0,
      user.id
    ).run();
    
    if (!result.success) {
      return c.json({ success: false, error: 'Failed to create agent' }, 500);
    }
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first<Agent>();
    
    return c.json({
      success: true,
      data: agent,
      message: 'Agent submitted successfully and is pending review'
    }, 201);
  } catch (error) {
    console.error('Error submitting agent:', error);
    return c.json({ success: false, error: 'Failed to submit agent' }, 500);
  }
});

/**
 * POST /api/agents/:id/upvote
 * Toggle upvote for an agent
 */
agents.post('/:id/upvote', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const user = await getCurrentUser(c);
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    // Check if agent exists
    const agent = await DB.prepare('SELECT id FROM agents WHERE id = ?')
      .bind(agentId)
      .first();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    // Check if already upvoted
    const existing = await DB.prepare(
      'SELECT id FROM upvotes WHERE user_id = ? AND agent_id = ?'
    ).bind(user.id, agentId).first();
    
    if (existing) {
      // Remove upvote
      await DB.prepare('DELETE FROM upvotes WHERE id = ?')
        .bind(existing.id)
        .run();
      
      await updateUpvoteCount(DB, agentId);
      
      return c.json({
        success: true,
        data: { upvoted: false },
        message: 'Upvote removed'
      });
    } else {
      // Add upvote
      await DB.prepare(
        'INSERT INTO upvotes (user_id, agent_id) VALUES (?, ?)'
      ).bind(user.id, agentId).run();
      
      await updateUpvoteCount(DB, agentId);
      
      return c.json({
        success: true,
        data: { upvoted: true },
        message: 'Upvote added'
      });
    }
  } catch (error) {
    console.error('Error toggling upvote:', error);
    return c.json({ success: false, error: 'Failed to toggle upvote' }, 500);
  }
});

/**
 * POST /api/agents/:id/click
 * Track click on agent website
 */
agents.post('/:id/click', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    
    await incrementClickCount(DB, agentId);
    
    return c.json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return c.json({ success: false, error: 'Failed to track click' }, 500);
  }
});

export default agents;
