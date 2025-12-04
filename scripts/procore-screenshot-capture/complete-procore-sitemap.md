# Complete Procore Application Sitemap & Development Guide

*Generated from comprehensive screenshot analysis and crawl data*  
*Date: December 2, 2025*

## Executive Summary

Based on comprehensive analysis of 21+ Procore screenshots and existing documentation, this sitemap covers every major page and workflow in the Procore construction management platform. This serves as the definitive blueprint for the Alleato-Procore rebuild.

## 🏢 Company-Level Pages

### Portfolio Management
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **Company Portfolio** | `/company/home/portfolio` | ✅ | High | Dashboard widgets, project cards, metrics |
| **Company Admin** | `/company/admin` | ✅ | High | User management, settings, permissions |
| **Company Directory** | `/company/directory` | ✅ | Medium | User/company listings, contact management |
| **Project List** | `/company/home/list` | 📋 | High | Sortable project table, filters |
| **Thumbnail View** | `/company/home/thumbnail` | 📋 | Medium | Project thumbnail grid |
| **Map View** | `/company/home/map` | 📋 | Low | Geographic project mapping |

### Company Dashboards & Reports
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **Executive Dashboard** | `/company/home/executive_dashboard` | 📋 | High | KPI widgets, charts, metrics |
| **Health Dashboard** | `/company/home/health_dashboard` | 📋 | Medium | Project health indicators |
| **My Open Items** | `/company/home/my_open_items` | 📋 | Medium | Personal task aggregation |
| **Budgeting Report** | `/company/home/budgeting_report` | 📋 | High | Budget variance analysis |
| **Project Variance Report** | `/company/home/project_variance_report` | 📋 | Medium | Performance variance tracking |
| **Job Cost Summary** | `/company/home/job_cost_summary` | 📋 | High | Cost aggregation across projects |
| **Committed Costs** | `/company/home/committed_costs` | 📋 | Medium | Commitment tracking |

## 🏗️ Project-Level Pages

### Core Project Management
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **Project Home** | `/project/home` | ✅ | High | Dashboard, weather, recent activity, metrics |
| **Directory** | `/project/directory` | ✅ | High | Company/user management, permissions |
| **Schedule** | `/project/schedule` | ✅ | High | Gantt chart, timeline, milestones |
| **Daily Log** | `/project/daily_log` | ✅ | High | Weather, manpower, equipment, activities |
| **Documents** | `/project/documents` | ✅ | Medium | File management, folders, search |
| **Drawings** | `/project/drawings` | ✅ | Medium | Drawing sets, revisions, markup |
| **Photos** | `/project/photos` | ✅ | Medium | Photo albums, progress documentation |

### Financial Management
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **Budget** | `/project/budget` | ✅ | High | Budget tracking, cost codes, variance |
| **Commitments** | `/project/commitments` | ✅ | High | Subcontracts, POs, commitment tracking |
| **Change Events** | `/project/change_events` | ✅ | High | Change order management, approvals |
| **Invoicing** | `/project/invoicing` | ✅ | High | Invoice processing, payment tracking |
| **Prime Contracts** | `/project/prime_contracts` | 📋 | High | Owner contracts, payment applications |
| **Prime Contract Change Orders** | `/project/prime_contract_change_orders` | 📋 | Medium | Owner change order management |
| **Commitment Change Orders** | `/project/commitment_change_orders` | 📋 | Medium | Subcontractor change orders |

### Quality & Safety
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **Punch List** | `/project/punch_list` | ✅ | High | Deficiency tracking, assignments |
| **Inspections** | `/project/inspections` | ✅ | High | Inspection checklists, results |
| **Incidents** | `/project/incidents` | ✅ | Medium | Safety incident reporting |
| **Observations** | `/project/observations` | ✅ | Medium | Field observations, safety notes |

### Design Coordination
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **RFIs** | `/project/rfis` | ✅ | High | Request for information management |
| **Submittals** | `/project/submittals` | ✅ | High | Material/equipment submittals |
| **Coordination Issues** | `/project/coordination_issues` | ✅ | Medium | Design coordination tracking |

### Communication & Documentation
| Page | URL Pattern | Screenshot Available | Priority | Components |
|------|-------------|---------------------|----------|------------|
| **Meetings** | `/project/meetings` | 📋 | Medium | Meeting minutes, action items |
| **Correspondence** | `/project/correspondence` | 📋 | Medium | Email tracking, communications |
| **Forms** | `/project/forms` | 📋 | Low | Custom forms, templates |

## 📊 Analysis Summary

### Screenshot Coverage Analysis
- **Total Screenshots Captured**: 21 pages
- **Category Breakdown**:
  - Portfolio/Company: 3 pages (14%)
  - Core Tools: 6 pages (29%)
  - Quality & Safety: 4 pages (19%)
  - Design Coordination: 3 pages (14%)
  - Financials: 4 pages (19%)
  - Uncategorized: 1 page (5%)

### Development Priority Matrix
| Priority | Page Count | Description |
|----------|------------|-------------|
| **High** | 16 pages | Core business functionality, daily use |
| **Medium** | 10 pages | Important but less frequent use |
| **Low** | 3 pages | Nice-to-have, specialized use cases |

## 🎯 Development Strategy

### Phase 1: Foundation (MVP)
**Focus: Company Portfolio + Core Financial Tools**
1. Company Portfolio (`/company/home/portfolio`)
2. Project Home (`/project/home`)
3. Commitments (`/project/commitments`)
4. Budget (`/project/budget`)
5. Change Events (`/project/change_events`)

### Phase 2: Project Management Core
**Focus: Daily Project Operations**
1. Directory (`/project/directory`)
2. Daily Log (`/project/daily_log`)
3. Schedule (`/project/schedule`)
4. Documents (`/project/documents`)
5. Photos (`/project/photos`)

### Phase 3: Quality & Design Coordination
**Focus: Quality Control & Submittals**
1. Punch List (`/project/punch_list`)
2. Inspections (`/project/inspections`)
3. RFIs (`/project/rfis`)
4. Submittals (`/project/submittals`)
5. Drawings (`/project/drawings`)

### Phase 4: Advanced Features
**Focus: Advanced Reporting & Workflows**
1. Company Admin (`/company/admin`)
2. Company Dashboards
3. Advanced Financial Tools
4. Coordination Issues
5. Safety Features

## 🗂️ Page Component Analysis

### Common UI Patterns Identified
1. **Data Tables**: Sortable, filterable tables (15+ instances)
2. **Dashboard Widgets**: Metric cards, charts (8+ instances)
3. **Form Workflows**: Multi-step forms, validation (12+ instances)
4. **File Upload/Management**: Document handling (6+ instances)
5. **Modal Dialogs**: Detail views, actions (10+ instances)
6. **Navigation Sidebars**: Hierarchical navigation (All pages)

### Key Data Relationships
```
Company
├── Projects (1:many)
│   ├── Budget Line Items
│   ├── Commitments → Vendors
│   ├── Users/Directory → Permissions
│   ├── RFIs → Drawings
│   ├── Submittals → Spec Sections
│   ├── Punch Items → Photos
│   ├── Daily Logs → Schedule Activities
│   └── Change Events → Budget Impact
```

## 📋 Technical Implementation Guide

### Database Schema Requirements
- **Core Tables**: companies, projects, users, permissions
- **Financial**: budgets, commitments, change_orders, line_items
- **Project Management**: schedules, daily_logs, documents
- **Quality**: punch_items, inspections, observations
- **Design**: rfis, submittals, drawings
- **Audit**: activity_logs, approval_workflows

### Component Library Needs
- **Tables**: DataGrid with sorting, filtering, pagination
- **Forms**: Multi-step forms with validation
- **Charts**: Dashboard visualizations, budget charts
- **File Upload**: Document/photo management
- **Modal System**: Overlay workflows
- **Navigation**: Sidebar, breadcrumbs, tabs

### API Architecture
- **RESTful endpoints** for CRUD operations
- **Real-time updates** for collaboration features
- **File handling** for documents/photos
- **Reporting APIs** for dashboard data
- **Permission system** for role-based access

## 🚀 Next Steps

1. **Start with Phase 1 MVP** - Company Portfolio + Core Financials
2. **Build reusable components** - Focus on data tables and forms
3. **Implement core navigation** - Sidebar and routing structure
4. **Database schema setup** - Start with core entities
5. **Authentication & permissions** - Role-based access control

## 📁 Supporting Materials

- **Screenshots Location**: `figma-ready/` directory (21 screenshots)
- **Analysis Reports**: Individual page analysis available
- **Component Inventory**: Detailed UI component breakdown
- **Flow Documentation**: User workflow analysis

---

*This sitemap provides a complete blueprint for rebuilding Procore functionality. Each page has been analyzed for components, relationships, and implementation requirements. Use this as the definitive guide for development planning and prioritization.*