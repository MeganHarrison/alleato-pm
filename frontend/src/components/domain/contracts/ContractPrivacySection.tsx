"use client"

import * as React from "react"
import { FormSection } from "@/components/forms/FormSection"
import { ToggleField } from "@/components/forms/ToggleField"
import { MultiSelectField } from "@/components/forms/MultiSelectField"
import { CheckboxField } from "@/components/forms/CheckboxField"
import type { ContractFormData } from "./ContractForm"

interface ContractPrivacySectionProps {
  data: Partial<ContractFormData>
  onChange: (updates: Partial<ContractFormData>) => void
}

export function ContractPrivacySection({
  data,
  onChange,
}: ContractPrivacySectionProps) {
  // Mock data - in real app would come from API
  const users = [
    { value: "1", label: "John Smith (Project Manager)" },
    { value: "2", label: "Jane Doe (Superintendent)" },
    { value: "3", label: "Bob Johnson (Accountant)" },
    { value: "4", label: "Sarah Williams (Executive)" },
  ]

  const roles = [
    { value: "admin", label: "Administrators" },
    { value: "pm", label: "Project Managers" },
    { value: "super", label: "Superintendents" },
    { value: "accounting", label: "Accounting" },
  ]

  return (
    <>
      <FormSection
        title="Privacy Settings"
        description="Control who can view and edit this contract"
      >
        <ToggleField
          label="Make this contract private"
          checked={data.isPrivate || false}
          onCheckedChange={(checked) => onChange({ isPrivate: checked })}
          hint="Only selected users and roles will have access"
          fullWidth
        />

        {data.isPrivate && (
          <>
            <MultiSelectField
              label="Allowed Users"
              options={users}
              value={data.allowedUsers || []}
              onChange={(values) => onChange({ allowedUsers: values })}
              placeholder="Select users with access"
              fullWidth
            />

            <MultiSelectField
              label="Allowed Roles"
              options={roles}
              value={[]}
              onChange={() => {}}
              placeholder="Select roles with access"
              fullWidth
            />
          </>
        )}
      </FormSection>

      <FormSection
        title="Permissions"
        description="Configure specific permissions for this contract"
      >
        <CheckboxField
          label="Allow subcontractors to view contract amount"
          checked={false}
          onCheckedChange={() => {}}
        />

        <CheckboxField
          label="Show in company directory"
          checked={true}
          onCheckedChange={() => {}}
        />

        <CheckboxField
          label="Allow change order creation"
          checked={true}
          onCheckedChange={() => {}}
        />

        <CheckboxField
          label="Require approval for all invoices"
          checked={true}
          onCheckedChange={() => {}}
        />
      </FormSection>
    </>
  )
}