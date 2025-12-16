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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useClients } from '@/hooks/use-clients';
import { ClientFormDialog } from '@/components/domain/clients/ClientFormDialog';
import { deleteClient } from '@/app/actions/table-actions';
import { toast } from 'sonner';

interface Client {
  id: number;
  name: string | null;
  company_id: string | null;
  status: string | null;
  created_at: string;
  company?: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
  } | null;
}

interface ClientDisplay {
  id: number;
  name: string;
  companyName: string;
  address: string;
  status: 'active' | 'inactive';
  raw: Client;
}

export default function ClientDirectoryPage() {
  const { clients: dbClients, isLoading, error, refetch } = useClients();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const data: ClientDisplay[] = React.useMemo(() => {
    return dbClients.map((client) => {
      const company = client.company;
      return {
        id: client.id,
        name: client.name || 'Unnamed Client',
        companyName: company?.name || '-',
        address: company
          ? [company.address, company.city, company.state].filter(Boolean).join(', ')
          : '-',
        status: (client.status || 'active') as 'active' | 'inactive',
        raw: client as Client,
      };
    });
  }, [dbClients]);

  const handleAddClient = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteClient(clientToDelete.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Client deleted successfully');
        refetch();
      }
    } catch (error) {
      toast.error('Failed to delete client');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleDialogSuccess = () => {
    refetch();
  };

  const columns: ColumnDef<ClientDisplay>[] = [
    {
      accessorKey: 'name',
      header: 'Client Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
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
          <Badge
            className={
              status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const client = row.original.raw;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteClick(client)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
        <Button
          onClick={handleAddClient}
          className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
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
            {data.filter((c) => c.status === 'active').length}
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
            onClick={handleAddClient}
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

      {/* Client Form Dialog */}
      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        onSuccess={handleDialogSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{clientToDelete?.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
