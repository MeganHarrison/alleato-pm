# Procore Budget Comprehensive Crawl - Summary Report

**Generated:** 2025-12-27
**Starting URL:** https://us02.procore.com/webclients/host/companies/562949953443325/projects/562949955214786/tools/budgets
**Secondary Target:** https://us02.procore.com/companies/562949953443325/budget_templates (Configure Budget Views)

## Crawl Statistics

- **Total Pages Captured:** 40 pages
- **Total Links Discovered:** 2,149 links across all pages
- **Total Clickable Elements:** 469 buttons/interactive elements
- **Total Dropdown Menus:** 226 dropdown/menu triggers
- **Dropdown Screenshots Captured:** 13 dropdown states

## Key Pages Captured

### Budget Main Pages

1. **Budget Tool Main** (`budgets`)
   - URL: https://us02.procore.com/.../tools/budgets
   - 7 links, 14 clickables, 10 dropdowns
   - Key buttons: Create, Export, Import, Lock Budget, Analyze Variance
   - Tables: Budget values table with headers (Calculation Method, Unit Qty, UOM, Unit Cost, Original Budget)

2. **Configure Budget Views** (`budget_templates`)
   - URL: https://us02.procore.com/companies/562949953443325/budget_templates
   - 50 links, 8 clickables, 51 tabs
   - 3 tables including view configuration table
   - Related pages discovered:
     - Forecasting templates
     - Budget Change Migration
     - Budget Change configurable field sets

### Admin & Configuration Pages

3. **Company Home** - 60 links, 4 clickables, 14 dropdowns
4. **ERP Integrations** - 19 links, 4 clickables, 2 dropdowns
5. **Account Information** - 45 links, 2 clickables
6. **App Installations** - 52 links, 10 clickables, 3 dropdowns
7. **Company Information** - 46 links, 27 clickables, 2 dropdowns
8. **Currency Configuration** - 46 links, 4 clickables, 2 dropdowns
9. **Early Access Features** - 45 links, 31 clickables
10. **Settings** - 48 links, 13 clickables, 4 dropdowns
11. **Webhooks** - 46 links, 15 clickables, 8 dropdowns

### Budget-Related Configuration

12. **Forecast Templates** - 50 links, 5 clickables
13. **Budget Change Migrations** - 53 links, 3 clickables
14. **WBS (Work Breakdown Structure)** - 9 links, 4 clickables
15. **Expense Allocations** - 47 links, 2 clickables

### Project Templates & Setup

16. **Project Template** - 47 links, 43 clickables, 5 dropdowns
17. **Project Templates List** - 48 links, 31 clickables, 13 dropdowns
18. **Project Dates** - 46 links, 3 clickables
19. **Project Roles** - 46 links, 3 clickables

### Additional Tools

20. **Change Management Configurations** - 45 links, 31 clickables, 2 dropdowns
21. **Contracts** - 48 links, 3 clickables
22. **Daily Log Types** - 48 links, 2 clickables
23. **Meeting Templates** - 49 links, 9 clickables, 2 dropdowns
24. **Trades** - 46 links, 3 clickables
25. **Unit of Measure Master List** - 45 links, 42 clickables
26. **Root Cause Analysis** - 46 links, 5 clickables
27. **Document Security** - 6 links, 4 clickables, 2 dropdowns
28. **Single Sign-On Configurations** - 45 links, 2 clickables
29. **Certification Analytics** - 46 links, 2 clickables
30. **Copilot** (AI features) - 48 links, 3 clickables

## Interactive Elements Discovered

### Main Budget Page Interactive Elements

1. **Create Button** - Dropdown with budget creation options
2. **Export Button** - Dropdown with export format options
3. **Import Button** - Dropdown with import options
4. **Lock Budget Button** - Budget locking functionality
5. **Analyze Variance Button** - Variance analysis tool
6. **More Dropdown** - Additional options menu
7. **Budget View Selector** - "Procore Standard Budget" dropdown
8. **Filter Controls** - Add Group, Add Filter dropdowns

### Budget Templates (Configure Views) Page

1. **Tab Navigation** - 51 tabs for different budget configurations
2. **View Management Table** - Shows:
   - View name
   - Description
   - Projects using the view
   - Created By
   - Date Created
   - Actions column (three-dot menu)
3. **Column Configuration Table** - Shows available columns and descriptions
4. **Help Link** - Links to tutorial: "Set up a new budget view"

## Dropdown Captures

Successfully captured 13 dropdown/menu states:

- Budget page dropdowns (Create, Export, Import)
- Company home dropdowns (Financial Views, Export)
- Settings dropdowns
- Webhooks dropdowns
- App installations dropdown
- Company information dropdown

## Files Generated

### Page Captures
Each page has its own directory with:
- `screenshot.png` - Full-page screenshot
- `dom.html` - Complete DOM snapshot
- `metadata.json` - Page analysis including:
  - Component counts (buttons, forms, tables, etc.)
  - Table structure analysis
  - All links with text and URLs
  - All clickable elements
  - All dropdown triggers

### Reports
- `reports/sitemap-table.md` - Table view of all pages
- `reports/detailed-report.json` - Complete JSON export
- `reports/link-graph.json` - Link relationship graph

## Key Insights

### Budget Functionality Discovered

1. **Budget Views System**
   - Multiple pre-configured budget views
   - Custom view creation capability
   - View templates can be shared across projects
   - Column customization per view

2. **Budget Operations**
   - Create budget items
   - Import budgets (multiple formats)
   - Export budgets (multiple formats)
   - Lock/unlock budget
   - Variance analysis
   - Budget change tracking and migration

3. **Integration Points**
   - ERP integrations for budget sync
   - Forecasting templates
   - Change management workflows
   - Currency configuration for multi-currency budgets
   - WBS (Work Breakdown Structure) integration

4. **Configuration Depth**
   - Configurable field sets for budget changes
   - Custom fields for budget items
   - Budget view templates
   - Forecast templates
   - Budget change migration tools

### Architecture Observations

1. **Modern UI Stack**
   - React-based (styled-components visible in class names)
   - Component library: StyledButton, StyledDropdown, etc.
   - Core design system versioning visible (core-12_25_2, core-12_26_1)

2. **Navigation Structure**
   - Company-level tools
   - Project-level tools
   - Admin/configuration area
   - Contextual help system

3. **Table Complexity**
   - Budget tables with 5+ column types
   - Calculation methods
   - Unit quantities and UOM
   - Cost tracking
   - Multiple table layouts for different views

## Next Steps Recommendations

1. **Deep Dive Analysis**
   - Click through each dropdown to capture menu options
   - Test Create Budget workflow
   - Test Import/Export workflows
   - Analyze budget view configuration options

2. **Additional Pages to Explore**
   - Individual budget line item detail pages
   - Budget change request forms
   - Budget vs. Actual reporting
   - Budget snapshots/versions

3. **Integration Analysis**
   - Review ERP integration capabilities
   - Understand forecasting integration
   - Map change management to budget

4. **Data Model Analysis**
   - Extract budget table schemas
   - Understand view template structure
   - Map relationships between budgets, projects, and cost codes

## Output Location

All captures are stored in:
```
/Users/meganharrison/Documents/github/alleato-procore/scripts/screenshot-capture/procore-budget-crawl/
```

## Crawl Limitations

- Stopped at 50 pages (safety limit)
- Some pages timed out (configurable field sets pages)
- Dropdown menus may need manual clicking for full capture
- Modal dialogs were not triggered
- Form submissions were not attempted

## Success Metrics

✅ Successfully captured main budget page
✅ Successfully captured Configure Budget Views page
✅ Captured 40 related pages through link following
✅ Extracted all interactive elements
✅ Captured 13 dropdown states
✅ Generated comprehensive reports
✅ Created link graph for navigation analysis

---

**Total Crawl Time:** ~14 minutes
**Browser:** Chromium (Playwright)
**Resolution:** 1920x1080
**Authentication:** Successful login maintained throughout crawl
