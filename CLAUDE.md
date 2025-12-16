# CLAUDE.md - AI Agent Global Rules and Guidelines

## 1. Purpose

This file defines the **single source of truth.** All other instruction files (e.g. `AGENTS.md`, tool prompts) must **defer to and obey this document**.

**ENFORCEMENT**: Any violation of these rules must be immediately logged in RULE-VIOLATION-LOG.md. No exceptions.

## Project Overview
Alleato-Procore is a modern alternative to Procore (construction project management software) being built with:
- **Frontend**: Next.js 15 with App Router, Supabase, OpenAI ChatKit UI, ShadCN UI, and Tailwind CSS
- **Backend**: Supabase (PostgreSQL with RLS, Auth, Storage)
- **AI System**: OpenAI Agents SDK and Codex MCP
- **Analysis Tools**: Playwright-based screenshot capture and AI analysis

## Quick Reference - Critical Rules
1. **ALWAYS test** with Playwright before completion
2. **ALWAYS update** EXEC_PLAN.md after major tasks
3. **ALWAYS log** rule violations to RULE-VIOLATION-LOG.md
4. **ALWAYS run schema validation** before any database work: `cd backend && ./scripts/check_schema.sh`
5. **Be proactive** - Look for ways to add value and improve code
6. **Take ownership** - Create files and structure as needed to achieve results
7. **Never commit** unless explicitly requested
8. **Stay autonomous** – Never hand work back to the user. If you discover an issue, fix it proactively, document what you did, and only follow up with a summary plus the next steps you’ve already queued for yourself. The user should never be assigned tasks unless something is truly impossible for us to execute.

## PLANS.md
Always read .agents/PLANS.md and EXEC_PLAN.md

> **IMPORTANT**: All AI coding agents MUST read and follow these rules. Violations must be logged in RULE-VIOLATION-LOG.md.

## Global Rules

### 1. Testing Requirements
- **ALWAYS test with Playwright in the browser before stating a task is complete**
- Run tests as defined in package.json (e.g., `npm run test:e2e`)
- Verify UI changes visually, not just programmatically
- Ensure all tests pass before marking task complete

### 2. TypeScript & Project Constraints
1. **Types are centralized.**
   - Prefer types from the `/types` directory, Supabase typegen, and shared schemas.
   - Do not define ad-hoc duplicate types if a shared type already exists.

2. **No lazy `any` unless explicitly justified.**
   - Prefer `unknown`, proper interfaces, or inferred types from Zod/schema.
   - If you use `any`, document why in a comment and keep the scope as small as possible.

3. **Respect Next.js / app router conventions.**
   - Follow existing patterns in `app/` for layouts, routes, and server/client components.
   - Don’t introduce a competing pattern unless explicitly instructed.

### 3. File & Folder Conventions
1. **File naming:**
   - Use descriptive names aligned with responsibility (e.g. `useBudgetSummary.ts`, `ProjectList.tsx`).
   - Do not use vague or process-oriented names (`script.ts`, `test-code.ts`, `temp.ts`).

2. **When refactoring:**
   - Update all imports.
   - Remove dead code and obsolete files.
   - Run lint/build to confirm no references are broken.

3. **Folder placement (enforced; see FOLDER_STRUCTURE.md):**
   - Frontend code lives under `frontend/src/*`; tests and screenshots belong in `frontend/tests/` (`frontend/tests/screenshots/` is the ONLY screenshot location).
   - Supabase types are canonical at `frontend/src/types/database.ts` and must be imported via `@/types/database.types`—do not create extra copies elsewhere.
   - Backend APIs/services/workers stay under `backend/src/{api,services,workers}` with matching tests under `backend/tests/{unit,integration}`.
   - Keep root tidy: do not add ad-hoc top-level folders (e.g., avoid stray `source/`, duplicate `frontend/`, or empty `src/` trees).

### 4. File Management
1. **Edit in place; do NOT create duplicate versions of the same file.**
   - Do NOT create files with names like:
     - `*_fixed.*`, `*_final.*`, `*_backup.*`, `*_copy.*`
   - When modifying behavior, update the **original file** unless explicitly told otherwise.

2. **Take ownership of file structure**
   - Create new files as needed to achieve the desired result
   - Organize code properly into appropriate files and folders
   - Be proactive about creating necessary supporting files

### 5. Code Style and Conventions
- **Add helpful comments** to explain complex logic and improve code maintainability
- **ALWAYS check for existing libraries before importing new ones**
- **FOLLOW existing code patterns and conventions**
- Match indentation, naming conventions, and formatting of surrounding code

### 6. Task Completion
- **ALWAYS update EXEC_PLAN.md after completing major tasks**
- **RUN lint and typecheck commands before finishing** (npm run lint, npm run typecheck, etc.)
- **NEVER commit changes unless explicitly asked**
- Mark todos as completed immediately when done

### 7. Playwright Test Location Rules
1. All Playwright E2E tests MUST live under `frontend/tests/e2e/`

2. Do NOT create additional root-level test folders such as `e2e/`, `playwright-tests/`, or `tests/` outside of `frontend/`.

3. Visual regression tests that use Playwright belong in `frontend/tests/visual-regression/`

4. Screenshots, videos, and other Playwright artifacts must remain scoped to the frontend project, e.g.: `frontend/tests/screenshots/` or the default Playwright output directory configured in `frontend/playwright.config.ts`.

5. Backend tests MUST NOT use Playwright. They live under `backend/tests/unit/` and `backend/tests/integration/` using Python testing tools.

### 8. Testing (General)
- **NEVER assume specific test frameworks**
- **CHECK README or search codebase for testing approach**
- **RUN tests after making changes**
- Ensure all tests pass before marking task complete

### 9. Security
- **NEVER introduce code that exposes or logs secrets**
- **NEVER commit secrets or API keys**
- **ALWAYS follow security best practices**
- Validate inputs and sanitize outputs

### 10. Rule Violation Logging (MANDATORY)
- **IMMEDIATELY log any identified rule violation to RULE-VIOLATION-LOG.md**
- **USE the specified format for violation entries**
- **INCLUDE all required fields**: date, time, rule, files, description, root cause, impact, prevention
- **NO EXCEPTIONS** - All violations must be logged, even minor ones

### 11. Supabase Database Requirements (MANDATORY)
**CRITICAL**: Anytime you're working with the database, you MUST validate the schema and update the Supabase types FIRST before any database work.

#### Step 1: Run Schema Validation (MANDATORY)
**ALWAYS run the schema validation script BEFORE any database-related work:**
```bash
cd backend && ./scripts/check_schema.sh
# OR
cd backend && source venv/bin/activate && python scripts/validate_schema.py
```

This script:
- Fetches the actual schema from Supabase
- Scans Python files for `.table().select()` patterns
- Reports any columns/tables that don't exist
- Suggests similar column names for typos

**If validation fails, FIX ALL ERRORS before proceeding.**

#### Step 2: Generate/Read Types
- **ALWAYS generate/update types BEFORE working with Supabase queries**
- **READ the generated database.types.ts file to understand table structure**
- **VERIFY table names, column names, and relationships from the types**
- **NEVER assume table or column names - always check the types first**
- **Follow the type generation instructions**: `/Users/meganharrison/Documents/github/alleato-procore/.agents/rules/supabase/generate-supabase-types.md`

Type generation commands:
```bash
# For local development
npx supabase gen types typescript --local > database.types.ts

# For production (requires PROJECT_REF)
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > database.types.ts
```

This prevents errors like:
- Using wrong table names (e.g., "insights" instead of "ai_insights")
- Referencing non-existent tables
- Incorrect column names or types (e.g., `status` vs `state`, `client_name` vs `client`)
- Missing required fields

### Pre-Task Checklist
Before starting any task:
- [ ] Read CLAUDE.md (this file)
- [ ] Read EXEC_PLAN.md
- [ ] Review RULE-VIOLATION-LOG.md for patterns to avoid
- [ ] Check EXEC_PLAN.md for project context
- [ ] Understand existing code conventions
- [ ] Identify which rules apply to the current task
- [ ] **If working with database**: Run `cd backend && ./scripts/check_schema.sh` FIRST
- [ ] **If working with database**: Generate and read Supabase types

### Post-Task Checklist
After completing any task:
- [ ] Run lint and type checking
- [ ] Update EXEC_PLAN.md if applicable
- [ ] Verify no rules were violated
- [ ] Log any violations that occurred
- [ ] Ensure code follows existing patterns

## Common Violation Patterns to Avoid

1. **Creating duplicate file versions** - Never create _fixed, _final, _backup versions
2. **Importing without checking** - Always verify library availability first
3. **Forgetting documentation updates** - Update EXEC_PLAN.md for major changes
4. **Skipping tests** - Always run tests after changes
5. **Taking the easy way out** - Don't be lazy; persist until achieving the desired result
6. **Not being proactive enough** - Always look for ways to add value and improve
7. **Ignoring existing patterns** - Always match the codebase's conventions
8. **Skipping schema validation** - ALWAYS run `./scripts/check_schema.sh` before database work to catch column/table mismatches

## Enforcement
- Violations will be tracked and analyzed
- Patterns of violations may result in process changes
- All agents should learn from logged violations
- Regular reviews will identify areas for improvement

## Priority Order for Rules

When rules conflict, follow this priority:
1. **Security** - Never expose secrets or sensitive data
2. **Explicit user requests** - Do exactly what's asked
3. **Code quality** - Always improve and add value
4. **Testing requirements** - Always test before completion
5. **Code conventions** - Match existing patterns

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

## Summary

The core philosophy: **Be proactive and take ownership**. Constantly look for ways to add value and improve the codebase. Create the files and structure needed to achieve excellent results. Never take the easy way out - persist until the desired outcome is achieved.

### Key principles:

- Take initiative to improve code quality
- Create necessary files and structure without waiting for explicit instructions
- Add helpful documentation and comments
- Be persistent in solving problems thoroughly
- Always aim for the best solution, not the quickest one

**Remember: Excellence requires initiative. These guidelines empower you to make the codebase better with each contribution.**

---

**Last Updated**: 2025-12-11
**Version**: 1.3
