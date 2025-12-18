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

type BudgetCodeRow = {
  id: string;
  cost_code_id: string;
  description: string | null;
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

    // Fetch budget_codes for this project (these are the codes available for line items)
    const { data: budgetCodesData, error: budgetCodesError } = await supabase
      .from('budget_codes')
      .select(
        `
          id,
          cost_code_id,
          description,
          cost_code_types ( code, description )
        `
      )
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (budgetCodesError) {
      console.error('Error fetching budget codes:', budgetCodesError);
      return NextResponse.json(
        { error: 'Failed to load budget codes', details: budgetCodesError.message },
        { status: 500 }
      );
    }

    // Transform the data
    const budgetCodes: BudgetCodeResponse['budgetCodes'] =
      (budgetCodesData || []).map((item: BudgetCodeRow) => {
        const costType = item.cost_code_types?.code || null;
        const costTypeDescription = item.cost_code_types?.description || null;

        return {
          id: item.id,
          code: item.cost_code_id,
          description: item.description || '',
          costType,
          fullLabel: formatBudgetCode({
            code: item.cost_code_id,
            description: item.description,
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

    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert new budget code
    const { data: newBudgetCode, error: insertError } = await supabase
      .from('budget_codes')
      .insert({
        project_id: projectId,
        cost_code_id,
        cost_type_id: cost_type_id || null,
        description: description || null,
        created_by: user.id,
      })
      .select(
        `
          id,
          cost_code_id,
          description,
          cost_code_types ( code, description )
        `
      )
      .single();

    if (insertError) {
      console.error('Error creating budget code:', insertError);
      return NextResponse.json(
        { error: 'Failed to create budget code', details: insertError.message },
        { status: 500 }
      );
    }

    // Transform response to match frontend format
    const costType = newBudgetCode.cost_code_types?.code || null;
    const costTypeDescription = newBudgetCode.cost_code_types?.description || null;

    const budgetCode = {
      id: newBudgetCode.id,
      code: newBudgetCode.cost_code_id,
      description: newBudgetCode.description || '',
      costType,
      fullLabel: formatBudgetCode({
        code: newBudgetCode.cost_code_id,
        description: newBudgetCode.description,
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
