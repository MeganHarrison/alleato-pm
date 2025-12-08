// Types for API error handling and responses
export interface APIError extends Error {
  message: string;
  status?: number;
  response?: {
    status: number;
  };
}

// Types for Zod validation errors
export interface ZodError extends Error {
  name: 'ZodError';
  errors: Array<{
    path: string[];
    message: string;
  }>;
}

// Database schema types for AI SQL route
export interface DatabaseColumn {
  name: string;
  data_type: string;
  ordinal_position: number;
  is_nullable: boolean;
  column_default?: string;
}

export interface DatabaseTable {
  name: string;
  schema: string;
  columns: DatabaseColumn[];
}

export interface DatabaseQueryResponse {
  result?: DatabaseTable[];
  error?: string;
}

// Commitment types with relations
export interface Company {
  id: string;
  name: string;
  type: 'vendor' | 'subcontractor' | 'supplier' | 'owner';
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  tax_id?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface CommitmentLineItem {
  id: string;
  commitment_id: string;
  description: string;
  amount: number;
  quantity?: number;
  unit?: string;
}

export interface ChangeOrder {
  id: string;
  commitment_id: string;
  change_event_id: string;
  number: string;
  title: string;
  description?: string;
  status: 'draft' | 'pending' | 'approved' | 'executed' | 'void';
  amount: number;
  executed_date?: string;
}

export interface Invoice {
  id: string;
  commitment_id: string;
  number: string;
  billing_period_start: string;
  billing_period_end: string;
  invoice_date: string;
  due_date?: string;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'void';
  notes?: string;
}

export interface Commitment {
  id: string;
  number: string;
  contract_company_id: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'pending' | 'approved' | 'executed' | 'closed' | 'void';
  original_amount: number;
  accounting_method: 'amount' | 'unit' | 'percent';
  retention_percentage?: number;
  executed_date?: string;
  start_date?: string;
  substantial_completion_date?: string;
  vendor_invoice_number?: string;
  signed_received_date?: string;
  assignee_id?: string;
  private: boolean;
  created_by: string;
  approved_change_orders: number;
  revised_contract_amount: number;
  billed_to_date: number;
  balance_to_finish: number;
  created_at: string;
  updated_at: string;
  // Relations
  contract_company?: Company;
  assignee?: User;
  line_items?: CommitmentLineItem[];
  change_orders?: ChangeOrder[];
  invoices?: Invoice[];
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  message?: string;
  issues?: Array<{
    path: string[];
    message: string;
  }>;
}