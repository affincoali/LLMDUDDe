import { Hono } from 'hono';
import type { Bindings, User } from '../types';
import { generateToken, hashPassword, verifyPassword } from '../lib/auth';

const auth = new Hono<{ Bindings: Bindings }>();

/**
 * POST /api/auth/register
 * Register a new user
 */
auth.post('/register', async (c) => {
  try {
    const { email, name, password } = await c.req.json();
    
    if (!email || !name || !password) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const { DB } = c.env;
    
    // Check if user exists
    const existingUser = await DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (existingUser) {
      return c.json({ success: false, error: 'Email already registered' }, 400);
    }
    
    // Hash password
    const password_hash = await hashPassword(password);
    
    // Create user
    const result = await DB.prepare(`
      INSERT INTO users (email, name, password_hash, role, email_verified)
      VALUES (?, ?, ?, 'USER', 0)
    `).bind(email, name, password_hash).run();
    
    if (!result.success) {
      return c.json({ success: false, error: 'Failed to create user' }, 500);
    }
    
    // Fetch created user
    const user = await DB.prepare(
      'SELECT id, email, name, role FROM users WHERE id = ?'
    ).bind(result.meta.last_row_id).first<User>();
    
    if (!user) {
      return c.json({ success: false, error: 'User creation failed' }, 500);
    }
    
    // Generate token
    const token = await generateToken(user);
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, error: 'Registration failed' }, 500);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, error: 'Missing email or password' }, 400);
    }
    
    const { DB } = c.env;
    
    // Fetch user
    const user = await DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first<User>();
    
    if (!user) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    if (user.password_hash) {
      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) {
        return c.json({ success: false, error: 'Invalid credentials' }, 401);
      }
    } else {
      // For demo users without password hash, check if password matches email prefix
      // This is just for demo purposes - admin@example.com with password "admin123"
      const expectedPassword = email.split('@')[0] + '123';
      if (password !== expectedPassword) {
        return c.json({ success: false, error: 'Invalid credentials' }, 401);
      }
    }
    
    // Generate token
    const token = await generateToken(user);
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: 'Login failed' }, 500);
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.substring(7);
    const { verify } = await import('hono/jwt');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const payload = await verify(token, JWT_SECRET);
    const { DB } = c.env;
    
    const user = await DB.prepare(
      'SELECT id, email, name, role, image, created_at FROM users WHERE id = ?'
    ).bind(payload.sub).first<User>();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
});

export default auth;
