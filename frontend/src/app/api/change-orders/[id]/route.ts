import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { changeOrderSchema } from '@/lib/schemas/financial-schemas';
import type { ZodError } from '@/app/api/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('change_orders')
      .select(`
        *,
        commitment:commitments!commitment_id(
          id,
          number,
          title,
          contract_company:companies!contract_company_id(*)
        ),
        change_event:change_events!change_event_id(id, number, title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Change order not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body
    const validatedData = changeOrderSchema.parse(body);

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if change order exists
    const { data: existing, error: fetchError } = await supabase
      .from('change_orders')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Change order not found' }, { status: 404 });
    }

    // Update change order
    const { data, error } = await supabase
      .from('change_orders')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        commitment:commitments!commitment_id(id, number, title),
        change_event:change_events!change_event_id(id, number, title)
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as ZodError;
      return NextResponse.json(
        { error: 'Validation error', issues: zodError.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if change order exists
    const { data: changeOrder, error: fetchError } = await supabase
      .from('change_orders')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !changeOrder) {
      return NextResponse.json({ error: 'Change order not found' }, { status: 404 });
    }

    // Prevent deleting executed change orders
    if (changeOrder.status === 'executed') {
      return NextResponse.json(
        {
          error: 'Cannot delete change order',
          message: 'Executed change orders cannot be deleted. Consider voiding instead.'
        },
        { status: 400 }
      );
    }

    // Delete change order
    const { error } = await supabase
      .from('change_orders')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Change order deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
