-- Add newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME,
  is_active INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- Add upvotes table (for tracking user upvotes)
CREATE TABLE IF NOT EXISTS upvotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(agent_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_upvotes_agent ON upvotes(agent_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_user ON upvotes(user_id);

-- Add cover_image and screenshots columns for image galleries (skip click_count as it exists)
-- Note: click_count already exists from initial schema
-- ALTER TABLE agents ADD COLUMN click_count INTEGER DEFAULT 0;  -- Commented out

-- Check if cover_image column exists, if not add it
-- SQLite doesn't have IF NOT EXISTS for ALTER TABLE, so we'll handle errors gracefully
-- CREATE TABLE IF NOT EXISTS temp_check AS SELECT cover_image FROM agents LIMIT 0;
-- DROP TABLE IF EXISTS temp_check;
