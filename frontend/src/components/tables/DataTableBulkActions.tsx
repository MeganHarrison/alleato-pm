"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Trash2, Download, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
  onDelete?: (rows: TData[]) => void
  onArchive?: (rows: TData[]) => void
  onExport?: (rows: TData[]) => void
  customActions?: Array<{
    label: string
    icon?: React.ElementType
    onClick: (rows: TData[]) => void
  }>
}

export function DataTableBulkActions<TData>({
  table,
  onDelete,
  onArchive,
  onExport,
  customActions = [],
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedRows.length} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {onExport && (
            <DropdownMenuItem onClick={() => onExport(selectedRows)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
          )}
          {onArchive && (
            <DropdownMenuItem onClick={() => onArchive(selectedRows)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          {customActions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(selectedRows)}
            >
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          ))}
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(selectedRows)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}