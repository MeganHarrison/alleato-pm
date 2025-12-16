# BreadcrumbExperienceSubagent Charter

## Mission
Deliver a consistent, fully navigable breadcrumb experience that matches the requirements recorded in `docs/pages/BREADCRUMB_UPDATE.md`. This subagent owns every breadcrumb surface (site header, `PageHeader`, mobile overlays) and ensures breadcrumbs always render project names, link to the correct routes, and degrade gracefully on small screens.

## Primary Inputs
- `docs/pages/BREADCRUMB_UPDATE.md` – canonical UX goals and helper usage guidance.
- `frontend/src/lib/breadcrumbs.ts` – helper exports that must stay the single source of truth.
- `frontend/src/components/site-header.tsx` – top-level breadcrumb rendering.
- All files that render `PageHeader` breadcrumbs (search with `rg "breadcrumbs=" frontend/src`).

## Scope of Work
1. **Adopt helpers everywhere** – Replace ad-hoc breadcrumb arrays with the exported helper utilities for every financial, project-management, and admin page.
2. **Clickable breadcrumb items** – Convert breadcrumb segments into `<Link>` elements wherever a destination exists; default to inert spans only for the current page.
3. **Truncation & overflow handling** – Introduce logic for long project names (ellipsis after 32 chars) plus tooltip on hover.
4. **Mobile experience** – Provide a condensed single-line breadcrumb on screens `<768px`, with a tap target that opens the full hierarchy in a sheet/dialog.
5. **Helper enhancements** – Extend `getFinancialBreadcrumbs`, `getProjectManagementBreadcrumbs`, and `getGeneralBreadcrumbs` to support categories listed in the doc’s “Future Enhancements”.
6. **Documentation** – Update `docs/pages/BREADCRUMB_UPDATE.md` with new behavior, mobile notes, and any helper signature changes.

## Implementation Checklist
1. **Inventory & Audit**
   - Run `rg "breadcrumbs=" frontend/src` and log pages still using hard-coded arrays.
   - Note any routes lacking breadcrumbs and add them to the worklist.
2. **Helper Updates**
   - Expand helper return types to include `href`, `label`, optional `icon`, and `isCurrent`.
   - Add `truncateLabel(label: string)` utility shared by header + `PageHeader`.
3. **Site Header Refactor**
   - Swap plain text segments for `BreadcrumbLink` components with truncation.
   - Add mobile-specific rendering (use existing responsive utilities under `frontend/src/components/layout`).
4. **PageHeader Adoption**
   - Update each page to import the relevant helper and pass `breadcrumbs`.
   - Remove duplicated breadcrumb-building logic.
5. **Mobile Drawer**
   - Create a new component at `frontend/src/components/breadcrumbs/breadcrumb-sheet.tsx` for small screens.
6. **Documentation & Evidence**
   - Extend `docs/pages/BREADCRUMB_UPDATE.md` with before/after screenshots (desktop + mobile) saved under `frontend/tests/screenshots/breadcrumbs/`.

## Testing Requirements
- **Playwright**: add `frontend/tests/e2e/breadcrumbs.spec.ts` covering:
  - Desktop navigation (links update URL without full reload).
  - Mobile sheet interaction (open, select ancestor link, close).
  - Truncation tooltip appears for 30+ character project names.
- **Visual Regression**: capture baseline screenshots for both desktop and mobile states.
- **Unit Tests** (preferred but optional when Playwright coverage is exhaustive): add tests for helper utilities in `frontend/src/lib/__tests__/breadcrumbs.test.ts`.

## Acceptance Criteria
- Every breadcrumb segment except the current page is clickable and routes to the expected path.
- Project names show instead of numeric IDs everywhere.
- Layout remains stable with long project names and on mobile viewports.
- Documentation and screenshots prove the behavior.
- All new/updated tests pass via `cd frontend && npm run test:e2e breadcrumbs`.

## Dependencies & Coordination
- Coordinate with the PageTitleComplianceSubagent to ensure helper changes don’t break title hooks.
- Notify ProjectContextResilienceSubagent if breadcrumb parsing requires additional project data.
- Update `EXEC_PLAN.md` progress + decision log after major milestones.
