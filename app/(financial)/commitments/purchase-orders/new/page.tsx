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
import { CalendarIcon, ArrowLeft, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [purchaseOrderData, setPurchaseOrderData] = useState({
    contractNumber: 'PO-005',
    contractCompany: '',
    title: '',
    status: 'draft',
    executed: false,
    retentionPercentage: '0',
    assignedTo: '',
    billToAddress: 'Alleato Group\n8383 Craig St\nIndianapolis, IN 46250',
    shipToAddress: '940 N. Marr Rd\nColumbus, IN',
    paymentTerms: '',
    shipVia: '',
    description: '',
    attachments: [] as File[],
    contractDate: null as Date | null,
    deliveryDate: null as Date | null,
    signedPOReceivedDate: null as Date | null,
    issuedOnDate: null as Date | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to create purchase order
      console.log('Creating purchase order:', purchaseOrderData);
      
      // Navigate back to commitments list
      router.push('/commitments');
    } catch (error) {
      console.error('Error creating purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/commitments');
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
        <h1 className="text-2xl font-bold">Create Purchase Order</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="dates">Important Dates</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contractNumber">Contract #</Label>
                    <Input
                      id="contractNumber"
                      value={purchaseOrderData.contractNumber}
                      onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, contractNumber: e.target.value })}
                      placeholder="Enter contract number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractCompany">Contract Company</Label>
                    <Select
                      value={purchaseOrderData.contractCompany}
                      onValueChange={(value) => setPurchaseOrderData({ ...purchaseOrderData, contractCompany: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supplier-1">ABC Building Supplies</SelectItem>
                        <SelectItem value="supplier-2">Construction Materials Inc</SelectItem>
                        <SelectItem value="supplier-3">Industrial Equipment Co</SelectItem>
                        <SelectItem value="supplier-4">Safety Gear Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={purchaseOrderData.title}
                    onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={purchaseOrderData.status}
                      onValueChange={(value) => setPurchaseOrderData({ ...purchaseOrderData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executed">Executed *</Label>
                    <div className="flex items-center h-10">
                      <Checkbox
                        id="executed"
                        checked={purchaseOrderData.executed}
                        onCheckedChange={(checked) => setPurchaseOrderData({ ...purchaseOrderData, executed: checked as boolean })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retainage">Default Retainage</Label>
                    <div className="relative">
                      <Input
                        id="retainage"
                        type="number"
                        value={purchaseOrderData.retentionPercentage}
                        onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, retentionPercentage: e.target.value })}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select
                      value={purchaseOrderData.assignedTo}
                      onValueChange={(value) => setPurchaseOrderData({ ...purchaseOrderData, assignedTo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user-1">John Smith</SelectItem>
                        <SelectItem value="user-2">Jane Doe</SelectItem>
                        <SelectItem value="user-3">Bob Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="billTo">Bill To</Label>
                    <Textarea
                      id="billTo"
                      value={purchaseOrderData.billToAddress}
                      onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, billToAddress: e.target.value })}
                      placeholder="Enter billing address..."
                      rows={4}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Input
                      id="paymentTerms"
                      value={purchaseOrderData.paymentTerms}
                      onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, paymentTerms: e.target.value })}
                      placeholder="e.g., Net 30"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shipTo">Ship To</Label>
                    <Textarea
                      id="shipTo"
                      value={purchaseOrderData.shipToAddress}
                      onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, shipToAddress: e.target.value })}
                      placeholder="Enter shipping address..."
                      rows={4}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipVia">Ship Via</Label>
                    <Input
                      id="shipVia"
                      value={purchaseOrderData.shipVia}
                      onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, shipVia: e.target.value })}
                      placeholder="e.g., FedEx, UPS, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={purchaseOrderData.description}
                    onChange={(e) => setPurchaseOrderData({ ...purchaseOrderData, description: e.target.value })}
                    placeholder="Enter description..."
                    rows={4}
                    className="min-h-[120px]"
                  />
                  {/* Rich text editor toolbar placeholder */}
                  <div className="text-xs text-muted-foreground">Use the formatting toolbar above to style your text</div>
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      <label htmlFor="file-upload" className="cursor-pointer text-primary hover:underline">
                        Attach Files
                      </label>
                      {' '}or Drag & Drop
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setPurchaseOrderData({ ...purchaseOrderData, attachments: [...purchaseOrderData.attachments, ...files] });
                      }}
                    />
                  </div>
                  {purchaseOrderData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {purchaseOrderData.attachments.map((file, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dates">
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Contract Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !purchaseOrderData.contractDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchaseOrderData.contractDate ? format(purchaseOrderData.contractDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchaseOrderData.contractDate}
                        onSelect={(date) => setPurchaseOrderData({ ...purchaseOrderData, contractDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !purchaseOrderData.deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchaseOrderData.deliveryDate ? format(purchaseOrderData.deliveryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchaseOrderData.deliveryDate}
                        onSelect={(date) => setPurchaseOrderData({ ...purchaseOrderData, deliveryDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Signed Purchase Order Received Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !purchaseOrderData.signedPOReceivedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchaseOrderData.signedPOReceivedDate ? format(purchaseOrderData.signedPOReceivedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchaseOrderData.signedPOReceivedDate}
                        onSelect={(date) => setPurchaseOrderData({ ...purchaseOrderData, signedPOReceivedDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Issued On Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !purchaseOrderData.issuedOnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchaseOrderData.issuedOnDate ? format(purchaseOrderData.issuedOnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchaseOrderData.issuedOnDate}
                        onSelect={(date) => setPurchaseOrderData({ ...purchaseOrderData, issuedOnDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">* Required fields</p>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white">
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}