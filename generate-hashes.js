// Generate password hashes for users
const crypto = require('crypto');

// This should match the JWT_SECRET from the app
// For demo purposes, we'll use a placeholder that needs to be replaced
const JWT_SECRET = 'your-secret-key-min-32-chars-long-change-this-in-production';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateHashes() {
  const passwords = {
    'admin@aiagents.directory': 'admin123',
    'user@example.com': 'user123',
    'moderator@aiagents.directory': 'moderator123'
  };

  console.log('-- Generated password hashes for users\n');
  
  for (const [email, password] of Object.entries(passwords)) {
    const hash = await hashPassword(password);
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = '${email}';`);
  }
}

generateHashes().catch(console.error);
