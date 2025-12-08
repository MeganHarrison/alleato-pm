-- Sample data for existing tables only
-- This seed file has been updated to work with the actual database structure

-- Sample companies (these exist in the actual database)
INSERT INTO companies (name, address, city, state) VALUES
    ('ABC Construction LLC', '123 Main St', 'New York', 'NY'),
    ('XYZ Electric Co', '456 Electric Ave', 'Los Angeles', 'CA'),
    ('Superior Plumbing Inc', '789 Water St', 'Chicago', 'IL'),
    ('Materials Direct', '321 Supply Blvd', 'Houston', 'TX'),
    ('Property Development Group', '555 Tower Ave', 'Miami', 'FL')
ON CONFLICT (id) DO NOTHING;

-- Sample subcontractors (these exist in the actual database)
INSERT INTO subcontractors (company_name, address_line_1, city, state, primary_contact_name, primary_contact_email, primary_contact_phone)
VALUES
    ('Elite Electrical Services', '100 Power St', 'Dallas', 'TX', 'John Smith', 'john@eliteelectric.com', '555-0100'),
    ('Pro Concrete Works', '200 Cement Ave', 'Phoenix', 'AZ', 'Jane Doe', 'jane@proconcrete.com', '555-0200'),
    ('Premium Plumbing Co', '300 Pipe Ln', 'Seattle', 'WA', 'Bob Johnson', 'bob@premiumpipe.com', '555-0300')
ON CONFLICT (id) DO NOTHING;

-- Sample projects (using actual table structure)
-- Note: The projects table has different fields than expected
INSERT INTO projects (name, "job number", description, state, "start date", budget)
VALUES
    ('Downtown Office Building', 'DOB-2024', 'New 10-story office building', 'active', '2024-01-01', 10000000),
    ('Shopping Mall Renovation', 'SMR-2024', 'Major renovation of shopping center', 'active', '2024-02-01', 5000000),
    ('Hospital Wing Addition', 'HWA-2024', 'New emergency department wing', 'planning', '2024-06-01', 15000000)
ON CONFLICT (id) DO NOTHING;

-- Sample contacts
INSERT INTO contacts (first_name, last_name, email, phone, department)
VALUES
    ('Michael', 'Brown', 'mbrown@example.com', '555-1001', 'Engineering'),
    ('Sarah', 'Davis', 'sdavis@example.com', '555-1002', 'Accounting'),
    ('Robert', 'Wilson', 'rwilson@example.com', '555-1003', 'Operations'),
    ('Emily', 'Taylor', 'etaylor@example.com', '555-1004', 'Project Management'),
    ('David', 'Anderson', 'danderson@example.com', '555-1005', 'Safety')
ON CONFLICT (id) DO NOTHING;

-- Note: Financial data should be seeded using financial_seed.sql
-- which creates data for the financial_* tables