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
