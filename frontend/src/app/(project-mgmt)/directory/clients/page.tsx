'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Building, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/use-clients';

interface ClientDisplay {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  projectCount: number;
  status: 'active' | 'inactive';
}

export default function ClientDirectoryPage() {
  // Fetch clients from Supabase
  const { clients: dbClients, isLoading, error, createClient, refetch } = useClients();

  // State for "Add New Client" dialog
  const [showAddClient, setShowAddClient] = React.useState(false);
  const [newClientName, setNewClientName] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  // Transform database clients to the format expected by the table
  const data: ClientDisplay[] = React.useMemo(() => {
    return dbClients.map((client) => {
      const company = client.company;
      return {
        id: client.id.toString(),
        name: client.name || 'Unnamed Client',
        contact: '', // Contact info not directly on clients table
        email: '', // Would need to join with contacts
        phone: '',
        address: company ? `${company.address || ''}, ${company.city || ''}, ${company.state || ''}`.replace(/^, |, $/g, '') : '',
        projectCount: 0, // Would need to count from projects table
        status: (client.status || 'active') as 'active' | 'inactive',
      };
    });
  }, [dbClients]);

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;

    setIsCreating(true);
    const newClient = await createClient({
      name: newClientName.trim(),
      status: 'active',
    });

    if (newClient) {
      setNewClientName('');
      setShowAddClient(false);
      refetch();
    }
    setIsCreating(false);
  };

  const columns: ColumnDef<ClientDisplay>[] = [
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
      accessorKey: 'address',
      header: 'Address',
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-6 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-6 items-center justify-center">
        <p className="text-sm text-red-500">Error loading clients: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage clients and owners</p>
        </div>
        <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client to associate with projects.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddClient(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClient} disabled={!newClientName.trim() || isCreating}>
                {isCreating ? 'Creating...' : 'Create Client'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="flex-1 bg-white rounded-lg border flex flex-col items-center justify-center p-8">
          <Building className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No clients found</p>
          <Button
            className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90"
            onClick={() => setShowAddClient(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Client
          </Button>
        </div>
      )}

      {/* Table */}
      {data.length > 0 && (
        <div className="flex-1 bg-white rounded-lg border overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search clients..."
          />
        </div>
      )}
    </div>
  );
}
