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
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronDown } from 'lucide-react';

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
  const [pendingRowId, setPendingRowId] = useState<string | null>(null); // Track which row triggered modal

  // Budget Code creation state
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false);
  const [creatingBudgetCode, setCreatingBudgetCode] = useState(false);
  const [newCodeData, setNewCodeData] = useState({
    costCodeId: '',
    costType: 'R',
  });
  const [availableCostCodes, setAvailableCostCodes] = useState<
    Array<{
      id: string;
      title: string | null;
      status: string | null;
      division_title: string | null;
    }>
  >([]);
  const [loadingCostCodes, setLoadingCostCodes] = useState(false);
  const [groupedCostCodes, setGroupedCostCodes] = useState<
    Record<
      string,
      Array<{
        id: string;
        title: string | null;
        status: string | null;
        division_title: string | null;
      }>
    >
  >({});
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());

  // Load active project cost codes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('project_budget_codes')
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
        // Filter to only include cost codes with cost types (required by schema)
        const validCostCodes = (data as unknown as ProjectCostCode[])?.filter(cc => cc.cost_type_id) || [];
        setProjectCostCodes(validCostCodes);
      } catch (error) {
        console.error('Error loading project cost codes:', error);
        toast.error('Failed to load project cost codes');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [projectId]);

  // Fetch cost codes when create modal opens
  useEffect(() => {
    const fetchCostCodes = async () => {
      if (!showCreateCodeModal) return;

      try {
        setLoadingCostCodes(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('cost_codes')
          .select('id, title, status, division_title')
          .eq('status', 'Active')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching cost codes:', error);
          return;
        }

        const codes = data || [];
        setAvailableCostCodes(codes);

        // Group cost codes by division_title
        const grouped = codes.reduce((acc, code) => {
          const divisionKey = code.division_title || 'Other';
          if (!acc[divisionKey]) {
            acc[divisionKey] = [];
          }
          acc[divisionKey].push(code);
          return acc;
        }, {} as Record<string, typeof codes>);

        setGroupedCostCodes(grouped);
      } catch (error) {
        console.error('Error fetching cost codes:', error);
      } finally {
        setLoadingCostCodes(false);
      }
    };

    fetchCostCodes();
  }, [showCreateCodeModal]);

  const getCostTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      R: 'Contract Revenue',
      E: 'Equipment',
      X: 'Expense',
      L: 'Labor',
      M: 'Material',
      S: 'Subcontract',
    };
    return types[type] || type;
  };

  const toggleDivision = (division: string) => {
    setExpandedDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(division)) {
        next.delete(division);
      } else {
        next.add(division);
      }
      return next;
    });
  };

  const handleCreateBudgetCode = async () => {
    try {
      setCreatingBudgetCode(true);

      const selectedCostCode = availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId);
      if (!selectedCostCode) {
        toast.error('Please select a cost code');
        return;
      }

      // Call API to create project budget code
      const response = await fetch(`/api/projects/${projectId}/budget-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cost_code_id: newCodeData.costCodeId,
          cost_type_id: newCodeData.costType,
          description: selectedCostCode.title || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Failed to create budget code');
      }

      const result = await response.json();

      // Refresh project cost codes to include the new one
      const supabase = createClient();
      const { data: refreshedData } = await supabase
        .from('project_budget_codes')
        .select(`
          id,
          cost_code_id,
          cost_type_id,
          is_active,
          cost_codes!inner ( id, title, division_title ),
          cost_code_types ( id, code, description )
        `)
        .eq('project_id', parseInt(projectId, 10))
        .eq('is_active', true)
        .order('cost_code_id', { ascending: true });

      if (refreshedData) {
        const validCostCodes = (refreshedData as unknown as ProjectCostCode[])?.filter(cc => cc.cost_type_id) || [];
        setProjectCostCodes(validCostCodes);

        // Auto-populate the pending row with the newly created budget code
        if (pendingRowId && result.data?.id) {
          const newCode = validCostCodes.find(cc => cc.id === result.data.id);
          if (newCode) {
            handleBudgetCodeSelect(pendingRowId, newCode);
          }
        }
      }

      setShowCreateCodeModal(false);
      setNewCodeData({ costCodeId: '', costType: 'R' });
      setPendingRowId(null);
      toast.success('Budget code created successfully');
    } catch (error) {
      console.error('Error creating budget code:', error);
      toast.error(
        `Failed to create budget code: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setCreatingBudgetCode(false);
    }
  };

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
              qty: item.qty || '1', // Auto-set quantity to 1 if not already set
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

    // Validate that all selected cost codes have a cost type
    const missingCostType = lineItems.filter(item => {
      const costCode = projectCostCodes.find(cc => cc.id === item.projectCostCodeId);
      return !costCode?.cost_type_id;
    });
    if (missingCostType.length > 0) {
      toast.error('All selected budget codes must have a cost type');
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
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                <CommandSeparator />
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      setPendingRowId(row.id);
                                      setOpenPopoverId(null);
                                      setShowCreateCodeModal(true);
                                    }}
                                    className="text-blue-600"
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Budget Code
                                  </CommandItem>
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
                        <Select
                          value={row.uom}
                          onValueChange={(value) => handleFieldChange(row.id, 'uom', value)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Select UOM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EA">EA - Each</SelectItem>
                            <SelectItem value="SF">SF - Square Foot</SelectItem>
                            <SelectItem value="LF">LF - Linear Foot</SelectItem>
                            <SelectItem value="SY">SY - Square Yard</SelectItem>
                            <SelectItem value="CY">CY - Cubic Yard</SelectItem>
                            <SelectItem value="TON">TON - Ton</SelectItem>
                            <SelectItem value="HR">HR - Hour</SelectItem>
                            <SelectItem value="DAY">DAY - Day</SelectItem>
                            <SelectItem value="LS">LS - Lump Sum</SelectItem>
                            <SelectItem value="LB">LB - Pound</SelectItem>
                            <SelectItem value="GAL">GAL - Gallon</SelectItem>
                            <SelectItem value="CF">CF - Cubic Foot</SelectItem>
                            <SelectItem value="BF">BF - Board Foot</SelectItem>
                            <SelectItem value="MSF">MSF - Thousand Square Feet</SelectItem>
                          </SelectContent>
                        </Select>
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

      {/* Create Budget Code Modal */}
      <Dialog open={showCreateCodeModal} onOpenChange={setShowCreateCodeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Budget Code</DialogTitle>
            <DialogDescription>
              Add a new budget code that can be used for line items in this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="costCode">Cost Code*</Label>
              {loadingCostCodes ? (
                <div className="border rounded-md p-3 text-sm text-gray-500">Loading cost codes...</div>
              ) : (
                <div className="border rounded-md max-h-[400px] overflow-y-auto">
                  {Object.entries(groupedCostCodes)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([division]) => (
                      <div key={division} className="border-b last:border-b-0">
                        <button
                          type="button"
                          onClick={() => toggleDivision(division)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-semibold text-gray-700">{division}</span>
                          {expandedDivisions.has(division) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        {expandedDivisions.has(division) && (
                          <div className="bg-gray-50/50">
                            {groupedCostCodes[division].map((costCode) => (
                              <button
                                key={costCode.id}
                                type="button"
                                onClick={() => setNewCodeData({ ...newCodeData, costCodeId: costCode.id })}
                                className={`w-full text-left px-6 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                  newCodeData.costCodeId === costCode.id
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-700'
                                }`}
                              >
                                {costCode.division_title || costCode.id} - {costCode.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
              <p className="text-sm text-gray-500">Click on a division to expand and select a cost code</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="costType">Cost Type*</Label>
              <Select
                value={newCodeData.costType}
                onValueChange={(value) => setNewCodeData({ ...newCodeData, costType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R">R - Contract Revenue</SelectItem>
                  <SelectItem value="E">E - Equipment</SelectItem>
                  <SelectItem value="X">X - Expense</SelectItem>
                  <SelectItem value="L">L - Labor</SelectItem>
                  <SelectItem value="M">M - Material</SelectItem>
                  <SelectItem value="S">S - Subcontract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Preview:</p>
              <p className="text-sm text-gray-600 mt-1">
                {newCodeData.costCodeId ? (
                  <>
                    {availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId)?.division_title ||
                     availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId)?.id}.
                    {newCodeData.costType} – {' '}
                    {availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId)?.title} – {' '}
                    {getCostTypeLabel(newCodeData.costType)}
                  </>
                ) : (
                  'Select cost code and cost type to see preview'
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreateCodeModal(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateBudgetCode}
              disabled={creatingBudgetCode || !newCodeData.costCodeId || !newCodeData.costType}
            >
              {creatingBudgetCode ? 'Creating...' : 'Create Budget Code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
