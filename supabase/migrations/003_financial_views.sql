-- Financial Views Migration
-- Creates views for the financial module tables

-- Financial Contract Summary View
CREATE OR REPLACE VIEW financial_contract_summary AS
SELECT 
    fc.id,
    fc.contract_number,
    fc.contract_type,
    fc.title,
    fc.status,
    fc.contract_amount,
    fc.change_order_amount,
    fc.revised_amount,
    -- Company or subcontractor name
    COALESCE(c.name, s.company_name) as vendor_name,
    -- Project info
    fc.project_id,
    p.name as project_name,
    -- Invoice summary
    COALESCE((
        SELECT SUM(total_amount) 
        FROM financial_invoices 
        WHERE contract_id = fc.id
    ), 0) as total_invoiced,
    COALESCE((
        SELECT SUM(paid_amount) 
        FROM financial_invoices 
        WHERE contract_id = fc.id
    ), 0) as total_paid,
    -- Calculate remaining
    fc.revised_amount - COALESCE((
        SELECT SUM(total_amount) 
        FROM financial_invoices 
        WHERE contract_id = fc.id
    ), 0) as remaining_amount,
    fc.start_date,
    fc.end_date,
    fc.created_at,
    fc.updated_at
FROM financial_contracts fc
LEFT JOIN companies c ON fc.company_id = c.id
LEFT JOIN subcontractors s ON fc.subcontractor_id = s.id
LEFT JOIN projects p ON fc.project_id = p.id;

-- Financial Budget Summary View
CREATE OR REPLACE VIEW financial_budget_summary AS
SELECT 
    fb.id,
    fb.project_id,
    p.name as project_name,
    fb.cost_code,
    fcc.description as cost_code_description,
    fcc.code_type,
    fb.description,
    fb.budget_amount,
    fb.committed_amount,
    fb.spent_amount,
    fb.forecast_amount,
    fb.variance_amount,
    -- Calculate percentages
    CASE 
        WHEN fb.budget_amount > 0 
        THEN ROUND(((fb.committed_amount + fb.spent_amount) / fb.budget_amount * 100)::numeric, 2)
        ELSE 0 
    END as percent_complete,
    CASE 
        WHEN fb.budget_amount > 0 
        THEN ROUND((fb.variance_amount / fb.budget_amount * 100)::numeric, 2)
        ELSE 0 
    END as variance_percent,
    fb.created_at,
    fb.updated_at
FROM financial_budget_items fb
LEFT JOIN projects p ON fb.project_id = p.id
LEFT JOIN financial_cost_codes fcc ON fb.cost_code = fcc.code;

-- Financial Invoice Summary View
CREATE OR REPLACE VIEW financial_invoice_summary AS
SELECT 
    fi.id,
    fi.invoice_number,
    fi.contract_id,
    fc.contract_number,
    fc.title as contract_title,
    COALESCE(c.name, s.company_name) as vendor_name,
    fi.period_start,
    fi.period_end,
    fi.invoice_date,
    fi.due_date,
    fi.status,
    fi.subtotal,
    fi.tax_amount,
    fi.retention_amount,
    fi.total_amount,
    fi.paid_amount,
    fi.total_amount - fi.paid_amount as balance_due,
    -- Calculate days overdue
    CASE 
        WHEN fi.due_date < CURRENT_DATE AND fi.status NOT IN ('paid', 'void') 
        THEN CURRENT_DATE - fi.due_date 
        ELSE 0 
    END as days_overdue,
    -- Lien waiver info
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM financial_lien_waivers 
            WHERE invoice_id = fi.id AND received_date IS NOT NULL
        ) THEN true 
        ELSE false 
    END as lien_waiver_received,
    fi.created_at,
    fi.updated_at
FROM financial_invoices fi
LEFT JOIN financial_contracts fc ON fi.contract_id = fc.id
LEFT JOIN companies c ON fc.company_id = c.id
LEFT JOIN subcontractors s ON fc.subcontractor_id = s.id;

-- Project Financial Summary View
CREATE OR REPLACE VIEW project_financial_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p."job number",
    p.state as project_status,
    -- Budget totals
    COALESCE((
        SELECT SUM(budget_amount) 
        FROM financial_budget_items 
        WHERE project_id = p.id
    ), 0) as total_budget,
    -- Contract totals
    COALESCE((
        SELECT SUM(revised_amount) 
        FROM financial_contracts 
        WHERE project_id = p.id
    ), 0) as total_contracts,
    -- Invoice totals
    COALESCE((
        SELECT SUM(fi.total_amount) 
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = p.id
    ), 0) as total_invoiced,
    -- Payment totals
    COALESCE((
        SELECT SUM(fi.paid_amount) 
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = p.id
    ), 0) as total_paid,
    -- Direct costs
    COALESCE((
        SELECT SUM(amount) 
        FROM financial_direct_costs 
        WHERE project_id = p.id AND approved = true
    ), 0) as total_direct_costs,
    -- Budget variance
    COALESCE((
        SELECT SUM(variance_amount) 
        FROM financial_budget_items 
        WHERE project_id = p.id
    ), 0) as total_variance
FROM projects p;

-- Cost Code Hierarchy View
CREATE OR REPLACE VIEW financial_cost_code_hierarchy AS
WITH RECURSIVE cost_code_tree AS (
    -- Base case: top-level cost codes
    SELECT 
        id,
        code,
        description,
        parent_id,
        code_type,
        is_active,
        sort_order,
        code as full_code,
        description as full_description,
        0 as level
    FROM financial_cost_codes
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child cost codes
    SELECT 
        cc.id,
        cc.code,
        cc.description,
        cc.parent_id,
        cc.code_type,
        cc.is_active,
        cc.sort_order,
        cct.full_code || '.' || cc.code as full_code,
        cct.full_description || ' > ' || cc.description as full_description,
        cct.level + 1 as level
    FROM financial_cost_codes cc
    JOIN cost_code_tree cct ON cc.parent_id = cct.id
)
SELECT * FROM cost_code_tree
ORDER BY full_code;

-- Change Order Impact View
CREATE OR REPLACE VIEW financial_change_order_summary AS
SELECT 
    fco.id,
    fco.change_order_number,
    fco.title,
    fco.status,
    fco.amount,
    fc.contract_number,
    fc.title as contract_title,
    fc.contract_type,
    COALESCE(c.name, s.company_name) as vendor_name,
    p.name as project_name,
    fco.approved_date,
    fco.created_at,
    fco.created_by
FROM financial_change_orders fco
LEFT JOIN financial_contracts fc ON fco.contract_id = fc.id
LEFT JOIN companies c ON fc.company_id = c.id
LEFT JOIN subcontractors s ON fc.subcontractor_id = s.id
LEFT JOIN projects p ON fc.project_id = p.id;

-- Direct Costs by Project and Cost Code
CREATE OR REPLACE VIEW financial_direct_costs_summary AS
SELECT 
    fdc.project_id,
    p.name as project_name,
    fdc.cost_code,
    fcc.description as cost_code_description,
    fdc.cost_type,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN fdc.approved = true THEN fdc.amount ELSE 0 END) as approved_amount,
    SUM(CASE WHEN fdc.approved = false THEN fdc.amount ELSE 0 END) as pending_amount,
    SUM(fdc.amount) as total_amount,
    MIN(fdc.cost_date) as first_cost_date,
    MAX(fdc.cost_date) as last_cost_date
FROM financial_direct_costs fdc
LEFT JOIN projects p ON fdc.project_id = p.id
LEFT JOIN financial_cost_codes fcc ON fdc.cost_code = fcc.code
GROUP BY fdc.project_id, p.name, fdc.cost_code, fcc.description, fdc.cost_type;

-- Billing Period Status View
CREATE OR REPLACE VIEW financial_billing_period_status AS
SELECT 
    fbp.id,
    fbp.project_id,
    p.name as project_name,
    fbp.period_number,
    fbp.start_date,
    fbp.end_date,
    fbp.is_closed,
    -- Count invoices in this period
    (
        SELECT COUNT(*) 
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = fbp.project_id
        AND fi.period_start >= fbp.start_date
        AND fi.period_end <= fbp.end_date
    ) as invoice_count,
    -- Sum invoice amounts in this period
    (
        SELECT COALESCE(SUM(fi.total_amount), 0)
        FROM financial_invoices fi
        JOIN financial_contracts fc ON fi.contract_id = fc.id
        WHERE fc.project_id = fbp.project_id
        AND fi.period_start >= fbp.start_date
        AND fi.period_end <= fbp.end_date
    ) as period_total,
    fbp.closed_date,
    fbp.created_at
FROM financial_billing_periods fbp
LEFT JOIN projects p ON fbp.project_id = p.id
ORDER BY fbp.project_id, fbp.period_number;

-- Grant access to views
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;