-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Company types enum
CREATE TYPE company_type AS ENUM ('vendor', 'subcontractor', 'supplier', 'owner');

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'project_manager', 'accountant', 'viewer');

-- Status enums
CREATE TYPE commitment_status AS ENUM ('draft', 'sent', 'pending', 'approved', 'executed', 'closed', 'void');
CREATE TYPE change_event_status AS ENUM ('open', 'pending', 'approved', 'closed');
CREATE TYPE change_order_status AS ENUM ('draft', 'pending', 'approved', 'executed', 'void');
CREATE TYPE prime_contract_status AS ENUM ('draft', 'sent', 'pending', 'approved', 'executed', 'closed');
CREATE TYPE invoice_status AS ENUM ('draft', 'submitted', 'approved', 'paid', 'void');
CREATE TYPE project_status AS ENUM ('active', 'on_hold', 'completed', 'archived');

-- Accounting methods
CREATE TYPE accounting_method AS ENUM ('amount', 'unit', 'percent');

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type company_type NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    tax_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    status project_status NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE,
    budget_total DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commitments table
CREATE TABLE commitments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL,
    contract_company_id UUID REFERENCES companies(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status commitment_status NOT NULL DEFAULT 'draft',
    original_amount DECIMAL(15,2) DEFAULT 0,
    approved_change_orders DECIMAL(15,2) DEFAULT 0,
    revised_contract_amount DECIMAL(15,2) GENERATED ALWAYS AS (original_amount + approved_change_orders) STORED,
    billed_to_date DECIMAL(15,2) DEFAULT 0,
    balance_to_finish DECIMAL(15,2) GENERATED ALWAYS AS (revised_contract_amount - billed_to_date) STORED,
    executed_date DATE,
    start_date DATE,
    substantial_completion_date DATE,
    accounting_method accounting_method NOT NULL DEFAULT 'amount',
    retention_percentage DECIMAL(5,2),
    vendor_invoice_number VARCHAR(100),
    signed_received_date DATE,
    assignee_id UUID REFERENCES users(id),
    private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commitment line items
CREATE TABLE commitment_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commitment_id UUID REFERENCES commitments(id) ON DELETE CASCADE,
    cost_code VARCHAR(50) NOT NULL,
    line_item_type VARCHAR(100),
    description TEXT NOT NULL,
    quantity DECIMAL(15,3),
    unit VARCHAR(50),
    unit_cost DECIMAL(15,2),
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change events
CREATE TABLE change_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status change_event_status NOT NULL DEFAULT 'open',
    commitment_id UUID REFERENCES commitments(id),
    created_by_id UUID REFERENCES users(id),
    rom_cost_impact DECIMAL(15,2),
    rom_schedule_impact INTEGER, -- days
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change orders
CREATE TABLE change_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    change_event_id UUID REFERENCES change_events(id),
    number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status change_order_status NOT NULL DEFAULT 'draft',
    commitment_id UUID REFERENCES commitments(id),
    amount DECIMAL(15,2) NOT NULL,
    executed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prime contracts
CREATE TABLE prime_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES companies(id),
    status prime_contract_status NOT NULL DEFAULT 'draft',
    contract_date DATE,
    start_date DATE,
    substantial_completion_date DATE,
    original_amount DECIMAL(15,2) DEFAULT 0,
    approved_change_orders DECIMAL(15,2) DEFAULT 0,
    revised_contract_amount DECIMAL(15,2) GENERATED ALWAYS AS (original_amount + approved_change_orders) STORED,
    billed_to_date DECIMAL(15,2) DEFAULT 0,
    retention_percentage DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commitment_id UUID REFERENCES commitments(id),
    number VARCHAR(50) UNIQUE NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    retention_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (subtotal + tax_amount - retention_amount) STORED,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    commitment_line_item_id UUID REFERENCES commitment_line_items(id),
    description TEXT NOT NULL,
    quantity DECIMAL(15,3) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    previously_billed DECIMAL(15,2) DEFAULT 0,
    this_period DECIMAL(15,2) NOT NULL,
    completed_to_date DECIMAL(15,2) GENERATED ALWAYS AS (previously_billed + this_period) STORED,
    percent_complete DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget items
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cost_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    original_budget DECIMAL(15,2) DEFAULT 0,
    budget_modifications DECIMAL(15,2) DEFAULT 0,
    revised_budget DECIMAL(15,2) GENERATED ALWAYS AS (original_budget + budget_modifications) STORED,
    committed_costs DECIMAL(15,2) DEFAULT 0,
    direct_costs DECIMAL(15,2) DEFAULT 0,
    forecast_to_complete DECIMAL(15,2) DEFAULT 0,
    estimated_cost_at_completion DECIMAL(15,2) GENERATED ALWAYS AS (committed_costs + direct_costs + forecast_to_complete) STORED,
    variance DECIMAL(15,2) GENERATED ALWAYS AS (revised_budget - estimated_cost_at_completion) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_commitments_company ON commitments(contract_company_id);
CREATE INDEX idx_change_events_status ON change_events(status);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_commitment ON invoices(commitment_id);
CREATE INDEX idx_budget_items_cost_code ON budget_items(cost_code);

-- Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitment_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE prime_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - you may want to customize based on your requirements)
-- All authenticated users can read
CREATE POLICY "Users can read companies" ON companies FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read users" ON users FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read projects" ON projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read commitments" ON commitments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read commitment line items" ON commitment_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read change events" ON change_events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read change orders" ON change_orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read prime contracts" ON prime_contracts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read invoices" ON invoices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read invoice line items" ON invoice_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read budget items" ON budget_items FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins and project managers can insert/update/delete
CREATE POLICY "Admins can manage companies" ON companies FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'project_manager'))
);

CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Similar policies for other tables...
CREATE POLICY "Admins can manage commitments" ON commitments FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'project_manager'))
);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_commitment_line_items_updated_at BEFORE UPDATE ON commitment_line_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_change_events_updated_at BEFORE UPDATE ON change_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON change_orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_prime_contracts_updated_at BEFORE UPDATE ON prime_contracts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoice_line_items_updated_at BEFORE UPDATE ON invoice_line_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();