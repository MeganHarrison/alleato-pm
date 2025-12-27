# QA Testing Standard Operating Procedure (SOP)

## Alleato vs Procore Comparison Testing

**Document Version:** 1.0
**Last Updated:** December 2024
**Purpose:** Systematic comparison of Alleato application against Procore to ensure feature parity, identify bugs, and document discrepancies.

---

## Table of Contents

1. [Overview](#overview)
2. [Before You Begin](#before-you-begin)
3. [Testing Environment Setup](#testing-environment-setup)
4. [Testing Procedure](#testing-procedure)
5. [Issue Documentation Requirements](#issue-documentation-requirements)
6. [Feature Comparison Process](#feature-comparison-process)
7. [Reporting & Communication](#reporting--communication)
8. [Appendix](#appendix)

---

## Overview

### Objective

Compare every page and feature in the Alleato application against the corresponding Procore functionality to:

1. **Identify bugs/errors** in the Alleato application
2. **Verify feature parity** with Procore
3. **Document missing functionality** that exists in Procore but not in Alleato
4. **Note UI/UX differences** that may impact user experience

### Scope

This SOP covers all modules in the Alleato application:

| Module | Alleato Route | Procore Equivalent |
|--------|---------------|-------------------|
| Dashboard | `/dashboard` | Project Home |
| Budget | `/{projectId}/budget` | Budget Tool |
| Commitments | `/{projectId}/commitments` | Commitments Tool |
| Contracts | `/{projectId}/contracts` | Prime Contracts |
| Change Orders | `/{projectId}/change-orders` | Change Orders |
| Invoices | `/{projectId}/invoices` | Invoicing |
| Direct Costs | `/{projectId}/direct-costs` | Direct Costs |
| RFIs | `/{projectId}/rfis` | RFIs Tool |
| Submittals | `/{projectId}/submittals` | Submittals Tool |
| Punch List | `/{projectId}/punch-list` | Punch List Tool |
| Schedule | `/{projectId}/schedule` | Schedule Tool |
| Documents | `/{projectId}/documents` | Documents Tool |
| Drawings | `/{projectId}/drawings` | Drawings Tool |
| Photos | `/{projectId}/photos` | Photos Tool |
| Meetings | `/{projectId}/meetings` | Meetings Tool |
| Daily Log | `/{projectId}/daily-log` | Daily Log Tool |
| Directory | `/{projectId}/directory` | Directory Tool |
| Emails | `/{projectId}/emails` | Emails Tool |

---

## Before You Begin

### Required Access

- [ ] Alleato application login credentials (staging/production)
- [ ] Procore application login credentials
- [ ] Access to the same project in both systems (if possible)
- [ ] Access to shared documentation folder (Google Drive/SharePoint)

### Required Tools

- [ ] Modern web browser (Chrome recommended for DevTools)
- [ ] Screenshot tool (Snagit, Lightshot, or browser extension)
- [ ] Screen recording software (optional, for complex flows)
- [ ] Access to issue tracking spreadsheet/document

### Documentation Folder Structure

Create or verify the following folder structure exists:

```
QA-Testing/
├── Screenshots/
│   ├── Alleato/
│   │   ├── Budget/
│   │   ├── Commitments/
│   │   ├── Contracts/
│   │   └── ... (one folder per module)
│   └── Procore/
│       ├── Budget/
│       ├── Commitments/
│       ├── Contracts/
│       └── ... (one folder per module)
├── Issue-Log.xlsx (or Google Sheet)
├── Feature-Comparison-Checklist.xlsx
└── Session-Notes/
    └── YYYY-MM-DD-session-notes.md
```

---

## Testing Environment Setup

### Step 1: Open Both Applications Side-by-Side

1. Open **Procore** in one browser window
2. Open **Alleato** in another browser window
3. Arrange windows side-by-side for easy comparison
4. Navigate to the same project in both systems (if applicable)

### Step 2: Prepare Documentation

1. Open the **Issue-Log** spreadsheet
2. Open the **Feature-Comparison-Checklist**
3. Create a new session notes file: `YYYY-MM-DD-session-notes.md`

### Step 3: Verify Test Data

- Ensure both systems have comparable test data
- If testing specific features, verify prerequisite data exists
- Document any data discrepancies before starting

---

## Testing Procedure

### Daily Testing Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. SELECT MODULE TO TEST                                    │
│     - Pick one module from the Feature Comparison Checklist │
│     - Mark it as "In Progress"                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. OPEN CORRESPONDING PAGES                                 │
│     - Open Procore page for the module                       │
│     - Open Alleato page for the module                       │
│     - Copy both URLs to your session notes                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. VISUAL COMPARISON                                        │
│     - Compare layout and design                              │
│     - Check all visible elements                             │
│     - Note any missing UI components                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. FUNCTIONAL TESTING                                       │
│     - Test each feature/button in Procore                    │
│     - Test the same feature/button in Alleato                │
│     - Document any differences or errors                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. DOCUMENT FINDINGS                                        │
│     - Log all issues in Issue-Log                            │
│     - Take screenshots as required                           │
│     - Update Feature Comparison Checklist                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  6. MOVE TO NEXT MODULE                                      │
│     - Mark current module status in checklist                │
│     - Select next module                                     │
│     - Repeat process                                         │
└─────────────────────────────────────────────────────────────┘
```

### Testing Each Feature

For **EACH feature** in a module:

1. **Identify the feature in Procore**
   - What does it do?
   - How is it accessed?
   - What are the expected inputs/outputs?

2. **Locate the equivalent in Alleato**
   - Does it exist?
   - Is it in the same location?
   - Does it work the same way?

3. **Test the feature**
   - Enter test data
   - Click buttons/links
   - Verify results
   - Check error handling

4. **Document findings**
   - Works correctly → Mark as "Pass" in checklist
   - Has issues → Log in Issue-Log with full documentation
   - Missing → Log as "Missing Feature" in Issue-Log

---

## Issue Documentation Requirements

### MANDATORY: For Every Issue Found

When you discover an error, bug, or discrepancy, you **MUST** document:

#### 1. Screenshots (REQUIRED)

| Screenshot Type | Naming Convention | Example |
|-----------------|-------------------|---------|
| Alleato Error | `ALLEATO_[Module]_[Issue]_[Date].png` | `ALLEATO_Budget_MissingColumn_2024-12-27.png` |
| Procore Reference | `PROCORE_[Module]_[Feature]_[Date].png` | `PROCORE_Budget_ColumnLayout_2024-12-27.png` |

**Screenshot Requirements:**
- Capture the **entire relevant area** (not just a small snippet)
- Include the **browser URL bar** in the screenshot
- If error messages appear, capture them clearly
- Use annotation tools to highlight the specific issue

#### 2. URLs (REQUIRED)

For **every issue**, record both URLs:

```
Alleato URL: https://alleato-app.com/{projectId}/budget
Procore URL: https://app.procore.com/{company_id}/project/{project_id}/budget
```

#### 3. Issue Log Entry (REQUIRED)

Every issue must have a row in the Issue-Log with these fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Issue ID** | Unique identifier | `QA-2024-001` |
| **Date Found** | Date discovered | `2024-12-27` |
| **Module** | Which module | `Budget` |
| **Feature** | Specific feature | `Line Item Creation` |
| **Issue Type** | Bug/Missing/UI Difference | `Bug` |
| **Severity** | Critical/High/Medium/Low | `High` |
| **Description** | Clear description | `Save button does not respond when clicked` |
| **Steps to Reproduce** | Numbered steps | `1. Go to Budget 2. Click Add Line 3. Fill form 4. Click Save` |
| **Expected Result** | What should happen | `Line item should be saved and appear in list` |
| **Actual Result** | What actually happens | `Nothing happens, no error shown` |
| **Alleato URL** | Direct link | `https://alleato-app.com/123/budget` |
| **Procore URL** | Direct link | `https://app.procore.com/456/budget` |
| **Alleato Screenshot** | File path/link | `Screenshots/Alleato/Budget/ALLEATO_Budget_SaveFail_2024-12-27.png` |
| **Procore Screenshot** | File path/link | `Screenshots/Procore/Budget/PROCORE_Budget_SaveButton_2024-12-27.png` |
| **Status** | Open/In Progress/Fixed/Closed | `Open` |
| **Notes** | Additional context | `Tested on Chrome, Firefox - same result` |

---

## Feature Comparison Process

### Comparison Checklist Categories

For each module, evaluate these categories:

#### A. Page Layout & Navigation
- [ ] Page accessible from navigation menu
- [ ] Page title matches expected
- [ ] Breadcrumbs work correctly
- [ ] Back/forward navigation works
- [ ] URL structure is logical

#### B. Data Display
- [ ] All expected columns/fields present
- [ ] Data loads correctly
- [ ] Sorting works
- [ ] Filtering works
- [ ] Search works
- [ ] Pagination works
- [ ] Export to CSV/Excel works

#### C. CRUD Operations
- [ ] Create new record works
- [ ] Read/view record works
- [ ] Update/edit record works
- [ ] Delete record works
- [ ] Bulk operations work (if applicable)

#### D. Form Validation
- [ ] Required fields enforced
- [ ] Field validation works (email, numbers, dates)
- [ ] Error messages displayed correctly
- [ ] Success messages displayed

#### E. Permissions & Access
- [ ] Correct users can access the page
- [ ] Edit permissions enforced
- [ ] View-only mode works correctly

#### F. UI/UX Quality
- [ ] Responsive design (desktop/tablet)
- [ ] Loading states shown
- [ ] Empty states handled
- [ ] Error states handled gracefully

### Comparison Status Codes

Use these codes in your checklist:

| Code | Meaning | Action Required |
|------|---------|-----------------|
| ✅ PASS | Feature works correctly, matches Procore | None |
| ⚠️ PARTIAL | Feature exists but has issues | Log issue |
| ❌ FAIL | Feature broken or has critical bugs | Log critical issue |
| 🚫 MISSING | Feature exists in Procore but not in Alleato | Log as missing feature |
| ➖ N/A | Feature not applicable to Alleato | Note reason |
| 🔄 DIFFERENT | Feature works but UI/flow differs from Procore | Document difference |

---

## Reporting & Communication

### Daily Summary

At the end of each testing session, create a summary:

```markdown
## QA Testing Session Summary - [DATE]

### Modules Tested
- [Module 1]: [Status]
- [Module 2]: [Status]

### Issues Found
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

### Key Findings
1. [Brief description of major issue]
2. [Brief description of major issue]

### Blockers
- [Any issues preventing further testing]

### Next Session Plan
- [Modules to test next]
```

### Weekly Report

Compile weekly findings into a summary report:

1. Total issues found (by severity)
2. Issues resolved vs. outstanding
3. Feature parity percentage by module
4. Recommendations for priority fixes
5. Overall application readiness assessment

---

## Appendix

### A. Issue Severity Definitions

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Application crashes, data loss, security issue | App freezes, data not saving, authentication bypass |
| **High** | Major feature broken, no workaround | Cannot create budget items, export completely fails |
| **Medium** | Feature partially broken, workaround exists | Filter doesn't work but search does |
| **Low** | Minor issue, cosmetic, edge case | Alignment off, typo in label |

### B. Browser Developer Tools

Use Chrome DevTools (F12) to:

1. **Console Tab**: Check for JavaScript errors (red messages)
2. **Network Tab**: Check for failed API calls (red entries)
3. **Take full-page screenshots**: Ctrl+Shift+P → "Capture full size screenshot"

### C. Keyboard Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Screenshot (full screen) | Win+Shift+S | Cmd+Shift+4 |
| Open DevTools | F12 | Cmd+Option+I |
| Refresh page | Ctrl+F5 | Cmd+Shift+R |
| Copy URL | Ctrl+L, Ctrl+C | Cmd+L, Cmd+C |

### D. Common Procore URLs

```
Procore Home: https://app.procore.com/
Project List: https://app.procore.com/{company_id}/projects
Budget Tool: https://app.procore.com/{company_id}/project/{project_id}/budget
Commitments: https://app.procore.com/{company_id}/project/{project_id}/commitments
```

### E. Common Alleato URLs

```
Alleato Home: [Your Alleato URL]
Project List: [Your Alleato URL]/dashboard
Budget Tool: [Your Alleato URL]/{projectId}/budget
Commitments: [Your Alleato URL]/{projectId}/commitments
```

---

## Quick Reference Card

### When You Find an Issue:

```
1. STOP - Don't move on yet
2. SCREENSHOT - Capture both Alleato and Procore
3. SAVE URLS - Copy both page URLs
4. LOG IT - Add entry to Issue-Log with ALL required fields
5. CONTINUE - Move to next feature
```

### Naming Convention Cheat Sheet:

```
Screenshots:
  [APP]_[Module]_[Issue/Feature]_[YYYY-MM-DD].png

Session Notes:
  YYYY-MM-DD-session-notes.md

Issue IDs:
  QA-YYYY-###
```

---

**Document Owner:** [Your Name]
**Approved By:** [Manager Name]
**Review Date:** Quarterly
