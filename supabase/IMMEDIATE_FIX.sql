-- IMMEDIATE FIX FOR PROJECTS TABLE
-- Run this NOW in Supabase SQL Editor to fix the immediate errors

-- Add missing columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "job number" VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS phase VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stakeholders JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Populate defaults for existing records
UPDATE projects 
SET 
    "job number" = COALESCE("job number", code),
    state = COALESCE(state, 'Unknown'),
    phase = COALESCE(phase, 'Unknown'),
    archived = COALESCE(archived, false),
    category = COALESCE(category, 'General')
WHERE "job number" IS NULL 
   OR state IS NULL 
   OR phase IS NULL 
   OR archived IS NULL 
   OR category IS NULL;