-- Financial Contracts and Commitments Tables
-- Based on UI evidence from contract forms

-- Prime Contracts table
CREATE TABLE contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_number TEXT NOT NULL,
  title TEXT NOT NULL,
  contract_company_id UUID NOT NULL REFERENCES companies(id),
  status contract_status NOT NULL DEFAULT 'draft',
  original_amount DECIMAL(15,2) NOT NULL CHECK (original_amount >= 0),
  revised_amount DECIMAL(15,2) CHECK (revised_amount >= 0),
  retention_percentage DECIMAL(5,2) CHECK (retention_percentage >= 0 AND retention_percentage <= 100),
  execution_date DATE,
  start_date DATE NOT NULL,
  substantial_completion_date DATE NOT NULL,
  final_completion_date DATE,
  liquidated_damages DECIMAL(15,2) DEFAULT 0 CHECK (liquidated_damages >= 0),
  is_private BOOLEAN DEFAULT true,
  include_weather_days BOOLEAN DEFAULT true,
  include_holidays BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, contract_number),
  CHECK (substantial_completion_date >= start_date),
  CHECK (final_completion_date IS NULL OR final_completion_date >= substantial_completion_date)
);

-- Contract Billing Configuration
CREATE TABLE contract_billing_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  billing_method billing_method NOT NULL DEFAULT 'progress',
  payment_terms payment_terms NOT NULL DEFAULT 'net_30',
  billing_day_of_month INTEGER CHECK (billing_day_of_month >= 1 AND billing_day_of_month <= 31),
  allow_billing_over_contract BOOLEAN DEFAULT false,
  apply_retention BOOLEAN DEFAULT true,
  labor_retention_percentage DECIMAL(5,2) DEFAULT 10 CHECK (labor_retention_percentage >= 0 AND labor_retention_percentage <= 100),
  materials_retention_percentage DECIMAL(5,2) DEFAULT 0 CHECK (materials_retention_percentage >= 0 AND materials_retention_percentage <= 100),
  release_retention_with_final BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(contract_id)
);

-- Contract Privacy Settings
CREATE TABLE contract_privacy_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT true,
  allow_subcontractors_view_amount BOOLEAN DEFAULT false,
  show_in_directory BOOLEAN DEFAULT true,
  allow_change_order_creation BOOLEAN DEFAULT true,
  require_invoice_approval BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(contract_id)
);

-- Contract Permissions (user-level)
CREATE TABLE contract_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_type permission_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(contract_id, user_id, permission_type)
);

-- Contract Role Permissions
CREATE TABLE contract_role_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  permission_type permission_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(contract_id, role, permission_type)
);

-- Commitments (Subcontracts and Purchase Orders)
CREATE TABLE commitments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  contract_company_id UUID NOT NULL REFERENCES companies(id),
  type TEXT NOT NULL CHECK (type IN ('subcontract', 'purchase_order')),
  status commitment_status NOT NULL DEFAULT 'draft',
  original_amount DECIMAL(15,2) NOT NULL CHECK (original_amount >= 0),
  revised_amount DECIMAL(15,2) CHECK (revised_amount >= 0),
  balance_to_finish DECIMAL(15,2) GENERATED ALWAYS AS (COALESCE(revised_amount, original_amount)) STORED,
  retention_percentage DECIMAL(5,2) CHECK (retention_percentage >= 0 AND retention_percentage <= 100),
  executed BOOLEAN DEFAULT false,
  issue_date DATE,
  due_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, number)
);

-- Schedule of Values
CREATE TABLE schedule_of_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  scheduled_value DECIMAL(15,2) NOT NULL CHECK (scheduled_value >= 0),
  work_completed DECIMAL(15,2) DEFAULT 0 CHECK (work_completed >= 0),
  materials_stored DECIMAL(15,2) DEFAULT 0 CHECK (materials_stored >= 0),
  percent_complete DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN scheduled_value = 0 THEN 0
      ELSE ((work_completed + materials_stored) / scheduled_value * 100)
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(contract_id, line_number),
  CHECK (work_completed + materials_stored <= scheduled_value)
);

-- Commitment Line Items (for detailed purchase orders)
CREATE TABLE commitment_line_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commitment_id UUID NOT NULL REFERENCES commitments(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  quantity DECIMAL(15,4),
  unit TEXT,
  unit_price DECIMAL(15,4),
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(commitment_id, line_number)
);

-- Create indexes
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_company ON contracts(contract_company_id);
CREATE INDEX idx_contracts_number ON contracts(contract_number);
CREATE INDEX idx_contract_billing_contract ON contract_billing_config(contract_id);
CREATE INDEX idx_contract_privacy_contract ON contract_privacy_settings(contract_id);
CREATE INDEX idx_contract_permissions_contract ON contract_permissions(contract_id);
CREATE INDEX idx_contract_permissions_user ON contract_permissions(user_id);
CREATE INDEX idx_contract_role_permissions_contract ON contract_role_permissions(contract_id);
CREATE INDEX idx_commitments_project ON commitments(project_id);
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_commitments_type ON commitments(type);
CREATE INDEX idx_commitments_company ON commitments(contract_company_id);
CREATE INDEX idx_commitments_number ON commitments(number);
CREATE INDEX idx_sov_contract ON schedule_of_values(contract_id);
CREATE INDEX idx_sov_cost_code ON schedule_of_values(cost_code_id);
CREATE INDEX idx_commitment_items_commitment ON commitment_line_items(commitment_id);

-- Add update triggers
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_billing_updated_at BEFORE UPDATE ON contract_billing_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_privacy_updated_at BEFORE UPDATE ON contract_privacy_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sov_updated_at BEFORE UPDATE ON schedule_of_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commitment_items_updated_at BEFORE UPDATE ON commitment_line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_billing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_of_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitment_line_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for contracts (respecting privacy settings)
CREATE POLICY "Contracts viewable by project members with permissions" ON contracts
  FOR SELECT USING (
    -- User is a project member
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = contracts.project_id 
      AND project_users.user_id = auth.uid()
    )
    AND (
      -- Contract is not private
      NOT is_private
      OR
      -- User has explicit permission
      EXISTS (
        SELECT 1 FROM contract_permissions
        WHERE contract_permissions.contract_id = contracts.id
        AND contract_permissions.user_id = auth.uid()
      )
      OR
      -- User's role has permission
      EXISTS (
        SELECT 1 FROM contract_role_permissions crp
        JOIN user_profiles up ON up.role = crp.role
        WHERE crp.contract_id = contracts.id
        AND up.id = auth.uid()
      )
    )
  );

-- Similar policies for commitments
CREATE POLICY "Commitments viewable by project members" ON commitments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = commitments.project_id 
      AND project_users.user_id = auth.uid()
    )
  );