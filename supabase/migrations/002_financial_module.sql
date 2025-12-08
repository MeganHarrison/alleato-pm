-- Financial Module Migration
-- This migration adds financial functionality to the existing database
-- All tables are prefixed with 'financial_' to avoid conflicts with existing tables

-- Create financial contracts table
CREATE TABLE IF NOT EXISTS financial_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_type VARCHAR(50) NOT NULL, -- 'prime', 'subcontract', 'purchase_order'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company_id UUID REFERENCES companies(id),
    subcontractor_id UUID REFERENCES subcontractors(id),
    project_id BIGINT REFERENCES projects(id),
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

-- Create financial invoices table
CREATE TABLE IF NOT EXISTS financial_invoices (
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

-- Create financial budget items table
CREATE TABLE IF NOT EXISTS financial_budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES projects(id),
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

-- Create financial change orders table
CREATE TABLE IF NOT EXISTS financial_change_orders (
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

-- Create cost codes table
CREATE TABLE IF NOT EXISTS financial_cost_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    parent_id UUID REFERENCES financial_cost_codes(id),
    code_type VARCHAR(50), -- 'labor', 'material', 'equipment', 'subcontract', 'other'
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create direct costs table for non-contract expenses
CREATE TABLE IF NOT EXISTS financial_direct_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES projects(id),
    cost_code VARCHAR(50),
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    description TEXT NOT NULL,
    cost_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    cost_type VARCHAR(50), -- 'labor', 'material', 'equipment', 'other'
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create billing periods table
CREATE TABLE IF NOT EXISTS financial_billing_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT REFERENCES projects(id),
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

-- Create lien waivers table
CREATE TABLE IF NOT EXISTS financial_lien_waivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES financial_invoices(id),
    waiver_type VARCHAR(50) NOT NULL, -- 'conditional', 'unconditional'
    waiver_period VARCHAR(50) NOT NULL, -- 'partial', 'final'
    amount DECIMAL(15,2) NOT NULL,
    through_date DATE NOT NULL,
    received_date DATE,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_financial_contracts_company ON financial_contracts(company_id);
CREATE INDEX idx_financial_contracts_subcontractor ON financial_contracts(subcontractor_id);
CREATE INDEX idx_financial_contracts_project ON financial_contracts(project_id);
CREATE INDEX idx_financial_invoices_contract ON financial_invoices(contract_id);
CREATE INDEX idx_financial_budget_items_project ON financial_budget_items(project_id);
CREATE INDEX idx_financial_change_orders_contract ON financial_change_orders(contract_id);
CREATE INDEX idx_financial_direct_costs_project ON financial_direct_costs(project_id);
CREATE INDEX idx_financial_billing_periods_project ON financial_billing_periods(project_id);

-- Enable RLS on financial tables
ALTER TABLE financial_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_cost_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_direct_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_billing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_lien_waivers ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (all authenticated users can read)
CREATE POLICY "financial_contracts_read" ON financial_contracts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_invoices_read" ON financial_invoices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_budget_items_read" ON financial_budget_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_change_orders_read" ON financial_change_orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_cost_codes_read" ON financial_cost_codes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_direct_costs_read" ON financial_direct_costs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_billing_periods_read" ON financial_billing_periods FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_lien_waivers_read" ON financial_lien_waivers FOR SELECT USING (auth.uid() IS NOT NULL);

-- Write policies (all authenticated users can write - adjust as needed)
CREATE POLICY "financial_contracts_write" ON financial_contracts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_invoices_write" ON financial_invoices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_budget_items_write" ON financial_budget_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_change_orders_write" ON financial_change_orders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_cost_codes_write" ON financial_cost_codes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_direct_costs_write" ON financial_direct_costs FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_billing_periods_write" ON financial_billing_periods FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "financial_lien_waivers_write" ON financial_lien_waivers FOR ALL USING (auth.uid() IS NOT NULL);

-- Create or update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_financial_contracts_updated_at BEFORE UPDATE ON financial_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_invoices_updated_at BEFORE UPDATE ON financial_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_budget_items_updated_at BEFORE UPDATE ON financial_budget_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_change_orders_updated_at BEFORE UPDATE ON financial_change_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_cost_codes_updated_at BEFORE UPDATE ON financial_cost_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_direct_costs_updated_at BEFORE UPDATE ON financial_direct_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_billing_periods_updated_at BEFORE UPDATE ON financial_billing_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_lien_waivers_updated_at BEFORE UPDATE ON financial_lien_waivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();