-- Add review_title and review_summary columns to reviews table
-- Rename content to review_summary if it exists, or add new columns

-- Add review_title column
ALTER TABLE reviews ADD COLUMN review_title TEXT;

-- Add review_summary column (we'll keep content as well for backwards compatibility)
ALTER TABLE reviews ADD COLUMN review_summary TEXT;

-- Update existing reviews to copy content to review_summary
UPDATE reviews SET review_summary = content WHERE review_summary IS NULL AND content IS NOT NULL;
