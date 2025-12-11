'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChangeEvent {
  id: string;
  number: string;
  title: string;
  description: string;
  origin: 'owner' | 'contractor' | 'architect' | 'design_change' | 'other';
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'closed';
  initiator: string;
  estimatedCost: number;
  estimatedTime: number;
  contract: string;
  createdDate: string;
  responseDate: string | null;
}

const mockChangeEvents: ChangeEvent[] = [
  {
    id: '1',
    number: 'CE-001',
    title: 'Foundation design modification',
    description: 'Modify foundation design due to soil conditions',
    origin: 'design_change',
    status: 'pending_approval',
    initiator: 'John Smith',
    estimatedCost: 45000,
    estimatedTime: 14,
    contract: 'Prime Contract - Office Building',
    createdDate: '2025-12-01',
    responseDate: null,
  },
  {
    id: '2',
    number: 'CE-002',
    title: 'Add exterior lighting fixtures',
    description: 'Owner requested additional lighting in parking area',
    origin: 'owner',
    status: 'approved',
    initiator: 'Jane Doe',
    estimatedCost: 12500,
    estimatedTime: 7,
    contract: 'Prime Contract - Office Building',
    createdDate: '2025-11-28',
    responseDate: '2025-12-05',
  },
  {
    id: '3',
    number: 'CE-003',
    title: 'HVAC system upgrade',
    description: 'Upgrade to more efficient HVAC system',
    origin: 'contractor',
    status: 'draft',
    initiator: 'Mike Johnson',
    estimatedCost: 78000,
    estimatedTime: 21,
    contract: 'Prime Contract - Office Building',
    createdDate: '2025-12-08',
    responseDate: null,
  },
  {
    id: '4',
    number: 'CE-004',
    title: 'Window specification change',
    description: 'Change window specification per architect',
    origin: 'architect',
    status: 'rejected',
    initiator: 'Sarah Wilson',
    estimatedCost: 15000,
    estimatedTime: 10,
    contract: 'Prime Contract - Office Building',
    createdDate: '2025-11-20',
    responseDate: '2025-11-25',
  },
];

export default function ChangeEventsPage() {
  const [data, setData] = React.useState<ChangeEvent[]>(mockChangeEvents);

  const originColors: Record<string, string> = {
    owner: 'bg-blue-100 text-blue-700',
    contractor: 'bg-green-100 text-green-700',
    architect: 'bg-purple-100 text-purple-700',
    design_change: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700',
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    closed: 'bg-blue-100 text-blue-700',
  };

  const columns: ColumnDef<ChangeEvent>[] = [
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
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('title')}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'origin',
      header: 'Origin',
      cell: ({ row }) => {
        const origin = row.getValue('origin') as string;
        return (
          <Badge className={originColors[origin]}>
            {origin.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={statusColors[status]}>
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'initiator',
      header: 'Initiator',
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Est. Cost',
      cell: ({ row }) => (
        <span className="font-medium">
          ${row.getValue<number>('estimatedCost').toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedTime',
      header: 'Est. Time',
      cell: ({ row }) => (
        <span>{row.getValue('estimatedTime')} days</span>
      ),
    },
    {
      accessorKey: 'createdDate',
      header: 'Created',
      cell: ({ row }) => (
        <span>{new Date(row.getValue('createdDate')).toLocaleDateString()}</span>
      ),
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
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Convert to Change Order
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
          <h1 className="text-3xl font-bold text-gray-900">Change Events</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage potential contract changes</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Change Event
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Events</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{data.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Pending Approval</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(e => e.status === 'pending_approval').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(e => e.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Est. Total Cost</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            ${data.reduce((sum, e) => sum + e.estimatedCost, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          searchKey="title"
          searchPlaceholder="Search change events..."
        />
      </div>
    </div>
  );
}
