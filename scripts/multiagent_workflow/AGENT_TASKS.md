# Agent Tasks – Procore Financial Suite Planning

Project Name: **Procore Financial Suite – Evidence-Grounded Schema**

## Designer

- **Deliverables**
  - `/design/design_spec.md` – visual/UX summary for the financial modules (tables + forms) described in EXEC_PLAN.
  - `/design/wireframe.md` – ASCII or structured wireframes covering:
    - Budget overview
    - Change Event + Change Order funnel
    - Billing Period + Invoice creation flow
    - Contract dashboards (Prime + Commitments)
- **Key Notes**
  - Treat `scripts/procore-screenshot-capture/outputs/screenshots/**` as authoritative styling evidence. Reference at least one screenshot per module.
  - Document how each UI surface exposes schema entities (e.g., which columns from `budget_summary_view` appear in the table, how change order cascades are presented).
  - Keep designs implementation-ready; no branding beyond what evidence shows.

## Frontend Developer

- **Deliverables**
  - Build/update pages under `frontend/app/(forms)/` and `(tables)/` matching the modules in AGENT_TASKS:
    - `create-project` already exists; extend with financial sections referencing new schema.
    - New forms: `create-change-event`, `create-commitment`, `create-direct-cost`, `create-billing-period`, `create-prime-contract`.
    - Table pages: `budgets`, `change-events`, `change-orders`, `commitments`, `direct-costs`, `invoicing`, `prime-contracts`.
  - Shared components for schema-driven tables (e.g., cost code selector, vendor picker) under `frontend/components/financial`.
- **Key Notes**
  - Data contracts must align with Supabase schema defined in EXEC_PLAN → `planning/financial-schema.md`.
  - Use `@/lib/supabase/client` (already in repo) for data fetching/mutations.
  - Respect Designer wireframes for DOM structure and states; annotate components with evidence references where tricky behaviors occur (e.g., status badges).
  - Implement placeholder data mocking if backend not ready but keep interfaces identical to real schema.

## Backend Developer

- **Deliverables**
  - Supabase migrations: add `002_financial_enums.sql` through `007_financial_views.sql` (or next numeric index) in `scripts/procore-screenshot-capture/supabase/migrations`.
  - Seed scripts demonstrating full financial workflows (`supabase/seed/financial.sql`).
  - Next.js route handlers or API modules (if applicable) for CRUD operations on budgets, contracts, change events/orders, billing, and direct costs.
- **Key Notes**
  - Follow ExecPlan’s entity definitions and ensure every table has audit fields, FK constraints, indexes, and project scoping.
  - Derived views must reproduce UI calculations (budget summaries, committed cost totals, variance forecasts). Provide SQL comments explaining formulas.
  - Provide documented commands for running migrations locally (`npx supabase db reset`) and verifying views.
  - Coordinate with Frontend to expose endpoints that match planned data contracts; prefer typed responses and error handling aligning with Supabase policies.

## Tester

- **Deliverables**
  - `/tests/TEST_PLAN.md` – scenario list covering schema validation, API coverage, and UI smoke tests.
  - `/tests/test.sh` (optional if automation feasible) to execute Supabase migrate/reset plus backend/unit checks.
- **Key Notes**
  - Validate that planning artifacts exist and remain synchronized (`EXEC_PLAN.md`, `REQUIREMENTS.md`, `TEST.md`, `AGENT_TASKS.md`, schema docs under `planning/`).
  - After backend migrations run, execute sample workflows verifying referential integrity and derived views (see TEST.md instructions).
  - Confirm frontend forms/tables adhere to Designer spec and display data from the schema without missing fields.
  - Log discrepancies as Surprises/Discoveries in EXEC_PLAN and notify PM before sign-off.
