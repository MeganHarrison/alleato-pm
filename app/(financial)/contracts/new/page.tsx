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
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewPrimeContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [contractData, setContractData] = useState({
    contractNumber: '',
    title: '',
    owner: '',
    architect: '',
    contractDate: null as Date | null,
    startDate: null as Date | null,
    completionDate: null as Date | null,
    status: 'draft',
    contractAmount: '',
    description: '',
    scopeOfWork: '',
    retentionPercentage: '10',
    paymentTerms: 'net30',
    billingMethod: 'percentage',
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
        <p className="text-gray-600">Set up a new contract with the project owner</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="scope">Scope of Work</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic contract details and parties involved</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contractNumber">Contract Number*</Label>
                    <Input
                      id="contractNumber"
                      value={contractData.contractNumber}
                      onChange={(e) => setContractData({ ...contractData, contractNumber: e.target.value })}
                      placeholder="PC-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Contract Title*</Label>
                  <Input
                    id="title"
                    value={contractData.title}
                    onChange={(e) => setContractData({ ...contractData, title: e.target.value })}
                    placeholder="Construction Services Agreement"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner/Client*</Label>
                    <Input
                      id="owner"
                      value={contractData.owner}
                      onChange={(e) => setContractData({ ...contractData, owner: e.target.value })}
                      placeholder="ABC Development Corp"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="architect">Architect</Label>
                    <Input
                      id="architect"
                      value={contractData.architect}
                      onChange={(e) => setContractData({ ...contractData, architect: e.target.value })}
                      placeholder="XYZ Architecture Firm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={contractData.description}
                    onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
                    placeholder="Brief description of the contract..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
                <CardDescription>Contract timeline and key dates</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Contract Date</Label>
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
                    <Label>Start Date*</Label>
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

                  <div className="space-y-2">
                    <Label>Substantial Completion Date*</Label>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>Contract value and payment terms</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contractAmount">Contract Amount*</Label>
                    <Input
                      id="contractAmount"
                      type="number"
                      step="0.01"
                      value={contractData.contractAmount}
                      onChange={(e) => setContractData({ ...contractData, contractAmount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionPercentage">Retention %</Label>
                    <Input
                      id="retentionPercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={contractData.retentionPercentage}
                      onChange={(e) => setContractData({ ...contractData, retentionPercentage: e.target.value })}
                      placeholder="10"
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
                    <Label htmlFor="billingMethod">Billing Method</Label>
                    <Select
                      value={contractData.billingMethod}
                      onValueChange={(value) => setContractData({ ...contractData, billingMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage of Completion</SelectItem>
                        <SelectItem value="milestone">Milestone Based</SelectItem>
                        <SelectItem value="time-materials">Time & Materials</SelectItem>
                        <SelectItem value="unit-price">Unit Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scope">
            <Card>
              <CardHeader>
                <CardTitle>Scope of Work</CardTitle>
                <CardDescription>Define the work to be performed under this contract</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="scopeOfWork">Scope of Work*</Label>
                  <Textarea
                    id="scopeOfWork"
                    value={contractData.scopeOfWork}
                    onChange={(e) => setContractData({ ...contractData, scopeOfWork: e.target.value })}
                    placeholder="Detailed description of work to be performed..."
                    rows={10}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Include all major work items, deliverables, and exclusions
                  </p>
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
            {loading ? 'Creating...' : 'Create Contract'}
          </Button>
        </div>
      </form>
    </div>
  );
}