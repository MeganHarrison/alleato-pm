'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/financial/shared/status-badge';
import { useFinancialStore } from '@/lib/stores/financial-store';
import { Commitment } from '@/types/financial';
import { PageHeader, PageContainer, PageToolbar, PageTabs } from '@/components/layout';
import { DataTable } from '@/components/tables';
import { ColumnDef } from '@tanstack/react-table';

export default function CommitmentsPage() {
  const router = useRouter();
  const { 
    commitments, 
    setCommitments, 
    isLoading, 
    errors, 
    setLoading, 
    setError 
  } = useFinancialStore();

  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    draft: 0,
    sent: 0,
    pending: 0,
    approved: 0,
    executed: 0,
    closed: 0,
    void: 0,
  });

  const [totals, setTotals] = useState({
    originalAmount: 0,
    revisedAmount: 0,
    balanceToFinish: 0,
    changeOrdersTotal: 0,
  });

  useEffect(() => {
    fetchCommitments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Calculate status counts and totals
    const counts: Record<string, number> = {
      draft: 0,
      sent: 0,
      pending: 0,
      approved: 0,
      executed: 0,
      closed: 0,
      void: 0,
    };
    
    let originalTotal = 0;
    let revisedTotal = 0;
    let balanceTotal = 0;
    let changeOrderTotal = 0;

    commitments.forEach((commitment) => {
      counts[commitment.status] = (counts[commitment.status] || 0) + 1;
      originalTotal += commitment.original_amount || 0;
      revisedTotal += commitment.revised_contract_amount || 0;
      balanceTotal += commitment.balance_to_finish || 0;
      changeOrderTotal += commitment.approved_change_orders || 0;
    });

    setStatusCounts(counts);
    setTotals({
      originalAmount: originalTotal,
      revisedAmount: revisedTotal,
      balanceToFinish: balanceTotal,
      changeOrdersTotal: changeOrderTotal,
    });
  }, [commitments]);

  const fetchCommitments = async () => {
    setLoading('commitments', true);
    setError('commitments', null);

    try {
      const response = await fetch('/api/commitments');
      if (!response.ok) {
        throw new Error('Failed to fetch commitments');
      }
      
      const data = await response.json();
      setCommitments(data.data || []);
    } catch (error) {
      setError('commitments', error instanceof Error ? error.message : 'Failed to fetch commitments');
    } finally {
      setLoading('commitments', false);
    }
  };

  const handleCreateSubcontract = () => {
    router.push('/commitments/subcontracts/new');
  };

  const handleCreatePurchaseOrder = () => {
    router.push('/commitments/purchase-orders/new');
  };

  const handleEdit = (commitment: Commitment) => {
    router.push(`/protected/financial/commitments/${commitment.id}/edit`);
  };

  const handleView = (commitment: Commitment) => {
    router.push(`/protected/financial/commitments/${commitment.id}`);
  };

  const handleDelete = async (commitment: Commitment) => {
    if (!confirm(`Are you sure you want to delete commitment ${commitment.number}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/commitments/${commitment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete commitment');
      }

      await fetchCommitments(); // Refresh the list
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete commitment'}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Define columns for DataTable
  const columns: ColumnDef<Commitment>[] = useMemo(
    () => [
      {
        accessorKey: 'number',
        header: 'Number',
        cell: ({ row }) => (
          <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
            {row.getValue('number')}
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'contract_company_name',
        header: 'Company',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge status={row.getValue('status')} type="commitment" />
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return (
            <span className="capitalize">{type?.replace(/_/g, ' ')}</span>
          );
        },
      },
      {
        accessorKey: 'original_amount',
        header: 'Original Amount',
        cell: ({ row }) => formatCurrency(row.getValue('original_amount') || 0),
      },
      {
        accessorKey: 'revised_contract_amount',
        header: 'Revised Amount',
        cell: ({ row }) => formatCurrency(row.getValue('revised_contract_amount') || 0),
      },
      {
        accessorKey: 'balance_to_finish',
        header: 'Balance to Finish',
        cell: ({ row }) => formatCurrency(row.getValue('balance_to_finish') || 0),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const commitment = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(commitment)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(commitment)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(commitment)}
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

  const tabs = [
    { label: 'All Commitments', href: '/commitments', count: commitments.length },
    { label: 'Subcontracts', href: '/commitments?type=subcontract' },
    { label: 'Purchase Orders', href: '/commitments?type=purchase_order' },
  ];

  if (errors.commitments) {
    return (
      <>
        <PageHeader
          title="Commitments"
          description="Manage purchase orders and subcontracts"
          breadcrumbs={[
            { label: 'Financial', href: '/financial' },
            { label: 'Commitments' },
          ]}
        />
        <PageContainer>
          <Card className="p-6">
            <p className="text-muted-foreground mb-2">Unable to load commitments data</p>
            <p className="text-sm text-gray-500 mb-4">{errors.commitments}</p>
            <Button onClick={fetchCommitments} size="sm">
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
        title="Commitments"
        description="Manage purchase orders and subcontracts"
        breadcrumbs={[
          { label: 'Financial', href: '/financial' },
          { label: 'Commitments' },
        ]}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCreateSubcontract}>
                <Plus className="h-4 w-4 mr-2" />
                Subcontract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreatePurchaseOrder}>
                <Plus className="h-4 w-4 mr-2" />
                Purchase Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <PageTabs tabs={tabs} />

      <PageContainer>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold">{formatCurrency(totals.originalAmount)}</div>
            <p className="text-xs text-muted-foreground">Original Contract Amount</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold">{formatCurrency(totals.changeOrdersTotal)}</div>
            <p className="text-xs text-muted-foreground">Approved Change Orders</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold">{formatCurrency(totals.revisedAmount)}</div>
            <p className="text-xs text-muted-foreground">Revised Contract Amount</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold">{formatCurrency(totals.balanceToFinish)}</div>
            <p className="text-xs text-muted-foreground">Balance to Finish</p>
          </Card>
        </div>

        {/* Status Overview */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status Overview</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusBadge status={status} type="commitment" />
                  <span className="text-sm text-muted-foreground">({count})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <PageToolbar
          onExport={() => console.log('Export commitments')}
          searchPlaceholder="Search commitments..."
        />

        {/* Commitments Table */}
        {isLoading.commitments ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading commitments...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={commitments}
            onRowClick={handleView}
          />
        )}
      </PageContainer>
    </>
  );
}