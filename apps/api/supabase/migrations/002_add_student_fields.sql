-- =============================================
-- Migration: 002_add_student_fields
-- Adds student-focused metadata to careers
-- =============================================

ALTER TABLE IF EXISTS careers
  ADD COLUMN IF NOT EXISTS recommended_streams TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS education_levels TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS is_student_friendly BOOLEAN DEFAULT false;

-- Add indexes to help filtering student-friendly careers
CREATE INDEX IF NOT EXISTS idx_careers_is_student_friendly ON careers(is_student_friendly);
CREATE INDEX IF NOT EXISTS idx_careers_recommended_streams ON careers USING GIN (recommended_streams);
