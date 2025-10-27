import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import type { JWTPayload, User, Bindings } from '../types';

// JWT secret - in production this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Generate JWT token for user
 */
export async function generateToken(user: User): Promise<string> {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  };
  
  return await sign(payload, JWT_SECRET);
}

/**
 * Verify JWT token and return payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Get current user from request
 */
export async function getCurrentUser(c: Context<{ Bindings: Bindings }>): Promise<User | null> {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const payload = await verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  // Fetch user from database
  const { DB } = c.env;
  const result = await DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(payload.sub).first<User>();
  
  return result || null;
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(c: Context<{ Bindings: Bindings }>, next: Function) {
  const user = await getCurrentUser(c);
  
  if (!user) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  // Attach user to context
  c.set('user', user);
  await next();
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(c: Context<{ Bindings: Bindings }>, next: Function) {
  const user = await getCurrentUser(c);
  
  if (!user || user.role !== 'ADMIN') {
    return c.json({ success: false, error: 'Forbidden - Admin access required' }, 403);
  }
  
  c.set('user', user);
  await next();
}

/**
 * Middleware to require moderator or admin role
 */
export async function requireModerator(c: Context<{ Bindings: Bindings }>, next: Function) {
  const user = await getCurrentUser(c);
  
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    return c.json({ success: false, error: 'Forbidden - Moderator access required' }, 403);
  }
  
  c.set('user', user);
  await next();
}

/**
 * Simple password hashing (for demo - in production use proper hashing)
 * Note: bcrypt doesn't work in Cloudflare Workers, so we use Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
