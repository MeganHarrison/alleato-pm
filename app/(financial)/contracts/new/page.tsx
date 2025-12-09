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
import { CalendarIcon, ArrowLeft, Info, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewPrimeContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [contractData, setContractData] = useState({
    contractNumber: '2',
    title: '',
    owner: '',
    contractor: '',
    architect: '',
    executed: false,
    contractDate: null as Date | null,
    startDate: null as Date | null,
    completionDate: null as Date | null,
    status: 'draft',
    contractAmount: '',
    description: '',
    scopeOfWork: '',
    retentionPercentage: '',
    paymentTerms: 'net30',
    billingMethod: 'amount-based',
    attachments: [] as File[],
    scheduleOfValues: '',
    private: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to create prime contract
      console.log('Creating prime contract:', contractData);
      
      // Navigate back to contracts list
      router.push('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/contracts');
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
        <h1 className="text-2xl font-bold">Create Prime Contract</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="schedule">Schedule of Values</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="contractNumber">Contract #</Label>
                    <Input
                      id="contractNumber"
                      value={contractData.contractNumber}
                      onChange={(e) => setContractData({ ...contractData, contractNumber: e.target.value })}
                      placeholder="Enter contract number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner/Client</Label>
                    <Select
                      value={contractData.owner}
                      onValueChange={(value) => setContractData({ ...contractData, owner: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abc-development">ABC Development Corp</SelectItem>
                        <SelectItem value="xyz-properties">XYZ Properties LLC</SelectItem>
                        <SelectItem value="main-street-llc">Main Street Development LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={contractData.title}
                      onChange={(e) => setContractData({ ...contractData, title: e.target.value })}
                      placeholder="Enter title"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={contractData.status}
                      onValueChange={(value) => setContractData({ ...contractData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="executed">Executed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executed">Executed *</Label>
                    <div className="flex items-center h-10">
                      <Checkbox
                        id="executed"
                        checked={contractData.executed}
                        onCheckedChange={(checked) => setContractData({ ...contractData, executed: checked as boolean })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retainage">Default Retainage</Label>
                    <div className="relative">
                      <Input
                        id="retainage"
                        type="number"
                        value={contractData.retentionPercentage}
                        onChange={(e) => setContractData({ ...contractData, retentionPercentage: e.target.value })}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractor">Contractor</Label>
                  <Select
                    value={contractData.contractor}
                    onValueChange={(value) => setContractData({ ...contractData, contractor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-contractor-1">ABC General Contractors</SelectItem>
                      <SelectItem value="general-contractor-2">BuildRight Construction</SelectItem>
                      <SelectItem value="general-contractor-3">Premier Builders Inc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architect">Architect/Engineer</Label>
                  <Select
                    value={contractData.architect}
                    onValueChange={(value) => setContractData({ ...contractData, architect: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select architect/engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arch-firm-1">Modern Architecture Studio</SelectItem>
                      <SelectItem value="arch-firm-2">Design Build Partners</SelectItem>
                      <SelectItem value="arch-firm-3">Structural Engineering Co</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={contractData.description}
                    onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
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
                      {' '}or Drag &amp; Drop
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setContractData({ ...contractData, attachments: [...contractData.attachments, ...files] });
                      }}
                    />
                  </div>
                  {contractData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {contractData.attachments.map((file, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm">
                    This contract&apos;s default accounting method is amount-based. To use budget codes with a unit of measure association, select{' '}
                    <button
                      type="button"
                      onClick={() => setContractData({ ...contractData, billingMethod: 'unit-quantity' })}
                      className="text-blue-600 hover:underline"
                    >
                      Change to Unit/Quantity
                    </button>.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule of Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Define line items and values for this contract
                  </p>
                  <Button type="button" variant="outline">
                    Add Schedule of Values Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contractDate">Contract Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !contractData.contractDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {contractData.contractDate ? format(contractData.contractDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={contractData.contractDate}
                          onSelect={(date) => setContractData({ ...contractData, contractDate: date || null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !contractData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {contractData.startDate ? format(contractData.startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={contractData.startDate}
                          onSelect={(date) => setContractData({ ...contractData, startDate: date || null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Substantial Completion Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !contractData.completionDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {contractData.completionDate ? format(contractData.completionDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={contractData.completionDate}
                          onSelect={(date) => setContractData({ ...contractData, completionDate: date || null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractAmount">Contract Amount</Label>
                    <Input
                      id="contractAmount"
                      type="number"
                      step="0.01"
                      value={contractData.contractAmount}
                      onChange={(e) => setContractData({ ...contractData, contractAmount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={contractData.paymentTerms}
                      onValueChange={(value) => setContractData({ ...contractData, paymentTerms: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net45">Net 45</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingMethod">Accounting Method</Label>
                    <Select
                      value={contractData.billingMethod}
                      onValueChange={(value) => setContractData({ ...contractData, billingMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accounting method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount-based">Amount Based</SelectItem>
                        <SelectItem value="unit-quantity">Unit/Quantity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Privacy Settings</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private"
                      checked={contractData.private}
                      onCheckedChange={(checked) => setContractData({ ...contractData, private: checked as boolean })}
                    />
                    <label
                      htmlFor="private"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Private - Only admins and users with explicit permissions can view
                    </label>
                  </div>
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