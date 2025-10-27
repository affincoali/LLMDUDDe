-- Audit Log table for tracking admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  details TEXT, -- JSON string with additional info
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Add rejection reason to agents table
ALTER TABLE agents ADD COLUMN rejection_reason TEXT;

-- Add notes field for internal admin notes
ALTER TABLE agents ADD COLUMN admin_notes TEXT;

-- Add last_edited_by and last_edited_at
ALTER TABLE agents ADD COLUMN last_edited_by INTEGER;
ALTER TABLE agents ADD COLUMN last_edited_at DATETIME;

-- Add index for last_edited_at
CREATE INDEX IF NOT EXISTS idx_agents_last_edited ON agents(last_edited_at);
