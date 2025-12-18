-- =====================================================
-- Budget System Schema Foundation
-- Migration: 008_budget_system_schema.sql
-- Description: Creates budget_codes, sub_jobs, and line item tables for production-grade budget system
-- Date: 2025-12-17
-- =====================================================

-- 1. Create sub_jobs table (project phases)
CREATE TABLE IF NOT EXISTS sub_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_subjob_code UNIQUE (project_id, code)
);

-- 2. Create budget_codes table (grouping level for budget line items)
CREATE TABLE IF NOT EXISTS budget_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL,
    cost_code_id TEXT NOT NULL REFERENCES cost_codes(id),
    cost_type_id UUID REFERENCES cost_code_types(id) ON DELETE SET NULL,
    description TEXT,
    position INTEGER DEFAULT 999,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 3. Create budget_line_items table (detail level within budget_code)
CREATE TABLE IF NOT EXISTS budget_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_code_id UUID NOT NULL REFERENCES budget_codes(id) ON DELETE CASCADE,
    description TEXT,
    line_number INTEGER,
    original_amount DECIMAL(15,2) DEFAULT 0,
    unit_qty DECIMAL(15,3),
    uom VARCHAR(50),
    unit_cost DECIMAL(15,2),
    calculation_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 4. Create change_order_line_items table
CREATE TABLE IF NOT EXISTS change_order_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_order_id BIGINT NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
    budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
    cost_code_id TEXT REFERENCES cost_codes(id),
    description TEXT NOT NULL,
    line_number INTEGER,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    unit_qty DECIMAL(15,3),
    uom VARCHAR(50),
    unit_cost DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create direct_cost_line_items table
CREATE TABLE IF NOT EXISTS direct_cost_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
    cost_code_id TEXT REFERENCES cost_codes(id),
    description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    approved BOOLEAN DEFAULT false,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    cost_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 6. Update existing budget_items table
ALTER TABLE budget_items
    ADD COLUMN IF NOT EXISTS budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS sub_job_id UUID REFERENCES sub_jobs(id) ON DELETE SET NULL;

-- 7. Note: commitment_line_items table doesn't exist yet
-- TODO: Add commitment_line_items table in future migration if needed

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sub_jobs_project ON sub_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_sub_jobs_active ON sub_jobs(is_active) WHERE is_active = true;

-- Unique index for budget_codes with COALESCE for nullable columns
CREATE UNIQUE INDEX IF NOT EXISTS idx_budget_codes_unique
    ON budget_codes(project_id, cost_code_id, COALESCE(sub_job_id::text, ''), COALESCE(cost_type_id::text, ''));

CREATE INDEX IF NOT EXISTS idx_budget_codes_project ON budget_codes(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_codes_cost_code ON budget_codes(cost_code_id);
CREATE INDEX IF NOT EXISTS idx_budget_codes_cost_type ON budget_codes(cost_type_id) WHERE cost_type_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_budget_codes_subjob ON budget_codes(sub_job_id) WHERE sub_job_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_budget_line_items_budget_code ON budget_line_items(budget_code_id);

CREATE INDEX IF NOT EXISTS idx_change_order_line_items_co ON change_order_line_items(change_order_id);
CREATE INDEX IF NOT EXISTS idx_change_order_line_items_budget ON change_order_line_items(budget_code_id) WHERE budget_code_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_change_order_line_items_cost_code ON change_order_line_items(cost_code_id) WHERE cost_code_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_project ON direct_cost_line_items(project_id);
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_budget ON direct_cost_line_items(budget_code_id) WHERE budget_code_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_cost_code ON direct_cost_line_items(cost_code_id) WHERE cost_code_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_approved ON direct_cost_line_items(approved);
CREATE INDEX IF NOT EXISTS idx_direct_cost_line_items_date ON direct_cost_line_items(transaction_date);

CREATE INDEX IF NOT EXISTS idx_budget_items_budget_code ON budget_items(budget_code_id) WHERE budget_code_id IS NOT NULL;

-- 9. Enable RLS on new tables
ALTER TABLE sub_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_cost_line_items ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies (basic - all authenticated users can read/write)
CREATE POLICY "sub_jobs_read" ON sub_jobs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "sub_jobs_write" ON sub_jobs FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "budget_codes_read" ON budget_codes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_codes_write" ON budget_codes FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "budget_line_items_read" ON budget_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "budget_line_items_write" ON budget_line_items FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "change_order_line_items_read" ON change_order_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "change_order_line_items_write" ON change_order_line_items FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "direct_cost_line_items_read" ON direct_cost_line_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "direct_cost_line_items_write" ON direct_cost_line_items FOR ALL USING (auth.uid() IS NOT NULL);

-- 11. Add update triggers for updated_at columns
CREATE TRIGGER update_sub_jobs_updated_at BEFORE UPDATE ON sub_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_codes_updated_at BEFORE UPDATE ON budget_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_line_items_updated_at BEFORE UPDATE ON budget_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_change_order_line_items_updated_at BEFORE UPDATE ON change_order_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_direct_cost_line_items_updated_at BEFORE UPDATE ON direct_cost_line_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration complete
-- Next: Run migration 009_budget_rollup_views.sql to create calculation views
