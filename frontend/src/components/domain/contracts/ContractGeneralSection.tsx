"use client"

import * as React from "react"
import { FormSection } from "@/components/forms/FormSection"
import { TextField } from "@/components/forms/TextField"
import { SelectField } from "@/components/forms/SelectField"
import { TextareaField } from "@/components/forms/TextareaField"
import { NumberField } from "@/components/forms/NumberField"
import { useCompanies } from "@/hooks/use-companies"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import type { ContractFormData } from "./ContractForm"

interface ContractGeneralSectionProps {
  data: Partial<ContractFormData>
  onChange: (updates: Partial<ContractFormData>) => void
}

export function ContractGeneralSection({
  data,
  onChange,
}: ContractGeneralSectionProps) {
  // Fetch companies from Supabase
  const { options: companyOptions, isLoading: companiesLoading, createCompany } = useCompanies()

  // State for "Add New Company" dialog
  const [showAddCompany, setShowAddCompany] = React.useState(false)
  const [newCompanyName, setNewCompanyName] = React.useState("")
  const [newCompanyAddress, setNewCompanyAddress] = React.useState("")
  const [newCompanyCity, setNewCompanyCity] = React.useState("")
  const [newCompanyState, setNewCompanyState] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  // Standard status options (keep hardcoded - these are enums)
  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "out_for_signature", label: "Out for Signature" },
    { value: "executed", label: "Executed" },
    { value: "closed", label: "Closed" },
  ]

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return

    setIsCreating(true)
    const newCompany = await createCompany({
      name: newCompanyName.trim(),
      address: newCompanyAddress.trim() || null,
      city: newCompanyCity.trim() || null,
      state: newCompanyState.trim() || null,
    })

    if (newCompany) {
      // Select the newly created company
      onChange({ contractCompanyId: newCompany.id })
      // Reset form and close dialog
      setNewCompanyName("")
      setNewCompanyAddress("")
      setNewCompanyCity("")
      setNewCompanyState("")
      setShowAddCompany(false)
    }
    setIsCreating(false)
  }

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

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                label="Contract Company"
                options={companyOptions}
                value={data.contractCompanyId}
                onValueChange={(value) => onChange({ contractCompanyId: value })}
                required
                placeholder={companiesLoading ? "Loading companies..." : "Select a company"}
                disabled={companiesLoading}
              />
            </div>
            <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0" title="Add new company">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>
                    Create a new company to use in contracts.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Input
                      id="company-address"
                      value={newCompanyAddress}
                      onChange={(e) => setNewCompanyAddress(e.target.value)}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company-city">City</Label>
                      <Input
                        id="company-city"
                        value={newCompanyCity}
                        onChange={(e) => setNewCompanyCity(e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company-state">State</Label>
                      <Input
                        id="company-state"
                        value={newCompanyState}
                        onChange={(e) => setNewCompanyState(e.target.value)}
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddCompany(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCompany} disabled={!newCompanyName.trim() || isCreating}>
                    {isCreating ? "Creating..." : "Create Company"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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