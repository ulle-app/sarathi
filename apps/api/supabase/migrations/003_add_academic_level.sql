-- =============================================
-- Migration: 003_add_academic_level
-- Adds academic life-stage segmentation to users
-- =============================================

DO $$ BEGIN
    CREATE TYPE academic_level_enum AS ENUM (
        'grade_10', 
        'grade_12', 
        'undergraduate', 
        'post_graduate', 
        'professional'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS academic_level academic_level_enum;

-- Index for filtering users by academic level
CREATE INDEX IF NOT EXISTS idx_users_academic_level ON users(academic_level);

-- Add academic_level column to assessments to target specific groups
ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS academic_levels academic_level_enum[] DEFAULT '{}'::academic_level_enum[];

CREATE INDEX IF NOT EXISTS idx_assessments_academic_levels ON assessments USING GIN(academic_levels);
