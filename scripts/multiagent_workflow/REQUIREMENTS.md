# Requirements – Procore Financial Suite Schema & Planning

## Product Goals

1. Reconstruct Procore’s financial backend in Supabase so every budgeting, contracting, change management, cost tracking, and billing workflow can be implemented without ambiguity.
2. Anchor all schema decisions in verifiable evidence from `scripts/procore-screenshot-capture` (DOM snapshots, screenshots, sitemap reports) and keep page → schema traceability.
3. Provide downstream Codex agents with a step-by-step plan for deriving migrations, views, UI components, and backend endpoints using the Codex cookbook methodology.

## Target Users

- Construction finance teams rebuilding or extending Procore-like capabilities within this repository. They need to understand database structure, how workflows interconnect, and how to instrument front-end/back-end deliverables from it.

## Key Features & Deliverables

- Fully normalized Supabase schema covering:
  - Budgeting: `budgets`, `budget_line_items`, `budget_revisions`, summary/forecast views.
  - Contracting: `prime_contracts`, `prime_contract_items`, `commitments`, `commitment_items`, vendor references, approval workflows.
  - Change Management: `change_events`, `change_event_items`, `change_orders` (prime + commitment variants), cascading impacts to budgets and contracts.
  - Cost Tracking: `committed_costs_view`, `direct_costs`, integration with change orders and commitments.
  - Billing & Invoicing: `billing_periods`, `invoices`, `invoice_line_items`, payment tracking, status enums.
  - Shared references: `projects`, `cost_codes`, `contacts`, `vendors`, `attachments`, enumerations for statuses/types.
- Derived/reporting views (Budget Summary, Forecast Variance, Committed Cost Reports) with documented SQL logic.
- Migration files (`scripts/procore-screenshot-capture/supabase/migrations/00X_*.sql`) that can be replayed via Supabase CLI.
- Documentation artifacts:
  - `planning/financial-entity-inventory.md` describing evidence-backed entity definitions.
  - `planning/page-schema-traceability.md` linking each UI page/form to schema tables/views.
- Development roadmap covering API endpoints, front-end tables/forms, and designer deliverables aligned with AGENT tasks.
- Tasks for updating capture scripts if evidence gaps are detected, ensuring the schema never drifts from actual UI behavior.

## Constraints & Assumptions

- Schema decisions must cite specific evidence (DOM file path, screenshot, sitemap row). No guessing.
- All tables scoped by `project_id` with multi-tenant safe defaults, audit fields, and consistent naming.
- Supabase migrations must remain idempotent and runnable locally (`npx supabase db reset`) and in CI.
- Enumerations should use Supabase `enum` types to preserve UI dropdown semantics.
- When UI shows derived metrics (e.g., pending change orders hitting forecasts), compute via SQL views, not denormalized columns unless evidence proves persistence.
- Designer/Frontend/Backend/Testers rely exclusively on EXEC_PLAN + derived artifacts; no tribal knowledge.

## Observable Behaviors & Acceptance

- Running Supabase migrations results in all financial tables/enums/views defined with correct foreign keys and indexes.
- Sample workflow (project → budget → commitment → change event/order → invoice) executes using SQL inserts and all derived views reflect expected totals.
- For every listed financial page/form, an evidence entry maps to schema components (traceability doc kept current).
- Codex multi-agent execution can proceed once this plan, requirements, tests, and agent tasks exist; later scripts must find all referenced files in expected locations.

## Evidence Sources

- `scripts/procore-screenshot-capture/outputs/reports/sitemap-table.md` & `complete-procore-sitemap.md`
- `scripts/procore-screenshot-capture/outputs/dom/**`
- `scripts/procore-screenshot-capture/outputs/screenshots/**`
- `scripts/procore-screenshot-capture/procore-db-schema-notion.md`
- Future crawls executed via `npm run crawl:sitemap`, `npm run capture:supabase`, or custom scripts within the capture package.
