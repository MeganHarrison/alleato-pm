"use client"

import * as React from "react"
import { format } from "date-fns"
import { Form } from "@/components/forms/Form"
import { FormSection } from "@/components/forms/FormSection"
import { TextField } from "@/components/forms/TextField"
import { SelectField } from "@/components/forms/SelectField"
import { DateField } from "@/components/forms/DateField"
import { NumberField } from "@/components/forms/NumberField"
import { ToggleField } from "@/components/forms/ToggleField"
import { MultiSelectField } from "@/components/forms/MultiSelectField"
import { RichTextField } from "@/components/forms/RichTextField"
import { FileUploadField } from "@/components/forms/FileUploadField"
import { useCompanies } from "@/hooks/use-companies"
import { useUsers } from "@/hooks/use-users"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface PrimeContractFormValues {
  contractNumber: string
  title: string
  ownerClientId?: string
  contractorId?: string
  architectEngineerId?: string
  status:
    | "draft"
    | "out_for_bid"
    | "out_for_signature"
    | "approved"
    | "complete"
    | "terminated"
  executed: boolean
  isPrivate: boolean
  allowedUsers: string[]
  allowSovVisibilityForAllowedUsers: boolean
  defaultRetainagePercent?: number
  descriptionHtml?: string
  startDate?: Date
  estimatedCompletionDate?: Date
  substantialCompletionDate?: Date
  actualCompletionDate?: Date
  signedContractReceivedDate?: Date
  terminationDate?: Date
  inclusionsHtml?: string
  exclusionsHtml?: string
  attachments?: { name: string; size: number; type: string }[]
}

interface PrimeContractFormProps {
  projectId: string
  initialValues?: Partial<PrimeContractFormValues>
  onSubmit: (values: PrimeContractFormValues) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

function formatDateForSupabase(date?: Date) {
  return date ? format(date, "yyyy-MM-dd") : undefined
}

export function PrimeContractForm({
  projectId,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PrimeContractFormProps) {
  const { options: companyOptions, isLoading: loadingCompanies } = useCompanies()
  const { options: userOptions, isLoading: loadingUsers } = useUsers()

  const [formValues, setFormValues] = React.useState<PrimeContractFormValues>({
    contractNumber: initialValues?.contractNumber || "",
    title: initialValues?.title || "MKH Prime Contract",
    ownerClientId: initialValues?.ownerClientId,
    contractorId: initialValues?.contractorId,
    architectEngineerId: initialValues?.architectEngineerId,
    status: initialValues?.status || "draft",
    executed: initialValues?.executed || false,
    isPrivate: initialValues?.isPrivate || false,
    allowedUsers: initialValues?.allowedUsers || [],
    allowSovVisibilityForAllowedUsers:
      initialValues?.allowSovVisibilityForAllowedUsers || false,
    defaultRetainagePercent: initialValues?.defaultRetainagePercent,
    descriptionHtml: initialValues?.descriptionHtml,
    startDate: initialValues?.startDate,
    estimatedCompletionDate: initialValues?.estimatedCompletionDate,
    substantialCompletionDate: initialValues?.substantialCompletionDate,
    actualCompletionDate: initialValues?.actualCompletionDate,
    signedContractReceivedDate: initialValues?.signedContractReceivedDate,
    terminationDate: initialValues?.terminationDate,
    inclusionsHtml: initialValues?.inclusionsHtml,
    exclusionsHtml: initialValues?.exclusionsHtml,
    attachments: initialValues?.attachments || [],
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit({
      ...formValues,
      startDate: formValues.startDate,
      estimatedCompletionDate: formValues.estimatedCompletionDate,
      substantialCompletionDate: formValues.substantialCompletionDate,
      actualCompletionDate: formValues.actualCompletionDate,
      signedContractReceivedDate: formValues.signedContractReceivedDate,
      terminationDate: formValues.terminationDate,
    })
  }

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "out_for_bid", label: "Out For Bid" },
    { value: "out_for_signature", label: "Out For Signature" },
    { value: "approved", label: "Approved" },
    { value: "complete", label: "Complete" },
    { value: "terminated", label: "Terminated" },
  ]

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <FormSection
          title="Project Assignment"
          description="Prime contracts must always be tied to a project."
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              This contract will be created under project ID
            </p>
            <Badge variant="secondary" className="w-fit">
              Project: {projectId}
            </Badge>
          </div>
        </FormSection>

        <FormSection
          title="Contract Details"
          description="Core identifiers and parties for this prime contract"
        >
          <TextField
            label="Contract #"
            value={formValues.contractNumber}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, contractNumber: e.target.value }))
            }
            required
            placeholder="PC-001"
          />

          <TextField
            label="Title"
            value={formValues.title}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            placeholder="Prime contract name"
            fullWidth
          />

          <SelectField
            label="Owner/Client"
            options={companyOptions}
            value={formValues.ownerClientId}
            onValueChange={(value) =>
              setFormValues((prev) => ({ ...prev, ownerClientId: value }))
            }
            placeholder={loadingCompanies ? "Loading companies..." : "Select owner/client"}
            required
            disabled={loadingCompanies}
          />

          <SelectField
            label="Contractor"
            options={companyOptions}
            value={formValues.contractorId}
            onValueChange={(value) =>
              setFormValues((prev) => ({ ...prev, contractorId: value }))
            }
            placeholder={loadingCompanies ? "Loading companies..." : "Select contractor"}
            required
            disabled={loadingCompanies}
          />

          <SelectField
            label="Architect/Engineer"
            options={companyOptions}
            value={formValues.architectEngineerId}
            onValueChange={(value) =>
              setFormValues((prev) => ({ ...prev, architectEngineerId: value }))
            }
            placeholder={loadingCompanies ? "Loading companies..." : "Select architect/engineer"}
            disabled={loadingCompanies}
          />

          <SelectField
            label="Status"
            options={statusOptions}
            value={formValues.status}
            onValueChange={(value) =>
              setFormValues((prev) => ({ ...prev, status: value as PrimeContractFormValues["status"] }))
            }
            required
          />

          <ToggleField
            label="Executed"
            hint="Mark as executed when fully signed"
            checked={formValues.executed}
            onCheckedChange={(checked) =>
              setFormValues((prev) => ({ ...prev, executed: checked }))
            }
          />
        </FormSection>

        <FormSection
          title="Visibility & Access"
          description="Control who can view this prime contract"
        >
          <ToggleField
            label="Private"
            hint="Limit visibility to administrators and selected users"
            checked={formValues.isPrivate}
            onCheckedChange={(checked) =>
              setFormValues((prev) => ({ ...prev, isPrivate: checked }))
            }
          />

          <MultiSelectField
            label="Make this visible only to administrators and the following users"
            options={userOptions}
            value={formValues.allowedUsers}
            onChange={(values) =>
              setFormValues((prev) => ({ ...prev, allowedUsers: values }))
            }
            placeholder={loadingUsers ? "Loading users..." : "Select users"}
            fullWidth
            disabled={!formValues.isPrivate || loadingUsers}
          />

          <ToggleField
            label="Allow these users to see SOV items"
            checked={formValues.allowSovVisibilityForAllowedUsers}
            onCheckedChange={(checked) =>
              setFormValues((prev) => ({ ...prev, allowSovVisibilityForAllowedUsers: checked }))
            }
            hint="Controls whether the allowlist can view schedule of value details"
          />
        </FormSection>

        <FormSection
          title="Financial Defaults"
          description="Billing defaults for the contract"
        >
          <NumberField
            label="Default Retainage"
            value={formValues.defaultRetainagePercent}
            onChange={(value) =>
              setFormValues((prev) => ({ ...prev, defaultRetainagePercent: value }))
            }
            suffix="%"
            placeholder="10"
            min={0}
            max={100}
          />
        </FormSection>

        <FormSection
          title="Key Dates"
          description="Track contract timing milestones"
        >
          <DateField
            label="Start Date"
            value={formValues.startDate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, startDate: date || undefined }))
            }
            placeholder="Select start date"
          />

          <DateField
            label="Estimated Completion Date"
            value={formValues.estimatedCompletionDate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, estimatedCompletionDate: date || undefined }))
            }
            placeholder="Estimated completion"
          />

          <DateField
            label="Substantial Completion Date"
            value={formValues.substantialCompletionDate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, substantialCompletionDate: date || undefined }))
            }
            placeholder="Substantial completion"
          />

          <DateField
            label="Actual Completion Date"
            value={formValues.actualCompletionDate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, actualCompletionDate: date || undefined }))
            }
            placeholder="Actual completion"
          />

          <DateField
            label="Signed Contract Received Date"
            value={formValues.signedContractReceivedDate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, signedContractReceivedDate: date || undefined }))
            }
            placeholder="Received on"
          />

          <DateField
            label="Contract Termination Date"
            value={formValues.terminationDate}
            onChange={(date) =>
              setFormValues((prev) => ({ ...prev, terminationDate: date || undefined }))
            }
            placeholder="Termination date"
          />
        </FormSection>

        <FormSection
          title="Narrative"
          description="Add details about the scope, inclusions, and exclusions"
        >
          <RichTextField
            label="Description"
            value={formValues.descriptionHtml}
            onChange={(value) =>
              setFormValues((prev) => ({ ...prev, descriptionHtml: value }))
            }
            placeholder="Describe the contract scope and notes"
            fullWidth
          />

          <RichTextField
            label="Inclusions"
            value={formValues.inclusionsHtml}
            onChange={(value) =>
              setFormValues((prev) => ({ ...prev, inclusionsHtml: value }))
            }
            placeholder="List included scope items"
            fullWidth
          />

          <RichTextField
            label="Exclusions"
            value={formValues.exclusionsHtml}
            onChange={(value) =>
              setFormValues((prev) => ({ ...prev, exclusionsHtml: value }))
            }
            placeholder="List excluded scope items"
            fullWidth
          />
        </FormSection>

        <FormSection
          title="Attachments"
          description="Upload reference documents for this contract"
        >
          <FileUploadField
            label="Attachments"
            value={formValues.attachments}
            onChange={(files) =>
              setFormValues((prev) => ({ ...prev, attachments: files }))
            }
            multiple
            hint="Files will be saved to Supabase storage after submission"
          />
        </FormSection>

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Prime Contract"}
          </Button>
        </div>
      </div>
    </Form>
  )
}

export { formatDateForSupabase }
