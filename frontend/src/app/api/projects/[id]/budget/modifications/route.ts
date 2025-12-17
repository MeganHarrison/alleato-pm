import { BudgetModificationPayloadSchema } from '@/lib/schemas/budget';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects/[id]/budget/modifications - Fetch budget modifications
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

    // Fetch budget modifications with budget item details
    const { data, error } = await supabase
      .from('budget_modifications')
      .select(`
        *,
        budget_items (
          id,
          cost_code_id,
          original_budget_amount,
          cost_codes (
            id,
            description
          )
        )
      `)
      .eq('budget_items.project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching budget modifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch budget modifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      modifications: data || [],
    });
  } catch (error) {
    console.error('Error in budget modifications GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/budget/modifications - Create a budget modification
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
    const parsedPayload = BudgetModificationPayloadSchema.safeParse({
      budgetItemId: body.budgetItemId ?? body.budget_item_id,
      amount: body.amount,
      title: body.title,
      description: body.description,
      reason: body.reason,
      approver: body.approver,
      modificationType: body.modificationType ?? body.modification_type,
    });

    if (!parsedPayload.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsedPayload.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      budgetItemId,
      amount,
      title,
      description,
      reason,
      approver,
      modificationType,
    } = parsedPayload.data;

    const parsedAmount = amount ? parseFloat(amount) : 0;
    if (parsedAmount === 0 || Number.isNaN(parsedAmount)) {
      return NextResponse.json(
        { error: 'Amount must be a non-zero number' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify budget item belongs to this project
    const { data: budgetItem, error: itemError } = await supabase
      .from('budget_items')
      .select('id, project_id, budget_modifications, revised_budget, original_budget_amount')
      .eq('id', budgetItemId)
      .eq('project_id', projectId)
      .single();

    if (itemError || !budgetItem) {
      return NextResponse.json(
        { error: 'Budget item not found in this project' },
        { status: 404 }
      );
    }

    // Check if project budget is locked
    const { data: project } = await supabase
      .from('projects')
      .select('budget_locked')
      .eq('id', projectId)
      .single();

    if (project?.budget_locked) {
      return NextResponse.json(
        { error: 'Budget is locked. Unlock the budget to make modifications.' },
        { status: 403 }
      );
    }

    const combinedDescription = [
      title ? `Title: ${title}` : null,
      description,
      reason ? `Reason: ${reason}` : null,
      approver ? `Approver: ${approver}` : null,
      modificationType ? `Type: ${modificationType}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    // Create the modification
    const { data: modification, error: modError } = await supabase
      .from('budget_modifications')
      .insert({
        budget_item_id: budgetItemId,
        amount: parsedAmount,
        description: combinedDescription || null,
        approved: false,
      })
      .select()
      .single();

    if (modError) {
      console.error('Error creating budget modification:', modError);
      return NextResponse.json(
        { error: 'Failed to create budget modification' },
        { status: 500 }
      );
    }

    // Update the budget item's modification total and revised budget
    const currentModifications = budgetItem.budget_modifications || 0;
    const newModifications = currentModifications + parsedAmount;
    const newRevisedBudget = (budgetItem.original_budget_amount || 0) + newModifications;

    const { error: updateError } = await supabase
      .from('budget_items')
      .update({
        budget_modifications: newModifications,
        revised_budget: newRevisedBudget,
      })
      .eq('id', budgetItemId);

    if (updateError) {
      console.error('Error updating budget item:', updateError);
      // Don't fail the request, modification was created
    }

    return NextResponse.json({
      success: true,
      data: modification,
      message: 'Budget modification created successfully',
    });
  } catch (error) {
    console.error('Error in budget modifications POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id]/budget/modifications - Approve/reject a modification
export async function PATCH(
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
    const { modification_id, approved } = body;

    if (!modification_id || approved === undefined) {
      return NextResponse.json(
        { error: 'modification_id and approved are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update the modification
    const { data, error } = await supabase
      .from('budget_modifications')
      .update({
        approved,
        approved_at: approved ? new Date().toISOString() : null,
      })
      .eq('id', modification_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget modification:', error);
      return NextResponse.json(
        { error: 'Failed to update budget modification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: approved ? 'Modification approved' : 'Modification rejected',
    });
  } catch (error) {
    console.error('Error in budget modifications PATCH route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/budget/modifications - Delete a modification
export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const modificationId = searchParams.get('modificationId');

    if (!modificationId) {
      return NextResponse.json(
        { error: 'modificationId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the modification details first
    const { data: modification, error: fetchError } = await supabase
      .from('budget_modifications')
      .select('*, budget_items(id, project_id, budget_modifications, original_budget_amount)')
      .eq('id', modificationId)
      .single();

    if (fetchError || !modification) {
      return NextResponse.json(
        { error: 'Modification not found' },
        { status: 404 }
      );
    }

    // Verify project ownership
    if (modification.budget_items?.project_id !== projectId) {
      return NextResponse.json(
        { error: 'Modification not found in this project' },
        { status: 404 }
      );
    }

    // Delete the modification
    const { error: deleteError } = await supabase
      .from('budget_modifications')
      .delete()
      .eq('id', modificationId);

    if (deleteError) {
      console.error('Error deleting budget modification:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete budget modification' },
        { status: 500 }
      );
    }

    // Update budget item totals
    const budgetItem = modification.budget_items;
    if (budgetItem) {
      const currentModifications = budgetItem.budget_modifications || 0;
      const newModifications = currentModifications - modification.amount;
      const newRevisedBudget = (budgetItem.original_budget_amount || 0) + newModifications;

      await supabase
        .from('budget_items')
        .update({
          budget_modifications: newModifications,
          revised_budget: newRevisedBudget,
        })
        .eq('id', budgetItem.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Budget modification deleted successfully',
    });
  } catch (error) {
    console.error('Error in budget modifications DELETE route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
