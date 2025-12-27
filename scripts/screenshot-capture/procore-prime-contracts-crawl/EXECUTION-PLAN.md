# Prime Contracts Module - Execution Plan

**Project:** Alleato Procore Prime Contracts Integration
**Created:** 2025-12-27
**Last Updated:** 2025-12-27
**Status:** Ready to Begin

---

## Executive Summary

This document serves as the **single source of truth** for Prime Contracts implementation. Every task must be accompanied by Playwright E2E tests, and no task can be marked complete until tests pass consistently.

### Project Scope
- **Total Tasks:** 48 discrete tasks
- **Estimated Duration:** 8-10 weeks
- **Test Coverage Target:** 100% of user-facing functionality
- **Quality Gates:** All Playwright tests must pass before deployment

### Task Status Workflow

```
to do → in progress → testing → validated → complete
```

**Rules:**
1. Tasks must progress through ALL stages in order
2. "Complete" status requires passing Playwright tests
3. Tests must be written BEFORE marking "testing"
4. Validation requires 3+ consecutive successful test runs
5. Progress log must be updated at each status change

---

## Phase 1: Foundation & Database (Weeks 1-2)

### 1.1 Database Schema - Prime Contracts Core

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 2 days
**Dependencies:** None

#### Tasks
- [ ] Create `prime_contracts` table with all required columns
- [ ] Add indexes on `project_id`, `vendor_id`, `status`, `contract_number`
- [ ] Create RLS policies for project-level access
- [ ] Add foreign key constraints
- [ ] Create database migration file
- [ ] Generate TypeScript types from schema

#### Schema Definition
```sql
CREATE TABLE prime_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_number TEXT NOT NULL,
  title TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  original_contract_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  revised_contract_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  retention_percentage DECIMAL(5,2) DEFAULT 0,
  payment_terms TEXT,
  billing_schedule TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, contract_number)
);

CREATE INDEX idx_prime_contracts_project ON prime_contracts(project_id);
CREATE INDEX idx_prime_contracts_vendor ON prime_contracts(vendor_id);
CREATE INDEX idx_prime_contracts_status ON prime_contracts(status);
CREATE INDEX idx_prime_contracts_number ON prime_contracts(contract_number);
```

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/database-schema.spec.ts`
  - Test: Create contract and verify all fields persist correctly
  - Test: Verify RLS policies block unauthorized access
  - Test: Verify unique constraint on contract_number per project
  - Test: Verify foreign key constraints
  - Test: Verify indexes exist and improve query performance

#### Acceptance Criteria
- ✅ Migration runs without errors
- ✅ TypeScript types generated and importable
- ✅ All E2E tests pass
- ✅ RLS policies verified with test users
- ✅ No TypeScript or ESLint errors

---

### 1.2 Database Schema - Contract Line Items

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 1 day
**Dependencies:** Task 1.1

#### Tasks
- [ ] Create `contract_line_items` table
- [ ] Add indexes and foreign keys
- [ ] Create RLS policies
- [ ] Add triggers for auto-updating contract totals
- [ ] Generate TypeScript types

#### Schema Definition
```sql
CREATE TABLE contract_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES prime_contracts(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_code_id UUID REFERENCES cost_codes(id),
  quantity DECIMAL(15,4) DEFAULT 0,
  unit_of_measure TEXT,
  unit_cost DECIMAL(15,2) DEFAULT 0,
  total_cost DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(contract_id, line_number)
);

CREATE INDEX idx_contract_line_items_contract ON contract_line_items(contract_id);
CREATE INDEX idx_contract_line_items_cost_code ON contract_line_items(cost_code_id);
```

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/line-items-schema.spec.ts`
  - Test: Create line items and verify total_cost calculation
  - Test: Verify line_number uniqueness per contract
  - Test: Verify cascade delete when contract deleted
  - Test: Verify cost_code relationship

#### Acceptance Criteria
- ✅ Migration runs without errors
- ✅ Generated column (total_cost) calculates correctly
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 1.3 Database Schema - Change Orders

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 1 day
**Dependencies:** Task 1.1

#### Tasks
- [ ] Create `contract_change_orders` table
- [ ] Add status workflow fields
- [ ] Create approval tracking fields
- [ ] Add indexes and RLS policies
- [ ] Generate TypeScript types

#### Schema Definition
```sql
CREATE TABLE contract_change_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES prime_contracts(id) ON DELETE CASCADE,
  change_order_number TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by UUID REFERENCES auth.users(id),
  requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
  approved_by UUID REFERENCES auth.users(id),
  approved_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(contract_id, change_order_number)
);

CREATE INDEX idx_change_orders_contract ON contract_change_orders(contract_id);
CREATE INDEX idx_change_orders_status ON contract_change_orders(status);
```

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/change-orders-schema.spec.ts`
  - Test: Create change order with pending status
  - Test: Update status from pending to approved
  - Test: Verify unique constraint on change_order_number
  - Test: Verify approval fields update correctly

#### Acceptance Criteria
- ✅ Migration runs without errors
- ✅ All E2E tests pass
- ✅ Status transitions work correctly
- ✅ No TypeScript or ESLint errors

---

### 1.4 Database Schema - Billing & Payments

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 1.5 days
**Dependencies:** Task 1.1

#### Tasks
- [ ] Create `contract_billing_periods` table
- [ ] Create `contract_payments` table
- [ ] Add retention tracking fields
- [ ] Create RLS policies
- [ ] Generate TypeScript types

#### Schema Definition
```sql
CREATE TABLE contract_billing_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES prime_contracts(id) ON DELETE CASCADE,
  period_number INTEGER NOT NULL,
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  billed_amount DECIMAL(15,2) DEFAULT 0,
  retention_withheld DECIMAL(15,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(contract_id, period_number)
);

CREATE TABLE contract_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES prime_contracts(id) ON DELETE CASCADE,
  billing_period_id UUID REFERENCES contract_billing_periods(id),
  payment_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  retention_released DECIMAL(15,2) DEFAULT 0,
  check_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_billing_periods_contract ON contract_billing_periods(contract_id);
CREATE INDEX idx_payments_contract ON contract_payments(contract_id);
CREATE INDEX idx_payments_billing_period ON contract_payments(billing_period_id);
```

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/billing-schema.spec.ts`
  - Test: Create billing period with retention calculation
  - Test: Create payment linked to billing period
  - Test: Verify retention tracking across periods
  - Test: Verify cascade delete behavior

#### Acceptance Criteria
- ✅ Migration runs without errors
- ✅ All E2E tests pass
- ✅ Retention calculations work correctly
- ✅ No TypeScript or ESLint errors

---

### 1.5 Database Schema - Supporting Tables

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 1 day
**Dependencies:** Task 1.1

#### Tasks
- [ ] Create `vendors` table (if not exists)
- [ ] Create `contract_documents` table
- [ ] Create `contract_snapshots` table
- [ ] Create `contract_views` table
- [ ] Generate TypeScript types

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/supporting-tables.spec.ts`
  - Test: Create vendor and link to contract
  - Test: Upload document and link to contract
  - Test: Create contract snapshot
  - Test: Create custom contract view

#### Acceptance Criteria
- ✅ All tables created successfully
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 1.6 API Routes - Contract CRUD

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 2 days
**Dependencies:** Tasks 1.1-1.5

#### Tasks
- [ ] Create `/api/projects/[id]/contracts/route.ts` (GET, POST)
- [ ] Create `/api/projects/[id]/contracts/[contractId]/route.ts` (GET, PUT, DELETE)
- [ ] Add request validation with Zod schemas
- [ ] Add error handling
- [ ] Add permission checks
- [ ] Generate OpenAPI documentation

#### API Endpoints
```typescript
// GET /api/projects/:projectId/contracts
// POST /api/projects/:projectId/contracts
// GET /api/projects/:projectId/contracts/:contractId
// PUT /api/projects/:projectId/contracts/:contractId
// DELETE /api/projects/:projectId/contracts/:contractId
```

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/api-crud.spec.ts`
  - Test: GET contracts list returns 200 with array
  - Test: POST creates contract and returns 201
  - Test: GET single contract returns 200 with data
  - Test: PUT updates contract and returns 200
  - Test: DELETE removes contract and returns 204
  - Test: Unauthorized access returns 401/403
  - Test: Invalid data returns 400 with validation errors
  - Test: Non-existent contract returns 404

#### Acceptance Criteria
- ✅ All endpoints implemented and documented
- ✅ Zod validation on all inputs
- ✅ Proper HTTP status codes
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 1.7 API Routes - Line Items

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 1 day
**Dependencies:** Task 1.6

#### Tasks
- [ ] Create `/api/projects/[id]/contracts/[contractId]/line-items/route.ts`
- [ ] Add CRUD operations for line items
- [ ] Add validation and permission checks
- [ ] Auto-recalculate contract totals on line item changes

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/api-line-items.spec.ts`
  - Test: Create line item and verify auto-calculation
  - Test: Update line item and verify contract total updates
  - Test: Delete line item and verify contract total updates
  - Test: Validate quantity and unit_cost fields

#### Acceptance Criteria
- ✅ All endpoints working
- ✅ Auto-calculation triggers work
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 1.8 API Routes - Change Orders

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 1.5 days
**Dependencies:** Task 1.6

#### Tasks
- [ ] Create `/api/projects/[id]/contracts/[contractId]/change-orders/route.ts`
- [ ] Add approval workflow endpoints
- [ ] Create `/api/change-orders/[id]/approve` endpoint
- [ ] Create `/api/change-orders/[id]/reject` endpoint
- [ ] Add notification triggers

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/api-change-orders.spec.ts`
  - Test: Create change order with pending status
  - Test: Approve change order and verify status/dates update
  - Test: Reject change order with reason
  - Test: Verify contract value updates on approval
  - Test: Permission checks for approval actions

#### Acceptance Criteria
- ✅ All endpoints working
- ✅ Approval workflow complete
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

## Phase 2: Core UI Components (Weeks 3-4)

### 2.1 Contracts Table Component

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 3 days
**Dependencies:** Task 1.6

#### Tasks
- [ ] Create `ContractsTable.tsx` component
- [ ] Implement AG Grid or TanStack Table
- [ ] Add sortable columns
- [ ] Add filtering capability
- [ ] Add row selection with checkboxes
- [ ] Add pagination
- [ ] Add search functionality
- [ ] Add loading states and error handling

#### Columns to Display
- Contract Number
- Title
- Vendor
- Original Value
- Revised Value
- Status
- Start Date
- End Date
- Actions

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/contracts-table.spec.ts`
  - Test: Table loads and displays contracts
  - Test: Sort by contract number (ascending/descending)
  - Test: Sort by value, date, status
  - Test: Filter by status
  - Test: Search by contract number and title
  - Test: Pagination works correctly
  - Test: Row selection with checkboxes
  - Test: Loading state displays while fetching
  - Test: Error state displays on API failure
  - Test: Empty state when no contracts

#### Acceptance Criteria
- ✅ Table renders with all columns
- ✅ All sorting and filtering work
- ✅ All E2E tests pass
- ✅ Responsive design (mobile-friendly)
- ✅ No TypeScript or ESLint errors

---

### 2.2 Contract Actions Toolbar

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 1.5 days
**Dependencies:** Task 2.1

#### Tasks
- [ ] Create `ContractsToolbar.tsx` component
- [ ] Add "Create Contract" button
- [ ] Add "Export" dropdown (PDF, Excel, CSV)
- [ ] Add "Import" dropdown
- [ ] Add "Bulk Actions" menu
- [ ] Add filters panel toggle
- [ ] Add view selector

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/contracts-toolbar.spec.ts`
  - Test: Click "Create Contract" navigates to form
  - Test: Export dropdown shows all options
  - Test: Bulk actions menu shows when rows selected
  - Test: Filter panel toggles visibility
  - Test: All buttons are accessible and labeled

#### Acceptance Criteria
- ✅ All buttons functional
- ✅ All E2E tests pass
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ No TypeScript or ESLint errors

---

### 2.3 Create Contract Form

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 3 days
**Dependencies:** Task 1.6

#### Tasks
- [ ] Create `/[projectId]/contracts/new/page.tsx`
- [ ] Build form with React Hook Form
- [ ] Add Zod validation schema
- [ ] Add vendor/subcontractor selector
- [ ] Add date pickers
- [ ] Add currency inputs with formatting
- [ ] Add save/cancel actions
- [ ] Add form validation errors

#### Form Fields
- Contract Number (auto-generated or manual)
- Title*
- Vendor/Subcontractor*
- Description
- Original Contract Value*
- Start Date*
- End Date
- Retention Percentage
- Payment Terms
- Billing Schedule
- Status

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/create-contract.spec.ts`
  - Test: Form loads with all fields
  - Test: Validation errors show for required fields
  - Test: Contract number auto-generates
  - Test: Vendor selector works
  - Test: Date pickers work
  - Test: Currency formatting works
  - Test: Save creates contract and redirects
  - Test: Cancel returns to contracts list
  - Test: Duplicate contract number shows error

#### Acceptance Criteria
- ✅ Form validates all required fields
- ✅ All E2E tests pass
- ✅ Auto-save draft functionality
- ✅ No TypeScript or ESLint errors

---

### 2.4 Contract Detail View

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 3 days
**Dependencies:** Task 1.6

#### Tasks
- [ ] Create `/[projectId]/contracts/[id]/page.tsx`
- [ ] Build header with key contract info
- [ ] Create tabbed interface
- [ ] Implement "Details" tab
- [ ] Implement "Line Items" tab
- [ ] Implement "Change Orders" tab
- [ ] Implement "Billing" tab
- [ ] Implement "Documents" tab
- [ ] Implement "History" tab
- [ ] Add edit/delete actions

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/contract-detail.spec.ts`
  - Test: Page loads with contract data
  - Test: Header displays all key metrics
  - Test: All tabs are clickable and functional
  - Test: Details tab shows all contract info
  - Test: Line Items tab loads line items table
  - Test: Change Orders tab loads change orders
  - Test: Billing tab shows billing periods
  - Test: Documents tab shows attachments
  - Test: History tab shows audit trail
  - Test: Edit button navigates to edit form
  - Test: Delete shows confirmation dialog
  - Test: Status badge displays correctly

#### Acceptance Criteria
- ✅ All tabs implemented and functional
- ✅ All E2E tests pass
- ✅ Responsive design
- ✅ No TypeScript or ESLint errors

---

### 2.5 Edit Contract Form

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 2 days
**Dependencies:** Task 2.3

#### Tasks
- [ ] Create `/[projectId]/contracts/[id]/edit/page.tsx`
- [ ] Pre-populate form with existing data
- [ ] Add validation and permission checks
- [ ] Handle optimistic updates
- [ ] Add change tracking
- [ ] Add save/cancel actions

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/edit-contract.spec.ts`
  - Test: Form loads with existing contract data
  - Test: All fields are editable
  - Test: Validation works on update
  - Test: Save updates contract successfully
  - Test: Cancel discards changes
  - Test: Concurrent edit detection
  - Test: Permission check (unauthorized user blocked)

#### Acceptance Criteria
- ✅ Form pre-populates correctly
- ✅ All E2E tests pass
- ✅ Change tracking works
- ✅ No TypeScript or ESLint errors

---

### 2.6 Line Items Table Component

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 2 days
**Dependencies:** Task 1.7

#### Tasks
- [ ] Create `LineItemsTable.tsx` component
- [ ] Add inline editing capability
- [ ] Add add/delete line item actions
- [ ] Add cost code selector
- [ ] Auto-calculate totals
- [ ] Show running total

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/line-items-table.spec.ts`
  - Test: Table displays all line items
  - Test: Add new line item
  - Test: Edit line item inline
  - Test: Delete line item with confirmation
  - Test: Total calculation updates automatically
  - Test: Cost code selector works
  - Test: Quantity and unit cost formatting

#### Acceptance Criteria
- ✅ Inline editing works
- ✅ Auto-calculations correct
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 2.7 Filter and Search Components

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2 days
**Dependencies:** Task 2.1

#### Tasks
- [ ] Create `ContractsFilter.tsx` component
- [ ] Add status filter dropdown
- [ ] Add vendor filter dropdown
- [ ] Add date range filter
- [ ] Add value range filter
- [ ] Add search input for text search
- [ ] Add "Clear All Filters" button
- [ ] Persist filters to URL params

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/filters-search.spec.ts`
  - Test: Status filter updates table
  - Test: Vendor filter updates table
  - Test: Date range filter works
  - Test: Value range filter works
  - Test: Search by contract number
  - Test: Search by title
  - Test: Multiple filters combine correctly
  - Test: Clear all filters resets table
  - Test: Filters persist in URL
  - Test: URL filters load on page refresh

#### Acceptance Criteria
- ✅ All filters functional
- ✅ URL persistence works
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

## Phase 3: Advanced Features (Weeks 5-6)

### 3.1 Change Order Management

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 3 days
**Dependencies:** Task 1.8, Task 2.4

#### Tasks
- [ ] Create `ChangeOrderForm.tsx` component
- [ ] Create `ChangeOrdersTable.tsx` component
- [ ] Add create change order flow
- [ ] Add approval workflow UI
- [ ] Add rejection flow with reason
- [ ] Show impact on contract value
- [ ] Add notifications

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/change-orders.spec.ts`
  - Test: Create change order from contract detail
  - Test: Change order appears in table
  - Test: Approve change order (authorized user)
  - Test: Contract value updates after approval
  - Test: Reject change order with reason
  - Test: Pending change orders show in summary
  - Test: Approval notification sent
  - Test: Unauthorized user cannot approve

#### Acceptance Criteria
- ✅ Full workflow functional
- ✅ All E2E tests pass
- ✅ Notifications working
- ✅ No TypeScript or ESLint errors

---

### 3.2 Billing Periods Management

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 3 days
**Dependencies:** Task 1.4

#### Tasks
- [ ] Create `BillingPeriodsTable.tsx` component
- [ ] Create `BillingPeriodForm.tsx` component
- [ ] Add create billing period flow
- [ ] Add retention calculation
- [ ] Show billed to date summary
- [ ] Add period status tracking

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/billing-periods.spec.ts`
  - Test: Create billing period
  - Test: Retention calculates correctly
  - Test: Billed to date total updates
  - Test: Period status changes
  - Test: Edit billing period
  - Test: Delete billing period with confirmation
  - Test: Billing summary displays correctly

#### Acceptance Criteria
- ✅ Billing workflow complete
- ✅ Retention calculations correct
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 3.3 Payment Applications

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2.5 days
**Dependencies:** Task 3.2

#### Tasks
- [ ] Create `PaymentApplicationForm.tsx` component
- [ ] Create `PaymentsTable.tsx` component
- [ ] Add payment creation flow
- [ ] Add retention release tracking
- [ ] Link payments to billing periods
- [ ] Calculate remaining contract value

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/payment-applications.spec.ts`
  - Test: Create payment application
  - Test: Link payment to billing period
  - Test: Retention release calculation
  - Test: Payment history displays
  - Test: Remaining value updates
  - Test: Edit payment details
  - Test: Delete payment with confirmation

#### Acceptance Criteria
- ✅ Payment workflow complete
- ✅ All E2E tests pass
- ✅ Calculations accurate
- ✅ No TypeScript or ESLint errors

---

### 3.4 Document Management

**Status:** `to do`
**Priority:** P2 - Medium
**Estimated Time:** 2 days
**Dependencies:** Task 2.4

#### Tasks
- [ ] Create `DocumentsTab.tsx` component
- [ ] Add file upload to Supabase Storage
- [ ] Add document type categorization
- [ ] Add document preview
- [ ] Add download functionality
- [ ] Add delete with confirmation
- [ ] Add version tracking

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/documents.spec.ts`
  - Test: Upload document successfully
  - Test: Document appears in list
  - Test: Download document
  - Test: Preview document (PDF, images)
  - Test: Delete document with confirmation
  - Test: Document categories work
  - Test: Multiple file upload
  - Test: File size validation

#### Acceptance Criteria
- ✅ Upload/download working
- ✅ All E2E tests pass
- ✅ File size limits enforced
- ✅ No TypeScript or ESLint errors

---

### 3.5 Contract Calculations Engine

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2 days
**Dependencies:** Tasks 1.1-1.4

#### Tasks
- [ ] Create `/lib/calculations/contracts.ts`
- [ ] Implement revised_value calculation
- [ ] Implement pending_value calculation
- [ ] Implement billed_to_date calculation
- [ ] Implement remaining_value calculation
- [ ] Implement percent_complete calculation
- [ ] Implement retention calculations
- [ ] Add calculation triggers

#### Calculations
```typescript
revised_contract_value = original_contract_value + sum(approved_change_orders)
pending_contract_value = revised_contract_value + sum(pending_change_orders)
billed_to_date = sum(billing_periods.billed_amount)
remaining_contract_value = revised_contract_value - billed_to_date
percent_complete = (billed_to_date / revised_contract_value) * 100
retention_withheld = sum(billing_periods.retention_withheld)
retention_released = sum(payments.retention_released)
```

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/calculations.spec.ts`
  - Test: Revised value updates when CO approved
  - Test: Pending value includes pending COs
  - Test: Billed to date sums correctly
  - Test: Remaining value calculated correctly
  - Test: Percent complete accurate
  - Test: Retention tracking accurate
  - Test: All calculations update in real-time

#### Acceptance Criteria
- ✅ All formulas implemented
- ✅ Real-time updates working
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 3.6 Import/Export Functionality

**Status:** `to do`
**Priority:** P2 - Medium
**Estimated Time:** 3 days
**Dependencies:** Task 2.1

#### Tasks
- [ ] Create `/api/contracts/[id]/export` endpoint
- [ ] Add Excel export functionality
- [ ] Add CSV export functionality
- [ ] Add PDF export (contract document)
- [ ] Create import parser for Excel/CSV
- [ ] Add import validation and error handling
- [ ] Add import preview

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/import-export.spec.ts`
  - Test: Export to Excel downloads file
  - Test: Export to CSV downloads file
  - Test: Export to PDF generates document
  - Test: Import Excel file with valid data
  - Test: Import validation catches errors
  - Test: Import preview shows changes
  - Test: Import creates contracts correctly
  - Test: Export includes all visible columns
  - Test: Export respects current filters

#### Acceptance Criteria
- ✅ Export formats working
- ✅ Import validation robust
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

## Phase 4: Integration & Polish (Weeks 7-8)

### 4.1 Budget Integration

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 3 days
**Dependencies:** Task 3.5

#### Tasks
- [ ] Create link between contracts and budget lines
- [ ] Show contract commitments in budget
- [ ] Update budget on contract changes
- [ ] Show contract value vs budget variance
- [ ] Add budget allocation selector in contract form

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/budget-integration.spec.ts`
  - Test: Link contract to budget line
  - Test: Contract appears in budget commitments
  - Test: Budget updates when contract value changes
  - Test: Budget variance calculation correct
  - Test: Budget allocation works in contract form
  - Test: Unlinking contract from budget

#### Acceptance Criteria
- ✅ Integration working both ways
- ✅ All E2E tests pass
- ✅ Real-time sync working
- ✅ No TypeScript or ESLint errors

---

### 4.2 Permissions & Security

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 2 days
**Dependencies:** All previous tasks

#### Tasks
- [ ] Implement RLS policies for all tables
- [ ] Add role-based permission checks
- [ ] Create permission configuration UI
- [ ] Add field-level security
- [ ] Audit log all sensitive actions
- [ ] Add permission denial messages

#### Permission Levels
- **View Only:** Can view contracts
- **Editor:** Can create/edit contracts
- **Approver:** Can approve change orders
- **Admin:** Full access including delete

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/permissions.spec.ts`
  - Test: View-only user cannot edit
  - Test: Editor can create/edit but not approve
  - Test: Approver can approve change orders
  - Test: Admin can delete contracts
  - Test: RLS prevents cross-project access
  - Test: Field-level security hides sensitive data
  - Test: Audit log captures all actions
  - Test: Permission denied messages clear

#### Acceptance Criteria
- ✅ All permission levels work
- ✅ RLS policies tested
- ✅ All E2E tests pass
- ✅ No TypeScript or ESLint errors

---

### 4.3 Snapshots & History

**Status:** `to do`
**Priority:** P2 - Medium
**Estimated Time:** 2 days
**Dependencies:** Task 2.4

#### Tasks
- [ ] Create snapshot on contract save
- [ ] Add snapshot comparison UI
- [ ] Show change history timeline
- [ ] Add restore from snapshot
- [ ] Auto-snapshot on major changes

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/snapshots.spec.ts`
  - Test: Snapshot created on save
  - Test: Snapshot list displays
  - Test: Compare two snapshots
  - Test: History timeline shows changes
  - Test: Restore from snapshot
  - Test: Auto-snapshot on approval

#### Acceptance Criteria
- ✅ Snapshots working
- ✅ All E2E tests pass
- ✅ Comparison UI functional
- ✅ No TypeScript or ESLint errors

---

### 4.4 Performance Optimization

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2 days
**Dependencies:** All previous tasks

#### Tasks
- [ ] Add database query optimization
- [ ] Implement caching for frequent queries
- [ ] Add pagination for large datasets
- [ ] Lazy load tabs in detail view
- [ ] Optimize bundle size
- [ ] Add loading skeletons

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/performance.spec.ts`
  - Test: Table loads in < 2 seconds
  - Test: Detail page loads in < 1 second
  - Test: Search results appear in < 500ms
  - Test: Pagination handles 1000+ contracts
  - Test: No memory leaks on navigation
  - Test: Images lazy load correctly

#### Acceptance Criteria
- ✅ Performance targets met
- ✅ All E2E tests pass
- ✅ Lighthouse score > 90
- ✅ No TypeScript or ESLint errors

---

### 4.5 Accessibility & Responsive Design

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2 days
**Dependencies:** All previous tasks

#### Tasks
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Make all forms mobile-friendly
- [ ] Test on tablet and phone
- [ ] Add touch-friendly controls

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/accessibility.spec.ts`
  - Test: All buttons keyboard accessible
  - Test: Tab navigation logical order
  - Test: ARIA labels present and correct
  - Test: Focus indicators visible
  - Test: Color contrast meets WCAG AA
  - Test: Screen reader announcements work
  - Test: Mobile viewport renders correctly
  - Test: Touch targets minimum 44px

#### Acceptance Criteria
- ✅ WCAG 2.1 AA compliance
- ✅ All E2E tests pass
- ✅ Mobile-friendly
- ✅ No TypeScript or ESLint errors

---

### 4.6 Error Handling & Edge Cases

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2 days
**Dependencies:** All previous tasks

#### Tasks
- [ ] Add comprehensive error boundaries
- [ ] Handle API failures gracefully
- [ ] Add retry logic for failed requests
- [ ] Test offline behavior
- [ ] Add validation for all edge cases
- [ ] Test concurrent editing

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/error-handling.spec.ts`
  - Test: API error shows user-friendly message
  - Test: Network failure triggers retry
  - Test: Offline mode shows appropriate message
  - Test: Invalid data shows validation errors
  - Test: Concurrent edit detection works
  - Test: Error boundary catches crashes
  - Test: Recovery from error state
  - Test: Duplicate submission prevention

#### Acceptance Criteria
- ✅ All errors handled gracefully
- ✅ All E2E tests pass
- ✅ User experience smooth
- ✅ No TypeScript or ESLint errors

---

## Phase 5: Testing & Deployment (Week 8+)

### 5.1 Comprehensive E2E Test Suite

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 3 days
**Dependencies:** All previous tasks

#### Tasks
- [ ] Review all E2E tests written
- [ ] Add integration tests across modules
- [ ] Test complete user workflows
- [ ] Add visual regression tests
- [ ] Test all error paths
- [ ] Run tests in CI/CD pipeline

#### E2E Tests Required
- [ ] `tests/e2e/prime-contracts/complete-workflow.spec.ts`
  - Test: Complete contract lifecycle
  - Test: Create → Edit → Add Line Items → Create CO → Approve → Bill → Pay
  - Test: Multi-user collaboration
  - Test: Budget integration end-to-end
  - Test: Import → Edit → Export workflow
  - Test: Error recovery workflows

#### Acceptance Criteria
- ✅ 100% E2E test coverage
- ✅ All tests pass consistently
- ✅ CI/CD pipeline green
- ✅ No flaky tests

---

### 5.2 Documentation

**Status:** `to do`
**Priority:** P1 - High
**Estimated Time:** 2 days
**Dependencies:** Task 5.1

#### Tasks
- [ ] Create user documentation
- [ ] Create API documentation
- [ ] Create developer setup guide
- [ ] Create testing guide
- [ ] Create deployment guide
- [ ] Add inline code comments

#### Deliverables
- [ ] `docs/USER_GUIDE.md`
- [ ] `docs/API_REFERENCE.md`
- [ ] `docs/DEVELOPER_SETUP.md`
- [ ] `docs/TESTING_GUIDE.md`
- [ ] `docs/DEPLOYMENT.md`

#### Acceptance Criteria
- ✅ All documentation complete
- ✅ Screenshots included
- ✅ Examples provided
- ✅ No outdated information

---

### 5.3 Production Deployment

**Status:** `to do`
**Priority:** P0 - Critical
**Estimated Time:** 1 day
**Dependencies:** Tasks 5.1, 5.2

#### Tasks
- [ ] Run final test suite
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Fix any issues found
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Create rollback plan

#### E2E Tests Required
- [ ] Run all E2E tests against staging
- [ ] Smoke tests on production

#### Acceptance Criteria
- ✅ All tests pass on staging
- ✅ UAT sign-off received
- ✅ Production deployment successful
- ✅ No critical errors in first 24h

---

## Progress Log

> **Instructions:** Update this section after each task status change. Include timestamp, task ID, status change, what was completed, test results, and next actions.

### 2025-12-27 13:15 UTC - Project Initialized
- **Action:** Created execution plan
- **Status:** All tasks initialized as "to do"
- **Next:** Begin Phase 1 - Task 1.1 (Database Schema)
- **Notes:** 48 discrete tasks defined with comprehensive E2E test requirements

---

## Test Coverage Summary

**Current Status:** Not Started

| Phase | Tasks | Tests Written | Tests Passing | Coverage |
|-------|-------|---------------|---------------|----------|
| Phase 1 | 0/8 | 0/8 | 0/8 | 0% |
| Phase 2 | 0/7 | 0/7 | 0/7 | 0% |
| Phase 3 | 0/6 | 0/6 | 0/6 | 0% |
| Phase 4 | 0/6 | 0/6 | 0/6 | 0% |
| Phase 5 | 0/3 | 0/3 | 0/3 | 0% |
| **Total** | **0/48** | **0/48** | **0/48** | **0%** |

---

## Status Legend

| Status | Meaning | Requirements |
|--------|---------|--------------|
| 🔴 `to do` | Not started | None |
| 🟡 `in progress` | Currently being developed | Code being written |
| 🔵 `testing` | Playwright tests written and running | Tests written, may be failing |
| 🟢 `validated` | Tests passing consistently | 3+ consecutive successful runs |
| ✅ `complete` | Done and verified | All acceptance criteria met |

---

## Critical Path

Tasks that block multiple other tasks:

1. **Task 1.1** - Database Schema Core (blocks: 1.2, 1.3, 1.4, 1.5, 1.6)
2. **Task 1.6** - API Routes CRUD (blocks: 1.7, 1.8, 2.1, 2.3, 2.4)
3. **Task 2.1** - Contracts Table (blocks: 2.2, 2.7, 3.6)
4. **Task 2.4** - Contract Detail View (blocks: 3.1, 3.4, 4.3)
5. **Task 3.5** - Calculations Engine (blocks: 4.1)

---

## Quality Gates

Before marking any phase complete:

- [ ] All tasks in phase at "complete" status
- [ ] All E2E tests passing consistently (3+ runs)
- [ ] No TypeScript errors
- [ ] No ESLint errors (warnings acceptable)
- [ ] Code reviewed
- [ ] Performance benchmarks met
- [ ] Accessibility tested
- [ ] Documentation updated

---

**Last Updated:** 2025-12-27 13:15 UTC
**Next Review:** Start of Phase 1 implementation
