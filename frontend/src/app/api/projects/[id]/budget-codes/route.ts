import { NextRequest, NextResponse } from 'next/server';

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
  { params }: { params: { id: string } }
) {
  try {
    const projectId = Number.parseInt(params.id, 10);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Prefer project-specific cost codes when they exist
    const { data: projectCostCodes, error: projectCostCodesError } = await supabase
      .from('project_cost_codes')
      .select(
        `
          cost_code_id,
          cost_type_id,
          cost_codes ( id, description ),
          cost_code_types ( id, code, description )
        `
      )
      .eq('project_id', projectId)
      .eq('is_active', true);

    if (projectCostCodesError) {
      console.error('Error fetching project cost codes:', projectCostCodesError);
      return NextResponse.json(
        { error: 'Failed to load project cost codes' },
        { status: 500 }
      );
    }

    // Fallback to global cost codes if the project has none configured
    let budgetCodes: BudgetCodeResponse['budgetCodes'] = [];

    if (projectCostCodes && projectCostCodes.length > 0) {
      type ProjectCostCodeRow = {
        cost_code_id: string | null;
        cost_type_id: string | null;
        cost_codes?: { id: string; description: string | null }[] | null;
        cost_code_types?: { id: string; code: string | null; description: string | null }[] | null;
      };

      budgetCodes = (projectCostCodes as ProjectCostCodeRow[]).map((item) => {
        const costCode = item.cost_codes?.[0];
        const costTypeEntry = item.cost_code_types?.[0];
        const code = costCode?.id || item.cost_code_id || '';
        const description = costCode?.description;
        const costType = costTypeEntry?.code || item.cost_type_id || null;
        const costTypeDescription = costTypeEntry?.description;

        return {
          id: code,
          code,
          description: description || '',
          costType,
          fullLabel: formatBudgetCode({
            code,
            description,
            costType,
            costTypeDescription,
          }),
        };
      });
    } else {
      const { data: costCodes, error: costCodesError } = await supabase
        .from('cost_codes')
        .select('id, description')
        .eq('status', 'True')
        .order('id', { ascending: true });

      if (costCodesError) {
        console.error('Error fetching cost codes:', costCodesError);
        return NextResponse.json(
          { error: 'Failed to load cost codes' },
          { status: 500 }
        );
      }

      budgetCodes = (costCodes || []).map((code) => ({
        id: code.id,
        code: code.id,
        description: code.description || '',
        costType: null,
        fullLabel: formatBudgetCode({ code: code.id, description: code.description }),
      }));
    }

    return NextResponse.json({ budgetCodes });
  } catch (error) {
    console.error('Error in budget codes route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
