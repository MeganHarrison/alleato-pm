'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Search,
  Download,
  Columns3,
  ChevronDown,
  Pencil,
  Plus,
} from 'lucide-react'

// Serializable badge render configuration
export interface BadgeRenderConfig {
  type: 'badge'
  variantMap?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>
  defaultVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

// Serializable currency render configuration
export interface CurrencyRenderConfig {
  type: 'currency'
  prefix?: string
  showDecimals?: boolean
}

// Serializable truncate render configuration
export interface TruncateRenderConfig {
  type: 'truncate'
  maxLength: number
}

// Serializable array render configuration
export interface ArrayRenderConfig {
  type: 'array'
  itemType?: 'badge' | 'text'
  separator?: string
}

// Serializable JSON render configuration
export interface JsonRenderConfig {
  type: 'json'
  maxLength: number
}

// Serializable nested object render configuration
export interface NestedRenderConfig {
  type: 'nested'
  path: string // e.g., "document_metadata.title"
  fallback?: string
}

export type RenderConfig =
  | BadgeRenderConfig
  | CurrencyRenderConfig
  | TruncateRenderConfig
  | ArrayRenderConfig
  | JsonRenderConfig
  | NestedRenderConfig

export interface ColumnConfig {
  id: string
  label: string
  defaultVisible: boolean
  type?: 'text' | 'date' | 'badge' | 'number' | 'email'
  renderConfig?: RenderConfig
}

export interface FilterConfig {
  id: string
  label: string
  field: string
  options: { value: string; label: string }[]
}

export interface EditConfig {
  tableName: string // Supabase table name
  editableFields?: string[] // List of field IDs that can be edited inline
  requiresDialog?: boolean // If true, opens a dialog for all edits
}

export interface GenericTableConfig {
  title: string
  description: string
  columns: ColumnConfig[]
  filters?: FilterConfig[]
  searchFields: string[]
  rowClickPath?: string // Use {id} as placeholder, e.g. "/risks/{id}"
  exportFilename?: string
  editConfig?: EditConfig // Optional: enables editing
}

interface GenericDataTableProps {
  data: Record<string, unknown>[]
  config: GenericTableConfig
}

export function GenericDataTable({ data: initialData, config }: GenericDataTableProps) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(config.columns.filter(col => col.defaultVisible).map(col => col.id))
  )
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Search filter
      const matchesSearch = config.searchFields.some(field => {
        const value = row[field]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })

      if (searchTerm && !matchesSearch) return false

      // Custom filters
      if (config.filters) {
        for (const filter of config.filters) {
          const filterValue = filters[filter.id]
          if (filterValue && filterValue !== 'all') {
            const rowValue = row[filter.field]
            if (rowValue !== filterValue) return false
          }
        }
      }

      return true
    })
  }, [data, searchTerm, filters, config.searchFields, config.filters])

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    try {
      return format(new Date(date), 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const renderWithConfig = (value: unknown, renderConfig: RenderConfig) => {
    switch (renderConfig.type) {
      case 'badge': {
        const strValue = String(value || '')
        const variant = renderConfig.variantMap?.[strValue] || renderConfig.defaultVariant || 'outline'
        return <Badge variant={variant}>{strValue || 'N/A'}</Badge>
      }
      case 'currency': {
        const numValue = Number(value)
        if (!value || Number.isNaN(numValue)) return 'N/A'
        const formatted = renderConfig.showDecimals !== false
          ? numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : numValue.toLocaleString()
        return `${renderConfig.prefix || '$'}${formatted}`
      }
      case 'truncate': {
        const text = String(value || '')
        if (!text) return 'N/A'
        return text.length > renderConfig.maxLength
          ? `${text.substring(0, renderConfig.maxLength)}...`
          : text
      }
      case 'array': {
        if (!value || !Array.isArray(value)) return 'N/A'
        if (renderConfig.itemType === 'badge') {
          return (
            <div className="flex gap-1 flex-wrap">
              {value.map((item, idx) => (
                <Badge key={`${String(item)}-${idx}`} variant="outline" className="text-xs">
                  {String(item)}
                </Badge>
              ))}
            </div>
          )
        }
        return value.join(renderConfig.separator || ', ')
      }
      case 'json': {
        if (!value) return 'N/A'
        try {
          const text = JSON.stringify(value)
          return text.length > renderConfig.maxLength
            ? `${text.substring(0, renderConfig.maxLength)}...`
            : text
        } catch {
          return 'Invalid JSON'
        }
      }
      case 'nested': {
        // Access nested property using path like "document_metadata.title"
        const parts = renderConfig.path.split('.')
        let result: unknown = value

        for (const part of parts) {
          if (result && typeof result === 'object' && part in result) {
            result = (result as Record<string, unknown>)[part]
          } else {
            return renderConfig.fallback || 'N/A'
          }
        }

        return result ? String(result) : renderConfig.fallback || 'N/A'
      }
      default:
        return String(value || 'N/A')
    }
  }

  const renderCellContent = (column: ColumnConfig, row: Record<string, unknown>) => {
    const value = row[column.id]

    // Custom render config (serializable)
    if (column.renderConfig) {
      return renderWithConfig(value, column.renderConfig)
    }

    // Type-based rendering
    switch (column.type) {
      case 'date':
        return formatDate(value as string)
      case 'badge':
        return (
          <Badge variant="outline">
            {value ? String(value) : 'N/A'}
          </Badge>
        )
      case 'email':
        return value ? (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
            {String(value)}
          </a>
        ) : 'N/A'
      case 'number':
        return value !== null && value !== undefined ? Number(value).toLocaleString() : 'N/A'
      default:
        return value ? String(value) : 'N/A'
    }
  }

  const exportToCSV = () => {
    const headers = config.columns
      .filter(col => visibleColumns.has(col.id))
      .map(col => col.label)

    const rows = filteredData.map(row =>
      config.columns
        .filter(col => visibleColumns.has(col.id))
        .map(col => {
          const value = row[col.id]
          if (col.type === 'date') {
            return formatDate(value as string)
          }
          return value ? String(value) : ''
        })
    )

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = config.exportFilename || 'export.csv'
    a.click()
  }

  const handleRowClick = (row: Record<string, unknown>) => {
    if (config.rowClickPath) {
      const path = config.rowClickPath.replace('{id}', String(row.id))
      router.push(path)
    }
  }

  const handleEditClick = (row: Record<string, unknown>, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click from firing
    setEditingRow({ ...row })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingRow || !config.editConfig) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/table-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: config.editConfig.tableName,
          id: editingRow.id,
          data: editingRow,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      // Update local data
      setData(prevData =>
        prevData.map(row => (row.id === editingRow.id ? editingRow : row))
      )

      toast.success('Changes saved successfully')

      setIsEditDialogOpen(false)
      setEditingRow(null)
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: unknown) => {
    if (!editingRow) return
    setEditingRow({ ...editingRow, [fieldId]: value })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {filteredData.length} of {data.length} {config.title.toLowerCase()}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${config.title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Custom Filters */}
          {config.filters?.map(filter => (
            <Select
              key={filter.id}
              value={filters[filter.id] || 'all'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, [filter.id]: value }))}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Column Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="h-4 w-4 mr-2" />
                Columns
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {config.columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns.has(column.id)}
                  onCheckedChange={(checked) => {
                    const newVisibleColumns = new Set(visibleColumns)
                    if (checked) {
                      newVisibleColumns.add(column.id)
                    } else {
                      newVisibleColumns.delete(column.id)
                    }
                    setVisibleColumns(newVisibleColumns)
                  }}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns
                .filter(col => visibleColumns.has(col.id))
                .map(col => (
                  <TableHead key={col.id}>{col.label}</TableHead>
                ))}
              {config.editConfig && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={config.columns.filter(col => visibleColumns.has(col.id)).length}
                  className="h-24 text-center"
                >
                  No {config.title.toLowerCase()} found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow
                  key={row.id as string || idx}
                  className={config.rowClickPath ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                  onClick={() => handleRowClick(row)}
                >
                  {config.columns
                    .filter(col => visibleColumns.has(col.id))
                    .map(col => (
                      <TableCell key={col.id}>
                        {renderCellContent(col, row)}
                      </TableCell>
                    ))}
                  {config.editConfig && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditClick(row, e)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {config.editConfig && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {config.title.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              Make changes to this record. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              {editingRow && config.columns
                .filter(col => col.id !== 'id' && col.id !== 'created_at' && col.id !== 'updated_at')
                .map((col) => {
                  const value = editingRow[col.id]
                  const isEditable = !config.editConfig?.editableFields ||
                                   config.editConfig.editableFields.includes(col.id)

                  if (!isEditable) return null

                  return (
                    <div key={col.id} className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor={col.id} className="text-right pt-2">
                        {col.label}
                      </Label>
                      <div className="col-span-3">
                        {col.type === 'date' ? (
                          <Input
                            id={col.id}
                            type="date"
                            value={value ? String(value).split('T')[0] : ''}
                            onChange={(e) => handleFieldChange(col.id, e.target.value)}
                          />
                        ) : col.renderConfig?.type === 'badge' || col.type === 'badge' ? (
                          <Select
                            value={String(value || '')}
                            onValueChange={(v) => handleFieldChange(col.id, v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {config.filters
                                ?.find(f => f.field === col.id)
                                ?.options.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                )) || []}
                            </SelectContent>
                          </Select>
                        ) : col.renderConfig?.type === 'currency' || col.type === 'number' ? (
                          <Input
                            id={col.id}
                            type="number"
                            step="0.01"
                            value={value ? Number(value) : ''}
                            onChange={(e) => handleFieldChange(col.id, parseFloat(e.target.value))}
                          />
                        ) : col.type === 'email' ? (
                          <Input
                            id={col.id}
                            type="email"
                            value={String(value || '')}
                            onChange={(e) => handleFieldChange(col.id, e.target.value)}
                          />
                        ) : (
                          <Textarea
                            id={col.id}
                            value={String(value || '')}
                            onChange={(e) => handleFieldChange(col.id, e.target.value)}
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingRow(null)
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
