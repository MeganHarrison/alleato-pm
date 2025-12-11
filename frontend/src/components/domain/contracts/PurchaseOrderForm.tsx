"use client"

import * as React from "react"
import { Form } from "@/components/forms/Form"
import { FormSection } from "@/components/forms/FormSection"
import { TextField } from "@/components/forms/TextField"
import { SelectField } from "@/components/forms/SelectField"
import { DateField } from "@/components/forms/DateField"
import { NumberField } from "@/components/forms/NumberField"
import { TextareaField } from "@/components/forms/TextareaField"
import { FileUploadField } from "@/components/forms/FileUploadField"
import { ScheduleOfValuesGrid } from "./ScheduleOfValuesGrid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PurchaseOrderFormData {
  number: string
  vendorId: string
  projectId: string
  status: string
  issueDate?: Date
  dueDate?: Date
  amount: number
  description: string
  lineItems?: Array<{
    id: string
    description: string
    costCode?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  attachments?: Array<{
    name: string
    size: number
    type: string
    url?: string
  }>
}

interface PurchaseOrderFormProps {
  initialData?: Partial<PurchaseOrderFormData>
  onSubmit: (data: PurchaseOrderFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function PurchaseOrderForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = React.useState<Partial<PurchaseOrderFormData>>(
    initialData || {}
  )

  const vendors = [
    { value: "1", label: "ABC Supply Co." },
    { value: "2", label: "Building Materials Inc." },
    { value: "3", label: "Industrial Equipment LLC" },
  ]

  const projects = [
    { value: "1", label: "Downtown Office Building" },
    { value: "2", label: "Riverside Apartments" },
    { value: "3", label: "Shopping Center Renovation" },
  ]

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "pending_approval", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "sent", label: "Sent to Vendor" },
    { value: "acknowledged", label: "Acknowledged" },
    { value: "completed", label: "Completed" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData as PurchaseOrderFormData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <FormSection
            title="Purchase Order Details"
            description="Basic information about this purchase order"
          >
            <TextField
              label="PO Number"
              value={formData.number || ""}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
              placeholder="PO-001"
            />

            <SelectField
              label="Vendor"
              options={vendors}
              value={formData.vendorId}
              onValueChange={(value) => setFormData({ ...formData, vendorId: value })}
              required
            />

            <SelectField
              label="Project"
              options={projects}
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              required
            />

            <SelectField
              label="Status"
              options={statuses}
              value={formData.status || "draft"}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            />

            <DateField
              label="Issue Date"
              value={formData.issueDate}
              onChange={(date) => setFormData({ ...formData, issueDate: date })}
            />

            <DateField
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              required
            />

            <NumberField
              label="Total Amount"
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value || 0 })}
              required
              prefix="$"
              fullWidth
            />

            <TextareaField
              label="Description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter purchase order description..."
              rows={3}
              fullWidth
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <ScheduleOfValuesGrid
            values={[]}
            onChange={() => {}}
          />
        </TabsContent>

        <TabsContent value="attachments" className="space-y-6">
          <FormSection title="Attachments">
            <FileUploadField
              label="Upload Documents"
              value={formData.attachments || []}
              onChange={(files) => setFormData({ ...formData, attachments: files })}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              maxSize={10 * 1024 * 1024} // 10MB
              fullWidth
            />
          </FormSection>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Purchase Order"}
        </Button>
      </div>
    </Form>
  )
}