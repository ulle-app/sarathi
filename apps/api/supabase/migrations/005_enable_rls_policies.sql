-- =============================================
-- Sarathi Database Security Enhancement
-- Migration: 005_enable_rls_policies
-- =============================================
-- This migration enables Row Level Security (RLS) policies
-- to ensure users can only access their own data.

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Note: Keep assessments and careers tables open for reading
-- as they are public content
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can only view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

-- Users can only update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Only admins can delete users
CREATE POLICY "users_delete_admin" ON users
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

-- Service role can do everything (bypasses RLS anyway)
-- This is for the backend API using service_role key

-- =============================================
-- REFRESH TOKENS TABLE POLICIES
-- =============================================

-- Users can only see their own refresh tokens
CREATE POLICY "refresh_tokens_select_own" ON refresh_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own refresh tokens
CREATE POLICY "refresh_tokens_insert_own" ON refresh_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own refresh tokens
CREATE POLICY "refresh_tokens_delete_own" ON refresh_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ASSESSMENT RESULTS TABLE POLICIES
-- =============================================

-- Users can only view their own assessment results
CREATE POLICY "assessment_results_select_own" ON assessment_results
  FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

-- Users can only insert their own assessment results
CREATE POLICY "assessment_results_insert_own" ON assessment_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own assessment results
CREATE POLICY "assessment_results_update_own" ON assessment_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own assessment results
CREATE POLICY "assessment_results_delete_own" ON assessment_results
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- ASSESSMENTS TABLE POLICIES (Public Read)
-- =============================================

-- Everyone can read active assessments
CREATE POLICY "assessments_select_all" ON assessments
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify assessments
CREATE POLICY "assessments_insert_admin" ON assessments
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

CREATE POLICY "assessments_update_admin" ON assessments
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

CREATE POLICY "assessments_delete_admin" ON assessments
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

-- =============================================
-- CAREERS TABLE POLICIES (Public Read)
-- =============================================

-- Everyone can read active careers
CREATE POLICY "careers_select_all" ON careers
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify careers
CREATE POLICY "careers_insert_admin" ON careers
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

CREATE POLICY "careers_update_admin" ON careers
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

CREATE POLICY "careers_delete_admin" ON careers
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND 'admin' = ANY(roles)
  ));

-- =============================================
-- GRANT SERVICE ROLE FULL ACCESS
-- =============================================
-- The service_role key bypasses RLS by default in Supabase
-- This ensures our backend API can still access all data

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON POLICY "users_select_own" ON users IS 
  'Users can only view their own profile. Admins can view all.';
COMMENT ON POLICY "users_update_own" ON users IS 
  'Users can only update their own profile.';
COMMENT ON POLICY "users_delete_admin" ON users IS 
  'Only admins can delete user accounts.';

COMMENT ON POLICY "assessment_results_select_own" ON assessment_results IS 
  'Users can only view their own assessment results. Admins can view all.';
COMMENT ON POLICY "assessment_results_insert_own" ON assessment_results IS 
  'Users can only create assessment results for themselves.';
COMMENT ON POLICY "assessment_results_update_own" ON assessment_results IS 
  'Users can only update their own assessment results.';
COMMENT ON POLICY "assessment_results_delete_own" ON assessment_results IS 
  'Users can only delete their own assessment results.';

-- =============================================
-- DATA PRIVACY INDEX
-- =============================================
-- Create index on user_id for efficient RLS policy evaluation

CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id_created 
  ON assessment_results(user_id, created_at DESC);
