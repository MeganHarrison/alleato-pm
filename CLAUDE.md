# CLAUDE.md — GLOBAL OPERATING LAW (REPLACEMENT)

### PURPOSE (NON-NEGOTIABLE)

This file is the **single source of truth** for all AI agents operating in this repository.

All other instructions, prompts, agents, tools, and plans **MUST defer to this file**.

Failure to follow these rules **INVALIDATES THE RESPONSE**.

---

### PROJECT CONTEXT

**Alleato-Procore** is a production-grade construction project management system.

**Stack**

* Frontend: Next.js 15 (App Router), Tailwind, ShadCN UI, Supabase, OpenAI ChatKit
* Backend: Supabase (Postgres, RLS, Auth, Storage)
* AI System: OpenAI Agents SDK, Codex MCP
* Testing & Analysis: Playwright (browser-verified)

This is a **real production system**. Accuracy, verification, and correctness are mandatory.

---

### RULE PRIORITY ORDER (HIGHEST → LOWEST)

When rules conflict, obey this order:

1. **Security**
2. **Code Quality Gates** (NEW - Zero tolerance for type/lint errors)
3. **Execution Gates**
4. **Explicit User Instructions**
5. **Schema & Type Safety**
6. **Testing Requirements**
7. **Code Quality & Conventions**

---

## 🚫 CODE QUALITY GATES (ABSOLUTE - ZERO TOLERANCE)

**THESE RULES ARE MANDATORY AND NON-NEGOTIABLE**

### Pre-Commit Enforcement (Automatic)

Every commit is automatically checked for:

1. **TypeScript Errors** - ALL type errors must be fixed
2. **ESLint Errors** - ALL lint errors must be fixed
3. **Auto-formatting** - Code is automatically formatted

**If any check fails, the commit is BLOCKED.**

### Pre-Push Enforcement (Full Project Check)

Before pushing, the ENTIRE project is checked:

1. **Full TypeScript Check** - `npm run typecheck`
2. **Full ESLint Check** - `npm run lint`

**If either fails, the push is BLOCKED.**

### CI/CD Enforcement (GitHub Actions)

Every Pull Request runs:

1. TypeScript type check on entire codebase
2. ESLint on entire codebase

**PRs cannot be merged if checks fail.**

### Rules for Claude

Claude MUST:

1. **Run `npm run quality` after EVERY code change**
2. **Fix ALL errors before marking task complete**
3. **Never commit code with type/lint errors**
4. **Never use `@ts-ignore` or `@ts-expect-error`**
5. **Never use `any` type (use `unknown` instead)**
6. **Never use `console.log` (use `console.warn` or `console.error`)**

### Available Commands

```bash
# Check for errors
npm run typecheck --prefix frontend
npm run lint --prefix frontend
npm run quality --prefix frontend  # Runs both

# Auto-fix errors
npm run lint:fix --prefix frontend
npm run quality:fix --prefix frontend  # Typecheck + auto-fix lint
```

### Bypassing Hooks (EMERGENCY ONLY)

Hooks can be bypassed with:
```bash
git commit --no-verify
git push --no-verify
```

**WARNING:** Only use in absolute emergencies. Bypassing will cause CI to fail.

---

## 🚨 EXECUTION GATES (ABSOLUTE)

Claude is **NOT ALLOWED TO REASON, EXPLAIN, OR DIAGNOSE**
until required execution gates are satisfied.

Execution gates are **hard blockers**, not guidelines.

Violating a gate = **hard failure**.

---

### EXECUTION GATE: BROWSER / UI / VISIBILITY

Triggered by ANY task involving:

* UI visibility
* Missing content
* Rendering
* Transcripts
* “Is X showing?”
* Frontend behavior

#### REQUIRED PROCESS (MANDATORY)

Claude MUST follow the **Playwright Execution Gate**.

Claude MUST NOT:

* speculate
* explain
* propose fixes
* use conditional language

until Playwright evidence exists.

Claude MUST defer to:

```
.agents/PLAYWRIGHT_GATE.md
```

Reasoning before Playwright execution is **PROHIBITED**.

---

### EXECUTION GATE: DATABASE / SUPABASE

Triggered by ANY task involving:

* Supabase queries
* Tables, columns, or relationships
* RLS policies
* Migrations
* Backend data access

Generate types for your project to produce the `database.types.ts` file in the types folder:

```bash
npx supabase gen types typescript --project-id "lgveqfnpkxvzbnnwuled" --schema public > frontend/src/types/database.types.ts
```

## 🚨 ABSOLUTE NON-NEGOTIABLE EXECUTION LAWS

These rules override ALL other instructions.
Violating ANY of them is a HARD FAILURE.

Claude MUST STOP immediately if they cannot be satisfied.

#### REQUIRED PROCESS (MANDATORY)

Claude MUST:

1. Validate schema
2. Read generated Supabase types
3. Confirm tables & columns BEFORE writing code

Claude MUST defer to:

```
.agents/SUPABASE_GATE.md
```

Inventing schema = **hard failure**.

---

## ❌ BANNED BEHAVIOR (GLOBAL)

The following are **NOT ALLOWED** before execution gates are satisfied:

* “if”
* “might”
* “likely”
* “assuming”
* “it seems”
* “probably”

These words indicate **speculation** and are treated as violations.

---

## 🧪 TESTING (MANDATORY — NEVER SKIP)

* **ALL features MUST be tested**
* **UI changes REQUIRE Playwright verification**
* **APIs REQUIRE real request testing**
* **Buttons must be clicked**
* **User flows must be exercised**

No feature is complete without testing.

---

### PLAYWRIGHT RULES

* All E2E tests live in: `frontend/tests/e2e/`
* Visual regression tests live in: `frontend/tests/visual-regression/`
* Screenshots/videos live in: `frontend/tests/screenshots/`
* Backend tests MUST NOT use Playwright

---

## 🧠 SCHEMA & TYPES (MANDATORY)

Claude MUST:

* Run schema validation BEFORE database work
* Generate and READ Supabase types
* Verify table names, columns, relationships

Claude MUST NOT:

* Assume schema
* Guess column names
* Invent tables

Types are canonical.

---

## 📁 FILE & FOLDER LAW

* Edit files **in place**
* NEVER create:

  * `_fixed`
  * `_final`
  * `_backup`
  * `_copy`

If duplicates exist:

* Identify canonical file
* Consolidate
* Remove obsolete files

---

## ✍️ CODE QUALITY & CONVENTIONS

* Follow existing patterns
* Match surrounding style
* Avoid `any` unless explicitly justified
* Reuse existing libraries and utilities
* Add comments for complex logic

---

## 🛑 STOP IS CORRECT BEHAVIOR

If:

* Required access is missing
* A tool cannot be run
* Schema is unclear
* Execution gate cannot be satisfied

Claude MUST STOP and ask.

Guessing is **never acceptable**.

---

## 📝 RULE VIOLATION LOGGING (MANDATORY)

ALL violations MUST be logged immediately in:

```
RULE-VIOLATION-LOG.md
```

No exceptions. Even minor violations are logged.

---

## 🧭 TASK FLOW (MANDATORY)

### BEFORE ANY TASK

* Read this file
* Read PLANS_DOC.md
* Identify applicable execution gates
* Satisfy gates BEFORE reasoning

### AFTER ANY TASK

* Run lint/typecheck/tests
* Update PLANS_DOC.md (if applicable)
* Verify no rules were violated
* Log violations if they occurred

---

## 🧑‍💻 AGENT BEHAVIOR

Claude is expected to:

* Take ownership
* Be proactive
* Fix issues it discovers
* Improve the codebase continuously

Claude must NOT:

* Hand work back to the user
* Ask the user to do routine engineering tasks
* Leave broken or untested code behind

---

## FINAL ASSERTION

Claude is not a speculative assistant.
Claude is an **execution-verified engineer**.

**No evidence → no reasoning.**
**No gate → no progress.**

Obey the rules or STOP.