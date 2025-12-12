'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  User,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';

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
  payments_received: number | null;
  percent_paid: number | null;
  remaining_balance: number | null;
  private: boolean | null;
  attachment_count: number | null;
  notes: string | null;
  created_at: string;
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

interface ChangeOrder {
  id: number;
  project_id: number;
  co_number: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  amount?: number | null;
  executed?: boolean | null;
  submitted_by: string | null;
  submitted_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string | null;
}

interface ChangeEvent {
  id: number;
  project_id: number;
  event_number: string | null;
  title: string;
  reason: string | null;
  scope: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [changeEvents, setChangeEvents] = useState<ChangeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        // Fetch contract
        const { data: contractData, error: contractError } = await supabase
          .from('contracts')
          .select(`
            *,
            client:clients(id, name),
            project:projects(id, name, project_number)
          `)
          .eq('id', parseInt(contractId))
          .single();

        if (contractError) {
          throw new Error(contractError.message);
        }

        setContract(contractData);

        // Fetch change orders for this contract's project
        if (contractData.project_id) {
          const { data: coData, error: coError } = await supabase
            .from('change_orders')
            .select('*')
            .eq('project_id', contractData.project_id)
            .order('co_number', { ascending: true });

          if (!coError) {
            setChangeOrders(coData || []);
          }

          // Fetch change events for this contract's project
          const { data: ceData, error: ceError } = await supabase
            .from('change_events')
            .select('*')
            .eq('project_id', contractData.project_id)
            .order('event_number', { ascending: true });

          if (!ceError) {
            setChangeEvents(ceData || []);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contract');
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchData();
    }
  }, [contractId]);

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
      'pending - in review': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending - In Review' },
      'pending - not proceeding': { bg: 'bg-red-100', text: 'text-red-700', label: 'Pending - Not Proceeding' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      executed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Executed' },
      closed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Closed' },
      void: { bg: 'bg-red-100', text: 'text-red-700', label: 'Void' },
      open: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
    };
    const config = statusConfig[status?.toLowerCase() || 'draft'] || statusConfig.draft;
    return (
      <Badge className={`${config.bg} ${config.text} font-normal`}>
        {config.label}
      </Badge>
    );
  };

  // Calculate totals
  const totals = useMemo(() => {
    if (!contract) return { original: 0, approved: 0, revised: 0, pending: 0, draft: 0, invoiced: 0 };

    const original = contract.original_contract_amount || 0;
    const approved = contract.approved_change_orders || 0;
    const pending = contract.pending_change_orders || 0;
    const draft = contract.draft_change_orders || 0;
    const invoiced = contract.invoiced_amount || 0;

    return {
      original,
      approved,
      revised: original + approved,
      pending,
      draft,
      invoiced,
    };
  }, [contract]);

  // Calculate change order statistics
  const coStats = useMemo(() => {
    const approved = changeOrders.filter(co => co.status?.toLowerCase() === 'approved').length;
    const pending = changeOrders.filter(co => co.status?.toLowerCase() === 'pending').length;
    const draft = changeOrders.filter(co => co.status?.toLowerCase() === 'draft').length;
    return { approved, pending, draft, total: changeOrders.length };
  }, [changeOrders]);

  // Calculate change event statistics
  const ceStats = useMemo(() => {
    const approved = changeEvents.filter(ce => ce.status?.toLowerCase() === 'approved').length;
    const pending = changeEvents.filter(ce => ce.status?.toLowerCase() === 'pending').length;
    const draft = changeEvents.filter(ce => ce.status?.toLowerCase() === 'draft').length;
    return { approved, pending, draft, total: changeEvents.length };
  }, [changeEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading contract...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || 'Contract not found'}</p>
        <Button onClick={() => router.push('/contracts')}>Back to Contracts</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/contracts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {contract.contract_number || `Contract #${contract.id}`}
                </h1>
                <p className="text-sm text-gray-500">{contract.title || contract.notes || 'Prime Contract'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Original Amount</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.original)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Approved COs</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.approved)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Revised Amount</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.revised)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Pending COs</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.pending)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Draft COs</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.draft)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Invoiced</p>
              <p className="text-xl font-semibold">{formatCurrency(totals.invoiced)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="change-orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Contract Details</TabsTrigger>
            <TabsTrigger value="change-events">
              Change Events ({ceStats.total})
            </TabsTrigger>
            <TabsTrigger value="change-orders">
              Change Orders ({coStats.total})
            </TabsTrigger>
          </TabsList>

          {/* Contract Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Owner/Client</p>
                      <Link href={`/clients/${contract.client_id}`} className="text-blue-600 hover:underline">
                        {contract.client?.name || '--'}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Project</p>
                      <p className="text-gray-900">
                        {contract.project?.name || contract.project?.project_number || '--'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      {getStatusBadge(contract.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-gray-900">
                        {new Date(contract.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Executed</p>
                      <p className="text-gray-900">{contract.executed ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">ERP Status</p>
                      <p className="text-gray-900">{contract.erp_status || '-- Not Ready'}</p>
                    </div>
                  </div>
                </div>

                {contract.notes && (
                  <div className="col-span-2 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{contract.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Events Tab */}
          <TabsContent value="change-events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Change Events</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Initial triggers for potential changes (field conditions, owner requests, RFIs)
                  </p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Change Event
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Event #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Reason</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {changeEvents.length > 0 ? (
                        changeEvents.map((ce) => (
                          <tr key={ce.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <Link
                                href={`/change-events/${ce.id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {ce.event_number || `CE-${ce.id}`}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <Link
                                href={`/change-events/${ce.id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {ce.title}
                              </Link>
                            </td>
                            <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                              {ce.reason || '--'}
                            </td>
                            <td className="py-3 px-4">{getStatusBadge(ce.status)}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {ce.created_at ? new Date(ce.created_at).toLocaleDateString() : '--'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            No change events for this contract
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Orders Tab */}
          <TabsContent value="change-orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Potential Change Orders (PCO)</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Change events rolled up into formal change orders for pricing and approval
                  </p>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Change Order
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">CO #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Approved At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {changeOrders.length > 0 ? (
                        changeOrders.map((co) => (
                          <tr key={co.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <Link
                                href={`/change-orders/${co.id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {co.co_number || `PCO-${co.id}`}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <Link
                                href={`/change-orders/${co.id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {co.title || `Change Order #${co.id}`}
                              </Link>
                            </td>
                            <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                              {co.description || '--'}
                            </td>
                            <td className="py-3 px-4">{getStatusBadge(co.status)}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency(co.amount)}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {co.approved_at ? new Date(co.approved_at).toLocaleDateString() : '--'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            No change orders for this contract
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
