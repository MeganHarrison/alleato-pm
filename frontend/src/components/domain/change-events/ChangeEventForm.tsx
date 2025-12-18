"use client"

import * as React from "react"

import { DevAutoFillButton } from "@/hooks/use-dev-autofill"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/forms/Form"

import { ChangeEventGeneralSection } from "./ChangeEventGeneralSection"

export interface ChangeEventFormData {
  // General Info
  number: string
  title: string
  status: string
  origin?: string
  type?: string
  changeReason?: string
  scope?: string

  // Optional fields
  description?: string
  notes?: string
  estimatedImpact?: number
}

interface ChangeEventFormProps {
  initialData?: Partial<ChangeEventFormData>
  onSubmit: (data: ChangeEventFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  mode?: "create" | "edit"
  projectId: number
}

export function ChangeEventForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "create",
  projectId,
}: ChangeEventFormProps) {
  const [formData, setFormData] = React.useState<Partial<ChangeEventFormData>>(
    initialData || {}
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData as ChangeEventFormData)
  }

  const updateFormData = (updates: Partial<ChangeEventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <ChangeEventGeneralSection
          data={formData}
          onChange={updateFormData}
          projectId={projectId}
        />
      </div>

      <div className="flex justify-between items-center gap-3 pt-6">
        <DevAutoFillButton
          formType="changeEvent"
          onAutoFill={(data) => updateFormData(data as Partial<ChangeEventFormData>)}
        />
        <div className="flex gap-3">
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
              "Create Change Event"
            ) : (
              "Update Change Event"
            )}
          </Button>
        </div>
      </div>
    </Form>
  )
}
