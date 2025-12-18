'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Download, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContainer, PageToolbar, ProjectPageHeader } from '@/components/layout';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MobileFilterModal } from '@/components/tables/MobileFilterModal';
import { Label } from '@/components/ui/label';

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
function ContractChangeOrders({ contract, getStatusBadge }: {
  contract: Contract;
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
      <TableRow>
        <TableCell colSpan={11} className="px-4 py-3 text-center text-gray-500 bg-gray-50">
          Loading change orders...
        </TableCell>
      </TableRow>
    );
  }

  if (changeOrders.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={11} className="px-4 py-3 text-center text-gray-500 bg-gray-50">
          No change orders for this contract
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {changeOrders.map((co) => (
        <TableRow key={co.id} className="bg-blue-50/50 border-b border-gray-100">
          <TableCell className="px-4 py-2" />
          <TableCell className="px-4 py-2 pl-12 text-sm text-gray-600">
            <Link href={`/${contract.project_id}/change-orders/${co.id}`} className="text-blue-600 hover:underline">
              {co.co_number || `PCO-${co.id}`}
            </Link>
          </TableCell>
          <TableCell className="px-4 py-2 text-sm text-gray-600" colSpan={2}>
            {co.title || '--'}
          </TableCell>
          <TableCell className="px-4 py-2 text-sm">{getStatusBadge(co.status)}</TableCell>
          <TableCell className="px-4 py-2 text-sm text-gray-600">{co.approved_at ? 'Yes' : 'No'}</TableCell>
          <TableCell className="px-4 py-2 text-sm text-right">--</TableCell>
          <TableCell className="px-4 py-2 text-sm text-right">--</TableCell>
          <TableCell className="px-4 py-2 text-sm text-right">--</TableCell>
          <TableCell className="px-4 py-2 text-sm text-right">--</TableCell>
          <TableCell className="px-4 py-2 text-sm text-right">--</TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ProjectContractsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.projectId as string, 10);

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchContracts = async () => {
      if (!projectId) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            client:clients!contracts_client_id_fkey(id, name),
            project:projects!contracts_project_id_fkey(id, name, project_number)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching contracts:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else {
          setContracts(data || []);
        }
      } catch (err) {
        console.error('Error fetching contracts (catch):', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [projectId]);

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

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const matchesSearch =
        !searchTerm ||
        contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contract_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (contract.status || '').toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  const totals = filteredContracts.reduce(
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
    <>
      <ProjectPageHeader
        title="Prime Contracts"
        description="Manage prime contracts and owner agreements"
        actions={
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => router.push(`/${projectId}/contracts/new`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        }
      />

      <PageContainer className="space-y-6">
        <Card className="border bg-white shadow-sm">
          <PageToolbar
            searchPlaceholder="Search contracts or clients..."
            onSearch={setSearchTerm}
            filters={
              <div className="flex items-center gap-2">
                <div className="hidden md:block">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="executed">Executed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="void">Void</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <MobileFilterModal
                  className="md:hidden"
                  hasActiveFilters={statusFilter !== 'all'}
                  onReset={() => setStatusFilter('all')}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="executed">Executed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="void">Void</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </MobileFilterModal>
              </div>
            }
            actions={
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            }
          />
        </Card>

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
        <Card className="border bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading contracts...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No contracts found</p>
              <Button onClick={() => router.push(`/${projectId}/contracts/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first contract
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-10">
                      <span className="sr-only">Expand</span>
                    </TableHead>
                    <TableHead>#</TableHead>
                    <TableHead>Owner/Client</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Executed</TableHead>
                    <TableHead className="text-right">Original Amount</TableHead>
                    <TableHead className="text-right">Approved COs</TableHead>
                    <TableHead className="text-right">Pending COs</TableHead>
                    <TableHead className="text-right">Draft COs</TableHead>
                    <TableHead className="text-right">Revised Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const isExpanded = expandedRows.has(contract.id);
                    const revised = (contract.original_contract_amount || 0) + (contract.approved_change_orders || 0);

                    return (
                      <Fragment key={contract.id}>
                        <TableRow
                          className={cn(
                            'border-b hover:bg-gray-50 cursor-pointer',
                            isExpanded && 'bg-blue-50'
                          )}
                          onClick={() => toggleRow(contract.id)}
                        >
                          <TableCell>
                            <button
                              type="button"
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
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/${projectId}/contracts/${contract.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contract.contract_number || contract.id}
                            </Link>
                          </TableCell>
                          <TableCell>{contract.client?.name || '--'}</TableCell>
                          <TableCell>
                            <Link
                              href={`/${projectId}/contracts/${contract.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contract.title || contract.project?.name || 'Prime Contract'}
                            </Link>
                          </TableCell>
                          <TableCell>{getStatusBadge(contract.status)}</TableCell>
                          <TableCell>{contract.executed ? 'Yes' : 'No'}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(contract.original_contract_amount)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(contract.approved_change_orders)}
                          </TableCell>
                          <TableCell className="text-right text-yellow-600">
                            {formatCurrency(contract.pending_change_orders)}
                          </TableCell>
                          <TableCell className="text-right text-gray-500">
                            {formatCurrency(contract.draft_change_orders)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(revised)}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <ContractChangeOrders
                            contract={contract}
                            getStatusBadge={getStatusBadge}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
                <tfoot>
                  <TableRow className="bg-gray-100 font-medium">
                    <TableCell colSpan={6}>Grand Totals</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.original)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(totals.approved)}</TableCell>
                    <TableCell className="text-right text-yellow-600">{formatCurrency(totals.pending)}</TableCell>
                    <TableCell className="text-right text-gray-500">{formatCurrency(totals.draft)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.revised)}</TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>
          )}
        </Card>
      </PageContainer>
    </>
  );
}
