# Permission Indicators

This document captures all permission-related UI elements and access control indicators found in the components.

## Contract Privacy Settings

### Contract Form Privacy Section
Location: `/components/domain/contracts/ContractPrivacySection.tsx`

**Privacy Controls:**
- **Make this contract private** (Toggle)
  - Default: `true` (private by default)
  - When enabled: Shows user/role selectors
  - When disabled: Contract visible to all project members

**Access Control Lists:**
- **Allowed Users** (MultiSelect)
  - Only shown when contract is private
  - Specific users who can view/edit
  - Example options: "John Smith (Project Manager)", "Jane Doe (Superintendent)"

- **Allowed Roles** (MultiSelect)
  - Only shown when contract is private
  - Role-based access control
  - Options: Administrators, Project Managers, Superintendents, Accounting

**Granular Permissions:**
- **Allow subcontractors to view contract amount** (Checkbox)
  - Default: `false`
  - Controls financial visibility to external parties

- **Show in company directory** (Checkbox)
  - Default: `true`
  - Controls listing visibility

- **Allow change order creation** (Checkbox)
  - Default: `true`
  - Controls who can initiate changes

- **Require approval for all invoices** (Checkbox)
  - Default: `true`
  - Enforces approval workflow

## User Role Indicators

### Common Role Types Found
From user selection dropdowns:
- **Admin** - Full system access
- **Project Manager** - Project-level permissions
- **Superintendent** - Field operations access
- **Executive** - Read-only high-level access
- **Accountant** - Financial module access
- **Viewer** - Read-only access

### Role Display Patterns
- User listings show: "Name (Role)"
- Example: "Bob Johnson (Accountant)"
- Indicates permission level at a glance

## Page-Level Access Controls

### Protected Routes
Location: `/app/(procore)/protected/layout.tsx`

**Authentication Required:**
- All `/protected/*` routes require login
- Redirects to `/auth/login` if not authenticated
- Uses Supabase auth for session management

**Navigation Visibility:**
- Financial menu items only for appropriate roles
- Admin-only settings visible conditionally

## Module-Specific Permissions

### Financial Module Permissions

**Commitments Page Actions:**
- Create: Likely requires PM or Admin role
- Edit: Owner or Admin only
- Delete: Admin only (shown in red)
- View: Based on privacy settings

**Status-Based Permissions:**
- Draft: Full edit by owner
- Executed: Read-only except for admins
- Void: No edits allowed

### Project Permissions

**Project Access Levels:**
- Project Member: Basic access
- Project Admin: Full project control
- Company Admin: Cross-project access

## UI Permission Indicators

### Visual Cues
1. **Disabled/Hidden Elements:**
   - Buttons grayed out for insufficient permissions
   - Menu items hidden based on role
   - Form fields read-only for viewers

2. **Color Coding:**
   - Red actions (Delete) = Admin only
   - Orange badges = Pending approval
   - Green = Active/Approved

3. **Icons:**
   - Lock icon for private items
   - Eye icon for view permissions
   - Shield icon for admin features

## Permission Messages

### Common Permission Texts
- "Private - Only admins and users with explicit permissions can view"
- "Allow non-admins to view SOV" (Schedule of Values)
- "Require approval for all invoices"
- "(Admin only)" suffix on dangerous actions

## Bulk Permission Operations

### Implied Bulk Permissions
- Bulk delete: Admin only
- Bulk approve: Manager or higher
- Bulk export: Based on view permissions

## Permission Audit Trail

### Tracked Permission Events
- Access granted/revoked
- Role changes
- Private/public toggles
- Failed access attempts

## API Permission Enforcement

### Frontend Permission Checks
```typescript
// Example patterns found:
if (!user.isAdmin) {
  // Hide delete button
}

if (contract.private && !allowedUsers.includes(user.id)) {
  // Show access denied
}
```

### Expected Backend Checks
- Row Level Security (RLS) in Supabase
- API middleware for role validation
- Separate read/write permissions

## Permission Hierarchies

### Typical Hierarchy
1. **Company Admin** (highest)
   - All projects
   - All modules
   - User management

2. **Project Admin**
   - Specific project(s)
   - All modules within project
   - Project user management

3. **Module Admin** (e.g., Financial Admin)
   - Specific modules across projects
   - Module-specific settings

4. **Standard User**
   - Assigned permissions only
   - Limited to granted access

5. **External User** (Subcontractor)
   - Very limited access
   - Specific documents only
   - No financial visibility by default

## Default Permission Settings

### New Items Default Private
- Contracts: Private by default
- Financial data: Private by default
- Internal communications: Private

### New Items Default Public
- Project info: Public to team
- Schedule data: Public to team
- General documents: Public to team

## Permission Configuration Locations
- User level: Profile settings
- Project level: Project settings
- Company level: Admin panel
- Item level: Individual privacy toggles

## Mobile Permission Considerations
- Simplified permission UI on mobile
- Critical permissions still enforced
- Offline mode respects cached permissions