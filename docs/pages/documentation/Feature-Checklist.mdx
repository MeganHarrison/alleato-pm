# Alleato-Procore Feature Completion Checklist

## Overview

This document provides a comprehensive checklist of all pages and forms that need to be created or completed, with exact pass/fail criteria for each feature.

**Last Updated**: 2025-12-15

---

## Pass/Fail Criteria (Universal)

Every form/page MUST meet ALL of the following criteria to pass:

### Form Requirements
- [ ] **Project Association**: Form is properly associated with a project (via `project_id`)
- [ ] **User Authentication**: User must be authenticated to access/submit
- [ ] **Form Validation**: All required fields validated with Zod schemas
- [ ] **Submit Functionality**: Form can be successfully submitted
- [ ] **Database Save**: Data is saved to Supabase in the correct table with correct columns
- [ ] **Error Handling**: Errors are caught and displayed to user
- [ ] **Success Feedback**: User receives confirmation on successful submission
- [ ] **Loading States**: Loading indicators shown during async operations

### Display Requirements
- [ ] **Data Fetching**: Content correctly fetches from Supabase
- [ ] **List View**: Items display in a list/table format
- [ ] **Detail View**: Individual item details can be viewed
- [ ] **Empty State**: Appropriate message when no data exists
- [ ] **Pagination/Infinite Scroll**: Large datasets are paginated

### Navigation Requirements
- [ ] **Route Works**: Page is accessible via URL
- [ ] **Breadcrumbs**: Navigation context is clear
- [ ] **Back Navigation**: User can navigate back appropriately

---

## Priority 1: Core Financial Module

### 1.1 Prime Contracts (Owner Contracts)

**Route**: `/(project-mgmt)/[projectId]/contracts`
**Database Table**: `contracts`
**Form Component**: `ContractForm.tsx`

#### Create Contract Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Form renders with all fields | ⬜ | number, title, owner_id, status, amount, retention_percentage, dates |
| Project ID automatically set from route | ⬜ | |
| Owner dropdown populated from `clients` table | ⬜ | |
| Status dropdown with: draft, sent, pending, approved, executed, closed, void | ⬜ | |
| Amount field accepts currency format | ⬜ | |
| Retention percentage field (0-100) | ⬜ | |
| Date pickers for executed_date, start_date, completion_date | ⬜ | |
| Form validates with Zod schema | ⬜ | |
| Submit creates record in `contracts` table | ⬜ | |
| Success toast notification | ⬜ | |
| Redirects to contracts list after save | ⬜ | |

#### Contracts List Page
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches contracts for current project | ⬜ | |
| Displays contract number, title, owner, status, amount | ⬜ | |
| Status badges with color coding | ⬜ | |
| Click row opens contract detail/edit | ⬜ | |
| "New Contract" button navigates to create form | ⬜ | |
| Filter by status | ⬜ | |
| Sort by columns | ⬜ | |
| Shows related change orders count | ⬜ | |

#### Edit Contract
| Criteria | Status | Notes |
|----------|--------|-------|
| Loads existing contract data | ⬜ | |
| All fields editable | ⬜ | |
| Save updates record in database | ⬜ | |
| Cancel discards changes | ⬜ | |

---

### 1.2 Commitments (Subcontracts & Purchase Orders)

**Route**: `/(project-mgmt)/[projectId]/commitments`
**Database Table**: `commitments`
**Form Component**: `commitment-form.tsx`

#### Create Commitment Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Form renders with all fields | ⬜ | number, title, company_id, status, contract_amount, accounting_method, retention_percentage |
| Project ID automatically set from route | ⬜ | |
| Vendor/Company dropdown populated from `companies` table | ⬜ | |
| Commitment type selector (subcontract/purchase_order) | ⬜ | |
| Status dropdown: draft, sent, pending, approved, executed, closed, void | ⬜ | |
| Amount field with currency format | ⬜ | |
| Accounting method: amount, unit_price, percent_complete | ⬜ | |
| Retention percentage (0-100) | ⬜ | |
| Date fields: executed_date, start_date, substantial_completion_date | ⬜ | |
| Budget item association (links to `budget_items`) | ⬜ | |
| Form validates with Zod schema | ⬜ | |
| Submit creates record in `commitments` table | ⬜ | |
| Success notification | ⬜ | |
| Redirects after save | ⬜ | |

#### Commitments List Page
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches commitments for current project | ⬜ | |
| Displays: number, title, vendor, status, amount | ⬜ | |
| Status badges with color coding | ⬜ | |
| Type indicator (subcontract vs PO) | ⬜ | |
| Click row opens detail/edit | ⬜ | |
| "New Commitment" button | ⬜ | |
| Filter by type and status | ⬜ | |
| Shows sum totals | ⬜ | |

#### Edit Commitment
| Criteria | Status | Notes |
|----------|--------|-------|
| Loads existing commitment data | ⬜ | |
| All fields editable | ⬜ | |
| Save updates database | ⬜ | |
| Status change workflow | ⬜ | |

---

### 1.3 Change Orders (to Commitments)

**Route**: `/(project-mgmt)/[projectId]/change-orders`
**Database Table**: `change_orders`

#### Create Change Order Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Form renders with all fields | ⬜ | co_number, title, description, status |
| Project ID automatically set | ⬜ | |
| Parent commitment selector (if applicable) | ⬜ | |
| Status: draft, pending, approved, executed, void | ⬜ | |
| Line items support (via `change_order_lines`) | ⬜ | |
| Total calculated from line items | ⬜ | |
| Submit saves to `change_orders` table | ⬜ | |
| Line items saved to `change_order_lines` | ⬜ | |

#### Change Order List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches change orders for project | ⬜ | |
| Displays: number, title, commitment, status, amount | ⬜ | |
| Grouped by parent commitment (optional) | ⬜ | |
| Filter by status | ⬜ | |
| Shows impact on budget | ⬜ | |

---

### 1.4 Invoices (Subcontractor Invoices)

**Route**: `/(project-mgmt)/[projectId]/invoices`
**Database Table**: `invoices` or `owner_invoices`

#### Create Invoice Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Form renders with fields | ⬜ | invoice_number, commitment_id, billing_period, amounts |
| Project ID automatically set | ⬜ | |
| Commitment selector (which PO/subcontract is this for) | ⬜ | |
| Billing period selector | ⬜ | |
| Invoice date picker | ⬜ | |
| Due date picker | ⬜ | |
| Line items matching commitment SOV | ⬜ | |
| Current period amount entry | ⬜ | |
| Retention calculated automatically | ⬜ | |
| Total with retention displayed | ⬜ | |
| Status: draft, submitted, approved, paid, void | ⬜ | |
| Submit saves to database | ⬜ | API currently marked TODO |
| Success notification | ⬜ | |

#### Invoice List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches invoices for project | ⬜ | |
| Displays: number, vendor, period, amount, status | ⬜ | |
| Filter by status | ⬜ | |
| Filter by commitment | ⬜ | |
| Shows paid vs outstanding totals | ⬜ | |

---

### 1.5 Change Events

**Route**: `/(project-mgmt)/[projectId]/change-events`
**Database Table**: `change_events`

#### Create Change Event Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Form renders with fields | ⬜ | event_number, title, scope, reason, notes, status |
| Project ID automatically set | ⬜ | |
| ROM (Rough Order of Magnitude) cost impact | ⬜ | |
| ROM schedule impact (days) | ⬜ | |
| Status: draft, pending, approved, closed | ⬜ | |
| Line items via `change_event_line_items` | ⬜ | |
| Submit saves to database | ⬜ | |

#### Change Event List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches change events for project | ⬜ | |
| Displays: number, title, status, ROM cost, ROM schedule | ⬜ | |
| Filter by status | ⬜ | |
| Shows which ones converted to change orders | ⬜ | |

---

### 1.6 Budget

**Route**: `/(project-mgmt)/[projectId]/budget`
**Database Table**: `budget_items`, `cost_codes`

#### Budget View
| Criteria | Status | Notes |
|----------|--------|-------|
| Displays all budget line items for project | ⬜ | |
| Columns: Cost Code, Description, Original Budget, Modifications, Revised Budget, Committed, Direct Costs, Forecast | ⬜ | |
| Hierarchical display by cost code | ⬜ | |
| Subtotals by division | ⬜ | |
| Grand totals row | ⬜ | |
| Fullscreen mode toggle | ✅ | Already implemented |
| Filter by cost type | ⬜ | |
| Export functionality | ⬜ | |

#### Add Budget Line Item
| Criteria | Status | Notes |
|----------|--------|-------|
| Form for new budget item | ⬜ | |
| Cost code selector | ⬜ | |
| Original budget amount | ⬜ | |
| Unit quantities (if unit-based) | ⬜ | |
| Submit saves to `budget_items` | ⬜ | |

#### Budget Modifications
| Criteria | Status | Notes |
|----------|--------|-------|
| Add modification to budget item | ⬜ | |
| Modification amount (+ or -) | ⬜ | |
| Description/reason | ⬜ | |
| Saves to `budget_modifications` table | ⬜ | |

---

### 1.7 Direct Costs

**Route**: `/(project-mgmt)/[projectId]/direct-costs`
**Database Table**: `direct_costs`

#### Create Direct Cost Entry
| Criteria | Status | Notes |
|----------|--------|-------|
| Form renders with fields | ⬜ | cost_code, description, amount, date, vendor |
| Project ID automatically set | ⬜ | |
| Cost code dropdown | ⬜ | |
| Vendor/payee field | ⬜ | |
| Invoice/reference number | ⬜ | |
| Amount | ⬜ | |
| Date | ⬜ | |
| Category (labor, materials, equipment, other) | ⬜ | |
| Submit saves to database | ⬜ | |

#### Direct Costs List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches direct costs for project | ⬜ | |
| Displays: date, vendor, description, cost code, amount | ⬜ | |
| Filter by cost code | ⬜ | |
| Filter by date range | ⬜ | |
| Sum totals | ⬜ | |

---

### 1.8 Billing Periods

**Route**: `/billing-periods` or `/(project-mgmt)/[projectId]/billing-periods`
**Database Table**: `billing_periods`

#### Manage Billing Periods
| Criteria | Status | Notes |
|----------|--------|-------|
| Create new billing period | ⬜ | period_number, start_date, end_date |
| Close billing period | ⬜ | Sets is_closed, closed_by, closed_date |
| List all billing periods | ⬜ | |
| Show period status (open/closed) | ⬜ | |
| Associated with project | ⬜ | |

---

## Priority 2: Project Management Module

### 2.1 RFIs (Request for Information)

**Route**: `/(project-mgmt)/[projectId]/rfis`
**Database Table**: `rfis`, `rfi_assignees`

#### Create RFI Form
| Criteria | Status | Notes |
|----------|--------|-------|
| RFI number (auto-generated or manual) | ⬜ | |
| Subject/title | ⬜ | |
| Question/description (rich text) | ⬜ | |
| Project ID automatically set | ⬜ | |
| Sent to (assignee from project directory) | ⬜ | |
| Due date | ⬜ | |
| Priority: low, medium, high, critical | ⬜ | |
| Status: draft, open, answered, closed | ⬜ | |
| Attachments support | ⬜ | |
| Submit saves to `rfis` table | ⬜ | |
| Assignees saved to `rfi_assignees` | ⬜ | |

#### RFI List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches RFIs for project | ⬜ | |
| Displays: number, subject, status, assignee, due date | ⬜ | |
| Overdue indicator | ⬜ | |
| Filter by status | ⬜ | |
| Search by subject | ⬜ | |

#### RFI Response/Answer
| Criteria | Status | Notes |
|----------|--------|-------|
| Add answer to RFI | ⬜ | |
| Answer from assignee | ⬜ | |
| Official response field | ⬜ | |
| Mark as answered/closed | ⬜ | |

---

### 2.2 Submittals

**Route**: `/(project-mgmt)/[projectId]/submittals`
**Database Table**: `submittals`

#### Create Submittal Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Submittal number | ⬜ | |
| Title/description | ⬜ | |
| Project ID automatically set | ⬜ | |
| Specification section | ⬜ | |
| Submitted by (company) | ⬜ | |
| Submitted date | ⬜ | |
| Required date | ⬜ | |
| Status: pending, under_review, approved, approved_as_noted, rejected, resubmit | ⬜ | |
| Attachments (drawings, specs, samples) | ⬜ | |
| Submit saves to database | ⬜ | |

#### Submittals List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches submittals for project | ⬜ | |
| Displays: number, title, spec section, status, dates | ⬜ | |
| Status badges | ⬜ | |
| Filter by status | ⬜ | |
| Overdue indicator | ⬜ | |

---

### 2.3 Daily Logs

**Route**: `/(project-mgmt)/[projectId]/daily-log`
**Database Table**: `daily_logs`

#### Create Daily Log Entry
| Criteria | Status | Notes |
|----------|--------|-------|
| Log date | ⬜ | |
| Project ID automatically set | ⬜ | |
| Weather conditions | ⬜ | |
| Temperature | ⬜ | |
| Work performed (description) | ⬜ | |
| Manpower count by trade | ⬜ | |
| Equipment on site | ⬜ | |
| Visitors | ⬜ | |
| Safety incidents | ⬜ | |
| Delays/issues | ⬜ | |
| Photos | ⬜ | |
| Submit saves to database | ⬜ | |

#### Daily Log List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches logs for project | ⬜ | |
| Displays by date | ⬜ | |
| Calendar view option | ⬜ | |
| Search by date range | ⬜ | |

---

### 2.4 Tasks

**Route**: `/(project-mgmt)/[projectId]/tasks`
**Database Table**: `tasks` or `ai_tasks`

#### Create Task Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Title | ⬜ | |
| Description | ⬜ | |
| Project ID automatically set | ⬜ | |
| Assignee | ⬜ | |
| Due date | ⬜ | |
| Priority | ⬜ | |
| Status: todo, in_progress, done | ⬜ | |
| Submit saves to database | ⬜ | |

#### Tasks List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches tasks for project | ⬜ | |
| Kanban board view | ⬜ | |
| List view | ⬜ | |
| Filter by assignee | ⬜ | |
| Filter by status | ⬜ | |
| Drag-and-drop status change | ⬜ | |

---

### 2.5 Punch List

**Route**: `/(project-mgmt)/[projectId]/punch-list`
**Database Table**: TBD (may need to create)

#### Create Punch Item
| Criteria | Status | Notes |
|----------|--------|-------|
| Item number | ⬜ | |
| Description | ⬜ | |
| Location | ⬜ | |
| Responsible party | ⬜ | |
| Due date | ⬜ | |
| Priority | ⬜ | |
| Status: open, in_progress, completed, verified | ⬜ | |
| Photos (before/after) | ⬜ | |
| Submit saves to database | ⬜ | |

#### Punch List View
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches punch items for project | ⬜ | |
| Filter by status | ⬜ | |
| Filter by responsible party | ⬜ | |
| Progress stats | ⬜ | |

---

### 2.6 Meetings

**Route**: `/(project-mgmt)/[projectId]/meetings`
**Database Table**: `meetings` or `document_metadata`

#### Meeting Details
| Criteria | Status | Notes |
|----------|--------|-------|
| Meeting title/name | ⬜ | |
| Meeting date | ⬜ | |
| Attendees | ⬜ | |
| Meeting notes/minutes | ⬜ | |
| Action items generated | ⬜ | Links to tasks |
| AI insights from meeting | ⬜ | From `ai_insights` |

---

## Priority 3: Directory Module

### 3.1 Clients

**Route**: `/clients` or `/(project-mgmt)/directory/clients`
**Database Table**: `clients`

#### Create Client Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Client name | ⬜ | |
| Associated company | ⬜ | Links to `companies` |
| Status: active, inactive | ⬜ | |
| Submit saves to database | ⬜ | |

#### Clients List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches all clients | ⬜ | |
| Displays: name, company, status | ⬜ | |
| Search by name | ⬜ | |
| Filter by status | ⬜ | |

---

### 3.2 Companies

**Route**: `/(project-mgmt)/directory/companies`
**Database Table**: `companies`

#### Create Company Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Company name | ⬜ | |
| Company type (subcontractor, supplier, owner, architect, etc.) | ⬜ | |
| Address, city, state, zip | ⬜ | |
| Phone, fax, email | ⬜ | |
| Website | ⬜ | |
| Tax ID | ⬜ | |
| Insurance info | ⬜ | |
| Submit saves to `companies` table | ⬜ | |

#### Companies List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches all companies | ⬜ | |
| Displays: name, type, contact info | ⬜ | |
| Filter by type | ⬜ | |
| Search by name | ⬜ | |

---

### 3.3 Contacts

**Route**: `/(project-mgmt)/directory/contacts`
**Database Table**: `contacts`

#### Create Contact Form
| Criteria | Status | Notes |
|----------|--------|-------|
| First name, last name | ⬜ | |
| Company association | ⬜ | Links to `companies` |
| Title/role | ⬜ | |
| Email | ⬜ | |
| Phone, mobile | ⬜ | |
| Submit saves to database | ⬜ | |

#### Contacts List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches all contacts | ⬜ | |
| Displays: name, company, title, contact info | ⬜ | |
| Search by name or company | ⬜ | |
| Filter by company | ⬜ | |

---

### 3.4 Users

**Route**: `/(project-mgmt)/directory/users`
**Database Table**: `users`, `app_users`, `profiles`

#### User Management
| Criteria | Status | Notes |
|----------|--------|-------|
| List all users | ⬜ | |
| Invite new user | ⬜ | |
| Assign user to projects | ⬜ | |
| Set user role | ⬜ | |
| Deactivate user | ⬜ | |

---

## Priority 4: Document Management

### 4.1 Documents

**Route**: `/(project-mgmt)/[projectId]/documents`
**Database Table**: `documents`, `document_metadata`

#### Upload Document
| Criteria | Status | Notes |
|----------|--------|-------|
| File upload (drag & drop) | ⬜ | |
| Document title | ⬜ | |
| Document type | ⬜ | |
| Category/folder | ⬜ | |
| Version number | ⬜ | |
| Upload to Supabase Storage | ⬜ | |
| Metadata saved to `documents` | ⬜ | |

#### Documents List
| Criteria | Status | Notes |
|----------|--------|-------|
| Fetches documents for project | ⬜ | |
| Folder structure navigation | ⬜ | |
| Filter by type | ⬜ | |
| Search by name | ⬜ | |
| Download functionality | ⬜ | |
| Preview (PDF, images) | ⬜ | |

---

### 4.2 Drawings

**Route**: `/(project-mgmt)/[projectId]/drawings`
**Database Table**: `drawings` or `documents` with type

#### Drawings Management
| Criteria | Status | Notes |
|----------|--------|-------|
| Upload drawing set | ⬜ | |
| Drawing number | ⬜ | |
| Drawing title | ⬜ | |
| Revision tracking | ⬜ | |
| Discipline filter (architectural, structural, MEP) | ⬜ | |
| Sheet listing | ⬜ | |
| Viewer integration | ⬜ | |

---

### 4.3 Specifications

**Route**: `/(project-mgmt)/[projectId]/specifications`
**Database Table**: TBD

#### Specifications Management
| Criteria | Status | Notes |
|----------|--------|-------|
| Upload spec sections | ⬜ | |
| Section number | ⬜ | |
| Section title | ⬜ | |
| Revision tracking | ⬜ | |
| Search within specs | ⬜ | |

---

## Priority 5: Project Setup

### 5.1 Project Creation

**Route**: Could be modal or dedicated page
**Database Table**: `projects`

#### Create Project Form
| Criteria | Status | Notes |
|----------|--------|-------|
| Project name | ⬜ | |
| Project number | ⬜ | |
| Client/owner | ⬜ | Links to `clients` |
| Project type | ⬜ | |
| Address/location | ⬜ | |
| Start date | ⬜ | |
| Target completion date | ⬜ | |
| Contract value | ⬜ | |
| Project manager assignment | ⬜ | |
| Submit creates project in `projects` table | ⬜ | |

---

### 5.2 Project Settings

**Route**: `/(project-mgmt)/[projectId]/setup`
**Database Table**: `projects` + related settings

#### Project Configuration
| Criteria | Status | Notes |
|----------|--------|-------|
| Edit project details | ⬜ | |
| Cost code assignment | ⬜ | |
| Team member assignment | ⬜ | |
| Notification settings | ⬜ | |
| Integration settings | ⬜ | |

---

## Summary Statistics

### Completion Tracking

| Module | Total Items | Completed | Percentage |
|--------|-------------|-----------|------------|
| Core Financial | ~80 criteria | 1 | ~1% |
| Project Management | ~60 criteria | 0 | 0% |
| Directory | ~30 criteria | 0 | 0% |
| Documents | ~25 criteria | 0 | 0% |
| Project Setup | ~15 criteria | 0 | 0% |
| **TOTAL** | ~210 criteria | 1 | <1% |

---

## Implementation Order Recommendation

### Phase 1: Foundation (Do First)
1. Companies form (needed for commitments/contracts)
2. Clients form (needed for contracts)
3. Contacts form (needed for assignments)
4. Cost Codes (needed for budget/commitments)

### Phase 2: Core Financial Loop
1. Budget setup
2. Commitments (subcontracts/POs)
3. Change Orders (to commitments)
4. Prime Contracts (owner contracts)
5. Invoices

### Phase 3: Change Management
1. Change Events
2. Direct Costs
3. Billing Periods

### Phase 4: Project Management
1. RFIs
2. Submittals
3. Daily Logs
4. Tasks
5. Punch List

### Phase 5: Documents & Reporting
1. Document Upload
2. Drawings
3. Specifications
4. Reporting

---

## Testing Protocol

For each feature:

1. **Unit Test**: Form validation works correctly
2. **Integration Test**: Form submits and saves to database
3. **E2E Test (Playwright)**:
   - Navigate to page
   - Fill form with valid data
   - Submit form
   - Verify success message
   - Verify data appears in list
   - Verify data exists in database
4. **Error Handling Test**:
   - Submit with missing required fields
   - Submit with invalid data
   - Verify error messages display correctly

---

## Database Column Reference

### Key Tables Quick Reference

**contracts**
- id, project_id, number, title, owner_id, status, amount, retention_percentage
- executed_date, start_date, completion_date, created_at, updated_at

**commitments**
- id, project_id, budget_item_id, vendor_id, contract_amount, retention_percentage
- status, executed_at, created_at

**change_orders**
- id, project_id, co_number, title, description, status
- apply_vertical_markup, submitted_by, submitted_at, approved_by, approved_at

**change_events**
- id, project_id, event_number, title, scope, reason, status, notes

**budget_items**
- id, project_id, cost_code_id, original_budget_amount, budget_modifications
- committed_cost, direct_cost, forecast_to_complete, revised_budget

**rfis**
- id, project_id, number, subject, question, status, priority
- sent_to, due_date, answered_at

**companies**
- id, name, type, address, city, state, zip, phone, email, website, tax_id

**clients**
- id, name, company_id, status

**contacts**
- id, first_name, last_name, company_id, title, email, phone

---

## Notes

- All forms should use React Hook Form + Zod for validation
- All API calls should use the Supabase client from `@/lib/supabase/server`
- All pages under `/(project-mgmt)/[projectId]/` should use the ProjectContext
- Status fields should use consistent enum values across the application
- All monetary values stored as numbers (cents or dollars - be consistent)
- All dates stored as ISO strings or timestamps
