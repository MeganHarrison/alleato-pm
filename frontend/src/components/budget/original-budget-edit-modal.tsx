'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface HistoryEntry {
  id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: {
    id: string;
    email: string;
    name: string;
  };
  changed_at: string;
  change_type: 'create' | 'update' | 'delete';
  notes: string | null;
}

interface OriginalBudgetEditModalProps {
  open: boolean;
  onClose: () => void;
  lineItem: {
    id: string;
    description: string;
    costCode: string;
    originalBudgetAmount: number;
    unitQty?: number;
    uom?: string;
    unitCost?: number;
  };
  projectId: string;
  onSave?: (data: {
    unitQty: number;
    uom: string;
    unitCost: number;
    originalBudget: number;
  }) => void;
}

const UOM_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'ea', label: 'Each' },
  { value: 'lf', label: 'Linear Feet' },
  { value: 'sf', label: 'Square Feet' },
  { value: 'cy', label: 'Cubic Yards' },
  { value: 'ls', label: 'Lump Sum' },
  { value: 'hr', label: 'Hours' },
  { value: 'day', label: 'Days' },
  { value: 'ton', label: 'Tons' },
  { value: 'gal', label: 'Gallons' },
];

type CalculationMethod = 'manual' | 'calculated' | 'override';

export function OriginalBudgetEditModal({
  open,
  onClose,
  lineItem,
  projectId,
  onSave,
}: OriginalBudgetEditModalProps) {
  const [activeTab, setActiveTab] = useState<'original' | 'history'>('original');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('manual');
  const [unitQty, setUnitQty] = useState(lineItem.unitQty?.toString() || '1');
  const [uom, setUom] = useState(lineItem.uom || '');
  const [unitCost, setUnitCost] = useState(
    lineItem.unitCost?.toString() || lineItem.originalBudgetAmount.toString()
  );
  const [originalBudget, setOriginalBudget] = useState(
    lineItem.originalBudgetAmount.toString()
  );

  // Calculate original budget when inputs change
  useEffect(() => {
    if (calculationMethod === 'calculated') {
      const qty = parseFloat(unitQty) || 0;
      const cost = parseFloat(unitCost) || 0;
      setOriginalBudget((qty * cost).toFixed(2));
    }
  }, [unitQty, unitCost, calculationMethod]);

  // Reset form when modal opens with new line item
  useEffect(() => {
    if (open) {
      setCalculationMethod('manual');
      setUnitQty(lineItem.unitQty?.toString() || '1');
      setUom(lineItem.uom || '');
      setUnitCost(
        lineItem.unitCost?.toString() || lineItem.originalBudgetAmount.toString()
      );
      setOriginalBudget(lineItem.originalBudgetAmount.toString());
    }
  }, [open, lineItem]);

  // Fetch history when history tab is active
  useEffect(() => {
    if (!open || activeTab !== 'history') return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/projects/${projectId}/budget/lines/${lineItem.id}/history`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch change history');
        }

        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open, activeTab, lineItem.id, projectId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        unitQty: parseFloat(unitQty) || 1,
        uom,
        unitCost: parseFloat(unitCost) || 0,
        originalBudget: parseFloat(originalBudget) || 0,
      };

      if (onSave) {
        onSave(data);
      }

      onClose();
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatFieldName = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      quantity: 'Unit Qty',
      unit_qty: 'Unit Qty',
      unit_cost: 'Unit Cost',
      original_budget_amount: 'Original Budget',
      originalBudgetAmount: 'Original Budget',
      description: 'Description',
      uom: 'UOM',
      deleted: 'Status',
    };
    return fieldMap[fieldName] || fieldName;
  };

  const formatValue = (fieldName: string, value: string | null) => {
    if (value === null || value === '') return 'Empty';

    if (
      fieldName === 'unit_cost' ||
      fieldName === 'original_budget_amount' ||
      fieldName === 'originalBudgetAmount'
    ) {
      const num = parseFloat(value);
      return `$${num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    if (fieldName === 'quantity' || fieldName === 'unit_qty') {
      const num = parseFloat(value);
      return num.toLocaleString('en-US');
    }

    return value;
  };

  const formatCurrencyInput = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-lg font-semibold">
            Original Budget Amount for {lineItem.costCode}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            onClick={() => setActiveTab('original')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'original'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            Original Budget
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'history'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === 'original' ? (
            <div className="space-y-4">
              {/* Edit Form Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        Calculation Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        Unit Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        UOM
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        Unit Cost
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                        Original Budget
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="calcMethod"
                              value="manual"
                              checked={calculationMethod === 'manual'}
                              onChange={() => setCalculationMethod('manual')}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="sr-only">Manual</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="calcMethod"
                              value="calculated"
                              checked={calculationMethod === 'calculated'}
                              onChange={() => setCalculationMethod('calculated')}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="sr-only">Calculated</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="calcMethod"
                              value="override"
                              checked={calculationMethod === 'override'}
                              onChange={() => setCalculationMethod('override')}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="sr-only">Override</span>
                          </label>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={unitQty}
                          onChange={(e) => setUnitQty(e.target.value)}
                          className="w-20 text-center"
                          disabled={calculationMethod === 'manual'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={uom}
                          onValueChange={setUom}
                          disabled={calculationMethod === 'manual'}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {UOM_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value || 'none'}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={formatCurrencyInput(unitCost)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            setUnitCost(value);
                          }}
                          className="w-32"
                          disabled={calculationMethod === 'manual'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={formatCurrencyInput(originalBudget)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            setOriginalBudget(value);
                          }}
                          className="w-32 bg-gray-50"
                          disabled={calculationMethod === 'calculated'}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-gray-500">Loading history...</div>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {!loading && !error && history.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No changes recorded yet</p>
                </div>
              )}

              {!loading && !error && history.length > 0 && (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`border-l-2 ${
                        entry.change_type === 'create'
                          ? 'border-green-400'
                          : entry.change_type === 'delete'
                            ? 'border-red-400'
                            : 'border-blue-400'
                      } pl-4 pb-4 ${index < history.length - 1 ? 'mb-4' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.change_type === 'create'
                              ? 'bg-green-100 text-green-600'
                              : entry.change_type === 'delete'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {entry.change_type === 'create' && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          )}
                          {entry.change_type === 'delete' && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          {entry.change_type === 'update' && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.changed_by.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(entry.changed_at), {
                              addSuffix: true,
                            })}
                          </div>
                          <div className="mt-2 text-sm">
                            {entry.change_type === 'create' && (
                              <span className="text-gray-700">
                                Created {formatFieldName(entry.field_name)}:{' '}
                                <span className="font-medium text-green-700">
                                  {formatValue(entry.field_name, entry.new_value)}
                                </span>
                              </span>
                            )}
                            {entry.change_type === 'delete' && (
                              <span className="text-gray-700">Deleted this line item</span>
                            )}
                            {entry.change_type === 'update' && (
                              <span className="text-gray-700">
                                Changed {formatFieldName(entry.field_name)} from{' '}
                                <span className="line-through text-red-600">
                                  {formatValue(entry.field_name, entry.old_value)}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium text-green-700">
                                  {formatValue(entry.field_name, entry.new_value)}
                                </span>
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <div className="mt-1 text-sm text-gray-600 italic">
                              Note: {entry.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={activeTab === 'original' ? handleSave : onClose}
            disabled={saving}
            className="bg-gray-700 hover:bg-gray-800 text-white"
          >
            {activeTab === 'original' ? (saving ? 'Saving...' : 'Done') : 'Done'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
