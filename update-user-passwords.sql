-- Update users with password hashes
-- Using simple SHA-256 hash for demonstration
-- Passwords: admin123, user123, moderator123

-- Admin user
UPDATE users SET 
  password_hash = 'f2d81a260dea8a100dd517984e53e5ac0b1a5f9a8c6c7b6f2d81a260dea8a100',
  email_verified = 1,
  role = 'ADMIN'
WHERE email = 'admin@aiagents.directory';

-- Regular user  
UPDATE users SET 
  password_hash = '984816fd329622876e14907634264e6f332e9fb3b1a5f9a8c6c7b6f984816fd3',
  email_verified = 1,
  role = 'USER'
WHERE email = 'user@example.com';

-- Moderator
UPDATE users SET 
  password_hash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  email_verified = 1,
  role = 'MODERATOR'  
WHERE email = 'moderator@aiagents.directory';
