-- Rollback script for 002_procore_video_phase1_schema.sql
-- Run this if you need to undo the migration

-- Drop new tables (in reverse order of dependencies)
DROP TABLE IF EXISTS sov_line_items CASCADE;
DROP TABLE IF EXISTS schedule_of_values CASCADE;
DROP TABLE IF EXISTS project_directory CASCADE;
DROP TABLE IF EXISTS vertical_markup CASCADE;
DROP TABLE IF EXISTS project_cost_codes CASCADE;
DROP TABLE IF EXISTS billing_periods CASCADE;
DROP TABLE IF EXISTS cost_code_types CASCADE;

-- Remove added columns from existing tables
ALTER TABLE projects 
DROP COLUMN IF EXISTS budget_locked,
DROP COLUMN IF EXISTS budget_locked_at,
DROP COLUMN IF EXISTS budget_locked_by;

ALTER TABLE contracts 
DROP COLUMN IF EXISTS retention_percentage,
DROP COLUMN IF EXISTS apply_vertical_markup;

ALTER TABLE commitments 
DROP COLUMN IF EXISTS retention_percentage;

ALTER TABLE change_orders 
DROP COLUMN IF EXISTS apply_vertical_markup;

ALTER TABLE budget_items 
DROP COLUMN IF EXISTS original_amount,
DROP COLUMN IF EXISTS budget_modifications,
DROP COLUMN IF EXISTS approved_cos,
DROP COLUMN IF EXISTS revised_budget,
DROP COLUMN IF EXISTS committed_cost,
DROP COLUMN IF EXISTS direct_cost,
DROP COLUMN IF EXISTS pending_cost_changes,
DROP COLUMN IF EXISTS projected_cost,
DROP COLUMN IF EXISTS forecast_to_complete;