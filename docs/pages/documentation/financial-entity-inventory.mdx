# Financial Entity Inventory

This document maps all financial-related UI pages/forms from Procore to their underlying entities, fields, and relationships based on captured DOM and screenshot evidence.

## Evidence Sources
- **DOM Captures**: `scripts/procore-screenshot-capture/outputs/dom/`
- **Screenshots**: `scripts/procore-screenshot-capture/outputs/screenshots/`
- **Analysis**: `scripts/procore-screenshot-capture/outputs/analysis/`
- **Reports**: `scripts/procore-screenshot-capture/outputs/reports/`

Last Updated: 2025-12-08

## Module: Budget

### Evidence Files
- DOM: `outputs/dom/goodwill_bart_-_budget.html`
- Screenshot: `outputs/screenshots/goodwill_bart_-_budget.png`
- Analysis: `outputs/analysis/goodwill_bart_-_budget.json`

### Observed UI Elements
1. **Budget Table Headers**:
   - Calculation Method
   - Unit Qty
   - UOM (Unit of Measure)
   - Unit Cost
   - Original Budget

2. **Actions Available**:
   - Create
   - Resend to ERP
   - Unlock Budget
   - Export
   - Analyze Variance

### Entities Identified

#### budgets
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| project_id | uuid | Context | Foreign key to projects |
| file_name | varchar | Analysis JSON | From captured data |
| title | varchar | Analysis JSON | "Budget" |
| status | enum | Action buttons | locked/unlocked based on "Unlock Budget" action |
| erp_sync_status | enum | Action buttons | Based on "Resend to ERP" |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |
| created_by | uuid | - | Foreign key to users |

#### budget_line_items
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| budget_id | uuid | - | Foreign key to budgets |
| cost_code_id | uuid | - | Foreign key to cost_codes |
| calculation_method | varchar | Table header | How item is calculated |
| unit_qty | decimal | Table header | Quantity |
| uom | varchar | Table header | Unit of measure |
| unit_cost | money | Table header | Cost per unit |
| original_budget | money | Table header | Original budget amount |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |

### Enumerations
- **budget_status**: locked, unlocked
- **erp_sync_status**: pending, synced, failed, resyncing
- **calculation_method**: unit_price, lump_sum, percentage

---

## Module: Commitments

### Evidence Files
- DOM: `outputs/dom/goodwill_bart_-_commitments.html`
- Screenshot: `outputs/screenshots/goodwill_bart_-_commitments.png`
- Analysis: `outputs/analysis/goodwill_bart_-_commitments.json`

### Observed UI Elements
1. **Table Headers**:
   - Number
   - Contract Date
   - Title
   - Company
   - Status
   - Revised Commitment
   - Contract Billings
   - Remaining Balance

2. **Actions Available**:
   - Create
   - Email
   - Import
   - Export

### Entities Identified

#### commitments
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| project_id | uuid | Context | Foreign key to projects |
| number | varchar | Table header | Contract number |
| contract_date | date | Table header | Date of contract |
| title | varchar | Table header | Contract title |
| company_id | uuid | Table header | Foreign key to companies/vendors |
| status | enum | Table header | Contract status |
| original_amount | money | - | Original contract value |
| revised_amount | money | Table header | "Revised Commitment" |
| billed_amount | money | Table header | "Contract Billings" |
| remaining_balance | money | Table header | Calculated field |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |
| created_by | uuid | - | Foreign key to users |

#### commitment_line_items
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| commitment_id | uuid | - | Foreign key to commitments |
| cost_code_id | uuid | - | Foreign key to cost_codes |
| description | text | - | Line item description |
| amount | money | - | Line item amount |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |

### Enumerations
- **commitment_status**: draft, pending, approved, closed, void

---

## Module: Prime Contracts

### Evidence Files
- DOM: `outputs/dom/goodwill_bart_-_prime_contracts.html`
- Screenshot: `outputs/screenshots/goodwill_bart_-_prime_contracts.png`
- Analysis: `outputs/analysis/goodwill_bart_-_prime_contracts.json`

### Observed UI Elements
1. **Table Headers**:
   - Number
   - Title
   - Owner
   - Architect
   - Contract Date
   - Status
   - Original Contract Amount
   - Approved Change Orders
   - Revised Contract Amount
   - Pending Change Orders
   - Projected Revenue
   - Invoices Issued
   - % Invoiced
   - Remaining to Invoice

2. **Actions Available**:
   - Edit
   - Export
   - Send to ERP
   - Email

### Entities Identified

#### prime_contracts
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| project_id | uuid | Context | Foreign key to projects |
| number | varchar | Table header | Contract number |
| title | varchar | Table header | Contract title |
| owner_id | uuid | Table header | Foreign key to companies |
| architect_id | uuid | Table header | Foreign key to companies |
| contract_date | date | Table header | Date of contract |
| status | enum | Table header | Contract status |
| original_amount | money | Table header | Original contract value |
| approved_changes | money | Table header | Sum of approved COs |
| revised_amount | money | Table header | Calculated: original + approved |
| pending_changes | money | Table header | Sum of pending COs |
| projected_revenue | money | Table header | Calculated field |
| invoiced_amount | money | Table header | "Invoices Issued" |
| percent_invoiced | decimal | Table header | Calculated percentage |
| remaining_to_invoice | money | Table header | Calculated field |
| erp_sync_status | enum | Action buttons | Based on "Send to ERP" |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |
| created_by | uuid | - | Foreign key to users |

### Enumerations
- **prime_contract_status**: draft, executed, closed, terminated

---

## Module: Change Orders

### Evidence Files
- Based on references in Prime Contracts and Commitments pages
- Inferred from "Approved Change Orders" and "Pending Change Orders" columns

### Entities Identified (Inferred)

#### change_events
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| project_id | uuid | Context | Foreign key to projects |
| number | varchar | - | Event number |
| title | varchar | - | Event title |
| description | text | - | Detailed description |
| status | enum | - | Event status |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |
| created_by | uuid | - | Foreign key to users |

#### change_orders
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| project_id | uuid | Context | Foreign key to projects |
| change_event_id | uuid | - | Foreign key to change_events |
| contract_id | uuid | - | Foreign key to prime_contracts or commitments |
| contract_type | enum | - | prime_contract or commitment |
| number | varchar | - | CO number |
| title | varchar | - | CO title |
| status | enum | Inferred | draft, pending, approved, void |
| amount | money | - | Change order amount |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |
| created_by | uuid | - | Foreign key to users |

### Enumerations
- **change_event_status**: open, closed
- **change_order_status**: draft, pending, approved, void
- **contract_type**: prime_contract, commitment

---

## Cross-Module Entities

### cost_codes
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| project_id | uuid | - | Foreign key to projects |
| code | varchar | - | Cost code (e.g., "01-100") |
| description | varchar | - | Code description |
| parent_id | uuid | - | Self-reference for hierarchy |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |

### companies (vendors)
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| name | varchar | Commitments table | Company name |
| type | enum | - | vendor, subcontractor, owner, architect |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |

### projects
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| name | varchar | Context | Project name |
| number | varchar | Context | Project number |
| status | enum | - | active, inactive, complete |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |

### users
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | uuid | - | Primary key |
| email | varchar | - | User email |
| name | varchar | - | User full name |
| created_at | timestamp | - | Audit field |
| updated_at | timestamp | - | Audit field |

---

## Missing Evidence (To Capture)

Based on the financial modules list, we're missing evidence for:
1. **Billing & Invoicing** - Need to capture invoice creation/management screens
2. **Direct Costs** - Need to capture cost tracking screens
3. **Financial Reports** - Budget variance, cost projections
4. **Change Order Details** - Need modal/form captures for creating change orders
5. **Budget Creation/Edit Forms** - Need to capture the "Create" action modal
6. **Commitment Creation/Edit Forms** - Need to capture the "Create" action modal

## Next Steps
1. Run targeted captures for missing modules
2. Analyze form validation rules from DOM
3. Extract dropdown options for enumerations
4. Map workflows between modules