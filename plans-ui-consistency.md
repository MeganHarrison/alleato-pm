# UI Consistency Enforcement Plan (ComponentSystemConsistencySubagent)

## Purpose and Mandate
This plan operationalizes **plans-ui-consistency** scope to ensure every Alleato OS screen renders through the shared component system, eliminating bespoke styling and behavior drift. It enables autonomous execution: run audits, refactor layouts/tables/forms to approved primitives, enforce tokens, and prove compliance through Playwright + visual regression evidence.

## Inputs and Ground Rules
- Canonical components: `frontend/src/components/layout/*`, `frontend/src/components/design-system/*`, `frontend/src/components/ui/*`, `frontend/src/components/tables/**`, `frontend/src/components/table-page/**`, `frontend/src/components/forms/**`, typography/tokens in `frontend/src/app/globals.css` and `frontend/tailwind.config.ts`.
- Acceptance reference: `PLANS_DOC.md` (Phase 0 + Phase 4), `frontend/src/components/tables/README-EDITING.md` for editable tables.
- Evidence harness: `frontend/tests/e2e/**`, `frontend/tests/visual-regression/**`, `frontend/tests/screenshots/**`.
- Backlog logging: record every violation and remediation plan in `PLANS_DOC.md` Progress Log (tag with `layout`, `table`, `form`, `token`).

## Current Findings (from charter)
- Landing page at `/` currently bypasses card/layout primitives (Playwright probe: `H1: Portfolio`, `Card count: 0`).
- Need systemic audit to catch inline styles, raw tables, arbitrary Tailwind values, and hard-coded colors.

## Workstreams and Sequencing
1) **Repository Audit and Backlog Creation**
   - Commands (run from repo root):
     - `rg -n "style={{" frontend/src/app frontend/src/components`
     - `rg -n "<table" frontend/src/app`
     - `rg -n "#[0-9a-fA-F]{6}" frontend/src/app frontend/src/components`
     - `rg -n "className=\"[^"]*(grid-cols-[0-9])" frontend/src/app`
   - For each hit: document route/component, describe gap vs shared system, tag type, add remediation owner/ETA in `PLANS_DOC.md`.
   - Capture screenshots of key offenders (`npx playwright screenshot --full-page <route> frontend/tests/screenshots/ui-consistency/<route>-before.png`).

2) **Layout Compliance Refactors**
   - Enforce `AppShell` → `PageContainer` → `PageHeader` (or `ProjectPageHeader`), with `PageToolbar`/`PageTabs` slots as needed.
   - Replace bespoke wrappers/hero blocks with design-system headers and breadcrumb props (coordinate with BreadcrumbExperienceSubagent & PageTitleComplianceSubagent when present).
   - Normalize action rows to `PageToolbar` / responsive variants; remove duplicate flex scaffolding.

3) **Table Standardization**
   - Migrate custom grids to `DataTablePage`, `GenericDataTable`, or `generic-table-factory.tsx` with module-scoped configs (e.g., `frontend/src/config/<module>/tables.ts`).
   - Use shared toolbars (`DataTableToolbar`, `DataTableFilters`, `DataTableBulkActions`, `DataTablePagination`, `MobileFilterModal`).
   - For editable flows, define `editConfig` per `README-EDITING.md`; route saves through `/api/table-update`.

4) **Form + Sidebar Patterns**
   - Convert forms to `forms/Form.tsx` with typed fields (`TextField`, `MoneyField`, `SelectField`, etc.) and Zod validation.
   - Align sidebars/modals with budget modal patterns (`budget-line-item-modal.tsx`) or `components/ui/sheet`; remove ad-hoc validation.

5) **Visual Token and Typography Enforcement**
   - Replace raw hex/inline styles with tokens (`text-procore-orange`, `bg-card`, `var(--font-sans)`, `var(--radius)`) defined in globals/tailwind.
   - Use design-system stat cards, section headers, and content cards instead of ad-hoc Tailwind stacks.

6) **Documentation and Evidence Loop**
   - Update `PLANS_DOC.md` Progress/Decision/Surprises after each module.
   - Capture after-state screenshots under `frontend/tests/screenshots/ui-consistency/` using `npx playwright screenshot --full-page <route> ...`.
   - Add helper component notes to relevant READMEs; include new filter/table configs in docs.

7) **Testing and Gates**
   - Extend/maintain `frontend/tests/e2e/ui-consistency.spec.ts` to assert presence of shared selectors on key routes (Portfolio, project budget, meetings tables) and save screenshots.
   - Add visual regression expectations under `frontend/tests/visual-regression/` (`await expect(page).toHaveScreenshot('ui-consistency/<module>.png')`).
   - Run automation from `frontend/`: `npm run lint`, `npm run typecheck`, `npx playwright test tests/e2e/ui-consistency.spec.ts --config=config/playwright/playwright.config.ts --project=chromium`.

## Milestones and Ownership Cadence
- **M1: Audit Complete + Backlog Logged** (baseline screenshots captured, `PLANS_DOC.md` updated).
- **M2: Layout Compliance** for landing + top traffic routes.
- **M3: Table Conversions** for all raw tables; editing flows validated.
- **M4: Form + Token Cleanup** removing inline styles/arbitrary values.
- **M5: Test Hardening** (E2E + visual regression updated), docs refreshed.
- Maintain weekly sweep to rerun audits and append new backlog entries.

## Definition of Done
- No inline `style={{...}}`, raw `<table>`, or hard-coded hex colors in app/components unless explicitly documented with rationale.
- Every page wrapped with layout primitives; tables/forms use shared factories; tokens/typography compliant.
- Playwright + visual regression suites green with updated screenshots; `PLANS_DOC.md` logs reflect completed modules and surprises.
