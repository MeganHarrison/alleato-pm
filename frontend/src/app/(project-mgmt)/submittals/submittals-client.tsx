'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import type { Database } from '@/types/database.types';

type SubmittalRow = Database['public']['Tables']['submittals']['Row'] & {
  projects?: {
    id: number;
    name: string;
  };
};

interface SubmittalsClientProps {
  submittals: SubmittalRow[];
}

export function SubmittalsClient({ submittals }: SubmittalsClientProps) {
  const router = useRouter();
  const [data, setData] = React.useState<SubmittalRow[]>(submittals);

  const columns: ColumnDef<SubmittalRow>[] = [
    {
      accessorKey: 'submittal_number',
      header: 'Number',
      cell: ({ row }) => (
        <button
          type="button"
          className="font-medium text-[hsl(var(--procore-orange))] hover:underline"
        >
          {row.getValue('submittal_number')}
        </button>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'submittal_type_id',
      header: 'Type',
      cell: ({ row }) => {
        // For now, show the ID - in a real app, you'd join with submittal_types table
        return <span>Type {row.getValue('submittal_type_id')}</span>;
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
          under_review: 'bg-yellow-100 text-yellow-700',
          requires_revision: 'bg-orange-100 text-orange-700',
          approved: 'bg-green-100 text-green-700',
          rejected: 'bg-red-100 text-red-700',
          superseded: 'bg-gray-100 text-gray-700',
        };
        return (
          <Badge className={statusColors[status] || 'bg-gray-100 text-gray-700'}>
            {status?.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'submitter_company',
      header: 'Submitted By',
    },
    {
      accessorKey: 'current_version',
      header: 'Rev',
    },
    {
      accessorKey: 'required_approval_date',
      header: 'Due Date',
      cell: ({ row }) => {
        const date = row.getValue('required_approval_date') as string | null;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'projects.name',
      header: 'Project',
      cell: ({ row }) => {
        return row.original.projects?.name || '-';
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

  const statusCounts = {
    draft: data.filter(item => item.status === 'draft').length,
    submitted: data.filter(item => item.status === 'submitted').length,
    approved: data.filter(item => item.status === 'approved').length,
    under_review: data.filter(item => item.status === 'under_review').length,
    rejected: data.filter(item => item.status === 'rejected').length,
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submittals</h1>
          <p className="text-sm text-gray-500 mt-1">Track submittal review and approval</p>
        </div>
        <Button 
          className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90"
          onClick={() => router.push('/rfi-form')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Submittal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Draft</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {statusCounts.draft}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Submitted</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {statusCounts.submitted}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Under Review</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {statusCounts.under_review}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {statusCounts.approved}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Rejected</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {statusCounts.rejected}
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