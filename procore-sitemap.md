# Procore Application Sitemap

## Company Level Pages

### Home & Dashboards
- **Project List** `/company/home/list` - List view of all projects
- **Portfolio View** `/company/home/portfolio` - Portfolio overview of projects
- **Thumbnail View** `/company/home/thumbnail` - Visual thumbnail grid of projects
- **Map View** `/company/home/map` - Geographic map of project locations
- **Executive Dashboard** `/company/home/executive_dashboard` - High-level executive metrics
- **Health Dashboard** `/company/home/health_dashboard` - Project health indicators
- **My Open Items** `/company/home/my_open_items` - Personal action items across projects

### Company Reports
- **Budgeting Report** `/company/home/budgeting_report` - Budget variance analysis
- **Project Variance Report** `/company/home/project_variance_report` - Project performance variance
- **Job Cost Summary** `/company/home/job_cost_summary` - Consolidated job costs
- **Committed Costs** `/company/home/committed_costs` - Committed cost tracking

## Project Level Pages

### Project Management
- **Project Home** `/project/home` - Project dashboard and overview
  - Weather widget
  - Overview details
  - Recent activity
  - Project metrics

### Team & Communication
- **Directory** `/project/directory` - Project team contacts and companies
  - Company listings
  - User profiles
  - Contact information
  - Permissions management

- **Meetings** `/project/meetings` - Meeting minutes and agendas
  - Meeting topics
  - Action items
  - Meeting history

- **Correspondence** `/project/correspondence` - Project communications
  - Email tracking
  - Communication logs

### Documentation & Submittals
- **RFIs** `/project/rfis` - Requests for Information
  - Open RFIs
  - RFI responses
  - RFI history

- **Submittals** `/project/submittals` - Material and equipment submittals
  - Submittal packages
  - Approval workflow
  - Submittal register

- **Drawings** `/project/drawings` - Project drawings and plans
  - Drawing sets
  - Revisions
  - Markup tools

- **Forms** `/project/forms` - Project forms and templates
  - Custom forms
  - Form submissions

### Schedule & Daily Activities
- **Schedule** `/project/schedule` - Project schedule and timeline
  - Gantt chart
  - Milestones
  - Critical path

- **Daily Log** `/project/daily_log` - Daily reports and logs
  - Weather conditions
  - Manpower
  - Equipment
  - Daily activities
  - Safety observations

### Financial Management
- **Budget** `/project/budget` - Project budget tracking
  - Budget line items
  - Cost codes
  - Forecast vs actual

- **Prime Contracts** `/project/prime_contracts` - Owner contracts
  - Contract details
  - Payment applications
  - Contract modifications

- **Prime Contract Change Orders** `/project/prime_contract_change_orders` - Owner change orders
  - PCO log
  - Approval workflow
  - Cost impacts

- **Commitments** `/project/commitments` - Subcontracts and POs
  - Subcontractor agreements
  - Purchase orders
  - Commitment details

- **Commitment Change Orders** `/project/commitment_change_orders` - Subcontractor change orders
  - CCO log
  - Approval workflow
  - Cost tracking

### Quality & Safety
- **Inspections** `/project/inspections` - Quality and safety inspections
  - Inspection checklists
  - Inspection results
  - Corrective actions

- **Punch List** `/project/punch_list` - Deficiency tracking
  - Punch items
  - Status tracking
  - Assignment management
  - Location mapping

### Media
- **Photos** `/project/photos` - Project photo documentation
  - Photo albums
  - Progress photos
  - Site conditions

## Navigation Structure

```
Procore
├── Company Level
│   ├── Home
│   │   ├── Project List View
│   │   ├── Portfolio View
│   │   ├── Thumbnail View
│   │   ├── Map View
│   │   └── My Open Items
│   ├── Dashboards
│   │   ├── Executive Dashboard
│   │   └── Health Dashboard
│   └── Reports
│       ├── Budgeting Report
│       ├── Project Variance Report
│       ├── Job Cost Summary
│       └── Committed Costs
│
└── Project Level (per project)
    ├── Project Home
    ├── Project Management
    │   ├── Directory
    │   ├── Meetings
    │   └── Correspondence
    ├── Documentation
    │   ├── RFIs
    │   ├── Submittals
    │   ├── Drawings
    │   └── Forms
    ├── Field Management
    │   ├── Schedule
    │   ├── Daily Log
    │   ├── Inspections
    │   └── Punch List
    ├── Financial
    │   ├── Budget
    │   ├── Prime Contracts
    │   ├── Prime Contract Change Orders
    │   ├── Commitments
    │   └── Commitment Change Orders
    └── Resources
        └── Photos
```

## Key Features by Module

### Directory
- Company management
- User permissions
- Contact information
- Role assignments

### RFIs
- Create and track RFIs
- Response management
- Due date tracking
- Distribution lists

### Submittals
- Submittal creation
- Approval workflows
- Spec section linking
- Response tracking

### Budget
- Cost code structure
- Budget vs actual
- Forecasting
- Change management

### Daily Log
- Weather tracking
- Manpower logs
- Equipment usage
- Daily observations
- Visitor logs

### Punch List
- Location-based items
- Photo attachments
- Status workflows
- Assignment tracking

## Access Patterns

1. **Company Administrator**: Full access to company and all project pages
2. **Project Manager**: Project-level access with financial visibility
3. **Superintendent**: Field management tools (daily log, punch list, inspections)
4. **Subcontractor**: Limited access to relevant commitments, submittals, RFIs
5. **Owner/Client**: Read-only access to reports and dashboards

## Data Relationships

- **Projects** contain all project-level modules
- **Companies** in Directory are linked to Commitments
- **Users** in Directory have permissions across modules
- **RFIs** can reference Drawings and Submittals
- **Change Orders** impact Budget and Contracts
- **Daily Logs** track resources used in Schedule activities
- **Punch Items** can be linked to Inspections and Photos