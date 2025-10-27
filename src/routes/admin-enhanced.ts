import { Hono } from 'hono';
import type { Bindings, Agent, DashboardMetrics } from '../types';
import { requireAdmin, requireModerator } from '../lib/auth';
import { updateCategoryCount, updateTagCount } from '../lib/db';
import { logAuditAction, getAuditLogs } from '../lib/audit';

const adminEnhanced = new Hono<{ Bindings: Bindings }>();

// All admin routes require authentication
adminEnhanced.use('/*', requireModerator);

/**
 * GET /api/admin/dashboard
 * Get comprehensive dashboard metrics
 */
adminEnhanced.get('/dashboard', async (c) => {
  try {
    const { DB } = c.env;
    
    // Calculate date 30 days ago
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
    const date30Str = date30DaysAgo.toISOString().split('T')[0];
    
    const stats = await DB.batch([
      // Total agents count
      DB.prepare('SELECT COUNT(*) as count FROM agents'),
      // Pending agents
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE status = "PENDING"'),
      // Approved agents
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE status = "APPROVED"'),
      // Rejected agents
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE status = "REJECTED"'),
      // 30-day growth
      DB.prepare('SELECT COUNT(*) as count FROM agents WHERE created_at >= ?').bind(date30Str),
      // Total categories
      DB.prepare('SELECT COUNT(*) as count FROM categories WHERE is_active = 1'),
      // Total users
      DB.prepare('SELECT COUNT(*) as count FROM users'),
      // Total reviews
      DB.prepare('SELECT COUNT(*) as count FROM reviews'),
      // Total views
      DB.prepare('SELECT SUM(view_count) as total FROM agents'),
      // Total upvotes
      DB.prepare('SELECT COUNT(*) as count FROM upvotes'),
      // Total clicks
      DB.prepare('SELECT SUM(click_count) as total FROM agents'),
      // Total sponsorship revenue
      DB.prepare('SELECT SUM(amount_paid) as total FROM sponsorships WHERE is_paid = 1')
    ]);
    
    const metrics: DashboardMetrics = {
      total_agents: stats[0].results[0].count || 0,
      pending_agents: stats[1].results[0].count || 0,
      approved_agents: stats[2].results[0].count || 0,
      rejected_agents: stats[3].results[0].count || 0,
      agents_growth_30d: stats[4].results[0].count || 0,
      total_categories: stats[5].results[0].count || 0,
      total_users: stats[6].results[0].count || 0,
      total_reviews: stats[7].results[0].count || 0,
      total_views: stats[8].results[0].total || 0,
      total_upvotes: stats[9].results[0].count || 0,
      total_clicks: stats[10].results[0].total || 0,
      total_sponsorship_revenue: stats[11].results[0].total || 0
    };
    
    // Get recent submissions
    const recentSubmissions = await DB.prepare(`
      SELECT 
        a.id, a.name, a.slug, a.status, a.submitted_at,
        u.name as submitter_name
      FROM agents a
      LEFT JOIN users u ON a.submitted_by_id = u.id
      ORDER BY a.submitted_at DESC
      LIMIT 10
    `).all();
    
    // Get top categories by agent count
    const topCategories = await DB.prepare(`
      SELECT 
        c.name, c.slug, c.icon, c.agent_count
      FROM categories c
      WHERE c.is_active = 1
      ORDER BY c.agent_count DESC
      LIMIT 10
    `).all();
    
    return c.json({
      success: true,
      data: {
        metrics,
        recent_submissions: recentSubmissions.results || [],
        top_categories: topCategories.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return c.json({ success: false, error: 'Failed to fetch dashboard' }, 500);
  }
});

/**
 * GET /api/admin/agents/all
 * Get all agents with filters and pagination
 */
adminEnhanced.get('/agents/all', async (c) => {
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
 * POST /api/admin/agents/bulk-action
 * Perform bulk actions on multiple agents
 */
adminEnhanced.post('/agents/bulk-action', async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const { agent_ids, action, rejection_reason } = await c.req.json();
    
    if (!agent_ids || !Array.isArray(agent_ids) || agent_ids.length === 0) {
      return c.json({ success: false, error: 'Invalid agent_ids' }, 400);
    }
    
    if (!['approve', 'reject', 'delete'].includes(action)) {
      return c.json({ success: false, error: 'Invalid action' }, 400);
    }
    
    // Only admins can delete
    if (action === 'delete' && user.role !== 'ADMIN') {
      return c.json({ success: false, error: 'Only admins can delete agents' }, 403);
    }
    
    const placeholders = agent_ids.map(() => '?').join(',');
    let successCount = 0;
    
    if (action === 'approve') {
      const result = await DB.prepare(`
        UPDATE agents 
        SET status = 'APPROVED',
            approved_at = CURRENT_TIMESTAMP,
            approved_by_id = ?
        WHERE id IN (${placeholders}) AND status = 'PENDING'
      `).bind(user.id, ...agent_ids).run();
      
      successCount = result.meta.changes || 0;
      
      // Update category/tag counts for approved agents
      const agentCategories = await DB.prepare(`
        SELECT DISTINCT category_id FROM agent_categories WHERE agent_id IN (${placeholders})
      `).bind(...agent_ids).all();
      
      for (const ac of agentCategories.results || []) {
        await updateCategoryCount(DB, ac.category_id);
      }
      
      const agentTags = await DB.prepare(`
        SELECT DISTINCT tag_id FROM agent_tags WHERE agent_id IN (${placeholders})
      `).bind(...agent_ids).all();
      
      for (const at of agentTags.results || []) {
        await updateTagCount(DB, at.tag_id);
      }
      
      // Log audit action
      await logAuditAction(DB, user, 'BULK_APPROVE', 'agent', undefined, {
        agent_ids,
        count: successCount
      });
      
    } else if (action === 'reject') {
      const result = await DB.prepare(`
        UPDATE agents 
        SET status = 'REJECTED',
            approved_at = CURRENT_TIMESTAMP,
            approved_by_id = ?,
            rejection_reason = ?
        WHERE id IN (${placeholders}) AND status = 'PENDING'
      `).bind(user.id, rejection_reason || 'Bulk rejection', ...agent_ids).run();
      
      successCount = result.meta.changes || 0;
      
      // Log audit action
      await logAuditAction(DB, user, 'BULK_REJECT', 'agent', undefined, {
        agent_ids,
        count: successCount,
        reason: rejection_reason
      });
      
    } else if (action === 'delete') {
      const result = await DB.prepare(`
        DELETE FROM agents WHERE id IN (${placeholders})
      `).bind(...agent_ids).run();
      
      successCount = result.meta.changes || 0;
      
      // Log audit action
      await logAuditAction(DB, user, 'BULK_DELETE', 'agent', undefined, {
        agent_ids,
        count: successCount
      });
    }
    
    return c.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      data: { affected_count: successCount }
    });
  } catch (error) {
    console.error('Error in bulk action:', error);
    return c.json({ success: false, error: 'Bulk action failed' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:id/approve-with-edits
 * Approve agent with admin edits
 */
adminEnhanced.put('/agents/:id/approve-with-edits', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const user = c.get('user');
    const updates = await c.req.json();
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    if (agent.status !== 'PENDING') {
      return c.json({ success: false, error: 'Agent is not pending' }, 400);
    }
    
    // Update agent with edits and approve
    await DB.prepare(`
      UPDATE agents 
      SET name = ?,
          tagline = ?,
          description = ?,
          website_url = ?,
          pricing_model = ?,
          is_open_source = ?,
          featured_tier = ?,
          meta_title = ?,
          meta_description = ?,
          keywords = ?,
          status = 'APPROVED',
          approved_at = CURRENT_TIMESTAMP,
          approved_by_id = ?,
          last_edited_by = ?,
          last_edited_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      updates.name || agent.name,
      updates.tagline || agent.tagline,
      updates.description || agent.description,
      updates.website_url || agent.website_url,
      updates.pricing_model || agent.pricing_model,
      updates.is_open_source !== undefined ? (updates.is_open_source ? 1 : 0) : agent.is_open_source,
      updates.featured_tier || agent.featured_tier,
      updates.meta_title || agent.meta_title,
      updates.meta_description || agent.meta_description,
      updates.keywords || agent.keywords,
      user.id,
      user.id,
      agentId
    ).run();
    
    // Handle category updates
    if (updates.category_ids && Array.isArray(updates.category_ids)) {
      // Remove existing categories
      await DB.prepare('DELETE FROM agent_categories WHERE agent_id = ?')
        .bind(agentId)
        .run();
      
      // Add new categories
      for (const catId of updates.category_ids) {
        await DB.prepare(
          'INSERT INTO agent_categories (agent_id, category_id) VALUES (?, ?)'
        ).bind(agentId, catId).run();
        
        await updateCategoryCount(DB, catId);
      }
    }
    
    // Handle tag updates
    if (updates.tag_ids && Array.isArray(updates.tag_ids)) {
      // Remove existing tags
      await DB.prepare('DELETE FROM agent_tags WHERE agent_id = ?')
        .bind(agentId)
        .run();
      
      // Add new tags
      for (const tagId of updates.tag_ids) {
        await DB.prepare(
          'INSERT INTO agent_tags (agent_id, tag_id) VALUES (?, ?)'
        ).bind(agentId, tagId).run();
        
        await updateTagCount(DB, tagId);
      }
    }
    
    // Log audit action
    await logAuditAction(DB, user, 'APPROVE_WITH_EDITS', 'agent', agentId, {
      changes: updates
    });
    
    return c.json({
      success: true,
      message: 'Agent approved with edits successfully'
    });
  } catch (error) {
    console.error('Error approving with edits:', error);
    return c.json({ success: false, error: 'Failed to approve agent' }, 500);
  }
});

/**
 * PUT /api/admin/agents/:id/reject-with-reason
 * Reject agent with detailed reason
 */
adminEnhanced.put('/agents/:id/reject-with-reason', async (c) => {
  try {
    const { DB } = c.env;
    const agentId = parseInt(c.req.param('id'));
    const user = c.get('user');
    const { reason, admin_notes } = await c.req.json();
    
    if (!reason) {
      return c.json({ success: false, error: 'Rejection reason is required' }, 400);
    }
    
    const agent = await DB.prepare('SELECT * FROM agents WHERE id = ?')
      .bind(agentId)
      .first<Agent>();
    
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    await DB.prepare(`
      UPDATE agents 
      SET status = 'REJECTED',
          approved_at = CURRENT_TIMESTAMP,
          approved_by_id = ?,
          rejection_reason = ?,
          admin_notes = ?
      WHERE id = ?
    `).bind(user.id, reason, admin_notes || null, agentId).run();
    
    // Log audit action
    await logAuditAction(DB, user, 'REJECT_WITH_REASON', 'agent', agentId, {
      reason,
      admin_notes
    });
    
    return c.json({
      success: true,
      message: 'Agent rejected with reason'
    });
  } catch (error) {
    console.error('Error rejecting agent:', error);
    return c.json({ success: false, error: 'Failed to reject agent' }, 500);
  }
});

/**
 * GET /api/admin/analytics
 * Get analytics data for charts
 */
adminEnhanced.get('/analytics', async (c) => {
  try {
    const { DB } = c.env;
    const days = parseInt(c.req.query('days') || '30');
    
    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Top categories by agent count
    const topCategories = await DB.prepare(`
      SELECT name, agent_count as count
      FROM categories
      WHERE is_active = 1
      ORDER BY agent_count DESC
      LIMIT 10
    `).all();
    
    // Pricing model distribution
    const pricingDist = await DB.prepare(`
      SELECT pricing_model as model, COUNT(*) as count
      FROM agents
      WHERE status = 'APPROVED'
      GROUP BY pricing_model
    `).all();
    
    // Recent growth trend (simple version - by submission date)
    const growthTrend = await DB.prepare(`
      SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as count
      FROM agents
      WHERE submitted_at >= ?
      GROUP BY DATE(submitted_at)
      ORDER BY date ASC
    `).bind(startDateStr).all();
    
    return c.json({
      success: true,
      data: {
        top_categories: topCategories.results || [],
        pricing_distribution: pricingDist.results || [],
        growth_trend: growthTrend.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ success: false, error: 'Failed to fetch analytics' }, 500);
  }
});

/**
 * GET /api/admin/audit-logs
 * Get audit logs with pagination
 */
adminEnhanced.get('/audit-logs', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const userId = c.req.query('user_id') ? parseInt(c.req.query('user_id')) : undefined;
    const entityType = c.req.query('entity_type');
    const action = c.req.query('action');
    
    const result = await getAuditLogs(DB, page, limit, {
      userId,
      entityType,
      action
    });
    
    return c.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return c.json({ success: false, error: 'Failed to fetch audit logs' }, 500);
  }
});

/**
 * GET /api/admin/users/all
 * Get all users with pagination
 */
adminEnhanced.get('/users/all', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const search = c.req.query('search');
    const role = c.req.query('role');
    
    const offset = (page - 1) * limit;
    
    let whereConditions = ['1=1'];
    let params: any[] = [];
    
    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (role) {
      whereConditions.push('role = ?');
      params.push(role);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Get total count
    const countResult = await DB.prepare(`
      SELECT COUNT(*) as count FROM users WHERE ${whereClause}
    `).bind(...params).first<{ count: number }>();
    
    const total = countResult?.count || 0;
    
    // Get users with their stats
    const users = await DB.prepare(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM agents WHERE submitted_by_id = u.id) as agents_count,
        (SELECT COUNT(*) FROM upvotes WHERE user_id = u.id) as upvotes_count,
        (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as reviews_count
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
 * PUT /api/admin/users/:id/role
 * Update user role
 */
adminEnhanced.put('/users/:id/role', requireAdmin, async (c) => {
  try {
    const { DB } = c.env;
    const userId = parseInt(c.req.param('id'));
    const user = c.get('user');
    const { role } = await c.req.json();
    
    if (!['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return c.json({ success: false, error: 'Invalid role' }, 400);
    }
    
    // Don't allow users to change their own role
    if (userId === user.id) {
      return c.json({ success: false, error: 'Cannot change your own role' }, 400);
    }
    
    await DB.prepare('UPDATE users SET role = ? WHERE id = ?')
      .bind(role, userId)
      .run();
    
    // Log audit action
    await logAuditAction(DB, user, 'UPDATE_USER_ROLE', 'user', userId, {
      new_role: role
    });
    
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
 * POST /api/admin/categories/reorder
 * Reorder categories
 */
adminEnhanced.post('/categories/reorder', async (c) => {
  try {
    const { DB } = c.env;
    const user = c.get('user');
    const { category_orders } = await c.req.json();
    
    if (!Array.isArray(category_orders)) {
      return c.json({ success: false, error: 'Invalid data format' }, 400);
    }
    
    // Update display order for each category
    for (const item of category_orders) {
      await DB.prepare('UPDATE categories SET display_order = ? WHERE id = ?')
        .bind(item.display_order, item.id)
        .run();
    }
    
    // Log audit action
    await logAuditAction(DB, user, 'REORDER_CATEGORIES', 'category', undefined, {
      category_orders
    });
    
    return c.json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    return c.json({ success: false, error: 'Failed to reorder categories' }, 500);
  }
});

// Create new agent (admin only)
adminEnhanced.post('/agents/create', requireAdmin, async (c) => {
  try {
    const user = c.get('user');
    const DB = c.env.DB;
    const data = await c.req.json();
    
    // Generate slug if not provided
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Insert new agent
    const result = await DB.prepare(`
      INSERT INTO agents (
        name, slug, tagline, description, website_url, logo_url, demo_url, docs_url,
        pricing_model, pricing_details, is_open_source, has_free_trial,
        category_id, tags, features, status, admin_notes, rejection_reason,
        is_featured, submitter_email, submitted_by_id, last_edited_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      slug,
      data.tagline,
      data.description,
      data.website_url,
      data.logo_url || null,
      data.demo_url || null,
      data.docs_url || null,
      data.pricing_model,
      data.pricing_details || null,
      data.is_open_source ? 1 : 0,
      data.has_free_trial ? 1 : 0,
      data.category_id,
      data.tags || null,
      data.features || null,
      data.status || 'PENDING',
      data.admin_notes || null,
      data.rejection_reason || null,
      data.is_featured ? 1 : 0,
      data.submitter_email || null,
      user.id,
      user.id
    ).run();
    
    const agentId = result.meta.last_row_id;
    
    // Log audit action
    await logAuditAction(DB, user, 'CREATE_AGENT', 'agent', agentId, {
      name: data.name,
      status: data.status || 'PENDING'
    });
    
    return c.json({
      success: true,
      message: 'Agent created successfully',
      data: { id: agentId, slug }
    });
  } catch (error: any) {
    console.error('Error creating agent:', error);
    return c.json({ success: false, error: error.message || 'Failed to create agent' }, 500);
  }
});

// Update agent (admin only)
adminEnhanced.put('/agents/:id', requireAdmin, async (c) => {
  try {
    const user = c.get('user');
    const DB = c.env.DB;
    const agentId = c.req.param('id');
    const data = await c.req.json();
    
    // Update agent
    await DB.prepare(`
      UPDATE agents SET
        name = ?,
        slug = ?,
        tagline = ?,
        description = ?,
        website_url = ?,
        logo_url = ?,
        demo_url = ?,
        docs_url = ?,
        pricing_model = ?,
        pricing_details = ?,
        is_open_source = ?,
        has_free_trial = ?,
        category_id = ?,
        tags = ?,
        features = ?,
        status = ?,
        admin_notes = ?,
        rejection_reason = ?,
        is_featured = ?,
        submitter_email = ?,
        last_edited_by = ?,
        last_edited_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.name,
      data.slug,
      data.tagline,
      data.description,
      data.website_url,
      data.logo_url || null,
      data.demo_url || null,
      data.docs_url || null,
      data.pricing_model,
      data.pricing_details || null,
      data.is_open_source ? 1 : 0,
      data.has_free_trial ? 1 : 0,
      data.category_id,
      data.tags || null,
      data.features || null,
      data.status,
      data.admin_notes || null,
      data.rejection_reason || null,
      data.is_featured ? 1 : 0,
      data.submitter_email || null,
      user.id,
      agentId
    ).run();
    
    // Log audit action
    await logAuditAction(DB, user, 'UPDATE_AGENT', 'agent', parseInt(agentId), {
      name: data.name,
      status: data.status
    });
    
    return c.json({
      success: true,
      message: 'Agent updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating agent:', error);
    return c.json({ success: false, error: error.message || 'Failed to update agent' }, 500);
  }
});

// Get single agent details (admin only)
adminEnhanced.get('/agents/:id', async (c) => {
  try {
    const DB = c.env.DB;
    const agentId = c.req.param('id');
    
    const result = await DB.prepare(`
      SELECT 
        a.*,
        c.name as category_name,
        u.username as submitter_name,
        e.username as editor_name
      FROM agents a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.submitted_by_id = u.id
      LEFT JOIN users e ON a.last_edited_by = e.id
      WHERE a.id = ?
    `).bind(agentId).first();
    
    if (!result) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }
    
    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return c.json({ success: false, error: 'Failed to fetch agent' }, 500);
  }
});

export default adminEnhanced;
