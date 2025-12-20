import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BudgetLineItemsPayloadSchema } from '@/lib/schemas/budget';

// GET /api/projects/[id]/budget - Fetch budget data for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch budget items from materialized view (all calculations done in SQL)
    const { data: budgetItems, error } = await supabase
      .from('mv_budget_rollup')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true })
      .order('cost_code_id', { ascending: true });

    if (error) {
      console.error('Error fetching budget items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch budget data' },
        { status: 500 }
      );
    }

    // Fetch grand totals from view (also calculated in SQL)
    const { data: grandTotalsData, error: totalsError } = await supabase
      .from('v_budget_grand_totals')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    if (totalsError) {
      console.error('Error fetching grand totals:', totalsError);
    }

    // Transform to frontend format (no calculations, just formatting)
    const lineItems = (budgetItems || []).map((item: any) => ({
      id: item.budget_code_id,
      description: `${item.cost_code_id} - ${item.cost_code_description || ''} ${item.cost_type_code ? `(${item.cost_type_code})` : ''}`,
      costCode: item.cost_code_id,
      costCodeDescription: item.cost_code_description,
      costType: item.cost_type_code,
      division: item.cost_code_division,
      divisionTitle: item.division_title,

      // All values come directly from SQL (no JavaScript calculation)
      originalBudgetAmount: parseFloat(item.original_budget_amount) || 0,
      budgetModifications: parseFloat(item.budget_modifications) || 0,
      approvedCOs: parseFloat(item.approved_cos) || 0,
      revisedBudget: parseFloat(item.revised_budget) || 0,
      jobToDateCostDetail: parseFloat(item.job_to_date_cost) || 0,
      directCosts: parseFloat(item.direct_costs) || 0,
      pendingChanges: parseFloat(item.pending_budget_changes) || 0,
      projectedBudget: parseFloat(item.projected_budget) || 0,
      committedCosts: parseFloat(item.committed_costs) || 0,
      pendingCostChanges: parseFloat(item.pending_cost_changes) || 0,
      projectedCosts: parseFloat(item.projected_costs) || 0,
      forecastToComplete: parseFloat(item.forecast_to_complete) || 0,
      estimatedCostAtCompletion: parseFloat(item.estimated_cost_at_completion) || 0,
      projectedOverUnder: parseFloat(item.projected_over_under) || 0,
    }));

    const grandTotals = grandTotalsData ? {
      originalBudgetAmount: parseFloat(grandTotalsData.original_budget_amount) || 0,
      budgetModifications: parseFloat(grandTotalsData.budget_modifications) || 0,
      approvedCOs: parseFloat(grandTotalsData.approved_cos) || 0,
      revisedBudget: parseFloat(grandTotalsData.revised_budget) || 0,
      jobToDateCostDetail: parseFloat(grandTotalsData.job_to_date_cost) || 0,
      directCosts: parseFloat(grandTotalsData.direct_costs) || 0,
      pendingChanges: parseFloat(grandTotalsData.pending_budget_changes) || 0,
      projectedBudget: parseFloat(grandTotalsData.projected_budget) || 0,
      committedCosts: parseFloat(grandTotalsData.committed_costs) || 0,
      pendingCostChanges: parseFloat(grandTotalsData.pending_cost_changes) || 0,
      projectedCosts: parseFloat(grandTotalsData.projected_costs) || 0,
      forecastToComplete: parseFloat(grandTotalsData.forecast_to_complete) || 0,
      estimatedCostAtCompletion: parseFloat(grandTotalsData.estimated_cost_at_completion) || 0,
      projectedOverUnder: parseFloat(grandTotalsData.projected_over_under) || 0,
    } : {
      originalBudgetAmount: 0,
      budgetModifications: 0,
      approvedCOs: 0,
      revisedBudget: 0,
      jobToDateCostDetail: 0,
      directCosts: 0,
      pendingChanges: 0,
      projectedBudget: 0,
      committedCosts: 0,
      pendingCostChanges: 0,
      projectedCosts: 0,
      forecastToComplete: 0,
      estimatedCostAtCompletion: 0,
      projectedOverUnder: 0,
    };

    return NextResponse.json({
      lineItems,
      grandTotals,
    });
  } catch (error) {
    console.error('Error in budget GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/budget - Create budget line items
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = BudgetLineItemsPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const normalizedLineItems = parsed.data.lineItems.map((item) => ({
      costCodeId: item.costCodeId,
      costType: item.costType ?? null,
      qty: item.qty && item.qty !== '' ? parseFloat(item.qty) : null,
      uom: item.uom ?? null,
      unitCost: item.unitCost && item.unitCost !== '' ? parseFloat(item.unitCost) : null,
      amount: parseFloat(item.amount),
      description: item.description ?? null,
    }));

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Look up cost code IDs from the code strings or IDs
    const costCodes = normalizedLineItems.map((item) => item.costCodeId);
    const { data: costCodeData, error: codeError } = await supabase
      .from('cost_codes')
      .select('id')
      .in('id', costCodes);

    if (codeError) {
      console.error('Error looking up cost codes:', codeError);
      return NextResponse.json(
        { error: 'Failed to look up cost codes', details: codeError.message },
        { status: 500 }
      );
    }

    // Create a map of code ID to verify existence
    const validCostCodeIds = new Set((costCodeData || []).map(cc => cc.id));

    // Create budget_codes and budget_line_items using new schema
    const results = [];

    for (const item of normalizedLineItems) {
      if (!validCostCodeIds.has(item.costCodeId)) {
        throw new Error(`Cost code not found: ${item.costCodeId}`);
      }

      // 1. Create or get budget_code
      // First try to find existing budget_code
      const { data: existingBudgetCode } = await supabase
        .from('budget_codes')
        .select('id')
        .eq('project_id', projectId)
        .eq('cost_code_id', item.costCodeId)
        .is('sub_job_id', null)
        .is('cost_type_id', item.costType || null)
        .maybeSingle();

      let budgetCode: { id: string };
      if (existingBudgetCode) {
        budgetCode = existingBudgetCode;
      } else {
        // Create new budget_code
        const { data: newBudgetCode, error: bcError } = await supabase
          .from('budget_codes')
          .insert({
            project_id: projectId,
            cost_code_id: item.costCodeId,
            cost_type_id: item.costType || null,
            sub_job_id: null,
            description: item.description || null,
            created_by: user?.id,
          })
          .select()
          .single();

        if (bcError) {
          console.error('Error creating budget code:', bcError);
          return NextResponse.json(
            { error: 'Failed to create budget code', details: bcError.message },
            { status: 500 }
          );
        }
        budgetCode = newBudgetCode;
      }

      // 2. Create budget_line_item
      const { data: lineItem, error: liError } = await supabase
        .from('budget_line_items')
        .insert({
          budget_code_id: budgetCode.id,
          description: item.description || null,
          original_amount: item.amount || 0,
          unit_qty: item.qty ?? null,
          uom: item.uom || null,
          unit_cost: item.unitCost ?? null,
          calculation_method: item.qty && item.unitCost ? 'unit' : 'lump_sum',
          created_by: user?.id,
        })
        .select()
        .single();

      if (liError) {
        console.error('Error creating line item:', liError);
        return NextResponse.json(
          { error: 'Failed to create line item', details: liError.message },
          { status: 500 }
        );
      }

      results.push(lineItem);
    }

    // Refresh materialized view to reflect new line items
    await supabase.rpc('refresh_budget_rollup', { p_project_id: projectId });

    // Calculate total budget from created line items and update project
    const totalBudget = normalizedLineItems.reduce((sum, item) => sum + item.amount, 0);

    if (totalBudget > 0) {
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({
          original_budget: totalBudget,
          current_budget: totalBudget,
        })
        .eq('id', projectId);

      if (projectUpdateError) {
        console.error('Error updating project budget totals:', projectUpdateError);
        // Don't fail the request - line items were created successfully
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      totalBudget,
      message: `Successfully created ${results.length} budget line item(s)`,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create budget items';
    console.error('Error in budget POST route:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
