-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  password_hash TEXT, -- for email/password auth
  role TEXT DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN', 'MODERATOR')),
  email_verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_id INTEGER,
  agent_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  agent_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT, -- Rich text content
  website_url TEXT,
  logo_url TEXT,
  cover_image TEXT,
  screenshots TEXT, -- JSON array stored as text
  
  -- Pricing & licensing
  pricing_model TEXT DEFAULT 'FREE' CHECK(pricing_model IN ('FREE', 'PAID', 'FREEMIUM', 'CONTACT')),
  is_open_source INTEGER DEFAULT 0,
  
  -- Status & featured
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
  featured_tier TEXT DEFAULT 'NONE' CHECK(featured_tier IN ('NONE', 'SEO_BOOST', 'PREMIUM', 'BANNER')),
  
  -- Metadata
  submitted_by_id INTEGER NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME,
  approved_by_id INTEGER,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT, -- Comma-separated
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  
  FOREIGN KEY (submitted_by_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Agent Categories junction table
CREATE TABLE IF NOT EXISTS agent_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(agent_id, category_id)
);

-- Agent Tags junction table
CREATE TABLE IF NOT EXISTS agent_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(agent_id, tag_id)
);

-- Features table
CREATE TABLE IF NOT EXISTS features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Use Cases table
CREATE TABLE IF NOT EXISTS use_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Upvotes table
CREATE TABLE IF NOT EXISTS upvotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  agent_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  UNIQUE(user_id, agent_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  agent_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  content TEXT,
  is_verified INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  is_active INTEGER DEFAULT 1,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL,
  tier TEXT NOT NULL CHECK(tier IN ('SEO_BOOST', 'PREMIUM', 'BANNER')),
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  amount_paid REAL,
  is_paid INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
  invoice_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_featured_tier ON agents(featured_tier);
CREATE INDEX IF NOT EXISTS idx_agents_submitted_by ON agents(submitted_by_id);
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_upvotes_user ON upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_agent ON upvotes(agent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_agent ON reviews(agent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_agent_categories_agent ON agent_categories(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_categories_category ON agent_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_agent_tags_agent ON agent_tags(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tags_tag ON agent_tags(tag_id);
