-- Demo Reviews for Testing
-- These will be pre-approved reviews

-- Reviews for ChatGPT (agent_id = 1, assuming it exists)
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, review_title, review_summary, status, created_at)
VALUES 
(1, 1, 5, 'Absolutely game-changing AI assistant', 'ChatGPT has revolutionized how I work. The responses are incredibly accurate and helpful. It saves me hours of research time every day. Highly recommended for professionals and students alike!', 'APPROVED', datetime('now', '-15 days')),
(2, 1, 4, 'Great but sometimes slow', 'Overall excellent AI tool. Very helpful for coding and writing tasks. The only downside is that it can be slow during peak hours. Still worth the subscription though!', 'APPROVED', datetime('now', '-10 days')),
(3, 1, 5, 'Best AI chatbot available', 'I have tried many AI assistants, and ChatGPT is by far the best. The quality of responses and the ability to understand context is unmatched. Perfect for daily use!', 'APPROVED', datetime('now', '-5 days'));

-- Reviews for Claude (agent_id = 2)
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, review_title, review_summary, status, created_at)
VALUES 
(1, 2, 5, 'More thoughtful than competitors', 'Claude provides more nuanced and thoughtful responses compared to other AI assistants. Excellent for complex reasoning tasks and analysis. The 100k token context is a game changer!', 'APPROVED', datetime('now', '-12 days')),
(2, 2, 4, 'Great for coding projects', 'Very impressed with Claude coding abilities. It understands project context better than alternatives. The longer context window makes it perfect for large codebases.', 'APPROVED', datetime('now', '-8 days'));

-- Reviews for GitHub Copilot (agent_id = 3)
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, review_title, review_summary, status, created_at)
VALUES 
(1, 3, 5, 'Must-have for developers', 'GitHub Copilot has increased my coding productivity by at least 30%. The code suggestions are incredibly accurate and it learns from my coding style. Worth every penny!', 'APPROVED', datetime('now', '-14 days')),
(3, 3, 5, 'Revolutionary coding assistant', 'This tool has changed how I code. It handles boilerplate code automatically and suggests solutions I had not thought of. Essential for modern development.', 'APPROVED', datetime('now', '-7 days')),
(2, 3, 4, 'Good but needs improvement', 'Copilot is very helpful for most coding tasks. Sometimes suggestions can be off-target, but when it works, it works brilliantly. Overall a solid investment for developers.', 'APPROVED', datetime('now', '-3 days'));

-- Reviews for Midjourney (agent_id = 4)
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, review_title, review_summary, status, created_at)
VALUES 
(1, 4, 5, 'Best AI art generator', 'Midjourney creates stunning, professional-quality images. The level of detail and artistic style is unmatched. Perfect for designers, marketers, and creatives!', 'APPROVED', datetime('now', '-11 days')),
(2, 4, 5, 'Amazing for creative projects', 'The quality of images is mind-blowing. I use it daily for client projects and the results are always impressive. The community and prompts library are fantastic resources.', 'APPROVED', datetime('now', '-6 days'));

-- Pending review (not yet approved)
INSERT OR IGNORE INTO reviews (user_id, agent_id, rating, review_title, review_summary, status, created_at)
VALUES 
(3, 1, 3, 'Decent but overpriced', 'The AI is good but I think the pricing is too high for what you get. There are cheaper alternatives that work almost as well.', 'PENDING', datetime('now', '-1 days'));
