import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { Company } from '@/app/api/types';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (type) {
      // Allow filtering by multiple types using comma separation
      const types = type.split(',');
      query = query.in('type', types);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const companies: Company[] = data || [];
    return NextResponse.json(companies);
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
      .from('companies')
      .insert({
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        website: body.website,
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