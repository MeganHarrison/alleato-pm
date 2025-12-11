-- Financial Module Enums
-- Based on UI evidence from components

-- Project statuses
CREATE TYPE project_status AS ENUM ('active', 'inactive');
CREATE TYPE project_stage AS ENUM ('current', 'planning', 'construction', 'closeout', 'warranty');

-- Company types
CREATE TYPE company_type AS ENUM (
  'general_contractor',
  'subcontractor', 
  'vendor',
  'owner',
  'architect',
  'engineer'
);

-- User roles
CREATE TYPE user_role AS ENUM (
  'admin',
  'project_manager',
  'superintendent',
  'executive',
  'accountant',
  'viewer'
);

-- Contract/Commitment statuses
CREATE TYPE contract_status AS ENUM (
  'draft',
  'out_for_signature',
  'executed',
  'closed',
  'void'
);

CREATE TYPE commitment_status AS ENUM (
  'draft',
  'sent',
  'pending',
  'pending_approval',
  'approved',
  'acknowledged',
  'executed',
  'completed',
  'closed',
  'void'
);

-- Billing configuration
CREATE TYPE billing_method AS ENUM (
  'progress',
  'unit_price',
  'time_materials',
  'lump_sum'
);

CREATE TYPE payment_terms AS ENUM (
  'net_30',
  'net_45',
  'net_60',
  'due_on_receipt'
);

-- Change management statuses  
CREATE TYPE change_event_status AS ENUM (
  'open',
  'in_review',
  'approved',
  'rejected',
  'closed'
);

CREATE TYPE change_order_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'sent',
  'executed',
  'void'
);

-- Invoice statuses
CREATE TYPE invoice_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'paid'
);

-- Billing period status
CREATE TYPE billing_period_status AS ENUM (
  'open',
  'closed',
  'locked'
);

-- Daily log status
CREATE TYPE daily_log_status AS ENUM (
  'draft',
  'submitted',
  'approved',
  'archived'
);

-- Cost code types
CREATE TYPE cost_code_type AS ENUM (
  'labor',
  'material',
  'equipment',
  'subcontract',
  'other'
);

-- Permission types
CREATE TYPE permission_type AS ENUM (
  'view',
  'edit',
  'delete'
);

-- Attachment resource types
CREATE TYPE attachment_resource_type AS ENUM (
  'contract',
  'commitment',
  'change_event',
  'change_order',
  'invoice',
  'daily_log'
);

-- Status type for active/inactive records
CREATE TYPE status AS ENUM ('active', 'inactive');