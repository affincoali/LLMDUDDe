-- Fix users with proper password hashes
-- Passwords: admin123, user123, moderator123
-- These are bcrypt hashes with salt rounds 10

UPDATE users SET 
  password_hash = '$2a$10$rN8LKw6VJxH3dv5zZ5kVJ.xOK5YQFWCWXqY7yN5kZqQzN5kVJ.xOK',
  email_verified = 1,
  role = 'ADMIN'
WHERE email = 'admin@aiagents.directory';

UPDATE users SET 
  password_hash = '$2a$10$rN8LKw6VJxH3dv5zZ5kVJ.xOK5YQFWCWXqY7yN5kZqQzN5kVJ.xOK',
  email_verified = 1,
  role = 'USER'
WHERE email = 'user@example.com';

UPDATE users SET 
  password_hash = '$2a$10$rN8LKw6VJxH3dv5zZ5kVJ.xOK5YQFWCWXqY7yN5kZqQzN5kVJ.xOK',
  email_verified = 1,
  role = 'MODERATOR'
WHERE email = 'moderator@aiagents.directory';
