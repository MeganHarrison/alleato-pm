# Table Columns by Page Analysis

This document provides a comprehensive analysis of table columns displayed on each page from the Procore DOM captures. This information is crucial for understanding the data structure and requirements for each module.

## Financial Pages

### Budget Page (`goodwill_bart_-_budget`)
**Table Headers:**
- Calculation Method
- Unit Qty
- UOM (Units of Measure)
- Unit Cost
- Original Budget

**Key Actions:**
- Create
- Export
- Resend to ERP
- Unlock Budget
- Analyze Variance

### Commitments Page (`goodwill_bart_-_commitments`)
**Table Headers:** No table data found in the capture (likely empty state)

**Key Actions:**
- Create
- Export
- Clear All Filters
- Configure
- Filters

**Navigation:**
- Contracts
- Recycle Bin

### Prime Contracts Page (`goodwill_bart_-_prime_contracts`)
**Table Headers:** No table data found in the capture (likely empty state)

**Key Actions:**
- Create
- Export
- Clear All Filters
- Configure
- Filters

## Company/Project Management

### Portfolio Page (`company_portfolio`)
**Table Headers:**
- (Checkbox/Select column)
- Name
- Project Number
- Address
- City
- State
- ZIP
- Phone
- Status
- Stage
- Type
- Notes

**Row Count:** 12 projects displayed

**Key Actions:**
- Create Project
- Search

## Other Module Pages

### Daily Log (`goodwill_bart_-_daily_log`)
Based on field inventory, includes columns for:
- Time Observed
- Type
- Delay
- Sky
- Temperature
- Precipitation
- Wind
- Comments
- Attachments
- Related Items
- Company
- Workers
- Hours
- Total Hours
- Location
- Cost Code

### Directory (`goodwill_bart_-_directory`)
Based on field inventory, likely includes standard directory columns.

### Documents (`goodwill_bart_-_documents`)
**Special Headers Found:**
- NameSortable column
- Created On / Latest VersionSortable column

### Forms (`goodwill_bart_-_forms`)
**Common Columns:**
- Name
- Status
- Role
- Email
- Office
- Mobile
- Overview
- Overdue/Next 7 Days/> 7 Days (status indicators)
- Total Open
- Item Type
- Details
- Due Date

### Incidents (`goodwill_bart_-_incidents`)
Similar structure to Forms with:
- Role
- Email
- Office
- Mobile
- Overview
- Status indicators
- Item Type
- Details
- Due Date

### Project Home (`goodwill_bart_-_project_home`)
Similar overview structure with:
- Overview
- Status indicators (Overdue/Next 7 Days/> 7 Days)
- Total Open
- Item Type
- Details
- Due Date

### Reports (`goodwill_bart_-_reports`)
**Table Headers:**
- Report NameSortable column
- DescriptionSortable column

### Specifications (`goodwill_bart_-_specifications`)
**Table Headers:**
- Number
- Description
- New Number
- New Description
- +Add

## Key Observations

1. **Financial modules** (Budget, Commitments, Prime Contracts) appear to have minimal table data in the captures, suggesting either empty states or lazy-loaded content.

2. **Portfolio page** has the most comprehensive table structure with 12 columns covering project metadata.

3. **Common patterns** across pages include:
   - Sortable columns (indicated by "Sortable column" suffix)
   - Status/overview columns for tracking items
   - Action columns for CRUD operations
   - Related items and attachments columns

4. **Field types** commonly used:
   - Text fields (names, descriptions)
   - Numeric fields (quantities, costs, phone numbers)
   - Date fields (due dates, created dates)
   - Status/enum fields (status, stage, type)
   - Relationship fields (related items, company associations)

## Recommendations for Implementation

1. **Create reusable table components** that can handle:
   - Sortable columns
   - Checkbox selection
   - Action buttons
   - Status indicators
   - Attachments/file columns

2. **Implement common column types** as separate components:
   - TextColumn
   - NumberColumn
   - DateColumn
   - StatusColumn
   - ActionsColumn

3. **Design flexible table configuration** system to easily define which columns appear on each page.

4. **Consider pagination** for tables with many rows (Portfolio page shows 12 rows).

5. **Implement filter and search functionality** as most pages include these features.