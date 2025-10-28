-- Simple Database Verification
-- Verify basic counts

SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_agents FROM agents;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as approved_agents FROM agents WHERE status = 'APPROVED';
SELECT COUNT(*) as agent_category_links FROM agent_categories;
SELECT COUNT(*) as agent_tag_links FROM agent_tags;
