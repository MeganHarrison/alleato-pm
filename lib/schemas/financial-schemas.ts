import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['vendor', 'subcontractor', 'supplier', 'owner']),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  tax_id: z.string().optional(),
});

export const commitmentSchema = z.object({
  number: z.string().min(1, 'Commitment number is required'),
  contract_company_id: z.string().uuid('Valid company ID required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'sent', 'pending', 'approved', 'executed', 'closed', 'void']),
  original_amount: z.number().min(0, 'Amount must be positive'),
  accounting_method: z.enum(['amount', 'unit', 'percent']),
  retention_percentage: z.number().min(0).max(100).optional(),
  executed_date: z.string().optional(),
  start_date: z.string().optional(),
  substantial_completion_date: z.string().optional(),
  vendor_invoice_number: z.string().optional(),
  signed_received_date: z.string().optional(),
  assignee_id: z.string().uuid().optional(),
  private: z.boolean().default(false),
});

export const changeEventSchema = z.object({
  number: z.string().min(1, 'Change event number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['open', 'pending', 'approved', 'closed']),
  commitment_id: z.string().uuid().optional(),
  rom_cost_impact: z.number().optional(),
  rom_schedule_impact: z.number().optional(),
});

export const changeOrderSchema = z.object({
  change_event_id: z.string().uuid('Valid change event ID required'),
  number: z.string().min(1, 'Change order number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'pending', 'approved', 'executed', 'void']),
  commitment_id: z.string().uuid('Valid commitment ID required'),
  amount: z.number(),
  executed_date: z.string().optional(),
});

export const primeContractSchema = z.object({
  number: z.string().min(1, 'Contract number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  owner_id: z.string().uuid('Valid owner ID required'),
  status: z.enum(['draft', 'sent', 'pending', 'approved', 'executed', 'closed']),
  contract_date: z.string().optional(),
  start_date: z.string().optional(),
  substantial_completion_date: z.string().optional(),
  original_amount: z.number().min(0, 'Amount must be positive'),
  retention_percentage: z.number().min(0).max(100).optional(),
});

export const invoiceSchema = z.object({
  commitment_id: z.string().uuid('Valid commitment ID required'),
  number: z.string().min(1, 'Invoice number is required'),
  billing_period_start: z.string(),
  billing_period_end: z.string(),
  invoice_date: z.string(),
  due_date: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'approved', 'paid', 'void']),
  notes: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type CommitmentFormData = z.infer<typeof commitmentSchema>;
export type ChangeEventFormData = z.infer<typeof changeEventSchema>;
export type ChangeOrderFormData = z.infer<typeof changeOrderSchema>;
export type PrimeContractFormData = z.infer<typeof primeContractSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;