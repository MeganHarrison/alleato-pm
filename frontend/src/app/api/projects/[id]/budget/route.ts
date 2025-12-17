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

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch budget items with cost code details
    const { data: budgetItems, error } = await supabase
      .from('budget_items')
      .select(`
        *,
        cost_codes (
          id,
          description
        )
      `)
      .eq('project_id', projectId)
      .order('cost_code_id', { ascending: true });

    if (error) {
      console.error('Error fetching budget items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch budget data' },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations
    const lineItems = (budgetItems || []).map((item: any) => ({
      id: item.id,
      description: `${item.cost_code_id} - ${item.cost_codes?.description || ''}`,
      originalBudgetAmount: item.original_budget_amount || 0,
      budgetModifications: item.budget_modifications || 0,
      approvedCOs: item.approved_cos || 0,
      revisedBudget: item.revised_budget || item.original_budget_amount || 0,
      jobToDateCostDetail: 0, // TODO: Calculate from actual costs
      directCosts: item.direct_cost || 0,
      pendingChanges: 0, // TODO: Calculate from pending changes
      projectedBudget: item.revised_budget || item.original_budget_amount || 0,
      committedCosts: item.committed_cost || 0,
      pendingCostChanges: item.pending_cost_changes || 0,
      projectedCosts: item.projected_cost || 0,
      forecastToComplete: item.forecast_to_complete || 0,
      estimatedCostAtCompletion: (item.projected_cost || 0) + (item.forecast_to_complete || 0),
      projectedOverUnder: (item.revised_budget || item.original_budget_amount || 0) - ((item.projected_cost || 0) + (item.forecast_to_complete || 0)),
    }));

    // Calculate grand totals
    const grandTotals = lineItems.reduce(
      (acc, item) => ({
        originalBudgetAmount: acc.originalBudgetAmount + item.originalBudgetAmount,
        budgetModifications: acc.budgetModifications + item.budgetModifications,
        approvedCOs: acc.approvedCOs + item.approvedCOs,
        revisedBudget: acc.revisedBudget + item.revisedBudget,
        jobToDateCostDetail: acc.jobToDateCostDetail + item.jobToDateCostDetail,
        directCosts: acc.directCosts + item.directCosts,
        pendingChanges: acc.pendingChanges + item.pendingChanges,
        projectedBudget: acc.projectedBudget + item.projectedBudget,
        committedCosts: acc.committedCosts + item.committedCosts,
        pendingCostChanges: acc.pendingCostChanges + item.pendingCostChanges,
        projectedCosts: acc.projectedCosts + item.projectedCosts,
        forecastToComplete: acc.forecastToComplete + item.forecastToComplete,
        estimatedCostAtCompletion: acc.estimatedCostAtCompletion + item.estimatedCostAtCompletion,
        projectedOverUnder: acc.projectedOverUnder + item.projectedOverUnder,
      }),
      {
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
      }
    );

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

    if (isNaN(projectId)) {
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

    // Prepare budget items for insertion
    const budgetItemsToInsert = normalizedLineItems.map((item) => {
      const originalAmount = item.amount || 0;

      if (!validCostCodeIds.has(item.costCodeId)) {
        throw new Error(`Cost code not found: ${item.costCodeId}`);
      }

      return {
        project_id: projectId,
        cost_code_id: item.costCodeId,
        cost_type: item.costType || null,
        original_budget_amount: originalAmount,
        unit_qty: item.qty ?? null,
        uom: item.uom || null,
        unit_cost: item.unitCost ?? null,
        calculation_method: null,
      };
    });

    // Insert budget items
    try {
      const { data: insertedItems, error: insertError } = await supabase
        .from('budget_items')
        .insert(budgetItemsToInsert)
        .select();

      if (insertError) {
        console.error('Error inserting budget items:', insertError);
        return NextResponse.json(
          { error: 'Failed to create budget line items', details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: insertedItems,
        message: `Successfully created ${insertedItems?.length || 0} budget line item(s)`,
      });
    } catch (error: any) {
      console.error('Error in budget item creation:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create budget items' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in budget POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
