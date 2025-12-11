"use client"

import * as React from "react"
import { Form } from "@/components/forms/Form"
import { ContractGeneralSection } from "./ContractGeneralSection"
import { ContractBillingSection } from "./ContractBillingSection"
import { ContractDatesSection } from "./ContractDatesSection"
import { ContractPrivacySection } from "./ContractPrivacySection"
import { ScheduleOfValuesGrid } from "./ScheduleOfValuesGrid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface ContractFormData {
  // General Info
  number: string
  title: string
  status: string
  contractCompanyId: string
  executedDate?: Date
  startDate?: Date
  completionDate?: Date
  
  // Financial
  originalAmount: number
  revisedAmount?: number
  retentionPercent?: number
  
  // Schedule of Values
  scheduleOfValues?: Array<{
    id: string
    description: string
    costCode?: string
    scheduledValue: number
    workCompleted: number
    materialsStored: number
    percentComplete: number
  }>
  
  // Privacy
  isPrivate: boolean
  allowedUsers?: string[]
}

interface ContractFormProps {
  initialData?: Partial<ContractFormData>
  onSubmit: (data: ContractFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  mode?: "create" | "edit"
}

export function ContractForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "create",
}: ContractFormProps) {
  const [formData, setFormData] = React.useState<Partial<ContractFormData>>(
    initialData || {}
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData as ContractFormData)
  }

  const updateFormData = (updates: Partial<ContractFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sov">Schedule of Values</TabsTrigger>
          <TabsTrigger value="dates">Dates & Milestones</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <ContractGeneralSection
            data={formData}
            onChange={updateFormData}
          />
        </TabsContent>

        <TabsContent value="sov" className="space-y-6">
          <ScheduleOfValuesGrid
            values={formData.scheduleOfValues || []}
            onChange={(values) => updateFormData({ scheduleOfValues: values })}
          />
        </TabsContent>

        <TabsContent value="dates" className="space-y-6">
          <ContractDatesSection
            data={formData}
            onChange={updateFormData}
          />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <ContractBillingSection
            data={formData}
            onChange={updateFormData}
          />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <ContractPrivacySection
            data={formData}
            onChange={updateFormData}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">Saving...</span>
              <span className="animate-spin">⏳</span>
            </>
          ) : mode === "create" ? (
            "Create Contract"
          ) : (
            "Update Contract"
          )}
        </Button>
      </div>
    </Form>
  )
}