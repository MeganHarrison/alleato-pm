-- =====================================================
-- Fix Projects UPDATE RLS Policy
-- Migration: 20251222_fix_projects_update_rls.sql
-- Description: Fix the WITH CHECK clause to match USING clause for editors
-- Date: 2025-12-22
-- Issue: Users with 'editor' access can read but cannot update projects
-- Root Cause: WITH CHECK requires 'admin', but USING allows 'admin' or 'editor'
-- =====================================================

-- Drop the existing policy
DROP POLICY IF EXISTS "projects_update_for_members" ON projects;

-- Recreate with corrected WITH CHECK clause
CREATE POLICY "projects_update_for_members" ON projects
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM project_members pm
            WHERE pm.project_id = projects.id
              AND pm.user_id = auth.uid()
              AND pm.access = ANY (ARRAY['admin'::text, 'editor'::text])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM project_members pm
            WHERE pm.project_id = projects.id
              AND pm.user_id = auth.uid()
              AND pm.access = ANY (ARRAY['admin'::text, 'editor'::text])
        )
    );

-- Migration complete
-- Both USING and WITH CHECK now allow 'admin' or 'editor' access
