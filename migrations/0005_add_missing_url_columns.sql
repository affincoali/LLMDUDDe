-- Add missing URL columns that the code expects
-- These are used in the admin agent creation form

-- Add demo_url column (different from demo_video_url which is for embedded videos)
-- demo_url is for live demo links
ALTER TABLE agents ADD COLUMN demo_url TEXT;

-- Add docs_url column for documentation links
ALTER TABLE agents ADD COLUMN docs_url TEXT;

-- Note: demo_video_url already exists from migration 0004 (for embedded video URLs)
-- demo_url is for links to live demos/interactive experiences
