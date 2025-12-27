import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/projects/[id]/budget/lock - Lock the budget
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number.parseInt(id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Check if budget is already locked
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('budget_locked, budget_locked_at, budget_locked_by')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      console.error('Error fetching project:', fetchError);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.budget_locked) {
      return NextResponse.json(
        { error: 'Budget is already locked', lockedAt: project.budget_locked_at },
        { status: 400 }
      );
    }

    // Lock the budget - Remove .single() to avoid "Cannot coerce" error
    const { data, error } = await supabase
      .from('projects')
      .update({
        budget_locked: true,
        budget_locked_at: new Date().toISOString(),
        budget_locked_by: user?.id || null,
      })
      .eq('id', projectId)
      .select();

    if (error) {
      console.error('Error locking budget:', error);
      console.error('User ID:', user?.id);
      console.error('Project ID:', projectId);
      return NextResponse.json(
        { error: `Failed to lock budget: ${error.message}` },
        { status: 500 }
      );
    }

    // Check if any rows were updated (RLS might have blocked it)
    if (!data || data.length === 0) {
      console.error('No rows updated - RLS policy may have blocked the update');
      console.error('User ID:', user?.id);
      console.error('Project ID:', projectId);
      return NextResponse.json(
        { error: 'Permission denied: You do not have access to lock this budget' },
        { status: 403 }
      );
    }

    const updatedProject = data[0];

    return NextResponse.json({
      success: true,
      message: 'Budget locked successfully',
      data: {
        budget_locked: updatedProject.budget_locked,
        budget_locked_at: updatedProject.budget_locked_at,
        budget_locked_by: updatedProject.budget_locked_by,
      },
    });
  } catch (error) {
    console.error('Error in budget lock route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/budget/lock - Unlock the budget
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number.parseInt(id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if budget is locked
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('budget_locked')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      console.error('Error fetching project:', fetchError);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (!project.budget_locked) {
      return NextResponse.json(
        { error: 'Budget is not locked' },
        { status: 400 }
      );
    }

    // Unlock the budget - Remove .single() to avoid "Cannot coerce" error
    const { data, error } = await supabase
      .from('projects')
      .update({
        budget_locked: false,
        budget_locked_at: null,
        budget_locked_by: null,
      })
      .eq('id', projectId)
      .select();

    if (error) {
      console.error('Error unlocking budget:', error);
      return NextResponse.json(
        { error: `Failed to unlock budget: ${error.message}` },
        { status: 500 }
      );
    }

    // Check if any rows were updated (RLS might have blocked it)
    if (!data || data.length === 0) {
      console.error('No rows updated - RLS policy may have blocked the update');
      return NextResponse.json(
        { error: 'Permission denied: You do not have access to unlock this budget' },
        { status: 403 }
      );
    }

    const updatedProject = data[0];

    return NextResponse.json({
      success: true,
      message: 'Budget unlocked successfully',
      data: {
        budget_locked: updatedProject.budget_locked,
        budget_locked_at: updatedProject.budget_locked_at,
        budget_locked_by: updatedProject.budget_locked_by,
      },
    });
  } catch (error) {
    console.error('Error in budget unlock route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/budget/lock - Get budget lock status
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number.parseInt(id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: project, error } = await supabase
      .from('projects')
      .select('budget_locked, budget_locked_at, budget_locked_by')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isLocked: project.budget_locked || false,
      lockedAt: project.budget_locked_at,
      lockedBy: project.budget_locked_by,
    });
  } catch (error) {
    console.error('Error in budget lock status route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
