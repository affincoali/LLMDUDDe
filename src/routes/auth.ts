import { Hono } from 'hono';
import type { Bindings, User } from '../types';
import { generateToken, hashPassword, verifyPassword } from '../lib/auth';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, validateData } from '../lib/validation';
import { sendEmail, getWelcomeEmail, getPasswordResetEmail } from '../lib/email';

const auth = new Hono<{ Bindings: Bindings }>();

/**
 * POST /api/auth/register
 * Register a new user
 */
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate with Zod schema
    const validation = validateData(signupSchema, body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      }, 400);
    }
    
    const { email, name, password } = validation.data!;
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
    
    // Send welcome email (if Resend API key is configured)
    const resendApiKey = c.env.RESEND_API_KEY;
    if (resendApiKey) {
      await sendEmail(resendApiKey, {
        to: email,
        subject: 'Welcome to AI Agents Directory!',
        html: getWelcomeEmail(name)
      }).catch(err => console.error('Welcome email failed:', err));
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

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
auth.post('/forgot-password', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate with Zod schema
    const validation = validateData(forgotPasswordSchema, body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      }, 400);
    }
    
    const { email } = validation.data!;
    const { DB } = c.env;
    
    // Check if user exists
    const user = await DB.prepare(
      'SELECT id, email, name FROM users WHERE email = ?'
    ).bind(email).first<User>();
    
    // Always return success to prevent email enumeration
    if (!user) {
      return c.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }
    
    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    
    // Store reset token in database
    await DB.prepare(`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `).bind(user.id, resetToken, expiresAt).run();
    
    // Send password reset email (if Resend API key is configured)
    const resendApiKey = c.env.RESEND_API_KEY;
    if (resendApiKey) {
      await sendEmail(resendApiKey, {
        to: user.email,
        subject: 'Reset Your Password - AI Agents Directory',
        html: getPasswordResetEmail(user.name, resetToken)
      }).catch(err => console.error('Password reset email failed:', err));
    }
    
    return c.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
      // For demo purposes only - remove in production
      debug: process.env.NODE_ENV === 'development' ? {
        resetToken,
        resetLink: `/reset-password?token=${resetToken}`
      } : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ success: false, error: 'Failed to process request' }, 500);
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
auth.post('/reset-password', async (c) => {
  try {
    const { token, newPassword } = await c.req.json();
    
    if (!token || !newPassword) {
      return c.json({ success: false, error: 'Token and new password are required' }, 400);
    }
    
    if (newPassword.length < 8) {
      return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400);
    }
    
    const { DB } = c.env;
    
    // Verify token
    const resetRequest = await DB.prepare(`
      SELECT pr.id, pr.user_id, pr.expires_at, u.email
      FROM password_resets pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.token = ? AND pr.used = 0
    `).bind(token).first<any>();
    
    if (!resetRequest) {
      return c.json({ success: false, error: 'Invalid or expired reset token' }, 400);
    }
    
    // Check if token is expired
    if (new Date(resetRequest.expires_at) < new Date()) {
      return c.json({ success: false, error: 'Reset token has expired' }, 400);
    }
    
    // Hash new password
    const password_hash = await hashPassword(newPassword);
    
    // Update user password
    await DB.prepare(`
      UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(password_hash, resetRequest.user_id).run();
    
    // Mark reset token as used
    await DB.prepare(`
      UPDATE password_resets SET used = 1 WHERE id = ?
    `).bind(resetRequest.id).run();
    
    return c.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ success: false, error: 'Failed to reset password' }, 500);
  }
});

export default auth;
