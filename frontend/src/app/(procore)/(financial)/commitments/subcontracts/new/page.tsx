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
import { ArrowLeft, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

export default function NewSubcontractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [subcontractData, setSubcontractData] = useState({
    contractNumber: 'SC-018',
    contractCompany: '',
    title: '',
    status: 'draft',
    executed: false,
    retentionPercentage: '0',
    description: '',
    inclusions: '',
    exclusions: '',
    attachments: [] as File[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to create subcontract
      console.log('Creating subcontract:', subcontractData);
      
      // Navigate back to commitments list
      router.push('/commitments');
    } catch (error) {
      console.error('Error creating subcontract:', error);
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
        <h1 className="text-2xl font-bold">Create Subcontract</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions & Exclusions</TabsTrigger>
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
                      value={subcontractData.contractNumber}
                      onChange={(e) => setSubcontractData({ ...subcontractData, contractNumber: e.target.value })}
                      placeholder="Enter contract number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractCompany">Contract Company</Label>
                    <Select
                      value={subcontractData.contractCompany}
                      onValueChange={(value) => setSubcontractData({ ...subcontractData, contractCompany: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electric-contractor">ABC Electric Contractors</SelectItem>
                        <SelectItem value="plumbing-contractor">XYZ Plumbing Services</SelectItem>
                        <SelectItem value="hvac-contractor">HVAC Solutions Inc</SelectItem>
                        <SelectItem value="concrete-contractor">Concrete Masters LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={subcontractData.title}
                      onChange={(e) => setSubcontractData({ ...subcontractData, title: e.target.value })}
                      placeholder="Enter title"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={subcontractData.status}
                      onValueChange={(value) => setSubcontractData({ ...subcontractData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="out-for-bid">Out for Bid</SelectItem>
                        <SelectItem value="out-for-signature">Out for Signature</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executed">Executed *</Label>
                    <div className="flex items-center h-10">
                      <Checkbox
                        id="executed"
                        checked={subcontractData.executed}
                        onCheckedChange={(checked) => setSubcontractData({ ...subcontractData, executed: checked as boolean })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retainage">Default Retainage</Label>
                    <div className="relative">
                      <Input
                        id="retainage"
                        type="number"
                        value={subcontractData.retentionPercentage}
                        onChange={(e) => setSubcontractData({ ...subcontractData, retentionPercentage: e.target.value })}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={subcontractData.description}
                    onChange={(e) => setSubcontractData({ ...subcontractData, description: e.target.value })}
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
                        setSubcontractData({ ...subcontractData, attachments: [...subcontractData.attachments, ...files] });
                      }}
                    />
                  </div>
                  {subcontractData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {subcontractData.attachments.map((file, index) => (
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

          <TabsContent value="inclusions">
            <Card>
              <CardHeader>
                <CardTitle>Inclusions & Exclusions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inclusions">Inclusions</Label>
                  <Textarea
                    id="inclusions"
                    value={subcontractData.inclusions}
                    onChange={(e) => setSubcontractData({ ...subcontractData, inclusions: e.target.value })}
                    placeholder="List what is included in this subcontract..."
                    rows={6}
                    className="min-h-[150px]"
                  />
                  {/* Rich text editor toolbar placeholder */}
                  <div className="text-xs text-muted-foreground">Use the formatting toolbar above to style your text</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exclusions">Exclusions</Label>
                  <Textarea
                    id="exclusions"
                    value={subcontractData.exclusions}
                    onChange={(e) => setSubcontractData({ ...subcontractData, exclusions: e.target.value })}
                    placeholder="List what is excluded from this subcontract..."
                    rows={6}
                    className="min-h-[150px]"
                  />
                  {/* Rich text editor toolbar placeholder */}
                  <div className="text-xs text-muted-foreground">Use the formatting toolbar above to style your text</div>
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