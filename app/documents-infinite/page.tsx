'use client'

import { useState } from 'react'
import { useInfiniteQuery } from '@/hooks/use-infinite-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDistanceToNow, format } from 'date-fns'
import { FileText, Clock, Tag, Users, Calendar, ExternalLink, Filter } from 'lucide-react'

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
    trailingQuery: (query) => {
      let filteredQuery = query.order('date', { ascending: false })
      
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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Documents Infinite Query Demo</h1>
        <p className="text-muted-foreground">
          Browse document metadata with infinite scrolling. This demo showcases filtering,
          rich metadata display, and efficient pagination.
        </p>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && !data.length ? (
          // Initial loading state
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          // Data display
          <>
            {data.map((doc: DocumentMetadata) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {doc.title || 'Untitled Document'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {doc.type && (
                          <div className="flex items-center gap-1">
                            {getTypeIcon(doc.type)}
                            <span className="capitalize">{doc.type}</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Summary or Description */}
                  {(doc.summary || doc.description) && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {doc.summary || doc.description}
                    </p>
                  )}

                  {/* Metadata Grid */}
                  <div className="space-y-2 text-sm">
                    {doc.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{format(new Date(doc.date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    
                    {doc.duration_minutes && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{doc.duration_minutes} minutes</span>
                      </div>
                    )}

                    {doc.participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="line-clamp-1">{doc.participants}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags and Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {doc.status && (
                      <Badge variant="outline" className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    )}
                    {doc.category && (
                      <Badge variant="secondary">{doc.category}</Badge>
                    )}
                    {doc.access_level && doc.access_level !== 'team' && (
                      <Badge variant="outline">{doc.access_level}</Badge>
                    )}
                    {doc.project && (
                      <Badge variant="outline">
                        <span className="text-xs">Project: {doc.project}</span>
                      </Badge>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(doc.created_at))} ago
                    {doc.employee && <span> • By {doc.employee}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Load more section */}
      {isSuccess && (
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
          
          {!hasMore && data.length > 0 && (
            <div className="text-sm text-muted-foreground">
              No more documents to load
            </div>
          )}

          {!hasMore && data.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or add some documents to the database.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}