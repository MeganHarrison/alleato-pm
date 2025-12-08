# Procore Form Standardization Plan

This document outlines a repeatable workflow for recreating Procore forms inside the Alleato clone. The goal is to minimize manual effort per form, ensure UI consistency, and guarantee every submission writes cleanly to the Supabase connect tables.

## 1. Capture And Store Raw Artifacts
- Keep the DOM snapshots exported from Procore (e.g., `form-create-project.html`) in `scripts/procore-screenshot-capture/outputs/dom/`.
- Maintain matching screenshots (for visual cues) to reference field positioning and contextual hints.
- Version-control all artifacts so form definitions can be regenerated when Procore updates their UI.

## 2. Parse HTML → Canonical JSON Schema
1. Build or reuse a parser (Cheerio/jsdom) that reads the HTML dump and extracts for every input:
   - Stable ID (prefer `name` attribute), label text, field type, required state, placeholder/help text, option lists.
   - Section/fieldset titles to retain grouping and ordering.
2. Emit structured JSON using a consistent shape:
   ```json
   {
     "formId": "create-project",
     "title": "Create Project",
     "sections": [
       {
         "title": "Project Information",
         "fields": [
           {
             "id": "project[name]",
             "label": "Project Name",
             "type": "text",
             "required": true,
             "helpText": "Displayed to all collaborators"
           }
         ]
       }
     ]
   }
   ```
3. Store generated schemas in `scripts/procore-screenshot-capture/outputs/analysis/` (e.g., `create-project.schema.json`). Commit both the parser and schemas to keep the pipeline reproducible.

## 3. Align Schema With Supabase Data Model
- Maintain a Supabase DDL file and TypeScript type definitions for every connect table (projects, contracts, commitments, etc.).
- Add a validation script that compares each field in the form schema to a column in the target table; fail the build if a form field has no mapped column or type mismatch.
- Standardize naming by keeping a shared dictionary (`field-map.json`) that translates Procore field IDs to Supabase column names.

## 4. Build A Reusable Form Renderer
- Implement a generic React component (e.g., `FormBuilder`) powered by React Hook Form + Zod.
- `FormBuilder` takes the JSON schema and dynamically renders sections, shared input primitives, validation, and helper text.
- Extendable field component registry: text, number, currency, select, multiselect, checkbox, date, file uploads, tables, etc. Special cases (e.g., project stage pickers) plug in via a `type` key in the schema.

## 5. Centralize Persistence Logic
- Expose Supabase helper modules (`createProject`, `createCommitment`, …) that accept validated data, inject defaults, and insert into the connect table.
- `FormBuilder` only needs to know which helper to call on submit; this avoids duplicating insert logic and enforces permissions, auditing, and error handling uniformly.
- Log every form submission to an activity table for downstream auditing/history views.

## 6. Automation & Testing
- Auto-generate TypeScript types from each schema for compile-time safety (`zodToTs` or `json-schema-to-typescript`).
- Write Cypress/Playwright helpers that consume the same schema to fill forms automatically in E2E tests, ensuring the rendered UI matches the spec.
- Add snapshot tests for the renderer to catch accidental layout regressions across shared components.

## 7. Developer Workflow Checklist
1. **Capture** new Procore form (HTML + screenshot).
2. **Parse** into JSON schema using the parser script.
3. **Validate** schema against Supabase definitions.
4. **Render** by plugging schema into `FormBuilder` and referencing the relevant Supabase helper.
5. **Test** (unit + E2E) using the schema-driven automation helpers.
6. **Document** any quirks or manual overrides back in the schema (comments/metadata) for future maintainers.

## 8. Reusable Task Checklist
Use this checklist for each new form to keep the process uniform. Mark each item as you complete it:

- [ ] Capture latest UI artifacts (DOM export + annotated screenshot) and store in `outputs/dom/`.
- [ ] Run HTML parser; commit resulting JSON schema to `outputs/analysis/`.
- [ ] Update/confirm Supabase table definitions, run schema-vs-DB validation script.
- [ ] Add/adjust field mappings in `field-map.json` (or equivalent) for naming consistency.
- [ ] Implement or extend schema-specific Zod validation derived from parsed fields.
- [ ] Register any new input type in the `FormBuilder` component registry with unit tests.
- [ ] Wire the form to the correct Supabase helper (e.g., `createProject`) and handle success/failure UX.
- [ ] Add schema-driven Cypress/Playwright E2E coverage plus renderer snapshot/unit tests.
- [ ] Update documentation (README or Confluence) with nuances, dependencies, and rollout notes.

Following these steps makes each new form mostly data-entry (updating the schema) rather than bespoke UI coding, enabling rapid replication of Procore’s expansive form library.
