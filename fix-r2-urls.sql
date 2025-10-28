-- Fix all old R2 URLs to use custom domain storage.llmdude.com
-- This replaces pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev with storage.llmdude.com

-- Update agents table - logo_url
UPDATE agents 
SET logo_url = REPLACE(logo_url, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE logo_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

-- Update agents table - cover_image
UPDATE agents 
SET cover_image = REPLACE(cover_image, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE cover_image LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

-- Update agent_screenshots table
UPDATE agent_screenshots 
SET image_url = REPLACE(image_url, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

-- Update categories table (just in case)
UPDATE categories 
SET image_url = REPLACE(image_url, 'https://pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev', 'https://storage.llmdude.com')
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';

-- Verify the changes
SELECT 'agents' as table_name, COUNT(*) as remaining_old_urls 
FROM agents 
WHERE logo_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%' 
   OR cover_image LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%'
UNION ALL
SELECT 'agent_screenshots', COUNT(*) 
FROM agent_screenshots 
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%'
UNION ALL
SELECT 'categories', COUNT(*) 
FROM categories 
WHERE image_url LIKE '%pub-0226aad7dbe14d2ba087dca75180dc49.r2.dev%';
