"use client"

import * as React from "react"
import { FormSection } from "@/components/forms/FormSection"
import { DateField } from "@/components/forms/DateField"
import { NumberField } from "@/components/forms/NumberField"
import { ToggleField } from "@/components/forms/ToggleField"
import type { ContractFormData } from "./ContractForm"

interface ContractDatesSectionProps {
  data: Partial<ContractFormData>
  onChange: (updates: Partial<ContractFormData>) => void
}

export function ContractDatesSection({
  data,
  onChange,
}: ContractDatesSectionProps) {
  return (
    <>
      <FormSection
        title="Contract Dates"
        description="Important dates for this contract"
      >
        <DateField
          label="Contract Execution Date"
          value={data.executedDate}
          onChange={(date) => onChange({ executedDate: date })}
          placeholder="Select execution date"
        />

        <DateField
          label="Start Date"
          value={data.startDate}
          onChange={(date) => onChange({ startDate: date })}
          required
          placeholder="Select start date"
        />

        <DateField
          label="Substantial Completion Date"
          value={data.completionDate}
          onChange={(date) => onChange({ completionDate: date })}
          required
          placeholder="Select completion date"
        />

        <DateField
          label="Final Completion Date"
          value={undefined}
          onChange={() => {}}
          placeholder="Select final completion date"
        />
      </FormSection>

      <FormSection
        title="Duration & Milestones"
        description="Contract duration and key milestones"
      >
        <NumberField
          label="Contract Duration"
          value={365}
          onChange={() => {}}
          suffix="days"
          hint="Calculated from start to completion date"
          disabled
        />

        <NumberField
          label="Liquidated Damages"
          value={1000}
          onChange={() => {}}
          prefix="$"
          suffix="/day"
          hint="Daily penalty for late completion"
        />

        <ToggleField
          label="Include weather days"
          checked={true}
          onCheckedChange={() => {}}
          hint="Allow extensions for weather-related delays"
        />

        <ToggleField
          label="Include holidays in schedule"
          checked={false}
          onCheckedChange={() => {}}
          hint="Count holidays as working days"
        />
      </FormSection>
    </>
  )
}