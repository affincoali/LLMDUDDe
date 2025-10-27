import type { D1Database } from '@cloudflare/workers-types';
import type { User } from '../types';

/**
 * Log an admin action to the audit log
 */
export async function logAuditAction(
  db: D1Database,
  user: User,
  action: string,
  entityType: string,
  entityId?: number,
  details?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const detailsJson = details ? JSON.stringify(details) : null;
    
    await db.prepare(`
      INSERT INTO audit_logs (
        user_id, action, entity_type, entity_id, details, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      action,
      entityType,
      entityId || null,
      detailsJson,
      ipAddress || null,
      userAgent || null
    ).run();
  } catch (error) {
    console.error('Failed to log audit action:', error);
    // Don't throw - audit log failure shouldn't break main functionality
  }
}

/**
 * Get recent audit logs with pagination
 */
export async function getAuditLogs(
  db: D1Database,
  page: number = 1,
  limit: number = 50,
  filters?: {
    userId?: number;
    entityType?: string;
    action?: string;
  }
) {
  const offset = (page - 1) * limit;
  let whereConditions = ['1=1'];
  let params: any[] = [];
  
  if (filters?.userId) {
    whereConditions.push('al.user_id = ?');
    params.push(filters.userId);
  }
  
  if (filters?.entityType) {
    whereConditions.push('al.entity_type = ?');
    params.push(filters.entityType);
  }
  
  if (filters?.action) {
    whereConditions.push('al.action = ?');
    params.push(filters.action);
  }
  
  const whereClause = whereConditions.join(' AND ');
  
  // Get total count
  const countResult = await db.prepare(`
    SELECT COUNT(*) as count FROM audit_logs al
    WHERE ${whereClause}
  `).bind(...params).first<{ count: number }>();
  
  const total = countResult?.count || 0;
  
  // Get logs with user info
  const logs = await db.prepare(`
    SELECT 
      al.*,
      u.name as user_name,
      u.email as user_email,
      u.role as user_role
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(...params, limit, offset).all();
  
  return {
    data: logs.results || [],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
