import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

type BudgetCodeResponse = {
  budgetCodes: Array<{
    id: string;
    code: string;
    description: string;
    costType: string | null;
    fullLabel: string;
  }>;
};

type BudgetLineRow = {
  id: string;
  cost_code_id: string;
  description: string | null;
  cost_codes: {
    title: string | null;
  } | null;
  cost_code_types: {
    code: string | null;
    description: string | null;
  } | null;
};

const formatBudgetCode = (options: {
  code: string;
  description?: string | null;
  costType?: string | null;
  costTypeDescription?: string | null;
}) => {
  const { code, description, costType, costTypeDescription } = options;
  const costTypeSuffix = costType ? `.${costType}` : '';
  const typeDescription = costTypeDescription ? ` – ${costTypeDescription}` : '';
  const safeDescription = description || 'No description available';

  return `${code}${costTypeSuffix} – ${safeDescription}${typeDescription}`;
};

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

    // Fetch budget_lines for this project (these are the existing budget lines)
    const { data: budgetLinesData, error: budgetLinesError } = await supabase
      .from('budget_lines')
      .select(
        `
          id,
          cost_code_id,
          description,
          cost_codes ( title ),
          cost_code_types ( code, description )
        `
      )
      .eq('project_id', projectId)
      .order('cost_code_id', { ascending: true });

    if (budgetLinesError) {
      console.error('Error fetching budget lines:', budgetLinesError);
      return NextResponse.json(
        { error: 'Failed to load budget codes', details: budgetLinesError.message },
        { status: 500 }
      );
    }

    // Transform the data
    const budgetCodes: BudgetCodeResponse['budgetCodes'] =
      (budgetLinesData || []).map((item: unknown) => {
        const row = item as BudgetLineRow;
        const costType = row.cost_code_types?.code || null;
        const costTypeDescription = row.cost_code_types?.description || null;
        const costCodeTitle = Array.isArray(row.cost_codes)
          ? row.cost_codes[0]?.title
          : row.cost_codes?.title;
        const description = row.description || costCodeTitle || '';

        return {
          id: row.id,
          code: row.cost_code_id,
          description,
          costType,
          fullLabel: formatBudgetCode({
            code: row.cost_code_id,
            description,
            costType,
            costTypeDescription,
          }),
        };
      });

    return NextResponse.json({ budgetCodes });
  } catch (error) {
    console.error('Error in budget codes route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
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

    const body = await request.json();
    const { cost_code_id, cost_type_id, description } = body;

    if (!cost_code_id) {
      return NextResponse.json(
        { error: 'cost_code_id is required' },
        { status: 400 }
      );
    }

    if (!cost_type_id) {
      return NextResponse.json(
        { error: 'cost_type_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve cost_type_id to UUID
    let costTypeUuid = cost_type_id;

    // If cost_type_id is a string like 'labor', 'material', etc., look it up
    if (typeof cost_type_id === 'string' && !cost_type_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data: costTypeData } = await supabase
        .from('cost_code_types')
        .select('id')
        .ilike('code', cost_type_id)
        .single();

      if (costTypeData) {
        costTypeUuid = costTypeData.id;
      }
    }

    // Insert new budget line (with original_amount = 0 as default)
    const { data: newBudgetLine, error: insertError } = await supabase
      .from('budget_lines')
      .insert({
        project_id: projectId,
        cost_code_id,
        cost_type_id: costTypeUuid,
        description: description || null,
        original_amount: 0,
        created_by: user.id,
      })
      .select(
        `
          id,
          cost_code_id,
          description,
          cost_codes ( title ),
          cost_code_types ( code, description )
        `
      )
      .single();

    if (insertError) {
      console.error('Error creating budget line:', insertError);
      return NextResponse.json(
        { error: 'Failed to create budget code', details: insertError.message },
        { status: 500 }
      );
    }

    // Transform response to match frontend format
    // Cast to unknown first, then to the proper type structure
    const typedBudgetLine = newBudgetLine as unknown as BudgetLineRow;
    const costType = typedBudgetLine.cost_code_types?.code || null;
    const costTypeDescription = typedBudgetLine.cost_code_types?.description || null;
    const costCodeTitle = Array.isArray(typedBudgetLine.cost_codes)
      ? typedBudgetLine.cost_codes[0]?.title
      : typedBudgetLine.cost_codes?.title;
    const finalDescription = typedBudgetLine.description || costCodeTitle || '';

    const budgetCode = {
      id: newBudgetLine.id,
      code: newBudgetLine.cost_code_id,
      description: finalDescription,
      costType,
      fullLabel: formatBudgetCode({
        code: newBudgetLine.cost_code_id,
        description: finalDescription,
        costType,
        costTypeDescription,
      }),
    };

    return NextResponse.json({ budgetCode });
  } catch (error) {
    console.error('Error in POST budget codes route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
