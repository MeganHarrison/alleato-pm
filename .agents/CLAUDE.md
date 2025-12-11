# CLAUDE.md

## 1. Purpose

This file defines the **single source of truth** for how AI coding agents (Codex, Claude, etc.) will:
- Edit code
- Use Git
- Name files
- Handle TypeScript
- Interact with this repo’s structure

All other instruction files (e.g. `AGENTS.md`, tool prompts) must **defer to and obey this document**.

## Project Overview

Alleato-Procore is a modern alternative to Procore (construction project management software) being built with:
- **Frontend**: Next.js 15 with App Router, Supabase, ShadCN UI, and Tailwind CSS
- **Backend**: Supabase (PostgreSQL with RLS, Auth, Storage)
- **AI System**: Multi-agent workflow using OpenAI Agents SDK and Codex MCP
- **Analysis Tools**: Playwright-based screenshot capture and AI analysis

## PLANS.md

Always read .agents/PLANS.md and Exec_Plan.md

## Rules

### Always test with playwright in the browser before stating a task is complete

### Edit in place; do NOT create duplicate versions of the same file.
   - Do NOT create files with names like:
     - `*_fixed.*`, `*_final.*`, `*_backup.*`, `*_copy.*`
   - When modifying behavior, update the **original file** unless explicitly told otherwise.

### One canonical implementation per module/component.
   - For any function, component, or module there must be exactly **one** authoritative definition.
   - If you refactor into multiple files, you must:
     - Update all imports to use the new structure.
     - Delete or empty the old files as part of the same change.

### No “safety copies” via filenames.
   - Versioning and safety are handled by **Git branches and commits**, not by creating `file_v2.ts`, `file_old.ts`, etc.

### Experiments go in `/experiments` only (optional if you want this)
   - Experimental code goes under `./experiments/` with clear names.
   - Production code paths (`app/`, `components/`, `lib/`, `python-backend/`, etc.) must contain only real, used code.
   - Do not import from `experiments/` in production code.

### Git & Worktree Rules

1. **Use a single working directory by default.**
   - Assume work happens directly in the main repo folder.
   - Do NOT create Git worktrees unless explicitly instructed.

2. **If using branches:**
   - Create feature branches with clear names, e.g. `feature/budget-report-ui`.
   - Keep changes scoped and coherent (UI change, backend change, etc.).

3. **Never create or rely on local file clones instead of branches.**
   - Do not duplicate folders or create “new-copy” directories inside the repo.

### TypeScript & Project Constraints

1. **Types are centralized.**
   - Prefer types from the `/types` directory, Supabase typegen, and shared schemas.
   - Do not define ad-hoc duplicate types if a shared type already exists.

2. **No lazy `any` unless explicitly justified.**
   - Prefer `unknown`, proper interfaces, or inferred types from Zod/schema.
   - If you use `any`, document why in a comment and keep the scope as small as possible.

3. **Respect Next.js / app router conventions.**
   - Follow existing patterns in `app/` for layouts, routes, and server/client components.
   - Don’t introduce a competing pattern unless explicitly instructed.

### File & Folder Conventions

1. **File naming:**
   - Use descriptive names aligned with responsibility (e.g. `useBudgetSummary.ts`, `ProjectList.tsx`).
   - Do not use vague or process-oriented names (`script.ts`, `test-code.ts`, `temp.ts`).

2. **When refactoring:**
   - Update all imports.
   - Remove dead code and obsolete files.
   - Run lint/build to confirm no references are broken.

### Playwright Test Location Rules

1. All Playwright E2E tests MUST live under:

   `frontend/tests/e2e/`

2. Do NOT create additional root-level test folders such as `e2e/`, `playwright-tests/`, or `tests/` outside of `frontend/`.

3. Visual regression tests that use Playwright belong in:

   `frontend/tests/visual-regression/`

4. Screenshots, videos, and other Playwright artifacts must remain scoped to the frontend project, e.g.:

   - `frontend/tests/screenshots/`
   - or the default Playwright output directory configured in `frontend/playwright.config.ts`.

5. Backend tests MUST NOT use Playwright. They live under:

   `backend/tests/unit/` and `backend/tests/integration/` using Python testing tools.

## Agent Behavior

1. **Before making changes:**
   - Read relevant files fully (not just the function you’re changing).
   - Understand how the component/module fits into the bigger system.

2. **When asked to “fix” or “improve” code:**
   - Modify the existing implementation.
   - Do not create alternative files.
   - Prefer small, well-scoped changes over rewriting entire modules unless necessary.

3. **After changes:**
   - Ensure the project compiles:
     - For frontend: `npm run lint`, `npm run build` (or as specified in README).
     - For backend: ensure Python backend still imports and runs.

4. **If the repo already contains duplicate variants (`*_final`, etc.):**
   - Identify which version is actually imported/used.
   - Consolidate logic into the canonical file.
   - Remove the obsolete variant files in the same change.

## Key Commands

### Frontend Development (from `/frontend` directory)
```bash
npm run dev        # Start development server on localhost:3000
npm run build      # Build production bundle
npm run start      # Start production server
npm run lint       # Run ESLint with Next.js rules
```

### Screenshot Capture Tools (from `/procore-screenshot-capture` directory)
```bash
npm run setup              # Install dependencies and Playwright
npm run auth               # Create auth.json for Procore login
npm run capture:supabase   # Capture screenshots with Supabase storage
npm run ai:analyze         # Run AI analysis on captured screenshots
npm run db:modules         # Query module data from Supabase
npm run organize           # Organize screenshots for Figma
```

## Important Patterns

### Supabase Client Usage
Always use the server-side client in server components and API routes:
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Form Validation
Use Zod schemas with React Hook Form:
```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { commitmentsSchema } from '@/lib/schemas/commitments'
```

## Centralized Environment Variables

**IMPORTANT**: This project uses a **single, centralized `.env` file** in the root directory to avoid confusion.

### File Locations
- **Primary**: `/.env` (root directory) - Use this for all environment variables
- **Fallback**: `/.env.local` (root directory) - Legacy, but still supported
- **Python Helper**: `/python-backend/env_loader.py` - Centralized loader for all Python scripts

### Python Usage
All Python scripts use the centralized loader:
```python
from env_loader import load_env
load_env()  # Automatically loads from root .env
```