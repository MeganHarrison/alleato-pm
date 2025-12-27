# QA Issue Log Template

## Instructions

This template provides the structure for tracking all QA issues found during Alleato vs Procore comparison testing.

**To use this template:**
1. Copy the CSV section below into Excel or Google Sheets
2. Or use the markdown table format directly
3. One row per issue - never skip required fields

---

## CSV Format (Import into Excel/Google Sheets)

Copy everything between the triple backticks and save as `Issue-Log.csv`:

```csv
Issue ID,Date Found,Tester,Module,Feature,Issue Type,Severity,Summary,Description,Steps to Reproduce,Expected Result,Actual Result,Alleato URL,Procore URL,Alleato Screenshot Path,Procore Screenshot Path,Browser,Status,Assigned To,Resolution Date,Resolution Notes
QA-2024-001,2024-12-27,Jane Doe,Budget,Line Item Creation,Bug,High,Save button unresponsive,"When attempting to save a new budget line item, the save button does not respond to clicks","1. Navigate to Budget page
2. Click 'Add Line Item'
3. Fill in all required fields
4. Click Save button",Line item should be saved and appear in the budget list,Nothing happens - no error message - no loading state - button appears clickable but has no effect,https://alleato-app.com/project-123/budget/line-item/new,https://app.procore.com/company/project/123/budget/line_items/new,Screenshots/Alleato/Budget/ALLEATO_Budget_SaveFail_2024-12-27.png,Screenshots/Procore/Budget/PROCORE_Budget_SaveButton_2024-12-27.png,Chrome 120,Open,Dev Team,,
```

---

## Markdown Table Format

Use this format for quick documentation in markdown files:

### Issue Log

| Issue ID | Date | Module | Feature | Type | Severity | Summary |
|----------|------|--------|---------|------|----------|---------|
| QA-2024-001 | 2024-12-27 | Budget | Line Item | Bug | High | Save button unresponsive |

### Issue Details Template

For each issue, create a detailed entry like this:

---

## QA-2024-001

**Date Found:** 2024-12-27
**Tester:** [Name]
**Module:** Budget
**Feature:** Line Item Creation

### Classification
- **Issue Type:** Bug | Missing Feature | UI Difference | Performance | Other
- **Severity:** Critical | High | Medium | Low

### Summary
Save button does not respond when creating a new budget line item

### Description
When attempting to save a new budget line item, the save button does not respond to clicks. No loading state appears, no error message is displayed, and the item is not saved.

### Steps to Reproduce
1. Navigate to Budget page (`/{projectId}/budget`)
2. Click "Add Line Item" button
3. Fill in all required fields:
   - Cost Code: 01-0100
   - Description: Test Item
   - Original Budget: $10,000
4. Click the "Save" button
5. Observe: Nothing happens

### Expected vs Actual

| Expected | Actual |
|----------|--------|
| Line item saves to database | Nothing happens |
| Success message appears | No message |
| Redirect to budget list | Stays on form |

### URLs

| Application | URL |
|-------------|-----|
| **Alleato** | https://alleato-app.com/project-123/budget/line-item/new |
| **Procore** | https://app.procore.com/company/project/123/budget/line_items/new |

### Screenshots

| Application | Screenshot |
|-------------|------------|
| **Alleato** | [View Screenshot](./Screenshots/Alleato/Budget/ALLEATO_Budget_SaveFail_2024-12-27.png) |
| **Procore** | [View Screenshot](./Screenshots/Procore/Budget/PROCORE_Budget_SaveButton_2024-12-27.png) |

### Environment
- **Browser:** Chrome 120.0.6099.109
- **OS:** Windows 11
- **Screen Resolution:** 1920x1080

### Console Errors (if any)
```
POST /api/budget/line-items 500 (Internal Server Error)
Uncaught TypeError: Cannot read property 'id' of undefined
```

### Status
- [ ] Open
- [ ] In Progress
- [ ] Fixed
- [ ] Verified
- [ ] Closed

### Resolution
**Assigned To:**
**Resolution Date:**
**Notes:**

---

## Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| Issue ID | Yes | Unique identifier: QA-YYYY-### |
| Date Found | Yes | Date issue was discovered |
| Tester | Yes | Name of person who found issue |
| Module | Yes | Application module (Budget, Commitments, etc.) |
| Feature | Yes | Specific feature within module |
| Issue Type | Yes | Bug, Missing Feature, UI Difference, Performance |
| Severity | Yes | Critical, High, Medium, Low |
| Summary | Yes | One-line description (50 chars max) |
| Description | Yes | Detailed explanation of the issue |
| Steps to Reproduce | Yes | Numbered steps to recreate issue |
| Expected Result | Yes | What should happen |
| Actual Result | Yes | What actually happens |
| Alleato URL | Yes | Direct link to Alleato page |
| Procore URL | Yes | Direct link to equivalent Procore page |
| Alleato Screenshot | Yes | Path to screenshot showing issue |
| Procore Screenshot | Yes | Path to screenshot of working feature |
| Browser | Yes | Browser name and version |
| Status | Yes | Current status of issue |
| Assigned To | No | Developer assigned to fix |
| Resolution Date | No | Date issue was resolved |
| Resolution Notes | No | How the issue was fixed |

---

## Severity Guidelines

### Critical
- Application crashes or becomes unusable
- Data loss or corruption
- Security vulnerabilities
- Cannot perform core business functions
- **Example:** Budget data not saving, authentication broken

### High
- Major feature completely broken
- No reasonable workaround exists
- Significantly impacts user workflow
- **Example:** Cannot create commitments, export fails completely

### Medium
- Feature partially broken
- Workaround available
- Impacts efficiency but not blocking
- **Example:** Sort doesn't work but filter does

### Low
- Minor cosmetic issues
- Edge cases
- Typos or alignment issues
- **Example:** Button slightly misaligned, label typo

---

## Issue Type Definitions

| Type | Description | Documentation Required |
|------|-------------|----------------------|
| **Bug** | Something is broken or not working correctly | Full issue details + console errors |
| **Missing Feature** | Feature exists in Procore but not in Alleato | Procore screenshots + description |
| **UI Difference** | Feature works but looks/behaves differently | Side-by-side screenshots |
| **Performance** | Feature is slow or unresponsive | Load times + network analysis |
| **Data Issue** | Data displayed incorrectly or missing | Database vs UI comparison |

---

## Quick Entry Template

Copy this for rapid issue logging:

```markdown
## QA-2024-XXX

**Date:** YYYY-MM-DD | **Module:** [Module] | **Severity:** [Level]

**Summary:** [One-line description]

**Steps:**
1.
2.
3.

**Expected:**
**Actual:**

**URLs:**
- Alleato:
- Procore:

**Screenshots:** Attached

**Status:** Open
```
