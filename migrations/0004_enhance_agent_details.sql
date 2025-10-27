-- Add new fields for enhanced agent detail pages

-- Add YouTube/video fields
ALTER TABLE agents ADD COLUMN youtube_url TEXT;
ALTER TABLE agents ADD COLUMN demo_video_url TEXT;
ALTER TABLE agents ADD COLUMN video_thumbnail TEXT;

-- Add pricing details fields
ALTER TABLE agents ADD COLUMN pricing_details TEXT; -- JSON with pricing plans
ALTER TABLE agents ADD COLUMN pricing_starts_at TEXT;
ALTER TABLE agents ADD COLUMN free_plan_available INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN free_trial_available INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN free_trial_days INTEGER;

-- Add comprehensive description fields
ALTER TABLE agents ADD COLUMN long_description TEXT; -- Extended rich text description
ALTER TABLE agents ADD COLUMN highlights TEXT; -- JSON array of key highlights
ALTER TABLE agents ADD COLUMN benefits TEXT; -- JSON array of benefits

-- Add company/provider information
ALTER TABLE agents ADD COLUMN company_name TEXT;
ALTER TABLE agents ADD COLUMN company_website TEXT;
ALTER TABLE agents ADD COLUMN founded_year INTEGER;
ALTER TABLE agents ADD COLUMN company_size TEXT;
ALTER TABLE agents ADD COLUMN headquarters TEXT;

-- Add social media links
ALTER TABLE agents ADD COLUMN twitter_url TEXT;
ALTER TABLE agents ADD COLUMN linkedin_url TEXT;
ALTER TABLE agents ADD COLUMN facebook_url TEXT;
ALTER TABLE agents ADD COLUMN discord_url TEXT;
ALTER TABLE agents ADD COLUMN github_url TEXT;

-- Add technical details
ALTER TABLE agents ADD COLUMN api_available INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN api_documentation_url TEXT;
ALTER TABLE agents ADD COLUMN supported_platforms TEXT; -- JSON array
ALTER TABLE agents ADD COLUMN supported_languages TEXT; -- JSON array of natural languages
ALTER TABLE agents ADD COLUMN supported_integrations TEXT; -- JSON array

-- Add trust/credibility indicators
ALTER TABLE agents ADD COLUMN verified INTEGER DEFAULT 0;
ALTER TABLE agents ADD COLUMN trust_score REAL;
ALTER TABLE agents ADD COLUMN last_updated DATETIME;
ALTER TABLE agents ADD COLUMN uptime_percentage REAL;

-- Add alternatives/competitors
ALTER TABLE agents ADD COLUMN alternatives TEXT; -- JSON array of alternative agent IDs

-- Add FAQ section
CREATE TABLE IF NOT EXISTS agent_faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Add pricing plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  name TEXT NOT NULL, -- e.g., "Free", "Pro", "Enterprise"
  price TEXT NOT NULL, -- e.g., "$0/month", "$29/month"
  billing_period TEXT, -- "monthly", "yearly", "one-time"
  features TEXT NOT NULL, -- JSON array of features
  is_popular INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  cta_text TEXT, -- e.g., "Get Started", "Contact Sales"
  cta_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Add agent screenshots/gallery table
CREATE TABLE IF NOT EXISTS agent_screenshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Add agent pros and cons table
CREATE TABLE IF NOT EXISTS agent_pros_cons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('PRO', 'CON')),
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS idx_agent_faqs_agent ON agent_faqs(agent_id);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_agent ON pricing_plans(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_screenshots_agent ON agent_screenshots(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_pros_cons_agent ON agent_pros_cons(agent_id);
