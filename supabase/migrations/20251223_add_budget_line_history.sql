-- =====================================================
-- Budget Line Item History & Audit Trail Migration
-- Migration: 20251223_add_budget_line_history.sql
-- Description: Add change tracking for budget line items
-- Date: 2025-12-23
-- =====================================================

-- STEP 1: Add updated_by and updated_at columns to budget_lines
-- =====================================================

ALTER TABLE budget_lines
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for updated_at
CREATE INDEX IF NOT EXISTS idx_budget_lines_updated_at ON budget_lines(updated_at DESC);

-- STEP 2: Create budget_line_history table
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_line_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_line_id UUID NOT NULL REFERENCES budget_lines(id) ON DELETE CASCADE,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- What changed
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,

  -- Who and when
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Change context
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
  notes TEXT
);

-- STEP 3: Create indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_budget_line_history_budget_line_id ON budget_line_history(budget_line_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_history_changed_at ON budget_line_history(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_budget_line_history_project_id ON budget_line_history(project_id);

-- STEP 4: Create trigger function for auto-tracking changes
-- =====================================================

CREATE OR REPLACE FUNCTION track_budget_line_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT (create)
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO budget_line_history (
      budget_line_id, project_id, field_name, old_value, new_value,
      changed_by, change_type
    ) VALUES
      (NEW.id, NEW.project_id, 'quantity', NULL, NEW.quantity::TEXT, COALESCE(NEW.created_by, auth.uid()), 'create'),
      (NEW.id, NEW.project_id, 'unit_cost', NULL, NEW.unit_cost::TEXT, COALESCE(NEW.created_by, auth.uid()), 'create'),
      (NEW.id, NEW.project_id, 'description', NULL, COALESCE(NEW.description, ''), COALESCE(NEW.created_by, auth.uid()), 'create');
    RETURN NEW;
  END IF;

  -- On UPDATE
  IF (TG_OP = 'UPDATE') THEN
    -- Track quantity changes
    IF (OLD.quantity IS DISTINCT FROM NEW.quantity) THEN
      INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
      VALUES (NEW.id, NEW.project_id, 'quantity', OLD.quantity::TEXT, NEW.quantity::TEXT, COALESCE(NEW.updated_by, auth.uid()), 'update');
    END IF;

    -- Track unit_cost changes
    IF (OLD.unit_cost IS DISTINCT FROM NEW.unit_cost) THEN
      INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
      VALUES (NEW.id, NEW.project_id, 'unit_cost', OLD.unit_cost::TEXT, NEW.unit_cost::TEXT, COALESCE(NEW.updated_by, auth.uid()), 'update');
    END IF;

    -- Track description changes
    IF (OLD.description IS DISTINCT FROM NEW.description) THEN
      INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
      VALUES (NEW.id, NEW.project_id, 'description', COALESCE(OLD.description, ''), COALESCE(NEW.description, ''), COALESCE(NEW.updated_by, auth.uid()), 'update');
    END IF;

    -- Update updated_at timestamp
    NEW.updated_at = NOW();

    RETURN NEW;
  END IF;

  -- On DELETE
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
    VALUES (OLD.id, OLD.project_id, 'deleted', 'active', 'deleted', auth.uid(), 'delete');
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- STEP 5: Create trigger on budget_lines
-- =====================================================

DROP TRIGGER IF EXISTS budget_line_changes_trigger ON budget_lines;

CREATE TRIGGER budget_line_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON budget_lines
FOR EACH ROW
EXECUTE FUNCTION track_budget_line_changes();

-- STEP 6: Enable RLS on budget_line_history
-- =====================================================

ALTER TABLE budget_line_history ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create RLS policies for budget_line_history
-- =====================================================

-- Allow authenticated users to view all history (simplified for now)
-- TODO: Add proper project membership check when project_team_members table exists
CREATE POLICY budget_line_history_select_for_authenticated
ON budget_line_history
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert history (trigger will handle this)
CREATE POLICY budget_line_history_insert_for_authenticated
ON budget_line_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- STEP 8: Add helpful comments
-- =====================================================

COMMENT ON TABLE budget_line_history IS 'Audit trail for all changes to budget line items. Automatically populated by trigger.';
COMMENT ON COLUMN budget_line_history.field_name IS 'Name of the field that was changed (quantity, unit_cost, description, or deleted)';
COMMENT ON COLUMN budget_line_history.change_type IS 'Type of change: create (initial creation), update (modification), or delete (removal)';
COMMENT ON COLUMN budget_line_history.changed_by IS 'User who made the change';
COMMENT ON COLUMN budget_line_history.notes IS 'Optional notes about why the change was made';
