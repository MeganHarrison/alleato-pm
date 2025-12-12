'use client';

import { useState } from 'react';
import { DataTableResponsive } from '@/components/tables';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sample data type
type SampleData = {
  id: string;
  number: string;
  title: string;
  company: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  type: 'contract' | 'purchase_order' | 'invoice';
  amount: number;
  date: string;
};

// Generate sample data
const sampleData: SampleData[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  number: `DOC-${String(i + 1).padStart(4, '0')}`,
  title: `Sample Document ${i + 1}`,
  company: ['Acme Corp', 'TechCo', 'BuildIt Inc', 'Constructor Ltd'][i % 4],
  status: ['active', 'pending', 'completed', 'cancelled'][i % 4] as any,
  type: ['contract', 'purchase_order', 'invoice'][i % 3] as any,
  amount: Math.floor(Math.random() * 100000) + 10000,
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
}));

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    pending: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
  };
  
  return (
    <Badge variant={variants[status] || 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function ResponsiveTableDemo() {
  const [data] = useState(sampleData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const columns: ColumnDef<SampleData>[] = [
    {
      accessorKey: 'number',
      header: 'Number',
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 hover:text-blue-800">
          {row.getValue('number')}
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'company',
      header: 'Company',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <span className="capitalize">{type?.replace(/_/g, ' ')}</span>;
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.getValue('amount')),
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
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
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Responsive Table Demo</h1>
        <p className="text-muted-foreground mt-2">
          Resize your browser to see the table adapt to mobile view
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Desktop (&gt;1024px):</strong> Full table with inline filters
          </p>
          <p className="text-sm">
            <strong>Mobile (&lt;1024px):</strong> Card view with filter modal
          </p>
        </div>
      </div>

      <DataTableResponsive
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search documents..."
        filterOptions={[
          {
            column: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Pending', value: 'pending' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
          {
            column: 'type',
            title: 'Type',
            options: [
              { label: 'Contract', value: 'contract' },
              { label: 'Purchase Order', value: 'purchase_order' },
              { label: 'Invoice', value: 'invoice' },
            ],
          },
        ]}
        mobileColumns={['number', 'title', 'status', 'amount']}
        mobileCardRenderer={(item: SampleData) => (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-medium text-blue-600">
                  {item.number}
                </div>
                <div className="text-sm">
                  {item.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.company} • {item.date}
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <Badge variant="outline" className="text-xs">
                {item.type.replace(/_/g, ' ')}
              </Badge>
              <span className="font-medium text-sm">
                {formatCurrency(item.amount)}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
}