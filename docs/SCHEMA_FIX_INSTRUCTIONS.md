# Schema Fix Instructions

The database schema has mismatches between what the code expects and what's actually in the database. This needs to be fixed immediately.

## Quick Fix (Supabase Dashboard)

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/004_fix_schema_mismatches.sql`
4. Click "Run" to execute the migration

## Alternative Methods

### Method 1: Using Supabase CLI
```bash
chmod +x scripts/run-migrations.sh
./scripts/run-migrations.sh
```

### Method 2: Using Node.js Script
```bash
cd scripts
npm install @supabase/supabase-js dotenv
node apply-schema-fixes.js
```

### Method 3: Direct SQL Execution
If the above methods don't work, manually run the SQL from `supabase/migrations/004_fix_schema_mismatches.sql` in your Supabase SQL editor.

## What This Fixes

1. **Missing columns in projects table**:
   - `description` (already exists, but code expects it)
   - `job number` (new)
   - `address` (new)
   - `state` (new) 
   - `archived` (new)
   - `phase` (new)
   - `category` (new)
   - `team_members` (new)
   - `stakeholders` (new)
   - `keywords` (new)

2. **Missing subcontractors table** - Creates the table referenced by financial modules

3. **Data type mismatches** - Fixes project_id from BIGINT to UUID in financial tables

4. **Missing views** - Recreates all financial views with correct data types

## Verification

After running the migration, verify it worked:

1. Check the projects table has all new columns
2. Check financial tables can reference projects correctly
3. Test the application pages that were showing errors

## Environment Variables Required

Make sure you have these in your `.env` file:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` or `SUPABASE_SERVICE_ROLE_KEY`