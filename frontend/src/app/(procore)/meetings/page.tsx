'use client';

import * as React from 'react';
import { useInfiniteQuery } from '@/hooks/use-infinite-query';
import { PortfolioFilters } from '@/components/portfolio';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Users, Calendar, Clock, ExternalLink, Settings, ChevronDown, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { GenericEditableTable, type EditableColumn } from '@/components/tables/generic-editable-table';
import { updateMeeting, deleteMeeting } from '@/app/actions/table-actions';

interface Meeting {
  id: string
  title: string | null
  url: string | null
  created_at: string | null
  type: string | null
  date: string | null
  duration_minutes: number | null
  participants: string | null
  summary: string | null
  project: string | null
  project_id: bigint | null
  status: string | null
  category: string | null
  employee: string | null
  fireflies_link: string | null
}

type StatusFilter = 'all' | 'completed' | 'scheduled' | 'cancelled' | 'pending';

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [projectFilter, setProjectFilter] = React.useState<string | null>(null);

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
    pageSize: 20,
    trailingQuery: (query) => {
      let filteredQuery = query
        .eq('type', 'meeting')
        .order('date', { ascending: false })

      // Apply search filter
      if (searchQuery && searchQuery.length > 0) {
        filteredQuery = filteredQuery.ilike('title', `%${searchQuery}%`)
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredQuery = filteredQuery.eq('status', statusFilter)
      }

      // Apply project filter
      if (projectFilter && projectFilter !== 'all') {
        filteredQuery = filteredQuery.eq('project', projectFilter)
      }

      return filteredQuery
    },
  })

  // Extract unique projects for filter options
  const projectOptions = React.useMemo(() => {
    const projects = new Set(data.map((m: Meeting) => m.project).filter(Boolean));
    return Array.from(projects).sort();
  }, [data]);

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log('Export to', format);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setProjectFilter(null);
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Define editable columns
  const columns: EditableColumn<Meeting>[] = [
    {
      key: 'title',
      header: 'Title',
      type: 'text',
      width: 'w-[300px]',
      render: (value, row) => (
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="line-clamp-2 font-medium">
              {value || 'Untitled Meeting'}
            </div>
            {row.summary && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {row.summary}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      type: 'datetime-local',
      width: 'w-[180px]',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <div className="text-sm">
            {format(new Date(value), 'MMM d, yyyy')}
          </div>
        </div>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'duration_minutes',
      header: 'Duration',
      type: 'number',
      width: 'w-[100px]',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDuration(value)}</span>
        </div>
      ),
    },
    {
      key: 'participants',
      header: 'Participants',
      type: 'text',
      render: (value) => (
        <div className="text-sm line-clamp-1">
          {value || '-'}
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project',
      type: 'text',
      render: (value) => value ? (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'status',
      header: 'Status',
      type: 'select',
      selectOptions: [
        { value: 'completed', label: 'Completed' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'pending', label: 'Pending' },
      ],
      render: (value) => value ? (
        <Badge
          variant="secondary"
          className={getStatusColor(value)}
        >
          {value}
        </Badge>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'url',
      header: 'Links',
      editable: false,
      width: 'w-[100px]',
      render: (value, row) => (row.url || row.fireflies_link) ? (
        <a
          href={row.url || row.fireflies_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : null,
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-50px)] min-h-0 bg-gray-50 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600">Error loading meetings: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] min-h-0 bg-gray-50 rounded-lg overflow-hidden">

      {/* Header - matching portfolio header style */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
            <button
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  <FileText className="w-4 h-4 mr-2" />
                  Export
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export to CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Filters - using the same PortfolioFilters component */}
        <PortfolioFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={(status) => setStatusFilter(status as StatusFilter)}
          viewType="list"
          onViewTypeChange={() => {}}
          stageFilter={projectFilter}
          onStageFilterChange={setProjectFilter}
          typeFilter={statusFilter !== 'all' ? statusFilter : null}
          onTypeFilterChange={(type) => setStatusFilter(type as StatusFilter || 'all')}
          stageOptions={projectOptions}
          typeOptions={['completed', 'scheduled', 'cancelled', 'pending']}
          onClearFilters={handleClearFilters}
          stageLabel="Project"
          typeLabel="Status"
          hideViewToggle={true}
        />

        {/* Count */}
        <div className="px-4 py-2 text-sm text-gray-600 bg-white border-b border-gray-200">
          <span className="font-medium">{isSuccess ? data.length : 0}</span> of <span className="font-medium">{count}</span> meeting{count !== 1 ? 's' : ''} loaded
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white">
          {isLoading && !data.length ? (
            // Loading skeleton
            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 mb-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            // No results
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meetings found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || projectFilter
                  ? 'Try adjusting your filters or search query.'
                  : 'No meetings have been added yet.'}
              </p>
            </div>
          ) : (
            <>
              <GenericEditableTable
                data={data}
                columns={columns}
                onUpdate={updateMeeting}
                onDelete={deleteMeeting}
                className="border-0"
              />

              {/* Loading more indicator */}
              {isFetching && (
                <div className="p-4 text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
              )}
            </>
          )}

          {/* Load more button */}
          {isSuccess && data.length > 0 && hasMore && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center">
              <Button
                onClick={fetchNextPage}
                disabled={isFetching}
                variant="outline"
                size="lg"
              >
                {isFetching ? 'Loading...' : 'Load More Meetings'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}