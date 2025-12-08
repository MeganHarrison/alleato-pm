# Supabase Migration Rollback Procedures

This document outlines procedures for safely rolling back database migrations in the Procore Financial Modules schema.

## Overview

The financial module migrations (002-008) build upon each other with dependencies. Rollback must be performed in reverse order to maintain referential integrity.

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Database admin access
- Backup of current database state
- Understanding of migration dependencies

## Migration Dependencies

```
001_initial_setup.sql (base tables: projects, companies, users)
  └── 002_financial_enums.sql (enum types)
      └── 003_financial_core_tables.sql (cost codes, attachments)
          └── 004_financial_budgets.sql (budgets, budget_line_items)
              └── 005_financial_contracts.sql (prime_contracts, commitments)
                  └── 006_financial_changes.sql (change_events, change_orders)
                      └── 007_financial_billing.sql (invoices, billing_periods)
                          └── 008_financial_views.sql (views only - no tables)
```

## Rollback Order

Always rollback in reverse numerical order to avoid foreign key constraint violations:

1. 008_financial_views.sql
2. 007_financial_billing.sql
3. 006_financial_changes.sql
4. 005_financial_contracts.sql
5. 004_financial_budgets.sql
6. 003_financial_core_tables.sql
7. 002_financial_enums.sql

## Rollback Scripts

### 008_financial_views.sql Rollback

```sql
-- Drop all views (no data loss - views are computed)
DROP VIEW IF EXISTS budget_summary_view CASCADE;
DROP VIEW IF EXISTS contract_summary_view CASCADE;
DROP VIEW IF EXISTS project_financial_summary CASCADE;
DROP VIEW IF EXISTS cost_code_summary CASCADE;
DROP FUNCTION IF EXISTS get_project_financial_snapshot CASCADE;
```

### 007_financial_billing.sql Rollback

```sql
-- Save critical data before dropping tables
CREATE TABLE backup_invoices AS SELECT * FROM invoices;
CREATE TABLE backup_billing_periods AS SELECT * FROM billing_periods;

-- Drop dependent objects first
DROP TRIGGER IF EXISTS update_invoice_totals_on_line_change ON invoice_line_items;
DROP FUNCTION IF EXISTS update_invoice_totals CASCADE;
DROP FUNCTION IF EXISTS copy_previous_invoice_values CASCADE;

-- Drop tables in dependency order
DROP TABLE IF EXISTS lien_waivers CASCADE;
DROP TABLE IF EXISTS invoice_line_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS billing_periods CASCADE;
```

### 006_financial_changes.sql Rollback

```sql
-- Save data
CREATE TABLE backup_change_orders AS SELECT * FROM change_orders;
CREATE TABLE backup_change_events AS SELECT * FROM change_events;

-- Drop functions and triggers
DROP TRIGGER IF EXISTS update_co_total_on_line_change ON change_order_line_items;
DROP FUNCTION IF EXISTS update_change_order_total CASCADE;
DROP FUNCTION IF EXISTS get_next_change_event_number CASCADE;

-- Drop tables
DROP TABLE IF EXISTS change_event_rfis CASCADE;
DROP TABLE IF EXISTS change_order_line_items CASCADE;
DROP TABLE IF EXISTS change_orders CASCADE;
DROP TABLE IF EXISTS change_events CASCADE;
```

### 005_financial_contracts.sql Rollback

```sql
-- Save contract data
CREATE TABLE backup_commitments AS SELECT * FROM commitments;
CREATE TABLE backup_prime_contracts AS SELECT * FROM prime_contracts;
CREATE TABLE backup_contract_line_items AS SELECT * FROM contract_line_items;

-- Drop views first
DROP VIEW IF EXISTS all_contracts CASCADE;

-- Drop tables
DROP TABLE IF EXISTS contract_documents CASCADE;
DROP TABLE IF EXISTS contract_line_items CASCADE;
DROP TABLE IF EXISTS commitments CASCADE;
DROP TABLE IF EXISTS prime_contracts CASCADE;
```

### 004_financial_budgets.sql Rollback

```sql
-- Save budget data
CREATE TABLE backup_budgets AS SELECT * FROM budgets;
CREATE TABLE backup_budget_line_items AS SELECT * FROM budget_line_items;

-- Drop functions
DROP FUNCTION IF EXISTS recalculate_budget_modification_totals CASCADE;

-- Drop tables
DROP TABLE IF EXISTS budget_modifications CASCADE;
DROP TABLE IF EXISTS budget_line_items CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
```

### 003_financial_core_tables.sql Rollback

```sql
-- Save core data
CREATE TABLE backup_cost_codes AS SELECT * FROM cost_codes;
CREATE TABLE backup_attachments AS SELECT * FROM attachments;

-- Drop the ltree extension usage first
DROP INDEX IF EXISTS idx_cost_codes_parent_path;

-- Drop tables
DROP TABLE IF EXISTS cost_codes CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;

-- Note: Do NOT drop companies table as it's part of 001_initial_setup
```

### 002_financial_enums.sql Rollback

```sql
-- Drop all enum types
-- Note: This will fail if any columns still use these types
DROP TYPE IF EXISTS contract_status CASCADE;
DROP TYPE IF EXISTS contract_type CASCADE;
DROP TYPE IF EXISTS commitment_type CASCADE;
DROP TYPE IF EXISTS budget_status CASCADE;
DROP TYPE IF EXISTS budget_modification_type CASCADE;
DROP TYPE IF EXISTS change_event_status CASCADE;
DROP TYPE IF EXISTS change_order_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS billing_period_status CASCADE;
DROP TYPE IF EXISTS approval_status CASCADE;
DROP TYPE IF EXISTS erp_sync_status CASCADE;
```

## Emergency Full Rollback Script

Save this as `emergency_rollback.sql`:

```sql
-- Emergency rollback - use with extreme caution
-- This will drop all financial module tables and enums

BEGIN;

-- Drop views
DROP VIEW IF EXISTS budget_summary_view CASCADE;
DROP VIEW IF EXISTS contract_summary_view CASCADE;
DROP VIEW IF EXISTS project_financial_summary CASCADE;
DROP VIEW IF EXISTS cost_code_summary CASCADE;
DROP VIEW IF EXISTS all_contracts CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_project_financial_snapshot CASCADE;
DROP FUNCTION IF EXISTS update_invoice_totals CASCADE;
DROP FUNCTION IF EXISTS copy_previous_invoice_values CASCADE;
DROP FUNCTION IF EXISTS update_change_order_total CASCADE;
DROP FUNCTION IF EXISTS get_next_change_event_number CASCADE;
DROP FUNCTION IF EXISTS recalculate_budget_modification_totals CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS lien_waivers CASCADE;
DROP TABLE IF EXISTS invoice_line_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS billing_periods CASCADE;
DROP TABLE IF EXISTS change_event_rfis CASCADE;
DROP TABLE IF EXISTS change_order_line_items CASCADE;
DROP TABLE IF EXISTS change_orders CASCADE;
DROP TABLE IF EXISTS change_events CASCADE;
DROP TABLE IF EXISTS contract_documents CASCADE;
DROP TABLE IF EXISTS contract_line_items CASCADE;
DROP TABLE IF EXISTS commitments CASCADE;
DROP TABLE IF EXISTS prime_contracts CASCADE;
DROP TABLE IF EXISTS budget_modifications CASCADE;
DROP TABLE IF EXISTS budget_line_items CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS cost_codes CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;

-- Drop enum types
DROP TYPE IF EXISTS contract_status CASCADE;
DROP TYPE IF EXISTS contract_type CASCADE;
DROP TYPE IF EXISTS commitment_type CASCADE;
DROP TYPE IF EXISTS budget_status CASCADE;
DROP TYPE IF EXISTS budget_modification_type CASCADE;
DROP TYPE IF EXISTS change_event_status CASCADE;
DROP TYPE IF EXISTS change_order_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS billing_period_status CASCADE;
DROP TYPE IF EXISTS approval_status CASCADE;
DROP TYPE IF EXISTS erp_sync_status CASCADE;

COMMIT;
```

## Using Supabase CLI for Rollback

### Check current migration status
```bash
supabase db status
```

### Reset to a specific migration
```bash
# Reset to state after 001_initial_setup.sql
supabase migration down --to 001_initial_setup
```

### Reset entire database (nuclear option)
```bash
supabase db reset
```

## Best Practices

1. **Always backup before rollback**
   ```bash
   pg_dump -h localhost -U postgres -d postgres > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test rollback in development first**
   ```bash
   # In development environment
   supabase db reset
   supabase migration up --to 006  # Apply up to migration 006
   supabase migration down --to 003  # Rollback to migration 003
   ```

3. **Verify data integrity after rollback**
   ```sql
   -- Check for orphaned records
   SELECT table_name, pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY pg_total_relation_size(table_name::regclass) DESC;
   ```

4. **Document the reason for rollback**
   - Create an incident report
   - Note which migration caused issues
   - Document any data loss or corruption

## Recovery Procedures

If rollback fails:

1. **Restore from backup**
   ```bash
   psql -h localhost -U postgres -d postgres < backup_file.sql
   ```

2. **Manual cleanup**
   - Drop objects individually
   - Fix constraint violations
   - Recreate missing dependencies

3. **Contact support**
   - Supabase support for hosted instances
   - Database administrator for self-hosted

## Monitoring After Rollback

1. Check application logs for errors
2. Monitor database performance
3. Verify all dependent services are functioning
4. Test critical user workflows

## Prevention

To minimize the need for rollbacks:

1. Test migrations thoroughly in development
2. Use database transactions in migrations
3. Include IF EXISTS/IF NOT EXISTS clauses
4. Version control all migration files
5. Maintain comprehensive migration tests