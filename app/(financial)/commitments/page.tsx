'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommitmentsTable } from '@/components/financial/commitments/commitments-table';
import { StatusBadge } from '@/components/financial/shared/status-badge';
import { useFinancialStore } from '@/lib/stores/financial-store';
import { Commitment } from '@/types/financial';

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
    } catch (error: any) {
      setError('commitments', error.message);
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
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (errors.commitments) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Commitments</h1>
          <p className="text-muted-foreground">
            Manage purchase orders and subcontracts
          </p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground mb-2">Unable to load commitments data</p>
          <p className="text-sm text-gray-500 mb-4">{errors.commitments}</p>
          <Button onClick={fetchCommitments} size="sm">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Commitments</h1>
        <p className="text-muted-foreground">
          Manage purchase orders and subcontracts
        </p>
      </div>

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

      {/* Actions and Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Commitments</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white">
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
            </div>
          </div>

          {isLoading.commitments ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading commitments...</p>
            </div>
          ) : (
            <CommitmentsTable
              commitments={commitments}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}
        </div>
      </Card>
    </div>
  );
}