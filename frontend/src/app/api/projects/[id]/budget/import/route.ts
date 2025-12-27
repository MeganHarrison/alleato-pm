import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

import { createServiceClient } from '@/lib/supabase/service';

interface BudgetRow {
  'Cost Code': string;
  'Cost Type': string;
  'Description'?: string;
  'Unit Qty': number;
  'UOM': string;
  'Unit Cost': number;
  'Budget Amount': number;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await context.params;
    const numericProjectId = parseInt(projectId, 10);

    if (Number.isNaN(numericProjectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx)' },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get the first worksheet (Budget Line Items)
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];

    // Convert to JSON
    const rows = XLSX.utils.sheet_to_json<BudgetRow>(worksheet, { defval: '' });

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found in Excel file' },
        { status: 400 }
      );
    }

    // Validate row limit
    if (rows.length > 500) {
      return NextResponse.json(
        { error: 'Maximum 500 line items allowed per import' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Track imported items
    const importedItems: unknown[] = [];
    const errors: string[] = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because Excel is 1-indexed and has header row

      try {
        // Validate required fields
        if (!row['Cost Code']) {
          errors.push(`Row ${rowNum}: Cost Code is required`);
          continue;
        }

        if (!row['Cost Type']) {
          errors.push(`Row ${rowNum}: Cost Type is required`);
          continue;
        }

        // Validate cost type is valid
        const validCostTypes = ['R', 'E', 'X', 'L', 'M', 'S'];
        if (!validCostTypes.includes(row['Cost Type'])) {
          errors.push(`Row ${rowNum}: Invalid Cost Type "${row['Cost Type']}". Must be one of: ${validCostTypes.join(', ')}`);
          continue;
        }

        // Find or validate the cost code exists for this project
        const { data: projectCostCode, error: costCodeError } = await supabase
          .from('project_budget_codes')
          .select('id, cost_code_id, cost_type_id')
          .eq('project_id', numericProjectId)
          .eq('cost_code_id', row['Cost Code'])
          .eq('cost_type_id', row['Cost Type'])
          .eq('is_active', true)
          .single();

        if (costCodeError || !projectCostCode) {
          errors.push(`Row ${rowNum}: Cost code "${row['Cost Code']}" with type "${row['Cost Type']}" not found in project budget codes`);
          continue;
        }

        // Prepare budget line item data
        const lineItemData = {
          project_id: numericProjectId,
          cost_code_id: row['Cost Code'],
          cost_type_id: row['Cost Type'],
          description: row.Description || null,
          original_amount: row['Budget Amount'] || 0,
          unit_qty: row['Unit Qty'] || null,
          uom: row.UOM || null,
          unit_cost: row['Unit Cost'] || null,
        };

        // Insert budget line item
        const { data: insertedItem, error: insertError } = await supabase
          .from('budget_lines')
          .insert(lineItemData)
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting budget line:', insertError);
          errors.push(`Row ${rowNum}: ${insertError.message}`);
          continue;
        }

        importedItems.push(insertedItem);
      } catch (rowError) {
        console.error(`Error processing row ${rowNum}:`, rowError);
        errors.push(`Row ${rowNum}: ${rowError instanceof Error ? rowError.message : 'Unknown error'}`);
      }
    }

    // Return results
    return NextResponse.json({
      success: true,
      importedCount: importedItems.length,
      totalRows: rows.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${importedItems.length} of ${rows.length} line items`,
    });

  } catch (error) {
    console.error('Budget import error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to import budget',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
