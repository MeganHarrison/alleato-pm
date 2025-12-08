-- Financial Module Seed Data
-- This file contains sample data for the financial tables

-- Note: This assumes you have existing data in the following tables:
-- - companies (with at least one company)
-- - subcontractors (with at least one subcontractor)
-- - projects (with at least one project with id = 1)
-- - auth.users (with at least one user)

-- Insert sample cost codes
INSERT INTO financial_cost_codes (code, description, code_type, sort_order) VALUES
    ('01', 'General Requirements', 'general', 1),
    ('02', 'Site Work', 'site', 2),
    ('03', 'Concrete', 'material', 3),
    ('09', 'Finishes', 'material', 9),
    ('15', 'Mechanical', 'subcontract', 15),
    ('16', 'Electrical', 'subcontract', 16);

-- Insert child cost codes
INSERT INTO financial_cost_codes (code, description, parent_id, code_type, sort_order) 
VALUES
    ('01-10', 'Project Management', (SELECT id FROM financial_cost_codes WHERE code = '01'), 'labor', 10),
    ('01-20', 'Site Office', (SELECT id FROM financial_cost_codes WHERE code = '01'), 'other', 20),
    ('03-10', 'Footings & Foundations', (SELECT id FROM financial_cost_codes WHERE code = '03'), 'material', 10),
    ('03-20', 'Slabs on Grade', (SELECT id FROM financial_cost_codes WHERE code = '03'), 'material', 20),
    ('16-10', 'Electrical Service', (SELECT id FROM financial_cost_codes WHERE code = '16'), 'subcontract', 10),
    ('16-20', 'Lighting', (SELECT id FROM financial_cost_codes WHERE code = '16'), 'subcontract', 20);

-- Insert sample financial contracts
-- Prime contract
INSERT INTO financial_contracts (contract_number, contract_type, title, description, project_id, status, contract_amount, start_date, end_date)
VALUES 
    ('PC-2024-001', 'prime', 'Main Office Renovation - Prime Contract', 'Prime contract for office renovation', 1, 'executed', 5000000, '2024-01-01', '2024-12-31');

-- Subcontracts (using first company and subcontractor found)
WITH first_company AS (SELECT id FROM companies LIMIT 1),
     first_subcontractor AS (SELECT id FROM subcontractors LIMIT 1)
INSERT INTO financial_contracts (contract_number, contract_type, title, company_id, subcontractor_id, project_id, status, contract_amount, start_date, end_date)
SELECT 
    'SC-2024-001', 
    'subcontract', 
    'Electrical Subcontract', 
    (SELECT id FROM first_company),
    NULL,
    1, 
    'executed', 
    480000, 
    '2024-02-01', 
    '2024-11-30'
UNION ALL
SELECT 
    'SC-2024-002', 
    'subcontract', 
    'Concrete Work', 
    NULL,
    (SELECT id FROM first_subcontractor),
    1, 
    'executed', 
    320000, 
    '2024-01-15', 
    '2024-06-30';

-- Insert budget items for project
INSERT INTO financial_budget_items (project_id, cost_code, description, budget_amount, committed_amount, spent_amount, forecast_amount)
VALUES
    (1, '01-10', 'Project Management', 250000, 200000, 50000, 0),
    (1, '01-20', 'Site Office & Facilities', 75000, 60000, 15000, 0),
    (1, '03-10', 'Footings & Foundations', 180000, 160000, 20000, 0),
    (1, '03-20', 'Slabs on Grade', 140000, 120000, 15000, 5000),
    (1, '09', 'Finishes', 450000, 380000, 45000, 25000),
    (1, '16-10', 'Electrical Service', 280000, 240000, 30000, 10000),
    (1, '16-20', 'Lighting Systems', 200000, 180000, 15000, 5000);

-- Insert billing periods
INSERT INTO financial_billing_periods (project_id, period_number, start_date, end_date, is_closed)
VALUES
    (1, 1, '2024-01-01', '2024-01-31', true),
    (1, 2, '2024-02-01', '2024-02-29', true),
    (1, 3, '2024-03-01', '2024-03-31', true),
    (1, 4, '2024-04-01', '2024-04-30', false);

-- Insert sample invoices for the contracts
INSERT INTO financial_invoices (invoice_number, contract_id, period_start, period_end, invoice_date, due_date, status, subtotal, retention_amount)
SELECT 
    'INV-' || fc.contract_number || '-001',
    fc.id,
    '2024-01-01',
    '2024-01-31',
    '2024-02-01',
    '2024-03-03',
    'submitted',
    fc.contract_amount * 0.10, -- 10% progress
    fc.contract_amount * 0.10 * 0.10 -- 10% retention
FROM financial_contracts fc
WHERE fc.status = 'executed' AND fc.contract_type = 'subcontract';

-- Insert a paid invoice
INSERT INTO financial_invoices (invoice_number, contract_id, period_start, period_end, invoice_date, due_date, status, subtotal, retention_amount, paid_amount, payment_date)
SELECT 
    'INV-' || fc.contract_number || '-002',
    fc.id,
    '2024-02-01',
    '2024-02-29',
    '2024-03-01',
    '2024-03-31',
    'paid',
    fc.contract_amount * 0.15, -- 15% progress
    fc.contract_amount * 0.15 * 0.10, -- 10% retention
    fc.contract_amount * 0.15 * 0.90, -- Paid amount (less retention)
    '2024-03-25'
FROM financial_contracts fc
WHERE fc.status = 'executed' AND fc.contract_type = 'subcontract'
LIMIT 1;

-- Insert some change orders
INSERT INTO financial_change_orders (change_order_number, contract_id, title, description, status, amount)
SELECT 
    'CO-' || fc.contract_number || '-001',
    fc.id,
    'Additional Electrical Outlets',
    'Owner requested 20 additional outlets in conference rooms',
    'pending',
    15000
FROM financial_contracts fc
WHERE fc.contract_number = 'SC-2024-001';

-- Insert approved change order and update contract
INSERT INTO financial_change_orders (change_order_number, contract_id, title, description, status, amount, approved_date)
SELECT 
    'CO-' || fc.contract_number || '-001',
    fc.id,
    'Foundation Depth Increase',
    'Soil conditions require deeper foundations',
    'approved',
    25000,
    '2024-02-15'
FROM financial_contracts fc
WHERE fc.contract_number = 'SC-2024-002';

-- Update the contract with approved change order amount
UPDATE financial_contracts 
SET change_order_amount = 25000 
WHERE contract_number = 'SC-2024-002';

-- Insert some direct costs
INSERT INTO financial_direct_costs (project_id, cost_code, vendor_name, invoice_number, description, cost_date, amount, cost_type, approved, created_by)
VALUES
    (1, '01-20', 'Office Supplies Inc', 'OS-2024-0123', 'Site office supplies', '2024-01-15', 2500, 'other', true, (SELECT id FROM auth.users LIMIT 1)),
    (1, '01-10', 'Temp Agency LLC', 'TA-2024-0045', 'Project coordinator - January', '2024-01-31', 8000, 'labor', true, (SELECT id FROM auth.users LIMIT 1)),
    (1, '03', 'Concrete Testing Lab', 'CTL-2024-0067', 'Concrete cylinder testing', '2024-02-20', 1500, 'other', true, (SELECT id FROM auth.users LIMIT 1)),
    (1, '16', 'Electrical Supply Co', 'ESC-2024-0234', 'Emergency lighting fixtures', '2024-03-10', 3500, 'material', false, (SELECT id FROM auth.users LIMIT 1));

-- Insert lien waivers for paid invoices
INSERT INTO financial_lien_waivers (invoice_id, waiver_type, waiver_period, amount, through_date)
SELECT 
    fi.id,
    'conditional',
    'partial',
    fi.total_amount,
    fi.period_end
FROM financial_invoices fi
WHERE fi.status = 'paid';

-- Update one lien waiver as received
UPDATE financial_lien_waivers 
SET received_date = CURRENT_DATE - INTERVAL '5 days' 
WHERE id = (SELECT id FROM financial_lien_waivers LIMIT 1);