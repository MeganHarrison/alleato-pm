'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Search, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { DevAutoFillButton } from '@/hooks/use-dev-autofill';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { getDivisionMetadataFromCostCodeId } from '@/lib/cost-code-divisions';

interface BudgetCode {
  id: string;
  code: string;
  costType: string | null; // L = Labor, M = Material, E = Equipment, S = Subcontract, O = Other
  description: string;
  fullLabel: string; // Composite label like "01-3120.L – Vice President – Labor"
}

interface BudgetLineItemRow {
  id: string;
  budgetCodeId: string;
  budgetCodeLabel: string;
  qty: string;
  uom: string;
  unitCost: string;
  amount: string;
}

type CostCodeOption = {
  id: string;
  description: string | null;
  status: string | null;
  divisionCode: string;
  divisionTitle: string;
};

export default function NewBudgetLineItemPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [loading, setLoading] = useState(false);
  const [budgetCodes, setBudgetCodes] = useState<BudgetCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);

  // Cost codes from Supabase
  const [availableCostCodes, setAvailableCostCodes] = useState<CostCodeOption[]>([]);
  const [loadingCostCodes, setLoadingCostCodes] = useState(false);
  const [groupedCostCodes, setGroupedCostCodes] = useState<Record<string, CostCodeOption[]>>({});

  // Multiple rows state
  const [rows, setRows] = useState<BudgetLineItemRow[]>([
    {
      id: '1',
      budgetCodeId: '',
      budgetCodeLabel: '',
      qty: '',
      uom: '',
      unitCost: '',
      amount: '0.00',
    },
  ]);

  // Budget Code creation modal state
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false);
  const [newCodeData, setNewCodeData] = useState({
    costCodeId: '', // ID from cost_codes table
    costType: 'L',
  });
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());

  // Budget Code selector state
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch cost codes from Supabase when modal opens
  useEffect(() => {
    const fetchCostCodes = async () => {
      if (!showCreateCodeModal) return;

      try {
        setLoadingCostCodes(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('cost_codes')
          .select('id, description, status')
          .eq('status', 'True')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching cost codes:', error);
          return;
        }

        const codesWithDivisions =
          data?.map((code) => {
            const { divisionCode, divisionTitle } = getDivisionMetadataFromCostCodeId(code.id);
            return {
              ...code,
              divisionCode,
              divisionTitle,
            };
          }) ?? [];

        setAvailableCostCodes(codesWithDivisions);

        // Group cost codes by division_title
        const grouped = codesWithDivisions.reduce((acc, code) => {
          const divisionKey = code.divisionTitle || 'Other';
          if (!acc[divisionKey]) {
            acc[divisionKey] = [];
          }
          acc[divisionKey].push(code);
          return acc;
        }, {} as Record<string, CostCodeOption[]>);

        setGroupedCostCodes(grouped);
      } catch (error) {
        console.error('Error fetching cost codes:', error);
      } finally {
        setLoadingCostCodes(false);
      }
    };

    fetchCostCodes();
  }, [showCreateCodeModal]);

  // Fetch budget codes for the project
  useEffect(() => {
    const fetchBudgetCodes = async () => {
      if (!projectId) return;

      try {
        setLoadingCodes(true);
        const response = await fetch(`/api/projects/${projectId}/budget-codes`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error?.error || 'Failed to load budget codes');
        }

        const { budgetCodes } = (await response.json()) as {
          budgetCodes: BudgetCode[];
        };

        setBudgetCodes(budgetCodes || []);
      } catch (error) {
        console.error('Error fetching budget codes:', error);
        setBudgetCodes([]);
      } finally {
        setLoadingCodes(false);
      }
    };

    fetchBudgetCodes();
  }, [projectId]);

  const getCostTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      L: 'Labor',
      M: 'Material',
      E: 'Equipment',
      S: 'Subcontract',
      O: 'Other',
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
      setLoading(true);

      // Find the selected cost code
      const selectedCostCode = availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId);
      if (!selectedCostCode) {
        alert('Please select a cost code');
        return;
      }

      // Get the cost_type_id from cost_code_types table
      // For now, we'll use a simple lookup. In production, this should query the cost_code_types table
      const costTypeMap: Record<string, string> = {
        L: 'labor',
        M: 'material',
        E: 'equipment',
        S: 'subcontract',
        O: 'other',
      };

      // API call to create budget code
      const response = await fetch(`/api/projects/${projectId}/budget-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cost_code_id: newCodeData.costCodeId,
          cost_type_id: costTypeMap[newCodeData.costType] || null,
          description: selectedCostCode.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to create budget code');
      }

      const { budgetCode: createdCode } = await response.json();

      // Add the new code to the list
      setBudgetCodes([...budgetCodes, createdCode]);

      // Reset modal
      setShowCreateCodeModal(false);
      setNewCodeData({ costCodeId: '', costType: 'L' });
    } catch (error) {
      console.error('Error creating budget code:', error);
      alert(
        `Failed to create budget code: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetCodeSelect = (rowId: string, code: BudgetCode) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? { ...row, budgetCodeId: code.id, budgetCodeLabel: code.fullLabel }
          : row
      )
    );
    setOpenPopoverId(null);
  };

  const calculateAmount = (qty: string, unitCost: string): string => {
    const qtyNum = parseFloat(qty) || 0;
    const costNum = parseFloat(unitCost) || 0;
    return (qtyNum * costNum).toFixed(2);
  };

  const handleRowChange = (
    rowId: string,
    field: keyof BudgetLineItemRow,
    value: string
  ) => {
    setRows(
      rows.map((row) => {
        if (row.id !== rowId) return row;

        const updatedRow = { ...row, [field]: value };

        // Auto-calculate amount when qty or unitCost changes
        if (field === 'qty' || field === 'unitCost') {
          updatedRow.amount = calculateAmount(updatedRow.qty, updatedRow.unitCost);
        }

        return updatedRow;
      })
    );
  };

  const addRow = () => {
    const newRow: BudgetLineItemRow = {
      id: Date.now().toString(),
      budgetCodeId: '',
      budgetCodeLabel: '',
      qty: '',
      uom: '',
      unitCost: '',
      amount: '0.00',
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length === 1) return; // Keep at least one row
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate: all rows must have a budget code and amount
      const invalidRows = rows.filter(
        (row) => !row.budgetCodeId || parseFloat(row.amount) === 0
      );

      if (invalidRows.length > 0) {
        alert('All rows must have a budget code and a non-zero amount.');
        setLoading(false);
        return;
      }

      const lineItemsToSubmit = rows.map((row) => {
        const budgetCode = budgetCodes.find((code) => code.id === row.budgetCodeId);

        return {
          costCodeId: budgetCode?.code || row.budgetCodeId,
          costType: budgetCode?.costType || null,
          qty: row.qty,
          uom: row.uom,
          unitCost: row.unitCost,
          amount: row.amount,
        };
      });

      const response = await fetch(`/api/projects/${projectId}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems: lineItemsToSubmit,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to create budget line items');
      }

      await response.json();

      // Navigate back to project budget page
      router.push(`/${projectId}/budget`);
    } catch (error) {
      console.error('Error creating budget line items:', error);
      alert(
        `Failed to create budget line items: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${projectId}/budget`);
  };

  const filteredCodes = budgetCodes.filter((code) =>
    code.fullLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const previewCostCode = availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${projectId}/budget`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Budget
          </Button>
        </div>
        <h1 className="text-2xl font-bold">Create Budget Line Items</h1>
        <p className="text-gray-600">Add one or more line items to the project budget</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[300px]">
                    Budget Code*
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-24">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-28">
                    UOM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-32">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-32">
                    Amount*
                  </th>
                  <th className="px-4 py-3 w-12">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>

                    {/* Budget Code Selector */}
                    <td className="px-4 py-3">
                      <Popover
                        open={openPopoverId === row.id}
                        onOpenChange={(open) => setOpenPopoverId(open ? row.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between text-left font-normal h-9"
                          >
                            <span className="truncate">
                              {row.budgetCodeLabel || 'Select budget code...'}
                            </span>
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search budget codes..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandList>
                              <CommandEmpty>
                                {loadingCodes ? 'Loading...' : 'No budget codes found.'}
                              </CommandEmpty>
                              <CommandGroup>
                                {filteredCodes.map((code) => (
                                  <CommandItem
                                    key={code.id}
                                    value={code.fullLabel}
                                    onSelect={() => handleBudgetCodeSelect(row.id, code)}
                                  >
                                    {code.fullLabel}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandSeparator />
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
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

                    {/* Quantity */}
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        step="0.001"
                        value={row.qty}
                        onChange={(e) => handleRowChange(row.id, 'qty', e.target.value)}
                        placeholder="0"
                        className="h-9"
                      />
                    </td>

                    {/* UOM */}
                    <td className="px-4 py-3">
                      <Select
                        value={row.uom}
                        onValueChange={(value) => handleRowChange(row.id, 'uom', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EA">EA</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="SF">SF</SelectItem>
                          <SelectItem value="LF">LF</SelectItem>
                          <SelectItem value="LS">LS</SelectItem>
                          <SelectItem value="CY">CY</SelectItem>
                          <SelectItem value="TON">TON</SelectItem>
                          <SelectItem value="DAY">DAY</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Unit Cost */}
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.unitCost}
                        onChange={(e) => handleRowChange(row.id, 'unitCost', e.target.value)}
                        placeholder="0.00"
                        className="h-9"
                      />
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.amount}
                        onChange={(e) => handleRowChange(row.id, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="h-9 font-medium"
                      />
                    </td>

                    {/* Delete */}
                    <td className="px-4 py-3">
                      {rows.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(row.id)}
                          className="h-9 w-9 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-4 mt-6">
          <DevAutoFillButton
            formType="budgetLineItem"
            onAutoFill={(data) => {
              setRows([{
                id: '1',
                budgetCodeId: '',
                budgetCodeLabel: '',
                qty: data.quantity?.toString() || '',
                uom: data.unit || '',
                unitCost: data.unit_cost?.toString() || '',
                amount: data.amount?.toString() || '0.00',
              }]);
            }}
          />
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : `Create ${rows.length} Line Item${rows.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </form>

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
                <div className="border rounded-md p-3 text-sm text-gray-500">
                  Loading cost codes...
                </div>
              ) : (
                <div className="border rounded-md max-h-[400px] overflow-y-auto">
                  {Object.entries(groupedCostCodes)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([division]) => (
                    <div key={division} className="border-b last:border-b-0">
                      {/* Division Header - Clickable */}
                      <button
                        type="button"
                        onClick={() => toggleDivision(division)}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          {division}
                        </span>
                        {expandedDivisions.has(division) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      {/* Cost Codes - Only show when expanded */}
                      {expandedDivisions.has(division) && (
                        <div className="bg-gray-50/50">
                          {groupedCostCodes[division].map((costCode) => (
                            <button
                              key={costCode.id}
                              type="button"
                              onClick={() =>
                                setNewCodeData({ ...newCodeData, costCodeId: costCode.id })
                              }
                              className={`w-full text-left px-6 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                newCodeData.costCodeId === costCode.id
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-700'
                              }`}
                            >
                              {costCode.id} – {costCode.description}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Click on a division to expand and select a cost code
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="costType">Cost Type*</Label>
              <Select
                value={newCodeData.costType}
                onValueChange={(value) =>
                  setNewCodeData({ ...newCodeData, costType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L - Labor</SelectItem>
                  <SelectItem value="M">M - Material</SelectItem>
                  <SelectItem value="E">E - Equipment</SelectItem>
                  <SelectItem value="S">S - Subcontract</SelectItem>
                  <SelectItem value="O">O - Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Preview:</p>
              <p className="text-sm text-gray-600 mt-1">
                {newCodeData.costCodeId && previewCostCode ? (
                  <>
                    {previewCostCode.id}.{newCodeData.costType} – {previewCostCode.description} –{' '}
                    {getCostTypeLabel(newCodeData.costType)}
                  </>
                ) : (
                  'Select cost code and cost type to see preview'
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateCodeModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateBudgetCode}
              disabled={loading || !newCodeData.costCodeId || !newCodeData.costType}
            >
              {loading ? 'Creating...' : 'Create Budget Code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
