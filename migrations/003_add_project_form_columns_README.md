# Migration: Add Project Form Columns

## Overview
This migration adds three columns to the `projects` table that are currently stored in the `summary_metadata` JSON field:
- `work_scope` - Type of construction work (e.g., Ground-Up Construction, Renovation)
- `project_sector` - Industry sector (e.g., Commercial, Healthcare)
- `delivery_method` - Project delivery method (e.g., Design-Build)

## Why This Change?
These fields are displayed on the project form and should be proper database columns for:
1. Better querying and filtering capabilities
2. Improved data integrity with constraints
3. Better performance with indexes
4. Cleaner API responses

## Migration Steps

### 1. Apply the Migration
```bash
# Using Supabase CLI
supabase db push

# Or apply directly
psql $DATABASE_URL < migrations/003_add_project_form_columns.sql
```

### 2. Update Database Types
After applying the migration, regenerate the TypeScript types:

```bash
cd frontend
npm run db:types
```

Or manually:
```bash
npx supabase gen types typescript --local > database.types.ts
```

### 3. Verify the Migration
The migration includes:
- New columns with proper constraints
- Data migration from `summary_metadata` JSON to new columns
- Indexes for query performance
- Column comments for documentation

### 4. Update Code
The project form code has already been updated to use these new columns directly instead of storing them in `summary_metadata`.

## Rollback
If needed, you can rollback this migration:

```sql
BEGIN;

-- Remove indexes
DROP INDEX IF EXISTS idx_projects_work_scope;
DROP INDEX IF EXISTS idx_projects_project_sector;
DROP INDEX IF EXISTS idx_projects_delivery_method;

-- Remove constraints
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_work_scope_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_sector_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_delivery_method_check;

-- Save data back to summary_metadata if needed
UPDATE projects
SET summary_metadata = 
  CASE 
    WHEN summary_metadata IS NULL THEN 
      jsonb_build_object(
        'work_scope', work_scope,
        'project_sector', project_sector,
        'delivery_method', delivery_method
      )
    ELSE 
      summary_metadata || 
      jsonb_build_object(
        'work_scope', work_scope,
        'project_sector', project_sector,
        'delivery_method', delivery_method
      )
  END
WHERE work_scope IS NOT NULL 
   OR project_sector IS NOT NULL 
   OR delivery_method IS NOT NULL;

-- Remove columns
ALTER TABLE projects DROP COLUMN IF EXISTS work_scope;
ALTER TABLE projects DROP COLUMN IF EXISTS project_sector;
ALTER TABLE projects DROP COLUMN IF EXISTS delivery_method;

COMMIT;
```

## Testing
After migration, test:
1. Create a new project with the form - values should save to new columns
2. Query projects by work_scope, project_sector, or delivery_method
3. Verify existing projects retained their data from summary_metadata
4. Check that constraints prevent invalid values