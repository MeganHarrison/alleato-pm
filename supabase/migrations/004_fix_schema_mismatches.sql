-- Fix schema mismatches migration
-- This migration addresses the discrepancies between the code expectations and actual schema

-- 1. Fix projects table to match code expectations
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "job number" VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS phase VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stakeholders JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_archived ON projects(archived);
CREATE INDEX IF NOT EXISTS idx_projects_phase ON projects(phase);
CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state);

-- 2. Create the missing subcontractors table referenced in financial modules
CREATE TABLE IF NOT EXISTS subcontractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    tax_id VARCHAR(50),
    license_number VARCHAR(100),
    insurance_expiry DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Fix the data type mismatches in financial tables
-- Drop and recreate the financial tables with correct project_id type
-- First, drop dependent views
DROP VIEW IF EXISTS financial_contract_summary CASCADE;
DROP VIEW IF EXISTS financial_budget_summary CASCADE;
DROP VIEW IF EXISTS financial_invoice_summary CASCADE;
DROP VIEW IF EXISTS project_financial_summary CASCADE;
DROP VIEW IF EXISTS financial_change_order_summary CASCADE;
DROP VIEW IF EXISTS financial_direct_costs_summary CASCADE;
DROP VIEW IF EXISTS financial_billing_period_status CASCADE;

-- Drop the tables with incorrect foreign keys
DROP TABLE IF EXISTS financial_billing_periods CASCADE;
DROP TABLE IF EXISTS financial_direct_costs CASCADE;
DROP TABLE IF EXISTS financial_budget_items CASCADE;
DROP TABLE IF EXISTS financial_lien_waivers CASCADE;
DROP TABLE IF EXISTS financial_invoices CASCADE;
DROP TABLE IF EXISTS financial_change_orders CASCADE;
DROP TABLE IF EXISTS financial_contracts CASCADE;

-- Recreate financial_contracts with correct project_id type
CREATE TABLE financial_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company_id UUID REFERENCES companies(id),
    subcontractor_id UUID REFERENCES subcontractors(id),
    project_id UUID REFERENCES projects(id),  -- Changed from BIGINT to UUID
    status VARCHAR(50) DEFAULT 'draft',
    contract_amount DECIMAL(15,2) DEFAULT 0,
    change_order_amount DECIMAL(15,2) DEFAULT 0,
    revised_amount DECIMAL(15,2) GENERATED ALWAYS AS (contract_amount + change_order_amount) STORED,
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate financial_invoices
CREATE TABLE financial_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    contract_id UUID REFERENCES financial_contracts(id),
    period_start DATE,
    period_end DATE,
    invoice_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'draft',
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    retention_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (subtotal + tax_amount - retention_amount) STORED,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    payment_date DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate financial_budget_items with correct project_id type
CREATE TABLE financial_budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),  -- Changed from BIGINT to UUID
    cost_code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    budget_amount DECIMAL(15,2) DEFAULT 0,
    committed_amount DECIMAL(15,2) DEFAULT 0,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    forecast_amount DECIMAL(15,2) DEFAULT 0,
    variance_amount DECIMAL(15,2) GENERATED ALWAYS AS (budget_amount - (committed_amount + spent_amount + forecast_amount)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, cost_code)
);

-- Recreate financial_change_orders
CREATE TABLE financial_change_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_order_number VARCHAR(50) UNIQUE NOT NULL,
    contract_id UUID REFERENCES financial_contracts(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    amount DECIMAL(15,2) NOT NULL,
    approved_date DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate financial_direct_costs with correct project_id type
CREATE TABLE financial_direct_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),  -- Changed from BIGINT to UUID
    cost_code VARCHAR(50),
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    description TEXT NOT NULL,
    cost_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    cost_type VARCHAR(50),
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate financial_billing_periods with correct project_id type
CREATE TABLE financial_billing_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),  -- Changed from BIGINT to UUID
    period_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT false,
    closed_date TIMESTAMPTZ,
    closed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, period_number)
);

-- Recreate financial_lien_waivers
CREATE TABLE financial_lien_waivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES financial_invoices(id),
    waiver_type VARCHAR(50) NOT NULL,
    waiver_period VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    through_date DATE NOT NULL,
    received_date DATE,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX idx_financial_contracts_company ON financial_contracts(company_id);
CREATE INDEX idx_financial_contracts_subcontractor ON financial_contracts(subcontractor_id);
CREATE INDEX idx_financial_contracts_project ON financial_contracts(project_id);
CREATE INDEX idx_financial_invoices_contract ON financial_invoices(contract_id);
CREATE INDEX idx_financial_budget_items_project ON financial_budget_items(project_id);
CREATE INDEX idx_financial_change_orders_contract ON financial_change_orders(contract_id);
CREATE INDEX idx_financial_direct_costs_project ON financial_direct_costs(project_id);
CREATE INDEX idx_financial_billing_periods_project ON financial_billing_periods(project_id);

-- Enable RLS on new tables
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_direct_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_billing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_lien_waivers ENABLE ROW LEVEL SECURITY;

-- RLS policies for subcontractors
CREATE POLICY "subcontractors_read" ON subcontractors FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "subcontractors_write" ON subcontractors FOR ALL USING (auth.uid() IS NOT NULL);

-- Recreate RLS policies for financial tables
CREATE POLICY "financial_contracts_read" ON financial_contracts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_invoices_read" ON financial_invoices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_budget_items_read" ON financial_budget_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_change_orders_read" ON financial_change_orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_direct_costs_read" ON financial_direct_costs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_billing_periods_read" ON financial_billing_periods FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_lien_waivers_read" ON financial_lien_waivers FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "financial_contracts_write" ON financial_contracts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_invoices_write" ON financial_invoices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_budget_items_write" ON financial_budget_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_change_orders_write" ON financial_change_orders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_direct_costs_write" ON financial_direct_costs FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_billing_periods_write" ON financial_billing_periods FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_lien_waivers_write" ON financial_lien_waivers FOR ALL USING (auth.uid() IS NOT NULL);

-- Add update triggers
CREATE TRIGGER update_subcontractors_updated_at BEFORE UPDATE ON subcontractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_contracts_updated_at BEFORE UPDATE ON financial_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_invoices_updated_at BEFORE UPDATE ON financial_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_budget_items_updated_at BEFORE UPDATE ON financial_budget_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_change_orders_updated_at BEFORE UPDATE ON financial_change_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_direct_costs_updated_at BEFORE UPDATE ON financial_direct_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_billing_periods_updated_at BEFORE UPDATE ON financial_billing_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_lien_waivers_updated_at BEFORE UPDATE ON financial_lien_waivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();







-- 4. Recreate the views with corrected references
CREATE OR REPLACE VIEW financial_contract_summary AS
SELECT 
    fc.id,
    fc.contract_number,
    fc.contract_type,
    fc.title,
    fc.status,
    fc.contract_amount,
    fc.change_order_amount,
    fc.revised_amount,
    COALESCE(c.name, s.company_name) as vendor_name,
    fc.project_id,
    p.name as project_name,
    COALESCE((
        SELECT SUM(total_amount) 
        FROM financial_invoices 
        WHERE contract_id = fc.id
    ), 0) as total_invoiced,
    COALESCE((
        SELECT SUM(paid_amount) 
        FROM financial_invoices 
        WHERE contract_id = fc.id
    ), 0) as total_paid,
    fc.revised_amount - COALESCE((
        SELECT SUM(total_amount) 
        FROM financial_invoices 
        WHERE contract_id = fc.id
    ), 0) as remaining_amount,
    fc.start_date,
    fc.end_date,
    fc.created_at,
    fc.updated_at
FROM financial_contracts fc
LEFT JOIN companies c ON fc.company_id = c.id
LEFT JOIN subcontractors s ON fc.subcontractor_id = s.id
LEFT JOIN projects p ON fc.project_id = p.id;




CREATE OR REPLACE VIEW financial_budget_summary AS
SELECT 
    fb.id,
    fb.project_id,
    p.name as project_name,
    fb.cost_code,
    fcc.description as cost_code_description,
    fcc.code_type,
    fb.description,
    fb.budget_amount,
    fb.committed_amount,
    fb.spent_amount,
    fb.forecast_amount,
    fb.variance_amount,
    CASE 
        WHEN fb.budget_amount > 0 
        THEN ROUND(((fb.committed_amount + fb.spent_amount) / fb.budget_amount * 100)::numeric, 2)
        ELSE 0 
    END as percent_complete,
    CASE 
        WHEN fb.budget_amount > 0 
        THEN ROUND((fb.variance_amount / fb.budget_amount * 100)::numeric, 2)
        ELSE 0 
    END as variance_percent,
    fb.created_at,
    fb.updated_at
FROM financial_budget_items fb
LEFT JOIN projects p ON fb.project_id = p.id
LEFT JOIN financial_cost_codes fcc ON fb.cost_code = fcc.code;

CREATE OR REPLACE VIEW financial_invoice_summary AS
SELECT 
    fi.id,
    fi.invoice_number,
    fi.contract_id,
    fc.contract_number,
    fc.title as contract_title,
    COALESCE(c.name, s.company_name) as vendor_name,
    fi.period_start,
    fi.period_end,
    fi.invoice_date,
    fi.due_date,
    fi.status,
    fi.subtotal,
    fi.tax_amount,
    fi.retention_amount,
    fi.total_amount,
    fi.paid_amount,
    fi.total_amount - fi.paid_amount as balance_due,
    CASE 
        WHEN fi.due_date < CURRENT_DATE AND fi.status NOT IN ('paid', 'void') 
        THEN CURRENT_DATE - fi.due_date 
        ELSE 0 
    END as days_overdue,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM financial_lien_waivers 
            WHERE invoice_id = fi.id AND received_date IS NOT NULL
        ) THEN true 
        ELSE false 
    END as lien_waiver_received,
    fi.created_at,
    fi.updated_at
FROM financial_invoices fi
LEFT JOIN financial_contracts fc ON fi.contract_id = fc.id
LEFT JOIN companies c ON fc.company_id = c.id
LEFT JOIN subcontractors s ON fc.subcontractor_id = s.id;

CREATE OR REPLACE VIEW project_financial_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p."job number",
    p.state as project_status,
    COALESCE((
        SELECT SUM(budget_amount) 
        FROM financial_budget_items 
        WHERE project_id = p.id
    ), 0) as total_budget,
    COALESCE((
        SELECT SUM(revised_amount) 
        FROM financial_contracts 
        WHERE project_id = p.id
    ), 0) as total_contracts,
    COALESCE((
        SELECT SUM(fi.total_amount) 
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = p.id
    ), 0) as total_invoiced,
    COALESCE((
        SELECT SUM(fi.paid_amount) 
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = p.id
    ), 0) as total_paid,
    COALESCE((
        SELECT SUM(amount) 
        FROM financial_direct_costs 
        WHERE project_id = p.id AND approved = true
    ), 0) as total_direct_costs,
    COALESCE((
        SELECT SUM(variance_amount) 
        FROM financial_budget_items 
        WHERE project_id = p.id
    ), 0) as total_variance
FROM projects p;

CREATE OR REPLACE VIEW financial_change_order_summary AS
SELECT 
    fco.id,
    fco.change_order_number,
    fco.title,
    fco.status,
    fco.amount,
    fc.contract_number,
    fc.title as contract_title,
    fc.contract_type,
    COALESCE(c.name, s.company_name) as vendor_name,
    p.name as project_name,
    fco.approved_date,
    fco.created_at,
    fco.created_by
FROM financial_change_orders fco
LEFT JOIN financial_contracts fc ON fco.contract_id = fc.id
LEFT JOIN companies c ON fc.company_id = c.id
LEFT JOIN subcontractors s ON fc.subcontractor_id = s.id
LEFT JOIN projects p ON fc.project_id = p.id;

CREATE OR REPLACE VIEW financial_direct_costs_summary AS
SELECT 
    fdc.project_id,
    p.name as project_name,
    fdc.cost_code,
    fcc.description as cost_code_description,
    fdc.cost_type,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN fdc.approved = true THEN fdc.amount ELSE 0 END) as approved_amount,
    SUM(CASE WHEN fdc.approved = false THEN fdc.amount ELSE 0 END) as pending_amount,
    SUM(fdc.amount) as total_amount,
    MIN(fdc.cost_date) as first_cost_date,
    MAX(fdc.cost_date) as last_cost_date
FROM financial_direct_costs fdc
LEFT JOIN projects p ON fdc.project_id = p.id
LEFT JOIN financial_cost_codes fcc ON fdc.cost_code = fcc.code
GROUP BY fdc.project_id, p.name, fdc.cost_code, fcc.description, fdc.cost_type;

CREATE OR REPLACE VIEW financial_billing_period_status AS
SELECT 
    fbp.id,
    fbp.project_id,
    p.name as project_name,
    fbp.period_number,
    fbp.start_date,
    fbp.end_date,
    fbp.is_closed,
    (
        SELECT COUNT(*) 
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = fbp.project_id
        AND fi.period_start >= fbp.start_date
        AND fi.period_end <= fbp.end_date
    ) as invoice_count,
    (
        SELECT COALESCE(SUM(fi.total_amount), 0)
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = fbp.project_id
        AND fi.period_start >= fbp.start_date
        AND fi.period_end <= fbp.end_date
    ) as period_total,
    fbp.closed_date,
    fbp.created_at
FROM financial_billing_periods fbp
LEFT JOIN projects p ON fbp.project_id = p.id
ORDER BY fbp.project_id, fbp.period_number;

-- Grant access to views
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- 5. Populate some reasonable defaults for existing projects
UPDATE projects 
SET 
    "job number" = code,
    state = CASE 
        WHEN status = 'active' THEN 'In Progress'
        WHEN status = 'completed' THEN 'Complete'
        WHEN status = 'on_hold' THEN 'On Hold'
        ELSE 'Unknown'
    END,
    phase = CASE 
        WHEN status = 'active' THEN 'Construction'
        WHEN status = 'completed' THEN 'Closeout'
        WHEN status = 'on_hold' THEN 'Planning'
        ELSE 'Pre-Construction'
    END,
    archived = (status = 'archived'),
    category = 'General Construction'
WHERE "job number" IS NULL;