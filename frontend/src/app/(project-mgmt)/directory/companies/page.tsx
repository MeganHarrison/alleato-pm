'use client';

import * as React from 'react';
import { useInfiniteQuery } from '@/hooks/use-infinite-query';
import { GenericEditableTable, type EditableColumn } from '@/components/tables/generic-editable-table';
import { updateCompany, deleteCompany } from '@/app/actions/table-actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanyFormDialog } from '@/components/domain/companies/CompanyFormDialog';

interface Company {
  id: string;
  name: string;
  title: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  currency_code: string | null;
  currency_symbol: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function CompanyDirectoryPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const {
    data,
    count,
    isSuccess,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
  } = useInfiniteQuery<Company>({
    tableName: 'companies',
    columns: '*',
    pageSize: 20,
    trailingQuery: (query) => {
      return query.order('name', { ascending: true });
    },
  });

  const columns: EditableColumn<Company>[] = [
    {
      key: 'name',
      header: 'Company Name',
      type: 'text',
      width: 'w-[250px]',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value || 'Unnamed Company'}</span>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title/Type',
      type: 'text',
      render: (value) => value ? (
        <Badge variant="outline">{value}</Badge>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'address',
      header: 'Address',
      type: 'text',
      render: (value, row) => {
        if (!value && !row.city && !row.state) return <span className="text-muted-foreground">-</span>;
        const parts = [value, row.city, row.state].filter(Boolean);
        return <span className="text-sm">{parts.join(', ')}</span>;
      },
    },
    {
      key: 'city',
      header: 'City',
      type: 'text',
    },
    {
      key: 'state',
      header: 'State',
      type: 'text',
      width: 'w-[100px]',
    },
    {
      key: 'website',
      header: 'Website',
      type: 'text',
      render: (value) => value ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {new URL(value.startsWith('http') ? value : `https://${value}`).hostname}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'currency_code',
      header: 'Currency',
      type: 'text',
      width: 'w-[100px]',
      render: (value, row) => value ? (
        <span className="text-sm">{row.currency_symbol || ''}{value}</span>
      ) : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'notes',
      header: 'Notes',
      type: 'textarea',
      render: (value) => value ? (
        <span className="text-sm text-muted-foreground line-clamp-2">{value}</span>
      ) : <span className="text-muted-foreground">-</span>,
    },
  ];

  const handleAddCompany = () => {
    setEditingCompany(null);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Companies</h1>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-neutral-900">Company Directory</h1>
            <p className="text-sm text-neutral-500 mt-3">Manage your companies and contractors</p>
          </div>
          <Button
            onClick={handleAddCompany}
            className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

      {/* Count */}
      {isSuccess && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{data.length}</span> of <span className="font-medium">{count}</span> companies loaded
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first company.</p>
            <Button
              onClick={handleAddCompany}
              className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>
        ) : (
          <GenericEditableTable
            data={data}
            columns={columns}
            onUpdate={updateCompany}
            onDelete={deleteCompany}
            className="border-0"
          />
        )}
      </div>

      {/* Load More */}
      {isSuccess && hasMore && (
        <div className="text-center">
          <Button
            onClick={fetchNextPage}
            disabled={isFetching}
            variant="outline"
            size="lg"
          >
            {isFetching ? 'Loading...' : 'Load More Companies'}
          </Button>
        </div>
      )}

      {/* Company Form Dialog */}
      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editingCompany}
        onSuccess={handleDialogSuccess}
      />
      </div>
    </div>
  );
}