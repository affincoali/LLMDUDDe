-- Add test user
INSERT OR IGNORE INTO users (id, email, name, password_hash, role) 
VALUES (1, 'test@example.com', 'Test User', 'hash123', 'USER');

-- Add test agent with all new fields
INSERT OR IGNORE INTO agents (
  id, name, slug, tagline, description, website_url, logo_url, 
  pricing_model, status, submitted_by_id, upvote_count, view_count,
  twitter_url, linkedin_url, discord_url, youtube_url, video_thumbnail
) VALUES (
  1,
  'GPT-4 Agent',
  'gpt-4-agent',
  'Advanced AI language model for natural conversations',
  'GPT-4 is OpenAI most advanced language model, capable of understanding and generating human-like text with remarkable accuracy. It can help with writing, analysis, coding, and much more.',
  'https://openai.com',
  'https://picsum.photos/200',
  'PAID',
  'APPROVED',
  1,
  150,
  500,
  'https://twitter.com/openai',
  'https://linkedin.com/company/openai',
  'https://discord.gg/openai',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://picsum.photos/800/400'
);

-- Add features
INSERT OR IGNORE INTO features (agent_id, title, description) VALUES
(1, 'Natural Language Understanding', 'Understands context and nuance in conversations'),
(1, 'Code Generation', 'Can write and debug code in multiple languages'),
(1, 'Creative Writing', 'Generates creative content including stories and articles'),
(1, 'Data Analysis', 'Analyzes and interprets complex data sets');

-- Add use cases
INSERT OR IGNORE INTO use_cases (agent_id, title, description) VALUES
(1, 'Content Creation', 'Generate blog posts, articles, and marketing copy'),
(1, 'Code Development', 'Build applications and debug existing code'),
(1, 'Research Assistant', 'Summarize papers and extract key insights');
