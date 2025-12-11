-- Migration: Create unified insights table
-- Run this in Supabase SQL Editor
--
-- This creates a unified insights table to replace separate risks/decisions/opportunities tables
-- Tasks remain in their own table due to different lifecycle (assignees, due dates, etc.)

-- ============================================================================
-- STEP 1: Create the insights table
-- ============================================================================

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields
  type TEXT NOT NULL CHECK (type IN ('risk', 'decision', 'opportunity', 'assumption', 'dependency', 'question', 'commitment')),
  title TEXT,  -- Short summary (optional, can be auto-generated)
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'accepted', 'deferred', 'superseded', 'mitigated', 'realized')),

  -- Relationships
  project_ids INTEGER[] DEFAULT '{}',
  source_meeting_id UUID,  -- References document_metadata(id)
  related_insight_ids UUID[] DEFAULT '{}',  -- Links between insights (e.g., risk -> decision -> task)

  -- AI extraction metadata
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  extraction_model TEXT,  -- Which model extracted this (e.g., 'gpt-4o')
  reviewed BOOLEAN DEFAULT FALSE,  -- Has a human verified this?
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,

  -- Type-specific data stored as JSON
  -- Risk: { likelihood, impact, category, mitigation, trigger }
  -- Decision: { rationale, owner, decision_date, alternatives_considered }
  -- Opportunity: { potential_value, owner, next_step, deadline }
  -- Commitment: { owner, committed_to, due_date }
  -- Question: { asker, context, urgency }
  metadata JSONB DEFAULT '{}',

  -- People involved
  owner TEXT,  -- Primary person responsible
  mentioned_people TEXT[] DEFAULT '{}',  -- All people mentioned in context

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Create indexes for common queries
-- ============================================================================

-- Query by project (most common)
CREATE INDEX IF NOT EXISTS idx_insights_project_ids ON insights USING GIN (project_ids);

-- Query by type
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights (type);

-- Query by source meeting
CREATE INDEX IF NOT EXISTS idx_insights_source_meeting ON insights (source_meeting_id);

-- Query open items only (partial index for efficiency)
CREATE INDEX IF NOT EXISTS idx_insights_open ON insights (type, created_at DESC) WHERE status = 'open';

-- Query by owner
CREATE INDEX IF NOT EXISTS idx_insights_owner ON insights (owner) WHERE owner IS NOT NULL;

-- Full text search on description
CREATE INDEX IF NOT EXISTS idx_insights_description_search ON insights USING GIN (to_tsvector('english', description));

-- ============================================================================
-- STEP 3: Add trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS insights_updated_at ON insights;
CREATE TRIGGER insights_updated_at
  BEFORE UPDATE ON insights
  FOR EACH ROW
  EXECUTE FUNCTION update_insights_updated_at();

-- ============================================================================
-- STEP 4: Add source columns to tasks table (if they don't exist)
-- ============================================================================

DO $$
BEGIN
  -- Add source_meeting_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'source_meeting_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN source_meeting_id UUID;
  END IF;

  -- Add source_insight_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'source_insight_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN source_insight_id UUID;
  END IF;

  -- Add confidence_score if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'confidence_score'
  ) THEN
    ALTER TABLE tasks ADD COLUMN confidence_score FLOAT;
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Create view for easy querying with project names
-- ============================================================================

CREATE OR REPLACE VIEW insights_with_projects AS
SELECT
  i.*,
  (
    SELECT json_agg(json_build_object('id', p.id, 'name', p.name))
    FROM projects p
    WHERE p.id = ANY(i.project_ids)
  ) as projects,
  dm.title as meeting_title,
  dm.date as meeting_date
FROM insights i
LEFT JOIN document_metadata dm ON i.source_meeting_id = dm.id;

-- ============================================================================
-- STEP 6: Enable Row Level Security (optional, for multi-tenant)
-- ============================================================================

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (customize based on your auth setup)
CREATE POLICY "Allow all operations on insights" ON insights
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 7: Grant permissions
-- ============================================================================

GRANT ALL ON insights TO authenticated;
GRANT ALL ON insights TO service_role;
GRANT SELECT ON insights_with_projects TO authenticated;
GRANT SELECT ON insights_with_projects TO service_role;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
--
-- Next steps:
-- 1. Run migration script to copy existing risks/decisions/opportunities
-- 2. Update application code to use new table
-- 3. Verify data integrity
-- 4. Eventually drop old tables (risks, decisions, opportunities)
--
-- To migrate existing data, run the Python migration script:
--   python scripts/migrate_to_insights.py
