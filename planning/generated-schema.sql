-- Procore Financial Suite Database Schema
-- Generated: 2025-12-08T02:14:24.667Z

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Create enumerated types
CREATE TYPE project_status AS ENUM ('active', 'inactive', 'complete');
CREATE TYPE company_type AS ENUM ('vendor', 'subcontractor', 'owner', 'architect', 'other');
CREATE TYPE budget_status AS ENUM ('locked', 'unlocked');
CREATE TYPE erp_sync_status AS ENUM ('pending', 'synced', 'failed', 'resyncing');
CREATE TYPE calculation_method AS ENUM ('unit_price', 'lump_sum', 'percentage');
CREATE TYPE contract_status AS ENUM ('draft', 'pending', 'executed', 'closed', 'terminated');
CREATE TYPE commitment_type AS ENUM ('subcontract', 'purchase_order', 'service_order');
CREATE TYPE contract_type AS ENUM ('prime_contract', 'commitment');
CREATE TYPE change_event_status AS ENUM ('open', 'closed');
CREATE TYPE change_order_status AS ENUM ('draft', 'pending', 'approved', 'void');
CREATE TYPE billing_period_status AS ENUM ('open', 'closed', 'approved');
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'approved', 'paid', 'void');

-- Create tables
-- Core project entity
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies.id,
  name varchar(255) NOT NULL,
  job_number varchar(50) UNIQUE,
  address text,
  city varchar(100),
  state varchar(50),
  zip varchar(20),
  phone varchar(50),
  status project_status DEFAULT 'active',
  phase varchar(100),
  category varchar(100),
  archived boolean DEFAULT false,
  summary text,
  summary_metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id
);

CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_archived ON projects(archived);

-- Company/Vendor entities
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  type company_type DEFAULT 'vendor',
  address text,
  city varchar(100),
  state varchar(50),
  zip varchar(20),
  phone varchar(50),
  email varchar(255),
  website varchar(255),
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id
);

CREATE INDEX idx_companies_type ON companies(type);
CREATE INDEX idx_companies_active ON companies(active);

-- Cost code hierarchy
CREATE TABLE cost_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  code varchar(50) NOT NULL,
  description text,
  parent_id uuid REFERENCES cost_codes.id,
  path ltree,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id,
  CONSTRAINT uk_project_cost_code UNIQUE(project_id, code)
);

CREATE INDEX idx_cost_codes_project_id ON cost_codes(project_id);
CREATE INDEX idx_cost_codes_parent_id ON cost_codes(parent_id);
CREATE INDEX idx_cost_codes_path ON cost_codes USING gist(path);

-- Project budgets
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES projects.id,
  name varchar(255) DEFAULT 'Budget',
  status budget_status DEFAULT 'unlocked',
  erp_sync_status erp_sync_status DEFAULT 'pending',
  locked_at timestamp with time zone,
  locked_by uuid REFERENCES auth.users.id,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id
);

CREATE INDEX idx_budgets_project_id ON budgets(project_id);
CREATE INDEX idx_budgets_status ON budgets(status);

-- Budget line items
CREATE TABLE budget_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES budgets.id,
  cost_code_id uuid NOT NULL REFERENCES cost_codes.id,
  calculation_method calculation_method DEFAULT 'unit_price',
  unit_qty decimal(12,2),
  uom varchar(50),
  unit_cost money,
  original_budget money DEFAULT 0 NOT NULL,
  revised_budget money,
  forecast_to_complete money,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_budget_line_items_budget_id ON budget_line_items(budget_id);
CREATE INDEX idx_budget_line_items_cost_code_id ON budget_line_items(cost_code_id);

-- Prime contracts with owners
CREATE TABLE prime_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  number varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  owner_id uuid REFERENCES companies.id,
  architect_id uuid REFERENCES companies.id,
  contract_date date,
  status contract_status DEFAULT 'draft',
  original_amount money DEFAULT 0,
  erp_sync_status erp_sync_status DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id,
  CONSTRAINT uk_project_prime_number UNIQUE(project_id, number)
);

CREATE INDEX idx_prime_contracts_project_id ON prime_contracts(project_id);
CREATE INDEX idx_prime_contracts_status ON prime_contracts(status);

-- Subcontracts and purchase orders
CREATE TABLE commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  number varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  type commitment_type DEFAULT 'subcontract',
  company_id uuid NOT NULL REFERENCES companies.id,
  contract_date date,
  status contract_status DEFAULT 'draft',
  original_amount money DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id,
  CONSTRAINT uk_project_commitment_number UNIQUE(project_id, number)
);

CREATE INDEX idx_commitments_project_id ON commitments(project_id);
CREATE INDEX idx_commitments_company_id ON commitments(company_id);
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_commitments_type ON commitments(type);

-- Line items for contracts
CREATE TABLE contract_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL,
  contract_type contract_type NOT NULL,
  cost_code_id uuid REFERENCES cost_codes.id,
  line_number integer,
  description text,
  amount money DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_contract_line_items_contract ON contract_line_items(contract_id, contract_type);
CREATE INDEX idx_contract_line_items_cost_code ON contract_line_items(cost_code_id);

-- Potential change events
CREATE TABLE change_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  number integer NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  status change_event_status DEFAULT 'open',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id,
  CONSTRAINT uk_project_change_event_number UNIQUE(project_id, number)
);

CREATE INDEX idx_change_events_project_id ON change_events(project_id);
CREATE INDEX idx_change_events_status ON change_events(status);

-- Change orders linked to contracts
CREATE TABLE change_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  change_event_id uuid REFERENCES change_events.id,
  contract_id uuid NOT NULL,
  contract_type contract_type NOT NULL,
  number varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  status change_order_status DEFAULT 'draft',
  amount money DEFAULT 0 NOT NULL,
  approved_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id,
  CONSTRAINT uk_contract_change_order_number UNIQUE(contract_id, contract_type, number)
);

CREATE INDEX idx_change_orders_project_id ON change_orders(project_id);
CREATE INDEX idx_change_orders_change_event_id ON change_orders(change_event_id);
CREATE INDEX idx_change_orders_contract ON change_orders(contract_id, contract_type);
CREATE INDEX idx_change_orders_status ON change_orders(status);

-- Billing periods for invoicing
CREATE TABLE billing_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  period_number integer NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  status billing_period_status DEFAULT 'open',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT uk_project_billing_period UNIQUE(project_id, period_number)
);

CREATE INDEX idx_billing_periods_project_id ON billing_periods(project_id);
CREATE INDEX idx_billing_periods_status ON billing_periods(status);

-- Invoices for contracts
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects.id,
  billing_period_id uuid REFERENCES billing_periods.id,
  contract_id uuid NOT NULL,
  contract_type contract_type NOT NULL,
  invoice_number varchar(50) NOT NULL,
  invoice_date date NOT NULL,
  amount money NOT NULL,
  status invoice_status DEFAULT 'draft',
  paid_amount money DEFAULT 0,
  paid_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users.id,
  updated_by uuid REFERENCES auth.users.id,
  CONSTRAINT uk_invoice_number UNIQUE(project_id, invoice_number)
);

CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_billing_period_id ON invoices(billing_period_id);
CREATE INDEX idx_invoices_contract ON invoices(contract_id, contract_type);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Create views
-- Aggregated budget data with commitments and costs
CREATE VIEW budget_summary_view AS
SELECT 
  b.id AS budget_id,
  b.project_id,
  bli.cost_code_id,
  cc.code AS cost_code,
  cc.description AS cost_code_description,
  bli.original_budget,
  COALESCE(bli.revised_budget, bli.original_budget) AS revised_budget,
  COALESCE(comm.committed_amount, 0) AS committed_amount,
  COALESCE(co.pending_changes, 0) AS pending_changes,
  COALESCE(co.approved_changes, 0) AS approved_changes,
  COALESCE(inv.invoiced_amount, 0) AS invoiced_amount,
  COALESCE(bli.revised_budget, bli.original_budget) - 
    COALESCE(comm.committed_amount, 0) - 
    COALESCE(co.approved_changes, 0) AS remaining_budget
FROM budgets b
JOIN budget_line_items bli ON b.id = bli.budget_id
JOIN cost_codes cc ON bli.cost_code_id = cc.id
LEFT JOIN (
  SELECT 
    cli.cost_code_id,
    c.project_id,
    SUM(cli.amount) AS committed_amount
  FROM commitments c
  JOIN contract_line_items cli ON c.id = cli.contract_id AND cli.contract_type = 'commitment'
  WHERE c.status IN ('pending', 'executed')
  GROUP BY cli.cost_code_id, c.project_id
) comm ON comm.cost_code_id = bli.cost_code_id AND comm.project_id = b.project_id
LEFT JOIN (
  SELECT 
    co.project_id,
    cc.id AS cost_code_id,
    SUM(CASE WHEN co.status = 'pending' THEN co.amount ELSE 0 END) AS pending_changes,
    SUM(CASE WHEN co.status = 'approved' THEN co.amount ELSE 0 END) AS approved_changes
  FROM change_orders co
  JOIN contract_line_items cli ON co.id = cli.contract_id
  JOIN cost_codes cc ON cli.cost_code_id = cc.id
  GROUP BY co.project_id, cc.id
) co ON co.cost_code_id = bli.cost_code_id AND co.project_id = b.project_id
LEFT JOIN (
  SELECT 
    i.project_id,
    cli.cost_code_id,
    SUM(i.amount) AS invoiced_amount
  FROM invoices i
  JOIN contract_line_items cli ON i.contract_id = cli.contract_id AND i.contract_type = cli.contract_type
  WHERE i.status IN ('approved', 'paid')
  GROUP BY i.project_id, cli.cost_code_id
) inv ON inv.cost_code_id = bli.cost_code_id AND inv.project_id = b.project_id;

-- Summary of all contracts with changes and billing
CREATE VIEW contract_summary_view AS
WITH contracts_union AS (
  SELECT 
    id AS contract_id,
    'prime_contract' AS contract_type,
    project_id,
    number,
    title,
    status,
    original_amount
  FROM prime_contracts
  UNION ALL
  SELECT 
    id AS contract_id,
    'commitment' AS contract_type,
    project_id,
    number,
    title,
    status,
    original_amount
  FROM commitments
)
SELECT 
  cu.*,
  COALESCE(co.approved_changes, 0) AS approved_changes,
  COALESCE(co.pending_changes, 0) AS pending_changes,
  cu.original_amount + COALESCE(co.approved_changes, 0) AS revised_amount,
  COALESCE(inv.invoiced_amount, 0) AS invoiced_amount,
  COALESCE(inv.paid_amount, 0) AS paid_amount,
  cu.original_amount + COALESCE(co.approved_changes, 0) - COALESCE(inv.invoiced_amount, 0) AS remaining_to_invoice,
  ROUND(
    CASE 
      WHEN cu.original_amount + COALESCE(co.approved_changes, 0) > 0 
      THEN (COALESCE(inv.invoiced_amount, 0) * 100.0) / (cu.original_amount + COALESCE(co.approved_changes, 0))
      ELSE 0
    END, 2
  ) AS percent_invoiced
FROM contracts_union cu
LEFT JOIN (
  SELECT 
    contract_id,
    contract_type,
    SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) AS approved_changes,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_changes
  FROM change_orders
  GROUP BY contract_id, contract_type
) co ON co.contract_id = cu.contract_id AND co.contract_type = cu.contract_type
LEFT JOIN (
  SELECT 
    contract_id,
    contract_type,
    SUM(amount) AS invoiced_amount,
    SUM(paid_amount) AS paid_amount
  FROM invoices
  WHERE status IN ('approved', 'paid')
  GROUP BY contract_id, contract_type
) inv ON inv.contract_id = cu.contract_id AND inv.contract_type = cu.contract_type;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cost_codes_updated_at BEFORE UPDATE ON cost_codes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_line_items_updated_at BEFORE UPDATE ON budget_line_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prime_contracts_updated_at BEFORE UPDATE ON prime_contracts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contract_line_items_updated_at BEFORE UPDATE ON contract_line_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_change_events_updated_at BEFORE UPDATE ON change_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON change_orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_periods_updated_at BEFORE UPDATE ON billing_periods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
