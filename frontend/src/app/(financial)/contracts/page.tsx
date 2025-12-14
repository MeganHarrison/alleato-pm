'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import type { ChangeOrder } from '@/hooks/use-change-orders';

interface Contract {
  id: number;
  contract_number: string | null;
  title: string | null;
  client_id: number;
  project_id: number | null;
  status: string | null;
  erp_status: string | null;
  executed: boolean | null;
  original_contract_amount: number | null;
  approved_change_orders: number | null;
  pending_change_orders: number | null;
  draft_change_orders: number | null;
  revised_contract_amount: number | null;
  invoiced_amount: number | null;
  client?: {
    id: number;
    name: string | null;
  } | null;
  project?: {
    id: number;
    name: string | null;
    project_number: string | null;
  } | null;
}

// Component to fetch and display change orders for a contract
function ContractChangeOrders({ contract, formatCurrency, getStatusBadge }: {
  contract: Contract;
  formatCurrency: (amount: number | null | undefined) => string;
  getStatusBadge: (status: string | null) => React.ReactNode;
}) {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangeOrders = async () => {
      if (!contract.project_id) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('change_orders')
          .select('*')
          .eq('project_id', contract.project_id)
          .order('co_number', { ascending: true });

        if (!error) {
          setChangeOrders(data || []);
        }
      } catch (err) {
        console.error('Error fetching change orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeOrders();
  }, [contract.project_id]);

  if (loading) {
    return (
      <tr>
        <td colSpan={11} className="px-4 py-3 text-center text-gray-500 bg-gray-50">
          Loading change orders...
        </td>
      </tr>
    );
  }

  if (changeOrders.length === 0) {
    return (
      <tr>
        <td colSpan={11} className="px-4 py-3 text-center text-gray-500 bg-gray-50">
          No change orders for this contract
        </td>
      </tr>
    );
  }

  return (
    <>
      {changeOrders.map((co) => (
        <tr key={co.id} className="bg-blue-50/50 border-b border-gray-100">
          <td className="px-4 py-2"></td>
          <td className="px-4 py-2 pl-12 text-sm text-gray-600">
            <Link href={`/change-orders/${co.id}`} className="text-blue-600 hover:underline">
              {co.co_number || `PCO-${co.id}`}
            </Link>
          </td>
          <td className="px-4 py-2 text-sm text-gray-600" colSpan={2}>
            {co.title || '--'}
          </td>
          <td className="px-4 py-2 text-sm">{getStatusBadge(co.status)}</td>
          <td className="px-4 py-2 text-sm text-gray-600">{co.executed ? 'Yes' : 'No'}</td>
          <td className="px-4 py-2 text-sm text-right">{formatCurrency(co.amount)}</td>
          <td className="px-4 py-2 text-sm text-right">--</td>
          <td className="px-4 py-2 text-sm text-right">--</td>
          <td className="px-4 py-2 text-sm text-right">--</td>
          <td className="px-4 py-2 text-sm text-right">{formatCurrency(co.amount)}</td>
        </tr>
      ))}
    </>
  );
}

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            client:clients(id, name),
            project:projects(id, name, project_number)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching contracts:', error);
        } else {
          setContracts(data || []);
        }
      } catch (err) {
        console.error('Error fetching contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const toggleRow = useCallback((contractId: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(contractId)) {
        next.delete(contractId);
      } else {
        next.add(contractId);
      }
      return next;
    });
  }, []);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      executed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Executed' },
      closed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Closed' },
      void: { bg: 'bg-red-100', text: 'text-red-700', label: 'Void' },
    };
    const config = statusConfig[status?.toLowerCase() || 'draft'] || statusConfig.draft;
    return (
      <Badge className={`${config.bg} ${config.text} font-normal`}>
        {config.label}
      </Badge>
    );
  };

  // Calculate totals
  const totals = contracts.reduce(
    (acc, contract) => ({
      original: acc.original + (contract.original_contract_amount || 0),
      approved: acc.approved + (contract.approved_change_orders || 0),
      pending: acc.pending + (contract.pending_change_orders || 0),
      draft: acc.draft + (contract.draft_change_orders || 0),
      revised: acc.revised + (contract.revised_contract_amount || 0),
      invoiced: acc.invoiced + (contract.invoiced_amount || 0),
    }),
    { original: 0, approved: 0, pending: 0, draft: 0, revised: 0, invoiced: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Prime Contracts</h1>
          <p className="text-muted-foreground text-sm">
            Manage prime contracts and owner agreements
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="p-4">
            <div className="text-xl font-bold">{formatCurrency(totals.original)}</div>
            <p className="text-xs text-muted-foreground">Original Contract Amount</p>
          </Card>
          <Card className="p-4">
            <div className="text-xl font-bold text-green-600">{formatCurrency(totals.approved)}</div>
            <p className="text-xs text-muted-foreground">Approved Change Orders</p>
          </Card>
          <Card className="p-4">
            <div className="text-xl font-bold">{formatCurrency(totals.original + totals.approved)}</div>
            <p className="text-xs text-muted-foreground">Revised Contract Amount</p>
          </Card>
          <Card className="p-4">
            <div className="text-xl font-bold text-yellow-600">{formatCurrency(totals.pending)}</div>
            <p className="text-xs text-muted-foreground">Pending Change Orders</p>
          </Card>
        </div>

        {/* Contracts Table */}
        <Card>
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">All Contracts</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => router.push('/contract-form')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Contract
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading contracts...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No contracts found</p>
              <Button onClick={() => router.push('/contract-form')}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first contract
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="w-10 px-4 py-3"></th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Owner/Client</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Executed</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Original Amount</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Approved COs</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Pending COs</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Draft COs</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Revised Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => {
                    const isExpanded = expandedRows.has(contract.id);
                    const revised = (contract.original_contract_amount || 0) + (contract.approved_change_orders || 0);

                    return (
                      <>
                        <tr
                          key={contract.id}
                          className={`border-b hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                          onClick={() => toggleRow(contract.id)}
                        >
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(contract.id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/contracts/${contract.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contract.contract_number || contract.id}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            {contract.client?.name || '--'}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/contracts/${contract.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contract.title || contract.project?.name || 'Prime Contract'}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(contract.status)}
                          </td>
                          <td className="px-4 py-3">
                            {contract.executed ? 'Yes' : 'No'}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(contract.original_contract_amount)}
                          </td>
                          <td className="px-4 py-3 text-right text-green-600">
                            {formatCurrency(contract.approved_change_orders)}
                          </td>
                          <td className="px-4 py-3 text-right text-yellow-600">
                            {formatCurrency(contract.pending_change_orders)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">
                            {formatCurrency(contract.draft_change_orders)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(revised)}
                          </td>
                        </tr>
                        {isExpanded && (
                          <ContractChangeOrders
                            contract={contract}
                            formatCurrency={formatCurrency}
                            getStatusBadge={getStatusBadge}
                          />
                        )}
                      </>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-medium">
                    <td className="px-4 py-3" colSpan={6}>
                      Grand Totals
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(totals.original)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatCurrency(totals.approved)}</td>
                    <td className="px-4 py-3 text-right text-yellow-600">{formatCurrency(totals.pending)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatCurrency(totals.draft)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(totals.original + totals.approved)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
