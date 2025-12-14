-- Migration: 003_add_project_form_columns
-- Description: Adds work_scope, project_sector, and delivery_method columns to the projects table
-- These fields are shown on the project form but are currently stored in summary_metadata JSON
-- Date: 2025-12-14

BEGIN;

-- Add work_scope column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS work_scope text;

-- Add project_sector column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_sector text;

-- Add delivery_method column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS delivery_method text;

-- Add constraints for valid values
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_work_scope_check;
ALTER TABLE projects
ADD CONSTRAINT projects_work_scope_check CHECK (
  work_scope IS NULL OR work_scope IN (
    'Ground-Up Construction',
    'Renovation',
    'Tenant Improvement',
    'Interior Build-Out',
    'Maintenance'
  )
);

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_project_sector_check;
ALTER TABLE projects
ADD CONSTRAINT projects_project_sector_check CHECK (
  project_sector IS NULL OR project_sector IN (
    'Commercial',
    'Industrial',
    'Infrastructure',
    'Healthcare',
    'Institutional',
    'Residential'
  )
);

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_delivery_method_check;
ALTER TABLE projects
ADD CONSTRAINT projects_delivery_method_check CHECK (
  delivery_method IS NULL OR delivery_method IN (
    'Design-Bid-Build',
    'Design-Build',
    'Construction Management at Risk',
    'Integrated Project Delivery'
  )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_work_scope ON projects(work_scope);
CREATE INDEX IF NOT EXISTS idx_projects_project_sector ON projects(project_sector);
CREATE INDEX IF NOT EXISTS idx_projects_delivery_method ON projects(delivery_method);

-- Migrate existing data from summary_metadata to new columns
-- Only update rows where the new columns are null to avoid overwriting
UPDATE projects
SET 
  work_scope = CASE 
    WHEN work_scope IS NULL AND summary_metadata->>'work_scope' IS NOT NULL 
    THEN summary_metadata->>'work_scope' 
    ELSE work_scope 
  END,
  project_sector = CASE 
    WHEN project_sector IS NULL AND summary_metadata->>'project_sector' IS NOT NULL 
    THEN summary_metadata->>'project_sector' 
    ELSE project_sector 
  END,
  delivery_method = CASE 
    WHEN delivery_method IS NULL AND summary_metadata->>'delivery_method' IS NOT NULL 
    THEN summary_metadata->>'delivery_method' 
    ELSE delivery_method 
  END
WHERE summary_metadata IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN projects.work_scope IS 'Type of construction work (Ground-Up, Renovation, Tenant Improvement, Interior Build-Out, Maintenance)';
COMMENT ON COLUMN projects.project_sector IS 'Industry sector (Commercial, Industrial, Infrastructure, Healthcare, Institutional, Residential)';
COMMENT ON COLUMN projects.delivery_method IS 'Project delivery method (Design-Bid-Build, Design-Build, Construction Management at Risk, Integrated Project Delivery)';

-- Update Row Level Security policies if needed
-- The existing policies should continue to work since we're just adding columns

COMMIT;