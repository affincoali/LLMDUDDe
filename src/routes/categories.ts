import { Hono } from 'hono';
import type { Bindings, Category } from '../types';

const categories = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/categories
 * List all categories with agent counts and growth
 */
categories.get('/', async (c) => {
  try {
    const { DB } = c.env;
    const parent_id = c.req.query('parent_id');
    const slug = c.req.query('slug');
    
    let query = `
      SELECT 
        c.*,
        COUNT(DISTINCT ac.agent_id) as agent_count,
        (
          SELECT COUNT(*) 
          FROM agent_categories ac2 
          JOIN agents a2 ON ac2.agent_id = a2.id 
          WHERE ac2.category_id = c.id 
            AND a2.status = 'APPROVED'
            AND a2.created_at >= date('now', '-30 days')
        ) as growth_30d
      FROM categories c
      LEFT JOIN agent_categories ac ON c.id = ac.category_id
      LEFT JOIN agents a ON ac.agent_id = a.id AND a.status = 'APPROVED'
      WHERE c.is_active = 1
    `;
    
    let params: any[] = [];
    
    if (slug) {
      query += ' AND c.slug = ?';
      params.push(slug);
    } else if (parent_id) {
      query += ' AND c.parent_id = ?';
      params.push(parent_id);
    } else {
      query += ' AND c.parent_id IS NULL';
    }
    
    query += ' GROUP BY c.id ORDER BY agent_count DESC, c.display_order ASC, c.name ASC';
    
    const result = await DB.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500);
  }
});

/**
 * GET /api/categories/:slug
 * Get single category by slug with agents
 */
categories.get('/:slug', async (c) => {
  try {
    const { DB } = c.env;
    const slug = c.req.param('slug');
    
    const category = await DB.prepare(
      'SELECT * FROM categories WHERE slug = ? AND is_active = 1'
    ).bind(slug).first<Category>();
    
    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    // Get subcategories
    const subcategories = await DB.prepare(
      'SELECT * FROM categories WHERE parent_id = ? AND is_active = 1 ORDER BY display_order ASC'
    ).bind(category.id).all<Category>();
    
    // Get agents in this category
    const agents = await DB.prepare(`
      SELECT DISTINCT a.*
      FROM agents a
      INNER JOIN agent_categories ac ON a.id = ac.agent_id
      WHERE ac.category_id = ? AND a.status = 'APPROVED'
      ORDER BY a.upvote_count DESC, a.view_count DESC, a.created_at DESC
    `).bind(category.id).all();
    
    return c.json({
      success: true,
      data: {
        ...category,
        subcategories: subcategories.results || [],
        agents: agents.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({ success: false, error: 'Failed to fetch category' }, 500);
  }
});

export default categories;
