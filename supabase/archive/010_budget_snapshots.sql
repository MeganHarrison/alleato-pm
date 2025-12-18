-- =====================================================
-- Budget Snapshot System
-- Migration: 010_budget_snapshots.sql
-- Description: Creates snapshot system for point-in-time budget captures
-- Date: 2025-12-17
-- =====================================================

-- 1. Create budget_snapshots table
CREATE TABLE IF NOT EXISTS budget_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    -- Snapshot metadata
    snapshot_name VARCHAR(255) NOT NULL,
    snapshot_type VARCHAR(50) DEFAULT 'manual' CHECK (snapshot_type IN ('manual', 'monthly', 'milestone', 'baseline')),
    description TEXT,

    -- Snapshot data (JSONB for flexibility and historical accuracy)
    line_items JSONB NOT NULL,
    grand_totals JSONB NOT NULL,
    project_metadata JSONB,

    -- Comparison baseline
    is_baseline BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT uq_snapshot_name UNIQUE (project_id, snapshot_name)
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_project ON budget_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_created_at ON budget_snapshots(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_type ON budget_snapshots(snapshot_type);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_baseline ON budget_snapshots(is_baseline) WHERE is_baseline = true;

-- 3. Enable RLS
ALTER TABLE budget_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budget_snapshots_read" ON budget_snapshots FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_snapshots_write" ON budget_snapshots FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Create function to create snapshot
CREATE OR REPLACE FUNCTION create_budget_snapshot(
    p_project_id BIGINT,
    p_snapshot_name VARCHAR(255),
    p_snapshot_type VARCHAR(50) DEFAULT 'manual',
    p_description TEXT DEFAULT NULL,
    p_is_baseline BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    v_snapshot_id UUID;
    v_line_items JSONB;
    v_grand_totals JSONB;
    v_project_metadata JSONB;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();

    -- Refresh materialized view first to ensure accuracy
    PERFORM refresh_budget_rollup(p_project_id);

    -- Get line items from view
    SELECT jsonb_agg(row_to_json(br)::jsonb)
    INTO v_line_items
    FROM v_budget_rollup br
    WHERE br.project_id = p_project_id;

    -- Get grand totals from view
    SELECT row_to_json(gt)::jsonb
    INTO v_grand_totals
    FROM v_budget_grand_totals gt
    WHERE gt.project_id = p_project_id;

    -- Get project metadata
    SELECT jsonb_build_object(
        'name', p.name,
        'code', p.code,
        'status', p.status,
        'start_date', p.start_date,
        'end_date', p.end_date
    )
    INTO v_project_metadata
    FROM projects p
    WHERE p.id = p_project_id;

    -- Insert snapshot
    INSERT INTO budget_snapshots (
        project_id,
        snapshot_name,
        snapshot_type,
        description,
        line_items,
        grand_totals,
        project_metadata,
        is_baseline,
        created_by
    ) VALUES (
        p_project_id,
        p_snapshot_name,
        p_snapshot_type,
        p_description,
        v_line_items,
        v_grand_totals,
        v_project_metadata,
        p_is_baseline,
        v_user_id
    )
    RETURNING id INTO v_snapshot_id;

    RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_budget_snapshot(BIGINT, VARCHAR, VARCHAR, TEXT, BOOLEAN) TO authenticated;

-- 5. Create function for snapshot comparison
CREATE OR REPLACE FUNCTION compare_budget_snapshots(
    p_snapshot_id_1 UUID,
    p_snapshot_id_2 UUID
)
RETURNS TABLE (
    budget_code_id UUID,
    cost_code_id TEXT,
    cost_code_description TEXT,

    -- Snapshot 1 values
    original_budget_1 NUMERIC(15,2),
    revised_budget_1 NUMERIC(15,2),
    projected_costs_1 NUMERIC(15,2),
    projected_over_under_1 NUMERIC(15,2),

    -- Snapshot 2 values
    original_budget_2 NUMERIC(15,2),
    revised_budget_2 NUMERIC(15,2),
    projected_costs_2 NUMERIC(15,2),
    projected_over_under_2 NUMERIC(15,2),

    -- Deltas
    delta_original_budget NUMERIC(15,2),
    delta_revised_budget NUMERIC(15,2),
    delta_projected_costs NUMERIC(15,2),
    delta_projected_over_under NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH
    snapshot1_items AS (
        SELECT
            (item->>'budget_code_id')::UUID as budget_code_id,
            item->>'cost_code_id' as cost_code_id,
            item->>'cost_code_description' as cost_code_description,
            (item->>'original_budget_amount')::NUMERIC(15,2) as original_budget,
            (item->>'revised_budget')::NUMERIC(15,2) as revised_budget,
            (item->>'projected_costs')::NUMERIC(15,2) as projected_costs,
            (item->>'projected_over_under')::NUMERIC(15,2) as projected_over_under
        FROM budget_snapshots bs,
             jsonb_array_elements(bs.line_items) as item
        WHERE bs.id = p_snapshot_id_1
    ),
    snapshot2_items AS (
        SELECT
            (item->>'budget_code_id')::UUID as budget_code_id,
            item->>'cost_code_id' as cost_code_id,
            item->>'cost_code_description' as cost_code_description,
            (item->>'original_budget_amount')::NUMERIC(15,2) as original_budget,
            (item->>'revised_budget')::NUMERIC(15,2) as revised_budget,
            (item->>'projected_costs')::NUMERIC(15,2) as projected_costs,
            (item->>'projected_over_under')::NUMERIC(15,2) as projected_over_under
        FROM budget_snapshots bs,
             jsonb_array_elements(bs.line_items) as item
        WHERE bs.id = p_snapshot_id_2
    )
    SELECT
        COALESCE(s1.budget_code_id, s2.budget_code_id) as budget_code_id,
        COALESCE(s1.cost_code_id, s2.cost_code_id) as cost_code_id,
        COALESCE(s1.cost_code_description, s2.cost_code_description) as cost_code_description,

        COALESCE(s1.original_budget, 0) as original_budget_1,
        COALESCE(s1.revised_budget, 0) as revised_budget_1,
        COALESCE(s1.projected_costs, 0) as projected_costs_1,
        COALESCE(s1.projected_over_under, 0) as projected_over_under_1,

        COALESCE(s2.original_budget, 0) as original_budget_2,
        COALESCE(s2.revised_budget, 0) as revised_budget_2,
        COALESCE(s2.projected_costs, 0) as projected_costs_2,
        COALESCE(s2.projected_over_under, 0) as projected_over_under_2,

        COALESCE(s2.original_budget, 0) - COALESCE(s1.original_budget, 0) as delta_original_budget,
        COALESCE(s2.revised_budget, 0) - COALESCE(s1.revised_budget, 0) as delta_revised_budget,
        COALESCE(s2.projected_costs, 0) - COALESCE(s1.projected_costs, 0) as delta_projected_costs,
        COALESCE(s2.projected_over_under, 0) - COALESCE(s1.projected_over_under, 0) as delta_projected_over_under
    FROM snapshot1_items s1
    FULL OUTER JOIN snapshot2_items s2 ON s1.budget_code_id = s2.budget_code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION compare_budget_snapshots(UUID, UUID) TO authenticated;

-- Migration complete
-- Snapshot system ready for point-in-time budget captures
