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
