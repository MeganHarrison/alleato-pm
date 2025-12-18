'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PageHeader, PageContainer } from '@/components/layout';
import { DataTableResponsive } from '@/components/tables';
import { ColumnDef } from '@tanstack/react-table';
import { useClients, Client } from '@/hooks/use-clients';
import { useProjectTitle } from '@/hooks/useProjectTitle';

export default function ClientsPage() {
  const router = useRouter();
  useProjectTitle('Clients', false); // Don't include project name for directory pages

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');

  const {
    clients,
    isLoading,
    error,
    refetch,
  } = useClients({
    search: searchTerm,
    status: statusFilter === 'all' ? null : statusFilter,
  });

  const handleCreateClient = () => {
    router.push('/clients/new');
  };

  const handleViewClient = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const handleEditClient = (client: Client) => {
    router.push(`/clients/${client.id}/edit`);
  };

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete ${client.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      await refetch();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete client'}`);
    }
  };

  const handleExport = () => {
    // Export clients to CSV
    const headers = ['ID', 'Name', 'Company', 'Status', 'Created At'];
    const rows = clients.map(client => [
      client.id,
      client.name || '',
      client.company?.name || '',
      client.status || '',
      new Date(client.created_at).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Define columns for DataTable
  const columns: ColumnDef<Client>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
            #{row.getValue('id')}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Client Name',
        cell: ({ row }) => (
          <div className="font-semibold">{row.getValue('name') || 'Unnamed Client'}</div>
        ),
      },
      {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => {
          const company = row.getValue('company') as Client['company'];
          return (
            <div>
              <div className="font-medium">{company?.name || 'N/A'}</div>
              {company?.city && company?.state && (
                <div className="text-sm text-muted-foreground">
                  {company.city}, {company.state}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge
              variant={status === 'active' ? 'default' : 'secondary'}
              className={status === 'active' ? 'bg-green-100 text-green-800' : ''}
            >
              {status || 'Active'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => {
          const date = new Date(row.getValue('created_at'));
          return (
            <div className="text-sm text-muted-foreground">
              {date.toLocaleDateString()}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const client = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open menu</span>
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewClient(client)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditClient(client)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteClient(client)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  if (error) {
    return (
      <>
        <PageHeader
          title="Clients"
          description="Manage your client contacts and companies"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Directory', href: '/directory' },
            { label: 'Clients' },
          ]}
        />
        <PageContainer>
          <Card className="p-6">
            <p className="text-muted-foreground mb-2">Unable to load clients</p>
            <p className="text-sm text-gray-500 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} size="sm">
              Retry
            </Button>
          </Card>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Clients"
        description="Manage your client contacts and companies"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Directory', href: '/directory' },
          { label: 'Clients' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={handleCreateClient}
              className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </div>
        }
      />

      <PageContainer>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="p-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Clients</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-gray-500">
              {clients.filter(c => c.status === 'inactive').length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive Clients</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: 'active' | 'inactive' | 'all') => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Clients Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading clients...</p>
            </div>
          </div>
        ) : (
          <DataTableResponsive
            columns={columns}
            data={clients}
            onRowClick={handleViewClient}
            searchKey="name"
            searchPlaceholder="Search clients..."
            filterOptions={[
              {
                column: 'status',
                title: 'Status',
                options: [
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
            ]}
            mobileColumns={['name', 'company', 'status']}
            mobileCardRenderer={(client: Client) => (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-blue-600">
                      {client.name || 'Unnamed Client'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {client.company?.name || 'No company'}
                    </div>
                  </div>
                  <Badge
                    variant={client.status === 'active' ? 'default' : 'secondary'}
                    className={client.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {client.status || 'Active'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(client.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          />
        )}
      </PageContainer>
    </>
  );
}
