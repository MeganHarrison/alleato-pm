-- Change Management Tables
-- Based on workflow status map and UI evidence

-- Change Events
CREATE TABLE change_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status change_event_status NOT NULL DEFAULT 'open',
  created_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  estimated_impact DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(project_id, event_number)
);

-- Change Event Items (line items within an event)
CREATE TABLE change_event_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  change_event_id UUID NOT NULL REFERENCES change_events(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  estimated_amount DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(change_event_id, line_number)
);

-- Change Orders (for both contracts and commitments)
CREATE TABLE change_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  -- Polymorphic reference: either contract or commitment
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  commitment_id UUID REFERENCES commitments(id) ON DELETE CASCADE,
  change_event_id UUID REFERENCES change_events(id), -- Optional link to originating event
  change_order_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status change_order_status NOT NULL DEFAULT 'draft',
  amount DECIMAL(15,2) NOT NULL,
  created_date DATE DEFAULT CURRENT_DATE,
  approval_date DATE,
  execution_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  -- Ensure it's linked to either contract OR commitment, not both
  CHECK (
    (contract_id IS NOT NULL AND commitment_id IS NULL) OR
    (contract_id IS NULL AND commitment_id IS NOT NULL)
  ),
  -- Unique constraint per parent
  UNIQUE(contract_id, change_order_number),
  UNIQUE(commitment_id, change_order_number)
);

-- Change Order Items
CREATE TABLE change_order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  change_order_id UUID NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  quantity DECIMAL(15,4),
  unit TEXT,
  unit_price DECIMAL(15,4),
  amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(change_order_id, line_number)
);

-- Change Order Approvals (audit trail)
CREATE TABLE change_order_approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  change_order_id UUID NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  approval_type TEXT NOT NULL, -- 'internal', 'client', 'architect'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Function to update contract/commitment revised amounts when change orders are approved
CREATE OR REPLACE FUNCTION update_revised_amounts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'executed' AND OLD.status != 'executed' THEN
    -- Update contract revised amount
    IF NEW.contract_id IS NOT NULL THEN
      UPDATE contracts 
      SET revised_amount = COALESCE(revised_amount, original_amount) + NEW.amount
      WHERE id = NEW.contract_id;
    END IF;
    
    -- Update commitment revised amount
    IF NEW.commitment_id IS NOT NULL THEN
      UPDATE commitments
      SET revised_amount = COALESCE(revised_amount, original_amount) + NEW.amount
      WHERE id = NEW.commitment_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_revised_amounts_on_co_approval
  AFTER UPDATE ON change_orders
  FOR EACH ROW
  WHEN (NEW.status != OLD.status)
  EXECUTE FUNCTION update_revised_amounts();

-- Create indexes
CREATE INDEX idx_change_events_project ON change_events(project_id);
CREATE INDEX idx_change_events_status ON change_events(status);
CREATE INDEX idx_change_events_number ON change_events(event_number);
CREATE INDEX idx_change_event_items_event ON change_event_items(change_event_id);
CREATE INDEX idx_change_orders_project ON change_orders(project_id);
CREATE INDEX idx_change_orders_contract ON change_orders(contract_id);
CREATE INDEX idx_change_orders_commitment ON change_orders(commitment_id);
CREATE INDEX idx_change_orders_event ON change_orders(change_event_id);
CREATE INDEX idx_change_orders_status ON change_orders(status);
CREATE INDEX idx_change_order_items_order ON change_order_items(change_order_id);
CREATE INDEX idx_change_order_approvals_order ON change_order_approvals(change_order_id);

-- Add update triggers
CREATE TRIGGER update_change_events_updated_at BEFORE UPDATE ON change_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_change_event_items_updated_at BEFORE UPDATE ON change_event_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON change_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_change_order_items_updated_at BEFORE UPDATE ON change_order_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE change_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_event_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_order_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Change events viewable by project members
CREATE POLICY "Change events viewable by project members" ON change_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = change_events.project_id 
      AND project_users.user_id = auth.uid()
    )
  );

-- Change orders follow same permissions as parent contract/commitment
CREATE POLICY "Change orders viewable based on parent permissions" ON change_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = change_orders.project_id 
      AND project_users.user_id = auth.uid()
    )
  );