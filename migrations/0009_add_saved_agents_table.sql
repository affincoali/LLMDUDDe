-- Migration 0009: Add saved_agents table for bookmark/save functionality

-- Create saved_agents table
CREATE TABLE IF NOT EXISTS saved_agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  agent_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE(user_id, agent_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_agents_user ON saved_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_agents_agent ON saved_agents(agent_id);
