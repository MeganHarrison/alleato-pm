"use client"

import * as React from "react"
import { FormSection } from "@/components/forms/FormSection"
import { TextField } from "@/components/forms/TextField"
import { SelectField } from "@/components/forms/SelectField"
import { TextareaField } from "@/components/forms/TextareaField"
import { NumberField } from "@/components/forms/NumberField"
import { useClients } from "@/hooks/use-clients"
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
  // Fetch clients (owners) from Supabase
  const { options: clientOptions, isLoading: clientsLoading, createClient } = useClients()

  // State for "Add New Client" dialog
  const [showAddClient, setShowAddClient] = React.useState(false)
  const [newClientName, setNewClientName] = React.useState("")
  const [newClientCompany, setNewClientCompany] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  // Standard status options (keep hardcoded - these are enums)
  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "out_for_signature", label: "Out for Signature" },
    { value: "executed", label: "Executed" },
    { value: "closed", label: "Closed" },
  ]

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return

    setIsCreating(true)
    const newClient = await createClient({
      name: newClientName.trim(),
      company_name: newClientCompany.trim() || undefined,
      status: "active",
    })

    if (newClient) {
      onChange({ contractCompanyId: newClient.id.toString() })
      setNewClientName("")
      setNewClientCompany("")
      setShowAddClient(false)
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
          name="contract_number"
          value={data.number || ""}
          onChange={(e) => onChange({ number: e.target.value })}
          required
          placeholder="PC-001"
          data-testid="contract-number-input"
        />

        <TextField
          label="Contract Title"
          name="title"
          value={data.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          required
          fullWidth
          placeholder="Main Building Construction"
          data-testid="contract-title-input"
        />

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <SelectField
                label="Contract Owner"
                options={clientOptions}
                value={data.contractCompanyId}
                onValueChange={(value) => onChange({ contractCompanyId: value })}
                required
                placeholder={clientsLoading ? "Loading clients..." : "Select a client"}
                disabled={clientsLoading}
              />
            </div>
            <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0" title="Add new client">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Create a new client to use in contracts.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client-name">Client Name *</Label>
                    <Input
                      id="client-name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client-company">Company (optional)</Label>
                    <Input
                      id="client-company"
                      value={newClientCompany}
                      onChange={(e) => setNewClientCompany(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddClient(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClient} disabled={!newClientName.trim() || isCreating}>
                    {isCreating ? "Creating..." : "Create Client"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <SelectField
          label="Status"
          name="contract_type"
          options={statuses}
          value={data.status || "draft"}
          onValueChange={(value) => onChange({ status: value })}
          required
          data-testid="contract-type-select"
        />
      </FormSection>

      <FormSection
        title="Financial Information"
        description="Contract amounts and financial details"
      >
        <NumberField
          label="Original Contract Amount"
          name="contract_value"
          value={data.originalAmount}
          onChange={(value) => onChange({ originalAmount: value || 0 })}
          required
          prefix="$"
          placeholder="0.00"
          data-testid="contract-value-input"
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
