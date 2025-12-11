'use client';

import * as React from 'react';
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  PaginationState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Flag, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Project } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface ProjectsTableProps {
  data: Project[];
  onProjectClick?: (project: Project) => void;
}

export function ProjectsTable({ data, onProjectClick }: ProjectsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    // Default filter: phase = "current" (case insensitive)
    { id: 'phase', value: 'current' }
  ]);

  // Column order: name, job number, client, start date, state, phase, est revenue, est profit, category
  const columns: ColumnDef<Project>[] = [
    {
      id: 'flag',
      meta: { sticky: true, left: 0 },
      header: () => <span className="sr-only">Flag</span>,
      cell: ({ row }) => (
        <button
          type="button"
          className={cn(
            'p-1 rounded transition-colors',
            row.original.isFlagged
              ? 'text-[hsl(var(--procore-orange))]'
              : 'text-gray-300 hover:text-gray-400'
          )}
        >
          <Flag className="w-4 h-4" fill={row.original.isFlagged ? 'currentColor' : 'none'} />
        </button>
      ),
      size: 40,
    },
    {
      accessorKey: 'name',
      meta: { sticky: true, left: 48 },
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onProjectClick?.(row.original);
          }}
          className="font-medium text-[hsl(var(--procore-orange))] hover:underline text-left"
        >
          {row.getValue('name')}
        </button>
      ),
      size: 250,
    },
    {
      accessorKey: 'jobNumber',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Job Number
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 130,
    },
    {
      accessorKey: 'client',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Client
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 180,
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Date
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('startDate') as string | null;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
      size: 120,
    },
    {
      accessorKey: 'state',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          State
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 100,
    },
    {
      accessorKey: 'phase',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Phase
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      // Case-insensitive filter
      filterFn: (row, id, value) => {
        const cellValue = row.getValue(id) as string;
        return cellValue?.toLowerCase().includes(value.toLowerCase());
      },
      cell: ({ row }) => {
        const phase = row.getValue('phase') as string;
        const phaseColors: Record<string, string> = {
          'current': 'bg-blue-100 text-blue-700',
          'bid': 'bg-purple-100 text-purple-700',
          'preconstruction': 'bg-yellow-100 text-yellow-700',
          'complete': 'bg-green-100 text-green-700',
        };
        return phase ? (
          <span className={cn('px-2 py-1 text-xs font-medium rounded', phaseColors[phase.toLowerCase()] || 'bg-gray-100 text-gray-600')}>
            {phase}
          </span>
        ) : '-';
      },
      size: 120,
    },
    {
      accessorKey: 'estRevenue',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Est Revenue
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const revenue = row.getValue('estRevenue') as number | null;
        return revenue != null ? `$${revenue.toLocaleString()}` : '-';
      },
      size: 130,
    },
    {
      accessorKey: 'estProfit',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Est Profit
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const profit = row.getValue('estProfit') as number | null;
        return profit != null ? `$${profit.toLocaleString()}` : '-';
      },
      size: 130,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 150,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const getStickyStyles = (column: Column<Project, unknown>, fallbackBg: string) => {
    const meta = (column.columnDef.meta as { sticky?: boolean; left?: number }) || {};
    if (!meta.sticky) {
      return {};
    }
    return {
      position: 'sticky',
      left: meta.left ?? 0,
      zIndex: 5,
      backgroundColor: fallbackBg,
    } as React.CSSProperties;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <Table>
        <TableHeader className="sticky top-0 bg-gray-50 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-200">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-semibold text-gray-600 py-3 px-4 bg-gray-50"
                  style={{
                    width: header.getSize(),
                    ...getStickyStyles(header.column, 'rgb(249 250 251)'),
                  }}
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
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onProjectClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-3 px-4 text-sm"
                    style={{
                      width: cell.column.getSize(),
                      ...getStickyStyles(cell.column, '#fff'),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    
    {/* Pagination Controls */}
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>Showing</span>
        <select
          value={pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--procore-orange))] focus:border-transparent"
        >
          {[10, 25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span>
          of {data.length} total rows
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    </div>
  );
}
