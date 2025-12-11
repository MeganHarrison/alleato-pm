-- Financial Views and Aggregations
-- Provides denormalized views for reporting and UI display

-- Budget Summary View
CREATE OR REPLACE VIEW budget_summary_view AS
SELECT 
  bi.project_id,
  bi.cost_code_id,
  cc.code as cost_code,
  cc.description as cost_code_description,
  bi.original_budget,
  bi.revised_budget,
  -- Calculate committed amount from commitments
  COALESCE(
    (SELECT SUM(cli.amount) 
     FROM commitment_line_items cli
     JOIN commitments c ON c.id = cli.commitment_id
     WHERE c.project_id = bi.project_id 
     AND cli.cost_code_id = bi.cost_code_id
     AND c.status IN ('approved', 'executed')), 
    0
  ) as committed_amount,
  -- Calculate actual cost from paid invoices
  COALESCE(
    (SELECT SUM(ili.current_amount)
     FROM invoice_line_items ili
     JOIN invoices i ON i.id = ili.invoice_id
     WHERE i.project_id = bi.project_id
     AND ili.cost_code_id = bi.cost_code_id
     AND i.status = 'paid'),
    0
  ) as actual_cost,
  -- Calculate pending cost from unpaid invoices
  COALESCE(
    (SELECT SUM(ili.current_amount)
     FROM invoice_line_items ili
     JOIN invoices i ON i.id = ili.invoice_id
     WHERE i.project_id = bi.project_id
     AND ili.cost_code_id = bi.cost_code_id
     AND i.status IN ('approved', 'submitted')),
    0
  ) as pending_cost,
  bi.forecast_to_complete,
  -- Calculate variance
  COALESCE(bi.revised_budget, bi.original_budget) - 
  COALESCE(
    (SELECT SUM(ili.current_amount)
     FROM invoice_line_items ili
     JOIN invoices i ON i.id = ili.invoice_id
     WHERE i.project_id = bi.project_id
     AND ili.cost_code_id = bi.cost_code_id
     AND i.status = 'paid'),
    0
  ) as budget_remaining
FROM budget_items bi
JOIN cost_codes cc ON cc.id = bi.cost_code_id;

-- Contract Summary View
CREATE OR REPLACE VIEW contract_summary_view AS
SELECT 
  c.id,
  c.project_id,
  c.contract_number,
  c.title,
  comp.name as contract_company_name,
  c.status,
  c.original_amount,
  c.revised_amount,
  -- Calculate approved change orders
  COALESCE(
    (SELECT SUM(co.amount)
     FROM change_orders co
     WHERE co.contract_id = c.id
     AND co.status = 'executed'),
    0
  ) as approved_change_orders,
  -- Calculate pending change orders
  COALESCE(
    (SELECT SUM(co.amount)
     FROM change_orders co
     WHERE co.contract_id = c.id
     AND co.status IN ('pending_approval', 'approved', 'sent')),
    0
  ) as pending_change_orders,
  -- Calculate total invoiced
  COALESCE(
    (SELECT SUM(i.amount)
     FROM invoices i
     WHERE i.contract_id = c.id
     AND i.status != 'draft'),
    0
  ) as total_invoiced,
  -- Calculate total paid
  COALESCE(
    (SELECT SUM(p.amount)
     FROM payments p
     JOIN invoices i ON i.id = p.invoice_id
     WHERE i.contract_id = c.id),
    0
  ) as total_paid,
  -- Calculate balance to finish
  COALESCE(c.revised_amount, c.original_amount) -
  COALESCE(
    (SELECT SUM(p.amount)
     FROM payments p
     JOIN invoices i ON i.id = p.invoice_id
     WHERE i.contract_id = c.id),
    0
  ) as balance_to_finish,
  c.start_date,
  c.substantial_completion_date,
  c.is_private
FROM contracts c
JOIN companies comp ON comp.id = c.contract_company_id;

-- Commitment Summary View (similar to contracts)
CREATE OR REPLACE VIEW commitment_summary_view AS
SELECT 
  c.id,
  c.project_id,
  c.number as commitment_number,
  c.title,
  comp.name as contract_company_name,
  c.type,
  c.status,
  c.original_amount,
  c.revised_amount,
  -- Calculate approved change orders
  COALESCE(
    (SELECT SUM(co.amount)
     FROM change_orders co
     WHERE co.commitment_id = c.id
     AND co.status = 'executed'),
    0
  ) as approved_change_orders,
  -- Calculate pending change orders
  COALESCE(
    (SELECT SUM(co.amount)
     FROM change_orders co
     WHERE co.commitment_id = c.id
     AND co.status IN ('pending_approval', 'approved', 'sent')),
    0
  ) as pending_change_orders,
  -- Calculate total invoiced
  COALESCE(
    (SELECT SUM(i.amount)
     FROM invoices i
     WHERE i.commitment_id = c.id
     AND i.status != 'draft'),
    0
  ) as total_invoiced,
  -- Calculate total paid
  COALESCE(
    (SELECT SUM(p.amount)
     FROM payments p
     JOIN invoices i ON i.id = p.invoice_id
     WHERE i.commitment_id = c.id),
    0
  ) as total_paid,
  -- Calculate balance to finish
  c.balance_to_finish -
  COALESCE(
    (SELECT SUM(p.amount)
     FROM payments p
     JOIN invoices i ON i.id = p.invoice_id
     WHERE i.commitment_id = c.id),
    0
  ) as balance_to_finish,
  c.executed
FROM commitments c
JOIN companies comp ON comp.id = c.contract_company_id;

-- Change Order Impact View
CREATE OR REPLACE VIEW change_order_impact_view AS
SELECT 
  co.project_id,
  co.id as change_order_id,
  co.change_order_number,
  co.title,
  co.status,
  co.amount,
  CASE 
    WHEN co.contract_id IS NOT NULL THEN 'contract'
    WHEN co.commitment_id IS NOT NULL THEN 'commitment'
  END as parent_type,
  COALESCE(cont.contract_number, comm.number) as parent_number,
  COALESCE(cont.title, comm.title) as parent_title,
  ce.event_number as originating_event_number,
  ce.title as originating_event_title,
  co.created_date,
  co.approval_date,
  co.execution_date
FROM change_orders co
LEFT JOIN contracts cont ON cont.id = co.contract_id
LEFT JOIN commitments comm ON comm.id = co.commitment_id
LEFT JOIN change_events ce ON ce.id = co.change_event_id;

-- Invoice Summary View
CREATE OR REPLACE VIEW invoice_summary_view AS
SELECT 
  i.id,
  i.project_id,
  i.invoice_number,
  i.status,
  i.invoice_date,
  i.due_date,
  CASE 
    WHEN i.contract_id IS NOT NULL THEN 'contract'
    WHEN i.commitment_id IS NOT NULL THEN 'commitment'
  END as parent_type,
  COALESCE(cont.contract_number, comm.number) as parent_number,
  COALESCE(cont.title, comm.title) as parent_title,
  COALESCE(cont_comp.name, comm_comp.name) as company_name,
  bp.period_number as billing_period,
  i.amount,
  i.retention_held,
  i.current_payment_due,
  -- Calculate total paid
  COALESCE(
    (SELECT SUM(p.amount)
     FROM payments p
     WHERE p.invoice_id = i.id),
    0
  ) as amount_paid,
  -- Calculate balance due
  i.current_payment_due - 
  COALESCE(
    (SELECT SUM(p.amount)
     FROM payments p
     WHERE p.invoice_id = i.id),
    0
  ) as balance_due,
  -- Days overdue (if applicable)
  CASE 
    WHEN i.due_date < CURRENT_DATE AND i.status != 'paid' 
    THEN CURRENT_DATE - i.due_date
    ELSE 0
  END as days_overdue
FROM invoices i
LEFT JOIN contracts cont ON cont.id = i.contract_id
LEFT JOIN commitments comm ON comm.id = i.commitment_id
LEFT JOIN companies cont_comp ON cont_comp.id = cont.contract_company_id
LEFT JOIN companies comm_comp ON comm_comp.id = comm.contract_company_id
LEFT JOIN billing_periods bp ON bp.id = i.billing_period_id;

-- SOV Progress View
CREATE OR REPLACE VIEW sov_progress_view AS
SELECT 
  sov.id,
  sov.contract_id,
  sov.line_number,
  sov.description,
  cc.code as cost_code,
  cc.description as cost_code_description,
  sov.scheduled_value,
  sov.work_completed,
  sov.materials_stored,
  sov.percent_complete,
  sov.scheduled_value - (sov.work_completed + sov.materials_stored) as remaining_value,
  -- Calculate this period's work from latest invoice
  COALESCE(
    (SELECT ili.current_amount
     FROM invoice_line_items ili
     JOIN invoices i ON i.id = ili.invoice_id
     WHERE i.contract_id = sov.contract_id
     AND ili.line_number = sov.line_number
     AND i.status = 'draft'
     ORDER BY i.created_at DESC
     LIMIT 1),
    0
  ) as current_period_amount
FROM schedule_of_values sov
LEFT JOIN cost_codes cc ON cc.id = sov.cost_code_id;

-- Project Financial Summary
CREATE OR REPLACE VIEW project_financial_summary AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.project_number,
  -- Original contract value
  COALESCE(
    (SELECT SUM(c.original_amount)
     FROM contracts c
     WHERE c.project_id = p.id),
    0
  ) as original_contract_value,
  -- Current contract value (with change orders)
  COALESCE(
    (SELECT SUM(COALESCE(c.revised_amount, c.original_amount))
     FROM contracts c
     WHERE c.project_id = p.id),
    0
  ) as current_contract_value,
  -- Total commitments
  COALESCE(
    (SELECT SUM(COALESCE(c.revised_amount, c.original_amount))
     FROM commitments c
     WHERE c.project_id = p.id
     AND c.status IN ('approved', 'executed')),
    0
  ) as total_commitments,
  -- Total invoiced
  COALESCE(
    (SELECT SUM(i.amount)
     FROM invoices i
     WHERE i.project_id = p.id
     AND i.status != 'draft'),
    0
  ) as total_invoiced,
  -- Total paid
  COALESCE(
    (SELECT SUM(pay.amount)
     FROM payments pay
     JOIN invoices i ON i.id = pay.invoice_id
     WHERE i.project_id = p.id),
    0
  ) as total_paid,
  -- Budget total
  COALESCE(
    (SELECT SUM(COALESCE(bi.revised_budget, bi.original_budget))
     FROM budget_items bi
     WHERE bi.project_id = p.id),
    0
  ) as total_budget
FROM projects p;

-- Create materialized views for performance (optional)
-- These can be refreshed periodically for better query performance
-- CREATE MATERIALIZED VIEW mv_budget_summary AS SELECT * FROM budget_summary_view;
-- CREATE MATERIALIZED VIEW mv_project_financial_summary AS SELECT * FROM project_financial_summary;

-- Add RLS to views (views inherit RLS from underlying tables automatically)