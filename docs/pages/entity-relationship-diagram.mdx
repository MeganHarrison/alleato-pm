# Entity Relationship Diagram

Generated from Procore UI analysis

## Core Tables

```mermaid
erDiagram
  projects {
    uuid id PK
    uuid company_id FK
    varchar name
    varchar job_number
    text address
    varchar city
    varchar state
    varchar zip
    varchar phone
    project_status status
    varchar phase
    varchar category
    boolean archived
    text summary
    jsonb summary_metadata
    timestamp created_at
    timestamp updated_at
    uuid created_by FK
    uuid updated_by FK
  }
  companies {
    uuid id PK
    varchar name
    company_type type
    text address
    varchar city
    varchar state
    varchar zip
    varchar phone
    varchar email
    varchar website
    boolean active
    timestamp created_at
    timestamp updated_at
    uuid created_by FK
    uuid updated_by FK
  }
  cost_codes {
    uuid id PK
    uuid project_id FK
    varchar code
    text description
    uuid parent_id FK
    ltree path
    boolean active
    timestamp created_at
    timestamp updated_at
    uuid created_by FK
    uuid updated_by FK
  }

  projects ||--o{ companies : "company_id"
  cost_codes ||--o{ projects : "project_id"
  cost_codes ||--o{ cost_codes : "parent_id"
```

## Financial Tables

```mermaid
erDiagram
  budgets {
    uuid id PK
    uuid project_id FK
    varchar name
    budget_status status
    erp_sync_status erp_sync_status
    timestamp locked_at
    uuid locked_by FK
    timestamp created_at
  }
  budget_line_items {
    uuid id PK
    uuid budget_id FK
    uuid cost_code_id FK
    calculation_method calculation_method
    decimal unit_qty
    varchar uom
    money unit_cost
    money original_budget
  }
  prime_contracts {
    uuid id PK
    uuid project_id FK
    varchar number
    varchar title
    uuid owner_id FK
    uuid architect_id FK
    date contract_date
    contract_status status
  }
  commitments {
    uuid id PK
    uuid project_id FK
    varchar number
    varchar title
    commitment_type type
    uuid company_id FK
    date contract_date
    contract_status status
  }
  change_orders {
    uuid id PK
    uuid project_id FK
    uuid change_event_id FK
    uuid contract_id
    contract_type contract_type
    varchar number
    varchar title
    change_order_status status
  }
  invoices {
    uuid id PK
    uuid project_id FK
    uuid billing_period_id FK
    uuid contract_id
    contract_type contract_type
    varchar invoice_number
    date invoice_date
    money amount
  }
```

## Relationships

- projects.company_id → companies.id (many-to-one)
- cost_codes.project_id → projects.id (many-to-one)
- cost_codes.parent_id → cost_codes.id (self-reference)
- budgets.project_id → projects.id (one-to-one)
- budget_line_items.budget_id → budgets.id (many-to-one)
- budget_line_items.cost_code_id → cost_codes.id (many-to-one)
- prime_contracts.project_id → projects.id (many-to-one)
- prime_contracts.owner_id → companies.id (many-to-one)
- prime_contracts.architect_id → companies.id (many-to-one)
- commitments.project_id → projects.id (many-to-one)
- commitments.company_id → companies.id (many-to-one)
- contract_line_items.cost_code_id → cost_codes.id (many-to-one)
- change_events.project_id → projects.id (many-to-one)
- change_orders.project_id → projects.id (many-to-one)
- change_orders.change_event_id → change_events.id (many-to-one)
- billing_periods.project_id → projects.id (many-to-one)
- invoices.project_id → projects.id (many-to-one)
- invoices.billing_period_id → billing_periods.id (many-to-one)
