"use client"

import * as React from "react"
import { FormSection } from "@/components/forms/FormSection"
import { TextField } from "@/components/forms/TextField"
import { SelectField } from "@/components/forms/SelectField"
import { TextareaField } from "@/components/forms/TextareaField"
import { NumberField } from "@/components/forms/NumberField"
import type { ContractFormData } from "./ContractForm"

interface ContractGeneralSectionProps {
  data: Partial<ContractFormData>
  onChange: (updates: Partial<ContractFormData>) => void
}

export function ContractGeneralSection({
  data,
  onChange,
}: ContractGeneralSectionProps) {
  // Mock data - in real app would come from API
  const contractCompanies = [
    { value: "1", label: "ABC Construction Co." },
    { value: "2", label: "XYZ Builders Inc." },
    { value: "3", label: "Premier Contractors LLC" },
  ]

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "out_for_signature", label: "Out for Signature" },
    { value: "executed", label: "Executed" },
    { value: "closed", label: "Closed" },
  ]

  return (
    <>
      <FormSection
        title="Contract Information"
        description="Basic information about the contract"
      >
        <TextField
          label="Contract Number"
          value={data.number || ""}
          onChange={(e) => onChange({ number: e.target.value })}
          required
          placeholder="PC-001"
        />
        
        <TextField
          label="Contract Title"
          value={data.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          required
          fullWidth
          placeholder="Main Building Construction"
        />

        <SelectField
          label="Contract Company"
          options={contractCompanies}
          value={data.contractCompanyId}
          onValueChange={(value) => onChange({ contractCompanyId: value })}
          required
          placeholder="Select a company"
        />

        <SelectField
          label="Status"
          options={statuses}
          value={data.status || "draft"}
          onValueChange={(value) => onChange({ status: value })}
          required
        />
      </FormSection>

      <FormSection
        title="Financial Information"
        description="Contract amounts and financial details"
      >
        <NumberField
          label="Original Contract Amount"
          value={data.originalAmount}
          onChange={(value) => onChange({ originalAmount: value || 0 })}
          required
          prefix="$"
          placeholder="0.00"
        />

        <NumberField
          label="Revised Contract Amount"
          value={data.revisedAmount}
          onChange={(value) => onChange({ revisedAmount: value })}
          prefix="$"
          placeholder="0.00"
          hint="Include approved change orders"
        />

        <NumberField
          label="Retention Percentage"
          value={data.retentionPercent}
          onChange={(value) => onChange({ retentionPercent: value })}
          suffix="%"
          placeholder="10"
          min={0}
          max={100}
        />
      </FormSection>

      <FormSection title="Description">
        <TextareaField
          label="Scope of Work"
          value=""
          onChange={() => {}}
          placeholder="Describe the scope of work covered by this contract..."
          rows={4}
          fullWidth
        />
      </FormSection>
    </>
  )
}