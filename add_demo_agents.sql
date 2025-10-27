-- Add 12th Demo Agent: Eleven Labs (Voice AI)
INSERT INTO agents (
    name, slug, tagline, description, long_description,
    website_url, logo_url, pricing_model, is_open_source, status,
    featured_tier, submitted_by_id, view_count, upvote_count,
    youtube_url, company_name, company_website, founded_year, company_size, headquarters,
    verified, pricing_starts_at, free_trial_available, free_trial_days
) VALUES (
    'ElevenLabs',
    'elevenlabs',
    'The most realistic and versatile AI speech software',
    'ElevenLabs is a voice AI research company that develops natural-sounding speech synthesis and voice cloning technology.',
    'ElevenLabs specializes in creating lifelike, versatile AI audio through groundbreaking research. Their technology enables creators, publishers, and businesses to generate professional voice overs in multiple languages with unprecedented quality and emotional range. The platform supports voice cloning, allowing users to create custom voices, and offers a wide range of pre-made voices for various use cases.',
    'https://elevenlabs.io',
    '🎙️',
    'FREEMIUM',
    0,
    'APPROVED',
    'PREMIUM',
    1,
    2543,
    189,
    'https://www.youtube.com/watch?v=YU_gXHSNNJ0',
    'ElevenLabs',
    'https://elevenlabs.io',
    2022,
    '51-200',
    'New York, USA',
    1,
    '$5/month',
    1,
    30
);

-- Get the agent ID for ElevenLabs
-- Assuming ID will be 11

-- Add 13th Demo Agent: Notion AI (Productivity)
INSERT INTO agents (
    name, slug, tagline, description, long_description,
    website_url, logo_url, pricing_model, is_open_source, status,
    featured_tier, submitted_by_id, view_count, upvote_count,
    youtube_url, company_name, company_website, founded_year, company_size, headquarters,
    verified, pricing_starts_at, free_plan_available
) VALUES (
    'Notion AI',
    'notion-ai',
    'AI-powered workspace for notes, docs, and collaboration',
    'Notion AI helps you write better, think bigger, and augment creativity. Built right into your workspace, it assists with brainstorming, editing, and summarizing.',
    'Notion AI is an integrated AI assistant that brings the power of artificial intelligence to your Notion workspace. It can help you write faster by generating content, summarize long documents, translate text, improve writing quality, and brainstorm ideas. Whether you are working on a project plan, creating meeting notes, or drafting a blog post, Notion AI acts as your creative partner and productivity booster. The AI understands context from your workspace and provides intelligent suggestions tailored to your needs.',
    'https://www.notion.so/product/ai',
    '📝',
    'FREEMIUM',
    0,
    'APPROVED',
    'SEO_BOOST',
    1,
    3421,
    256,
    'https://www.youtube.com/watch?v=y2Hmw2cR9Ac',
    'Notion Labs',
    'https://www.notion.so',
    2016,
    '201-500',
    'San Francisco, USA',
    1,
    '$8/month',
    1
);

-- Add features for ElevenLabs (ID 11)
INSERT INTO features (agent_id, title, description, display_order) VALUES
(11, 'Natural Voice Synthesis', 'Generate incredibly realistic speech that captures human emotion and intonation', 1),
(11, 'Voice Cloning', 'Create a digital copy of any voice with just a few minutes of audio', 2),
(11, 'Multilingual Support', 'Generate speech in 29+ languages with native-level pronunciation', 3),
(11, 'Emotional Range', 'Control the emotional delivery from calm to excited, sad to joyful', 4),
(11, 'Professional Quality', 'Studio-grade audio output suitable for commercial use', 5),
(11, 'API Access', 'Integrate voice AI directly into your applications and workflows', 6),
(11, 'Voice Library', 'Access hundreds of pre-made voices for various use cases', 7),
(11, 'Speech-to-Speech', 'Transform your own voice recordings into different voices', 8);

-- Add features for Notion AI (ID 12)
INSERT INTO features (agent_id, title, description, display_order) VALUES
(12, 'AI Writing Assistant', 'Get help writing, editing, and improving your content', 1),
(12, 'Smart Summaries', 'Automatically summarize long documents and meeting notes', 2),
(12, 'Content Generation', 'Generate blog posts, social media content, and more', 3),
(12, 'Translation', 'Translate text into multiple languages instantly', 4),
(12, 'Brainstorming', 'Generate ideas and creative suggestions for your projects', 5),
(12, 'Action Items', 'Extract action items and to-dos from meeting notes automatically', 6),
(12, 'Grammar & Style', 'Improve writing quality with grammar and style suggestions', 7),
(12, 'Context-Aware', 'AI understands your workspace context for better suggestions', 8);

-- Add use cases for ElevenLabs
INSERT INTO use_cases (agent_id, title, description, display_order) VALUES
(11, 'Audiobook Creation', 'Produce professional audiobooks with consistent narration quality', 1),
(11, 'Content Creation', 'Generate voiceovers for YouTube videos, podcasts, and social media', 2),
(11, 'E-Learning', 'Create engaging educational content with natural-sounding narration', 3),
(11, 'Gaming', 'Generate dynamic character voices and in-game dialogue', 4),
(11, 'Accessibility', 'Convert text content to audio for visually impaired users', 5);

-- Add use cases for Notion AI
INSERT INTO use_cases (agent_id, title, description, display_order) VALUES
(12, 'Meeting Notes', 'Automatically summarize meetings and extract action items', 1),
(12, 'Content Marketing', 'Generate blog posts, social media content, and marketing copy', 2),
(12, 'Project Management', 'Create project plans, timelines, and status updates', 3),
(12, 'Research', 'Summarize research papers and organize findings', 4),
(12, 'Personal Knowledge Base', 'Build and organize your personal knowledge with AI assistance', 5);

-- Add pricing plans for ElevenLabs
INSERT INTO pricing_plans (agent_id, name, price, billing_period, features, cta_text, cta_url, is_popular, display_order) VALUES
(11, 'Free', 0, 'monthly', '["10,000 characters/month", "3 custom voices", "Voice library access", "Standard quality"]', 'Get Started', 'https://elevenlabs.io/sign-up', 0, 1),
(11, 'Starter', 5, 'monthly', '["30,000 characters/month", "10 custom voices", "Commercial license", "High quality audio", "Voice cloning", "API access"]', 'Start Free Trial', 'https://elevenlabs.io/pricing', 1, 2),
(11, 'Creator', 22, 'monthly', '["100,000 characters/month", "30 custom voices", "Commercial license", "Ultra quality audio", "Voice cloning", "API access", "Priority support"]', 'Start Free Trial', 'https://elevenlabs.io/pricing', 0, 3),
(11, 'Pro', 99, 'monthly', '["500,000 characters/month", "160 custom voices", "Commercial license", "Ultra quality audio", "Voice cloning", "API access", "Priority support", "Dedicated account manager"]', 'Contact Sales', 'https://elevenlabs.io/pricing', 0, 4);

-- Add pricing plans for Notion AI
INSERT INTO pricing_plans (agent_id, name, price, billing_period, features, cta_text, cta_url, is_popular, display_order) VALUES
(12, 'Free', 0, 'monthly', '["Basic AI features", "Limited AI responses", "Individual use only", "Unlimited pages & blocks"]', 'Get Started', 'https://www.notion.so/product/ai', 0, 1),
(12, 'Plus', 8, 'monthly', '["Unlimited AI responses", "All AI features", "Commercial use", "Unlimited file uploads", "30-day version history"]', 'Start Free Trial', 'https://www.notion.so/pricing', 1, 2),
(12, 'Business', 15, 'monthly', '["Unlimited AI responses", "All AI features", "Advanced permissions", "90-day version history", "SAML SSO", "Advanced security"]', 'Start Free Trial', 'https://www.notion.so/pricing', 0, 3),
(12, 'Enterprise', 0, 'contact', '["Unlimited AI responses", "Custom AI training", "Dedicated support", "Advanced analytics", "Custom contracts", "On-premise deployment options"]', 'Contact Sales', 'https://www.notion.so/contact-sales', 0, 4);

-- Add FAQs for ElevenLabs
INSERT INTO agent_faqs (agent_id, question, answer, display_order) VALUES
(11, 'What is voice cloning?', 'Voice cloning is the process of creating a digital replica of a human voice using AI. ElevenLabs can create a voice clone with just a few minutes of audio samples, capturing the unique characteristics, tone, and speech patterns of the original voice.', 1),
(11, 'Can I use ElevenLabs for commercial projects?', 'Yes! With a paid subscription (Starter plan or higher), you receive a commercial license that allows you to use generated audio in your commercial projects, including YouTube videos, podcasts, audiobooks, and more.', 2),
(11, 'How many languages does ElevenLabs support?', 'ElevenLabs currently supports 29+ languages including English, Spanish, French, German, Italian, Portuguese, Polish, Hindi, and many more. New languages are regularly added.', 3),
(11, 'Is there an API available?', 'Yes! ElevenLabs offers a powerful API that allows you to integrate voice generation into your applications. API access is available starting from the Starter plan.', 4),
(11, 'What audio quality do I get?', 'ElevenLabs offers multiple quality tiers: Standard (Free plan), High (Starter plan), and Ultra (Creator and Pro plans). All produce excellent results, with Ultra quality being virtually indistinguishable from human speech.', 5);

-- Add FAQs for Notion AI
INSERT INTO agent_faqs (agent_id, question, answer, display_order) VALUES
(12, 'How does Notion AI work?', 'Notion AI is built directly into your Notion workspace. It uses advanced language models to understand your content and context, providing intelligent suggestions, generating text, summarizing documents, and helping you work more efficiently. Simply type "/ai" in any page to access AI features.', 1),
(12, 'Is my data used to train Notion AI?', 'No. Notion does not use customer data to train AI models. Your workspace data remains private and secure. Notion AI uses third-party AI models with strict data protection agreements.', 2),
(12, 'Can I use Notion AI for free?', 'Notion offers limited AI features on the free plan. For unlimited AI responses and full access to all AI capabilities, you need a Plus subscription ($8/month) or higher.', 3),
(12, 'What languages does Notion AI support?', 'Notion AI supports multiple languages including English, Spanish, French, German, Japanese, Korean, Portuguese, and more. It can also translate between these languages.', 4),
(12, 'Can Notion AI work offline?', 'No, Notion AI requires an internet connection as it processes requests using cloud-based AI models. However, your regular Notion content is accessible offline.', 5);

-- Add pros and cons for ElevenLabs
INSERT INTO agent_pros_cons (agent_id, type, content, display_order) VALUES
(11, 'PRO', 'Incredibly realistic and natural-sounding voice synthesis', 1),
(11, 'PRO', 'Easy-to-use interface with powerful customization options', 2),
(11, 'PRO', 'Extensive voice library with diverse options', 3),
(11, 'PRO', 'Excellent multilingual support', 4),
(11, 'PRO', 'Professional-grade quality suitable for commercial use', 5),
(11, 'CON', 'Can be expensive for high-volume usage', 1),
(11, 'CON', 'Free tier has limited character allowance', 2),
(11, 'CON', 'Voice cloning requires careful ethical consideration', 3);

-- Add pros and cons for Notion AI
INSERT INTO agent_pros_cons (agent_id, type, content, display_order) VALUES
(12, 'PRO', 'Seamlessly integrated into existing Notion workspace', 1),
(12, 'PRO', 'Context-aware suggestions based on your content', 2),
(12, 'PRO', 'Wide range of AI-powered features', 3),
(12, 'PRO', 'Affordable pricing with free tier available', 4),
(12, 'PRO', 'Excellent for boosting productivity and writing quality', 5),
(12, 'CON', 'Requires existing familiarity with Notion', 1),
(12, 'CON', 'Free plan has limited AI response quota', 2),
(12, 'CON', 'Internet connection required for AI features', 3);

-- Link agents to categories (assuming categories exist)
-- ElevenLabs - Voice AI (category_id: 1 or find Voice AI category)
-- Notion AI - Productivity (category_id: 2 or find Productivity category)
-- We'll need to check existing categories and add these associations

-- Add some screenshot records (URLs would be added by admin)
INSERT INTO agent_screenshots (agent_id, image_url, title, description, display_order) VALUES
(11, 'https://example.com/elevenlabs-interface.png', 'Voice Generation Interface', 'Clean and intuitive interface for generating voiceovers', 1),
(11, 'https://example.com/elevenlabs-voice-library.png', 'Voice Library', 'Browse hundreds of pre-made voices', 2),
(11, 'https://example.com/elevenlabs-voice-settings.png', 'Voice Settings', 'Fine-tune voice parameters for perfect results', 3);

INSERT INTO agent_screenshots (agent_id, image_url, title, description, display_order) VALUES
(12, 'https://example.com/notion-ai-writing.png', 'AI Writing Assistant', 'Get AI-powered writing suggestions inline', 1),
(12, 'https://example.com/notion-ai-summary.png', 'Smart Summaries', 'Automatically summarize long documents', 2),
(12, 'https://example.com/notion-ai-brainstorm.png', 'Brainstorming', 'Generate ideas and creative suggestions', 3);
