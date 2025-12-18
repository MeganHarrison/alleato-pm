-- =====================================================
-- Rollback Budget System
-- Migration: 013_rollback_budget_system.sql
-- Description: Rollback script to revert budget system changes if needed
-- Date: 2025-12-17
-- WARNING: This will drop all new budget tables and views
-- =====================================================

-- 1. Drop functions
DROP FUNCTION IF EXISTS compare_budget_snapshots(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS create_budget_snapshot(BIGINT, VARCHAR, VARCHAR, TEXT, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS refresh_budget_rollup(BIGINT) CASCADE;

-- 2. Drop views (in reverse dependency order)
DROP VIEW IF EXISTS v_budget_with_markup CASCADE;
DROP VIEW IF EXISTS v_budget_grand_totals CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_budget_rollup CASCADE;
DROP VIEW IF EXISTS v_budget_rollup CASCADE;

-- 3. Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS budget_snapshots CASCADE;
DROP TABLE IF EXISTS direct_cost_line_items CASCADE;
DROP TABLE IF EXISTS change_order_line_items CASCADE;
DROP TABLE IF EXISTS budget_line_items CASCADE;
DROP TABLE IF EXISTS budget_codes CASCADE;
DROP TABLE IF EXISTS sub_jobs CASCADE;

-- 4. Remove columns added to existing tables
ALTER TABLE budget_items
    DROP COLUMN IF EXISTS budget_code_id,
    DROP COLUMN IF EXISTS sub_job_id;

ALTER TABLE commitment_line_items
    DROP COLUMN IF EXISTS budget_code_id,
    DROP COLUMN IF EXISTS cost_code_id;

-- Rollback complete
-- Budget system reverted to pre-migration state
