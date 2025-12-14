-- Test script for Phase 1 migration
-- Run this after applying 002_procore_video_phase1_schema.sql to verify

-- Test 1: Verify all new tables exist
SELECT 'schedule_of_values' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'schedule_of_values'
) as exists;

SELECT 'sov_line_items' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'sov_line_items'
) as exists;

SELECT 'billing_periods' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'billing_periods'
) as exists;

SELECT 'cost_code_types' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'cost_code_types'
) as exists;

SELECT 'project_cost_codes' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'project_cost_codes'
) as exists;

SELECT 'vertical_markup' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'vertical_markup'
) as exists;

SELECT 'project_directory' as table_name, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'project_directory'
) as exists;

-- Test 2: Verify new columns on existing tables
SELECT 'projects.budget_locked' as column_name, EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'projects' 
  AND column_name = 'budget_locked'
) as exists;

SELECT 'contracts.retention_percentage' as column_name, EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'contracts' 
  AND column_name = 'retention_percentage'
) as exists;

SELECT 'commitments.retention_percentage' as column_name, EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'commitments' 
  AND column_name = 'retention_percentage'
) as exists;

SELECT 'change_orders.apply_vertical_markup' as column_name, EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'change_orders' 
  AND column_name = 'apply_vertical_markup'
) as exists;

SELECT 'budget_items.original_amount' as column_name, EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'budget_items' 
  AND column_name = 'original_amount'
) as exists;

SELECT 'budget_items.revised_budget' as column_name, EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'budget_items' 
  AND column_name = 'revised_budget'
) as exists;

-- Test 3: Verify cost code types were seeded
SELECT COUNT(*) as cost_code_types_count FROM cost_code_types;

-- Test 4: Verify indexes exist
SELECT 'idx_schedule_of_values_contract' as index_name, EXISTS (
  SELECT FROM pg_indexes 
  WHERE schemaname = 'public' 
  AND indexname = 'idx_schedule_of_values_contract'
) as exists;

-- Test 5: Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('schedule_of_values', 'sov_line_items', 'billing_periods', 
                  'cost_code_types', 'project_cost_codes', 'vertical_markup', 
                  'project_directory');

-- Test 6: Verify view exists
SELECT 'sov_line_items_with_percentage' as view_name, EXISTS (
  SELECT FROM information_schema.views 
  WHERE table_schema = 'public' 
  AND table_name = 'sov_line_items_with_percentage'
) as exists;