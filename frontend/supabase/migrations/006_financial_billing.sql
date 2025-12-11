-- Financial Billing Tables
-- Based on invoice workflows and billing configuration

-- Billing Periods
CREATE TABLE billing_periods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  period_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status billing_period_status NOT NULL DEFAULT 'open',
  cutoff_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, period_number),
  CHECK (end_date >= start_date)
);

-- Invoices (for both contracts and commitments)
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  -- Polymorphic reference: either contract or commitment
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  commitment_id UUID REFERENCES commitments(id) ON DELETE CASCADE,
  billing_period_id UUID REFERENCES billing_periods(id),
  invoice_number TEXT NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  invoice_date DATE NOT NULL,
  due_date DATE,
  -- Financial amounts
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  retention_held DECIMAL(15,2) DEFAULT 0 CHECK (retention_held >= 0),
  previously_invoiced DECIMAL(15,2) DEFAULT 0 CHECK (previously_invoiced >= 0),
  current_payment_due DECIMAL(15,2) GENERATED ALWAYS AS (amount - retention_held) STORED,
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  -- Ensure it's linked to either contract OR commitment
  CHECK (
    (contract_id IS NOT NULL AND commitment_id IS NULL) OR
    (contract_id IS NULL AND commitment_id IS NOT NULL)
  ),
  -- Unique invoice number per project
  UNIQUE(project_id, invoice_number)
);

-- Invoice Line Items
CREATE TABLE invoice_line_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  scheduled_value DECIMAL(15,2),
  previous_amount DECIMAL(15,2) DEFAULT 0,
  current_amount DECIMAL(15,2) NOT NULL,
  percent_complete DECIMAL(5,2) CHECK (percent_complete >= 0 AND percent_complete <= 100),
  retention_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(invoice_id, line_number)
);

-- Payments
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  payment_number TEXT NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT, -- 'check', 'wire', 'ach', etc.
  reference_number TEXT, -- Check number, transaction ID
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(invoice_id, payment_number)
);

-- Invoice Approvals (workflow tracking)
CREATE TABLE invoice_approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  approval_status TEXT NOT NULL CHECK (approval_status IN ('approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Budget Items (for budget tracking)
CREATE TABLE budget_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  cost_code_id UUID NOT NULL REFERENCES cost_codes(id),
  original_budget DECIMAL(15,2) NOT NULL CHECK (original_budget >= 0),
  revised_budget DECIMAL(15,2),
  forecast_to_complete DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, cost_code_id)
);

-- Function to update invoice status when paid in full
CREATE OR REPLACE FUNCTION check_invoice_paid_status()
RETURNS TRIGGER AS $$
DECLARE
  total_paid DECIMAL(15,2);
  invoice_total DECIMAL(15,2);
BEGIN
  -- Calculate total payments for this invoice
  SELECT COALESCE(SUM(amount), 0) INTO total_paid
  FROM payments
  WHERE invoice_id = NEW.invoice_id;
  
  -- Get invoice total (current payment due)
  SELECT current_payment_due INTO invoice_total
  FROM invoices
  WHERE id = NEW.invoice_id;
  
  -- If fully paid, update status
  IF total_paid >= invoice_total THEN
    UPDATE invoices
    SET status = 'paid'
    WHERE id = NEW.invoice_id
    AND status != 'paid';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_paid_status
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION check_invoice_paid_status();

-- Create indexes
CREATE INDEX idx_billing_periods_project ON billing_periods(project_id);
CREATE INDEX idx_billing_periods_status ON billing_periods(status);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_contract ON invoices(contract_id);
CREATE INDEX idx_invoices_commitment ON invoices(commitment_id);
CREATE INDEX idx_invoices_period ON invoices(billing_period_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_invoice_approvals_invoice ON invoice_approvals(invoice_id);
CREATE INDEX idx_budget_items_project ON budget_items(project_id);
CREATE INDEX idx_budget_items_cost_code ON budget_items(cost_code_id);

-- Add update triggers
CREATE TRIGGER update_billing_periods_updated_at BEFORE UPDATE ON billing_periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE billing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Billing periods viewable by project members
CREATE POLICY "Billing periods viewable by project members" ON billing_periods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = billing_periods.project_id 
      AND project_users.user_id = auth.uid()
    )
  );

-- Invoices follow same permissions as parent contract/commitment
CREATE POLICY "Invoices viewable by project members" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = invoices.project_id 
      AND project_users.user_id = auth.uid()
    )
  );

-- Budget items viewable by project members with financial permissions
CREATE POLICY "Budget items viewable by project financial users" ON budget_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users pu
      JOIN user_profiles up ON up.id = pu.user_id
      WHERE pu.project_id = budget_items.project_id 
      AND pu.user_id = auth.uid()
      AND up.role IN ('admin', 'project_manager', 'accountant')
    )
  );