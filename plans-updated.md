# PLANS.md – Global Rules for ExecPlan Creation and AI Development Workflow

This document defines the universal structure, rules, and execution standards for creating and maintaining **EXEC\_PLAN.md** files across all AI‑assisted development projects. All Agents must follow this specification **exactly**, without deviation.

&#x20;

Treat the reader as a complete beginner to this repository: they have only the current working tree and the single ExecPlan file you provide. There is no memory of prior plans and no external context.



# Purpose of PLANS.md

The purpose of PLANS.md is to:

- Standardize the workflow from requirements → planning → execution → deployment.
- Ensure every project is built using a predictable, testable, auditable process.
- Provide an explicit structure for EXEC\_PLAN.md files.
- Define strict testing protocol and "Definition of Done" the AI must follow.
- Eliminate ambiguity, skipped steps, incomplete implementations, and false positives.

All AI agents must treat this document as **law**.



# How to use **ExecPlans and** PLANS.md

When authoring an executable specification (ExecPlan), follow PLANS.md *\*to the letter\**.

If it is not in your context, refresh your memory by reading the entire PLANS.md file. Be thorough in reading (and re-reading) source material to produce an accurate specification. When creating a spec, start from the skeleton and flesh it out as you do your research.

**When implementing an executable specification (ExecPlan), do not prompt the user for "next steps"; simply proceed to the next milestone.**

Keep all sections up to date, add or split entries in the list at every stopping point to affirmatively state the progress made and next steps. Resolve ambiguities autonomously, and commit frequently.

When discussing an executable specification (ExecPlan), record decisions in a log in the spec for posterity; it should be unambiguously clear why any change to the specification was made.

**ExecPlans are living documents, and it should always be possible to restart from *************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************\*only\************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************** the ExecPlan and no other work.**

When researching a design with challenging requirements or significant unknowns, use milestones to implement proof of concepts, "toy implementations", etc., that allow validating whether the user's proposal is feasible.

Read the source code of libraries by finding or acquiring them, research deeply, and include prototypes to guide a fuller implementation. Use Context 7 MCP or research the web.

---

# Requirements

### **NON-NEGOTIABLE REQUIREMENTS:**

\- Every ExecPlan must be fully self-contained. Self-contained means that in its current form it contains all knowledge and instructions needed for a novice to succeed.

\- Every ExecPlan is a living document. Contributors are required to revise it as progress is made, as discoveries occur, and as design decisions are finalized. Each revision must remain fully self-contained.

\- Every ExecPlan must enable a complete novice to implement the feature end-to-end without prior knowledge of this repo.

\- Every ExecPlan must produce a demonstrably working behavior, not merely code changes to "meet a definition".

\- Every ExecPlan must define every term of art in plain language or do not use it.



### **Purpose and intent come first.**

Begin by explaining, in a few sentences, why the work matters from a user's perspective: what someone can do after this change that they could not do before, and how to see it working. Then guide the reader through the exact steps to achieve that outcome, including what to edit, what to run, and what they should observe.

The agent executing your plan can list files, read files, search, run the project, and run tests. It does not know any prior context and cannot infer what you meant from earlier milestones. Repeat any assumption you rely on.

Do not point to external blogs or docs; if knowledge is required, embed it in the plan itself in your own words. If an ExecPlan builds upon a prior ExecPlan and that file is checked in, incorporate it by reference. If it is not, you must include all relevant context from that plan.



### **Formatting**

Format and envelope are simple and strict. Each ExecPlan must be one single fenced code block labeled as \`md\` that begins and ends with triple backticks. Do not nest additional triple-backtick code fences inside; when you need to show commands, transcripts, diffs, or code, present them as indented blocks within that single fence.

Use indentation for clarity rather than code fences inside an ExecPlan to avoid prematurely closing the ExecPlan's code fence. Use two newlines after every heading, use # and ## and so on, and correct syntax for ordered and unordered lists.

When writing an ExecPlan to a Markdown (.md) file where the content of the file *\*is only\** the single ExecPlan, you should omit the triple backticks.

Write in plain prose. Prefer sentences over lists. Avoid checklists, tables, and long enumerations unless brevity would obscure meaning.

Checklists are permitted only in the \`Progress\` section, where they are mandatory. Narrative sections must remain prose-first.



### **Guidelines**

Self-containment and plain language are paramount. If you introduce a phrase that is not ordinary English ("daemon", "middleware", "RPC gateway", "filter graph"), define it immediately and remind the reader how it manifests in this repository (for example, by naming the files or commands where it appears). Do not say "as defined previously" or "according to the architecture doc." Include the needed explanation here, even if you repeat yourself.

Avoid common failure modes. Do not rely on undefined jargon. Do not describe "the letter of a feature" so narrowly that the resulting code compiles but does nothing meaningful. Do not outsource key decisions to the reader. When ambiguity exists, resolve it in the plan itself and explain why you chose that path. Err on the side of over-explaining user-visible effects and under-specifying incidental implementation details.

Anchor the plan with observable outcomes. State what the user can do after implementation, the commands to run, and the outputs they should see. Acceptance should be phrased as behavior a human can verify ("after starting the server, navigating to http\://localhost:8080/health returns HTTP 200 with body OK") rather than internal attributes ("added a HealthCheck struct"). If a change is internal, explain how its impact can still be demonstrated (for example, by running tests that fail before and pass after, and by showing a scenario that uses the new behavior).

\- Specify repository context explicitly.

\- Name files with full repository-relative paths, name functions and modules precisely

\- **\*\*Describe where new files should be created.\*\***

If touching multiple areas, include a short orientation paragraph that explains how those parts fit together so a novice can navigate confidently. When running commands, show the working directory and exact command line. When outcomes depend on environment, state the assumptions and provide alternatives when reasonable.

Be idempotent and safe. Write the steps so they can be run multiple times without causing damage or drift. If a step can fail halfway, include how to retry or adapt. If a migration or destructive operation is necessary, spell out backups or safe fallbacks. Prefer additive, testable changes that can be validated as you go.



### **Validation is not optional.**

Include instructions to run tests, to start the system if applicable, and to observe it doing something useful. Describe comprehensive testing for any new features or capabilities.

Include expected outputs and error messages so a novice can tell success from failure. Where possible, show how to prove that the change is effective beyond compilation (for example, through a small end-to-end scenario, a CLI invocation, or an HTTP request/response transcript). State the exact test commands appropriate to the project’s toolchain and how to interpret their results.

**\*\*Capture evidence.\*\*** When your steps produce terminal output, short diffs, or logs, include them inside the single fenced block as indented examples. Keep them concise and focused on what proves success. If you need to include a patch, prefer file-scoped diffs or small excerpts that a reader can recreate by following your instructions rather than pasting large blobs.



## **Milestones**

Milestones are narrative, not bureaucracy. If you break the work into milestones, introduce each with a brief paragraph that describes the scope, what will exist at the end of the milestone that did not exist before, the commands to run, and the acceptance you expect to observe. Keep it readable as a story: goal, work, result, proof.

Progress and milestones are distinct: milestones tell the story, progress tracks granular work. **\*\*Both must exist.\*\***

Never abbreviate a milestone merely for the sake of brevity, do not leave out details that could be crucial to a future implementation.

Each milestone must be independently verifiable and incrementally implement the overall goal of the execution plan.



## EXEC\_PLAN.md Structure

Every EXEC\_PLAN.md file must follow **this exact structure in this exact order**:

1. **Purpose / Big Picture**\
   High-level purpose, goals, context.

2. **Master Checklist (Phased, Ordered, Executable)**\
   This MUST be the second section of the document.

   - Organized by Phase and Section.
   - Tasks appear **in the exact order they must be completed**.
   - Tasks must be executable, testable, and traceable.
   - Tasks must include file path expectations when known.

3. **Progress Log**\
   AI or developer must update this continuously.

4. **Surprises & Discoveries**\
   Anything unexpected found during implementation.

5. **Decision Log**\
   Architectural decisions, rationale, timestamps.

6. **Testing Strategy & Definition of Done**\
   Project-specific rules derived from the global protocol in this PLANS.md file.

7. **Details (Context, Phase Descriptions, Specs)**\
   All deep explanations and reference material. Not allowed in the Master Checklist.

---

# 3. Rules for the Master Checklist (Section 2)

The Master Checklist is the **source of truth** for execution order.

### Checklist Requirements

- Must be divided by **Phase** and **Subsections**.
- Tasks must be **directly executable**.
- Tasks must be **testable**.
- Tasks must be **unambiguous**.
- Tasks must be **ordered** exactly as they should be executed.

### Updating the Checklist

When a task is completed:

- Change `[ ]` → `[x]`.
- Add links to:
  - Source code files
  - Tests
  - Relevant routes or UI pages
- Add notes if anything unexpected occurred.

Example:

```
[x] ContractForm – implemented in components/domain/contracts/ContractForm.tsx
    Tests: tests/contracts/contract-form.spec.ts
    UI: /contracts/new
```

### Rules Against Skipping

- Agents must always select the **earliest unchecked task** that has no incomplete prerequisites.
- Skipping ahead or reordering is prohibited unless explicitly stated in EXEC\_PLAN.md.

### Splitting Tasks

If the agent discovers a task is too large:

- Break it into child tasks **immediately below the main task**.
- Document the split in Progress Log + Decision Log.

---

# 4. Progress Log Rules (Section 3)

The Progress Log must be updated at the end of **every execution session**.

Progress Log entry format:

```
YYYY-MM-DD HH:MM (Agent Name) – Short summary
  - Checklist items: <IDs or Titles>
  - Code: <file paths edited>
  - Tests: <tests created or updated>
  - Screenshots: <paths to screenshots>
  - Notes: <surprises, technical considerations, blockers>
```

If the task is not completed:

- Mark as **IN PROGRESS**.
- Do **not** change the checklist item.

---

# 5. Surprises & Discoveries (Section 4)

This section records anything unexpected:

- Framework limitations
- Unexpected file structures
- Library conflicts
- Unusual behaviors
- Missing components

Format:

```
YYYY-MM-DD – Short title
Description…
```

---

# 6. Decision Log (Section 5)

Every non-trivial decision must be recorded.

Format:

```
YYYY-MM-DD – Decision: <one sentence summary>
Rationale: <why>
Impact: <where this affects the system>
```

---

# 7. Global Testing Protocol (Section 6)

All AI agents must obey this testing protocol **without exception**.

## 7.1 Testing Is Mandatory

For **any new feature, change, or bug fix**, the agent must:

- Write tests.
- Run tests.
- Capture screenshots when UI or flow-related.
- Update ExecPlan accordingly.

No task may be marked completed unless tests are in place.

## 7.2 Required Test Types

### Playwright Tests (Mandatory for UI and Flows)

Use Playwright for any behavior that:

- A user interacts with
- Affects the DOM
- Represents a page-level flow
- Is tied to RAG, form submission, navigation, or load sequences

Must include:

- End-to-end tests
- Screenshots showing the feature working

### Component / Unit Tests

Required for:

- Pure logic functions
- Complex components
- Reusable utilities

### Visual Regression Tests

Required when:

- The system defines a baseline screenshot
- UI stability is important

Use `toHaveScreenshot()`.

---

# 8. Screenshot Requirements

Screenshots are required proof of functionality.

Agents must:

- Capture screenshots for all significant UI behaviors
- Name them clearly (e.g., `new-contract-success.png`)
- Save them in an organized folder (e.g., `tests/screenshots/contracts/`)
- Reference them in Progress Log

Screenshots must show the **final working state**, not partial renders.

---

# 9. Bug Fix Protocol

For bug fixes, the agent must:

1. **Reproduce the bug**.
2. Add/update a test that fails because of the bug.
3. Implement the fix.
4. Run tests → ensure the failing test now passes.
5. Capture screenshots if user-facing.
6. Update:
   - Master Checklist item (if one exists)
   - Progress Log
   - Decision Log (if fix involved a choice)

A bug fix without a failing test → passing test transition is not acceptable.

---

# 10. Definition of Done (Global)

A task may be marked complete only if **ALL** of the following are true:

1. **Functionality** works exactly as defined in REQUIREMENTS.md and EXEC\_PLAN.md.
2. **User workflow** works end-to-end (page load is NOT enough).
3. **Tests exist and pass**.
4. **Screenshots** captured where applicable.
5. **Checklist item updated** with links.
6. **Progress Log updated**.
7. **Decision Log updated**, if applicable.
8. **Surprises & Discoveries logged**, if applicable.

If any condition is missing → the task remains incomplete.

---

# 11. Agent Roles & Responsibilities

## Planning Agent

- Reads REQUIREMENTS.md + PLANS.md only.
- Produces EXEC\_PLAN.md following exact structure.
- Defines a project-specific Testing Strategy & Definition of Done (Section 6 in ExecPlan).

## Development Agent

For each cycle:

1. Read EXEC\_PLAN.md.
2. Select earliest unchecked checklist item.
3. Implement functionality.
4. Write tests.
5. Run tests.
6. Capture screenshots.
7. Update Master Checklist.
8. Update Progress, Surprises, Decisions.

Skipping tasks or marking incomplete work as complete is prohibited.

---

# 12. Enforcement

Agents must follow this document exactly. Any deviation is considered an error.

---

# 13. Glossary

A shared vocabulary ensuring all agents interpret terms consistently.

**ExecPlan** – The master execution blueprint generated from REQUIREMENTS.md, dictating tasks, order, testing, and architecture.

**Master Checklist** – The authoritative, ordered list of tasks that MUST be followed step‑by‑step without skipping.

**Progress Log** – Mandatory chronological log updated after every work session documenting progress, tests, screenshots, and decisions.

**Surprises & Discoveries** – Section documenting unexpected findings, discrepancies, or missing requirements uncovered during development.

**Decision Log** – Section recording architectural, design, or strategic decisions with rationale and project impact.

**Definition of Done** – The strict criteria that determine whether a task can be marked complete. Includes tests, screenshots, links, and documentation.

**Requirements Document (REQUIREMENTS.md)** – The single input used to generate ExecPlan; a distilled and structured interpretation of the project’s needs.

**Planning Agent** – AI agent that reads REQUIREMENTS.md + PLANS.md and generates EXEC\_PLAN.md following required structure.

**Development Agent** – AI agent that executes the checklist sequentially, writes tests, updates logs, and ensures Definition of Done.

**CI/CD** – Continuous Integration and Continuous Deployment pipeline; verifies builds and tests before merging and deploying.

**Mandatory Folder Structure** – The enforced project directory layout required for consistency across projects.

---

# 14. Strengthened Rules for Agent Behavior

These rules MUST be followed by all agents. They supersede all other instructions.

## 14.1 No Skipping, No Guessing, No Freelancing

- Agents MAY NOT skip ahead in the Master Checklist.
- Agents MAY NOT invent features, shortcuts, or alternate structures.
- Agents MUST pause and log ambiguities in Surprises & Discoveries.

## 14.2 Strict Task Execution Discipline

For each task:

1. Identify the earliest unchecked task in the Master Checklist.
2. Execute ONLY that task.
3. Write required tests.
4. Run tests.
5. Capture screenshots.
6. Update ExecPlan.
7. Commit code.

Failing to follow any step = task incomplete.

## 14.3 No Partial “Done”

A task is not complete unless the full Definition of Done is met.

## 14.4 Mandatory Logging

Agents MUST:

- Update Progress Log after every work session.
- Update Decision Log for every architectural or behavioral choice.
- Update Surprises & Discoveries when uncovering inconsistencies.

## 14.5 Failure Recovery

If a task fails a test:

- The task remains incomplete.
- The agent MUST document failure in Progress Log.
- The agent MUST fix the issue before proceeding.

## 14.6 Prohibited Behaviors

Agents MUST NOT:

- Claim a feature “works” based on logs alone.
- Mark a task complete without tests.
- Skip screenshots where required.
- Override checklist order.

---

# 15. Mandatory Folder Structure

Every project MUST conform to the following folder structure (adapt as needed for project type, but do not remove categories):

```
project-root/
  EXEC_PLAN.md
  REQUIREMENTS.md
  PLANS.md

  frontend/
    src/
      app/
      components/
        layout/
        forms/
        tables/
        domain/
      lib/
      hooks/
    tests/
      e2e/
      components/
      visual-regression/
      screenshots/
    public/

  backend/
    src/
      api/
      services/
      workers/
      database/
    tests/
      unit/
      integration/

  scripts/
    utilities/
    ingestion/
    dev-tools/

  .github/
    workflows/
```

## 15.1 Folder Structure Rules

- Agents MUST create files in their correct directories.
- All components MUST live under `frontend/src/components`.
- All tests MUST be in `frontend/tests` or `backend/tests`.
- All screenshots MUST be in `tests/screenshots`.
- Domain‑specific UI MUST be in `components/domain/<module>`.
- API logic MUST be in `backend/src/api`.

Any deviation MUST be logged in Surprises & Discoveries and corrected immediately.

---

# 16. CI/CD Rules

A consistent CI/CD pipeline is mandatory.

## 16.1 Required GitHub Actions Workflow

Each project MUST include a workflow at:

```
.github/workflows/ci.yml
```

This workflow MUST:

- Install dependencies.
- Build the project.
- Run linting.
- Run unit tests.
- Run Playwright tests (headless).
- Upload screenshots and artifacts.
- Fail on any test or build error.

## 16.2 Requirements for Merging Code

A pull request MAY NOT be merged unless:

- All CI tests pass.
- Visual regression differences are below threshold.
- All screenshots are updated.
- EXEC\_PLAN.md is synchronized with code changes.

## 16.3 Deployment Rules

Deployment MUST:

- Occur only after CI success.
- Trigger Playwright smoke tests on production environment.
- Update deployment entries in the Progress Log.

## 16.4 Agents Must Enforce CI/CD

When writing code, agents MUST:

- Ensure tests exist before pushing.
- Update paths if CI fails.
- Log any CI/CD issues as Surprises & Discoveries.

---

# 17. End of PLANS.md





## **Living plans and design decisions**

ExecPlans are living documents. As you make key design decisions, update the plan to record both the decision and the thinking behind it. Record all decisions in the \`Decision Log\` section.

ExecPlans must contain and maintain a \`Progress\` section, a \`Surprises & Discoveries\` section, a \`Decision Log\`, and an \`Outcomes & Retrospective\` section. These are not optional.

When you discover optimizer behavior, performance tradeoffs, unexpected bugs, or inverse/unapply semantics that shaped your approach, capture those observations in the \`Surprises & Discoveries\` section with short evidence snippets (test output is ideal).

If you change course mid-implementation, document why in the \`Decision Log\` and reflect the implications in \`Progress\`. Plans are guides for the next contributor as much as checklists for you.

At completion of a major task or the full plan, write an \`Outcomes & Retrospective\` entry summarizing what was achieved, what remains, and lessons learned.

\


# **Prototyping milestones and parallel implementations**

It is acceptable—-and often encouraged—-to include explicit prototyping milestones when they de-risk a larger change. Examples: adding a low-level operator to a dependency to validate feasibility, or exploring two composition orders while measuring optimizer effects. Keep prototypes additive and testable. Clearly label the scope as “prototyping”; describe how to run and observe results; and state the criteria for promoting or discarding the prototype.



Prefer additive code changes followed by subtractions that keep tests passing. Parallel implementations (e.g., keeping an adapter alongside an older path during migration) are fine when they reduce risk or enable tests to continue passing during a large migration. Describe how to validate both paths and how to retire one safely with tests. When working with multiple new libraries or feature areas, consider creating spikes that evaluate the feasibility of these features *\*independently\** of one another, proving that the external library performs as expected and implements the features we need in isolation.\
&#x20;



# **Skeleton of a Good ExecPlan**

[Insert markdown code block with ExecPlan outline]



# Conclusion

If you follow the guidance above, a single, stateless agent -- or a human novice -- can read your ExecPlan from top to bottom and produce a working, observable result.

**That is the bar: SELF-CONTAINED, SELF-SUFFICIENT, NOVICE-GUIDING, OUTCOME-FOCUSED.**

When you revise a plan, you must ensure your changes are comprehensively reflected across all sections, including the living document sections, and you must write a note at the bottom of the plan describing the change and the reason why. ExecPlans must describe not just the what but the why for almost everything.

