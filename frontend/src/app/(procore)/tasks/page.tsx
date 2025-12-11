'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review structural drawings',
    description: 'Review and approve structural drawings for foundation',
    assignee: 'John Smith',
    priority: 'high',
    dueDate: '2025-12-15',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Order concrete materials',
    description: 'Place order for concrete delivery',
    assignee: 'Jane Doe',
    priority: 'high',
    dueDate: '2025-12-12',
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Schedule site inspection',
    description: 'Coordinate with inspector for final walkthrough',
    assignee: 'Mike Johnson',
    priority: 'medium',
    dueDate: '2025-12-20',
    status: 'review',
  },
  {
    id: '4',
    title: 'Submit RFI response',
    description: 'Response to RFI-001 regarding beam specification',
    assignee: 'Sarah Wilson',
    priority: 'high',
    dueDate: '2025-12-11',
    status: 'done',
  },
];

const TaskCard = ({ task }: { task: Task }) => {
  const initials = task.assignee.split(' ').map(n => n[0]).join('');
  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{initials}</AvatarFallback>
          </Avatar>
          <Badge className={priorityColors[task.priority]} size="sm">
            {task.priority}
          </Badge>
        </div>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project tasks and assignments</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">To Do</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{tasksByStatus.todo.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{tasksByStatus.in_progress.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Done</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{tasksByStatus.done.length}</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        {/* To Do Column */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            To Do
            <Badge className="bg-gray-200 text-gray-700">{tasksByStatus.todo.length}</Badge>
          </h2>
          <div className="space-y-3">
            {tasksByStatus.todo.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            In Progress
            <Badge className="bg-blue-200 text-blue-700">{tasksByStatus.in_progress.length}</Badge>
          </h2>
          <div className="space-y-3">
            {tasksByStatus.in_progress.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Review Column */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            Review
            <Badge className="bg-purple-200 text-purple-700">{tasksByStatus.review.length}</Badge>
          </h2>
          <div className="space-y-3">
            {tasksByStatus.review.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-green-50 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
            Done
            <Badge className="bg-green-200 text-green-700">{tasksByStatus.done.length}</Badge>
          </h2>
          <div className="space-y-3">
            {tasksByStatus.done.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
