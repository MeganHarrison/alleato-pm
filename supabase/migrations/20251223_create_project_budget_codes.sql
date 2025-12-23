-- =====================================================
-- Project Budget Codes Migration
-- Migration: 20251223_create_project_budget_codes.sql
-- Description: Create project_budget_codes table for manual WBS code creation
-- Date: 2025-12-23
-- =====================================================

-- STEP 1: Create project_budget_codes table
-- =====================================================
-- This table stores manually created "WBS codes" / "Budget Codes" for each project
-- Each row represents a selectable budget code option with REQUIRED cost_type_id

CREATE TABLE IF NOT EXISTS project_budget_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL,
    cost_code_id TEXT NOT NULL REFERENCES cost_codes(id),
    cost_type_id UUID NOT NULL REFERENCES cost_code_types(id), -- REQUIRED (NOT NULL)
    description TEXT NOT NULL,
    description_mode TEXT NOT NULL DEFAULT 'concatenated' CHECK (description_mode IN ('concatenated', 'custom')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Enforce uniqueness using generated column for nullable sub_job_id
    sub_job_key UUID GENERATED ALWAYS AS (
        COALESCE(sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) STORED,

    CONSTRAINT uq_project_budget_code UNIQUE (project_id, sub_job_key, cost_code_id, cost_type_id)
);

-- STEP 2: Create indexes
-- =====================================================

CREATE INDEX idx_project_budget_codes_project_id ON project_budget_codes(project_id);
CREATE INDEX idx_project_budget_codes_project_cost_code ON project_budget_codes(project_id, cost_code_id);
CREATE INDEX idx_project_budget_codes_project_cost_type ON project_budget_codes(project_id, cost_type_id);
CREATE INDEX idx_project_budget_codes_active ON project_budget_codes(project_id, is_active) WHERE is_active = true;

-- STEP 3: Add project_budget_code_id to budget_lines
-- =====================================================

-- Add the foreign key column (nullable for now during migration)
ALTER TABLE budget_lines
ADD COLUMN IF NOT EXISTS project_budget_code_id UUID REFERENCES project_budget_codes(id) ON DELETE RESTRICT;

-- Create index on the FK
CREATE INDEX IF NOT EXISTS idx_budget_lines_project_budget_code_id ON budget_lines(project_budget_code_id);

-- STEP 4: Create trigger to auto-populate budget_lines from project_budget_codes
-- =====================================================

CREATE OR REPLACE FUNCTION set_budget_line_from_project_budget_code()
RETURNS TRIGGER AS $$
DECLARE
    pbc_record project_budget_codes%ROWTYPE;
BEGIN
    -- If project_budget_code_id is provided, fetch and populate fields
    IF NEW.project_budget_code_id IS NOT NULL THEN
        SELECT * INTO pbc_record
        FROM project_budget_codes
        WHERE id = NEW.project_budget_code_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'project_budget_code_id % does not exist', NEW.project_budget_code_id;
        END IF;

        -- Verify project_id matches
        IF pbc_record.project_id != NEW.project_id THEN
            RAISE EXCEPTION 'project_budget_code project_id does not match budget_line project_id';
        END IF;

        -- Auto-populate fields from project_budget_code
        NEW.sub_job_id := pbc_record.sub_job_id;
        NEW.cost_code_id := pbc_record.cost_code_id;
        NEW.cost_type_id := pbc_record.cost_type_id;

        -- Use project_budget_code description if budget_line description is null
        IF NEW.description IS NULL OR NEW.description = '' THEN
            NEW.description := pbc_record.description;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_budget_line_from_project_budget_code
BEFORE INSERT OR UPDATE ON budget_lines
FOR EACH ROW
EXECUTE FUNCTION set_budget_line_from_project_budget_code();

-- STEP 5: Create RLS policies
-- =====================================================

-- Enable RLS
ALTER TABLE project_budget_codes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read project budget codes for projects they can access
CREATE POLICY project_budget_codes_select_for_members
ON project_budget_codes
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM project_team_members ptm
        WHERE ptm.project_id = project_budget_codes.project_id
        AND ptm.user_id = auth.uid()
    )
);

-- Allow authenticated users to insert project budget codes for projects they can access
CREATE POLICY project_budget_codes_insert_for_members
ON project_budget_codes
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM project_team_members ptm
        WHERE ptm.project_id = project_budget_codes.project_id
        AND ptm.user_id = auth.uid()
    )
);

-- Allow authenticated users to update project budget codes for projects they can access
CREATE POLICY project_budget_codes_update_for_members
ON project_budget_codes
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM project_team_members ptm
        WHERE ptm.project_id = project_budget_codes.project_id
        AND ptm.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM project_team_members ptm
        WHERE ptm.project_id = project_budget_codes.project_id
        AND ptm.user_id = auth.uid()
    )
);

-- Allow authenticated users to delete project budget codes for projects they can access
CREATE POLICY project_budget_codes_delete_for_members
ON project_budget_codes
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM project_team_members ptm
        WHERE ptm.project_id = project_budget_codes.project_id
        AND ptm.user_id = auth.uid()
    )
);

-- STEP 6: Add helpful comments
-- =====================================================

COMMENT ON TABLE project_budget_codes IS 'Manually created WBS/Budget Codes for projects. Each row represents a selectable budget code option with required cost type.';
COMMENT ON COLUMN project_budget_codes.cost_type_id IS 'REQUIRED: Cost type must be selected when creating a project budget code';
COMMENT ON COLUMN project_budget_codes.description_mode IS 'How description was created: concatenated (auto-generated) or custom (user-provided)';
COMMENT ON COLUMN project_budget_codes.is_active IS 'Whether this budget code is active and should appear in dropdowns';
