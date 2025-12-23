'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ProjectCostCode {
  id: string;
  cost_code_id: string;
  cost_type_id: string | null;
  is_active: boolean | null;
  cost_codes: {
    id: string;
    title: string | null;
    division_title: string | null;
  } | null;
  cost_code_types: {
    id: string;
    code: string;
    description: string;
  } | null;
}

interface BudgetLineItem {
  id: string;
  projectCostCodeId: string;
  costCodeLabel: string;
  qty: string;
  uom: string;
  unitCost: string;
  amount: string;
}

export default function BudgetSetupPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [projectCostCodes, setProjectCostCodes] = useState<ProjectCostCode[]>([]);
  const [lineItems, setLineItems] = useState<BudgetLineItem[]>([
    {
      id: crypto.randomUUID(),
      projectCostCodeId: '',
      costCodeLabel: '',
      qty: '',
      uom: '',
      unitCost: '',
      amount: '',
    },
  ]);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load active project cost codes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('project_cost_codes')
          .select(`
            id,
            cost_code_id,
            cost_type_id,
            is_active,
            cost_codes!inner (
              id,
              title,
              division_title
            ),
            cost_code_types (
              id,
              code,
              description
            )
          `)
          .eq('project_id', parseInt(projectId, 10))
          .eq('is_active', true)
          .order('cost_code_id', { ascending: true });

        if (error) throw error;

        console.warn('Loaded project cost codes:', data);
        setProjectCostCodes((data as unknown as ProjectCostCode[]) || []);
      } catch (error) {
        console.error('Error loading project cost codes:', error);
        toast.error('Failed to load project cost codes');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleAddRow = () => {
    setLineItems([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        projectCostCodeId: '',
        costCodeLabel: '',
        qty: '',
        uom: '',
        unitCost: '',
        amount: '',
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length === 1) {
      toast.error('At least one line item is required');
      return;
    }
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleBudgetCodeSelect = (rowId: string, costCode: ProjectCostCode) => {
    console.warn('Selected cost code:', costCode);
    const costCodeTitle = costCode.cost_codes?.title || '';
    console.warn('Cost code title:', costCodeTitle);
    const label = `${costCode.cost_code_id} – ${costCodeTitle}`;
    console.warn('Generated label:', label);

    setLineItems(
      lineItems.map(item =>
        item.id === rowId
          ? {
              ...item,
              projectCostCodeId: costCode.id,
              costCodeLabel: label,
            }
          : item
      )
    );
    setOpenPopoverId(null);
  };

  const handleFieldChange = (id: string, field: keyof BudgetLineItem, value: string) => {
    setLineItems(
      lineItems.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Auto-calculate amount when qty or unitCost changes
        if (field === 'qty' || field === 'unitCost') {
          const qty = parseFloat(field === 'qty' ? value : item.qty) || 0;
          const unitCost = parseFloat(field === 'unitCost' ? value : item.unitCost) || 0;
          updated.amount = (qty * unitCost).toFixed(2);
        }

        return updated;
      })
    );
  };

  const filteredCostCodes = projectCostCodes.filter(code => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const costCodeTitle = code.cost_codes?.title || '';
    const costTypeCode = code.cost_code_types?.code || '';
    const costTypeDesc = code.cost_code_types?.description || '';
    return (
      code.cost_code_id.toLowerCase().includes(query) ||
      costCodeTitle.toLowerCase().includes(query) ||
      costTypeCode.toLowerCase().includes(query) ||
      costTypeDesc.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async () => {
    // Validate that all rows have a budget code selected
    const invalidRows = lineItems.filter(item => !item.projectCostCodeId);
    if (invalidRows.length > 0) {
      toast.error('Please select a budget code for all line items');
      return;
    }

    try {
      setLoading(true);

      const formattedLineItems = lineItems.map(item => {
        const costCode = projectCostCodes.find(cc => cc.id === item.projectCostCodeId);
        return {
          costCodeId: costCode?.cost_code_id || '',
          costType: costCode?.cost_type_id ?? null,
          amount: item.amount || '0',
          description: null,
          qty: item.qty ? item.qty : null,
          uom: item.uom ? item.uom : null,
          unitCost: item.unitCost ? item.unitCost : null,
        };
      });

      const response = await fetch(`/api/projects/${projectId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems: formattedLineItems }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', result);
        throw new Error(result.error || 'Failed to create budget lines');
      }

      toast.success(`Successfully created ${lineItems.length} budget line(s)`);
      router.push(`/${projectId}/budget`);
    } catch (error) {
      console.error('Error creating budget lines:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create budget lines');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/${projectId}/budget`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Budget
              </Button>

              {/* Heading */}
              <div className="mt-2">
                <h1 className="text-2xl font-semibold mb-2">Add Budget Line Items</h1>
                <p className="text-sm text-gray-600">
                  Add new line items to your project budget
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleAddRow}>
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
              <Button onClick={handleSubmit} disabled={loading || lineItems.length === 0}>
                {loading ? 'Creating...' : `Create ${lineItems.length} Line Item${lineItems.length !== 1 ? 's' : ''}`}
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border bg-white shadow-sm">
          {/* Summary Bar */}
          <div className="border-b bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {lineItems.length} Line Item{lineItems.length !== 1 ? 's' : ''}
              </span>
              <span className="font-semibold text-gray-900">
                Total: ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Budget Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    UOM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loadingData ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading project cost codes...
                    </td>
                  </tr>
                ) : lineItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No line items. Click "Add Row" to get started.
                    </td>
                  </tr>
                ) : (
                  lineItems.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Popover
                          open={openPopoverId === row.id}
                          onOpenChange={(open) => setOpenPopoverId(open ? row.id : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-start text-left font-normal"
                            >
                              <span className={row.costCodeLabel ? 'text-gray-900' : 'text-gray-500'}>
                                {row.costCodeLabel || 'Select budget code...'}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[500px] p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Search budget codes..."
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                className="border-0"
                              />
                              <CommandList>
                                <CommandEmpty>No budget codes found.</CommandEmpty>
                                <CommandGroup>
                                  {filteredCostCodes.map((code) => {
                                    const costCodeTitle = code.cost_codes?.title || '';
                                    const displayLabel = `${code.cost_code_id} – ${costCodeTitle}`;

                                    return (
                                      <CommandItem
                                        key={code.id}
                                        value={displayLabel}
                                        onSelect={() => handleBudgetCodeSelect(row.id, code)}
                                      >
                                        {displayLabel}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          placeholder="0"
                          value={row.qty}
                          onChange={(e) => handleFieldChange(row.id, 'qty', e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          placeholder="EA"
                          value={row.uom}
                          onChange={(e) => handleFieldChange(row.id, 'uom', e.target.value)}
                          className="w-20"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={row.unitCost}
                          onChange={(e) => handleFieldChange(row.id, 'unitCost', e.target.value)}
                          className="w-32"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={row.amount}
                          onChange={(e) => handleFieldChange(row.id, 'amount', e.target.value)}
                          className="w-32"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRow(row.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
