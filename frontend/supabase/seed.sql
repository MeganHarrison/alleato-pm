-- Sample companies
INSERT INTO companies (id, name, type, contact_email, contact_phone) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'ABC Construction LLC', 'vendor', 'contact@abcconstruction.com', '555-0100'),
    ('550e8400-e29b-41d4-a716-446655440002', 'XYZ Electric Co', 'subcontractor', 'info@xyzelectric.com', '555-0200'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Superior Plumbing Inc', 'subcontractor', 'sales@superiorplumbing.com', '555-0300'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Materials Direct', 'supplier', 'orders@materialsdirect.com', '555-0400'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Property Development Group', 'owner', 'admin@propdevgroup.com', '555-0500');

-- Sample users (you'll need to create these users in Supabase Auth first)
-- These IDs are placeholders - replace with actual auth.users IDs
INSERT INTO users (id, email, full_name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin User', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'pm@example.com', 'Project Manager', 'project_manager'),
    ('33333333-3333-3333-3333-333333333333', 'accountant@example.com', 'Accountant User', 'accountant');

-- Sample projects
INSERT INTO projects (id, name, code, description, status, start_date, budget_total) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Main Office Renovation', 'MAIN-001', 'Complete renovation of main office building', 'active', '2024-01-01', 5000000);

-- Sample budget items
INSERT INTO budget_items (cost_code, description, original_budget, committed_costs) VALUES
    ('01-000', 'General Conditions', 500000, 450000),
    ('02-000', 'Site Work', 300000, 250000),
    ('03-000', 'Concrete', 400000, 380000),
    ('04-000', 'Masonry', 200000, 150000),
    ('05-000', 'Metals', 150000, 120000),
    ('06-000', 'Wood & Plastics', 250000, 200000),
    ('07-000', 'Thermal & Moisture Protection', 350000, 300000),
    ('08-000', 'Doors & Windows', 200000, 180000),
    ('09-000', 'Finishes', 450000, 400000),
    ('10-000', 'Specialties', 100000, 80000),
    ('11-000', 'Equipment', 150000, 120000),
    ('12-000', 'Furnishings', 200000, 180000),
    ('13-000', 'Special Construction', 300000, 250000),
    ('14-000', 'Conveying Systems', 150000, 120000),
    ('15-000', 'Mechanical', 600000, 550000),
    ('16-000', 'Electrical', 500000, 480000);

-- Sample commitments
INSERT INTO commitments (number, contract_company_id, title, description, status, original_amount, executed_date, start_date, substantial_completion_date, accounting_method, retention_percentage, assignee_id, created_by) VALUES
    ('SC-001', '550e8400-e29b-41d4-a716-446655440002', 'Electrical Subcontract', 'Complete electrical work for main office renovation', 'executed', 480000, '2024-01-15', '2024-02-01', '2024-12-01', 'amount', 10, '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
    ('SC-002', '550e8400-e29b-41d4-a716-446655440003', 'Plumbing Subcontract', 'All plumbing work including fixtures', 'executed', 320000, '2024-01-20', '2024-02-15', '2024-11-15', 'amount', 10, '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
    ('PO-001', '550e8400-e29b-41d4-a716-446655440004', 'Concrete Materials', 'Ready-mix concrete supply', 'approved', 150000, NULL, '2024-03-01', '2024-09-01', 'unit', 0, '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
    ('SC-003', '550e8400-e29b-41d4-a716-446655440001', 'General Contractor Services', 'General contracting and supervision', 'draft', 950000, NULL, '2024-01-01', '2024-12-31', 'percent', 5, NULL, '11111111-1111-1111-1111-111111111111');

-- Sample commitment line items
INSERT INTO commitment_line_items (commitment_id, cost_code, line_item_type, description, quantity, unit, unit_cost, amount) VALUES
    ((SELECT id FROM commitments WHERE number = 'SC-001'), '16-100', 'Labor', 'Electrical Rough-In', 2000, 'hours', 85, 170000),
    ((SELECT id FROM commitments WHERE number = 'SC-001'), '16-200', 'Material', 'Electrical Fixtures', 1, 'lot', 150000, 150000),
    ((SELECT id FROM commitments WHERE number = 'SC-001'), '16-300', 'Labor', 'Electrical Finish', 1000, 'hours', 95, 95000),
    ((SELECT id FROM commitments WHERE number = 'SC-001'), '16-400', 'Material', 'Panels and Switchgear', 1, 'lot', 65000, 65000);

-- Sample prime contract
INSERT INTO prime_contracts (number, title, description, owner_id, status, contract_date, start_date, substantial_completion_date, original_amount, retention_percentage) VALUES
    ('PC-001', 'Main Office Renovation Contract', 'Complete renovation of 50,000 sq ft office building', '550e8400-e29b-41d4-a716-446655440005', 'executed', '2023-12-15', '2024-01-01', '2024-12-31', 5000000, 10);

-- Sample change events
INSERT INTO change_events (number, title, description, status, commitment_id, created_by_id, rom_cost_impact, rom_schedule_impact) VALUES
    ('CE-001', 'Additional Electrical Outlets', 'Owner requested 20 additional outlets in conference rooms', 'approved', (SELECT id FROM commitments WHERE number = 'SC-001'), '22222222-2222-2222-2222-222222222222', 15000, 5),
    ('CE-002', 'Plumbing Fixture Upgrade', 'Upgrade to premium fixtures in executive washrooms', 'pending', (SELECT id FROM commitments WHERE number = 'SC-002'), '22222222-2222-2222-2222-222222222222', 25000, 0);

-- Sample change orders
INSERT INTO change_orders (change_event_id, number, title, description, status, commitment_id, amount) VALUES
    ((SELECT id FROM change_events WHERE number = 'CE-001'), 'CO-001', 'Additional Electrical Outlets', 'Add 20 outlets per owner request', 'approved', (SELECT id FROM commitments WHERE number = 'SC-001'), 15000);

-- Update approved change orders amount on commitments
UPDATE commitments SET approved_change_orders = 15000 WHERE number = 'SC-001';