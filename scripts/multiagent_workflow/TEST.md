# TEST PLAN – Procore Financial Suite Planning

## Designer

- [Designer] Verify every financial page/form listed in initiate_project.md has an evidence reference (DOM + screenshot path) documented in `planning/financial-entity-inventory.md`.
  - Acceptance: For each page (e.g., Budget, Change Events, Billing Period), the inventory file shows the evidence file path, discovered fields, and linked schema entities. Spot check at least three entries by opening the referenced DOM files and confirming the annotated fields exist.

## Frontend

- [Frontend] Confirm UI requirements for tables/forms can be satisfied with the documented schema contracts.
  - Acceptance: For each planned page (Budget table, Create Change Event form, Create Commitment form, Billing Period wizard, etc.), list the API fields consumed/produced and ensure the schema contains matching columns/types. Open `planning/page-schema-traceability.md` and make sure each UI component references exact tables/views; note any missing fields back to PM.

## Backend

- [Backend] Execute Supabase migrations locally and run representative workflows to prove referential integrity.
  - Command: `cd scripts/procore-screenshot-capture && npx supabase db reset && npx supabase db seed` (after seeds exist).
  - Acceptance: Insert sample data covering budgets → commitments → change events → change orders → billing periods → invoices. Run SQL queries:
    - `SELECT * FROM budget_summary_view WHERE project_id = '<sample_project>';`
    - `SELECT * FROM committed_costs_view WHERE project_id = '<sample_project>';`
    - `SELECT * FROM invoices WHERE status = 'submitted';`
    Results must align with manual calculations performed from inserted records (e.g., committed totals equal sum of commitment items plus executed change orders).

## Tester

- [Tester] Validate derived documents and agent handoffs exist.
  - Acceptance: Ensure `EXEC_PLAN.md`, `REQUIREMENTS.md`, `AGENT_TASKS.md`, and `TEST.md` reside in `scripts/multiagent_workflow/`. Confirm `pm_execute.py` preflight checks pass by running `.venv/bin/python scripts/multiagent_workflow/pm_execute.py` (only after planning artifacts finalize) and observing that the missing-file RuntimeError no longer triggers.
- [Tester] Cross-check mapping fidelity.
  - Acceptance: Randomly choose two UI pages (e.g., Change Orders – Commitments, Direct Costs) and trace from `planning/page-schema-traceability.md` to the Supabase schema definitions. Validate the documented columns and relationships by querying the database; discrepancies must be reported back to PM before execution proceeds.
