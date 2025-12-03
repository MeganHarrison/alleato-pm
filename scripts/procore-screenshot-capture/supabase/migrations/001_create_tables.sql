-- Procore Screenshot Analysis Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MAIN TABLES
-- ============================================

-- Capture sessions - each time you run the script
CREATE TABLE IF NOT EXISTS procore_capture_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  capture_type TEXT NOT NULL CHECK (capture_type IN ('public_docs', 'authenticated_app', 'manual')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  total_screenshots INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Screenshot metadata
CREATE TABLE IF NOT EXISTS procore_screenshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES procore_capture_sessions(id) ON DELETE CASCADE,
  
  -- Identification
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Source info
  source_url TEXT,
  page_title TEXT,
  
  -- Screenshot types
  fullpage_path TEXT,
  viewport_path TEXT,
  
  -- Supabase Storage paths (if uploaded)
  fullpage_storage_path TEXT,
  viewport_storage_path TEXT,
  
  -- Metadata
  viewport_width INTEGER,
  viewport_height INTEGER,
  fullpage_height INTEGER,
  file_size_bytes INTEGER,
  
  -- Analysis fields (for future AI processing)
  description TEXT,
  detected_components JSONB DEFAULT '[]'::jsonb,
  color_palette JSONB DEFAULT '[]'::jsonb,
  ai_analysis JSONB,
  
  -- Timestamps
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- UI Components extracted from screenshots
CREATE TABLE IF NOT EXISTS procore_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screenshot_id UUID REFERENCES procore_screenshots(id) ON DELETE CASCADE,
  
  -- Component info
  component_type TEXT NOT NULL, -- 'button', 'table', 'form', 'sidebar', 'modal', etc.
  component_name TEXT,
  
  -- Position in screenshot
  x INTEGER,
  y INTEGER,
  width INTEGER,
  height INTEGER,
  
  -- Storage
  local_path TEXT,
  storage_path TEXT,
  
  -- Analysis
  styles JSONB, -- Extracted CSS-like properties
  content TEXT, -- Text content if any
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Procore modules/features catalog
CREATE TABLE IF NOT EXISTS procore_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Module identification
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'project_management', 'financials', 'quality_safety', etc.
  
  -- URLs
  app_path TEXT, -- e.g., '/projects/{PROJECT_ID}/project/daily_log'
  docs_url TEXT,
  
  -- Analysis
  complexity TEXT CHECK (complexity IN ('low', 'medium', 'high', 'very_high')),
  priority TEXT CHECK (priority IN ('must_have', 'nice_to_have', 'skip')),
  estimated_build_weeks INTEGER,
  
  -- Features
  key_features JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb, -- Other modules this depends on
  
  -- Notes
  notes TEXT,
  rebuild_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feature comparison for rebuild planning
CREATE TABLE IF NOT EXISTS procore_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES procore_modules(id) ON DELETE CASCADE,
  
  -- Feature info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Rebuild assessment
  include_in_rebuild BOOLEAN DEFAULT true,
  complexity TEXT CHECK (complexity IN ('trivial', 'easy', 'medium', 'hard', 'very_hard')),
  estimated_hours INTEGER,
  
  -- AI opportunity
  ai_enhancement_possible BOOLEAN DEFAULT false,
  ai_enhancement_notes TEXT,
  
  -- Screenshots showing this feature
  screenshot_ids UUID[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_screenshots_session ON procore_screenshots(session_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_category ON procore_screenshots(category);
CREATE INDEX IF NOT EXISTS idx_screenshots_name ON procore_screenshots(name);
CREATE INDEX IF NOT EXISTS idx_components_screenshot ON procore_components(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_components_type ON procore_components(component_type);
CREATE INDEX IF NOT EXISTS idx_modules_category ON procore_modules(category);
CREATE INDEX IF NOT EXISTS idx_features_module ON procore_features(module_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
DROP TRIGGER IF EXISTS update_procore_screenshots_updated_at ON procore_screenshots;
CREATE TRIGGER update_procore_screenshots_updated_at
  BEFORE UPDATE ON procore_screenshots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procore_modules_updated_at ON procore_modules;
CREATE TRIGGER update_procore_modules_updated_at
  BEFORE UPDATE ON procore_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Procore Modules
-- ============================================

INSERT INTO procore_modules (name, display_name, category, app_path, complexity, priority, estimated_build_weeks, key_features) VALUES
-- Core Project Management
('daily_log', 'Daily Log', 'project_management', '/projects/{PROJECT_ID}/project/daily_log', 'low', 'must_have', 2, '["Time entries", "Weather tracking", "Notes", "Photos", "Equipment log"]'),
('directory', 'Directory', 'project_management', '/projects/{PROJECT_ID}/project/directory', 'low', 'must_have', 2, '["Contacts", "Companies", "Roles", "Permissions"]'),
('documents', 'Documents', 'project_management', '/projects/{PROJECT_ID}/project/documents', 'medium', 'must_have', 4, '["Folder structure", "Version control", "Permissions", "Search"]'),
('drawings', 'Drawings', 'project_management', '/projects/{PROJECT_ID}/project/drawings', 'high', 'must_have', 8, '["Drawing sets", "Revisions", "Markups", "Comparisons", "Hyperlinks"]'),
('photos', 'Photos', 'project_management', '/projects/{PROJECT_ID}/project/photos', 'low', 'nice_to_have', 1, '["Albums", "Tags", "Location", "Timeline view"]'),
('schedule', 'Schedule', 'project_management', '/projects/{PROJECT_ID}/project/schedule', 'very_high', 'skip', 12, '["Gantt charts", "Dependencies", "Resource leveling", "Baselines"]'),
('meetings', 'Meetings', 'project_management', '/projects/{PROJECT_ID}/project/meetings', 'low', 'skip', 2, '["Agenda", "Minutes", "Action items", "Attendees"]'),
('emails', 'Emails', 'project_management', '/projects/{PROJECT_ID}/project/emails', 'medium', 'skip', 3, '["Thread tracking", "Attachments", "Distribution lists"]'),

-- Design Coordination
('rfi', 'RFIs', 'design_coordination', '/projects/{PROJECT_ID}/project/rfi', 'medium', 'must_have', 3, '["Request workflow", "Ball in court", "Due dates", "Drawing links"]'),
('submittals', 'Submittals', 'design_coordination', '/projects/{PROJECT_ID}/project/submittals', 'medium', 'must_have', 3, '["Approval workflow", "Spec sections", "Revisions", "Distribution"]'),
('coordination_issues', 'Coordination Issues', 'design_coordination', '/projects/{PROJECT_ID}/project/coordination_issues', 'medium', 'nice_to_have', 3, '["Issue tracking", "BIM links", "Assignments"]'),
('models', 'Models', 'design_coordination', '/projects/{PROJECT_ID}/project/models', 'very_high', 'skip', 16, '["3D viewer", "Model comparison", "Clash detection"]'),

-- Quality & Safety
('punch_list', 'Punch List', 'quality_safety', '/projects/{PROJECT_ID}/project/punch_list', 'low', 'must_have', 2, '["Item tracking", "Photos", "Assignments", "Status workflow"]'),
('inspections', 'Inspections', 'quality_safety', '/projects/{PROJECT_ID}/project/checklist/lists', 'medium', 'nice_to_have', 3, '["Checklists", "Templates", "Signatures", "Reports"]'),
('observations', 'Observations', 'quality_safety', '/projects/{PROJECT_ID}/project/observations', 'low', 'nice_to_have', 2, '["Safety observations", "Types", "Assignments"]'),
('incidents', 'Incidents', 'quality_safety', '/projects/{PROJECT_ID}/project/incidents', 'medium', 'nice_to_have', 3, '["Incident reports", "Investigations", "OSHA forms"]'),

-- Financials
('budget', 'Budget', 'financials', '/projects/{PROJECT_ID}/project/budget', 'high', 'nice_to_have', 6, '["Cost codes", "Forecasting", "Snapshots", "Views"]'),
('change_events', 'Change Events', 'financials', '/projects/{PROJECT_ID}/project/change_events', 'medium', 'nice_to_have', 3, '["PCO tracking", "ROM estimates", "Workflow"]'),
('change_orders', 'Change Orders', 'financials', '/projects/{PROJECT_ID}/project/change_orders', 'high', 'nice_to_have', 6, '["Owner COs", "Commitment COs", "Approval workflow"]'),
('commitments', 'Commitments', 'financials', '/projects/{PROJECT_ID}/project/commitments', 'high', 'nice_to_have', 6, '["Subcontracts", "POs", "SOVs"]'),
('invoicing', 'Invoicing', 'financials', '/projects/{PROJECT_ID}/project/invoicing', 'high', 'nice_to_have', 5, '["Pay apps", "Retention", "Lien waivers"]'),
('direct_costs', 'Direct Costs', 'financials', '/projects/{PROJECT_ID}/project/direct_costs', 'medium', 'nice_to_have', 3, '["Labor", "Equipment", "Materials"]'),

-- Bidding
('bidding', 'Bidding', 'bidding', '/projects/{PROJECT_ID}/project/bidding', 'high', 'skip', 6, '["Bid packages", "Invitations", "Leveling"]')

ON CONFLICT (name) DO NOTHING;

-- ============================================
-- VIEWS
-- ============================================

-- Summary view of capture progress
CREATE OR REPLACE VIEW procore_capture_summary AS
SELECT 
  m.category,
  m.name as module_name,
  m.display_name,
  m.priority,
  m.complexity,
  COUNT(DISTINCT s.id) as screenshot_count,
  MAX(s.captured_at) as last_captured
FROM procore_modules m
LEFT JOIN procore_screenshots s ON s.name LIKE '%' || m.name || '%'
GROUP BY m.category, m.name, m.display_name, m.priority, m.complexity
ORDER BY m.category, m.priority;

-- Rebuild effort estimate
CREATE OR REPLACE VIEW procore_rebuild_estimate AS
SELECT 
  category,
  COUNT(*) as module_count,
  SUM(CASE WHEN priority = 'must_have' THEN estimated_build_weeks ELSE 0 END) as must_have_weeks,
  SUM(CASE WHEN priority = 'nice_to_have' THEN estimated_build_weeks ELSE 0 END) as nice_to_have_weeks,
  SUM(estimated_build_weeks) as total_weeks
FROM procore_modules
WHERE priority != 'skip'
GROUP BY category
ORDER BY category;

-- ============================================
-- ROW LEVEL SECURITY (Optional)
-- ============================================

-- Enable RLS if you want to restrict access
-- ALTER TABLE procore_screenshots ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE procore_components ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE procore_modules ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE procore_features ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE procore_capture_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STORAGE BUCKET (Run separately in Supabase Dashboard)
-- ============================================

-- Create a storage bucket for screenshots via Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket named 'procore-screenshots'
-- 3. Set to private (or public if you want direct URLs)
-- 4. Add policy to allow authenticated uploads

COMMENT ON TABLE procore_screenshots IS 'Captured screenshots from Procore application';
COMMENT ON TABLE procore_modules IS 'Procore modules/features catalog with rebuild assessment';
COMMENT ON TABLE procore_components IS 'UI components extracted from screenshots';
