'use client'

import { useState, useMemo } from 'react'
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
  Search,
  Download,
  Columns3,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Image,
  Ruler,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateFMGlobalFigure, deleteFMGlobalFigure } from '@/app/actions/fm-global-figures-actions'
import { toast } from 'sonner'

export type FMGlobalFigure = {
  id: number
  figure_number: string | null
  title: string | null
  figure_type: string | null
  asrs_type: string | null
  container_type: string | null
  max_depth_ft: number | null
  max_depth_m: number | null
  max_spacing_ft: number | null
  max_spacing_m: number | null
  normalized_summary: string | null
  machine_readable_claims: any | null
  search_keywords: string[] | null
  created_at: string
  updated_at: string | null
}

interface FMGlobalFiguresDataTableProps {
  figures: FMGlobalFigure[]
}

const COLUMNS = [
  { id: "figure_number", label: "Figure #", defaultVisible: true },
  { id: "title", label: "Title", defaultVisible: true },
  { id: "figure_type", label: "Type", defaultVisible: true },
  { id: "asrs_type", label: "ASRS Type", defaultVisible: true },
  { id: "container_type", label: "Container", defaultVisible: true },
  { id: "max_depth", label: "Max Depth", defaultVisible: true },
  { id: "max_spacing", label: "Max Spacing", defaultVisible: false },
  { id: "keywords", label: "Keywords", defaultVisible: false },
]

export function FMGlobalFiguresDataTable({ figures }: FMGlobalFiguresDataTableProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [asrsFilter, setAsrsFilter] = useState("all")
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: col.defaultVisible }), {})
  )
  const [sortColumn, setSortColumn] = useState<string>('figure_number')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Get unique values for filters
  const uniqueTypes = useMemo(() => {
    const types = figures.map(fig => fig.figure_type).filter(Boolean)
    return [...new Set(types)]
  }, [figures])

  const uniqueAsrsTypes = useMemo(() => {
    const types = figures.map(fig => fig.asrs_type).filter(Boolean)
    return [...new Set(types)]
  }, [figures])

  // Filter and search figures
  const filteredFigures = useMemo(() => {
    return figures.filter(fig => {
      const matchesSearch = !search || 
        fig.figure_number?.toLowerCase().includes(search.toLowerCase()) ||
        fig.title?.toLowerCase().includes(search.toLowerCase()) ||
        fig.normalized_summary?.toLowerCase().includes(search.toLowerCase())
      
      const matchesType = typeFilter === "all" || fig.figure_type === typeFilter
      const matchesAsrs = asrsFilter === "all" || fig.asrs_type === asrsFilter
      
      return matchesSearch && matchesType && matchesAsrs
    })
  }, [figures, search, typeFilter, asrsFilter])

  const getSortValue = (figure: FMGlobalFigure, columnId: string) => {
    switch (columnId) {
      case 'figure_number':
        return figure.figure_number?.toLowerCase() || ''
      case 'title':
        return figure.title?.toLowerCase() || ''
      case 'figure_type':
        return figure.figure_type?.toLowerCase() || ''
      case 'asrs_type':
        return figure.asrs_type?.toLowerCase() || ''
      case 'container_type':
        return figure.container_type?.toLowerCase() || ''
      case 'max_depth':
        return figure.max_depth_ft ?? 0
      case 'max_spacing':
        return figure.max_spacing_ft ?? 0
      case 'keywords':
        return (figure.machine_readable_claims?.toString() ?? '').toLowerCase()
      default:
        return ''
    }
  }

  const sortedFigures = useMemo(() => {
    const sorted = [...filteredFigures]
    sorted.sort((a, b) => {
      const valueA = getSortValue(a, sortColumn)
      const valueB = getSortValue(b, sortColumn)

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA
      }

      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA))
    })
    return sorted
  }, [filteredFigures, sortColumn, sortDirection])

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    }

    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    ) : (
      <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    )
  }

  const getContainerBadge = (container: string | null) => {
    switch (container) {
      case 'Closed-Top':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Closed-Top</Badge>
      case 'Open-Top':
        return <Badge variant="default" className="bg-green-100 text-green-800">Open-Top</Badge>
      default:
        return container ? <Badge variant="outline">{container}</Badge> : <span className="text-muted-foreground">N/A</span>
    }
  }

  const handleAction = async (action: string, figure: FMGlobalFigure) => {
    try {
      switch (action) {
        case 'delete':
          const result = await deleteFMGlobalFigure(figure.id)
          if (result.error) {
            toast.error(`Failed to delete figure: ${result.error}`)
          } else {
            toast.success('Figure deleted successfully')
          }
          break
        default:
          toast.info(`Action "${action}" not implemented yet`)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">FM Global Figures</h2>
        <p className="text-muted-foreground">
          Browse and manage FM Global 8-34 ASRS sprinkler system figures
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Total rows: {filteredFigures.length}
        </p>
      </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search figures..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Figure Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={asrsFilter} onValueChange={setAsrsFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ASRS Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ASRS</SelectItem>
            {uniqueAsrsTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Columns3 className="mr-2 h-4 w-4" />
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COLUMNS.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={visibleColumns[column.id]}
                onCheckedChange={(value) =>
                  setVisibleColumns(prev => ({
                    ...prev,
                    [column.id]: !!value,
                  }))
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.figure_number && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('figure_number')}
                  >
                    <div className="flex items-center gap-1">
                      Figure #
                      {renderSortIcon('figure_number')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.title && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      {renderSortIcon('title')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.figure_type && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('figure_type')}
                  >
                    <div className="flex items-center gap-1">
                      Type
                      {renderSortIcon('figure_type')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.asrs_type && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('asrs_type')}
                  >
                    <div className="flex items-center gap-1">
                      ASRS Type
                      {renderSortIcon('asrs_type')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.container_type && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('container_type')}
                  >
                    <div className="flex items-center gap-1">
                      Container
                      {renderSortIcon('container_type')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.max_depth && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('max_depth')}
                  >
                    <div className="flex items-center gap-1">
                      Max Depth
                      {renderSortIcon('max_depth')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.max_spacing && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('max_spacing')}
                  >
                    <div className="flex items-center gap-1">
                      Max Spacing
                      {renderSortIcon('max_spacing')}
                    </div>
                  </TableHead>
                )}
                {visibleColumns.keywords && (
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('keywords')}
                  >
                    <div className="flex items-center gap-1">
                      Keywords
                      {renderSortIcon('keywords')}
                    </div>
                  </TableHead>
                )}
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {sortedFigures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No figures found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedFigures.map((figure) => (
                <TableRow key={figure.id}>
                  {visibleColumns.figure_number && (
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4 text-muted-foreground" />
                        <span>{figure.figure_number || 'N/A'}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.title && (
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={figure.title || ''}>
                        {figure.title || 'Untitled'}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.figure_type && (
                    <TableCell>
                      <Badge variant="outline">{figure.figure_type || 'N/A'}</Badge>
                    </TableCell>
                  )}
                  {visibleColumns.asrs_type && (
                    <TableCell>
                      <Badge variant="secondary">{figure.asrs_type || 'All'}</Badge>
                    </TableCell>
                  )}
                  {visibleColumns.container_type && (
                    <TableCell>{getContainerBadge(figure.container_type)}</TableCell>
                  )}
                  {visibleColumns.max_depth && (
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {figure.max_depth_ft ? `${figure.max_depth_ft} ft` : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.max_spacing && (
                    <TableCell>
                      {figure.max_spacing_ft ? `${figure.max_spacing_ft} ft` : 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.keywords && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(figure.search_keywords || []).slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {(figure.search_keywords || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(figure.search_keywords || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <button
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 flex items-center"
                          onClick={() => handleAction('view', figure)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </button>
                        <button
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 flex items-center"
                          onClick={() => handleAction('edit', figure)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 flex items-center text-red-600"
                          onClick={() => handleAction('delete', figure)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredFigures.length} of {figures.length} figures
        </p>
      </div>
    </div>
  )
}
