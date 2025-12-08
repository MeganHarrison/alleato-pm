"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, MoreHorizontal, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ColumnConfig,
  TablePageConfig,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatArray,
} from "@/lib/table-config"

interface GenericDataTableProps<T extends Record<string, unknown>> {
  config: TablePageConfig<T>
  data: T[]
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

function buildColumns<T extends Record<string, unknown>>(
  config: TablePageConfig<T>,
  onView?: (row: T) => void,
  onEdit?: (row: T) => void,
  onDelete?: (row: T) => void
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = []

  // Add selection column
  columns.push({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  })

  // Build columns from config
  for (const col of config.columns) {
    const column: ColumnDef<T> = {
      accessorKey: col.key,
      header: col.sortable
        ? ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {col.header}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        : col.header,
      meta: {
        sticky: col.sticky,
      },
      cell: col.cell || (({ row }) => {
        const value = row.getValue(col.key)
        const id = (row.original as Record<string, unknown>).id

        // Helper to wrap content in link if linkToRow is enabled
        const wrapInLink = (content: React.ReactNode) => {
          if (col.linkToRow && config.viewRoute && id) {
            const href = config.viewRoute.replace(":id", String(id))
            return (
              <Link href={href} className="text-blue-600 hover:underline font-medium">
                {content}
              </Link>
            )
          }
          return content
        }

        switch (col.format) {
          case "currency":
            return (
              <div className="text-right font-mono">
                {formatCurrency(value as number)}
              </div>
            )
          case "date":
            return wrapInLink(formatDate(value as string))
          case "number":
            return (
              <div className="text-right font-mono">
                {formatNumber(value as number)}
              </div>
            )
          case "percent":
            return (
              <div className="text-right font-mono">
                {formatPercent(value as number)}
              </div>
            )
          case "link":
            if (!value) return "-"
            return (
              <a
                href={value as string}
                target={col.linkExternal ? "_blank" : undefined}
                rel={col.linkExternal ? "noopener noreferrer" : undefined}
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Link
                {col.linkExternal && <ExternalLink className="h-3 w-3" />}
              </a>
            )
          case "badge":
            if (!value) return "-"
            const colorClass = col.badgeColors?.[value as string] || "bg-gray-100 text-gray-800"
            return (
              <Badge variant="outline" className={colorClass}>
                {value as string}
              </Badge>
            )
          case "array":
            return formatArray(value as string[])
          default:
            return wrapInLink(value != null ? String(value) : "-")
        }
      }),
    }

    if (col.hidden) {
      column.enableHiding = true
    }

    columns.push(column)
  }

  // Add actions column if any actions are configured
  if (config.actions && config.actions.length > 0) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {config.actions?.includes("view") && onView && (
                <DropdownMenuItem onClick={() => onView(item)}>
                  View details
                </DropdownMenuItem>
              )}
              {config.actions?.includes("edit") && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  Edit
                </DropdownMenuItem>
              )}
              {(config.actions?.includes("view") || config.actions?.includes("edit")) &&
                config.actions?.includes("delete") && <DropdownMenuSeparator />}
              {config.actions?.includes("delete") && onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}

export function GenericDataTable<T extends Record<string, unknown>>({
  config,
  data,
  onView,
  onEdit,
  onDelete,
}: GenericDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    config.defaultSort
      ? [{ id: config.defaultSort, desc: config.defaultSortDirection === "desc" }]
      : []
  )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    const visibility: VisibilityState = {}
    for (const col of config.columns) {
      if (col.hidden) {
        visibility[col.key] = false
      }
    }
    return visibility
  })
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns = React.useMemo(
    () => buildColumns(config, onView, onEdit, onDelete),
    [config, onView, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: config.defaultPageSize || 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const searchableColumns = config.searchableColumns || []
  const pageSizeOptions = config.pageSizeOptions || [10, 20, 30, 50]

  return (
    <div className="w-full space-y-4 min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        {/* Global search */}
        <Input
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* Column-specific filters */}
        {searchableColumns.map((colKey) => {
          const colConfig = config.columns.find((c) => c.key === colKey)
          if (!colConfig) return null
          return (
            <Input
              key={colKey}
              placeholder={`Filter by ${colConfig.header.toLowerCase()}...`}
              value={(table.getColumn(colKey)?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn(colKey)?.setFilterValue(e.target.value)}
              className="max-w-[200px]"
            />
          )
        })}

        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const colConfig = config.columns.find((c) => c.key === column.id)
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {colConfig?.header || column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isSticky = (header.column.columnDef.meta as { sticky?: boolean })?.sticky
                  // First column (checkbox) stays at left-0, sticky columns at left-10 (after checkbox)
                  const stickyClass = index === 0
                    ? "sticky left-0 z-20 bg-muted"
                    : isSticky
                      ? "sticky left-10 z-10 bg-muted shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                      : ""
                  return (
                    <TableHead
                      key={header.id}
                      className={stickyClass}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell, index) => {
                    const isSticky = (cell.column.columnDef.meta as { sticky?: boolean })?.sticky
                    // First column (checkbox) stays at left-0, sticky columns at left-10 (after checkbox)
                    const stickyClass = index === 0
                      ? "sticky left-0 z-20 bg-background"
                      : isSticky
                        ? "sticky left-10 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                        : ""
                    return (
                      <TableCell
                        key={cell.id}
                        className={stickyClass}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
