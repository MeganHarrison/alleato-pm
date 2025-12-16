'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Download,
  Upload,
  ExternalLink,
  MoreVertical,
  Trash2,
} from 'lucide-react';
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
import { toast } from 'sonner';

interface Contract {
  id: number;
  contract_number: string | null;
  title: string;
  status: string | null;
  executed: boolean | null;
  original_contract_amount: number | null;
  revised_contract_amount: number | null;
  approved_change_orders: number | null;
  pending_change_orders: number | null;
  draft_change_orders: number | null;
  invoiced_amount: number | null;
  payments_received: number | null;
  remaining_balance: number | null;
  retention_percentage: number | null;
  percent_paid: number | null;
  notes: string | null;
  private: boolean | null;
  apply_vertical_markup: boolean | null;
  attachment_count: number | null;
  erp_status: string | null;
  created_at: string;
  client_id: number;
  project_id: number;
  client?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
    project_number: string | null;
  };
}

export default function ProjectContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.projectId as string, 10);
  const contractId = parseInt(params.id as string, 10);

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contracts/${contractId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Contract not found');
          } else {
            setError('Failed to load contract');
          }
          return;
        }

        const data = await response.json();
        setContract(data);
      } catch (err) {
        console.error('Error fetching contract:', err);
        setError('Failed to load contract');
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContract();
    }
  }, [contractId]);

  const handleBack = () => {
    router.push(`/${projectId}/contracts`);
  };

  const handleEdit = () => {
    router.push(`/${projectId}/contracts/${contractId}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Contract deleted successfully');
        router.push(`/${projectId}/contracts`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete contract');
      }
    } catch (err) {
      console.error('Error deleting contract:', err);
      toast.error('Failed to delete contract');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadgeVariant = (status: string | null): "default" | "secondary" | "success" | "warning" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'success';
      case 'pending':
      case 'pending_approval':
        return 'warning';
      case 'draft':
        return 'secondary';
      case 'complete':
      case 'completed':
        return 'default';
      case 'void':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 mt-6" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="container mx-auto py-10 max-w-6xl">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contracts
        </Button>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>{error || 'Contract not found'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const changeOrdersTotal = (contract.approved_change_orders || 0) +
    (contract.pending_change_orders || 0) +
    (contract.draft_change_orders || 0);

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{contract.title}</h1>
              <Badge variant={getStatusBadgeVariant(contract.status)}>
                {contract.status || 'Draft'}
              </Badge>
              {contract.executed && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Executed
                </Badge>
              )}
              {contract.private && (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {contract.contract_number && `#${contract.contract_number} · `}
              {contract.client?.name || 'No client assigned'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View in ERP
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Original Amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(contract.original_contract_amount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revised Amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(contract.revised_contract_amount || contract.original_contract_amount)}
            </p>
            {contract.revised_contract_amount && contract.original_contract_amount && (
              <p className={`text-sm ${
                contract.revised_contract_amount > contract.original_contract_amount
                  ? 'text-green-600'
                  : contract.revised_contract_amount < contract.original_contract_amount
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              }`}>
                {contract.revised_contract_amount > contract.original_contract_amount ? '+' : ''}
                {formatCurrency(contract.revised_contract_amount - contract.original_contract_amount)} from original
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Change Orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{changeOrdersTotal}</p>
            <div className="flex gap-2 mt-1 text-xs">
              <span className="text-green-600">{contract.approved_change_orders || 0} approved</span>
              <span className="text-amber-600">{contract.pending_change_orders || 0} pending</span>
              <span className="text-gray-500">{contract.draft_change_orders || 0} draft</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Remaining Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(contract.remaining_balance)}
            </p>
            {contract.percent_paid !== null && (
              <p className="text-sm text-muted-foreground">
                {contract.percent_paid?.toFixed(1)}% paid
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
          <TabsTrigger value="change-orders">Change Orders</TabsTrigger>
          <TabsTrigger value="documents">Documents ({contract.attachment_count || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Contract Number</h4>
                  <p>{contract.contract_number || '-'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                  <Badge variant={getStatusBadgeVariant(contract.status)}>
                    {contract.status || 'Draft'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Client</h4>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p>{contract.client?.name || '-'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Project</h4>
                  <p>
                    {contract.project?.project_number && `${contract.project.project_number} - `}
                    {contract.project?.name || '-'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Created</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(contract.created_at)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Executed</h4>
                  <div className="flex items-center gap-2">
                    {contract.executed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-green-600">Yes</p>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-amber-500" />
                        <p className="text-amber-500">Not yet</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Retention</h4>
                  <p>{contract.retention_percentage ? `${contract.retention_percentage}%` : '-'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Vertical Markup</h4>
                  <p>{contract.apply_vertical_markup ? 'Applied' : 'Not applied'}</p>
                </div>
              </div>

              {contract.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Notes</h4>
                    <p className="whitespace-pre-wrap text-sm">{contract.notes}</p>
                  </div>
                </>
              )}

              {contract.erp_status && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">ERP Status</h4>
                    <Badge variant="outline">{contract.erp_status}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payments</CardTitle>
              <CardDescription>Financial summary for this contract</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Original Contract Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(contract.original_contract_amount)}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Revised Contract Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(contract.revised_contract_amount || contract.original_contract_amount)}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoiced Amount</p>
                    <p className="text-lg font-semibold">{formatCurrency(contract.invoiced_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payments Received</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(contract.payments_received)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Balance</p>
                    <p className="text-lg font-semibold">{formatCurrency(contract.remaining_balance)}</p>
                  </div>
                </div>

                {contract.percent_paid !== null && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Payment Progress</p>
                        <p className="text-sm font-medium">{contract.percent_paid?.toFixed(1)}%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(contract.percent_paid || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {contract.retention_percentage && (
                  <>
                    <Separator />
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Retention</p>
                          <p className="text-sm text-muted-foreground">
                            {contract.retention_percentage}% retention held
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-amber-600">
                          {formatCurrency(
                            ((contract.revised_contract_amount || contract.original_contract_amount || 0) *
                            (contract.retention_percentage / 100))
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="change-orders">
          <Card>
            <CardHeader>
              <CardTitle>Change Orders</CardTitle>
              <CardDescription>
                {changeOrdersTotal} change orders associated with this contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-600">Approved</p>
                  </div>
                  <p className="text-2xl font-bold">{contract.approved_change_orders || 0}</p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-medium text-amber-600">Pending</p>
                  </div>
                  <p className="text-2xl font-bold">{contract.pending_change_orders || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileQuestion className="h-4 w-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-600">Draft</p>
                  </div>
                  <p className="text-2xl font-bold">{contract.draft_change_orders || 0}</p>
                </div>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Change orders list will be displayed here</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push(`/${projectId}/change-orders`)}>
                  View All Change Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    {contract.attachment_count || 0} documents attached to this contract
                  </CardDescription>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
                <p className="text-sm mt-1">Upload contracts, amendments, and supporting documents</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contract? This action cannot be undone.
              {changeOrdersTotal > 0 && (
                <p className="mt-2 text-amber-600">
                  Note: This contract has {changeOrdersTotal} associated change orders that must be deleted first.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
