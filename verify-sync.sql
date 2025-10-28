-- Database Synchronization Verification Script
-- Run this against both local and production databases to verify they match

-- Count all main tables
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'agents', COUNT(*) FROM agents
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'agent_categories', COUNT(*) FROM agent_categories
UNION ALL
SELECT 'agent_tags', COUNT(*) FROM agent_tags
UNION ALL
SELECT 'features', COUNT(*) FROM features
UNION ALL
SELECT 'use_cases', COUNT(*) FROM use_cases;

-- Verify all agents are APPROVED (except Pending Agent)
SELECT 
  COUNT(*) as approved_agents 
FROM agents 
WHERE status = 'APPROVED';

-- Verify all categories have agents linked
SELECT 
  c.id,
  c.name,
  COUNT(ac.agent_id) as agent_count
FROM categories c
LEFT JOIN agent_categories ac ON c.id = ac.category_id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Verify agent-category relationships
SELECT 
  a.name as agent_name,
  GROUP_CONCAT(c.name, ', ') as categories
FROM agents a
LEFT JOIN agent_categories ac ON a.id = ac.agent_id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'APPROVED'
GROUP BY a.id, a.name
ORDER BY a.id;

-- Check for orphaned records
SELECT 'Orphaned agent_categories' as check_type, COUNT(*) as count
FROM agent_categories ac
LEFT JOIN agents a ON ac.agent_id = a.id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.id IS NULL OR c.id IS NULL
UNION ALL
SELECT 'Orphaned agent_tags', COUNT(*)
FROM agent_tags at
LEFT JOIN agents a ON at.agent_id = a.id
LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.id IS NULL OR t.id IS NULL;
