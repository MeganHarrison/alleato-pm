-- =====================================================
-- Budget System Schema Foundation
-- Migration: 008_budget_system_schema.sql
-- Description: Creates budget_codes, sub_jobs, and line item tables for production-grade budget system
-- Date: 2025-12-17
-- =====================================================

-- 1. Create sub_jobs table (project phases)
CREATE TABLE IF NOT EXISTS sub_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_subjob_code UNIQUE (project_id, code)
);

-- 2. Create budget_codes table (grouping level for budget line items)
CREATE TABLE IF NOT EXISTS budget_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL,
    cost_code_id TEXT NOT NULL REFERENCES cost_codes(id),
    cost_type_id UUID REFERENCES cost_code_types(id) ON DELETE SET NULL,
    description TEXT,
    position INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 3. Create budget_line_items table (detail level within budget_code)
CREATE TABLE IF NOT EXISTS budget_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_code_id UUID NOT NULL REFERENCES budget_codes(id) ON DELETE CASCADE,
    description TEXT,
    line_number INTEGER,
    original_amount DECIMAL(15,2) DEFAULT 0,
    unit_qty DECIMAL(15,3),
    uom VARCHAR(50),
    unit_cost DECIMAL(15,2),
    calculation_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 4. Create change_order_line_items table
CREATE TABLE IF NOT EXISTS change_order_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_order_id BIGINT NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
    budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
    cost_code_id TEXT REFERENCES cost_codes(id),
    description TEXT NOT NULL,
    line_number INTEGER,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    unit_qty DECIMAL(15,3),
    uom VARCHAR(50),
    unit_cost DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create direct_cost_line_items table
CREATE TABLE IF NOT EXISTS direct_cost_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
    cost_code_id TEXT REFERENCES cost_codes(id),
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    approved BOOLEAN DEFAULT false,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    cost_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 6. Update existing budget_items table
ALTER TABLE budget_items
    ADD COLUMN IF NOT EXISTS budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL;

-- 7. Note: commitment_line_items table doesn't exist yet
-- TODO: Add commitment_line_items table in future migration if needed

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sub_jobs_project ON sub_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_sub_jobs_active ON sub_jobs(is_active) WHERE is_active = true;

-- Unique index for budget_codes with COALESCE for nullable columns
CREATE UNIQUE INDEX IF NOT EXISTS idx_budget_codes_unique
    ON budget_codes(project_id, cost_code_id, COALESCE(sub_job_id::text, ''), COALESCE(cost_type_id::text, ''));

CREATE INDEX IF NOT EXISTS idx_budget_codes_project ON budget_codes(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_codes_cost_code ON budget_codes(cost_code_id);
CREATE INDEX IF NOT EXISTS idx_budget_codes_cost_type ON budget_codes(cost_type_id) WHERE cost_type_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_budget_codes_subjob ON budget_codes(sub_job_id) WHERE sub_job_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_budget_line_items_budget_code ON budget_line_items(budget_code_id);

CREATE INDEX IF NOT EXISTS idx_change_order_line_items_co ON change_order_line_items(change_order_id);
CREATE INDEX IF NOT EXISTS idx_change_order_line_items_budget ON change_order_line_items(budget_code_id) WHERE budget_code_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_change_order_line_items_cost_code ON change_order_line_items(cost_code_id) WHERE cost_code_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_project ON direct_cost_line_items(project_id);
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_budget ON direct_cost_line_items(budget_code_id) WHERE budget_code_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_cost_code ON direct_cost_line_items(cost_code_id) WHERE cost_code_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_approved ON direct_cost_line_items(approved);
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_date ON direct_cost_line_items(transaction_date);

CREATE INDEX IF NOT EXISTS idx_budget_items_budget_code ON budget_items(budget_code_id) WHERE budget_code_id IS NOT NULL;

-- 9. Enable RLS on new tables
ALTER TABLE sub_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_cost_line_items ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies (basic - all authenticated users can read/write)
CREATE POLICY "sub_jobs_read" ON sub_jobs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "sub_jobs_write" ON sub_jobs FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "budget_codes_read" ON budget_codes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_codes_write" ON budget_codes FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "budget_line_items_read" ON budget_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_line_items_write" ON budget_line_items FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "change_order_line_items_read" ON change_order_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "change_order_line_items_write" ON change_order_line_items FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "direct_cost_line_items_read" ON direct_cost_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "direct_cost_line_items_write" ON direct_cost_line_items FOR ALL USING (auth.uid() IS NOT NULL);

-- 11. Add update triggers for updated_at columns
CREATE TRIGGER update_sub_jobs_updated_at BEFORE UPDATE ON sub_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_codes_updated_at BEFORE UPDATE ON budget_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_line_items_updated_at BEFORE UPDATE ON budget_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_change_order_line_items_updated_at BEFORE UPDATE ON change_order_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_direct_cost_line_items_updated_at BEFORE UPDATE ON direct_cost_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration complete
-- Next: Run migration 009_budget_rollup_views.sql to create calculation views
-- =====================================================
-- Budget System SQL Calculation Views
-- Migration: 009_budget_rollup_views.sql
-- Description: Creates views that calculate all budget columns in SQL (no JavaScript)
-- Date: 2025-12-17
-- =====================================================

-- 1. Create comprehensive budget rollup view
-- This view calculates ALL budget columns from source tables
CREATE OR REPLACE VIEW v_budget_rollup AS
WITH budget_code_aggregates AS (
    SELECT
        bc.id AS budget_code_id,
        bc.project_id,
        bc.sub_job_id,
        bc.cost_code_id,
        bc.cost_type_id,
        bc.description AS budget_code_description,
        bc.position,

        -- Cost code details
        cc.description AS cost_code_description,
        cc.division_id AS cost_code_division,
        ccd.title AS division_title,
        cct.code AS cost_type_code,
        cct.description AS cost_type_description,

        -- 1. Original Budget Amount: SUM(budget_line_items.original_amount)
        COALESCE((
            SELECT SUM(bli.original_amount)
            FROM budget_line_items bli
            WHERE bli.budget_code_id = bc.id
        ), 0) AS original_budget_amount,

        -- 2. Budget Modifications: SUM(approved budget_modifications)
        COALESCE((
            SELECT SUM(bm.amount)
            FROM budget_modifications bm
            JOIN budget_items bi ON bm.budget_item_id = bi.id
            WHERE bi.budget_code_id = bc.id
              AND bm.approved = true
        ), 0) AS budget_modifications,

        -- 3. Approved COs: SUM(approved change_order_line_items)
        COALESCE((
            SELECT SUM(col.amount)
            FROM change_order_line_items col
            JOIN change_orders co ON col.change_order_id = co.id
            WHERE col.budget_code_id = bc.id
              AND co.status = 'approved'
        ), 0) AS approved_cos,

        -- 4. Direct Costs: SUM(approved direct_cost_line_items)
        COALESCE((
            SELECT SUM(dcl.amount)
            FROM direct_cost_line_items dcl
            WHERE dcl.budget_code_id = bc.id
              AND dcl.approved = true
        ), 0) AS direct_costs,

        -- 5. Pending Budget Changes: SUM(pending budget_modifications)
        COALESCE((
            SELECT SUM(bm.amount)
            FROM budget_modifications bm
            JOIN budget_items bi ON bm.budget_item_id = bi.id
            WHERE bi.budget_code_id = bc.id
              AND bm.approved = false
        ), 0) AS pending_changes,

        -- 6. Committed Costs: Set to 0 for now (commitment_line_items table doesn't exist yet)
        0 AS committed_costs,

        -- 7. Pending Cost Changes: Set to 0 for now
        0 AS pending_cost_changes

    FROM budget_codes bc
    LEFT JOIN cost_codes cc ON bc.cost_code_id = cc.id
    LEFT JOIN cost_code_divisions ccd ON cc.division_id = ccd.id
    LEFT JOIN cost_code_types cct ON bc.cost_type_id = cct.id
)
SELECT
    budget_code_id,
    project_id,
    sub_job_id,
    cost_code_id,
    cost_type_id,
    budget_code_description,
    cost_code_description,
    cost_code_division,
    division_title,
    cost_type_code,
    cost_type_description,
    position,

    -- Base columns
    original_budget_amount,
    budget_modifications,
    approved_cos,

    -- CALCULATED: Revised Budget = Original + Mods + Approved COs
    (original_budget_amount + budget_modifications + approved_cos) AS revised_budget,

    -- Cost columns
    direct_costs AS job_to_date_cost,
    direct_costs,
    pending_changes AS pending_budget_changes,

    -- CALCULATED: Projected Budget = Revised + Pending Changes
    (original_budget_amount + budget_modifications + approved_cos + pending_changes) AS projected_budget,

    committed_costs,
    pending_cost_changes,

    -- CALCULATED: Projected Costs = Committed + Pending Cost Changes
    (committed_costs + pending_cost_changes) AS projected_costs,

    -- CALCULATED: Forecast to Complete = Projected Costs - Job-to-Date
    (committed_costs + pending_cost_changes - direct_costs) AS forecast_to_complete,

    -- CALCULATED: Estimated Cost at Completion = Job-to-Date + Forecast
    (direct_costs + (committed_costs + pending_cost_changes - direct_costs)) AS estimated_cost_at_completion,

    -- CALCULATED: Projected Over/Under = Projected Budget - Estimated Cost at Completion
    ((original_budget_amount + budget_modifications + approved_cos + pending_changes) -
     (direct_costs + (committed_costs + pending_cost_changes - direct_costs))) AS projected_over_under
FROM budget_code_aggregates;

-- Grant access to authenticated users
GRANT SELECT ON v_budget_rollup TO authenticated;

-- 2. Create materialized view for performance
-- Use CONCURRENTLY to allow queries during refresh
CREATE MATERIALIZED VIEW mv_budget_rollup AS
SELECT * FROM v_budget_rollup;

-- Create unique index (required for CONCURRENTLY refresh)
CREATE UNIQUE INDEX idx_mv_budget_rollup_id ON mv_budget_rollup(budget_code_id);

-- Create additional indexes for common query patterns
CREATE INDEX idx_mv_budget_rollup_project ON mv_budget_rollup(project_id);
CREATE INDEX idx_mv_budget_rollup_cost_code ON mv_budget_rollup(cost_code_id);
CREATE INDEX idx_mv_budget_rollup_subjob ON mv_budget_rollup(sub_job_id) WHERE sub_job_id IS NOT NULL;
CREATE INDEX idx_mv_budget_rollup_cost_type ON mv_budget_rollup(cost_type_id) WHERE cost_type_id IS NOT NULL;

-- Grant access
GRANT SELECT ON mv_budget_rollup TO authenticated;

-- 3. Create refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_budget_rollup(p_project_id BIGINT DEFAULT NULL)
RETURNS void AS $$
BEGIN
    -- For now, always do full refresh with CONCURRENTLY
    -- This allows queries to continue during refresh
    -- Future optimization: could do partial refresh for specific project
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_budget_rollup;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION refresh_budget_rollup(BIGINT) TO authenticated;

-- 4. Create grand totals view (project-level aggregation)
CREATE OR REPLACE VIEW v_budget_grand_totals AS
SELECT
    project_id,
    SUM(original_budget_amount) AS original_budget_amount,
    SUM(budget_modifications) AS budget_modifications,
    SUM(approved_cos) AS approved_cos,
    SUM(revised_budget) AS revised_budget,
    SUM(job_to_date_cost) AS job_to_date_cost,
    SUM(direct_costs) AS direct_costs,
    SUM(pending_budget_changes) AS pending_budget_changes,
    SUM(projected_budget) AS projected_budget,
    SUM(committed_costs) AS committed_costs,
    SUM(pending_cost_changes) AS pending_cost_changes,
    SUM(projected_costs) AS projected_costs,
    SUM(forecast_to_complete) AS forecast_to_complete,
    SUM(estimated_cost_at_completion) AS estimated_cost_at_completion,
    SUM(projected_over_under) AS projected_over_under
FROM v_budget_rollup
GROUP BY project_id;

-- Grant access
GRANT SELECT ON v_budget_grand_totals TO authenticated;

-- 5. Create view with vertical markup application (for future integration)
CREATE OR REPLACE VIEW v_budget_with_markup AS
WITH project_markups AS (
    SELECT
        project_id,
        jsonb_agg(
            jsonb_build_object(
                'markup_type', markup_type,
                'percentage', percentage,
                'compound', compound,
                'calculation_order', calculation_order
            ) ORDER BY calculation_order
        ) AS markups
    FROM vertical_markup
    GROUP BY project_id
)
SELECT
    br.*,
    pm.markups
FROM v_budget_rollup br
LEFT JOIN project_markups pm ON br.project_id = pm.project_id;

-- Grant access
GRANT SELECT ON v_budget_with_markup TO authenticated;

-- Migration complete
-- All budget calculations now happen in SQL, not JavaScript
-- Next: Update API endpoints to query these views
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
-- =====================================================
-- Migrate Existing Budget Data
-- Migration: 011_migrate_existing_budget_data.sql
-- Description: Migrates existing budget_items to new budget_codes + budget_line_items structure
-- Date: 2025-12-17
-- =====================================================

-- Migrate existing budget_items to new structure
DO $$
DECLARE
    v_budget_item RECORD;
    v_budget_code_id UUID;
    v_migrated_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting budget data migration...';

    -- Loop through all budget_items that haven't been migrated yet
    FOR v_budget_item IN
        SELECT * FROM budget_items
        WHERE budget_code_id IS NULL
        ORDER BY project_id, cost_code_id
    LOOP
        -- Create budget_code (or get existing if already created by another item)
        INSERT INTO budget_codes (
            project_id,
            cost_code_id,
            cost_type_id, -- Will be NULL for now
            sub_job_id, -- Will be NULL for now
            description,
            position,
            created_at,
            created_by
        ) VALUES (
            v_budget_item.project_id,
            v_budget_item.cost_code_id,
            NULL,
            NULL,
            v_budget_item.parent_cost_code,
            999, -- Default position
            v_budget_item.created_at,
            v_budget_item.created_by
        )
        ON CONFLICT (project_id, COALESCE(sub_job_id::text, ''), cost_code_id, COALESCE(cost_type_id::text, ''))
        DO UPDATE SET
            description = EXCLUDED.description,
            updated_at = NOW()
        RETURNING id INTO v_budget_code_id;

        -- If conflict occurred, get the existing budget_code_id
        IF v_budget_code_id IS NULL THEN
            SELECT id INTO v_budget_code_id
            FROM budget_codes
            WHERE project_id = v_budget_item.project_id
              AND cost_code_id = v_budget_item.cost_code_id
              AND sub_job_id IS NULL
              AND cost_type_id IS NULL;
        END IF;

        -- Create budget_line_item from existing budget_item data
        INSERT INTO budget_line_items (
            budget_code_id,
            description,
            original_amount,
            unit_qty,
            uom,
            unit_cost,
            calculation_method,
            created_at,
            updated_at,
            created_by
        ) VALUES (
            v_budget_code_id,
            NULL, -- description at line item level
            COALESCE(v_budget_item.original_amount, v_budget_item.original_budget_amount, 0),
            v_budget_item.unit_qty,
            v_budget_item.uom,
            v_budget_item.unit_cost,
            v_budget_item.calculation_method,
            v_budget_item.created_at,
            v_budget_item.updated_at,
            v_budget_item.created_by
        );

        -- Update budget_items to link to new budget_code
        UPDATE budget_items
        SET budget_code_id = v_budget_code_id,
            updated_at = NOW()
        WHERE id = v_budget_item.id;

        v_migrated_count := v_migrated_count + 1;

        -- Log progress every 100 items
        IF v_migrated_count % 100 = 0 THEN
            RAISE NOTICE 'Migrated % budget items...', v_migrated_count;
        END IF;
    END LOOP;

    RAISE NOTICE 'Migration complete. Migrated % budget items to new structure.', v_migrated_count;

    -- Refresh materialized view to reflect migrated data
    RAISE NOTICE 'Refreshing materialized view...';
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_budget_rollup;
    RAISE NOTICE 'Materialized view refreshed.';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during migration: %', SQLERRM;
        RAISE;
END $$;

-- Verification query (commented out - run manually if needed)
-- SELECT
--     'budget_items' as table_name,
--     COUNT(*) as total_count,
--     COUNT(*) FILTER (WHERE budget_code_id IS NOT NULL) as migrated_count,
--     COUNT(*) FILTER (WHERE budget_code_id IS NULL) as pending_count
-- FROM budget_items;

-- Migration complete
