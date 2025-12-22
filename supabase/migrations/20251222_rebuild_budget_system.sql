-- =====================================================
-- Budget System Rebuild Migration
-- Migration: 20251222_rebuild_budget_system.sql
-- Description: Complete rebuild of budget system following Procore model
-- Date: 2025-12-22
-- =====================================================

-- STEP 1: Drop old budget tables and views (in safe dependency order)
-- =====================================================

-- Drop views first
DROP VIEW IF EXISTS v_budget_with_markup CASCADE;
DROP VIEW IF EXISTS v_budget_rollup CASCADE;
DROP VIEW IF EXISTS v_budget_grand_totals CASCADE;

-- Drop dependent tables
DROP TABLE IF EXISTS pending_budget_changes CASCADE;
DROP TABLE IF EXISTS budget_snapshots CASCADE;
DROP TABLE IF EXISTS budget_modifications CASCADE;
DROP TABLE IF EXISTS budget_line_items CASCADE;
DROP TABLE IF EXISTS budget_codes CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;

-- STEP 2: Create core budget tables
-- =====================================================

-- 2.1 budget_lines - Main budget bucket table
-- Each row represents a unique combination of project + sub_job + cost_code + cost_type
CREATE TABLE budget_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL,
    cost_code_id TEXT NOT NULL REFERENCES cost_codes(id),
    cost_type_id UUID NOT NULL REFERENCES cost_code_types(id),
    description TEXT,
    original_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Enforce uniqueness with nullable sub_job_id using generated column
    sub_job_key UUID GENERATED ALWAYS AS (
        COALESCE(sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) STORED,

    CONSTRAINT uq_budget_line UNIQUE (project_id, sub_job_key, cost_code_id, cost_type_id)
);

-- 2.2 budget_modifications - Header table for internal budget adjustments
CREATE TABLE budget_modifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'void')),
    effective_date DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_budget_mod_number UNIQUE (project_id, number)
);

-- 2.3 budget_mod_lines - Line items for budget modifications
CREATE TABLE budget_mod_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_modification_id UUID NOT NULL REFERENCES budget_modifications(id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL,
    cost_code_id TEXT NOT NULL REFERENCES cost_codes(id),
    cost_type_id UUID NOT NULL REFERENCES cost_code_types(id),
    amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Verify change_orders table exists (should already exist)
-- If not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'change_orders') THEN
        CREATE TABLE change_orders (
            id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            number TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'void')),
            approved_at TIMESTAMPTZ,
            created_by UUID REFERENCES auth.users(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CONSTRAINT uq_change_order_number UNIQUE (project_id, number)
        );
    END IF;
END $$;

-- 2.5 Drop and recreate change_order_lines to match new budget structure
DROP TABLE IF EXISTS change_order_line_items CASCADE;
DROP TABLE IF EXISTS change_order_lines CASCADE;

CREATE TABLE change_order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_order_id BIGINT NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL,
    cost_code_id TEXT NOT NULL REFERENCES cost_codes(id),
    cost_type_id UUID NOT NULL REFERENCES cost_code_types(id),
    amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- STEP 3: Create indexes for performance
-- =====================================================

-- budget_lines indexes
CREATE INDEX idx_budget_lines_project ON budget_lines(project_id);
CREATE INDEX idx_budget_lines_cost_code ON budget_lines(cost_code_id);
CREATE INDEX idx_budget_lines_cost_type ON budget_lines(cost_type_id);
CREATE INDEX idx_budget_lines_sub_job ON budget_lines(sub_job_id) WHERE sub_job_id IS NOT NULL;

-- budget_modifications indexes
CREATE INDEX idx_budget_mods_project ON budget_modifications(project_id);
CREATE INDEX idx_budget_mods_status ON budget_modifications(status);

-- budget_mod_lines indexes
CREATE INDEX idx_budget_mod_lines_mod ON budget_mod_lines(budget_modification_id);
CREATE INDEX idx_budget_mod_lines_project ON budget_mod_lines(project_id);
CREATE INDEX idx_budget_mod_lines_cost_code ON budget_mod_lines(cost_code_id);
CREATE INDEX idx_budget_mod_lines_cost_type ON budget_mod_lines(cost_type_id);

-- change_order_lines indexes
CREATE INDEX idx_co_lines_change_order ON change_order_lines(change_order_id);
CREATE INDEX idx_co_lines_project ON change_order_lines(project_id);
CREATE INDEX idx_co_lines_cost_code ON change_order_lines(cost_code_id);
CREATE INDEX idx_co_lines_cost_type ON change_order_lines(cost_type_id);

-- STEP 4: Create views for computed budget totals
-- =====================================================

-- v_budget_lines - Main budget view with computed totals
CREATE OR REPLACE VIEW v_budget_lines AS
SELECT
    bl.id,
    bl.project_id,
    bl.sub_job_id,
    bl.cost_code_id,
    bl.cost_type_id,
    bl.description,
    bl.original_amount,
    bl.created_by,
    bl.created_at,
    bl.updated_at,

    -- Computed: sum of approved budget modifications
    COALESCE((
        SELECT SUM(bml.amount)
        FROM budget_mod_lines bml
        JOIN budget_modifications bm ON bml.budget_modification_id = bm.id
        WHERE bm.status = 'approved'
          AND bml.project_id = bl.project_id
          AND COALESCE(bml.sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid) = bl.sub_job_key
          AND bml.cost_code_id = bl.cost_code_id
          AND bml.cost_type_id = bl.cost_type_id
    ), 0) AS budget_mod_total,

    -- Computed: sum of approved change order lines
    COALESCE((
        SELECT SUM(col.amount)
        FROM change_order_lines col
        JOIN change_orders co ON col.change_order_id = co.id
        WHERE co.status = 'approved'
          AND col.project_id = bl.project_id
          AND COALESCE(col.sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid) = bl.sub_job_key
          AND col.cost_code_id = bl.cost_code_id
          AND col.cost_type_id = bl.cost_type_id
    ), 0) AS approved_co_total,

    -- Computed: revised budget
    bl.original_amount +
    COALESCE((
        SELECT SUM(bml.amount)
        FROM budget_mod_lines bml
        JOIN budget_modifications bm ON bml.budget_modification_id = bm.id
        WHERE bm.status = 'approved'
          AND bml.project_id = bl.project_id
          AND COALESCE(bml.sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid) = bl.sub_job_key
          AND bml.cost_code_id = bl.cost_code_id
          AND bml.cost_type_id = bl.cost_type_id
    ), 0) +
    COALESCE((
        SELECT SUM(col.amount)
        FROM change_order_lines col
        JOIN change_orders co ON col.change_order_id = co.id
        WHERE co.status = 'approved'
          AND col.project_id = bl.project_id
          AND COALESCE(col.sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid) = bl.sub_job_key
          AND col.cost_code_id = bl.cost_code_id
          AND col.cost_type_id = bl.cost_type_id
    ), 0) AS revised_budget

FROM budget_lines bl;

-- STEP 5: Enable RLS on new tables
-- =====================================================

ALTER TABLE budget_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_mod_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_order_lines ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create RLS policies
-- =====================================================

-- budget_lines policies
CREATE POLICY "budget_lines_select" ON budget_lines FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_lines_insert" ON budget_lines FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "budget_lines_update" ON budget_lines FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_lines_delete" ON budget_lines FOR DELETE USING (auth.uid() IS NOT NULL);

-- budget_modifications policies
CREATE POLICY "budget_modifications_select" ON budget_modifications FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_modifications_insert" ON budget_modifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "budget_modifications_update" ON budget_modifications FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_modifications_delete" ON budget_modifications FOR DELETE USING (auth.uid() IS NOT NULL);

-- budget_mod_lines policies
CREATE POLICY "budget_mod_lines_select" ON budget_mod_lines FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_mod_lines_insert" ON budget_mod_lines FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "budget_mod_lines_update" ON budget_mod_lines FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_mod_lines_delete" ON budget_mod_lines FOR DELETE USING (auth.uid() IS NOT NULL);

-- change_order_lines policies
CREATE POLICY "change_order_lines_select" ON change_order_lines FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "change_order_lines_insert" ON change_order_lines FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "change_order_lines_update" ON change_order_lines FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "change_order_lines_delete" ON change_order_lines FOR DELETE USING (auth.uid() IS NOT NULL);

-- STEP 7: Add update triggers for updated_at columns
-- =====================================================

CREATE TRIGGER budget_lines_updated_at
    BEFORE UPDATE ON budget_lines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER budget_modifications_updated_at
    BEFORE UPDATE ON budget_modifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER budget_mod_lines_updated_at
    BEFORE UPDATE ON budget_mod_lines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER change_order_lines_updated_at
    BEFORE UPDATE ON change_order_lines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration complete
-- Budget system rebuilt following Procore model with:
-- - budget_lines (main bucket table)
-- - budget_modifications + budget_mod_lines (internal adjustments)
-- - change_orders + change_order_lines (client-approved changes)
-- - v_budget_lines view (computed totals)
