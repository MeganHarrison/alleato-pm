"use client"

import * as React from "react"
import { Form } from "@/components/forms/Form"
import { TextField } from "@/components/forms/TextField"
import { SelectField } from "@/components/forms/SelectField"
import { NumberField } from "@/components/forms/NumberField"
import { DateField } from "@/components/forms/DateField"
import { RichTextField } from "@/components/forms/RichTextField"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Info, Plus, HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useClients } from "@/hooks/use-clients"
import { useUsers } from "@/hooks/use-users"

// ============================================================================
// Types
// ============================================================================

export interface SOVLineItem {
  id: string
  budgetCode?: string
  description: string
  amount: number
  billedToDate: number
  amountRemaining: number
}

export interface ContractFormData {
  // General Info
  number: string // Contract #
  title: string
  ownerClientId?: string // Owner/Client
  contractorId?: string // Contractor
  architectEngineerId?: string // Architect/Engineer
  status: string
  executed: boolean
  defaultRetainage?: number
  description?: string

  // Contract Dates
  startDate?: Date
  estimatedCompletionDate?: Date
  substantialCompletionDate?: Date
  actualCompletionDate?: Date
  signedContractReceivedDate?: Date
  contractTerminationDate?: Date

  // Schedule of Values
  sovItems?: SOVLineItem[]
  accountingMethod?: 'amount' | 'unit_quantity'

  // Inclusions & Exclusions
  inclusions?: string
  exclusions?: string

  // Privacy
  isPrivate: boolean
  allowedUsers?: string[]
  allowedUsersCanSeeSov?: boolean

  // Attachments
  attachments?: Array<{
    id: string
    name: string
    url: string
    size: number
  }>
}

interface ContractFormProps {
  initialData?: Partial<ContractFormData>
  onSubmit: (data: ContractFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  mode?: "create" | "edit"
  projectId?: string
}

// ============================================================================
// Constants
// ============================================================================

const CONTRACT_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "out_for_signature", label: "Out for Signature" },
  { value: "approved", label: "Approved" },
  { value: "complete", label: "Complete" },
  { value: "void", label: "Void" },
]

// ============================================================================
// Main Component
// ============================================================================

export function ContractForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "create",
}: ContractFormProps) {
  const [formData, setFormData] = React.useState<Partial<ContractFormData>>({
    accountingMethod: 'amount',
    sovItems: [],
    ...initialData,
  })

  // Data hooks
  const { options: clientOptions, isLoading: clientsLoading, createClient } = useClients()
  const { options: userOptions } = useUsers()

  // State for "Add New Client" dialog
  const [showAddClient, setShowAddClient] = React.useState(false)
  const [newClientName, setNewClientName] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData as ContractFormData)
  }

  const updateFormData = (updates: Partial<ContractFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return

    setIsCreating(true)
    const newClient = await createClient({
      name: newClientName.trim(),
      status: 'active',
    })

    if (newClient) {
      updateFormData({ ownerClientId: newClient.id.toString() })
      setNewClientName("")
      setShowAddClient(false)
    }
    setIsCreating(false)
  }

  // SOV handlers
  const addSOVLine = () => {
    const newLine: SOVLineItem = {
      id: `sov-${Date.now()}`,
      description: "",
      amount: 0,
      billedToDate: 0,
      amountRemaining: 0,
    }
    updateFormData({ sovItems: [...(formData.sovItems || []), newLine] })
  }

  const updateSOVLine = (id: string, updates: Partial<SOVLineItem>) => {
    const items = formData.sovItems || []
    updateFormData({
      sovItems: items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })
  }

  const removeSOVLine = (id: string) => {
    const items = formData.sovItems || []
    updateFormData({ sovItems: items.filter((item) => item.id !== id) })
  }

  // Calculate SOV totals
  const sovTotals = React.useMemo(() => {
    const items = formData.sovItems || []
    return {
      amount: items.reduce((sum, item) => sum + (item.amount || 0), 0),
      billedToDate: items.reduce((sum, item) => sum + (item.billedToDate || 0), 0),
      amountRemaining: items.reduce((sum, item) => sum + ((item.amount || 0) - (item.billedToDate || 0)), 0),
    }
  }, [formData.sovItems])

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {/* ================================================================ */}
      {/* GENERAL INFORMATION */}
      {/* ================================================================ */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Row 1: Contract #, Owner/Client, Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label="Contract #"
              value={formData.number || ""}
              onChange={(e) => updateFormData({ number: e.target.value })}
              placeholder="2"
            />

            <div className="space-y-2">
              <Label>Owner/Client</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.ownerClientId}
                  onValueChange={(value) => updateFormData({ ownerClientId: value })}
                  disabled={clientsLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Add new client">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>
                        Create a new client/owner for contracts.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="client-name">Client Name *</Label>
                      <Input
                        id="client-name"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Enter client name"
                        className="mt-2"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddClient(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateClient} disabled={!newClientName.trim() || isCreating}>
                        {isCreating ? "Creating..." : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TextField
              label="Title"
              value={formData.title || ""}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="Enter title"
            />
          </div>

          {/* Row 2: Status, Executed, Default Retainage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Status"
              options={CONTRACT_STATUSES}
              value={formData.status || "draft"}
              onValueChange={(value) => updateFormData({ status: value })}
              required
            />

            <div className="space-y-2">
              <Label>
                Executed <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center h-10">
                <Checkbox
                  id="executed"
                  checked={formData.executed || false}
                  onCheckedChange={(checked) => updateFormData({ executed: checked === true })}
                />
                <Label htmlFor="executed" className="ml-2 text-sm font-normal">
                  Contract is executed
                </Label>
              </div>
            </div>

            <NumberField
              label="Default Retainage"
              value={formData.defaultRetainage}
              onChange={(value) => updateFormData({ defaultRetainage: value })}
              suffix="%"
              placeholder=""
              min={0}
              max={100}
            />
          </div>

          {/* Row 3: Contractor, Architect/Engineer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Contractor"
              options={clientOptions}
              value={formData.contractorId}
              onValueChange={(value) => updateFormData({ contractorId: value })}
              placeholder="Select contractor"
              disabled={clientsLoading}
            />

            <SelectField
              label="Architect/Engineer"
              options={clientOptions}
              value={formData.architectEngineerId}
              onValueChange={(value) => updateFormData({ architectEngineerId: value })}
              placeholder="Select architect/engineer"
              disabled={clientsLoading}
            />
          </div>

          {/* Description with rich text */}
          <RichTextField
            label="Description"
            value={formData.description || ""}
            onChange={(value) => updateFormData({ description: value })}
            placeholder="Enter contract description..."
            fullWidth
          />

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Button variant="outline" type="button">
                Attach Files
              </Button>
              <p className="text-sm text-muted-foreground mt-2">or Drag & Drop</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================ */}
      {/* SCHEDULE OF VALUES */}
      {/* ================================================================ */}
      <Card>
        <CardContent className="pt-6">
          {/* Accounting Method Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                This contract&apos;s default accounting method is amount-based. To use budget codes with a unit of measure association, select Change to Unit/Quantity.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Change to Unit/Quantity
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Schedule of Values</h3>
            <Select defaultValue="add_group">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Add Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add_group">Add Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SOV Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-12">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Budget Code
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link to a budget code</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Billed to Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount Remaining</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {(formData.sovItems || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-4xl">🤔</span>
                        </div>
                        <p className="text-lg font-medium text-gray-700">You Have No Line Items Yet</p>
                        <Button onClick={addSOVLine} className="bg-orange-500 hover:bg-orange-600">
                          Add Line
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  formData.sovItems?.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.budgetCode || ""}
                          onChange={(e) => updateSOVLine(item.id, { budgetCode: e.target.value })}
                          placeholder="Budget code"
                          className="h-8"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.description}
                          onChange={(e) => updateSOVLine(item.id, { description: e.target.value })}
                          placeholder="Description"
                          className="h-8"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={item.amount || ""}
                          onChange={(e) => updateSOVLine(item.id, { amount: parseFloat(e.target.value) || 0 })}
                          className="h-8 text-right"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-sm">${item.billedToDate.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm">${(item.amount - item.billedToDate).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSOVLine(item.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={2} className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSOVLine}
                      className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                    >
                      Add Line
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">Total:</td>
                  <td className="px-4 py-3 text-right font-medium">${sovTotals.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">${sovTotals.billedToDate.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">${sovTotals.amountRemaining.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Import dropdown */}
          <div className="mt-4">
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Import" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================ */}
      {/* INCLUSIONS & EXCLUSIONS */}
      {/* ================================================================ */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Inclusions & Exclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextField
            label="Inclusions"
            value={formData.inclusions || ""}
            onChange={(value) => updateFormData({ inclusions: value })}
            placeholder="Enter what is included in contract scope..."
            fullWidth
          />

          <RichTextField
            label="Exclusions"
            value={formData.exclusions || ""}
            onChange={(value) => updateFormData({ exclusions: value })}
            placeholder="Enter what is excluded from contract scope..."
            fullWidth
          />
        </CardContent>
      </Card>

      {/* ================================================================ */}
      {/* CONTRACT DATES */}
      {/* ================================================================ */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Contract Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DateField
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => updateFormData({ startDate: date })}
              placeholder="mm / dd / yyyy"
            />

            <DateField
              label="Estimated Completion Date"
              value={formData.estimatedCompletionDate}
              onChange={(date) => updateFormData({ estimatedCompletionDate: date })}
              placeholder="mm / dd / yyyy"
            />

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>Substantial Completion Date</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Date when work is sufficiently complete for its intended use</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <DateField
                label=""
                value={formData.substantialCompletionDate}
                onChange={(date) => updateFormData({ substantialCompletionDate: date })}
                placeholder="mm / dd / yyyy"
              />
            </div>

            <DateField
              label="Actual Completion Date"
              value={formData.actualCompletionDate}
              onChange={(date) => updateFormData({ actualCompletionDate: date })}
              placeholder="mm / dd / yyyy"
            />

            <DateField
              label="Signed Contract Received Date"
              value={formData.signedContractReceivedDate}
              onChange={(date) => updateFormData({ signedContractReceivedDate: date })}
              placeholder="mm / dd / yyyy"
            />

            <DateField
              label="Contract Termination Date"
              value={formData.contractTerminationDate}
              onChange={(date) => updateFormData({ contractTerminationDate: date })}
              placeholder="mm / dd / yyyy"
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================ */}
      {/* CONTRACT PRIVACY */}
      {/* ================================================================ */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Contract Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Using the privacy setting allows only project admins and the select non-admin users access.
          </p>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="private"
              checked={formData.isPrivate || false}
              onCheckedChange={(checked) => updateFormData({ isPrivate: checked === true })}
            />
            <Label htmlFor="private" className="text-sm font-medium">
              Private
            </Label>
          </div>

          {formData.isPrivate && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div className="space-y-2">
                <Label>Access for Non-Admin Users</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Values" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-sov-access"
                  checked={formData.allowedUsersCanSeeSov || false}
                  onCheckedChange={(checked) => updateFormData({ allowedUsersCanSeeSov: checked === true })}
                />
                <Label htmlFor="allow-sov-access" className="text-sm font-normal">
                  Allow these non-admin users to view the SOV items.
                </Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================================================================ */}
      {/* FORM ACTIONS */}
      {/* ================================================================ */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
          {isSubmitting ? "Creating..." : mode === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </Form>
  )
}
