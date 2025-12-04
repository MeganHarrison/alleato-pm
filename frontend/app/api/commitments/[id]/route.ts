import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { commitmentSchema } from '@/lib/schemas/financial-schemas';
import type { ZodError } from '@/app/api/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('commitments')
      .select(`
        *,
        contract_company:companies!contract_company_id(*),
        assignee:users!assignee_id(*),
        line_items:commitment_line_items(*),
        change_orders:change_orders(*),
        invoices(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Commitment not found' }, { status: 404 });
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
    const validatedData = commitmentSchema.parse(body);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if commitment exists
    const { data: existing, error: fetchError } = await supabase
      .from('commitments')
      .select('id')
      .eq('id', id)
      .single();
    
    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Commitment not found' }, { status: 404 });
    }
    
    // Update commitment
    const { data, error } = await supabase
      .from('commitments')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        contract_company:companies!contract_company_id(*),
        assignee:users!assignee_id(*)
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
    
    // Check if commitment exists and has dependencies
    const { data: commitment, error: fetchError } = await supabase
      .from('commitments')
      .select(`
        id,
        change_orders(id),
        invoices(id)
      `)
      .eq('id', id)
      .single();
    
    if (fetchError || !commitment) {
      return NextResponse.json({ error: 'Commitment not found' }, { status: 404 });
    }
    
    // Check for dependencies
    const hasChangeOrders = commitment.change_orders && commitment.change_orders.length > 0;
    const hasInvoices = commitment.invoices && commitment.invoices.length > 0;
    
    if (hasChangeOrders || hasInvoices) {
      return NextResponse.json(
        { 
          error: 'Cannot delete commitment',
          message: 'This commitment has associated change orders or invoices. Please delete those first.'
        },
        { status: 400 }
      );
    }
    
    // Delete commitment
    const { error } = await supabase
      .from('commitments')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Commitment deleted successfully' });
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