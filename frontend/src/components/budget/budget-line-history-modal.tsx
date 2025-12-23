'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

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

interface BudgetLineHistoryModalProps {
  open: boolean;
  onClose: () => void;
  lineItem: {
    id: string;
    description: string;
    costCode: string;
  };
  projectId: string;
}

export function BudgetLineHistoryModal({
  open,
  onClose,
  lineItem,
  projectId,
}: BudgetLineHistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

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
  }, [open, lineItem.id, projectId]);

  const formatFieldName = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      quantity: 'Quantity',
      unit_cost: 'Unit Cost',
      description: 'Description',
      deleted: 'Status',
    };
    return fieldMap[fieldName] || fieldName;
  };

  const formatValue = (fieldName: string, value: string | null) => {
    if (value === null || value === '') return 'Empty';

    if (fieldName === 'unit_cost') {
      const num = parseFloat(value);
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (fieldName === 'quantity') {
      const num = parseFloat(value);
      return num.toLocaleString('en-US');
    }

    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change History</DialogTitle>
          <div className="text-sm text-gray-600 mt-1">
            <div>{lineItem.costCode}</div>
            <div>{lineItem.description}</div>
          </div>
        </DialogHeader>

        <div className="mt-4">
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      {entry.change_type === 'delete' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {entry.change_type === 'update' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.changed_by.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(entry.changed_at), { addSuffix: true })}
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
                          <span className="text-gray-700">
                            Deleted this line item
                          </span>
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
      </DialogContent>
    </Dialog>
  );
}
