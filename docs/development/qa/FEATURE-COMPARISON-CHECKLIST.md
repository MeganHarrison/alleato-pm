# Feature Comparison Checklist

## Alleato vs Procore Feature Parity Testing

**Instructions:** Work through each module systematically. Mark the status of each feature using the status codes below.

---

## Status Codes

| Code | Meaning | Next Action |
|------|---------|-------------|
| ✅ | Pass - Works correctly | None |
| ⚠️ | Partial - Has issues | Log in Issue-Log |
| ❌ | Fail - Broken/Critical | Log critical issue |
| 🚫 | Missing - Not in Alleato | Log as missing feature |
| ➖ | N/A - Not applicable | Note reason |
| 🔄 | Different - Works differently | Document difference |
| ⬜ | Not Tested | Test this |

---

## Module 1: Budget

**Alleato Route:** `/{projectId}/budget`
**Procore Equivalent:** Budget Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |
| Correct page title | ⬜ | | |
| Breadcrumb navigation works | ⬜ | | |

### Budget Overview
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Budget summary displays | ⬜ | | |
| Original budget total | ⬜ | | |
| Approved changes shown | ⬜ | | |
| Revised budget calculated | ⬜ | | |
| Committed costs shown | ⬜ | | |
| Projected final cost | ⬜ | | |

### Budget Line Items
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all line items | ⬜ | | |
| Cost code column | ⬜ | | |
| Description column | ⬜ | | |
| Original budget amount | ⬜ | | |
| Budget changes column | ⬜ | | |
| Revised budget column | ⬜ | | |
| Committed column | ⬜ | | |
| Direct costs column | ⬜ | | |

### Line Item CRUD Operations
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create new line item | ⬜ | | |
| Edit existing line item | ⬜ | | |
| Delete line item | ⬜ | | |
| Bulk edit line items | ⬜ | | |
| Copy line items | ⬜ | | |

### Budget Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Filter by cost code | ⬜ | | |
| Search functionality | ⬜ | | |
| Sort columns | ⬜ | | |
| Export to CSV | ⬜ | | |
| Export to Excel | ⬜ | | |
| Print view | ⬜ | | |
| Budget lock/unlock | ⬜ | | |

### Budget Views
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Standard view | ⬜ | | |
| Detailed view | ⬜ | | |
| Summary view | ⬜ | | |
| Custom views | ⬜ | | |
| Save view preferences | ⬜ | | |

---

## Module 2: Commitments

**Alleato Route:** `/{projectId}/commitments`
**Procore Equivalent:** Commitments Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |
| Tabs for commitment types | ⬜ | | |

### Commitment List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all commitments | ⬜ | | |
| Commitment number column | ⬜ | | |
| Vendor/company column | ⬜ | | |
| Status column | ⬜ | | |
| Contract value column | ⬜ | | |
| Approved changes column | ⬜ | | |
| Revised value column | ⬜ | | |
| % Complete column | ⬜ | | |

### Commitment Types
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Subcontracts | ⬜ | | |
| Purchase orders | ⬜ | | |

### Commitment CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create new commitment | ⬜ | | |
| Edit commitment | ⬜ | | |
| Delete commitment | ⬜ | | |
| Void commitment | ⬜ | | |
| Duplicate commitment | ⬜ | | |

### Commitment Details
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| General information tab | ⬜ | | |
| Schedule of values | ⬜ | | |
| Change orders tab | ⬜ | | |
| Invoices tab | ⬜ | | |
| Attachments tab | ⬜ | | |

### Commitment Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Search commitments | ⬜ | | |
| Filter by status | ⬜ | | |
| Filter by vendor | ⬜ | | |
| Sort columns | ⬜ | | |
| Export list | ⬜ | | |

---

## Module 3: Contracts (Prime Contracts)

**Alleato Route:** `/{projectId}/contracts`
**Procore Equivalent:** Prime Contracts

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Contract List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all contracts | ⬜ | | |
| Contract number | ⬜ | | |
| Contract title | ⬜ | | |
| Status | ⬜ | | |
| Original value | ⬜ | | |
| Revised value | ⬜ | | |

### Contract CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create new contract | ⬜ | | |
| Edit contract | ⬜ | | |
| Delete contract | ⬜ | | |

### Contract Details
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| General information | ⬜ | | |
| Schedule of values | ⬜ | | |
| Change orders | ⬜ | | |
| Invoices | ⬜ | | |

---

## Module 4: Change Orders

**Alleato Route:** `/{projectId}/change-orders`
**Procore Equivalent:** Change Orders

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Change Order List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all change orders | ⬜ | | |
| CO number | ⬜ | | |
| Title/description | ⬜ | | |
| Status | ⬜ | | |
| Amount | ⬜ | | |
| Related commitment | ⬜ | | |

### Change Order Types
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Commitment change orders | ⬜ | | |
| Prime contract change orders | ⬜ | | |
| Potential change orders | ⬜ | | |

### Change Order CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create change order | ⬜ | | |
| Edit change order | ⬜ | | |
| Delete change order | ⬜ | | |
| Approve change order | ⬜ | | |

### Change Order Workflow
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Draft status | ⬜ | | |
| Pending approval | ⬜ | | |
| Approved status | ⬜ | | |
| Rejected status | ⬜ | | |

---

## Module 5: Invoices

**Alleato Route:** `/{projectId}/invoices`
**Procore Equivalent:** Invoicing

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Invoice List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all invoices | ⬜ | | |
| Invoice number | ⬜ | | |
| Vendor | ⬜ | | |
| Invoice date | ⬜ | | |
| Due date | ⬜ | | |
| Amount | ⬜ | | |
| Status | ⬜ | | |

### Invoice CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create invoice | ⬜ | | |
| Edit invoice | ⬜ | | |
| Delete invoice | ⬜ | | |
| Approve invoice | ⬜ | | |

### Invoice Details
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Line items | ⬜ | | |
| Payment applications | ⬜ | | |
| Retainage | ⬜ | | |
| Attachments | ⬜ | | |

---

## Module 6: Direct Costs

**Alleato Route:** `/{projectId}/direct-costs`
**Procore Equivalent:** Direct Costs

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Direct Cost List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all direct costs | ⬜ | | |
| Date | ⬜ | | |
| Description | ⬜ | | |
| Vendor | ⬜ | | |
| Cost code | ⬜ | | |
| Amount | ⬜ | | |

### Direct Cost CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create direct cost | ⬜ | | |
| Edit direct cost | ⬜ | | |
| Delete direct cost | ⬜ | | |
| Bulk import | ⬜ | | |

---

## Module 7: RFIs

**Alleato Route:** `/{projectId}/rfis`
**Procore Equivalent:** RFIs Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### RFI List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all RFIs | ⬜ | | |
| RFI number | ⬜ | | |
| Subject | ⬜ | | |
| Status | ⬜ | | |
| Ball in court | ⬜ | | |
| Due date | ⬜ | | |
| Days open | ⬜ | | |

### RFI CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create RFI | ⬜ | | |
| Edit RFI | ⬜ | | |
| Delete RFI | ⬜ | | |
| Close RFI | ⬜ | | |

### RFI Workflow
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Draft status | ⬜ | | |
| Open status | ⬜ | | |
| Answered status | ⬜ | | |
| Closed status | ⬜ | | |
| Overdue indicator | ⬜ | | |

### RFI Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Assign to user | ⬜ | | |
| Add responses | ⬜ | | |
| Attachments | ⬜ | | |
| Email notifications | ⬜ | | |
| Link to drawings | ⬜ | | |

---

## Module 8: Submittals

**Alleato Route:** `/{projectId}/submittals`
**Procore Equivalent:** Submittals Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Submittal List
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all submittals | ⬜ | | |
| Submittal number | ⬜ | | |
| Title | ⬜ | | |
| Spec section | ⬜ | | |
| Status | ⬜ | | |
| Ball in court | ⬜ | | |
| Required date | ⬜ | | |

### Submittal CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create submittal | ⬜ | | |
| Edit submittal | ⬜ | | |
| Delete submittal | ⬜ | | |

### Submittal Workflow
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Draft | ⬜ | | |
| Submitted | ⬜ | | |
| Under review | ⬜ | | |
| Approved | ⬜ | | |
| Revise and resubmit | ⬜ | | |

---

## Module 9: Punch List

**Alleato Route:** `/{projectId}/punch-list`
**Procore Equivalent:** Punch List Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Punch List Items
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| List all items | ⬜ | | |
| Item number | ⬜ | | |
| Description | ⬜ | | |
| Location | ⬜ | | |
| Assignee | ⬜ | | |
| Status | ⬜ | | |
| Priority | ⬜ | | |

### Punch List CRUD
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Create item | ⬜ | | |
| Edit item | ⬜ | | |
| Delete item | ⬜ | | |
| Close item | ⬜ | | |

### Punch List Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Photo attachments | ⬜ | | |
| Link to drawings | ⬜ | | |
| Filter by status | ⬜ | | |
| Filter by assignee | ⬜ | | |
| Bulk actions | ⬜ | | |

---

## Module 10: Schedule

**Alleato Route:** `/{projectId}/schedule`
**Procore Equivalent:** Schedule Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Schedule Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Gantt chart view | ⬜ | | |
| List view | ⬜ | | |
| Calendar view | ⬜ | | |
| Task dependencies | ⬜ | | |
| Milestones | ⬜ | | |
| Critical path | ⬜ | | |
| Import from P6/MS Project | ⬜ | | |

---

## Module 11: Documents

**Alleato Route:** `/{projectId}/documents`
**Procore Equivalent:** Documents Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Document Management
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Folder structure | ⬜ | | |
| Upload documents | ⬜ | | |
| Download documents | ⬜ | | |
| Move documents | ⬜ | | |
| Delete documents | ⬜ | | |
| Version control | ⬜ | | |
| Search documents | ⬜ | | |

---

## Module 12: Drawings

**Alleato Route:** `/{projectId}/drawings`
**Procore Equivalent:** Drawings Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Drawing Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Drawing list | ⬜ | | |
| Drawing sets | ⬜ | | |
| Drawing viewer | ⬜ | | |
| Markup tools | ⬜ | | |
| Revisions | ⬜ | | |
| Upload drawings | ⬜ | | |
| Link to RFIs | ⬜ | | |

---

## Module 13: Photos

**Alleato Route:** `/{projectId}/photos`
**Procore Equivalent:** Photos Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Photo Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Photo gallery | ⬜ | | |
| Photo albums | ⬜ | | |
| Upload photos | ⬜ | | |
| Delete photos | ⬜ | | |
| Photo details | ⬜ | | |
| Location tagging | ⬜ | | |
| Date filtering | ⬜ | | |

---

## Module 14: Meetings

**Alleato Route:** `/{projectId}/meetings`
**Procore Equivalent:** Meetings Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Meeting Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Meeting list | ⬜ | | |
| Create meeting | ⬜ | | |
| Meeting agenda | ⬜ | | |
| Attendees | ⬜ | | |
| Meeting minutes | ⬜ | | |
| Action items | ⬜ | | |
| Meeting series | ⬜ | | |

---

## Module 15: Daily Log

**Alleato Route:** `/{projectId}/daily-log`
**Procore Equivalent:** Daily Log Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Daily Log Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Daily log entries | ⬜ | | |
| Weather conditions | ⬜ | | |
| Manpower tracking | ⬜ | | |
| Equipment log | ⬜ | | |
| Delivery log | ⬜ | | |
| Visitor log | ⬜ | | |
| Notes/observations | ⬜ | | |
| Photos | ⬜ | | |

---

## Module 16: Directory

**Alleato Route:** `/{projectId}/directory`
**Procore Equivalent:** Directory Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Directory Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Company list | ⬜ | | |
| Contact list | ⬜ | | |
| Add company | ⬜ | | |
| Add contact | ⬜ | | |
| Edit company/contact | ⬜ | | |
| Search directory | ⬜ | | |
| Filter by role | ⬜ | | |
| Export contacts | ⬜ | | |

---

## Module 17: Emails

**Alleato Route:** `/{projectId}/emails`
**Procore Equivalent:** Emails Tool

### Page Access & Navigation
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Accessible from main navigation | ⬜ | | |
| Page loads without errors | ⬜ | | |

### Email Features
| Feature | Status | Notes | Issue ID |
|---------|--------|-------|----------|
| Email list | ⬜ | | |
| Compose email | ⬜ | | |
| Reply to email | ⬜ | | |
| Forward email | ⬜ | | |
| Attachments | ⬜ | | |
| Email templates | ⬜ | | |
| Search emails | ⬜ | | |

---

## Summary Tracking

### Testing Progress

| Module | Total Features | Tested | Pass | Partial | Fail | Missing |
|--------|---------------|--------|------|---------|------|---------|
| Budget | | | | | | |
| Commitments | | | | | | |
| Contracts | | | | | | |
| Change Orders | | | | | | |
| Invoices | | | | | | |
| Direct Costs | | | | | | |
| RFIs | | | | | | |
| Submittals | | | | | | |
| Punch List | | | | | | |
| Schedule | | | | | | |
| Documents | | | | | | |
| Drawings | | | | | | |
| Photos | | | | | | |
| Meetings | | | | | | |
| Daily Log | | | | | | |
| Directory | | | | | | |
| Emails | | | | | | |
| **TOTAL** | | | | | | |

### Feature Parity Score

```
Feature Parity % = (Pass + Partial) / Total Features × 100
```

**Current Score:** _____%

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Tester | | | |
| Reviewed By | | | |
| Approved By | | | |
