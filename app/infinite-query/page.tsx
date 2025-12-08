'use client'

import { useInfiniteQuery } from '@/hooks/use-infinite-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

interface Commitment {
  id: bigint
  project_id: bigint
  vendor_id: bigint | null
  number: string
  title: string
  amount: number
  status: string
  signed_date: string | null
  created_at: string
  updated_at: string
}

export default function InfiniteQueryDemoPage() {
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
    tableName: 'commitments',
    columns: '*',
    pageSize: 10,
    trailingQuery: (query) => query.order('created_at', { ascending: false }),
  })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Commitments</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Infinite Query Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the Supabase infinite query hook with the commitments table.
          Scroll down or click &quot;Load More&quot; to fetch additional records.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading && !data.length ? (
          // Initial loading state
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          // Data display
          <>
            {data.map((commitment: Commitment) => (
              <Card key={commitment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{commitment.title}</CardTitle>
                      <CardDescription>
                        Contract #{commitment.number} • {commitment.status}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold">
                        ${commitment.amount?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {commitment.signed_date
                          ? `Signed ${formatDistanceToNow(new Date(commitment.signed_date))} ago`
                          : 'Not signed'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Project ID:</span> {commitment.project_id}
                    </div>
                    <div>
                      <span className="font-medium">Vendor ID:</span> {commitment.vendor_id}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {formatDistanceToNow(new Date(commitment.created_at))} ago
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{' '}
                      {formatDistanceToNow(new Date(commitment.updated_at))} ago
                    </div>
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
            Showing {data.length} of {count} commitments
          </div>
          
          {hasMore && (
            <Button
              onClick={fetchNextPage}
              disabled={isFetching}
              size="lg"
              variant="outline"
            >
              {isFetching ? 'Loading...' : 'Load More'}
            </Button>
          )}
          
          {!hasMore && data.length > 0 && (
            <div className="text-sm text-muted-foreground">
              No more commitments to load
            </div>
          )}
        </div>
      )}
    </div>
  )
}