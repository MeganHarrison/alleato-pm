# Prime Contracts Module Implementation Task List

**Generated from Procore Prime Contracts Crawl Data**
**Date:** 2025-12-27
**Source:** 70 pages analyzed

---

## Executive Summary

This document contains a comprehensive task list for implementing Procore-like prime contracts functionality based on actual screen captures and DOM analysis.

### Total Task Categories: 11, Estimated Total Tasks: 29

---

## 1. Database Schema

**Priority:** P0 - Critical

### 1.1 Design Core Prime Contracts Schema

**Description:** Create database tables for prime contract management

**Subtasks:**

- [ ] Create `prime_contracts` table with columns: id, project_id, contract_number, title, status, vendor_id, created_at, updated_at
- [ ] Create `contract_line_items` table for individual contract items
- [ ] Create `contract_billing_periods` table for billing schedules
- [ ] Create `contract_change_orders` table for change order tracking
- [ ] Create `contract_payments` table for payment tracking
- [ ] Create `contract_snapshots` table for point-in-time captures
- [ ] Create `contract_documents` table for document management
- [ ] Add foreign keys and relationships

**Acceptance Criteria:** All tables created with proper indexes and foreign keys

---

### 1.2 Create Contract Column Configuration System

**Description:** Allow users to configure which columns appear in contract views

**Subtasks:**

- [ ] Create `contract_view_columns` junction table
- [ ] Support column ordering and visibility settings
- [ ] Store column width preferences
- [ ] Support calculated columns
- [ ] Add support for custom fields

**Acceptance Criteria:** Users can customize contract view columns

---

### 1.3 Add Vendor Integration

**Description:** Link contracts to vendors and subcontractors

**Subtasks:**

- [ ] Create `vendors` table if not exists
- [ ] Create `subcontractors` table if not exists
- [ ] Add foreign keys to prime_contracts
- [ ] Support vendor contact information
- [ ] Track vendor insurance and certifications

**Acceptance Criteria:** Contracts can be linked to vendors

---

## 2. API Development

**Priority:** P0 - Critical

### 2.1 Prime Contracts REST API

**Description:** Create RESTful endpoints for prime contracts

**Subtasks:**

- [ ] GET /api/prime-contracts - List contracts
- [ ] GET /api/prime-contracts/:id - Get contract details
- [ ] POST /api/prime-contracts - Create contract
- [ ] PUT /api/prime-contracts/:id - Update contract
- [ ] DELETE /api/prime-contracts/:id - Delete contract
- [ ] GET /api/prime-contracts/:id/line-items - Get line items
- [ ] POST /api/prime-contracts/:id/line-items - Create line item
- [ ] GET /api/prime-contracts/:id/change-orders - Get change orders
- [ ] POST /api/prime-contracts/:id/change-orders - Create change order
- [ ] GET /api/prime-contracts/:id/billing - Get billing info
- [ ] POST /api/prime-contracts/:id/billing - Create billing period
- [ ] GET /api/prime-contracts/:id/documents - List documents
- [ ] POST /api/prime-contracts/:id/documents - Upload document

**Acceptance Criteria:** All API endpoints work with proper validation

---

### 2.2 Change Orders API

**Description:** Endpoints for change order management

**Subtasks:**

- [ ] GET /api/change-orders - List all change orders
- [ ] GET /api/change-orders/:id - Get change order details
- [ ] POST /api/change-orders/:id/approve - Approve change order
- [ ] POST /api/change-orders/:id/reject - Reject change order
- [ ] GET /api/change-orders/:id/history - Get approval history

**Acceptance Criteria:** Change order API complete

---

## 3. UI Components

**Priority:** P0 - Critical

### 3.1 Build Prime Contracts Table Component

**Description:** Create a data table for displaying prime contracts

**Subtasks:**

- [ ] Implement sortable columns
- [ ] Add filtering capability
- [ ] Support inline editing
- [ ] Add row selection
- [ ] Implement pagination for large datasets
- [ ] Add column resizing
- [ ] Support frozen columns
- [ ] Add totals/summary row
- [ ] Implement grouping by vendor/status

**Acceptance Criteria:** Contract table displays with all interactive features

---

### 3.2 Create Contract Actions Toolbar

**Description:** Implement action buttons for contract operations

**Subtasks:**

- [ ] Add "SearchCmdK" button functionality
- [ ] Add "More" button functionality
- [ ] Add "Learn More" button functionality
- [ ] Add "Create" button functionality
- [ ] Add "General Information" button functionality
- [ ] Add "Contract Summary" button functionality
- [ ] Add "Schedule of Values" button functionality
- [ ] Add "Inclusions & Exclusions" button functionality
- [ ] Add "Contract Dates" button functionality
- [ ] Add "Contract Privacy" button functionality
- [ ] Add "Export" button functionality
- [ ] Add "Edit Contract" button functionality
- [ ] Add "Edit" button functionality
- [ ] Add "Open Fullscreen" button functionality
- [ ] Add "Add Group" button functionality

**Acceptance Criteria:** All discovered buttons are implemented

---

### 3.3 Build Contract Detail View

**Description:** Detailed view for individual contracts

**Subtasks:**

- [ ] Create contract header with key details
- [ ] Add tabbed interface (Details, Line Items, Change Orders, Billing, Documents)
- [ ] Implement contract status workflow
- [ ] Add edit mode for contract fields
- [ ] Support contract attachments
- [ ] Show contract history timeline

**Acceptance Criteria:** Users can view and edit full contract details

---

### 3.4 Implement Filter and Search Controls

**Description:** Allow users to filter and search contracts

**Subtasks:**

- [ ] Add "Add Filter" dropdown
- [ ] Support filtering by status, vendor, date range
- [ ] Implement quick search by contract number/title
- [ ] Support advanced search with multiple criteria
- [ ] Save filter preferences per user
- [ ] Add "Clear Filters" button

**Acceptance Criteria:** Contract data can be filtered and searched

---

## 4. CRUD Operations

**Priority:** P0 - Critical

### 4.1 Create Prime Contracts

**Description:** Allow users to create new prime contracts

**Subtasks:**

- [ ] Build "Create Contract" form with all required fields
- [ ] Support contract template selection
- [ ] Validate required fields
- [ ] Auto-generate contract numbers
- [ ] Support document upload
- [ ] Add to database and refresh table

**Acceptance Criteria:** Users can create contracts manually or from templates

---

### 4.2 Update Prime Contracts

**Description:** Allow editing of contract information

**Subtasks:**

- [ ] Enable field editing in detail view
- [ ] Validate contract data
- [ ] Auto-save changes
- [ ] Show saving indicator
- [ ] Track change history
- [ ] Support version control

**Acceptance Criteria:** Contracts can be edited with validation

---

### 4.3 Delete Prime Contracts

**Description:** Allow removal of contracts

**Subtasks:**

- [ ] Add delete action with confirmation
- [ ] Show confirmation dialog
- [ ] Soft delete vs hard delete
- [ ] Handle related records (line items, change orders)
- [ ] Log deletion in audit trail

**Acceptance Criteria:** Contracts can be safely deleted

---

### 4.4 Read/List Contract Data

**Description:** Fetch and display contract information

**Subtasks:**

- [ ] Create API endpoint for contract list
- [ ] Support pagination for large datasets
- [ ] Implement search functionality
- [ ] Add sorting by any column
- [ ] Cache frequently accessed data
- [ ] Optimize query performance

**Acceptance Criteria:** Contract data loads quickly with filtering/sorting

---

## 5. Change Orders

**Priority:** P1 - High

### 5.1 Implement Change Order Management

**Description:** Track and manage contract change orders

**Subtasks:**

- [ ] Create change order form
- [ ] Support change order approval workflow
- [ ] Calculate impact on contract value
- [ ] Track change order status
- [ ] Link change orders to budget impacts
- [ ] Generate change order documents
- [ ] Notify stakeholders of changes

**Acceptance Criteria:** Change orders can be created and tracked

---

### 5.2 Change Order Approval Workflow

**Description:** Multi-step approval process for change orders

**Subtasks:**

- [ ] Define approval roles and permissions
- [ ] Implement approval routing
- [ ] Support approval comments
- [ ] Track approval history
- [ ] Send notifications at each stage
- [ ] Support bulk approvals

**Acceptance Criteria:** Change orders follow defined approval process

---

## 6. Billing & Payments

**Priority:** P1 - High

### 6.1 Implement Billing Periods

**Description:** Track billing schedules and periods

**Subtasks:**

- [ ] Create billing period configuration
- [ ] Support multiple billing schedules
- [ ] Track billed vs unbilled amounts
- [ ] Generate billing summaries
- [ ] Link to payment applications
- [ ] Calculate retention amounts

**Acceptance Criteria:** Billing periods are properly tracked

---

### 6.2 Payment Application Management

**Description:** Manage payment applications and invoices

**Subtasks:**

- [ ] Create payment application form
- [ ] Calculate amounts due
- [ ] Track payment status
- [ ] Support payment approvals
- [ ] Generate payment reports
- [ ] Link to accounting system

**Acceptance Criteria:** Payment applications can be created and tracked

---

### 6.3 Retention Tracking

**Description:** Track retention amounts and releases

**Subtasks:**

- [ ] Configure retention percentages
- [ ] Calculate retention withheld
- [ ] Track retention releases
- [ ] Generate retention reports
- [ ] Support partial retention release

**Acceptance Criteria:** Retention is properly calculated and tracked

---

## 7. Calculations & Formulas

**Priority:** P1 - High

### 7.1 Implement Contract Calculations

**Description:** Auto-calculate contract values

**Subtasks:**

- [ ] Calculate: Original Contract Value
- [ ] Calculate: Approved Change Orders Total
- [ ] Calculate: Revised Contract Value = Original + Approved COs
- [ ] Calculate: Pending Change Orders Total
- [ ] Calculate: Billed to Date
- [ ] Calculate: Remaining Contract Value
- [ ] Calculate: Retention Withheld
- [ ] Calculate: Percent Complete
- [ ] Auto-update all totals on changes

**Acceptance Criteria:** All contract calculations work correctly

---

### 7.2 Billing Calculations

**Description:** Calculate billing amounts

**Subtasks:**

- [ ] Calculate current period billing amount
- [ ] Calculate retention percentage
- [ ] Calculate materials stored
- [ ] Calculate previous billings
- [ ] Calculate total earned to date
- [ ] Calculate balance to finish

**Acceptance Criteria:** Billing calculations are accurate

---

## 8. Document Management

**Priority:** P2 - Medium

### 8.1 Contract Document Storage

**Description:** Store and manage contract-related documents

**Subtasks:**

- [ ] Integrate with Supabase Storage
- [ ] Support document upload
- [ ] Categorize documents by type
- [ ] Version control for documents
- [ ] Document access permissions
- [ ] Full-text search in documents

**Acceptance Criteria:** Contract documents are securely stored and accessible

---

### 8.2 Document Generation

**Description:** Auto-generate contract documents

**Subtasks:**

- [ ] Create contract PDF templates
- [ ] Generate change order PDFs
- [ ] Generate payment application PDFs
- [ ] Support custom templates
- [ ] Include digital signatures

**Acceptance Criteria:** Contract documents can be auto-generated

---

## 9. Integrations

**Priority:** P2 - Medium

### 9.1 Budget Integration

**Description:** Link prime contracts to budget

**Subtasks:**

- [ ] Connect contracts to budget line items
- [ ] Track contract value vs budget
- [ ] Update budget on contract changes
- [ ] Show contract commitments in budget
- [ ] Sync change orders to budget modifications

**Acceptance Criteria:** Contracts are linked to budget system

---

### 9.2 Accounting System Integration

**Description:** Sync with accounting/ERP systems

**Subtasks:**

- [ ] Export contract data to QuickBooks/Sage
- [ ] Sync payment applications
- [ ] Map contract accounts
- [ ] Handle sync conflicts
- [ ] Schedule automatic syncs

**Acceptance Criteria:** Contracts sync with accounting system

---

## 10. Permissions & Security

**Priority:** P1 - High

### 10.1 Implement Contract Permissions

**Description:** Role-based access control for contracts

**Subtasks:**

- [ ] Define permission levels (View, Edit, Admin, Approve)
- [ ] Check permissions before any operation
- [ ] Support project-level permissions
- [ ] Support company-level permissions
- [ ] Hide/disable UI based on permissions
- [ ] Log permission violations

**Acceptance Criteria:** Contract access is properly controlled

---

### 10.2 Field-Level Security

**Description:** Control access to specific contract fields

**Subtasks:**

- [ ] Mark sensitive fields (e.g., Contract Value)
- [ ] Hide fields based on user role
- [ ] Support read-only fields
- [ ] Audit access to sensitive data

**Acceptance Criteria:** Sensitive contract data is protected

---

## 11. Testing & Quality

**Priority:** P0 - Critical

### 11.1 Unit Tests

**Description:** Test individual functions

**Subtasks:**

- [ ] Test contract calculations
- [ ] Test data validation
- [ ] Test permission checks
- [ ] Test workflow logic
- [ ] Achieve 80%+ code coverage

**Acceptance Criteria:** All unit tests pass

---

### 11.2 Integration Tests

**Description:** Test component interactions

**Subtasks:**

- [ ] Test CRUD operations end-to-end
- [ ] Test change order workflow
- [ ] Test billing workflow
- [ ] Test document management
- [ ] Test budget integration

**Acceptance Criteria:** All integration tests pass

---

### 11.3 E2E Tests with Playwright

**Description:** Test complete user workflows

**Subtasks:**

- [ ] Test contract creation workflow
- [ ] Test contract editing workflow
- [ ] Test change order workflow
- [ ] Test billing workflow
- [ ] Test approval workflows
- [ ] Visual regression testing

**Acceptance Criteria:** All E2E tests pass consistently

---

## Appendix A: Discovered Features

### Table Columns Found (24)

- Number of Prime Contract Change Order Tiers:
- Allow Standard Level Users to Create PCCOs:
- Allow Standard Level Users to Create CORs:
- Allow Standard Level Users to Create PCOs:
- Enable Always Editable Schedule of Values:
- Show Financial Markup Application Criteria on Change Order PDF exports:
                
                Details include cost codes and cost types specified in the financial markup.
- Show Financial Markup on Invoice PDF and CSV:
- Prime Contract:
- Prime Contract Change Order:
- Prime Contract Change Order Request:
- Prime Contract Potential Change Order:
- Name:
- Description:
- Task
- None
- Read Only
- Standard
- Admin
- Name
- Last Activity
- Members
- Owner
- Sort Name
- Sort Description

### Buttons Found (82)

- SearchCmdK
- More
- Learn More
- Create
- General Information
- Contract Summary
- Schedule of Values
- Inclusions & Exclusions
- Contract Dates
- Contract Privacy
- Export
- Edit Contract
- Edit
- Open Fullscreen
- Add Group
- 01-3120.LVice President.Labor
- 01-3128.LProject Manager.Labor
- 01-3130.LProject Engineer.Labor
- 01-3132.LIntern.Labor
- 01-4523.XTesting and Inspections.Expense
- 01-6113.XSoftware Licensing.Expense
- 05-4100.MStructural Metal Stud Framing.Material
- 05-5100.MMetal Stairs.Material
- 55-0500.XContractor Fee.Expense
- Add Line
- Import
- Exit Beta
- Provide Feedback
- Update
- +
- Minimize Sidebar
- Select company
- Draft
- To open the popup, press Shift+Enter
- 12pt
- Attach Files
- Change to Unit/Quantity
- Cancel
- Attach
- Menu
- What do you need help with?
- Resources
- United States
- Table of Contents
- About Procore
- Downloads
- Deem, LLC (procore_edge_for_acumatica_id - DEEM)
- Approved
- Alleato Group
- Save

### Dropdowns Found (48)

- More
- Create
- Export
- Import
- To open the popup, press Shift+Enter
- 12pt
- Menu
- What do you need help with?       Product Manuals
- What do you need help with?
- Product Manuals    Process Guides       Resources
- Resources               Certifications        Get
- Resources
- Certifications
- Training Video Library
- Permissions Matrix
- Glossary of Terms
- System Status        View the status of the app
- System Status
- Community
- Product Updates
- Developers
- United States               Australia (English)
- United States
- Australia (English)          Brasil (Português)
- Australia (English)
- Brasil (Português)
- Canada (English)
- Canada (Français)
- Deutschland (Deutsch)
- España (Español)
- France (Français)
- Latinoamérica (Español)
- Polska (Polski)
- United Kingdom (English)
- United States (English)
- 新加坡 (中文)
- 日本 (日本語)
- Filter Icon
- Home
- Forums
- Groups
- Meetups & Events
- Support
- Account Management
- RelevanceSorted by Relevance
- x
- Visit our support site.
- Get the Atom Feed or RSS Feed.

### Form Fields Found (35)

- e.g. The name of a funding source
- e.g. A description of a funding source
- Enter contract number
- Enter title
- Select Values
- Allow these non-admin users to view the SOV items.
- Light Theme             Dark Mode Light Mode
- Search...
- Performance Cookies
- Functional Cookies
- Targeting Cookies
- Search…
- checkbox label
- Search
- Search Product Manuals
- Company Level
- Project Level
- Web
- Android
- iOS
- Integration
- Search Release Notes
- Year to Date
- Last 30 Days
- Last 60 Days
- Custom Date Range
- From:
- To:
- Find answers, groups, ideas, articles, and best practices
- Email address:
- Enter OTP:
- Country code:
- Phone number:
- Search Video Titles
- Mobile

## Appendix B: Suggested Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Database Schema
- API Development
- Basic CRUD Operations
- Authentication/Permissions

### Phase 2: Core Features (Weeks 3-4)
- Contract Table UI
- Contract Detail View
- Line Items Management
- Basic Calculations

### Phase 3: Advanced Features (Weeks 5-6)
- Change Order Management
- Billing & Payments
- Document Management
- Budget Integration

### Phase 4: Polish & Testing (Week 7-8)
- E2E Testing
- Performance Optimization
- UI/UX Refinements
- Documentation

### Phase 5: Integrations (Week 9+)
- Accounting Integration
- Advanced Workflows
- Reporting & Analytics
