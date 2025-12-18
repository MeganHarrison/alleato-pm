'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useContracts } from '@/hooks/use-contracts';
import { useCommitments } from '@/hooks/use-commitments';
import { PageHeader, PageContainer } from '@/components/layout';

interface LineItem {
  id: string;
  description: string;
  costCode: string;
  amount: string;
  notes: string;
}

interface ChangeOrderData {
  id: string;
  number: string;
  title: string;
  description?: string;
  status: string;
  amount: number;
  commitment_id: string;
  change_event_id: string;
  executed_date?: string;
  commitment?: {
    id: string;
    number: string;
    title: string;
  };
  change_event?: {
    id: string;
    number: string;
    title: string;
  };
}

export default function EditChangeOrderPage() {
  const router = useRouter();
  const params = useParams();
  const changeOrderId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data hooks for contracts and commitments
  const { contracts, options: contractOptions, isLoading: contractsLoading } = useContracts();
  const { commitments, options: commitmentOptions, isLoading: commitmentsLoading } = useCommitments();

  // Form state
  const [changeOrderData, setChangeOrderData] = useState({
    changeOrderNumber: '',
    contractId: '',
    contractType: 'commitment' as 'prime' | 'commitment',
    title: '',
    status: 'draft',
    dueDate: null as Date | null,
    receivedDate: null as Date | null,
    description: '',
    changeReason: '',
    scheduleImpact: '0',
    totalAmount: '0.00',
    changeEventId: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: '',
      costCode: '',
      amount: '',
      notes: '',
    },
  ]);

  // Fetch change order data
  useEffect(() => {
    const fetchChangeOrder = async () => {
      try {
        setFetching(true);
        const response = await fetch(`/api/change-orders/${changeOrderId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch change order');
        }

        const data: ChangeOrderData = await response.json();

        // Populate form with fetched data
        setChangeOrderData({
          changeOrderNumber: data.number || '',
          contractId: data.commitment_id || '',
          contractType: 'commitment',
          title: data.title || '',
          status: data.status || 'draft',
          dueDate: data.executed_date ? parseISO(data.executed_date) : null,
          receivedDate: null,
          description: data.description || '',
          changeReason: '',
          scheduleImpact: '0',
          totalAmount: data.amount?.toString() || '0.00',
          changeEventId: data.change_event_id || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch change order');
      } finally {
        setFetching(false);
      }
    };

    if (changeOrderId) {
      fetchChangeOrder();
    }
  }, [changeOrderId]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: '',
        costCode: '',
        amount: '',
        notes: '',
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));

    // Recalculate total when amount changes
    if (field === 'amount') {
      const total = lineItems.reduce((sum, item) => {
        const amount = item.id === id ? parseFloat(value || '0') : parseFloat(item.amount || '0');
        return sum + amount;
      }, 0);
      setChangeOrderData({ ...changeOrderData, totalAmount: total.toFixed(2) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/change-orders/${changeOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: changeOrderData.changeOrderNumber,
          title: changeOrderData.title,
          description: changeOrderData.description,
          status: changeOrderData.status,
          commitment_id: changeOrderData.contractId,
          change_event_id: changeOrderData.changeEventId,
          amount: parseFloat(changeOrderData.totalAmount),
          executed_date: changeOrderData.dueDate ? format(changeOrderData.dueDate, 'yyyy-MM-dd') : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update change order');
      }

      // Navigate back to change orders list
      router.push('/change-orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update change order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this change order? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/change-orders/${changeOrderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete change order');
      }

      router.push('/change-orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete change order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/change-orders');
  };

  if (fetching) {
    return (
      <>
        <PageHeader
          title="Edit Change Order"
          description="Loading change order details..."
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          }
        />
        <PageContainer>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </PageContainer>
      </>
    );
  }

  if (error && !changeOrderData.changeOrderNumber) {
    return (
      <>
        <PageHeader
          title="Edit Change Order"
          description="Error loading change order"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          }
        />
        <PageContainer>
          <Card className="p-6">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => router.push('/change-orders')} className="mt-4">
              Return to Change Orders
            </Button>
          </Card>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Change Order"
        description={`Editing change order ${changeOrderData.changeOrderNumber}`}
        breadcrumbs={[
          { label: 'Financial', href: '/financial' },
          { label: 'Change Orders', href: '/change-orders' },
          { label: `Edit ${changeOrderData.changeOrderNumber}` },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        }
      />

      <PageContainer>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="line-items">Line Items</TabsTrigger>
              <TabsTrigger value="schedule">Schedule Impact</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Basic change order details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="changeOrderNumber">Change Order Number*</Label>
                      <Input
                        id="changeOrderNumber"
                        value={changeOrderData.changeOrderNumber}
                        onChange={(e) => setChangeOrderData({ ...changeOrderData, changeOrderNumber: e.target.value })}
                        placeholder="CO-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={changeOrderData.status}
                        onValueChange={(value) => setChangeOrderData({ ...changeOrderData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="executed">Executed</SelectItem>
                          <SelectItem value="void">Void</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Change Order Title*</Label>
                    <Input
                      id="title"
                      value={changeOrderData.title}
                      onChange={(e) => setChangeOrderData({ ...changeOrderData, title: e.target.value })}
                      placeholder="Additional work for..."
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contractType">Contract Type*</Label>
                      <Select
                        value={changeOrderData.contractType}
                        onValueChange={(value: 'prime' | 'commitment') => setChangeOrderData({ ...changeOrderData, contractType: value, contractId: '' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prime">Prime Contract</SelectItem>
                          <SelectItem value="commitment">Commitment/Subcontract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractId">
                        {changeOrderData.contractType === 'prime' ? 'Contract*' : 'Commitment*'}
                      </Label>
                      <Select
                        value={changeOrderData.contractId}
                        onValueChange={(value) => setChangeOrderData({ ...changeOrderData, contractId: value })}
                        disabled={changeOrderData.contractType === 'prime' ? contractsLoading : commitmentsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              changeOrderData.contractType === 'prime'
                                ? (contractsLoading ? 'Loading contracts...' : 'Select contract')
                                : (commitmentsLoading ? 'Loading commitments...' : 'Select commitment')
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {changeOrderData.contractType === 'prime' ? (
                            contractOptions.length > 0 ? (
                              contractOptions.map((contract) => (
                                <SelectItem key={contract.value} value={contract.value}>
                                  {contract.label}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No contracts found
                              </div>
                            )
                          ) : (
                            commitmentOptions.length > 0 ? (
                              commitmentOptions.map((commitment) => (
                                <SelectItem key={commitment.value} value={commitment.value}>
                                  {commitment.label}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No commitments found
                              </div>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="changeReason">Reason for Change</Label>
                    <Textarea
                      id="changeReason"
                      value={changeOrderData.changeReason}
                      onChange={(e) => setChangeOrderData({ ...changeOrderData, changeReason: e.target.value })}
                      placeholder="Explain the reason for this change order..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="line-items">
              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                  <CardDescription>Line items for this change order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Description</TableHead>
                          <TableHead className="w-[20%]">Cost Code</TableHead>
                          <TableHead className="w-[20%]">Amount</TableHead>
                          <TableHead className="w-[15%]">Notes</TableHead>
                          <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                placeholder="Item description"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.costCode}
                                onChange={(e) => updateLineItem(item.id, 'costCode', e.target.value)}
                                placeholder="01-000"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.amount}
                                onChange={(e) => updateLineItem(item.id, 'amount', e.target.value)}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.notes}
                                onChange={(e) => updateLineItem(item.id, 'notes', e.target.value)}
                                placeholder="Notes"
                              />
                            </TableCell>
                            <TableCell>
                              {lineItems.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLineItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" onClick={addLineItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Line Item
                    </Button>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold">${changeOrderData.totalAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Information</CardTitle>
                  <CardDescription>Impact on project timeline</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Executed Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !changeOrderData.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {changeOrderData.dueDate ? format(changeOrderData.dueDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={changeOrderData.dueDate ?? undefined}
                            onSelect={(date) => setChangeOrderData({ ...changeOrderData, dueDate: date ?? null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Received Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !changeOrderData.receivedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {changeOrderData.receivedDate ? format(changeOrderData.receivedDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={changeOrderData.receivedDate ?? undefined}
                            onSelect={(date) => setChangeOrderData({ ...changeOrderData, receivedDate: date ?? null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduleImpact">Schedule Impact (Days)</Label>
                    <Input
                      id="scheduleImpact"
                      type="number"
                      value={changeOrderData.scheduleImpact}
                      onChange={(e) => setChangeOrderData({ ...changeOrderData, scheduleImpact: e.target.value })}
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500">
                      Enter the number of days this change will impact the project schedule
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>Detailed description and documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={changeOrderData.description}
                      onChange={(e) => setChangeOrderData({ ...changeOrderData, description: e.target.value })}
                      placeholder="Provide a detailed description of the change order..."
                      rows={10}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </PageContainer>
    </>
  );
}
