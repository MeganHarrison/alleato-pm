'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Submittal {
  id: string;
  number: string;
  title: string;
  type: 'product_data' | 'shop_drawings' | 'samples' | 'other';
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'approved_as_noted';
  assignee: string;
  dueDate: string | null;
  submittedBy: string;
  revision: number;
}

const mockSubmittals: Submittal[] = [
  {
    id: '1',
    number: 'SUB-001',
    title: 'Structural Steel Shop Drawings',
    type: 'shop_drawings',
    status: 'submitted',
    assignee: 'Structural Engineer',
    dueDate: '2025-12-20',
    submittedBy: 'Steel Fabricator Inc',
    revision: 1,
  },
  {
    id: '2',
    number: 'SUB-002',
    title: 'HVAC Equipment Product Data',
    type: 'product_data',
    status: 'approved',
    assignee: 'MEP Engineer',
    dueDate: '2025-12-18',
    submittedBy: 'HVAC Contractor',
    revision: 2,
  },
];

export default function SubmittalsPage() {
  const [data, setData] = React.useState<Submittal[]>(mockSubmittals);

  const columns: ColumnDef<Submittal>[] = [
    {
      accessorKey: 'number',
      header: 'Number',
      cell: ({ row }) => (
        <button
          type="button"
          className="font-medium text-[hsl(var(--procore-orange))] hover:underline"
        >
          {row.getValue('number')}
        </button>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusColors: Record<string, string> = {
          draft: 'bg-gray-100 text-gray-700',
          submitted: 'bg-blue-100 text-blue-700',
          approved: 'bg-green-100 text-green-700',
          rejected: 'bg-red-100 text-red-700',
          approved_as_noted: 'bg-yellow-100 text-yellow-700',
        };
        return (
          <Badge className={statusColors[status] || 'bg-gray-100 text-gray-700'}>
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'assignee',
      header: 'Assigned To',
    },
    {
      accessorKey: 'submittedBy',
      header: 'Submitted By',
    },
    {
      accessorKey: 'revision',
      header: 'Rev',
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => {
        const date = row.getValue('dueDate') as string | null;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
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
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submittals</h1>
          <p className="text-sm text-gray-500 mt-1">Track submittal review and approval</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Submittal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Draft</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(item => item.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Submitted</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(item => item.status === 'submitted').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(item => item.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">As Noted</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(item => item.status === 'approved_as_noted').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Rejected</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(item => item.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search submittals..."
        />
      </div>
    </div>
  );
}
