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
    pageSize: 50, // Default 50 rows per page
  });

  const columns: ColumnDef<Project>[] = [
    {
      id: 'flag',
      meta: { sticky: true, left: 0 },
      header: () => <span className="sr-only">Flag</span>,
      cell: ({ row }) => (
        <button
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
          onClick={() => onProjectClick?.(row.original)}
          className="font-medium text-[hsl(var(--procore-orange))] hover:underline text-left"
        >
          {row.getValue('name')}
        </button>
      ),
      size: 280,
    },
    {
      accessorKey: 'projectNumber',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project Number
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 130,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      size: 180,
    },
    {
      accessorKey: 'city',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          City
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 120,
    },
    {
      accessorKey: 'state',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          State
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 80,
    },
    {
      accessorKey: 'zip',
      header: 'ZIP',
      size: 80,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 130,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded',
              status === 'Active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {status}
          </span>
        );
      },
      size: 90,
    },
    {
      accessorKey: 'stage',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stage
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      cell: ({ row }) => {
        const stage = row.getValue('stage') as string;
        const stageColors: Record<string, string> = {
          'Bid': 'bg-purple-100 text-purple-700',
          'Preconstruction': 'bg-blue-100 text-blue-700',
          'In Progress': 'bg-yellow-100 text-yellow-700',
          'Warranty': 'bg-orange-100 text-orange-700',
          'Complete': 'bg-green-100 text-green-700',
        };
        return (
          <span className={cn('px-2 py-1 text-xs font-medium rounded', stageColors[stage] || 'bg-gray-100 text-gray-600')}>
            {stage}
          </span>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      ),
      size: 100,
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => {
        const notes = row.getValue('notes') as string;
        return notes ? (
          <span className="text-gray-600 truncate max-w-[200px] block">{notes}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      size: 150,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
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
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
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
