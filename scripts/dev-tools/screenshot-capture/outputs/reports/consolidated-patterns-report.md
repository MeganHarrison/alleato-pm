# Procore UI Patterns - Consolidated Report
Generated: 12/3/2025, 3:03:28 PM

## Executive Summary

This report analyzes 13 Procore pages to identify common UI patterns, components, and architectural decisions.

### Key Statistics
- **Total Pages Analyzed**: 13
- **Pages with Forms**: 2 (15.4%)
- **Pages with Tables**: 7 (53.8%)
- **Pages with Navigation**: 4 (30.8%)
- **Average Actions per Page**: 43.0

## 🎨 CSS Frameworks Detected
- **tailwind**: Used in 13 pages (100.0%)
- **custom**: Used in 13 pages (100.0%)

## 🔘 Common UI Actions

These are the most frequently used action buttons across all pages:

| Action | Occurrences | Present in % of Pages |
|--------|-------------|----------------------|
| Edit | 75 | 576.9% |
| View | 75 | 576.9% |
| Re-Invite | 50 | 384.6% |
| Create | 21 | 161.5% |
| More | 19 | 146.2% |
| -- | 18 | 138.5% |
| Attach File(s) | 17 | 130.8% |
| Invite | 14 | 107.7% |
| SearchCmdK | 12 | 92.3% |
| 1 | 6 | 46.2% |
| Export | 6 | 46.2% |
| Clear All Filters | 4 | 30.8% |
| Filters | 4 | 30.8% |
| Configure | 4 | 30.8% |
| Add Filter | 4 | 30.8% |

## 🧭 Navigation Patterns

### Most Common Navigation Items
- **Recycle Bin**: Found in 2 pages
- **ERP Integrations**: Found in 1 pages
- **Contracts**: Found in 1 pages
- **List**: Found in 1 pages
- **My Items (0)**: Found in 1 pages
- **All Items (75)**: Found in 1 pages
- **Recycle Bin (0)**: Found in 1 pages

## 📊 Table Patterns

### Common Table Headers
The following headers appear most frequently across tables:

| Header | Occurrences |
|--------|------------|
| Comments | 17 |
| Related Items | 17 |
| Attachments | 16 |
| Name | 7 |
| Location | 6 |
| Role | 6 |
| Email | 6 |
| Office | 6 |
| Mobile | 6 |
| Status | 4 |
| Time* | 4 |
| Company | 3 |
| Hours* | 3 |
| Cost Code | 3 |
| Start* | 3 |

**Average Columns per Table**: 7.8

## 📝 Form Patterns

### Common Input Types
| Type | Count |
|------|-------|
| hidden | 64 |
| radio | 10 |

### Most Common Field Names
- **authenticity_token**: Used 64 times
- **pendo-poll-choice-mv0nv7k4vtc**: Used 5 times
- **pendo-poll-choice-j99tszpukj**: Used 5 times

## 🔧 Component Usage Statistics

| Component Type | Pages Using | Percentage |
|----------------|-------------|------------|
| actions | 13 | 100.0% |
| tables | 7 | 53.8% |
| navigation | 4 | 30.8% |
| forms | 2 | 15.4% |
| modals | 1 | 7.7% |

## 📡 API Patterns

### Endpoint Categories
- **RESTful APIs**: 0 unique endpoints
- **GraphQL**: 0 endpoints
- **Other**: 0 endpoints

### Sample RESTful Endpoints

## 💾 Data Models Identified

Based on AI analysis, the following data models were consistently identified:

### Core Entities

### Relationships
- - `budget_id`: Foreign Key linked to Budgets
- - Attributes: `id`, `projectId` (foreign key), `content`, `commitments` (array of Commitment IDs)
- - Attributes: `id`, `contractId` (foreign key), `amount`, `status`, `dateCreated`
- - Attributes: `id`, `email`, `name`, `role`, `accountId` (foreign key)
- - `projectId` (Foreign Key)
- - `contractId` (Foreign Key)
- - `project_id` (Foreign Key to Projects)
- - `assigned_to` (Foreign Key to Users)
- - `log_id`: Foreign Key to Logs
- - `project_id` (Foreign Key referencing Projects)
- - `user_id` (Foreign Key referencing Users)
- - user_id (Foreign Key referencing Users)
- - project_id (Foreign Key referencing Projects)

## 🏗️ Recommended Component Library

Based on the patterns identified, here's a recommended component structure for rebuilding:

### Core Components
1. **Table Component**
   - Sortable headers
   - Action buttons in rows
   - Pagination
   - Bulk actions

2. **Form Components**
   - Text inputs with validation
   - Select dropdowns
   - Date pickers
   - File upload
   - Form groups with labels

3. **Navigation Components**
   - Top navigation bar
   - Breadcrumbs
   - Tab navigation
   - Sidebar menu

4. **Action Components**
   - Primary/Secondary buttons
   - Dropdown menus
   - Icon buttons
   - Bulk action toolbar

5. **Layout Components**
   - Page header with actions
   - Content containers
   - Grid layouts
   - Modal dialogs

## 🚀 Implementation Recommendations

1. **UI Framework**: Based on Tailwind CSS detection, continue using Tailwind for consistency
2. **Component Library**: Build on top of shadcn/ui or similar for rapid development
3. **State Management**: Use Zustand or Redux Toolkit for complex state
4. **Data Fetching**: Implement React Query for API calls and caching
5. **Forms**: Use React Hook Form with Zod validation
6. **Tables**: Consider TanStack Table for complex data grids

## 📋 Next Steps

1. Create a shared component library with the identified patterns
2. Establish a consistent API client with the endpoint patterns
3. Build reusable form and table components first (highest usage)
4. Implement navigation components for consistent UX
5. Create page templates based on common layouts
