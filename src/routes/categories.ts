import { Hono } from 'hono';
import type { Bindings, Category } from '../types';

const categories = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/categories
 * List all categories
 */
categories.get('/', async (c) => {
  try {
    const { DB } = c.env;
    const parent_id = c.req.query('parent_id');
    
    let query = 'SELECT * FROM categories WHERE is_active = 1';
    let params: any[] = [];
    
    if (parent_id) {
      query += ' AND parent_id = ?';
      params.push(parent_id);
    } else {
      query += ' AND parent_id IS NULL';
    }
    
    query += ' ORDER BY display_order ASC, name ASC';
    
    const result = await DB.prepare(query).bind(...params).all<Category>();
    
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
 * Get single category by slug
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
    
    return c.json({
      success: true,
      data: {
        ...category,
        subcategories: subcategories.results || []
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({ success: false, error: 'Failed to fetch category' }, 500);
  }
});

export default categories;
