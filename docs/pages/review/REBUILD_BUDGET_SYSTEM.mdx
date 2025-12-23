# TASK: Rebuild Budget System (Supabase + Next.js UI)

You are implementing a Procore-style Project Budget that supports:
- Original Budget
- Budget Modifications (internal transfers/adjustments)
- Change Orders (client-approved COs that affect budget)
- Revised Budget = Original + Net Budget Mods + Approved COs
- Optional: snapshotting, auditing, and rollups

We are deleting the existing budget tables (budget_items, budget_line_items) and rebuilding correctly.

---

## 0) IMPORTANT MODEL DECISIONS (READ FIRST)

### A) One table for all projects (NO per-project tables)
- Use ONE `budget_lines` table with a `project_id` foreign key.
- Rationale: easier querying, reporting, indexing, permissions, and UI.

### B) Budget lines are identified by a “budget code”
A budget line is a unique combo of:
- project_id
- sub_job_id (nullable)
- cost_code_id
- cost_type_id

This is how Procore-style budgets behave: each “cost code + cost type (+ sub job)” is a bucket.

### C) Your unique constraint question
UNIQUE (project_id, cost_code_id, cost_type_id)
- This does NOT prevent multiple rows with the same cost_type_id.
- It prevents multiple rows with the same cost_type_id *within the same project + same cost code*.
- That is correct for a “one bucket per cost code/type” budget.

If you want multiple “lines” under the same cost code/type, then those are not budget buckets—those are “detail lines” (like SOV or breakdown lines). In that case:
- Keep `budget_lines` as the bucket (unique)
- Add `budget_line_details` for multiple sub-lines that roll up.

---

## 1) TABLES REQUIRED (MINIMUM SET)

Assume these already exist (or create if missing):
- projects(id)
- cost_codes(id, code, description, parent_id, etc.)
- cost_types(id, code, name)  // ex: L, M, E, S, X
- sub_jobs(id, project_id, name) optional
- app_users/auth.users for created_by

### 1.1 budget_lines (the main budget grid)
Stores the “bucket” row you see in the budget table.

Columns:
- id uuid PK
- project_id FK (required)
- sub_job_id FK nullable
- cost_code_id FK (required)
- cost_type_id FK (required)
- description nullable (optional override label)
- original_amount numeric default 0
- created_by uuid nullable
- created_at, updated_at

Constraints:
- UNIQUE (project_id, sub_job_id, cost_code_id, cost_type_id)
  - NOTE: because sub_job_id can be null, use a computed “sub_job_key” to enforce uniqueness reliably.

Computed fields (DO NOT store user-editable):
- budget_mod_total (sum of approved budget mods affecting this line)
- approved_co_total (sum of approved CO lines affecting this line)
- revised_budget = original_amount + budget_mod_total + approved_co_total

We will implement these as VIEWs (preferred) or generated columns backed by triggers.
Prefer VIEWs for correctness + simplicity.

### 1.2 budget_modifications + budget_mod_lines
Tracks internal budget moves/adjustments.
- Header table: reason, status, dates
- Lines table: affects specific budget line buckets

budget_modifications:
- id uuid PK
- project_id FK
- number text or bigint (sequence)
- title, reason
- status enum/text: draft | pending | approved | void
- effective_date date
- created_by, created_at, updated_at

budget_mod_lines:
- id uuid PK
- budget_modification_id FK
- project_id FK (denormalized for indexing)
- sub_job_id nullable
- cost_code_id FK
- cost_type_id FK
- amount numeric (can be + or -)
- description

Rules:
- Only APPROVED budget_modifications contribute to budget totals.
- You can support transfers by creating two lines (+ and -) under one modification.

### 1.3 change_orders + change_order_lines
Tracks client-approved COs that increase/decrease the budget.

change_orders:
- id uuid PK
- project_id FK
- number text or bigint (sequence)
- title
- status: draft | pending | approved | rejected | void
- approved_at timestamp nullable
- created_by, created_at, updated_at

change_order_lines:
- id uuid PK
- change_order_id FK
- project_id FK (denormalized)
- sub_job_id nullable
- cost_code_id FK
- cost_type_id FK
- amount numeric (can be + or -)
- description

Rules:
- Only APPROVED change_orders contribute to budget totals.

---

## 2) OPTIONAL TABLES (RECOMMENDED)

### 2.1 budget_line_details (only if you want multiple “rows” under same bucket)
If the business wants multiple breakdown rows per cost code/type, do this:
budget_line_details:
- id uuid PK
- budget_line_id FK
- label/description
- original_amount numeric
- unit_qty, uom, unit_cost, calc_method
- created_at, updated_at

Then:
- budget_lines.original_amount becomes rollup sum(details) OR keep it editable and details optional.
Pick ONE approach and be consistent.

### 2.2 budget_snapshots
To support “Project Status Snapshots” and historical reporting.

budget_snapshots:
- id uuid PK
- project_id
- snapshot_name
- snapshot_at timestamp
- created_by

budget_snapshot_lines:
- snapshot_id FK
- budget_line_id FK
- original_amount
- budget_mod_total
- approved_co_total
- revised_budget
- (plus any cost fields if needed)

---

## 3) SQL IMPLEMENTATION REQUIREMENTS

### 3.1 Delete old tables
Drop in dependency-safe order. Example:
- drop table if exists budget_line_items cascade;
- drop table if exists budget_items cascade;

(Claude: inspect DB for dependent views/fks and drop them too.)

### 3.2 Create core tables with correct types
Important fixes vs the old schemas:
- cost_code_id should be FK typed to cost_codes.id (likely uuid/bigint). DO NOT store as text.
- cost_type should be FK `cost_type_id` (not freeform text).
- Do NOT store computed rollups as user-editable numeric columns that can drift.
- Use consistent `numeric(15,2)` for currency.
- Add updated_at triggers.

### 3.3 Enforcing uniqueness with nullable sub_job_id
Postgres UNIQUE treats NULL as distinct, so multiple rows with NULL sub_job_id can slip through.
Fix:
- Add generated column:
  sub_job_key uuid GENERATED ALWAYS AS (COALESCE(sub_job_id, '00000000-0000-0000-0000-000000000000'::uuid)) STORED
- Then unique constraint:
  UNIQUE (project_id, sub_job_key, cost_code_id, cost_type_id)

### 3.4 Views for budget grid
Create view `v_budget_lines` that returns:
- budget_line fields
- budget_mod_total (sum approved budget_mod_lines)
- approved_co_total (sum approved change_order_lines)
- revised_budget
- (optional) other computed columns used in UI

Also create `v_budget_lines_grouped` (optional) for rollups by:
- division / cost code tier 1/tier 2
- cost_type
- sub_job

---

## 4) FRONTEND REQUIREMENTS (Next.js)

Build the Budget screen like Procore:
- A table grid showing v_budget_lines
- Grouping controls (sub job, cost code tier 1/tier 2, cost type)
- Filters (cost code, cost type, sub job, “missing mapping”)
- Inline editing for:
  - description (optional)
  - original_amount (editable)
  - optionally unit_qty/uom/unit_cost if using details
- “Budget Modifications” page: create header + add lines (+/-)
- “Change Orders” page: create header + add lines, approve workflow
- Snapshot feature (optional): create snapshot and view diffs

Views in UI (like Notion):
1) Table view (default grid)
2) Compact list view
3) Grouped view (collapsible groups)
4) “Variance” view (shows deltas vs snapshot or original)

Data access:
- Use Supabase client
- Read from
