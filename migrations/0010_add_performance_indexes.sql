-- Add indexes for performance optimization

-- Index on agents for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- Index on agents for faster sorting by popular fields
CREATE INDEX IF NOT EXISTS idx_agents_view_count ON agents(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_agents_upvote_count ON agents(upvote_count DESC);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);

-- Index on agent_categories for faster category lookups
CREATE INDEX IF NOT EXISTS idx_agent_categories_category ON agent_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_agent_categories_agent ON agent_categories(agent_id);

-- Index on agents slug for faster detail page loads
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);

-- Index on reviews for faster review stats
CREATE INDEX IF NOT EXISTS idx_reviews_agent_status ON reviews(agent_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
