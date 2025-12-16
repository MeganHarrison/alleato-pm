'use client'

import { useCallback, useState } from 'react'
import { useInfiniteQuery, type SupabaseQueryHandler } from '@/hooks/use-infinite-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/layout/PageHeader'
import { format } from 'date-fns'
import { Calendar, Clock, ExternalLink, FileText, Filter, Tag, Users } from 'lucide-react'

interface DocumentMetadata {
  id: string
  title: string | null
  url: string | null
  created_at: string | null
  type: string | null
  source: string | null
  content: string | null
  summary: string | null
  participants: string | null
  tags: string | null
  category: string | null
  fireflies_id: string | null
  fireflies_link: string | null
  project_id: bigint | null
  project: string | null
  date: string | null
  outline: string | null
  duration_minutes: number | null
  bullet_points: string | null
  action_items: string | null
  created_by: string | null
  entities: unknown | null
  file_id: number | null
  overview: string | null
  employee: string | null
  fireflies_file_url: string | null
  description: string | null
  status: string | null
  access_level: string | null
}

export default function DocumentsInfiniteDemoPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Memoize the trailingQuery function to ensure it only changes when filters change
  const trailingQuery = useCallback<SupabaseQueryHandler<'document_metadata'>>(
    (query) => {
      // Order by date DESC, then by id DESC to avoid pagination overlap with duplicate dates
      let filteredQuery = query
        .order('date', { ascending: false })
        .order('id', { ascending: false })

      // Apply filters
      if (typeFilter !== 'all') {
        filteredQuery = filteredQuery.eq('type', typeFilter)
      }
      if (categoryFilter !== 'all') {
        filteredQuery = filteredQuery.eq('category', categoryFilter)
      }
      if (statusFilter !== 'all') {
        filteredQuery = filteredQuery.eq('status', statusFilter)
      }

      return filteredQuery
    },
    [typeFilter, categoryFilter, statusFilter]
  )

  const {
    data,
    count,
    isSuccess,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
  } = useInfiniteQuery({
    tableName: 'document_metadata',
    columns: '*',
    pageSize: 12,
    trailingQuery,
  })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Documents</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getTypeIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'meeting':
        return <Users className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'transcript':
        return <Clock className="h-4 w-4" />
      default:
        return <Tag className="h-4 w-4" />
    }
  }

  return (
    <>
      <PageHeader
        title="Documents Infinite Query Demo"
        description="Browse document metadata with infinite scrolling. This demo showcases filtering, rich metadata display, and efficient pagination."
        breadcrumbs={[
          { label: 'Demo', href: '/' },
          { label: 'Documents Infinite' }
        ]}
      />

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="transcript">Transcript</SelectItem>
            <SelectItem value="report">Report</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !data.length ? (
              // Initial loading state
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or add some documents to the database.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data display
              data.map((doc: DocumentMetadata) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium line-clamp-1">
                        {doc.title || 'Untitled Document'}
                      </span>
                      {(doc.summary || doc.description) && (
                        <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {doc.summary || doc.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc.type && (
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(doc.type)}
                        <span className="capitalize text-sm">{doc.type}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.date ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(doc.date), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.status && (
                      <Badge variant="outline" className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.category ? (
                      <Badge variant="secondary" className="text-xs">
                        {doc.category}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.duration_minutes ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {doc.duration_minutes} min
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.participants ? (
                      <div className="flex items-center gap-1.5 text-sm max-w-[200px]">
                        <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="line-clamp-1">{doc.participants}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-muted-foreground hover:text-primary"
                        aria-label={`Open ${doc.title || 'document'}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load more section */}
      {isSuccess && data.length > 0 && (
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground mb-4">
            Showing {data.length} of {count} documents
            {(typeFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all') &&
              ' (filtered)'}
          </div>

          {hasMore && (
            <Button
              onClick={fetchNextPage}
              disabled={isFetching}
              size="lg"
              variant="outline"
            >
              {isFetching ? 'Loading...' : 'Load More Documents'}
            </Button>
          )}

          {!hasMore && (
            <div className="text-sm text-muted-foreground">
              No more documents to load
            </div>
          )}
        </div>
      )}
      </div>
    </>
  )
}