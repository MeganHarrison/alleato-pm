-- Create submittals table
CREATE TABLE IF NOT EXISTS submittals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('product_data', 'shop_drawings', 'samples', 'other')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'approved_as_noted')),
  assignee TEXT NOT NULL,
  due_date DATE,
  submitted_by TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE submittals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Authenticated users can manage submittals" ON submittals
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_submittals_updated_at
    BEFORE UPDATE ON submittals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_submittals_project_id ON submittals(project_id);
CREATE INDEX idx_submittals_status ON submittals(status);
CREATE INDEX idx_submittals_due_date ON submittals(due_date);

-- Insert some sample data (optional - remove if you don't want sample data)
INSERT INTO submittals (number, title, type, status, assignee, due_date, submitted_by, revision, project_id)
VALUES 
  ('SUB-001', 'Structural Steel Shop Drawings', 'shop_drawings', 'submitted', 'Structural Engineer', '2025-12-20', 'Steel Fabricator Inc', 1, (SELECT id FROM projects LIMIT 1)),
  ('SUB-002', 'HVAC Equipment Product Data', 'product_data', 'approved', 'MEP Engineer', '2025-12-18', 'HVAC Contractor', 2, (SELECT id FROM projects LIMIT 1)),
  ('SUB-003', 'Concrete Mix Design', 'product_data', 'approved_as_noted', 'Civil Engineer', '2025-12-15', 'Concrete Supplier', 1, (SELECT id FROM projects LIMIT 1)),
  ('SUB-004', 'Window Samples', 'samples', 'rejected', 'Architect', '2025-12-22', 'Window Manufacturer', 1, (SELECT id FROM projects LIMIT 1)),
  ('SUB-005', 'Electrical Panel Schedule', 'shop_drawings', 'draft', 'Electrical Engineer', '2025-12-25', 'Electrical Contractor', 1, (SELECT id FROM projects LIMIT 1));