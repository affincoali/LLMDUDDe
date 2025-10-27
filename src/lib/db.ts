import type { D1Database } from '@cloudflare/workers-types';
import type { Agent, Category, Tag, User, AgentWithRelations } from '../types';

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get paginated results with total count
 */
export async function paginate<T>(
  db: D1Database,
  query: string,
  countQuery: string,
  params: any[],
  page: number = 1,
  limit: number = 20
) {
  const offset = (page - 1) * limit;
  
  // Get total count
  const countResult = await db.prepare(countQuery).bind(...params).first<{ count: number }>();
  const total = countResult?.count || 0;
  
  // Get paginated results
  const results = await db.prepare(query + ' LIMIT ? OFFSET ?')
    .bind(...params, limit, offset)
    .all<T>();
  
  return {
    data: results.results || [],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get agent with all relations
 */
export async function getAgentWithRelations(
  db: D1Database,
  agentId: number,
  userId?: number
): Promise<AgentWithRelations | null> {
  // Get agent
  const agent = await db.prepare('SELECT * FROM agents WHERE id = ?')
    .bind(agentId)
    .first<Agent>();
  
  if (!agent) return null;
  
  // Get categories
  const categories = await db.prepare(`
    SELECT c.* FROM categories c
    INNER JOIN agent_categories ac ON c.id = ac.category_id
    WHERE ac.agent_id = ?
  `).bind(agentId).all<Category>();
  
  // Get tags
  const tags = await db.prepare(`
    SELECT t.* FROM tags t
    INNER JOIN agent_tags at ON t.id = at.tag_id
    WHERE at.agent_id = ?
  `).bind(agentId).all<Tag>();
  
  // Get features
  const features = await db.prepare(
    'SELECT * FROM features WHERE agent_id = ? ORDER BY display_order'
  ).bind(agentId).all();
  
  // Get use cases
  const use_cases = await db.prepare(
    'SELECT * FROM use_cases WHERE agent_id = ? ORDER BY display_order'
  ).bind(agentId).all();
  
  // Get submitter
  const submitter = await db.prepare(
    'SELECT id, name, email, image FROM users WHERE id = ?'
  ).bind(agent.submitted_by_id).first<User>();
  
  // Get average rating
  const ratingResult = await db.prepare(`
    SELECT AVG(rating) as avg_rating FROM reviews 
    WHERE agent_id = ? AND status = 'APPROVED'
  `).bind(agentId).first<{ avg_rating: number }>();
  
  // Check if user upvoted
  let user_upvoted = false;
  if (userId) {
    const upvote = await db.prepare(
      'SELECT id FROM upvotes WHERE user_id = ? AND agent_id = ?'
    ).bind(userId, agentId).first();
    user_upvoted = !!upvote;
  }
  
  return {
    ...agent,
    categories: categories.results || [],
    tags: tags.results || [],
    features: features.results || [],
    use_cases: use_cases.results || [],
    submitter: submitter || undefined,
    average_rating: ratingResult?.avg_rating || 0,
    user_upvoted
  };
}

/**
 * Increment agent view count
 */
export async function incrementViewCount(db: D1Database, agentId: number) {
  await db.prepare(
    'UPDATE agents SET view_count = view_count + 1 WHERE id = ?'
  ).bind(agentId).run();
}

/**
 * Increment agent click count
 */
export async function incrementClickCount(db: D1Database, agentId: number) {
  await db.prepare(
    'UPDATE agents SET click_count = click_count + 1 WHERE id = ?'
  ).bind(agentId).run();
}

/**
 * Update agent upvote count
 */
export async function updateUpvoteCount(db: D1Database, agentId: number) {
  const result = await db.prepare(
    'SELECT COUNT(*) as count FROM upvotes WHERE agent_id = ?'
  ).bind(agentId).first<{ count: number }>();
  
  await db.prepare(
    'UPDATE agents SET upvote_count = ? WHERE id = ?'
  ).bind(result?.count || 0, agentId).run();
}

/**
 * Update agent review count and recalculate average
 */
export async function updateReviewStats(db: D1Database, agentId: number) {
  const result = await db.prepare(
    'SELECT COUNT(*) as count FROM reviews WHERE agent_id = ? AND status = "APPROVED"'
  ).bind(agentId).first<{ count: number }>();
  
  await db.prepare(
    'UPDATE agents SET review_count = ? WHERE id = ?'
  ).bind(result?.count || 0, agentId).run();
}

/**
 * Update category agent count
 */
export async function updateCategoryCount(db: D1Database, ...categoryIds: number[]) {
  for (const categoryId of categoryIds) {
    const result = await db.prepare(`
      SELECT COUNT(DISTINCT ac.agent_id) as count 
      FROM agent_categories ac
      INNER JOIN agents a ON ac.agent_id = a.id
      WHERE ac.category_id = ? AND a.status = 'APPROVED'
    `).bind(categoryId).first<{ count: number }>();
    
    await db.prepare(
      'UPDATE categories SET agent_count = ? WHERE id = ?'
    ).bind(result?.count || 0, categoryId).run();
  }
}

/**
 * Update tag agent count
 */
export async function updateTagCount(db: D1Database, ...tagIds: number[]) {
  for (const tagId of tagIds) {
    const result = await db.prepare(`
      SELECT COUNT(DISTINCT at.agent_id) as count 
      FROM agent_tags at
      INNER JOIN agents a ON at.agent_id = a.id
      WHERE at.tag_id = ? AND a.status = 'APPROVED'
    `).bind(tagId).first<{ count: number }>();
    
    await db.prepare(
      'UPDATE tags SET agent_count = ? WHERE id = ?'
    ).bind(result?.count || 0, tagId).run();
  }
}
