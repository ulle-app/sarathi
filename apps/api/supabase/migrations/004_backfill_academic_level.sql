-- Backfill academic_level for existing users and ensure assessments have academic_levels
-- This assumes migration 003 added the enum type and columns.

-- Set a default academic_level for users that are NULL
UPDATE users
SET academic_level = 'professional'
WHERE academic_level IS NULL;

-- For assessments that have NULL academic_levels, set to ['professional']
UPDATE assessments
SET academic_levels = ARRAY['professional']::academic_level_enum[]
WHERE academic_levels IS NULL;
