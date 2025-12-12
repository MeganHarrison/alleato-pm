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
import { ArrowLeft, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function NewBudgetLineItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [budgetItemData, setBudgetItemData] = useState({
    costCode: '',
    description: '',
    budgetGroup: '',
    vendor: '',
    category: 'labor',
    calculationMethod: 'amount',
    quantity: '',
    unit: '',
    unitCost: '',
    amount: '0.00',
    notes: '',
    allowInvoicing: true,
    excludeFromBudget: false,
  });

  const calculateAmount = () => {
    if (budgetItemData.calculationMethod === 'unit') {
      const qty = parseFloat(budgetItemData.quantity) || 0;
      const cost = parseFloat(budgetItemData.unitCost) || 0;
      const amount = qty * cost;
      setBudgetItemData({ ...budgetItemData, amount: amount.toFixed(2) });
    }
  };

  const handleCalculationMethodChange = (value: string) => {
    setBudgetItemData({ ...budgetItemData, calculationMethod: value });
    if (value === 'amount') {
      // Clear unit-related fields when switching to amount
      setBudgetItemData({
        ...budgetItemData,
        calculationMethod: value,
        quantity: '',
        unit: '',
        unitCost: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to create budget line item
      console.log('Creating budget line item:', budgetItemData);
      
      // Navigate back to budget page
      router.push('/budget');
    } catch (error) {
      console.error('Error creating budget line item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/budget');
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
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
            Back to Budget
          </Button>
        </div>
        <h1 className="text-2xl font-bold">Create Budget Line Item</h1>
        <p className="text-gray-600">Add a new line item to the project budget</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="calculation">Calculation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic line item details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="costCode">Cost Code*</Label>
                    <Input
                      id="costCode"
                      value={budgetItemData.costCode}
                      onChange={(e) => setBudgetItemData({ ...budgetItemData, costCode: e.target.value })}
                      placeholder="01-510"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Enter the cost code for this budget item
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetGroup">Budget Group</Label>
                    <Select
                      value={budgetItemData.budgetGroup}
                      onValueChange={(value) => setBudgetItemData({ ...budgetItemData, budgetGroup: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site-work">Site Work</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="masonry">Masonry</SelectItem>
                        <SelectItem value="metals">Metals</SelectItem>
                        <SelectItem value="wood-plastics">Wood & Plastics</SelectItem>
                        <SelectItem value="thermal-moisture">Thermal & Moisture Protection</SelectItem>
                        <SelectItem value="doors-windows">Doors & Windows</SelectItem>
                        <SelectItem value="finishes">Finishes</SelectItem>
                        <SelectItem value="specialties">Specialties</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Input
                    id="description"
                    value={budgetItemData.description}
                    onChange={(e) => setBudgetItemData({ ...budgetItemData, description: e.target.value })}
                    placeholder="Concrete Foundation Work"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select
                      value={budgetItemData.category}
                      onValueChange={(value) => setBudgetItemData({ ...budgetItemData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="subcontract">Subcontract</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Subcontractor</Label>
                    <Select
                      value={budgetItemData.vendor}
                      onValueChange={(value) => setBudgetItemData({ ...budgetItemData, vendor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ABC Construction LLC</SelectItem>
                        <SelectItem value="2">XYZ Electric Co</SelectItem>
                        <SelectItem value="3">Superior Plumbing Inc</SelectItem>
                        <SelectItem value="4">TBD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={budgetItemData.notes}
                    onChange={(e) => setBudgetItemData({ ...budgetItemData, notes: e.target.value })}
                    placeholder="Additional notes or comments..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculation">
            <Card>
              <CardHeader>
                <CardTitle>Calculation Method</CardTitle>
                <CardDescription>How this budget item is calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Calculation Method</Label>
                  <RadioGroup
                    value={budgetItemData.calculationMethod}
                    onValueChange={handleCalculationMethodChange}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="amount" id="amount" />
                      <Label htmlFor="amount">Fixed Amount</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unit" id="unit" />
                      <Label htmlFor="unit">Unit Price (Quantity × Unit Cost)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percent" id="percent" />
                      <Label htmlFor="percent">Percentage of Budget</Label>
                    </div>
                  </RadioGroup>
                </div>

                {budgetItemData.calculationMethod === 'amount' && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Budget Amount*</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={budgetItemData.amount}
                      onChange={(e) => setBudgetItemData({ ...budgetItemData, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                )}

                {budgetItemData.calculationMethod === 'unit' && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity*</Label>
                        <Input
                          id="quantity"
                          type="number"
                          step="0.001"
                          value={budgetItemData.quantity}
                          onChange={(e) => {
                            setBudgetItemData({ ...budgetItemData, quantity: e.target.value });
                            calculateAmount();
                          }}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit*</Label>
                        <Select
                          value={budgetItemData.unit}
                          onValueChange={(value) => setBudgetItemData({ ...budgetItemData, unit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ea">Each (EA)</SelectItem>
                            <SelectItem value="hr">Hour (HR)</SelectItem>
                            <SelectItem value="day">Day (DAY)</SelectItem>
                            <SelectItem value="wk">Week (WK)</SelectItem>
                            <SelectItem value="mo">Month (MO)</SelectItem>
                            <SelectItem value="ls">Lump Sum (LS)</SelectItem>
                            <SelectItem value="sf">Square Foot (SF)</SelectItem>
                            <SelectItem value="lf">Linear Foot (LF)</SelectItem>
                            <SelectItem value="cy">Cubic Yard (CY)</SelectItem>
                            <SelectItem value="ton">Ton (TON)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitCost">Unit Cost*</Label>
                        <Input
                          id="unitCost"
                          type="number"
                          step="0.01"
                          value={budgetItemData.unitCost}
                          onChange={(e) => {
                            setBudgetItemData({ ...budgetItemData, unitCost: e.target.value });
                            calculateAmount();
                          }}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Calculated Amount:</span>
                      <span className="text-2xl font-bold">${budgetItemData.amount}</span>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={calculateAmount}
                      className="w-full"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Recalculate
                    </Button>
                  </div>
                )}

                {budgetItemData.calculationMethod === 'percent' && (
                  <div className="space-y-2">
                    <Label htmlFor="percent">Percentage of Total Budget*</Label>
                    <Input
                      id="percent"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="0.00"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      This will be calculated based on the total project budget
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Line Item Settings</CardTitle>
                <CardDescription>Additional configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowInvoicing">Allow Invoicing</Label>
                    <p className="text-sm text-gray-500">
                      Allow this line item to be included in invoices
                    </p>
                  </div>
                  <Select
                    value={budgetItemData.allowInvoicing ? 'yes' : 'no'}
                    onValueChange={(value) => setBudgetItemData({ ...budgetItemData, allowInvoicing: value === 'yes' })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="excludeFromBudget">Exclude from Budget Totals</Label>
                    <p className="text-sm text-gray-500">
                      Exclude this item from budget calculations
                    </p>
                  </div>
                  <Select
                    value={budgetItemData.excludeFromBudget ? 'yes' : 'no'}
                    onValueChange={(value) => setBudgetItemData({ ...budgetItemData, excludeFromBudget: value === 'yes' })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
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
            {loading ? 'Creating...' : 'Create Line Item'}
          </Button>
        </div>
      </form>
    </div>
  );
}