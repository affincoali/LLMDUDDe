-- Update users with CORRECT password hashes
-- Generated using SHA-256(password + 'your-secret-key-change-in-production')
-- Passwords: admin123, user123, moderator123

-- Admin user (admin123)
UPDATE users SET 
  password_hash = '9df79ae8c7f45710a793b642345f54c718634ff469ef9f76bd2f698423c5d8e2',
  email_verified = 1,
  role = 'ADMIN'
WHERE email = 'admin@aiagents.directory';

-- Regular user (user123)
UPDATE users SET 
  password_hash = '1b8c1409c2f4b97536978529578c1ac5380ddd2893e41e220b537eff06a6d02b',
  email_verified = 1,
  role = 'USER'
WHERE email = 'user@example.com';

-- Moderator (moderator123)
UPDATE users SET 
  password_hash = '7d159a2c4f720d168c854db9936c1a38ca202fa5eb63745fe46bda702739b737',
  email_verified = 1,
  role = 'MODERATOR'  
WHERE email = 'moderator@aiagents.directory';
