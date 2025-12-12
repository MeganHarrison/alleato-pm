'use client';

import * as React from 'react';
import { useInfiniteQuery } from '@/hooks/use-infinite-query';
import { GenericEditableTable, type EditableColumn } from '@/components/tables/generic-editable-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  status: string;
  due_date: string | null;
  project_id: number | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  metadata: any;
  source_document_id: string | null;
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const {
    data,
    count,
    isSuccess,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
  } = useInfiniteQuery<Task>({
    tableName: 'ai_tasks',
    columns: '*',
    pageSize: 20,
    trailingQuery: (query) => {
      let filteredQuery = query.order('due_date', { ascending: true });

      // Apply search filter
      if (searchQuery && searchQuery.length > 0) {
        filteredQuery = filteredQuery.ilike('title', `%${searchQuery}%`);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredQuery = filteredQuery.eq('status', statusFilter);
      }

      return filteredQuery;
    },
  });

  const updateTask = async (id: string | number, data: Partial<Task>) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('ai_tasks')
        .update(data)
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      toast.success('Task updated successfully');
      window.location.reload(); // Simple reload to refresh data
      return { success: true };
    } catch (error) {
      return { error: 'Failed to update task' };
    }
  };

  const deleteTask = async (id: string | number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('ai_tasks')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      toast.success('Task deleted successfully');
      window.location.reload(); // Simple reload to refresh data
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete task' };
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      done: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityFromDate = (dueDate: string | null) => {
    if (!dueDate) return { level: 'low', color: 'bg-gray-100 text-gray-700' };
    
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { level: 'overdue', color: 'bg-red-100 text-red-700' };
    if (daysUntil <= 3) return { level: 'high', color: 'bg-orange-100 text-orange-700' };
    if (daysUntil <= 7) return { level: 'medium', color: 'bg-yellow-100 text-yellow-700' };
    return { level: 'low', color: 'bg-green-100 text-green-700' };
  };

  const columns: EditableColumn<Task>[] = [
    {
      key: 'title',
      header: 'Task Title',
      type: 'text',
      width: 'w-[300px]',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.description && (
            <div className="text-xs text-muted-foreground mt-1">{row.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      type: 'select',
      selectOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'review', label: 'Review' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      render: (value) => (
        <Badge className={getStatusColor(value)}>
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'assignee',
      header: 'Assignee',
      type: 'text',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ) : <span className="text-muted-foreground">Unassigned</span>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      type: 'date',
      width: 'w-[150px]',
      render: (value) => {
        if (!value) return <span className="text-muted-foreground">No due date</span>;
        const priority = getPriorityFromDate(value);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{format(new Date(value), 'MMM d, yyyy')}</span>
            </div>
            <Badge className={`${priority.color} text-xs`}>
              {priority.level}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'project_id',
      header: 'Project',
      type: 'number',
      render: (value) => value ? (
        <Badge variant="outline">Project {value}</Badge>
      ) : <span className="text-muted-foreground">No project</span>,
    },
    {
      key: 'created_at',
      header: 'Created',
      editable: false,
      width: 'w-[150px]',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(value), 'MMM d, yyyy')}
        </span>
      ),
    },
  ];

  // Extract unique statuses for filter
  const statusOptions = React.useMemo(() => {
    const statuses = new Set(data.map((t: Task) => t.status));
    return ['all', ...Array.from(statuses).sort()];
  }, [data]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Tasks</h1>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-500">Manage and track your project tasks</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-md w-full max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      {isSuccess && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{data.length}</span> of <span className="font-medium">{count}</span> tasks loaded
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters.'
                : 'Get started by creating your first task.'}
            </p>
            <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        ) : (
          <GenericEditableTable
            data={data}
            columns={columns}
            onUpdate={updateTask}
            onDelete={deleteTask}
            className="border-0"
          />
        )}
      </div>

      {/* Load More */}
      {isSuccess && hasMore && (
        <div className="text-center">
          <Button
            onClick={fetchNextPage}
            disabled={isFetching}
            variant="outline"
            size="lg"
          >
            {isFetching ? 'Loading...' : 'Load More Tasks'}
          </Button>
        </div>
      )}
    </div>
  );
}