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
 * GET /api/admin/agents/all
 * Get all agents with filters and pagination
 */
admin.get('/agents/all', async (c) => {
  try {
    const { DB } = c.env;
    
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status');
    const search = c.req.query('search');
    
    const offset = (page - 1) * limit;
    
    let whereConditions = ['1=1'];
    let params: any[] = [];
    
    if (status) {
      whereConditions.push('a.status = ?');
      params.push(status);
    }
    
    if (search) {
      whereConditions.push('(a.name LIKE ? OR a.tagline LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Get total count
    const countResult = await DB.prepare(`
      SELECT COUNT(*) as count FROM agents a WHERE ${whereClause}
    `).bind(...params).first<{ count: number }>();
    
    const total = countResult?.count || 0;
    
    // Get agents with submitter info
    const agents = await DB.prepare(`
      SELECT 
        a.*,
        u.name as submitter_name,
        u.email as submitter_email
      FROM agents a
      LEFT JOIN users u ON a.submitted_by_id = u.id
      WHERE ${whereClause}
      ORDER BY a.submitted_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();
    
    return c.json({
      success: true,
      data: agents.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return c.json({ success: false, error: 'Failed to fetch agents' }, 500);
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
        category_ids: (categories.results || []).map((cat: any) => cat.id),
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
 * Update agent details (comprehensive update with all new fields)
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
    
    // Extract all possible fields from data
    const fields = {
      // Basic info
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      long_description: data.long_description,
      website_url: data.website_url,
      logo_url: data.logo_url,
      cover_image: data.cover_image,
      
      // Pricing
      pricing_model: data.pricing_model,
      pricing_starts_at: data.pricing_starts_at,
      free_plan_available: data.free_plan_available,
      free_trial_available: data.free_trial_available,
      free_trial_days: data.free_trial_days,
      
      // Company info
      company_name: data.company_name,
      company_website: data.company_website,
      founded_year: data.founded_year,
      company_size: data.company_size,
      headquarters: data.headquarters,
      
      // Media
      youtube_url: data.youtube_url,
      demo_video_url: data.demo_video_url,
      video_thumbnail: data.video_thumbnail,
      
      // Social media
      twitter_url: data.twitter_url,
      linkedin_url: data.linkedin_url,
      facebook_url: data.facebook_url,
      discord_url: data.discord_url,
      github_url: data.github_url,
      
      // Technical
      api_available: data.api_available,
      api_documentation_url: data.api_documentation_url,
      supported_platforms: data.supported_platforms,
      supported_languages: data.supported_languages,
      supported_integrations: data.supported_integrations,
      
      // Other
      is_open_source: data.is_open_source,
      featured_tier: data.featured_tier,
      verified: data.verified,
      alternatives: data.alternatives,
      highlights: data.highlights,
      benefits: data.benefits,
      keywords: data.keywords,
      meta_title: data.meta_title,
      meta_description: data.meta_description
    };
    
    // Build dynamic SQL update
    const updates: string[] = [];
    const params: any[] = [];
    
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        // Handle boolean fields
        if (typeof value === 'boolean') {
          params.push(value ? 1 : 0);
        } else if (typeof value === 'object') {
          // Stringify JSON fields
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
    });
    
    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(agentId);
      
      await DB.prepare(`
        UPDATE agents SET ${updates.join(', ')} WHERE id = ?
      `).bind(...params).run();
    }
    
    // Handle category assignments if provided
    if (data.category_ids && Array.isArray(data.category_ids)) {
      // Remove existing categories
      await DB.prepare('DELETE FROM agent_categories WHERE agent_id = ?')
        .bind(agentId)
        .run();
      
      // Add new categories
      for (const categoryId of data.category_ids) {
        await DB.prepare('INSERT INTO agent_categories (agent_id, category_id) VALUES (?, ?)')
          .bind(agentId, categoryId)
          .run();
      }
      
      // Update category counts
      await updateCategoryCount(DB, ...data.category_ids);
    }
    
    // Handle tag assignments if provided
    if (data.tag_ids && Array.isArray(data.tag_ids)) {
      // Remove existing tags
      await DB.prepare('DELETE FROM agent_tags WHERE agent_id = ?')
        .bind(agentId)
        .run();
      
      // Add new tags
      for (const tagId of data.tag_ids) {
        await DB.prepare('INSERT INTO agent_tags (agent_id, tag_id) VALUES (?, ?)')
          .bind(agentId, tagId)
          .run();
      }
      
      // Update tag counts
      await updateTagCount(DB, ...data.tag_ids);
    }
    
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

/**
 * GET /api/admin/categories
 * Get all categories with pagination
 */
admin.get('/categories', async (c) => {
  try {
    const { DB } = c.env;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = (page - 1) * limit;
    
    const countResult = await DB.prepare('SELECT COUNT(*) as count FROM categories')
      .first<{ count: number }>();
    const total = countResult?.count || 0;
    
    const categories = await DB.prepare(`
      SELECT 
        c.*,
        pc.name as parent_name
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      ORDER BY c.display_order ASC, c.name ASC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    return c.json({
      success: true,
      data: categories.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500);
  }
});

/**
 * GET /api/admin/categories/:id
 * Get single category by ID
 */
admin.get('/categories/:id', async (c) => {
  try {
    const { DB } = c.env;
    const categoryId = parseInt(c.req.param('id'));
    
    const category = await DB.prepare(`
      SELECT 
        c.*,
        pc.name as parent_name
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      WHERE c.id = ?
    `).bind(categoryId).first();
    
    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    return c.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({ success: false, error: 'Failed to fetch category' }, 500);
  }
});

/**
 * POST /api/admin/categories
 * Create a new category
 */
admin.post('/categories', async (c) => {
  try {
    const { DB } = c.env;
    const data = await c.req.json();
    
    const { name, slug, description, icon, color, parent_id, is_active, display_order } = data;
    
    // Validate required fields
    if (!name || !slug) {
      return c.json({ success: false, error: 'Name and slug are required' }, 400);
    }
    
    // Check if slug already exists
    const existing = await DB.prepare('SELECT id FROM categories WHERE slug = ?')
      .bind(slug)
      .first();
    
    if (existing) {
      return c.json({ success: false, error: 'Category with this slug already exists' }, 400);
    }
    
    // Insert new category
    const result = await DB.prepare(`
      INSERT INTO categories (name, slug, description, icon, color, parent_id, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name,
      slug,
      description || null,
      icon || null,
      color || null,
      parent_id || null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      display_order || 0
    ).run();
    
    return c.json({
      success: true,
      message: 'Category created successfully',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ success: false, error: 'Failed to create category' }, 500);
  }
});

/**
 * PUT /api/admin/categories/:id
 * Update a category
 */
admin.put('/categories/:id', async (c) => {
  try {
    const { DB } = c.env;
    const categoryId = parseInt(c.req.param('id'));
    const data = await c.req.json();
    
    // Check if category exists
    const category = await DB.prepare('SELECT * FROM categories WHERE id = ?')
      .bind(categoryId)
      .first();
    
    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    const { name, slug, description, icon, color, parent_id, is_active, display_order } = data;
    
    // If slug is being changed, check for uniqueness
    if (slug && slug !== category.slug) {
      const existing = await DB.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?')
        .bind(slug, categoryId)
        .first();
      
      if (existing) {
        return c.json({ success: false, error: 'Category with this slug already exists' }, 400);
      }
    }
    
    // Update category
    await DB.prepare(`
      UPDATE categories 
      SET name = ?,
          slug = ?,
          description = ?,
          icon = ?,
          color = ?,
          parent_id = ?,
          is_active = ?,
          display_order = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name || category.name,
      slug || category.slug,
      description !== undefined ? description : category.description,
      icon !== undefined ? icon : category.icon,
      color !== undefined ? color : category.color,
      parent_id !== undefined ? parent_id : category.parent_id,
      is_active !== undefined ? (is_active ? 1 : 0) : category.is_active,
      display_order !== undefined ? display_order : category.display_order,
      categoryId
    ).run();
    
    return c.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({ success: false, error: 'Failed to update category' }, 500);
  }
});

/**
 * DELETE /api/admin/categories/:id
 * Delete a category (admin only)
 */
admin.delete('/categories/:id', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const categoryId = parseInt(c.req.param('id'));
    
    const category = await DB.prepare('SELECT * FROM categories WHERE id = ?')
      .bind(categoryId)
      .first();
    
    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    // Check if category has agents
    const agentCount = await DB.prepare('SELECT COUNT(*) as count FROM agent_categories WHERE category_id = ?')
      .bind(categoryId)
      .first<{ count: number }>();
    
    if (agentCount && agentCount.count > 0) {
      return c.json({ 
        success: false, 
        error: `Cannot delete category with ${agentCount.count} associated agents. Please reassign them first.` 
      }, 400);
    }
    
    await DB.prepare('DELETE FROM categories WHERE id = ?')
      .bind(categoryId)
      .run();
    
    return c.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ success: false, error: 'Failed to delete category' }, 500);
  }
});

/**
 * GET /api/admin/users
 * Get all users with pagination
 */
admin.get('/users', async (c) => {
  try {
    const { DB } = c.env;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const role = c.req.query('role');
    const search = c.req.query('search');
    const offset = (page - 1) * limit;
    
    let whereConditions = ['1=1'];
    let params: any[] = [];
    
    if (role) {
      whereConditions.push('role = ?');
      params.push(role);
    }
    
    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    const countResult = await DB.prepare(`SELECT COUNT(*) as count FROM users WHERE ${whereClause}`)
      .bind(...params)
      .first<{ count: number }>();
    const total = countResult?.count || 0;
    
    const users = await DB.prepare(`
      SELECT 
        u.id, u.email, u.name, u.image, u.role, u.email_verified, u.created_at, u.updated_at,
        (SELECT COUNT(*) FROM agents WHERE submitted_by_id = u.id) as agents_count,
        (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as reviews_count,
        (SELECT COUNT(*) FROM upvotes WHERE user_id = u.id) as upvotes_count
      FROM users u
      WHERE ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();
    
    return c.json({
      success: true,
      data: users.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: 'Failed to fetch users' }, 500);
  }
});

/**
 * GET /api/admin/users/:id
 * Get single user by ID with statistics
 */
admin.get('/users/:id', async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    
    const user = await DB.prepare(`
      SELECT 
        id, email, name, image, role, email_verified, created_at, updated_at
      FROM users
      WHERE id = ?
    `).bind(userId).first();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    // Get user statistics
    const stats = await DB.batch([
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE submitted_by_id = ?').bind(userId),
      DB.prepare('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?').bind(userId),
      DB.prepare('SELECT COUNT(*) as count FROM upvotes WHERE user_id = ?').bind(userId)
    ]);
    
    // Get user's recent agents
    const agents = await DB.prepare(`
      SELECT id, name, slug, status, created_at
      FROM agents
      WHERE submitted_by_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `).bind(userId).all();
    
    // Get user's recent reviews
    const reviews = await DB.prepare(`
      SELECT 
        r.id, r.rating, r.content, r.created_at,
        a.name as agent_name, a.slug as agent_slug
      FROM reviews r
      JOIN agents a ON r.agent_id = a.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `).bind(userId).all();
    
    return c.json({
      success: true,
      data: {
        ...user,
        stats: {
          agents_submitted: stats[0].results[0].count || 0,
          reviews_written: stats[1].results[0].count || 0,
          upvotes_given: stats[2].results[0].count || 0
        },
        recent_agents: agents.results || [],
        recent_reviews: reviews.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ success: false, error: 'Failed to fetch user' }, 500);
  }
});

/**
 * PUT /api/admin/users/:id/role
 * Update user role (admin only)
 */
admin.put('/users/:id/role', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    const data = await c.req.json();
    
    const user = await DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    const { role } = data;
    
    // Validate role
    if (!role || !['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return c.json({ success: false, error: 'Invalid role' }, 400);
    }
    
    await DB.prepare(`
      UPDATE users
      SET role = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(role, userId).run();
    
    return c.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return c.json({ success: false, error: 'Failed to update user role' }, 500);
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user details (role, status, etc.)
 */
admin.put('/users/:id', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    const data = await c.req.json();
    
    const user = await DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    const { name, email, role, email_verified } = data;
    
    // Validate role if provided
    if (role && !['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return c.json({ success: false, error: 'Invalid role' }, 400);
    }
    
    // If email is being changed, check for uniqueness
    if (email && email !== user.email) {
      const existing = await DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .bind(email, userId)
        .first();
      
      if (existing) {
        return c.json({ success: false, error: 'Email already in use' }, 400);
      }
    }
    
    await DB.prepare(`
      UPDATE users
      SET name = ?,
          email = ?,
          role = ?,
          email_verified = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name || user.name,
      email || user.email,
      role || user.role,
      email_verified !== undefined ? (email_verified ? 1 : 0) : user.email_verified,
      userId
    ).run();
    
    return c.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: 'Failed to update user' }, 500);
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user (admin only)
 */
admin.delete('/users/:id', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');
    
    // Prevent deleting yourself
    if (userId === currentUser.id) {
      return c.json({ success: false, error: 'Cannot delete your own account' }, 400);
    }
    
    const user = await DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    await DB.prepare('DELETE FROM users WHERE id = ?')
      .bind(userId)
      .run();
    
    return c.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: 'Failed to delete user' }, 500);
  }
});

// ==================== AGENT SUB-RESOURCES ====================

/**
 * POST /api/admin/agents/:id/features
 * Add a feature to an agent
 */
admin.post('/agents/:id/features', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const { title, description, display_order } = await c.req.json();
    
    if (!title) {
      return c.json({ success: false, error: 'Title is required' }, 400);
    }
    
    const result = await DB.prepare(`
      INSERT INTO features (agent_id, title, description, display_order)
      VALUES (?, ?, ?, ?)
    `).bind(agentId, title, description || null, display_order || 0).run();
    
    return c.json({
      success: true,
      message: 'Feature added successfully',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error adding feature:', error);
    return c.json({ success: false, error: 'Failed to add feature' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:agentId/features/:featureId
 * Update a feature
 */
admin.put('/agents/:agentId/features/:featureId', async (c) => {
  try {
    const { DB } = c.env;
    const featureId = parseInt(c.req.param('featureId'));
    const { title, description, display_order } = await c.req.json();
    
    await DB.prepare(`
      UPDATE features 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).bind(title, description, display_order, featureId).run();
    
    return c.json({
      success: true,
      message: 'Feature updated successfully'
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    return c.json({ success: false, error: 'Failed to update feature' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:agentId/features/:featureId
 * Delete a feature
 */
admin.delete('/agents/:agentId/features/:featureId', async (c) => {
  try {
    const { DB } = c.env;
    const featureId = parseInt(c.req.param('featureId'));
    
    await DB.prepare('DELETE FROM features WHERE id = ?').bind(featureId).run();
    
    return c.json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return c.json({ success: false, error: 'Failed to delete feature' }, 500);
  }
});

/**
 * POST /api/admin/agents/:id/use-cases
 * Add a use case to an agent
 */
admin.post('/agents/:id/use-cases', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const { title, description, display_order } = await c.req.json();
    
    if (!title) {
      return c.json({ success: false, error: 'Title is required' }, 400);
    }
    
    const result = await DB.prepare(`
      INSERT INTO use_cases (agent_id, title, description, display_order)
      VALUES (?, ?, ?, ?)
    `).bind(agentId, title, description || null, display_order || 0).run();
    
    return c.json({
      success: true,
      message: 'Use case added successfully',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error adding use case:', error);
    return c.json({ success: false, error: 'Failed to add use case' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:agentId/use-cases/:useCaseId
 * Update a use case
 */
admin.put('/agents/:agentId/use-cases/:useCaseId', async (c) => {
  try {
    const { DB } = c.env;
    const useCaseId = parseInt(c.req.param('useCaseId'));
    const { title, description, display_order } = await c.req.json();
    
    await DB.prepare(`
      UPDATE use_cases 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).bind(title, description, display_order, useCaseId).run();
    
    return c.json({
      success: true,
      message: 'Use case updated successfully'
    });
  } catch (error) {
    console.error('Error updating use case:', error);
    return c.json({ success: false, error: 'Failed to update use case' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:agentId/use-cases/:useCaseId
 * Delete a use case
 */
admin.delete('/agents/:agentId/use-cases/:useCaseId', async (c) => {
  try {
    const { DB } = c.env;
    const useCaseId = parseInt(c.req.param('useCaseId'));
    
    await DB.prepare('DELETE FROM use_cases WHERE id = ?').bind(useCaseId).run();
    
    return c.json({
      success: true,
      message: 'Use case deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting use case:', error);
    return c.json({ success: false, error: 'Failed to delete use case' }, 500);
  }
});

/**
 * POST /api/admin/agents/:id/faqs
 * Add an FAQ to an agent
 */
admin.post('/agents/:id/faqs', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const { question, answer, display_order } = await c.req.json();
    
    if (!question || !answer) {
      return c.json({ success: false, error: 'Question and answer are required' }, 400);
    }
    
    const result = await DB.prepare(`
      INSERT INTO agent_faqs (agent_id, question, answer, display_order)
      VALUES (?, ?, ?, ?)
    `).bind(agentId, question, answer, display_order || 0).run();
    
    return c.json({
      success: true,
      message: 'FAQ added successfully',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error adding FAQ:', error);
    return c.json({ success: false, error: 'Failed to add FAQ' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:agentId/faqs/:faqId
 * Update an FAQ
 */
admin.put('/agents/:agentId/faqs/:faqId', async (c) => {
  try {
    const { DB } = c.env;
    const faqId = parseInt(c.req.param('faqId'));
    const { question, answer, display_order } = await c.req.json();
    
    await DB.prepare(`
      UPDATE agent_faqs 
      SET question = COALESCE(?, question),
          answer = COALESCE(?, answer),
          display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).bind(question, answer, display_order, faqId).run();
    
    return c.json({
      success: true,
      message: 'FAQ updated successfully'
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return c.json({ success: false, error: 'Failed to update FAQ' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:agentId/faqs/:faqId
 * Delete an FAQ
 */
admin.delete('/agents/:agentId/faqs/:faqId', async (c) => {
  try {
    const { DB } = c.env;
    const faqId = parseInt(c.req.param('faqId'));
    
    await DB.prepare('DELETE FROM agent_faqs WHERE id = ?').bind(faqId).run();
    
    return c.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return c.json({ success: false, error: 'Failed to delete FAQ' }, 500);
  }
});

/**
 * POST /api/admin/agents/:id/pricing-plans
 * Add a pricing plan to an agent
 */
admin.post('/agents/:id/pricing-plans', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const { name, price, billing_period, features, is_popular, display_order, cta_text, cta_url } = await c.req.json();
    
    if (!name || !price) {
      return c.json({ success: false, error: 'Name and price are required' }, 400);
    }
    
    const featuresJson = typeof features === 'object' ? JSON.stringify(features) : features;
    
    const result = await DB.prepare(`
      INSERT INTO pricing_plans (agent_id, name, price, billing_period, features, is_popular, display_order, cta_text, cta_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(agentId, name, price, billing_period, featuresJson, is_popular ? 1 : 0, display_order || 0, cta_text, cta_url).run();
    
    return c.json({
      success: true,
      message: 'Pricing plan added successfully',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error adding pricing plan:', error);
    return c.json({ success: false, error: 'Failed to add pricing plan' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:agentId/pricing-plans/:planId
 * Update a pricing plan
 */
admin.put('/agents/:agentId/pricing-plans/:planId', async (c) => {
  try {
    const { DB } = c.env;
    const planId = parseInt(c.req.param('planId'));
    const { name, price, billing_period, features, is_popular, display_order, cta_text, cta_url } = await c.req.json();
    
    const featuresJson = features && typeof features === 'object' ? JSON.stringify(features) : features;
    
    await DB.prepare(`
      UPDATE pricing_plans 
      SET name = COALESCE(?, name),
          price = COALESCE(?, price),
          billing_period = COALESCE(?, billing_period),
          features = COALESCE(?, features),
          is_popular = COALESCE(?, is_popular),
          display_order = COALESCE(?, display_order),
          cta_text = COALESCE(?, cta_text),
          cta_url = COALESCE(?, cta_url)
      WHERE id = ?
    `).bind(name, price, billing_period, featuresJson, is_popular !== undefined ? (is_popular ? 1 : 0) : null, display_order, cta_text, cta_url, planId).run();
    
    return c.json({
      success: true,
      message: 'Pricing plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    return c.json({ success: false, error: 'Failed to update pricing plan' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:agentId/pricing-plans/:planId
 * Delete a pricing plan
 */
admin.delete('/agents/:agentId/pricing-plans/:planId', async (c) => {
  try {
    const { DB } = c.env;
    const planId = parseInt(c.req.param('planId'));
    
    await DB.prepare('DELETE FROM pricing_plans WHERE id = ?').bind(planId).run();
    
    return c.json({
      success: true,
      message: 'Pricing plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    return c.json({ success: false, error: 'Failed to delete pricing plan' }, 500);
  }
});

/**
 * POST /api/admin/agents/:id/screenshots
 * Add a screenshot to an agent
 */
admin.post('/agents/:id/screenshots', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const { image_url, title, description, display_order } = await c.req.json();
    
    if (!image_url) {
      return c.json({ success: false, error: 'Image URL is required' }, 400);
    }
    
    const result = await DB.prepare(`
      INSERT INTO agent_screenshots (agent_id, image_url, title, description, display_order)
      VALUES (?, ?, ?, ?, ?)
    `).bind(agentId, image_url, title, description, display_order || 0).run();
    
    return c.json({
      success: true,
      message: 'Screenshot added successfully',
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error adding screenshot:', error);
    return c.json({ success: false, error: 'Failed to add screenshot' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:agentId/screenshots/:screenshotId
 * Update a screenshot
 */
admin.put('/agents/:agentId/screenshots/:screenshotId', async (c) => {
  try {
    const { DB } = c.env;
    const screenshotId = parseInt(c.req.param('screenshotId'));
    const { image_url, title, description, display_order } = await c.req.json();
    
    await DB.prepare(`
      UPDATE agent_screenshots 
      SET image_url = COALESCE(?, image_url),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).bind(image_url, title, description, display_order, screenshotId).run();
    
    return c.json({
      success: true,
      message: 'Screenshot updated successfully'
    });
  } catch (error) {
    console.error('Error updating screenshot:', error);
    return c.json({ success: false, error: 'Failed to update screenshot' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:agentId/screenshots/:screenshotId
 * Delete a screenshot
 */
admin.delete('/agents/:agentId/screenshots/:screenshotId', async (c) => {
  try {
    const { DB } = c.env;
    const screenshotId = parseInt(c.req.param('screenshotId'));
    
    await DB.prepare('DELETE FROM agent_screenshots WHERE id = ?').bind(screenshotId).run();
    
    return c.json({
      success: true,
      message: 'Screenshot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    return c.json({ success: false, error: 'Failed to delete screenshot' }, 500);
  }
});

/**
 * POST /api/admin/agents/:id/pros-cons
 * Add a pro or con to an agent
 */
admin.post('/agents/:id/pros-cons', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const { type, content, display_order } = await c.req.json();
    
    if (!type || !content) {
      return c.json({ success: false, error: 'Type and content are required' }, 400);
    }
    
    if (type !== 'PRO' && type !== 'CON') {
      return c.json({ success: false, error: 'Type must be PRO or CON' }, 400);
    }
    
    const result = await DB.prepare(`
      INSERT INTO agent_pros_cons (agent_id, type, content, display_order)
      VALUES (?, ?, ?, ?)
    `).bind(agentId, type, content, display_order || 0).run();
    
    return c.json({
      success: true,
      message: `${type} added successfully`,
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    console.error('Error adding pro/con:', error);
    return c.json({ success: false, error: 'Failed to add pro/con' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:agentId/pros-cons/:id
 * Update a pro or con
 */
admin.put('/agents/:agentId/pros-cons/:id', async (c) => {
  try {
    const { DB } = c.env;
    const id = parseInt(c.req.param('id'));
    const { type, content, display_order } = await c.req.json();
    
    if (type && type !== 'PRO' && type !== 'CON') {
      return c.json({ success: false, error: 'Type must be PRO or CON' }, 400);
    }
    
    await DB.prepare(`
      UPDATE agent_pros_cons 
      SET type = COALESCE(?, type),
          content = COALESCE(?, content),
          display_order = COALESCE(?, display_order)
      WHERE id = ?
    `).bind(type, content, display_order, id).run();
    
    return c.json({
      success: true,
      message: 'Pro/Con updated successfully'
    });
  } catch (error) {
    console.error('Error updating pro/con:', error);
    return c.json({ success: false, error: 'Failed to update pro/con' }, 500);
  }
});

/**
 * DELETE /api/admin/agents/:agentId/pros-cons/:id
 * Delete a pro or con
 */
admin.delete('/agents/:agentId/pros-cons/:id', async (c) => {
  try {
    const { DB } = c.env;
    const id = parseInt(c.req.param('id'));
    
    await DB.prepare('DELETE FROM agent_pros_cons WHERE id = ?').bind(id).run();
    
    return c.json({
      success: true,
      message: 'Pro/Con deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pro/con:', error);
    return c.json({ success: false, error: 'Failed to delete pro/con' }, 500);
  }
});

/**
 * GET /api/admin/agents/:id/comprehensive
 * Get complete agent data including all related tables
 */
admin.get('/agents/:id/comprehensive', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    
    // Get basic agent data
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
    
    // Get features
    const features = await DB.prepare(`
      SELECT * FROM features
      WHERE agent_id = ?
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    // Get use cases
    const useCases = await DB.prepare(`
      SELECT * FROM use_cases
      WHERE agent_id = ?
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    // Get FAQs
    const faqs = await DB.prepare(`
      SELECT * FROM agent_faqs
      WHERE agent_id = ?
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    // Get pricing plans
    const pricingPlans = await DB.prepare(`
      SELECT * FROM pricing_plans
      WHERE agent_id = ?
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    // Get screenshots
    const screenshots = await DB.prepare(`
      SELECT * FROM agent_screenshots
      WHERE agent_id = ?
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    // Get pros
    const pros = await DB.prepare(`
      SELECT * FROM agent_pros_cons
      WHERE agent_id = ? AND type = 'PRO'
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    // Get cons
    const cons = await DB.prepare(`
      SELECT * FROM agent_pros_cons
      WHERE agent_id = ? AND type = 'CON'
      ORDER BY display_order ASC
    `).bind(agentId).all();
    
    return c.json({
      success: true,
      data: {
        ...agent,
        categories: categories.results || [],
        category_ids: (categories.results || []).map((cat: any) => cat.id),
        tags: tags.results || [],
        features: features.results || [],
        use_cases: useCases.results || [],
        faqs: faqs.results || [],
        pricing_plans: pricingPlans.results || [],
        screenshots: screenshots.results || [],
        pros: pros.results || [],
        cons: cons.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching comprehensive agent data:', error);
    return c.json({ success: false, error: 'Failed to fetch agent data' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:id/comprehensive
 * Update complete agent data including all related tables
 */
admin.put('/agents/:id/comprehensive', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const user = c.get('user');
    
    // Check if agent exists
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    // Update main agent table
    await DB.prepare(`
      UPDATE agents SET
        name = ?,
        slug = ?,
        tagline = ?,
        description = ?,
        long_description = ?,
        website_url = ?,
        logo_url = ?,
        cover_image = ?,
        demo_url = ?,
        demo_video_url = ?,
        docs_url = ?,
        pricing_model = ?,
        pricing_starts_at = ?,
        pricing_details = ?,
        free_plan_available = ?,
        free_trial_available = ?,
        free_trial_days = ?,
        has_free_trial = ?,
        is_open_source = ?,
        is_featured = ?,
        submitter_email = ?,
        company_name = ?,
        company_website = ?,
        founded_year = ?,
        company_size = ?,
        headquarters = ?,
        youtube_url = ?,
        video_thumbnail = ?,
        twitter_url = ?,
        linkedin_url = ?,
        facebook_url = ?,
        discord_url = ?,
        github_url = ?,
        api_available = ?,
        api_documentation_url = ?,
        supported_platforms = ?,
        supported_languages = ?,
        supported_integrations = ?,
        alternatives = ?,
        verified = ?,
        trust_score = ?,
        uptime_percentage = ?,
        status = ?,
        featured_tier = ?,
        admin_notes = ?,
        rejection_reason = ?,
        keywords = ?,
        meta_title = ?,
        meta_description = ?,
        last_edited_by = ?,
        last_edited_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.name,
      data.slug,
      data.tagline,
      data.description,
      data.long_description,
      data.website_url,
      data.logo_url,
      data.cover_image,
      data.demo_url || null,
      data.demo_video_url || null,
      data.docs_url || null,
      data.pricing_model,
      data.pricing_starts_at,
      data.pricing_details,
      data.free_plan_available ? 1 : 0,
      data.free_trial_available ? 1 : 0,
      data.free_trial_days,
      data.has_free_trial ? 1 : 0,
      data.is_open_source ? 1 : 0,
      data.is_featured ? 1 : 0,
      data.submitter_email || null,
      data.company_name,
      data.company_website,
      data.founded_year,
      data.company_size,
      data.headquarters,
      data.youtube_url,
      data.video_thumbnail,
      data.twitter_url,
      data.linkedin_url,
      data.facebook_url,
      data.discord_url,
      data.github_url,
      data.api_available ? 1 : 0,
      data.api_documentation_url,
      data.supported_platforms,
      data.supported_languages,
      data.supported_integrations,
      data.alternatives,
      data.verified ? 1 : 0,
      data.trust_score,
      data.uptime_percentage,
      data.status,
      data.featured_tier,
      data.admin_notes,
      data.rejection_reason,
      data.keywords,
      data.meta_title,
      data.meta_description,
      user.id,
      agentId
    ).run();
    
    // Handle categories
    if (data.category_ids && Array.isArray(data.category_ids)) {
      await DB.prepare('DELETE FROM agent_categories WHERE agent_id = ?').bind(agentId).run();
      for (const categoryId of data.category_ids) {
        await DB.prepare('INSERT INTO agent_categories (agent_id, category_id) VALUES (?, ?)')
          .bind(agentId, categoryId).run();
      }
      await updateCategoryCount(DB, ...data.category_ids);
    }
    
    // Handle tags
    if (data.tags_input) {
      const tagNames = data.tags_input.split(',').map((t: string) => t.trim()).filter((t: string) => t);
      await DB.prepare('DELETE FROM agent_tags WHERE agent_id = ?').bind(agentId).run();
      
      for (const tagName of tagNames) {
        let tag = await DB.prepare('SELECT * FROM tags WHERE name = ?').bind(tagName).first();
        if (!tag) {
          const result = await DB.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)')
            .bind(tagName, tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).run();
          tag = { id: result.meta.last_row_id };
        }
        await DB.prepare('INSERT INTO agent_tags (agent_id, tag_id) VALUES (?, ?)')
          .bind(agentId, tag.id).run();
      }
    }
    
    // Handle features
    await DB.prepare('DELETE FROM features WHERE agent_id = ?').bind(agentId).run();
    if (data.features && Array.isArray(data.features)) {
      for (let i = 0; i < data.features.length; i++) {
        const feature = data.features[i];
        await DB.prepare(`
          INSERT INTO features (agent_id, title, description, display_order)
          VALUES (?, ?, ?, ?)
        `).bind(agentId, feature.title, feature.description, i).run();
      }
    }
    
    // Handle use cases
    await DB.prepare('DELETE FROM use_cases WHERE agent_id = ?').bind(agentId).run();
    if (data.use_cases && Array.isArray(data.use_cases)) {
      for (let i = 0; i < data.use_cases.length; i++) {
        const useCase = data.use_cases[i];
        await DB.prepare(`
          INSERT INTO use_cases (agent_id, title, description, display_order)
          VALUES (?, ?, ?, ?)
        `).bind(agentId, useCase.title, useCase.description, i).run();
      }
    }
    
    // Handle FAQs
    await DB.prepare('DELETE FROM agent_faqs WHERE agent_id = ?').bind(agentId).run();
    if (data.faqs && Array.isArray(data.faqs)) {
      for (let i = 0; i < data.faqs.length; i++) {
        const faq = data.faqs[i];
        await DB.prepare(`
          INSERT INTO agent_faqs (agent_id, question, answer, display_order)
          VALUES (?, ?, ?, ?)
        `).bind(agentId, faq.question, faq.answer, i).run();
      }
    }
    
    // Handle pricing plans
    await DB.prepare('DELETE FROM pricing_plans WHERE agent_id = ?').bind(agentId).run();
    if (data.pricing_plans && Array.isArray(data.pricing_plans)) {
      for (let i = 0; i < data.pricing_plans.length; i++) {
        const plan = data.pricing_plans[i];
        await DB.prepare(`
          INSERT INTO pricing_plans (agent_id, name, price, billing_period, features, is_popular, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(agentId, plan.name, plan.price, plan.billing_period, plan.features, plan.is_popular ? 1 : 0, i).run();
      }
    }
    
    // Handle screenshots
    await DB.prepare('DELETE FROM agent_screenshots WHERE agent_id = ?').bind(agentId).run();
    if (data.screenshots && Array.isArray(data.screenshots)) {
      for (let i = 0; i < data.screenshots.length; i++) {
        const ss = data.screenshots[i];
        await DB.prepare(`
          INSERT INTO agent_screenshots (agent_id, image_url, title, description, display_order)
          VALUES (?, ?, ?, ?, ?)
        `).bind(agentId, ss.image_url, ss.title, ss.description, i).run();
      }
    }
    
    // Handle pros and cons
    await DB.prepare('DELETE FROM agent_pros_cons WHERE agent_id = ?').bind(agentId).run();
    if (data.pros && Array.isArray(data.pros)) {
      for (let i = 0; i < data.pros.length; i++) {
        const pro = data.pros[i];
        await DB.prepare(`
          INSERT INTO agent_pros_cons (agent_id, type, content, display_order)
          VALUES (?, 'PRO', ?, ?)
        `).bind(agentId, pro.content, i).run();
      }
    }
    if (data.cons && Array.isArray(data.cons)) {
      for (let i = 0; i < data.cons.length; i++) {
        const con = data.cons[i];
        await DB.prepare(`
          INSERT INTO agent_pros_cons (agent_id, type, content, display_order)
          VALUES (?, 'CON', ?, ?)
        `).bind(agentId, con.content, i).run();
      }
    }
    
    return c.json({
      success: true,
      message: 'Agent updated successfully with all related data'
    });
  } catch (error) {
    console.error('Error updating comprehensive agent data:', error);
    return c.json({ success: false, error: 'Failed to update agent' }, 500);
  }
});

export default admin;
