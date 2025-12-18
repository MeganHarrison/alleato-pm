-- Migration: Add extended fields to contracts table
-- Based on Procore Prime Contract form requirements

-- Add new columns to contracts table
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS owner_client_id INTEGER REFERENCES clients(id),
  ADD COLUMN IF NOT EXISTS contractor_id INTEGER REFERENCES clients(id),
  ADD COLUMN IF NOT EXISTS architect_engineer_id INTEGER REFERENCES clients(id),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS estimated_completion_date DATE,
  ADD COLUMN IF NOT EXISTS substantial_completion_date DATE,
  ADD COLUMN IF NOT EXISTS actual_completion_date DATE,
  ADD COLUMN IF NOT EXISTS signed_contract_received_date DATE,
  ADD COLUMN IF NOT EXISTS contract_termination_date DATE,
  ADD COLUMN IF NOT EXISTS inclusions TEXT,
  ADD COLUMN IF NOT EXISTS exclusions TEXT,
  ADD COLUMN IF NOT EXISTS default_retainage DECIMAL(5,2) DEFAULT 10 CHECK (default_retainage >= 0 AND default_retainage <= 100);

-- Create contract_allowed_users junction table for private contract access
CREATE TABLE IF NOT EXISTS contract_allowed_users (
  id SERIAL PRIMARY KEY,
  contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  can_see_sov_items BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contract_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contracts_owner_client ON contracts(owner_client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_contractor ON contracts(contractor_id);
CREATE INDEX IF NOT EXISTS idx_contracts_architect ON contracts(architect_engineer_id);
CREATE INDEX IF NOT EXISTS idx_contract_allowed_users_contract ON contract_allowed_users(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_allowed_users_user ON contract_allowed_users(user_id);

-- Add comments
COMMENT ON COLUMN contracts.owner_client_id IS 'The client/owner entity for this prime contract';
COMMENT ON COLUMN contracts.contractor_id IS 'The contracting party (often GC)';
COMMENT ON COLUMN contracts.architect_engineer_id IS 'Design professional tied to the contract';
COMMENT ON COLUMN contracts.description IS 'Narrative description / scope summary';
COMMENT ON COLUMN contracts.start_date IS 'Contract start date';
COMMENT ON COLUMN contracts.estimated_completion_date IS 'Planned/estimated completion date';
COMMENT ON COLUMN contracts.substantial_completion_date IS 'Date substantial completion achieved';
COMMENT ON COLUMN contracts.actual_completion_date IS 'Date project actually completed';
COMMENT ON COLUMN contracts.signed_contract_received_date IS 'Date signed contract was received';
COMMENT ON COLUMN contracts.contract_termination_date IS 'Date contract terminated (if applicable)';
COMMENT ON COLUMN contracts.inclusions IS 'What is explicitly included in contract scope';
COMMENT ON COLUMN contracts.exclusions IS 'What is explicitly excluded from scope';
COMMENT ON COLUMN contracts.default_retainage IS 'Default retainage % applied to billing/SOV';
COMMENT ON TABLE contract_allowed_users IS 'Users who can view private contracts';
