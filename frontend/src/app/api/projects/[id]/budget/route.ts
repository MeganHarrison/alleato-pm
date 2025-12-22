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

    // Fetch budget lines from new v_budget_lines view
    const { data: budgetItems, error } = await supabase
      .from('v_budget_lines')
      .select(`
        *,
        cost_code:cost_codes(id, description, division_id),
        cost_type:cost_code_types(code, description),
        sub_job:sub_jobs(code, name)
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

    // Transform to frontend format (no calculations, just formatting)
    const lineItems = (budgetItems || []).map((item: Record<string, unknown>) => {
      const costCode = item.cost_code as { id?: string; description?: string; division_id?: string } | undefined;
      const costType = item.cost_type as { code?: string; description?: string } | undefined;
      const subJob = item.sub_job as { code?: string; name?: string } | undefined;

      return {
        id: item.id as string,
        description: (item.description as string) || `${item.cost_code_id} - ${costCode?.description || ''} ${costType?.code ? `(${costType.code})` : ''}`,
        costCode: item.cost_code_id as string,
        costCodeDescription: costCode?.description || '',
        costType: costType?.code || '',
        division: costCode?.division_id || '',
        divisionTitle: '',
        subJob: subJob?.name || '',

        // Core budget values from view
        originalBudgetAmount: parseFloat(item.original_amount as string) || 0,
        budgetModifications: parseFloat(item.budget_mod_total as string) || 0,
        approvedCOs: parseFloat(item.approved_co_total as string) || 0,
        revisedBudget: parseFloat(item.revised_budget as string) || 0,

        // Cost tracking fields (placeholder - TODO: implement cost tracking)
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
    });

    // Calculate grand totals from line items
    const grandTotals = lineItems.reduce((totals, item) => ({
      originalBudgetAmount: totals.originalBudgetAmount + item.originalBudgetAmount,
      budgetModifications: totals.budgetModifications + item.budgetModifications,
      approvedCOs: totals.approvedCOs + item.approvedCOs,
      revisedBudget: totals.revisedBudget + item.revisedBudget,
      jobToDateCostDetail: totals.jobToDateCostDetail + item.jobToDateCostDetail,
      directCosts: totals.directCosts + item.directCosts,
      pendingChanges: totals.pendingChanges + item.pendingChanges,
      projectedBudget: totals.projectedBudget + item.projectedBudget,
      committedCosts: totals.committedCosts + item.committedCosts,
      pendingCostChanges: totals.pendingCostChanges + item.pendingCostChanges,
      projectedCosts: totals.projectedCosts + item.projectedCosts,
      forecastToComplete: totals.forecastToComplete + item.forecastToComplete,
      estimatedCostAtCompletion: totals.estimatedCostAtCompletion + item.estimatedCostAtCompletion,
      projectedOverUnder: totals.projectedOverUnder + item.projectedOverUnder,
    }), {
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
    });

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
      costTypeId: item.costType ?? null,
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

    // Look up cost type IDs if provided
    const costTypeIds = normalizedLineItems
      .map((item) => item.costTypeId)
      .filter((id): id is string => id !== null);

    let validCostTypeIds = new Set<string>();
    if (costTypeIds.length > 0) {
      const { data: costTypeData, error: typeError } = await supabase
        .from('cost_code_types')
        .select('id')
        .in('id', costTypeIds);

      if (typeError) {
        console.error('Error looking up cost types:', typeError);
        return NextResponse.json(
          { error: 'Failed to look up cost types', details: typeError.message },
          { status: 500 }
        );
      }
      validCostTypeIds = new Set((costTypeData || []).map(ct => ct.id));
    }

    // Create budget_lines using new schema
    const results = [];

    for (const item of normalizedLineItems) {
      if (!validCostCodeIds.has(item.costCodeId)) {
        throw new Error(`Cost code not found: ${item.costCodeId}`);
      }

      if (item.costTypeId && !validCostTypeIds.has(item.costTypeId)) {
        throw new Error(`Cost type not found: ${item.costTypeId}`);
      }

      // Create or update budget_line
      // First try to find existing budget_line
      const { data: existingBudgetLine } = await supabase
        .from('budget_lines')
        .select('id, original_amount')
        .eq('project_id', projectId)
        .eq('cost_code_id', item.costCodeId)
        .eq('cost_type_id', item.costTypeId || '')
        .is('sub_job_id', null)
        .maybeSingle();

      let budgetLine: { id: string };
      if (existingBudgetLine) {
        // Update existing budget line - add to original amount
        const newAmount = (existingBudgetLine.original_amount || 0) + item.amount;
        const { data: updatedLine, error: updateError } = await supabase
          .from('budget_lines')
          .update({
            original_amount: newAmount,
          })
          .eq('id', existingBudgetLine.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating budget line:', updateError);
          return NextResponse.json(
            { error: 'Failed to update budget line', details: updateError.message },
            { status: 500 }
          );
        }
        budgetLine = updatedLine;
      } else {
        // Create new budget_line
        const { data: newBudgetLine, error: blError } = await supabase
          .from('budget_lines')
          .insert({
            project_id: projectId,
            cost_code_id: item.costCodeId,
            cost_type_id: item.costTypeId || '',
            sub_job_id: null,
            description: item.description || null,
            original_amount: item.amount || 0,
            created_by: user?.id,
          })
          .select()
          .single();

        if (blError) {
          console.error('Error creating budget line:', blError);
          return NextResponse.json(
            { error: 'Failed to create budget line', details: blError.message },
            { status: 500 }
          );
        }
        budgetLine = newBudgetLine;
      }

      results.push(budgetLine);
    }

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
      message: `Successfully created ${results.length} budget line(s)`,
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
