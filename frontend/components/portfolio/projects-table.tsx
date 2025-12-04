'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Flag, ArrowUpDown } from 'lucide-react';
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
import Link from 'next/link';

interface ProjectsTableProps {
  data: Project[];
  onProjectClick?: (project: Project) => void;
}

export function ProjectsTable({ data, onProjectClick }: ProjectsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Project>[] = [
    {
      id: 'flag',
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
        <Link
          href={`/projects/${row.original.id}/home`}
          className="font-medium text-[hsl(var(--procore-orange))] hover:underline"
        >
          {row.getValue('name')}
        </Link>
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
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-gray-50 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-200">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-semibold text-gray-600 py-3 px-4 bg-gray-50"
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
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onProjectClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-3 px-4 text-sm"
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
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
