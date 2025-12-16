import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const projectId = searchParams.get('project_id');
    const commitmentId = searchParams.get('commitment_id');

    let query = supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`invoice_number.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (projectId) {
      query = query.eq('project_id', parseInt(projectId));
    }

    if (commitmentId) {
      query = query.eq('commitment_id', commitmentId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: body.invoice_number,
        commitment_id: body.commitment_id || null,
        contract_id: body.contract_id || null,
        project_id: body.project_id || null,
        billing_period_start: body.billing_period_start,
        billing_period_end: body.billing_period_end,
        invoice_date: body.invoice_date,
        due_date: body.due_date,
        status: body.status || 'draft',
        amount: body.amount || 0,
        retention_amount: body.retention_amount || 0,
        net_amount: body.net_amount || 0,
        notes: body.notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
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
