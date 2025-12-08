# Row Level Security (RLS) Model for Financial Modules

## Overview

This document describes the Row Level Security (RLS) implementation for the Procore Financial Modules, ensuring multi-tenant data isolation and role-based access control.

## Security Principles

1. **Default Deny**: All tables have RLS enabled, denying access by default
2. **Project-Based Access**: Most access is controlled at the project level
3. **Role-Based Permissions**: Fine-grained permissions based on user roles
4. **Company Isolation**: Users can only see data from their company and related entities
5. **Vendor Self-Service**: Vendors have limited access to their own data

## Access Model

### User Access Hierarchy

```
Company Level
  └── Project Level
      └── Module Level
          └── Action Level (view, create, edit, delete)
```

### Permission Types

1. **Company-Wide Access**: Users with this flag can access all projects in their company
2. **Project-Specific Access**: Users assigned to specific projects with defined roles
3. **Vendor Access**: External users can only see/edit their own contracts and invoices
4. **Public/Read-Only Access**: For reporting or auditing purposes

## Core Helper Functions

### `get_user_project_ids()`
Returns all project IDs the current user has access to based on:
- Direct project assignments
- Company-wide access privileges
- Active status

### `user_has_project_permission(project_id, permission)`
Checks if a user has a specific permission on a project:
- Looks up user's role on the project
- Checks role's permissions
- Returns boolean authorization result

## Module-Specific Policies

### Budget Module

**View Access**:
- Users must have `view_budgets` permission on the project
- Budget line items inherit access from parent budget

**Edit Access**:
- Users must have `manage_budgets` permission
- Changes are audited with user tracking

### Contracts Module

**Prime Contracts**:
- View: `view_contracts` permission required
- Edit: `manage_prime_contracts` permission required
- Only internal users can manage prime contracts

**Commitments (Subcontracts/POs)**:
- View: `view_commitments` permission OR vendor's own contracts
- Edit: `manage_commitments` permission
- Vendors can view but not edit their contracts

### Change Management

**Change Events**:
- View: `view_changes` permission
- Create: `create_changes` permission
- Edit: `manage_changes` OR creator can edit while status is 'open'

**Change Orders**:
- View: `view_changes` permission OR vendor's related contracts
- Edit: `manage_changes` permission only
- Approval workflow enforced through status transitions

### Billing & Invoicing

**Invoices**:
- View: `view_invoices` OR vendor's own invoices
- Create: `create_invoices` OR vendor for their contracts
- Edit: `manage_invoices` OR vendor can edit draft invoices
- Vendors can only transition from 'draft' to 'submitted'

**Billing Periods**:
- View: `view_invoices` permission
- Edit: `manage_billing_periods` permission
- Usually managed by project administrators

### Document Management

**Attachments**:
- View: Project access OR uploader is self
- Upload: Project access required
- Delete: Uploader OR `manage_documents` permission

## Permission Definitions

### Standard Permissions

| Permission | Description | Typical Roles |
|------------|-------------|---------------|
| `view_budgets` | View budget and forecasts | All project members |
| `manage_budgets` | Create/edit budgets | Project Manager, Admin |
| `view_contracts` | View prime contracts | PM, Accounting, Exec |
| `manage_prime_contracts` | Edit prime contracts | PM, Contracts Admin |
| `view_commitments` | View subcontracts/POs | PM, Super, Accounting |
| `manage_commitments` | Create/edit commitments | PM, Contracts Admin |
| `view_changes` | View change events/orders | All project members |
| `create_changes` | Create change events | PM, Super, PE |
| `manage_changes` | Approve/edit all changes | PM, Exec |
| `view_invoices` | View all invoices | Accounting, PM |
| `create_invoices` | Create owner invoices | Accounting |
| `manage_invoices` | Approve/pay invoices | Accounting, PM |
| `manage_billing_periods` | Configure billing cycles | Accounting Admin |
| `manage_documents` | Delete any documents | Admin |

### Role Templates

**Project Administrator**:
- All permissions on assigned projects
- Can manage team and permissions

**Project Manager**:
- All view permissions
- Manage budgets, contracts, changes
- Approve invoices

**Superintendent**:
- View all modules
- Create change events
- Limited contract management

**Accountant**:
- View all financial data
- Manage invoices and billing
- View-only for contracts

**Subcontractor/Vendor**:
- View own contracts
- Submit change order requests
- Create and submit invoices
- Upload documents

**Executive/Owner**:
- View all data
- Approve major changes
- View financial reports

## Implementation Checklist

### Required Tables (not in current schema)

```sql
-- Users extension
ALTER TABLE users ADD COLUMN company_id uuid REFERENCES companies(id);
ALTER TABLE users ADD COLUMN has_company_wide_access boolean DEFAULT false;

-- Project team members
CREATE TABLE project_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES project_roles(id),
  is_active boolean DEFAULT true,
  assigned_at timestamp with time zone DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE(project_id, user_id)
);

-- Project-specific roles
CREATE TABLE project_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, name)
);

-- Role permissions
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES project_roles(id) ON DELETE CASCADE,
  permission_name varchar(100) NOT NULL,
  is_granted boolean DEFAULT true,
  granted_at timestamp with time zone DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  UNIQUE(role_id, permission_name)
);
```

## Testing RLS Policies

### Test Cases

1. **Company Isolation Test**
   ```sql
   -- As user from Company A
   SET LOCAL "auth.uid" = 'user_a_id';
   SELECT * FROM projects; -- Should only see Company A projects
   ```

2. **Vendor Access Test**
   ```sql
   -- As vendor user
   SET LOCAL "auth.uid" = 'vendor_user_id';
   SELECT * FROM commitments; -- Should only see own contracts
   SELECT * FROM invoices; -- Should only see own invoices
   ```

3. **Permission Escalation Test**
   ```sql
   -- As user without budget permission
   SET LOCAL "auth.uid" = 'limited_user_id';
   SELECT * FROM budgets; -- Should return empty
   UPDATE budgets SET name = 'Hacked'; -- Should fail
   ```

4. **Cross-Project Access Test**
   ```sql
   -- As user on Project A only
   SET LOCAL "auth.uid" = 'project_a_user';
   SELECT * FROM change_orders WHERE project_id = 'project_b_id'; -- Should return empty
   ```

## Performance Considerations

1. **Indexes**: All RLS functions use indexed lookups
2. **Function Caching**: Security definer functions are cached per session
3. **Query Planning**: RLS policies are applied early in query planning
4. **Connection Pooling**: Each user gets consistent RLS context

## Monitoring and Auditing

### Audit Triggers
```sql
-- Add audit trigger to track permission checks
CREATE TABLE permission_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  project_id uuid,
  permission_checked varchar(100),
  was_granted boolean,
  checked_at timestamp with time zone DEFAULT now(),
  context jsonb
);
```

### Performance Monitoring
```sql
-- Monitor slow RLS queries
CREATE INDEX idx_rls_monitoring ON pg_stat_statements(query) 
WHERE query LIKE '%get_user_project_ids%';
```

## Troubleshooting

### Common Issues

1. **"Permission Denied" Errors**
   - Check user's project assignment
   - Verify role has required permission
   - Ensure user's company association

2. **Missing Data**
   - Verify RLS is not filtering valid data
   - Check project_users table for assignments
   - Test with SECURITY DEFINER functions

3. **Performance Issues**
   - Review execution plans with EXPLAIN
   - Check index usage on foreign keys
   - Consider materialized views for complex policies

### Debug Queries

```sql
-- Check user's permissions
SELECT * FROM user_has_project_permission('project_id', 'permission_name');

-- List user's accessible projects  
SELECT * FROM get_user_project_ids();

-- View user's roles
SELECT * FROM project_users WHERE user_id = auth.uid();
```

## Future Enhancements

1. **Time-based Access**: Temporary permissions for auditors
2. **Delegation**: Allow users to delegate specific permissions
3. **Field-level Security**: Hide sensitive fields like costs from certain roles
4. **IP Restrictions**: Additional security based on request origin
5. **Two-factor Requirements**: Require 2FA for sensitive operations