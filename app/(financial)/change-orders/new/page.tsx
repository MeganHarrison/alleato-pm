'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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

interface LineItem {
  id: string;
  description: string;
  costCode: string;
  amount: string;
  notes: string;
}

export default function NewChangeOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [changeOrderData, setChangeOrderData] = useState({
    changeOrderNumber: '',
    contractId: '',
    contractType: 'prime', // prime or commitment
    title: '',
    status: 'draft',
    dueDate: null as Date | null,
    receivedDate: null as Date | null,
    description: '',
    changeReason: '',
    scheduleImpact: '0',
    totalAmount: '0.00',
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
      // TODO: API call to create change order
      console.log('Creating change order:', { ...changeOrderData, lineItems });
      
      // Navigate back to change orders list
      router.push('/change-orders');
    } catch (error) {
      console.error('Error creating change order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/change-orders');
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <h1 className="text-2xl font-bold">Create Change Order</h1>
        <p className="text-gray-600">Create a new change order for a contract</p>
      </div>

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
                      onValueChange={(value) => setChangeOrderData({ ...changeOrderData, contractType: value })}
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
                    <Label htmlFor="contractId">Contract*</Label>
                    <Select
                      value={changeOrderData.contractId}
                      onValueChange={(value) => setChangeOrderData({ ...changeOrderData, contractId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">PC-001 - Main Construction Contract</SelectItem>
                        <SelectItem value="2">SC-001 - Electrical Subcontract</SelectItem>
                        <SelectItem value="3">SC-002 - Plumbing Subcontract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changeReason">Reason for Change*</Label>
                  <Textarea
                    id="changeReason"
                    value={changeOrderData.changeReason}
                    onChange={(e) => setChangeOrderData({ ...changeOrderData, changeReason: e.target.value })}
                    placeholder="Explain the reason for this change order..."
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="line-items">
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>Add line items for this change order</CardDescription>
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
                    <Label>Due Date</Label>
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
                          selected={changeOrderData.dueDate}
                          onSelect={(date) => setChangeOrderData({ ...changeOrderData, dueDate: date || null })}
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
                          selected={changeOrderData.receivedDate}
                          onSelect={(date) => setChangeOrderData({ ...changeOrderData, receivedDate: date || null })}
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
            {loading ? 'Creating...' : 'Create Change Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}