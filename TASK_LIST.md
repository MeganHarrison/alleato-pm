# TASK LIST

1. Create task list
2. Create sitemap

## **PHASE 0 — STRATEGY & SCOPE (Define What You’re Building)**

### **0.1 — Identify modules to include in V1**

* [ ] List all Procore modules currently enabled.
* [ ] Categorize into:

  * Daily critical
  * Nice-to-have
  * Unnecessary
* [ ] Finalize V1 scope (RFIs, COs, Meetings, Budget, Directory, Field Logs, Project Home).

### **0.2 — Define non-goals**

* [ ] Explicitly list everything **not** included in V1.
* [ ] Freeze scope to avoid creeping complexity.

---

# **PHASE 1 — SYSTEM DECONSTRUCTION (Screens + DOM Capture)**

### **1.1 — Run deep crawler**

* [ ] Install Playwright + dependencies.
* [ ] Configure persistent login.
* [ ] Run deep crawler across 1–2 representative projects.
* [ ] Capture:

  * screenshots
  * DOM
  * modal content
  * list/table views
  * tool navigation

### **1.2 — Organize crawl outputs**

* [ ] Structure results by module in `/procore-crawl/*`
* [ ] Extract unique screens per module.

### **1.3 — Import into design workspace**

* [ ] Upload all screenshots to Figma.
* [ ] Organize frames by module and view state.

---

# **PHASE 2 — SPEC DEVELOPMENT (What the System MUST Do)**

### **2.1 — Convert screens into functional requirements**

For each module:

* [ ] Identify all fields (from DOM)
* [ ] Identify all workflows
* [ ] Identify all lifecycle states (statuses)
* [ ] Identify required vs optional fields
* [ ] Identify notifications / approvals
* [ ] Identify cross-module dependencies
  (e.g., RFIs link to meetings, COs link to budgets)

### **2.2 — AI-driven extraction (accelerate spec writing)**

* [ ] Feed each DOM + screenshot into AI.
* [ ] Extract:

  * Entities
  * Attributes
  * Relationships
  * User actions
  * Permissions
  * Status transitions
  * Validation logic

### **2.3 — Prepare V1 spec document**

* [ ] Directory module spec
* [ ] RFI module spec
* [ ] Submittals module spec (if included)
* [ ] Meeting Topics / Actions module spec
* [ ] Prime Contract + Prime CO spec
* [ ] Commitments + Commitment CO spec
* [ ] Budget summary spec
* [ ] Field log spec (simplified daily log)
* [ ] Project Home Dashboard spec

---

# **PHASE 3 — ARCHITECTURE (Technical Plan)**

### **3.1 — Select tech stack**

* [ ] Next.js 15 + App Router
* [ ] ShadCN UI + Tailwind
* [ ] Supabase (DB, Auth, Storage, RLS)
* [ ] Cloudflare R2 (optional for heavy files)
* [ ] OpenAI for AI automation
* [ ] Supabase MCP server

### **3.2 — ERD (Database Schema)**

* [ ] projects
* [ ] directory_users
* [ ] rfis
* [ ] rfi_comments
* [ ] meetings
* [ ] meeting_topics
* [ ] meeting_actions
* [ ] prime_contracts
* [ ] prime_contract_change_orders
* [ ] commitments
* [ ] commitment_change_orders
* [ ] budget_items
* [ ] field_logs
* [ ] files (or storage pointer)

### **3.3 — Permissions Model**

* [ ] Define roles (PM, Super, Sub, Owner Rep, Internal Admin)
* [ ] Setup RLS on all key tables
* [ ] Define project-level access

---

# **PHASE 4 — UX / UI DESIGN (Modern Replacement)**

### **4.1 — Create design system in Figma**

* [ ] Layout grid
* [ ] Typography scale
* [ ] Components:

  * Tables
  * Buttons
  * Inputs
  * Status chips
  * Tabs
  * Drawer / modal
  * Cards

### **4.2 — Page templates**

* [ ] Project shell (sidebar, header, context bar)
* [ ] List + detail pattern
* [ ] Form layouts
* [ ] Dashboard template

### **4.3 — Module designs**

* [ ] RFIs v1 screens
* [ ] Meetings v1 screens
* [ ] COs (Prime + Commitment)
* [ ] Budget summary
* [ ] Directory
* [ ] Field log

---

# **PHASE 5 — VERTICAL SLICE DEVELOPMENT (Shipping Real Usable Features)**

### **Slice 1 — Project Shell**

* [ ] Supabase auth
* [ ] Project listing
* [ ] Project dashboard
* [ ] Directory management
* [ ] Permission enforcement

### **Slice 2 — RFIs**

* [ ] RFI list view
* [ ] Create/edit RFI
* [ ] Attach files
* [ ] Status transitions
* [ ] Comments/notes
* [ ] AI: Draft RFI description
* [ ] AI: Suggest responsible party
* [ ] AI: Convert note/photo → structured RFI

### **Slice 3 — Change Orders**

* [ ] Prime Contract (base record)
* [ ] Owner CO list & detail
* [ ] Cost impact fields
* [ ] Status transitions
* [ ] File attachments
* [ ] AI: Write CO justification
* [ ] AI: Summarize changes from meeting notes

### **Slice 4 — Meetings + Action Items**

* [ ] Agenda list
* [ ] Topic list
* [ ] Action items
* [ ] Assignments + due dates
* [ ] AI: Meeting summary
* [ ] AI: Auto-generate action items

### **Slice 5 — Budget Summary**

* [ ] Basic summary table
* [ ] Simple rollup logic
* [ ] Inline edit for PM
* [ ] Link COs to budget impact

### **Slice 6 — Field Logs**

* [ ] Daily log page
* [ ] Weather block
* [ ] Notes block
* [ ] Photo upload
* [ ] AI: Generate daily log from text/photos

---

# **PHASE 6 — PARALLEL TESTING (Internal Rollout)**

### **6.1 — Select one pilot project**

* [ ] Choose a smaller, low-risk project.
* [ ] Mirror key items from Procore into Alleato OS:

  * Directory
  * RFIs
  * COs
  * Meetings
  * Budget summary

### **6.2 — Run both systems in parallel**

* [ ] Field team logs items in either system
* [ ] PMs review consistency
* [ ] Weekly check-in to remove friction

### **6.3 — Gather feedback**

* [ ] What’s missing?
* [ ] What’s confusing?
* [ ] What’s faster than Procore?
* [ ] What’s still slower?

---

# **PHASE 7 — EXPANSION (Replace Procore Module-by-Module)**

### **7.1 — Decommission RFIs in Procore**

* [ ] Move all new RFIs exclusively into Alleato OS.
* [ ] Route all communication from the new system.

### **7.2 — Decommission COs in Procore**

* [ ] Track all COs solely in Alleato OS.
* [ ] Integrate with internal accounting as needed.

### **7.3 — Decommission Meetings**

* [ ] Shift action tracking & summaries to new system.

### **7.4 — Expand to next project(s)**

* [ ] Roll out to 2–3 more projects
* [ ] Establish official “Alleato OS onboarding” flow

---

# **PHASE 8 — HARDENING FOR SCALE (Stability & Enterprise Features)**

### **8.1 — Add advanced permission controls**

* [ ] Per-tool, per-project access control
* [ ] Owner-visibility toggles
* [ ] Subcontractor-visibility toggles

### **8.2 — Audit logs**

* [ ] RFI history
* [ ] CO history
* [ ] Meeting logs
* [ ] Budget edits

### **8.3 — Integrations**

* [ ] PDF export
* [ ] Owner report templates
* [ ] Accounting integration (QuickBooks/Sage)
* [ ] Scheduling integration (Project, P6)

### **8.4 — Reporting layer**

* [ ] Real-time dashboards
* [ ] Cross-project analytics
* [ ] AI predictive budget overruns
* [ ] AI scheduling risk predictions

---

# **PHASE 9 — AI SUPERPOWERS (Differentiators Procore Cannot Match)**

### **9.1 — Smart RFI assistant**

* [ ] Drafts RFIs
* [ ] Summarizes responses
* [ ] Predicts potential impacts on schedule/cost

### **9.2 — Change Order intelligence**

* [ ] Generates cost justification text
* [ ] Detects scope gaps from meeting notes
* [ ] Flags inconsistent line items
* [ ] Forecasts margin impact

### **9.3 — Meeting intelligence**

* [ ] Summaries
* [ ] Action item generation
* [ ] Topic categorization

### **9.4 — Field intelligence**

* [ ] Daily log generation
* [ ] Photo analysis
* [ ] Issue detection in images (AI vision)

### **9.5 — Predictive analytics**

* [ ] RFI aging prediction
* [ ] CO approval timeline risk
* [ ] Schedule impact forecasting
* [ ] Budget overrun warnings

---

# **PHASE 10 — OFFICIAL SUNSET OF PROCORE**

### **10.1 — New system fully operational**

* [ ] RFIs handled internally
* [ ] COs handled internally
* [ ] Meetings handled internally
* [ ] Budget managed internally
* [ ] Directory synced

### **10.2 — Offboard Procore**

* [ ] Export historical data for archive
* [ ] Cancel contract
* [ ] Migrate file storage to internal system (optional)

### **10.3 — Launch Alleato OS as the official project system**

* [ ] Roll out SOPs internally
* [ ] Train team
* [ ] Add onboarding videos
* [ ] Version 1.0 announcement

---

# **End of Document**

---

If you want, I can also create:

* `timeline.md` (with phases broken into weeks)
* `roles.md` (who needs to do what)
* `architecture.md`
* `database_schema.sql`
* `figma_structure.md`
* `execution_blueprint.md` (Megan style: ruthless clarity + action)

Tell me what you want next.
