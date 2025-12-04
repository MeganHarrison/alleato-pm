import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { commitmentSchema } from '@/lib/schemas/financial-schemas';
import type { PaginatedResponse, Commitment, ZodError } from '@/app/api/types';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const companyId = searchParams.get('companyId');
    
    let query = supabase
      .from('commitments')
      .select(`
        *,
        contract_company:companies!contract_company_id(*),
        assignee:users!assignee_id(*)
      `)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (companyId) {
      query = query.eq('contract_company_id', companyId);
    }
    
    if (search) {
      query = query.or(`number.ilike.%${search}%,title.ilike.%${search}%`);
    }
    
    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    const response: PaginatedResponse<Commitment> = {
      data: data || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      }
    };
    return NextResponse.json(response);
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
    
    // Validate request body
    const validatedData = commitmentSchema.parse(body);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Set calculated fields
    const commitment = {
      ...validatedData,
      approved_change_orders: 0,
      revised_contract_amount: validatedData.original_amount,
      billed_to_date: 0,
      balance_to_finish: validatedData.original_amount,
      created_by: user.id,
    };
    
    const { data, error } = await supabase
      .from('commitments')
      .insert(commitment)
      .select(`
        *,
        contract_company:companies!contract_company_id(*),
        assignee:users!assignee_id(*)
      `)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data, { status: 201 });
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