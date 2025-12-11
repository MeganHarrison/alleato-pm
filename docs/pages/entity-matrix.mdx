# Entity Matrix

This document maps UI elements to database entities, establishing the foundation for schema design based on captured UI evidence.

## Core Entities

### 1. Projects
**Source UI Pages:**
- Portfolio page (`/app/page.tsx`)
- Project selector in AppHeader (`/components/layout/AppHeader.tsx`)

**Fields Observed:**
- name (required, text)
- projectNumber (required, unique identifier)
- address (text)
- city (text)
- state (text, 2-letter)
- status (enum: Active, Inactive)
- stage (enum: Current, Planning, Construction, Closeout, Warranty)
- type (text: General, Commercial, etc.)

**Relationships:**
- Has many contracts
- Has many commitments
- Has many users (through project_users)
- Has many budget_items
- Has many change_events
- Has many invoices
- Has many daily_logs

**Required Fields:** name, projectNumber, status
**Optional Fields:** address, city, state, stage, type
**Status Fields:** status (Active/Inactive), stage
**Attachment Fields:** None observed in current UI

### 2. Companies
**Source UI Pages:**
- Contract forms (as Contract Company dropdown)
- Commitments table (as Company column)
- User profiles (company association)

**Fields Observed:**
- name (required, text)
- type (enum: general_contractor, subcontractor, vendor, owner, architect, engineer)
- address (text)
- city (text)
- state (text)
- phone (text)
- email (text)
- status (enum: active, inactive)

**Relationships:**
- Has many contracts (as contract_company)
- Has many commitments (as vendor/subcontractor)
- Has many users
- Has many projects (through project_companies)

**Required Fields:** name, type
**Optional Fields:** address, city, state, phone, email
**Status Fields:** status
**Attachment Fields:** None observed

### 3. Users
**Source UI Pages:**
- User dropdown in AppHeader
- Contract Privacy Section (allowed users)
- Form approval workflows

**Fields Observed:**
- name (required, text)
- email (required, unique)
- role (enum: admin, project_manager, superintendent, executive, accountant, viewer)
- company_id (foreign key)
- avatar_url (text)
- status (enum: active, inactive)

**Relationships:**
- Belongs to company
- Has many project_users
- Has many contract_permissions
- Created many records (audit trail)

**Required Fields:** name, email, role
**Optional Fields:** avatar_url
**Status Fields:** status
**Attachment Fields:** avatar_url

### 4. Contracts (Prime Contracts)
**Source UI Pages:**
- Contract Form (`/components/domain/contracts/ContractForm.tsx`)
- Contract list views

**Fields Observed:**
- contract_number (required, unique)
- title (required, text)
- contract_company_id (required, foreign key)
- project_id (required, foreign key)
- status (enum: draft, out_for_signature, executed, closed, void)
- original_amount (required, decimal)
- revised_amount (decimal)
- retention_percentage (decimal 0-100)
- execution_date (date)
- start_date (required, date)
- substantial_completion_date (required, date)
- final_completion_date (date)
- liquidated_damages (decimal)
- is_private (boolean, default true)
- include_weather_days (boolean)
- include_holidays (boolean)

**Relationships:**
- Belongs to project
- Belongs to company (contract_company)
- Has many schedule_of_values_items
- Has many change_orders
- Has many invoices
- Has many allowed_users (through contract_permissions)
- Has many allowed_roles (through contract_role_permissions)

**Required Fields:** contract_number, title, contract_company_id, project_id, status, original_amount, start_date, substantial_completion_date
**Optional Fields:** All others
**Status Fields:** status
**Attachment Fields:** Through separate attachments table

### 5. Contract Billing Configuration
**Source UI Pages:**
- Contract Form Billing Section

**Fields Observed:**
- contract_id (required, foreign key)
- billing_method (enum: progress, unit_price, time_materials, lump_sum)
- payment_terms (enum: net_30, net_45, net_60, due_on_receipt)
- billing_day_of_month (integer 1-31)
- allow_billing_over_contract (boolean)
- apply_retention (boolean)
- labor_retention_percentage (decimal 0-100)
- materials_retention_percentage (decimal 0-100)
- release_retention_with_final (boolean)

**Relationships:**
- Belongs to contract (1:1)

**Required Fields:** contract_id, billing_method, payment_terms
**Optional Fields:** All others
**Status Fields:** None
**Attachment Fields:** None

### 6. Contract Privacy Settings
**Source UI Pages:**
- Contract Form Privacy Section

**Fields Observed:**
- contract_id (required, foreign key)
- is_private (boolean, default true)
- allow_subcontractors_view_amount (boolean)
- show_in_directory (boolean)
- allow_change_order_creation (boolean)
- require_invoice_approval (boolean)

**Relationships:**
- Belongs to contract (1:1)
- References contract_permissions for allowed users/roles

**Required Fields:** contract_id, is_private
**Optional Fields:** All others
**Status Fields:** None
**Attachment Fields:** None

### 7. Commitments (Subcontracts & Purchase Orders)
**Source UI Pages:**
- Commitments page (`/app/(procore)/(financial)/commitments/page.tsx`)
- Purchase Order form

**Fields Observed:**
- number (required, unique)
- title (required, text)
- contract_company_id (required, foreign key)
- project_id (required, foreign key)
- type (enum: subcontract, purchase_order)
- status (enum: draft, sent, pending, approved, executed, closed, void)
- original_amount (required, decimal)
- revised_amount (decimal)
- retention_percentage (decimal 0-100)
- executed (boolean)
- issue_date (date)
- due_date (date)
- description (text)

**Relationships:**
- Belongs to project
- Belongs to company (vendor/subcontractor)
- Has many commitment_line_items
- Has many change_orders
- Has many invoices
- Has many attachments

**Required Fields:** number, title, contract_company_id, project_id, type, status, original_amount
**Optional Fields:** All others
**Status Fields:** status, executed
**Attachment Fields:** Through attachments table

### 8. Schedule of Values
**Source UI Pages:**
- Contract Form SOV Grid (`/components/domain/contracts/ScheduleOfValuesGrid.tsx`)

**Fields Observed:**
- contract_id (required, foreign key)
- line_number (required, integer)
- description (required, text)
- cost_code_id (foreign key)
- scheduled_value (required, decimal)
- work_completed (decimal, default 0)
- materials_stored (decimal, default 0)
- percent_complete (calculated: (work_completed + materials_stored) / scheduled_value * 100)

**Relationships:**
- Belongs to contract
- References cost_code

**Required Fields:** contract_id, line_number, description, scheduled_value
**Optional Fields:** cost_code_id, work_completed, materials_stored
**Status Fields:** None (percent_complete is calculated)
**Attachment Fields:** None

### 9. Cost Codes
**Source UI Pages:**
- SOV Grid (cost code dropdown)
- Budget views (implied)

**Fields Observed:**
- code (required, unique)
- description (required, text)
- parent_code_id (foreign key, self-referential)
- type (enum: labor, material, equipment, subcontract, other)
- status (enum: active, inactive)

**Relationships:**
- Has many schedule_of_values_items
- Has many budget_items
- Has many invoice_line_items
- Self-referential for hierarchy

**Required Fields:** code, description
**Optional Fields:** parent_code_id, type
**Status Fields:** status
**Attachment Fields:** None

### 10. Change Events
**Source UI Pages:**
- Change management workflows (inferred from status map)

**Fields Observed:**
- project_id (required, foreign key)
- event_number (required, unique per project)
- title (required, text)
- description (text)
- status (enum: open, in_review, approved, rejected, closed)
- created_date (date)
- due_date (date)
- estimated_impact (decimal)

**Relationships:**
- Belongs to project
- Has many change_event_items
- Has many change_orders (when approved)
- Has many attachments

**Required Fields:** project_id, event_number, title, status
**Optional Fields:** description, due_date, estimated_impact
**Status Fields:** status
**Attachment Fields:** Through attachments table

### 11. Change Orders
**Source UI Pages:**
- Change order workflows (inferred from commitments)

**Fields Observed:**
- commitment_id (foreign key) or contract_id (foreign key)
- change_order_number (required, unique per commitment/contract)
- title (required, text)
- description (text)
- status (enum: draft, pending_approval, approved, sent, executed, void)
- amount (required, decimal)
- created_date (date)
- approval_date (date)
- execution_date (date)

**Relationships:**
- Belongs to either commitment or contract
- Originated from change_event (optional)
- Has many change_order_items
- Updates revised amounts on parent

**Required Fields:** change_order_number, title, status, amount
**Optional Fields:** All others
**Status Fields:** status
**Attachment Fields:** Through attachments table

### 12. Invoices
**Source UI Pages:**
- Invoice workflows (inferred from billing configuration)

**Fields Observed:**
- commitment_id (foreign key) or contract_id (foreign key)
- invoice_number (required, unique)
- billing_period_id (foreign key)
- status (enum: draft, submitted, under_review, approved, rejected, paid)
- invoice_date (required, date)
- due_date (date)
- amount (required, decimal)
- retention_held (decimal)
- previously_invoiced (decimal)
- current_payment_due (decimal)

**Relationships:**
- Belongs to either commitment or contract
- Belongs to billing_period
- Has many invoice_line_items
- Has many payments

**Required Fields:** invoice_number, status, invoice_date, amount
**Optional Fields:** All others
**Status Fields:** status
**Attachment Fields:** Through attachments table

### 13. Invoice Line Items
**Source UI Pages:**
- Invoice detail views (inferred)

**Fields Observed:**
- invoice_id (required, foreign key)
- line_number (required, integer)
- description (required, text)
- cost_code_id (foreign key)
- scheduled_value (decimal)
- previous_amount (decimal)
- current_amount (decimal)
- percent_complete (decimal 0-100)

**Relationships:**
- Belongs to invoice
- References cost_code
- May reference SOV item

**Required Fields:** invoice_id, line_number, description
**Optional Fields:** All others
**Status Fields:** None
**Attachment Fields:** None

### 14. Billing Periods
**Source UI Pages:**
- Billing workflow references

**Fields Observed:**
- project_id (required, foreign key)
- period_number (required, integer)
- start_date (required, date)
- end_date (required, date)
- status (enum: open, closed, locked)
- cutoff_date (date)

**Relationships:**
- Belongs to project
- Has many invoices

**Required Fields:** project_id, period_number, start_date, end_date, status
**Optional Fields:** cutoff_date
**Status Fields:** status
**Attachment Fields:** None

### 15. Budget Items
**Source UI Pages:**
- Budget views (referenced but not fully shown)

**Fields Observed:**
- project_id (required, foreign key)
- cost_code_id (required, foreign key)
- original_budget (required, decimal)
- revised_budget (decimal)
- committed_amount (decimal, calculated from commitments)
- actual_cost (decimal, calculated from invoices)
- forecast_to_complete (decimal)

**Relationships:**
- Belongs to project
- References cost_code
- Calculated from commitments and invoices

**Required Fields:** project_id, cost_code_id, original_budget
**Optional Fields:** All others
**Status Fields:** None
**Attachment Fields:** None

### 16. Daily Logs
**Source UI Pages:**
- Daily log references in permission indicators

**Fields Observed:**
- project_id (required, foreign key)
- log_date (required, date)
- weather_conditions (text)
- temperature_high (integer)
- temperature_low (integer)
- manpower_count (integer)
- status (enum: draft, submitted, approved, archived)
- notes (text)

**Relationships:**
- Belongs to project
- Has many daily_log_entries
- Has many attachments (photos)

**Required Fields:** project_id, log_date, status
**Optional Fields:** All others
**Status Fields:** status
**Attachment Fields:** Through attachments table

### 17. Permissions (Various Types)
**Source UI Pages:**
- Contract Privacy Section
- User role indicators

**Contract Permissions:**
- contract_id (foreign key)
- user_id (foreign key)
- permission_type (enum: view, edit, delete)

**Contract Role Permissions:**
- contract_id (foreign key)
- role (enum: admin, project_manager, etc.)
- permission_type (enum: view, edit, delete)

**Project Users:**
- project_id (foreign key)
- user_id (foreign key)
- role (enum: member, admin)
- permissions (jsonb or separate table)

**Relationships:**
- Links users/roles to resources
- Enables row-level security

**Required Fields:** All foreign keys and permission types
**Optional Fields:** None
**Status Fields:** None
**Attachment Fields:** None

### 18. Attachments
**Source UI Pages:**
- Purchase Order form
- Various forms with file upload capability

**Fields Observed:**
- resource_type (enum: contract, commitment, invoice, etc.)
- resource_id (uuid)
- filename (required, text)
- file_size (integer, bytes)
- file_type (text, MIME type)
- storage_path (text)
- uploaded_by (foreign key to users)
- uploaded_at (timestamp)

**Relationships:**
- Polymorphic association to various entities
- Belongs to user (uploader)

**Required Fields:** resource_type, resource_id, filename, storage_path, uploaded_by
**Optional Fields:** file_size, file_type
**Status Fields:** None
**Attachment Fields:** This IS the attachment entity

## Audit Trail Pattern
All major entities should include:
- created_at (timestamp)
- updated_at (timestamp)  
- created_by (foreign key to users)
- updated_by (foreign key to users)

## Soft Delete Pattern
For entities that shouldn't be hard deleted:
- deleted_at (timestamp)
- deleted_by (foreign key to users)

## Summary Statistics

### Total Entities Identified: 18
1. Core Business Entities: 12
2. Configuration/Settings Entities: 2
3. Permission Entities: 3
4. Utility Entity: 1 (Attachments)

### Common Patterns:
- All entities scoped by project_id (except global entities like companies, users)
- Status enums for workflow management
- Decimal types for all monetary values
- Audit fields for compliance
- Polymorphic attachments system
- Row-level security through permissions tables