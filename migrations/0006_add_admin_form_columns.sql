-- Add columns used by admin agent creation form
-- These were missing and causing insertion errors

-- Add tags column (comma-separated list of tags)
ALTER TABLE agents ADD COLUMN tags TEXT;

-- Add features column (JSON array or comma-separated features)
ALTER TABLE agents ADD COLUMN features TEXT;

-- Add has_free_trial (boolean flag, different from free_trial_available)
ALTER TABLE agents ADD COLUMN has_free_trial INTEGER DEFAULT 0;

-- Add is_featured (boolean flag for featured agents)
ALTER TABLE agents ADD COLUMN is_featured INTEGER DEFAULT 0;

-- Add submitter_email (email of person who submitted the agent)
ALTER TABLE agents ADD COLUMN submitter_email TEXT;
