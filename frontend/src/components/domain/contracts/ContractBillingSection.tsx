"use client"

import * as React from "react"
import { FormSection } from "@/components/forms/FormSection"
import { SelectField } from "@/components/forms/SelectField"
import { NumberField } from "@/components/forms/NumberField"
import { ToggleField } from "@/components/forms/ToggleField"
import type { ContractFormData } from "./ContractForm"

interface ContractBillingSectionProps {
  data: Partial<ContractFormData>
  onChange: (updates: Partial<ContractFormData>) => void
}

export function ContractBillingSection({
  data,
  onChange,
}: ContractBillingSectionProps) {
  const billingMethods = [
    { value: "progress", label: "Progress Billing" },
    { value: "unit_price", label: "Unit Price" },
    { value: "time_materials", label: "Time & Materials" },
    { value: "lump_sum", label: "Lump Sum" },
  ]

  const paymentTerms = [
    { value: "net_30", label: "Net 30" },
    { value: "net_45", label: "Net 45" },
    { value: "net_60", label: "Net 60" },
    { value: "due_on_receipt", label: "Due on Receipt" },
  ]

  return (
    <>
      <FormSection
        title="Billing Configuration"
        description="Configure how this contract will be billed"
      >
        <SelectField
          label="Billing Method"
          options={billingMethods}
          value="progress"
          onValueChange={() => {}}
          required
        />

        <SelectField
          label="Payment Terms"
          options={paymentTerms}
          value="net_30"
          onValueChange={() => {}}
          required
        />

        <NumberField
          label="Billing Day of Month"
          value={25}
          onChange={() => {}}
          min={1}
          max={31}
          hint="Day of month when progress billing is due"
        />

        <ToggleField
          label="Allow billing over contract value"
          checked={false}
          onCheckedChange={() => {}}
          hint="Enable if change orders may exceed original contract"
        />
      </FormSection>

      <FormSection
        title="Retention Settings"
        description="Configure retention withholding rules"
      >
        <ToggleField
          label="Apply retention to this contract"
          checked={true}
          onCheckedChange={() => {}}
        />

        <NumberField
          label="Labor Retention %"
          value={10}
          onChange={() => {}}
          suffix="%"
          min={0}
          max={100}
        />

        <NumberField
          label="Materials Retention %"
          value={0}
          onChange={() => {}}
          suffix="%"
          min={0}
          max={100}
          hint="Often set to 0% for material costs"
        />

        <ToggleField
          label="Release retention with final payment"
          checked={true}
          onCheckedChange={() => {}}
        />
      </FormSection>
    </>
  )
}