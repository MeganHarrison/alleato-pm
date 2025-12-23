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
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil } from 'lucide-react';
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
import { EditableCell } from './editable-cell';
import { EditProjectDialog } from './edit-project-dialog';
import { toast } from 'sonner';

interface ProjectsTableProps {
  data: Project[];
  onProjectClick?: (project: Project) => void;
  viewType?: 'list' | 'grid';
}

export function ProjectsTable({ data, onProjectClick, viewType = 'list' }: ProjectsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: viewType === 'grid' ? 24 : 50,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  // Update page size when view type changes
  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: viewType === 'grid' ? 24 : 50,
    }));
  }, [viewType]);

  // Function to update project field
  // Maps camelCase field names to database column names (with spaces)
  const updateProject = async (projectId: string, field: string, value: string) => {
    try {
      // Map camelCase to database field names
      const fieldMap: Record<string, string> = {
        'jobNumber': 'job number',
        'client': 'client',
        'startDate': 'start date',
        'state': 'state',
        'phase': 'phase',
        'estRevenue': 'est revenue',
        'estProfit': 'est profit',
        'category': 'category',
      };

      const dbField = fieldMap[field] || field;
      let dbValue: string | number | null = value;

      // Convert numeric fields
      if (field === 'estRevenue' || field === 'estProfit') {
        dbValue = value ? parseFloat(value) : null;
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [dbField]: dbValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      toast.success(`Updated ${field}`);

      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(`Failed to update ${field}`);
      throw error;
    }
  };

  // Column order: name, job number, client, start date, state, phase, est revenue, est profit, category
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'name',
      meta: { sticky: true, left: 0 },
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
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue('jobNumber')}
          onSave={(value) => updateProject(row.original.id, 'jobNumber', value)}
        />
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
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue('client')}
          onSave={(value) => updateProject(row.original.id, 'client', value)}
        />
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
        const displayDate = date ? new Date(date).toISOString().split('T')[0] : '';
        return (
          <EditableCell
            value={displayDate}
            type="date"
            onSave={(value) => updateProject(row.original.id, 'startDate', value)}
          />
        );
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
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue('state')}
          onSave={(value) => updateProject(row.original.id, 'state', value)}
        />
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
        return (
          <EditableCell
            value={revenue?.toString() || ''}
            type="number"
            onSave={(value) => updateProject(row.original.id, 'estRevenue', value)}
          />
        );
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
        return (
          <EditableCell
            value={profit?.toString() || ''}
            type="number"
            onSave={(value) => updateProject(row.original.id, 'estProfit', value)}
          />
        );
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
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue('category')}
          onSave={(value) => updateProject(row.original.id, 'category', value)}
        />
      ),
      size: 150,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditingProject(row.original);
            setIsEditDialogOpen(true);
          }}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Edit project"
        >
          <Pencil className="w-4 h-4 text-gray-600" />
        </button>
      ),
      size: 60,
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

  // Grid view rendering
  if (viewType === 'grid') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const project = row.original;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => onProjectClick?.(project)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[hsl(var(--procore-orange))] transition-all text-left group"
                  >
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[hsl(var(--procore-orange))] transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Job #:</span>
                        <span className="font-medium text-gray-700">{project.jobNumber}</span>
                      </div>

                      {project.client && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Client:</span>
                          <span className="text-gray-700 truncate ml-2">{project.client}</span>
                        </div>
                      )}

                      {project.state && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">State:</span>
                          <span className="text-gray-700">{project.state}</span>
                        </div>
                      )}

                      {project.phase && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Phase:</span>
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded',
                            {
                              'current': 'bg-blue-100 text-blue-700',
                              'bid': 'bg-purple-100 text-purple-700',
                              'preconstruction': 'bg-yellow-100 text-yellow-700',
                              'complete': 'bg-green-100 text-green-700',
                            }[project.phase.toLowerCase()] || 'bg-gray-100 text-gray-600'
                          )}>
                            {project.phase}
                          </span>
                        </div>
                      )}

                      {project.category && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Category:</span>
                          <span className="text-gray-700 truncate ml-2">{project.category}</span>
                        </div>
                      )}

                      {(project.estRevenue || project.estProfit) && (
                        <div className="pt-2 mt-2 border-t border-gray-100">
                          {project.estRevenue && (
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500 text-xs">Revenue:</span>
                              <span className="font-medium text-gray-700 text-xs">
                                ${project.estRevenue.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {project.estProfit && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 text-xs">Profit:</span>
                              <span className="font-medium text-gray-700 text-xs">
                                ${project.estProfit.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No projects found.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls for Grid View */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
            <span className="hidden sm:inline">Showing</span>
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              aria-label="Items per page"
              className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--procore-orange))] focus:border-transparent"
            >
              {[12, 24, 48, 96].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span className="text-xs sm:text-sm">
              <span className="hidden sm:inline">of </span>
              <span className="sm:hidden">/ </span>
              {data.length}<span className="hidden sm:inline"> total cards</span>
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Go to first page"
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              aria-label="Go to previous page"
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="text-xs sm:text-sm text-gray-700 px-2">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <button
              type="button"
              aria-label="Go to next page"
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              aria-label="Go to last page"
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List/Table view rendering (default)
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
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
        <span className="hidden sm:inline">Showing</span>
        <select
          value={pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--procore-orange))] focus:border-transparent"
        >
          {[10, 25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span className="text-xs sm:text-sm">
          <span className="hidden sm:inline">of </span>
          <span className="sm:hidden">/ </span>
          {data.length}<span className="hidden sm:inline"> total rows</span>
        </span>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <span className="text-xs sm:text-sm text-gray-700 px-2">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>

    {/* Edit Project Dialog */}
    {editingProject && (
      <EditProjectDialog
        project={editingProject}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          // Reload the page to show updated data
          window.location.reload();
        }}
      />
    )}
    </div>
  );
}
