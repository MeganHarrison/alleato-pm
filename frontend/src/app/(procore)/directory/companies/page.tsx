'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Company {
  id: string;
  name: string;
  type: 'general_contractor' | 'subcontractor' | 'supplier' | 'architect' | 'engineer' | 'owner';
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'ABC Construction',
    type: 'general_contractor',
    contact: 'John Smith',
    email: 'john@abcconstruction.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, ST 12345',
    status: 'active',
  },
  {
    id: '2',
    name: 'Johnson Painting Co',
    type: 'subcontractor',
    contact: 'Mike Johnson',
    email: 'mike@johnsonpainting.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, City, ST 12345',
    status: 'active',
  },
  {
    id: '3',
    name: 'Steel Supply Inc',
    type: 'supplier',
    contact: 'Sarah Williams',
    email: 'sarah@steelsupply.com',
    phone: '(555) 345-6789',
    address: '789 Industrial Blvd, City, ST 12345',
    status: 'active',
  },
];

export default function CompanyDirectoryPage() {
  const [data, setData] = React.useState<Company[]>(mockCompanies);

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'name',
      header: 'Company Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
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
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const typeColors: Record<string, string> = {
          general_contractor: 'bg-blue-100 text-blue-700',
          subcontractor: 'bg-green-100 text-green-700',
          supplier: 'bg-purple-100 text-purple-700',
          architect: 'bg-orange-100 text-orange-700',
          engineer: 'bg-cyan-100 text-cyan-700',
          owner: 'bg-pink-100 text-pink-700',
        };
        return (
          <Badge className={typeColors[type] || 'bg-gray-100 text-gray-700'}>
            {type.replace('_', ' ')}
          </Badge>
        );
      },
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
          <h1 className="text-3xl font-bold text-gray-900">Company Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project companies and vendors</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Companies</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{data.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Active</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Subcontractors</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(c => c.type === 'subcontractor').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Suppliers</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(c => c.type === 'supplier').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search companies..."
        />
      </div>
    </div>
  );
}
