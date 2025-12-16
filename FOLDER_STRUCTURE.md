# Repository Folder Structure Guide

Use this guide to keep new code, assets, and generated artifacts organized. The layout matches our current project shape and the expectations documented in CLAUDE.md and PLANS.md.

## High-level layout

```
root /
  frontend/                # Next.js 15 app, UI components, hooks, lib utilities, Supabase client code
    src/
      app/
      components/
      lib/
      hooks/
      types/               # Canonical Supabase types (database.ts) and shared app types
    tests/                 # All Playwright/Jest assets and reports
      e2e/
      visual-regression/
      screenshots/         # ONLY location for captured screenshots
      playwright-report/
    public/
    supabase/
    scripts/

  backend/                 # Python services and API workers
    src/
      api/
      services/
      workers/
      types/
    tests/
      unit/
      integration/
    scripts/

  supabase/                # Supabase migrations and metadata
  migrations/              # Project-level SQL migrations
  scripts/                 # Repo-wide automation (ingestion, tooling, dev helpers)
  docs/                    # Project documentation and reference material
  .github/                 # CI workflows
```

## Placement rules

- **Supabase types**: Generate and import the TypeScript schema from `frontend/src/types/database.ts` via `@/types/database.types`. Do not add additional copies elsewhere.
- **Screenshots & Playwright artifacts**: Keep all screenshots under `frontend/tests/screenshots/`. Do not create parallel `tests/screenshots` folders in other locations.
- **Frontend code**: New React components belong in `frontend/src/components`, domain-specific widgets under `frontend/src/components/domain/<module>`, and shared utilities under `frontend/src/lib`.
- **Backend code**: Place API routes under `backend/src/api`, shared business logic under `backend/src/services`, workers under `backend/src/workers`, and types in `backend/src/types`.
- **Scripts**: Repo-wide tooling lives in `scripts/`. Frontend-only scripts belong in `frontend/scripts/`; backend-specific scripts live in `backend/scripts/`.
- **Docs**: Add architectural or process guidance under `docs/` and reference it from README/CLAUDE when relevant.
- **Root cleanliness**: Avoid adding new top-level folders unless agreed. Do not create ad-hoc `source/`, `src/`, or duplicate `frontend/` directories at the root.

Keeping to this structure prevents scattered files, makes imports predictable, and aligns with our CI/test expectations.
