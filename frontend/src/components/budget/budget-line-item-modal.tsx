'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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

interface BudgetCode {
  id: string;
  code: string;
  costType: string;
  description: string;
  fullLabel: string;
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

interface BudgetLineItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess?: () => void;
}

export function BudgetLineItemModal({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: BudgetLineItemModalProps) {
  const [loading, setLoading] = useState(false);
  const [budgetCodes, setBudgetCodes] = useState<BudgetCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);

  // Cost codes from Supabase
  const [availableCostCodes, setAvailableCostCodes] = useState<
    Array<{
      id: string;
      description: string | null;
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
        description: string | null;
        status: string | null;
        division_title: string | null;
      }>
    >
  >({});

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
    costCodeId: '',
    costType: 'R',
  });
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());

  // Budget Code selector state
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setRows([
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
      setSearchQuery('');
      setOpenPopoverId(null);
    }
  }, [open]);

  // Fetch cost codes from Supabase when create code modal opens
  useEffect(() => {
    const fetchCostCodes = async () => {
      if (!showCreateCodeModal) return;

      try {
        setLoadingCostCodes(true);
        const supabase = createClient();

        // Fetch cost codes from Supabase
        const { data, error } = await supabase
          .from('cost_codes')
          .select('id, description, status, division_title')
          .eq('status', 'True')
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

  // Fetch budget codes for the project
  useEffect(() => {
    const fetchBudgetCodes = async () => {
      if (!projectId || !open) return;

      try {
        setLoadingCodes(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/projects/${projectId}/budget-codes`);
        // const data = await response.json();

        // Mock data for now
        const mockCodes: BudgetCode[] = [
          {
            id: '1',
            code: '01-3120',
            costType: 'L',
            description: 'Vice President',
            fullLabel: '01-3120.L – Vice President – Labor',
          },
          {
            id: '2',
            code: '01-3130',
            costType: 'L',
            description: 'Project Manager',
            fullLabel: '01-3130.L – Project Manager – Labor',
          },
          {
            id: '3',
            code: '01-3140',
            costType: 'M',
            description: 'Concrete Materials',
            fullLabel: '01-3140.M – Concrete Materials – Material',
          },
          {
            id: '4',
            code: '01-3150',
            costType: 'E',
            description: 'Equipment Rental',
            fullLabel: '01-3150.E – Equipment Rental – Equipment',
          },
        ];
        setBudgetCodes(mockCodes);
      } catch (error) {
        console.error('Error fetching budget codes:', error);
      } finally {
        setLoadingCodes(false);
      }
    };

    fetchBudgetCodes();
  }, [projectId, open]);

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
      setLoading(true);

      const selectedCostCode = availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId);
      if (!selectedCostCode) {
        alert('Please select a cost code');
        return;
      }

      // TODO: API call to create project budget code
      const newCode: BudgetCode = {
        id: Date.now().toString(),
        code: selectedCostCode.division_title || selectedCostCode.id,
        costType: newCodeData.costType,
        description: selectedCostCode.description || '',
        fullLabel: `${selectedCostCode.division_title || selectedCostCode.id}.${newCodeData.costType} – ${selectedCostCode.description} – ${getCostTypeLabel(newCodeData.costType)}`,
      };

      setBudgetCodes([...budgetCodes, newCode]);
      setShowCreateCodeModal(false);
      setNewCodeData({ costCodeId: '', costType: 'R' });
    } catch (error) {
      console.error('Error creating budget code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetCodeSelect = (rowId: string, code: BudgetCode) => {
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, budgetCodeId: code.id, budgetCodeLabel: code.fullLabel } : row
      )
    );
    setOpenPopoverId(null);
  };

  const calculateAmount = (qty: string, unitCost: string): string => {
    const qtyNum = parseFloat(qty) || 0;
    const costNum = parseFloat(unitCost) || 0;
    return (qtyNum * costNum).toFixed(2);
  };

  const handleRowChange = (rowId: string, field: keyof BudgetLineItemRow, value: string) => {
    setRows(
      rows.map((row) => {
        if (row.id !== rowId) return row;

        const updatedRow = { ...row, [field]: value };

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
    if (rows.length === 1) return;
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invalidRows = rows.filter((row) => !row.budgetCodeId || parseFloat(row.amount) === 0);

      if (invalidRows.length > 0) {
        alert('All rows must have a budget code and a non-zero amount.');
        return;
      }

      // Get the budget code details for each row
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

      // Call API to create budget line items
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

      const result = await response.json();
      console.log('Budget line items created:', result);

      // Close modal and notify parent to refresh data
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating budget line items:', error);
      alert(`Failed to create budget line items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredCodes = budgetCodes.filter((code) =>
    code.fullLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[85vw] max-w-[85vw] sm:max-w-[85vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Budget Line Items</SheetTitle>
            <SheetDescription>Add one or more line items to the project budget</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-12">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 min-w-[300px]">
                          Budget Code*
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-24">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 w-28">UOM</th>
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

                <div className="px-4 py-3 border-t bg-gray-50">
                  <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Row
                  </Button>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-shrink-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : `Create ${rows.length} Line Item${rows.length > 1 ? 's' : ''}`}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

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
                                {costCode.division_title || costCode.id} - {costCode.description}
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
                    {availableCostCodes.find((cc) => cc.id === newCodeData.costCodeId)?.description} – {' '}
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
              disabled={loading || !newCodeData.costCodeId || !newCodeData.costType}
            >
              {loading ? 'Creating...' : 'Create Budget Code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
