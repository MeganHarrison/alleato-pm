'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  ExpandedState,
} from '@tanstack/react-table';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BudgetLineItem, BudgetGrandTotals } from '@/types/budget';
import { cn } from '@/lib/utils';

interface BudgetTableProps {
  data: BudgetLineItem[];
  grandTotals: BudgetGrandTotals;
}

function formatCurrency(value: number): string {
  if (value === 0) return '$0.00';

  const isNegative = value < 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  if (isNegative) {
    return `($${formatted})`;
  }
  return `$${formatted}`;
}

function CurrencyCell({ value }: { value: number }) {
  const isNegative = value < 0;
  return (
    <span className={cn('tabular-nums', isNegative && 'text-red-600')}>
      {formatCurrency(value)}
    </span>
  );
}

export function BudgetTable({ data, grandTotals }: BudgetTableProps) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const columns: ColumnDef<BudgetLineItem>[] = [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        const canExpand = row.original.children && row.original.children.length > 0;
        if (!canExpand) {
          return <div className="w-6" />;
        }
        return (
          <button
            onClick={() => row.toggleExpanded()}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        );
      },
      size: 40,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div
          className={cn(
            "font-medium text-gray-900",
            row.depth > 0 && "text-gray-700"
          )}
          style={{ paddingLeft: `${row.depth * 20}px` }}
        >
          {row.getValue('description')}
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: 'originalBudgetAmount',
      header: () => (
        <div className="text-right">
          Original Budget
          <br />
          Amount
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('originalBudgetAmount')} />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'budgetModifications',
      header: () => (
        <div className="text-right">
          Budget
          <br />
          Modifications
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('budgetModifications')} />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'approvedCOs',
      header: () => (
        <div className="text-right">
          Approved COs
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('approvedCOs')} />
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'revisedBudget',
      header: () => (
        <div className="text-right">
          Revised Budget
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('revisedBudget')} />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'jobToDateCostDetail',
      header: () => (
        <div className="text-right">
          Job to Date Cost
          <br />
          Detail
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('jobToDateCostDetail')} />
        </div>
      ),
      size: 140,
    },
    {
      accessorKey: 'directCosts',
      header: () => (
        <div className="text-right">
          Direct Costs
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('directCosts')} />
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'pendingChanges',
      header: () => (
        <div className="text-right">
          Pending
          <br />
          Changes
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('pendingChanges')} />
        </div>
      ),
      size: 110,
    },
    {
      accessorKey: 'projectedBudget',
      header: () => (
        <div className="text-right">
          Projected Budget
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('projectedBudget')} />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'committedCosts',
      header: () => (
        <div className="text-right">
          Committed Costs
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('committedCosts')} />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'pendingCostChanges',
      header: () => (
        <div className="text-right">
          Pending Cost
          <br />
          Changes
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('pendingCostChanges')} />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'projectedCosts',
      header: () => (
        <div className="text-right">
          Projected Costs
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <CurrencyCell value={row.getValue('projectedCosts')} />
        </div>
      ),
      size: 130,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.children,
  });

  return (
    <div className="flex flex-col h-full rounded-md overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-100/80 backdrop-blur-sm z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-gray-600 py-3 px-4 bg-gray-100/80"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "border-b border-gray-100 hover:bg-gray-50/50 transition-colors",
                    row.depth > 0 && "bg-gray-50/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3 px-4 text-sm",
                        row.depth > 0 && "text-gray-600"
                      )}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Grand Totals Row - Fixed at bottom */}
      <div className="border-t-2 border-gray-300 bg-gray-50 sticky bottom-0">
        <Table>
          <TableBody>
            <TableRow className="font-semibold bg-gray-50">
              <TableCell className="py-3 px-4" style={{ width: 40 }} />
              <TableCell className="py-3 px-4 text-sm font-bold text-gray-900" style={{ width: 200 }}>
                Grand Totals
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.originalBudgetAmount} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.budgetModifications} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 120 }}>
                <CurrencyCell value={grandTotals.approvedCOs} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.revisedBudget} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 140 }}>
                <CurrencyCell value={grandTotals.jobToDateCostDetail} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 120 }}>
                <CurrencyCell value={grandTotals.directCosts} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 110 }}>
                <CurrencyCell value={grandTotals.pendingChanges} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.projectedBudget} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.committedCosts} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.pendingCostChanges} />
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-right" style={{ width: 130 }}>
                <CurrencyCell value={grandTotals.projectedCosts} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
