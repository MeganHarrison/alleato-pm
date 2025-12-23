import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH /api/projects/[id]/budget/lines/[lineId] - Update a budget line item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lineId: string }> }
) {
  try {
    const { id, lineId } = await params;
    const projectId = parseInt(id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error or no user:', { userError, hasUser: !!user });
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { quantity, unit_cost, description } = body;

    // Validate at least one field is being updated
    if (quantity === undefined && unit_cost === undefined && description === undefined) {
      return NextResponse.json(
        { error: 'At least one field (quantity, unit_cost, description) must be provided' },
        { status: 400 }
      );
    }

    // TODO: Add project membership validation when project_team_members table exists
    // For now, all authenticated users can edit (will be restricted by RLS on budget_lines)

    // Check if budget is locked
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('budget_locked')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error fetching project:', projectError);
      return NextResponse.json(
        { error: 'Failed to verify project status' },
        { status: 500 }
      );
    }

    if (project.budget_locked) {
      return NextResponse.json(
        { error: 'Budget is locked and cannot be edited' },
        { status: 403 }
      );
    }

    // Verify the budget line exists and belongs to this project
    const { data: existingLine, error: lineError } = await supabase
      .from('budget_lines')
      .select('id, project_id, quantity, unit_cost, description, original_amount')
      .eq('id', lineId)
      .single();

    if (lineError || !existingLine) {
      console.error('Budget line not found:', { lineError, hasLine: !!existingLine });
      return NextResponse.json(
        { error: 'Budget line item not found' },
        { status: 404 }
      );
    }

    if (existingLine.project_id !== projectId) {
      return NextResponse.json(
        { error: 'Budget line does not belong to this project' },
        { status: 403 }
      );
    }

    // Build update object
    const updateData: {
      quantity?: number;
      unit_cost?: number;
      description?: string;
      original_amount?: number;
      updated_by: string;
      updated_at: string;
    } = {
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (quantity !== undefined) {
      updateData.quantity = parseFloat(quantity);
    }

    if (unit_cost !== undefined) {
      updateData.unit_cost = parseFloat(unit_cost);
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    // Recalculate original_amount if quantity or unit_cost changed
    const newQuantity = quantity !== undefined ? parseFloat(quantity) : existingLine.quantity;
    const newUnitCost = unit_cost !== undefined ? parseFloat(unit_cost) : existingLine.unit_cost;

    if (newQuantity !== null && newUnitCost !== null) {
      updateData.original_amount = newQuantity * newUnitCost;
    }

    // Update the budget line
    // The trigger will automatically create history entries
    const { data: updatedLine, error: updateError } = await supabase
      .from('budget_lines')
      .update(updateData)
      .eq('id', lineId)
      .select(`
        id,
        quantity,
        unit_cost,
        description,
        original_amount,
        updated_at,
        updated_by
      `)
      .single();

    if (updateError) {
      console.error('Error updating budget line:', updateError);
      return NextResponse.json(
        { error: 'Failed to update budget line', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lineItem: {
        id: updatedLine.id,
        quantity: updatedLine.quantity,
        unit_cost: updatedLine.unit_cost,
        description: updatedLine.description,
        amount: updatedLine.original_amount,
        updated_at: updatedLine.updated_at,
        updated_by: updatedLine.updated_by,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update budget line';
    console.error('Error in budget line PATCH route:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
