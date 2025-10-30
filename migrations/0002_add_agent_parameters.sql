-- Add new agent parameter columns
-- Migration: 0002_add_agent_parameters.sql
-- Created: 2025-10-29

-- Primary Function (e.g., Task Automation, Web Research, Marketing Agent)
ALTER TABLE agents ADD COLUMN primary_function TEXT;

-- Ideal User (e.g., Marketers, Developers, Sales Teams, Personal Use)
ALTER TABLE agents ADD COLUMN ideal_user TEXT;

-- Free Tier / Trial (e.g., Yes 7-day trial, Yes 500 free actions)
ALTER TABLE agents ADD COLUMN free_tier_details TEXT;

-- Starting Price (e.g., $20/month) - already have pricing_model and pricing_starts_at
-- Using existing pricing_starts_at column

-- Autonomy Level (1 = Fully Autonomous, 0 = Human-in-the-Loop)
ALTER TABLE agents ADD COLUMN autonomy_level INTEGER DEFAULT 0;

-- Web Browsing capability (1 = Yes, 0 = No)
ALTER TABLE agents ADD COLUMN web_browsing INTEGER DEFAULT 0;

-- File/Document Analysis (supported file types as comma-separated: PDF,CSV,TXT)
ALTER TABLE agents ADD COLUMN file_analysis_support TEXT;

-- Long-Term Memory (1 = Yes, 0 = No)
ALTER TABLE agents ADD COLUMN long_term_memory INTEGER DEFAULT 0;

-- Code Execution (supported languages as comma-separated: Python,JavaScript)
ALTER TABLE agents ADD COLUMN code_execution_support TEXT;

-- API & Integrations (comma-separated: Zapier,Slack,Gmail)
ALTER TABLE agents ADD COLUMN integrations_support TEXT;

-- Multi-Agent Mode (1 = Yes, can spawn sub-agents, 0 = No)
ALTER TABLE agents ADD COLUMN multi_agent_mode INTEGER DEFAULT 0;

-- Create index for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_agents_autonomy ON agents(autonomy_level);
CREATE INDEX IF NOT EXISTS idx_agents_web_browsing ON agents(web_browsing);
CREATE INDEX IF NOT EXISTS idx_agents_primary_function ON agents(primary_function);
