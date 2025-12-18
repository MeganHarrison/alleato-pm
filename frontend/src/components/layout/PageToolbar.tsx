"use client"

import * as React from "react"
import { IconSearch, IconFilter, IconColumns, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface PageToolbarProps {
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  filters?: React.ReactNode
  viewSwitcher?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  showColumnToggle?: boolean
  columns?: Array<{
    id: string
    label: string
    isVisible: boolean
  }>
  onColumnToggle?: (columnId: string) => void
  onExport?: () => void
}

export function PageToolbar({
  searchPlaceholder = "Search...",
  onSearch,
  filters,
  viewSwitcher,
  actions,
  className,
  showColumnToggle = false,
  columns = [],
  onColumnToggle,
  onExport,
}: PageToolbarProps) {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <div
      data-testid="page-toolbar"
      className={cn(
      "flex flex-col gap-4 bg-gray-50 px-4 py-4 sm:px-6 lg:px-8",
      "sm:flex-row sm:items-center sm:justify-between",
      className
    )}>
      <div className="flex flex-1 items-center gap-4">
        {/* Search */}
        {onSearch && (
          <div className="relative max-w-sm flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        )}

        {/* Filters */}
        {filters && (
          <div className="flex items-center gap-2">
            {filters}
          </div>
        )}

        {/* View Switcher */}
        {viewSwitcher && (
          <div className="flex items-center gap-2">
            {viewSwitcher}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Column Toggle */}
        {showColumnToggle && columns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <IconColumns className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.isVisible}
                  onCheckedChange={() => onColumnToggle?.(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Export */}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <IconDownload className="h-4 w-4" />
            Export
          </Button>
        )}

        {/* Custom Actions */}
        {actions}
      </div>
    </div>
  )
}
