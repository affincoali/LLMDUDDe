-- Insert admin user
INSERT OR IGNORE INTO users (id, email, name, role, email_verified) VALUES 
  (1, 'admin@aiagents.directory', 'Admin User', 'ADMIN', 1),
  (2, 'user@example.com', 'John Doe', 'USER', 1),
  (3, 'moderator@aiagents.directory', 'Jane Smith', 'MODERATOR', 1);

-- Insert categories
INSERT OR IGNORE INTO categories (id, name, slug, description, icon, color, display_order) VALUES 
  (1, 'Content Generation', 'content-generation', 'AI agents for creating written content', '✍️', '#3B82F6', 1),
  (2, 'Code Assistants', 'code-assistants', 'AI-powered coding and development tools', '💻', '#10B981', 2),
  (3, 'Data Analysis', 'data-analysis', 'AI tools for analyzing and visualizing data', '📊', '#8B5CF6', 3),
  (4, 'Customer Support', 'customer-support', 'AI chatbots and support automation', '💬', '#F59E0B', 4),
  (5, 'Image Generation', 'image-generation', 'AI tools for creating and editing images', '🎨', '#EC4899', 5),
  (6, 'Research', 'research', 'AI assistants for research and knowledge discovery', '🔬', '#06B6D4', 6);

-- Insert tags
INSERT OR IGNORE INTO tags (id, name, slug) VALUES 
  (1, 'GPT-4', 'gpt-4'),
  (2, 'Open Source', 'open-source'),
  (3, 'Enterprise', 'enterprise'),
  (4, 'API Available', 'api-available'),
  (5, 'Free Tier', 'free-tier'),
  (6, 'Real-time', 'real-time');

-- Insert sample agents
INSERT OR IGNORE INTO agents (
  id, name, slug, tagline, description, website_url, logo_url,
  pricing_model, is_open_source, status, submitted_by_id, approved_at, approved_by_id,
  view_count, upvote_count, published_at
) VALUES 
  (
    1, 
    'ChatGPT', 
    'chatgpt',
    'Conversational AI assistant powered by GPT-4',
    'ChatGPT is an advanced language model that can help with writing, coding, analysis, and more. It uses GPT-4 architecture to provide human-like responses.',
    'https://chat.openai.com',
    'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png',
    'FREEMIUM',
    0,
    'APPROVED',
    1,
    datetime('now'),
    1,
    1250,
    89,
    datetime('now')
  ),
  (
    2,
    'Claude',
    'claude',
    'AI assistant by Anthropic for analysis and coding',
    'Claude is a next-generation AI assistant with advanced reasoning capabilities, perfect for complex tasks and long-form content.',
    'https://claude.ai',
    'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png',
    'FREEMIUM',
    0,
    'APPROVED',
    1,
    datetime('now'),
    1,
    980,
    76,
    datetime('now')
  ),
  (
    3,
    'GitHub Copilot',
    'github-copilot',
    'AI pair programmer for developers',
    'GitHub Copilot helps developers write code faster with AI-powered suggestions and autocomplete.',
    'https://github.com/features/copilot',
    'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png',
    'PAID',
    0,
    'APPROVED',
    2,
    datetime('now'),
    1,
    1450,
    112,
    datetime('now')
  ),
  (
    4,
    'Midjourney',
    'midjourney',
    'AI art generator for stunning visuals',
    'Midjourney creates beautiful, artistic images from text descriptions using advanced AI.',
    'https://midjourney.com',
    'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png',
    'PAID',
    0,
    'APPROVED',
    2,
    datetime('now'),
    1,
    2100,
    156,
    datetime('now')
  ),
  (
    5,
    'Perplexity AI',
    'perplexity-ai',
    'AI-powered research and answer engine',
    'Perplexity AI provides accurate answers with sources, perfect for research and fact-checking.',
    'https://perplexity.ai',
    'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png',
    'FREEMIUM',
    0,
    'APPROVED',
    3,
    datetime('now'),
    1,
    890,
    67,
    datetime('now')
  ),
  (
    6,
    'Pending Agent',
    'pending-agent',
    'This is a test agent in pending status',
    'This agent is pending approval and should only be visible to admins.',
    'https://example.com',
    'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png',
    'FREE',
    1,
    'PENDING',
    2,
    NULL,
    NULL,
    0,
    0,
    NULL
  ),
  (
    7,
    'DALL-E 3',
    'dall-e-3',
    'Advanced AI image generator by OpenAI',
    'DALL-E 3 creates highly detailed and accurate images from text descriptions, integrated with ChatGPT for enhanced prompting.',
    'https://openai.com/dall-e-3',
    '🎨',
    'PAID',
    0,
    'APPROVED',
    1,
    datetime('now'),
    1,
    1850,
    132,
    datetime('now')
  ),
  (
    8,
    'Stable Diffusion',
    'stable-diffusion',
    'Open-source AI image generation model',
    'Stable Diffusion is a powerful open-source model for generating images from text. Run it locally or use cloud services.',
    'https://stability.ai',
    '🌟',
    'FREE',
    1,
    'APPROVED',
    2,
    datetime('now'),
    1,
    2300,
    198,
    datetime('now')
  ),
  (
    9,
    'Copy.ai',
    'copy-ai',
    'AI-powered marketing copywriting assistant',
    'Copy.ai helps marketers and writers create engaging content, from blog posts to ad copy, in seconds.',
    'https://copy.ai',
    '✍️',
    'FREEMIUM',
    0,
    'APPROVED',
    1,
    datetime('now'),
    1,
    1420,
    95,
    datetime('now')
  ),
  (
    10,
    'Jasper',
    'jasper',
    'AI content platform for enterprise marketing',
    'Jasper (formerly Jarvis) is an AI writing assistant designed for creating high-quality marketing content at scale.',
    'https://jasper.ai',
    '📝',
    'PAID',
    0,
    'APPROVED',
    2,
    datetime('now'),
    1,
    1680,
    121,
    datetime('now')
  ),
  (
    11,
    'Grammarly',
    'grammarly',
    'AI-powered writing assistant and grammar checker',
    'Grammarly helps improve your writing with real-time suggestions for grammar, spelling, clarity, and tone.',
    'https://grammarly.com',
    '📖',
    'FREEMIUM',
    0,
    'APPROVED',
    1,
    datetime('now'),
    1,
    3200,
    245,
    datetime('now')
  ),
  (
    12,
    'ElevenLabs',
    'elevenlabs',
    'AI voice generation and text-to-speech',
    'ElevenLabs creates incredibly realistic AI voices for narration, audiobooks, and content creation.',
    'https://elevenlabs.io',
    '🎙️',
    'FREEMIUM',
    0,
    'APPROVED',
    2,
    datetime('now'),
    1,
    1540,
    108,
    datetime('now')
  ),
  (
    13,
    'Notion AI',
    'notion-ai',
    'AI assistant integrated into Notion workspace',
    'Notion AI helps you write, brainstorm, and organize information directly within your Notion pages.',
    'https://notion.so/product/ai',
    '📋',
    'PAID',
    0,
    'APPROVED',
    3,
    datetime('now'),
    1,
    1920,
    156,
    datetime('now')
  );

-- Link agents to categories
INSERT OR IGNORE INTO agent_categories (agent_id, category_id) VALUES 
  (1, 1), -- ChatGPT -> Content Generation
  (1, 4), -- ChatGPT -> Customer Support
  (2, 1), -- Claude -> Content Generation
  (2, 2), -- Claude -> Code Assistants
  (3, 2), -- GitHub Copilot -> Code Assistants
  (4, 5), -- Midjourney -> Image Generation
  (5, 6), -- Perplexity -> Research
  (5, 3); -- Perplexity -> Data Analysis

-- Link agents to tags
INSERT OR IGNORE INTO agent_tags (agent_id, tag_id) VALUES 
  (1, 1), -- ChatGPT -> GPT-4
  (1, 5), -- ChatGPT -> Free Tier
  (2, 5), -- Claude -> Free Tier
  (3, 3), -- GitHub Copilot -> Enterprise
  (3, 4), -- GitHub Copilot -> API Available
  (4, 3), -- Midjourney -> Enterprise
  (5, 5), -- Perplexity -> Free Tier
  (5, 6), -- Perplexity -> Real-time
  (6, 2), -- Pending Agent -> Open Source
  (6, 5); -- Pending Agent -> Free Tier

-- Insert features
INSERT OR IGNORE INTO features (agent_id, title, description, display_order) VALUES 
  (1, 'Natural Conversations', 'Engage in human-like dialogue with context awareness', 1),
  (1, 'Code Generation', 'Write, debug, and explain code in multiple languages', 2),
  (1, 'Content Creation', 'Generate articles, emails, and creative writing', 3),
  (2, 'Extended Context', 'Process up to 100K tokens for long documents', 1),
  (2, 'Coding Expertise', 'Advanced programming assistance and debugging', 2),
  (3, 'Auto-complete', 'Real-time code suggestions as you type', 1),
  (3, 'Multi-language', 'Support for dozens of programming languages', 2);

-- Insert use cases
INSERT OR IGNORE INTO use_cases (agent_id, title, description, display_order) VALUES 
  (1, 'Content Writing', 'Blog posts, articles, and marketing copy', 1),
  (1, 'Customer Service', 'Automated responses and support tickets', 2),
  (2, 'Document Analysis', 'Summarize and extract insights from long documents', 1),
  (3, 'Rapid Development', 'Speed up coding with AI-powered suggestions', 1),
  (4, 'Marketing Assets', 'Create unique visuals for campaigns', 1);

-- Insert sample upvotes
INSERT OR IGNORE INTO upvotes (user_id, agent_id) VALUES 
  (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 5),
  (3, 1), (3, 3), (3, 4), (3, 5);

-- Insert sample reviews
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, content, status, is_verified) VALUES 
  (2, 1, 5, 'Absolutely amazing tool! Changed how I work every day.', 'APPROVED', 1),
  (2, 3, 4, 'Great for coding but can be expensive for individual use.', 'APPROVED', 1),
  (3, 1, 5, 'The best AI assistant I have used. Highly recommend!', 'APPROVED', 1),
  (3, 4, 5, 'Creates stunning artwork, worth every penny.', 'APPROVED', 0);

-- Insert newsletter subscriptions
INSERT OR IGNORE INTO newsletter (email) VALUES 
  ('newsletter@example.com'),
  ('subscriber@test.com');
