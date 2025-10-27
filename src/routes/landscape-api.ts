import { Hono } from 'hono';
import type { Bindings } from '../types';

const landscapeApi = new Hono<{ Bindings: Bindings }>();

// GET /api/landscape/data - Get formatted data for visualization
landscapeApi.get('/data', async (c) => {
  try {
    const DB = c.env.DB;
    
    // Get categories with agent counts
    const categoriesQuery = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.icon,
        c.description,
        c.parent_id,
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
      GROUP BY c.id
      ORDER BY agent_count DESC
    `;
    
    const categoriesResult = await DB.prepare(categoriesQuery).all();
    const categories = categoriesResult.results || [];
    
    // Format nodes for visualization
    const nodes = categories.map((cat: any, index: number) => {
      const agentCount = cat.agent_count || 0;
      const growth = cat.growth_30d || 0;
      
      // Calculate node size based on agent count (min 40, max 120)
      const size = Math.min(Math.max(40 + (agentCount * 2), 40), 120);
      
      // Assign colors based on category groups (you can customize this)
      const colorGroups = [
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#f59e0b', // amber
        '#10b981', // green
        '#3b82f6', // blue
        '#ef4444', // red
        '#06b6d4', // cyan
        '#f97316', // orange
      ];
      const color = colorGroups[index % colorGroups.length];
      
      return {
        id: cat.slug,
        name: cat.name,
        icon: cat.icon || '📁',
        agentCount,
        growth30d: growth,
        size,
        color,
        parent: cat.parent_id,
        description: cat.description
      };
    });
    
    // Create edges (connections between parent and child categories)
    const edges = categories
      .filter((cat: any) => cat.parent_id)
      .map((cat: any) => {
        const parent = categories.find((c: any) => c.id === cat.parent_id);
        return {
          source: parent?.slug,
          target: cat.slug
        };
      })
      .filter(edge => edge.source && edge.target);
    
    return c.json({
      success: true,
      data: {
        nodes,
        edges,
        stats: {
          totalCategories: categories.length,
          totalAgents: categories.reduce((sum: number, cat: any) => sum + (cat.agent_count || 0), 0),
          avgAgentsPerCategory: Math.round(
            categories.reduce((sum: number, cat: any) => sum + (cat.agent_count || 0), 0) / categories.length
          )
        }
      }
    });
  } catch (error) {
    console.error('Error fetching landscape data:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch landscape data'
    }, 500);
  }
});

// GET /api/landscape/category/:slug - Get agents for a specific category
landscapeApi.get('/category/:slug', async (c) => {
  try {
    const DB = c.env.DB;
    const slug = c.req.param('slug');
    
    const query = `
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.logo_url,
        a.tagline,
        a.pricing_model,
        a.view_count,
        a.upvote_count,
        a.is_open_source
      FROM agents a
      JOIN agent_categories ac ON a.id = ac.agent_id
      JOIN categories c ON ac.category_id = c.id
      WHERE c.slug = ? AND a.status = 'APPROVED'
      ORDER BY a.view_count DESC
      LIMIT 20
    `;
    
    const result = await DB.prepare(query).bind(slug).all();
    
    return c.json({
      success: true,
      data: result.results || []
    });
  } catch (error) {
    console.error('Error fetching category agents:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch category agents'
    }, 500);
  }
});

export default landscapeApi;
