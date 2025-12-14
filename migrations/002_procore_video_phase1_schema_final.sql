-- Migration: 002_procore_video_phase1_schema_final.sql
-- Description: Phase 1 Database Schema Updates for Procore Video Walkthrough Implementation (Final version)
-- Date: 2025-12-13

-- =====================================================
-- SECTION 1: CREATE NEW TABLES
-- =====================================================

-- 1.1 Schedule of Values main table
CREATE TABLE IF NOT EXISTS schedule_of_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id BIGINT REFERENCES contracts(id),  -- contracts uses BIGINT
  commitment_id UUID REFERENCES commitments(id),  -- commitments uses UUID
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'revised')),
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES app_users(id),
  CONSTRAINT either_contract_or_commitment CHECK (
    (contract_id IS NOT NULL AND commitment_id IS NULL) OR
    (contract_id IS NULL AND commitment_id IS NOT NULL)
  )
);

-- 1.2 SOV Line Items (without generated percentage column)
CREATE TABLE IF NOT EXISTS sov_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sov_id UUID REFERENCES schedule_of_values(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  scheduled_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3 Billing Periods
CREATE TABLE IF NOT EXISTS billing_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES projects(id),  -- projects uses BIGINT
  period_number INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, period_number)
);

-- 1.4 Cost Code Types
CREATE TABLE IF NOT EXISTS cost_code_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('labor', 'material', 'subcontract', 'equipment', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5 Project Cost Code Configuration
CREATE TABLE IF NOT EXISTS project_cost_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES projects(id),  -- projects uses BIGINT
  cost_code_id UUID REFERENCES cost_codes(id),
  cost_type_id UUID REFERENCES cost_code_types(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, cost_code_id)
);

-- 1.6 Vertical Markup Settings
CREATE TABLE IF NOT EXISTS vertical_markup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES projects(id),  -- projects uses BIGINT
  markup_type TEXT NOT NULL CHECK (markup_type IN ('insurance', 'bond', 'fee', 'overhead', 'custom')),
  percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  calculation_order INTEGER NOT NULL,
  compound BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, markup_type)
);

-- 1.7 Project Directory
CREATE TABLE IF NOT EXISTS project_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES projects(id),  -- projects uses BIGINT
  company_id UUID REFERENCES companies(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'architect', 'engineer', 'subcontractor', 'vendor')),
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, company_id, role)
);

-- =====================================================
-- SECTION 2: CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_schedule_of_values_contract ON schedule_of_values(contract_id);
CREATE INDEX IF NOT EXISTS idx_schedule_of_values_commitment ON schedule_of_values(commitment_id);
CREATE INDEX IF NOT EXISTS idx_schedule_of_values_status ON schedule_of_values(status);
CREATE INDEX IF NOT EXISTS idx_sov_line_items_sov ON sov_line_items(sov_id);
CREATE INDEX IF NOT EXISTS idx_sov_line_items_cost_code ON sov_line_items(cost_code_id);
CREATE INDEX IF NOT EXISTS idx_billing_periods_project ON billing_periods(project_id);
CREATE INDEX IF NOT EXISTS idx_project_cost_codes_project ON project_cost_codes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_cost_codes_cost_code ON project_cost_codes(cost_code_id);
CREATE INDEX IF NOT EXISTS idx_vertical_markup_project ON vertical_markup(project_id);
CREATE INDEX IF NOT EXISTS idx_project_directory_project ON project_directory(project_id);
CREATE INDEX IF NOT EXISTS idx_project_directory_company ON project_directory(company_id);

-- =====================================================
-- SECTION 3: UPDATE EXISTING TABLES
-- =====================================================

-- 3.1 Update projects table with budget locking
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS budget_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS budget_locked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_locked_by UUID REFERENCES app_users(id);

-- 3.2 Update contracts table (not prime_contracts - that doesn't exist)
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS retention_percentage DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS apply_vertical_markup BOOLEAN DEFAULT true;

-- Add check constraint for retention percentage if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contracts_retention_percentage_check') THEN
        ALTER TABLE contracts ADD CONSTRAINT contracts_retention_percentage_check 
        CHECK (retention_percentage >= 0 AND retention_percentage <= 100);
    END IF;
END $$;

-- 3.3 Update commitments table
ALTER TABLE commitments 
ADD COLUMN IF NOT EXISTS retention_percentage DECIMAL(5, 2) DEFAULT 0;

-- Add check constraint for retention percentage if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commitments_retention_percentage_check') THEN
        ALTER TABLE commitments ADD CONSTRAINT commitments_retention_percentage_check 
        CHECK (retention_percentage >= 0 AND retention_percentage <= 100);
    END IF;
END $$;

-- 3.4 Update change_orders table
ALTER TABLE change_orders 
ADD COLUMN IF NOT EXISTS apply_vertical_markup BOOLEAN DEFAULT true;

-- 3.5 Update budget_items table with financial calculation columns
-- Note: Using simpler generated columns without subqueries
ALTER TABLE budget_items 
ADD COLUMN IF NOT EXISTS original_amount DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS budget_modifications DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS approved_cos DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS committed_cost DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS direct_cost DECIMAL(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_cost_changes DECIMAL(15, 2) DEFAULT 0;

-- Add generated columns separately to handle dependencies
ALTER TABLE budget_items
ADD COLUMN IF NOT EXISTS revised_budget DECIMAL(15, 2) GENERATED ALWAYS AS (
  COALESCE(original_amount, 0) + COALESCE(budget_modifications, 0) + COALESCE(approved_cos, 0)
) STORED;

ALTER TABLE budget_items
ADD COLUMN IF NOT EXISTS projected_cost DECIMAL(15, 2) GENERATED ALWAYS AS (
  COALESCE(committed_cost, 0) + COALESCE(direct_cost, 0) + COALESCE(pending_cost_changes, 0)
) STORED;

ALTER TABLE budget_items
ADD COLUMN IF NOT EXISTS forecast_to_complete DECIMAL(15, 2) GENERATED ALWAYS AS (
  COALESCE(original_amount, 0) + COALESCE(budget_modifications, 0) + COALESCE(approved_cos, 0) 
  - COALESCE(committed_cost, 0) - COALESCE(direct_cost, 0) - COALESCE(pending_cost_changes, 0)
) STORED;

-- =====================================================
-- SECTION 4: CREATE VIEW FOR SOV PERCENTAGES
-- =====================================================

-- Since we can't use subqueries in generated columns, create a view for SOV line items with percentages
CREATE OR REPLACE VIEW sov_line_items_with_percentage AS
SELECT 
  sli.*,
  CASE 
    WHEN sov.total_amount > 0 
    THEN ROUND((sli.scheduled_value / sov.total_amount) * 100, 2)
    ELSE 0
  END AS percentage
FROM sov_line_items sli
JOIN schedule_of_values sov ON sov.id = sli.sov_id;

-- =====================================================
-- SECTION 5: SEED DEFAULT DATA
-- =====================================================

-- Seed default cost code types
INSERT INTO cost_code_types (code, description, category) VALUES
('L', 'Labor', 'labor'),
('M', 'Material', 'material'), 
('S', 'Subcontract', 'subcontract'),
('E', 'Equipment', 'equipment'),
('O', 'Other', 'other'),
('MS', 'Material & Subcontract', 'subcontract'),
('LS', 'Labor & Subcontract', 'subcontract'),
('LM', 'Labor & Material', 'material')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SECTION 6: CREATE ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE schedule_of_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE sov_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_code_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_cost_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vertical_markup ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_directory ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (can be refined based on your auth structure)
-- Schedule of Values policies
CREATE POLICY "Users can view SOVs for their projects" ON schedule_of_values
  FOR SELECT USING (true);  -- Simplified for now

CREATE POLICY "Users can manage SOVs for their projects" ON schedule_of_values
  FOR ALL USING (true);  -- Simplified for now

-- SOV Line Items inherit permissions from parent SOV
CREATE POLICY "Users can view SOV line items" ON sov_line_items
  FOR SELECT USING (true);  -- Simplified for now

CREATE POLICY "Users can manage SOV line items" ON sov_line_items
  FOR ALL USING (true);  -- Simplified for now

-- Billing periods - project level access
CREATE POLICY "Users can view billing periods" ON billing_periods
  FOR SELECT USING (true);  -- Simplified for now

CREATE POLICY "Users can manage billing periods" ON billing_periods
  FOR ALL USING (true);  -- Simplified for now

-- Cost code types - everyone can read
CREATE POLICY "Everyone can view cost code types" ON cost_code_types
  FOR SELECT USING (true);

-- Only admins can manage cost code types (simplified for now)
CREATE POLICY "Only admins can manage cost code types" ON cost_code_types
  FOR ALL USING (true);  -- Simplified for now

-- Project cost codes
CREATE POLICY "Users can view project cost codes" ON project_cost_codes
  FOR SELECT USING (true);  -- Simplified for now

CREATE POLICY "Users can manage project cost codes" ON project_cost_codes
  FOR ALL USING (true);  -- Simplified for now

-- Vertical markup
CREATE POLICY "Users can view vertical markup" ON vertical_markup
  FOR SELECT USING (true);  -- Simplified for now

CREATE POLICY "Users can manage vertical markup" ON vertical_markup
  FOR ALL USING (true);  -- Simplified for now

-- Project directory
CREATE POLICY "Users can view project directory" ON project_directory
  FOR SELECT USING (true);  -- Simplified for now

CREATE POLICY "Users can manage project directory" ON project_directory
  FOR ALL USING (true);  -- Simplified for now

-- =====================================================
-- SECTION 7: CREATE TRIGGER FOR UPDATED_AT
-- =====================================================

-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at
DROP TRIGGER IF EXISTS update_schedule_of_values_updated_at ON schedule_of_values;
CREATE TRIGGER update_schedule_of_values_updated_at BEFORE UPDATE ON schedule_of_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sov_line_items_updated_at ON sov_line_items;
CREATE TRIGGER update_sov_line_items_updated_at BEFORE UPDATE ON sov_line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_periods_updated_at ON billing_periods;
CREATE TRIGGER update_billing_periods_updated_at BEFORE UPDATE ON billing_periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vertical_markup_updated_at ON vertical_markup;
CREATE TRIGGER update_vertical_markup_updated_at BEFORE UPDATE ON vertical_markup
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SECTION 8: SUMMARY
-- =====================================================
-- This migration creates:
-- - 7 new tables for Schedule of Values, billing, cost codes, and project management
-- - Updates 5 existing tables with financial calculation columns
-- - Creates a view for SOV line item percentages (to avoid subquery in generated column)
-- - Adds indexes, RLS policies, and triggers
-- - Seeds default cost code types

-- Key changes from previous versions:
-- 1. Fixed foreign key types (BIGINT for contracts/projects, UUID for commitments/companies)
-- 2. Removed generated percentage column (uses view instead)
-- 3. Simplified RLS policies for initial deployment
-- 4. Added IF NOT EXISTS checks for idempotency