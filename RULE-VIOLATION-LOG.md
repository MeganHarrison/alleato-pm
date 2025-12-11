# RULE VIOLATION LOG

> **Purpose**: Track all rule violations to identify patterns and prevent future occurrences.
> **Requirement**: ALL identified rule violations MUST be logged here immediately upon discovery.

## Value of This Log

1. **Pattern Recognition**: Identifies recurring issues to address systemically
2. **Training Data**: Helps AI agents learn from past mistakes
3. **Accountability**: Creates a transparent record of compliance issues
4. **Continuous Improvement**: Enables refinement of rules and processes
5. **Context Preservation**: Provides historical context for future development

## How This Prevents Future Violations

- **Pre-work Review**: AI agents should review this log before starting tasks
- **Rule Reinforcement**: Each violation serves as a learning example
- **Process Refinement**: Patterns reveal where rules need clarification
- **Automated Checks**: Violations can inform new validation scripts

## Violation Entry Format

```
### [Date] [Time] - [Rule Category]
**Rule Violated**: [Specific rule that was broken]
**File(s) Affected**: [List of files]
**Description**: [What happened]
**Root Cause**: [Why it happened]
**Impact**: [Consequences of the violation]
**Prevention**: [How to prevent this in future]
**Agent/User**: [Who made the change]
```

---

## Logged Violations

### 2025-12-11 02:57 - Documentation Update
**Rule Violated**: EXEC_PLAN.md must be updated after completing tasks
**File(s) Affected**: EXEC_PLAN.md
**Description**: EXEC_PLAN.md was not updated after tasks were completed
**Root Cause**: Missing post-task documentation step
**Impact**: Project status out of sync with actual progress
**Prevention**: Add EXEC_PLAN.md update to task completion checklist
**Agent/User**: Unknown

### 2025-12-11 15:40 - Testing & Proactivity
**Rule Violated**: "ALWAYS test before stating a task is complete" and "Be proactive - Take ownership"
**File(s) Affected**: docs/next.config.mjs, docs server
**Description**: Told user the docs server was running successfully without testing that the page actually loads and works. Server had errors including lockfile patching failures and configuration warnings that prevented pages from loading properly.
**Root Cause**: Saw "Ready in 2.1s" message and assumed success without actually testing the page in a browser or verifying pages load
**Impact**: User received a broken/non-functional docs server and wasted time discovering it doesn't work
**Prevention**: ALWAYS test the actual page/functionality before reporting success. Check that pages load, not just that the server starts. Use curl or browser testing to verify functionality.
**Agent/User**: Claude (AI Assistant)

### 2025-12-11 16:45 - Supabase Database Types
**Rule Violated**: Not reading/verifying database types before making Supabase queries (newly added as Rule #11)
**File(s) Affected**: /frontend/src/app/(procore)/[projectId]/home/page.tsx
**Description**: Made incorrect assumptions about table names without first reading the generated database types. Used "insights" table instead of "ai_insights" and assumed "daily_logs" table existed when it doesn't. Also incorrectly assumed RFIs table didn't exist when it actually does.
**Root Cause**: Did not check database.types.ts or generate fresh types before implementing database queries. Made assumptions based on naming conventions rather than verifying actual schema.
**Impact**: Created non-functional code with database queries that would fail at runtime. User had to waste time identifying and reporting these errors, delaying production deployment.
**Prevention**: ALWAYS generate and read Supabase types FIRST before any database work. Use `npx supabase gen types typescript` and verify all table/column names against the generated types. Never assume - always verify.
**Agent/User**: Claude (AI Assistant)

### 2025-12-11 17:15 - Testing Requirements
**Rule Violated**: "ALWAYS test with Playwright in the browser before stating a task is complete"
**File(s) Affected**: /frontend/src/app/(procore)/[projectId]/home/page.tsx
**Description**: Claimed "The page should now load without database errors" without running any tests to verify this claim
**Root Cause**: Made assumptions about functionality working based on code changes alone, without actual verification
**Impact**: User received unverified claims about functionality, potentially wasting time if the changes don't actually work
**Prevention**: ALWAYS run Playwright tests (`npm run test:e2e`) before making any claims about functionality working. Never use words like "should work" - either test and confirm it works, or state that testing is needed.
**Agent/User**: Claude (AI Assistant)
