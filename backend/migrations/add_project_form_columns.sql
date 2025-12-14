-- Migration: Add missing project form columns
-- Description: Adds work_scope, project_sector, and delivery_method columns to the projects table
-- These fields are currently stored in summary_metadata JSON but should be proper columns

-- Add work_scope column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS work_scope text;

-- Add project_sector column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_sector text;

-- Add delivery_method column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS delivery_method text;

-- Add constraints for valid values (optional but recommended)
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
-- This assumes the data is stored in summary_metadata as shown in the form
UPDATE projects
SET 
  work_scope = COALESCE(work_scope, summary_metadata->>'work_scope'),
  project_sector = COALESCE(project_sector, summary_metadata->>'project_sector'),
  delivery_method = COALESCE(delivery_method, summary_metadata->>'delivery_method')
WHERE summary_metadata IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN projects.work_scope IS 'Type of construction work (Ground-Up, Renovation, etc.)';
COMMENT ON COLUMN projects.project_sector IS 'Industry sector (Commercial, Healthcare, etc.)';
COMMENT ON COLUMN projects.delivery_method IS 'Project delivery method (Design-Build, etc.)';