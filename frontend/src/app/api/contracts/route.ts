import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const projectId = searchParams.get('project_id');
    const clientId = searchParams.get('client_id');
    const executedOnly = searchParams.get('executed_only') === 'true';

    let query = supabase
      .from('contracts')
      .select(`
        *,
        client:clients(id, name),
        project:projects(id, name, project_number)
      `)
      .order('contract_number', { ascending: true });

    if (search) {
      query = query.or(`contract_number.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (projectId) {
      query = query.eq('project_id', parseInt(projectId));
    }

    if (clientId) {
      query = query.eq('client_id', parseInt(clientId));
    }

    if (executedOnly) {
      query = query.eq('executed', true);
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

    const projectId = body.project_id ? parseInt(body.project_id, 10) : null;

    if (!projectId) {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
    }

    const clientId = body.client_id ? parseInt(body.client_id, 10) : null;

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        contract_number: body.contract_number,
        title: body.title,
        client_id: clientId,
        project_id: projectId,
        status: body.status || 'draft',
        original_contract_amount: body.original_contract_amount ?? 0,
        revised_contract_amount: body.revised_contract_amount ?? body.original_contract_amount ?? 0,
        retention_percentage: body.retention_percentage ?? null,
        private: body.private ?? false,
        executed: body.executed || false,
        notes: body.notes,
      })
      .select(`
        *,
        client:clients(id, name),
        project:projects(id, name, project_number)
      `)
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
