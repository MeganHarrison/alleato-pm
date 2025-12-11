'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Building } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  projectCount: number;
  status: 'active' | 'inactive';
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    contact: 'Robert Johnson',
    email: 'robert.johnson@acmecorp.com',
    phone: '(555) 987-6543',
    address: '100 Business Park Dr, City, ST 12345',
    projectCount: 3,
    status: 'active',
  },
  {
    id: '2',
    name: 'Global Industries',
    contact: 'Lisa Anderson',
    email: 'lisa@globalind.com',
    phone: '(555) 876-5432',
    address: '200 Corporate Blvd, City, ST 12345',
    projectCount: 1,
    status: 'active',
  },
];

export default function ClientDirectoryPage() {
  const [data, setData] = React.useState<Client[]>(mockClients);

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Client Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <button
            type="button"
            className="font-medium text-[hsl(var(--procore-orange))] hover:underline"
          >
            {row.getValue('name')}
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'contact',
      header: 'Primary Contact',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'projectCount',
      header: 'Projects',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
            {status}
          </Badge>
        );
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
          <h1 className="text-3xl font-bold text-gray-900">Client Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage clients and owners</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Clients</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{data.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Active</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Projects</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.reduce((sum, c) => sum + c.projectCount, 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search clients..."
        />
      </div>
    </div>
  );
}
