-- Complete seed data for production database
-- This includes all 13 agents with proper category and tag links

-- Clear existing data (production should keep existing users)
DELETE FROM agent_categories WHERE agent_id >= 7;
DELETE FROM agent_tags WHERE agent_id >= 7;
DELETE FROM features WHERE agent_id >= 7;
DELETE FROM use_cases WHERE agent_id >= 7;
DELETE FROM upvotes WHERE agent_id >= 7;
DELETE FROM reviews WHERE agent_id >= 7;
DELETE FROM agents WHERE id >= 7;

-- Add missing categories (IDs 7-8)
INSERT OR IGNORE INTO categories (id, name, slug, description, icon, color, display_order) VALUES 
  (7, 'Audio & Voice', 'audio-voice', 'AI tools for voice generation and audio processing', '🎙️', '#F59E0B', 7),
  (8, 'Productivity', 'productivity', 'AI assistants for workflow and productivity', '⚡', '#10B981', 8);

-- Insert missing agents (IDs 7-13)
INSERT OR IGNORE INTO agents (
  id, name, slug, tagline, description, website_url, logo_url,
  pricing_model, is_open_source, status, submitted_by_id, approved_at, approved_by_id,
  view_count, upvote_count, published_at
) VALUES 
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

-- Link new agents to categories
INSERT OR IGNORE INTO agent_categories (agent_id, category_id) VALUES 
  (7, 5),  -- DALL-E 3 -> Image Generation
  (8, 5),  -- Stable Diffusion -> Image Generation
  (9, 1),  -- Copy.ai -> Content Generation
  (10, 1), -- Jasper -> Content Generation
  (11, 1), -- Grammarly -> Content Generation
  (11, 8), -- Grammarly -> Productivity
  (12, 7), -- ElevenLabs -> Audio & Voice
  (13, 8), -- Notion AI -> Productivity
  (13, 1); -- Notion AI -> Content Generation

-- Link new agents to tags
INSERT OR IGNORE INTO agent_tags (agent_id, tag_id) VALUES 
  (7, 1),  -- DALL-E 3 -> GPT-4
  (7, 4),  -- DALL-E 3 -> API Available
  (8, 2),  -- Stable Diffusion -> Open Source
  (8, 5),  -- Stable Diffusion -> Free Tier
  (9, 5),  -- Copy.ai -> Free Tier
  (9, 4),  -- Copy.ai -> API Available
  (10, 3), -- Jasper -> Enterprise
  (10, 4), -- Jasper -> API Available
  (11, 5), -- Grammarly -> Free Tier
  (11, 6), -- Grammarly -> Real-time
  (12, 4), -- ElevenLabs -> API Available
  (12, 5), -- ElevenLabs -> Free Tier
  (13, 5), -- Notion AI -> Free Tier
  (13, 6); -- Notion AI -> Real-time

-- Insert features for new agents
INSERT OR IGNORE INTO features (agent_id, title, description, display_order) VALUES 
  (7, 'Text to Image', 'Generate images from detailed text descriptions', 1),
  (7, 'ChatGPT Integration', 'Enhanced prompting through ChatGPT interface', 2),
  (8, 'Local Deployment', 'Run on your own hardware for privacy', 1),
  (8, 'Customizable', 'Fine-tune models for specific styles', 2),
  (9, 'Templates', 'Pre-built templates for common use cases', 1),
  (9, 'Multi-language', 'Generate content in 25+ languages', 2),
  (10, 'Brand Voice', 'Train AI to match your brand tone', 1),
  (10, 'SEO Optimization', 'Content optimized for search engines', 2),
  (11, 'Grammar Check', 'Advanced grammar and spelling correction', 1),
  (11, 'Tone Detector', 'Analyze and adjust writing tone', 2),
  (12, 'Voice Cloning', 'Create custom voices from samples', 1),
  (12, 'Multi-accent', 'Generate speech in various accents', 2),
  (13, 'Workspace Integration', 'Works directly in Notion pages', 1),
  (13, 'Summarization', 'Condense long documents instantly', 2);

-- Insert use cases for new agents
INSERT OR IGNORE INTO use_cases (agent_id, title, description, display_order) VALUES 
  (7, 'Marketing Visuals', 'Create unique images for campaigns', 1),
  (7, 'Concept Art', 'Visualize ideas and concepts', 2),
  (8, 'Game Assets', 'Generate textures and artwork for games', 1),
  (8, 'Personal Projects', 'Free image generation for hobby projects', 2),
  (9, 'Ad Copy', 'Write compelling advertisements', 1),
  (9, 'Social Media', 'Generate engaging social posts', 2),
  (10, 'Blog Content', 'Create SEO-optimized blog articles', 1),
  (10, 'Email Campaigns', 'Write high-converting email sequences', 2),
  (11, 'Professional Writing', 'Polish business documents and emails', 1),
  (11, 'Academic Writing', 'Improve essays and research papers', 2),
  (12, 'Audiobooks', 'Narrate books with realistic voices', 1),
  (12, 'Podcasts', 'Generate voiceovers for content', 2),
  (13, 'Meeting Notes', 'Summarize and organize meeting minutes', 1),
  (13, 'Project Planning', 'Help structure and plan projects', 2);

-- Add upvotes for new agents
INSERT OR IGNORE INTO upvotes (user_id, agent_id) VALUES 
  (1, 7), (1, 8), (1, 11),
  (2, 9), (2, 10), (2, 12),
  (3, 7), (3, 9), (3, 13);

-- Add reviews for new agents
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, content, status, is_verified) VALUES 
  (2, 7, 5, 'Best image generator I have used! So detailed.', 'APPROVED', 1),
  (2, 11, 5, 'Grammarly saves me hours of editing time.', 'APPROVED', 1),
  (3, 8, 4, 'Great open-source option, steep learning curve though.', 'APPROVED', 1),
  (3, 12, 5, 'The voice quality is incredible!', 'APPROVED', 1);
