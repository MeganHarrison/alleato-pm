-- Budget Views Configuration System
-- Allows users to create custom budget views with different column configurations
-- Based on Procore's "Configure Budget Views" feature

-- ============================================================================
-- BUDGET VIEWS TABLE
-- Stores user-defined budget view configurations
-- ============================================================================
CREATE TABLE IF NOT EXISTS budget_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT FALSE, -- System views (e.g., "Procore Standard") cannot be deleted
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique view names per project
  UNIQUE(project_id, name)
);

-- Index for faster project-based queries
CREATE INDEX idx_budget_views_project ON budget_views(project_id);
CREATE INDEX idx_budget_views_default ON budget_views(project_id, is_default) WHERE is_default = TRUE;

-- ============================================================================
-- BUDGET VIEW COLUMNS TABLE
-- Defines which columns are visible in each view and their display order
-- ============================================================================
CREATE TABLE IF NOT EXISTS budget_view_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id UUID NOT NULL REFERENCES budget_views(id) ON DELETE CASCADE,
  column_key VARCHAR(100) NOT NULL, -- e.g., 'originalBudgetAmount', 'revisedBudget', etc.
  display_name VARCHAR(255), -- Optional custom column name
  display_order INTEGER NOT NULL DEFAULT 0,
  width INTEGER, -- Column width in pixels (optional)
  is_visible BOOLEAN DEFAULT TRUE,
  is_locked BOOLEAN DEFAULT FALSE, -- Locked columns cannot be hidden
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique column keys per view
  UNIQUE(view_id, column_key)
);

-- Index for faster view-based queries
CREATE INDEX idx_budget_view_columns_view ON budget_view_columns(view_id);
CREATE INDEX idx_budget_view_columns_order ON budget_view_columns(view_id, display_order);

-- ============================================================================
-- INSERT DEFAULT SYSTEM VIEWS
-- Create the built-in "Procore Standard" view
-- ============================================================================
DO $$
DECLARE
  v_view_id UUID;
  v_project_id INTEGER;
BEGIN
  -- Insert default view for each existing project
  FOR v_project_id IN SELECT id FROM projects LOOP
    -- Create "Procore Standard" view
    INSERT INTO budget_views (project_id, name, description, is_default, is_system)
    VALUES (
      v_project_id,
      'Procore Standard',
      'Default budget view with all standard columns',
      TRUE,
      TRUE
    )
    RETURNING id INTO v_view_id;

    -- Add standard columns in order
    INSERT INTO budget_view_columns (view_id, column_key, display_order, is_locked) VALUES
      (v_view_id, 'costCode', 1, TRUE),
      (v_view_id, 'description', 2, TRUE),
      (v_view_id, 'originalBudgetAmount', 3, FALSE),
      (v_view_id, 'budgetModifications', 4, FALSE),
      (v_view_id, 'approvedCOs', 5, FALSE),
      (v_view_id, 'revisedBudget', 6, FALSE),
      (v_view_id, 'directCosts', 7, FALSE),
      (v_view_id, 'committedCosts', 8, FALSE),
      (v_view_id, 'pendingCostChanges', 9, FALSE),
      (v_view_id, 'projectedCosts', 10, FALSE),
      (v_view_id, 'projectedBudget', 11, FALSE),
      (v_view_id, 'projectedOverUnder', 12, FALSE);
  END LOOP;
END $$;

-- ============================================================================
-- TRIGGER: Update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_budget_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER budget_views_updated_at
  BEFORE UPDATE ON budget_views
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_views_updated_at();

CREATE TRIGGER budget_view_columns_updated_at
  BEFORE UPDATE ON budget_view_columns
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_views_updated_at();

-- ============================================================================
-- TRIGGER: Ensure only one default view per project
-- ============================================================================
CREATE OR REPLACE FUNCTION ensure_single_default_view()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    -- Unset other default views for this project
    UPDATE budget_views
    SET is_default = FALSE
    WHERE project_id = NEW.project_id
      AND id != NEW.id
      AND is_default = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_budget_view
  BEFORE INSERT OR UPDATE ON budget_views
  FOR EACH ROW
  WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION ensure_single_default_view();

-- ============================================================================
-- FUNCTION: Clone a budget view
-- ============================================================================
CREATE OR REPLACE FUNCTION clone_budget_view(
  source_view_id UUID,
  new_name VARCHAR(255),
  new_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_new_view_id UUID;
  v_project_id INTEGER;
BEGIN
  -- Get the project ID from the source view
  SELECT project_id INTO v_project_id
  FROM budget_views
  WHERE id = source_view_id;

  -- Create the new view
  INSERT INTO budget_views (project_id, name, description, is_default, is_system)
  SELECT project_id, new_name, COALESCE(new_description, description), FALSE, FALSE
  FROM budget_views
  WHERE id = source_view_id
  RETURNING id INTO v_new_view_id;

  -- Clone all columns
  INSERT INTO budget_view_columns (view_id, column_key, display_name, display_order, width, is_visible, is_locked)
  SELECT v_new_view_id, column_key, display_name, display_order, width, is_visible, is_locked
  FROM budget_view_columns
  WHERE view_id = source_view_id;

  RETURN v_new_view_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES
-- Enable Row Level Security
-- ============================================================================
ALTER TABLE budget_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_view_columns ENABLE ROW LEVEL SECURITY;

-- Budget Views: Users can view views for projects they have access to
CREATE POLICY budget_views_select_policy ON budget_views
  FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN project_users pu ON p.id = pu.project_id
      WHERE pu.user_id = auth.uid()
    )
  );

-- Budget Views: Users can insert views for projects they have access to
CREATE POLICY budget_views_insert_policy ON budget_views
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN project_users pu ON p.id = pu.project_id
      WHERE pu.user_id = auth.uid()
    )
  );

-- Budget Views: Users can update non-system views
CREATE POLICY budget_views_update_policy ON budget_views
  FOR UPDATE
  USING (
    is_system = FALSE
    AND project_id IN (
      SELECT p.id FROM projects p
      JOIN project_users pu ON p.id = pu.project_id
      WHERE pu.user_id = auth.uid()
    )
  );

-- Budget Views: Users can delete non-system views
CREATE POLICY budget_views_delete_policy ON budget_views
  FOR DELETE
  USING (
    is_system = FALSE
    AND project_id IN (
      SELECT p.id FROM projects p
      JOIN project_users pu ON p.id = pu.project_id
      WHERE pu.user_id = auth.uid()
    )
  );

-- Budget View Columns: Users can view columns for views they have access to
CREATE POLICY budget_view_columns_select_policy ON budget_view_columns
  FOR SELECT
  USING (
    view_id IN (
      SELECT bv.id FROM budget_views bv
      JOIN projects p ON bv.project_id = p.id
      JOIN project_users pu ON p.id = pu.project_id
      WHERE pu.user_id = auth.uid()
    )
  );

-- Budget View Columns: Users can insert columns for views they have access to
CREATE POLICY budget_view_columns_insert_policy ON budget_view_columns
  FOR INSERT
  WITH CHECK (
    view_id IN (
      SELECT bv.id FROM budget_views bv
      WHERE bv.is_system = FALSE
      AND bv.project_id IN (
        SELECT p.id FROM projects p
        JOIN project_users pu ON p.id = pu.project_id
        WHERE pu.user_id = auth.uid()
      )
    )
  );

-- Budget View Columns: Users can update columns for non-system views
CREATE POLICY budget_view_columns_update_policy ON budget_view_columns
  FOR UPDATE
  USING (
    view_id IN (
      SELECT bv.id FROM budget_views bv
      WHERE bv.is_system = FALSE
      AND bv.project_id IN (
        SELECT p.id FROM projects p
        JOIN project_users pu ON p.id = pu.project_id
        WHERE pu.user_id = auth.uid()
      )
    )
  );

-- Budget View Columns: Users can delete columns for non-system views
CREATE POLICY budget_view_columns_delete_policy ON budget_view_columns
  FOR DELETE
  USING (
    view_id IN (
      SELECT bv.id FROM budget_views bv
      WHERE bv.is_system = FALSE
      AND bv.project_id IN (
        SELECT p.id FROM projects p
        JOIN project_users pu ON p.id = pu.project_id
        WHERE pu.user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE budget_views IS 'User-defined budget view configurations';
COMMENT ON TABLE budget_view_columns IS 'Column definitions for each budget view';
COMMENT ON FUNCTION clone_budget_view IS 'Creates a copy of an existing budget view with all its columns';
