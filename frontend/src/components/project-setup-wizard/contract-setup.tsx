"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  FileText,
  DollarSign,
} from "lucide-react"
import { StepComponentProps } from "./project-setup-wizard"
import type { Database } from "@/types/database.types"

type Contract = Database["public"]["Tables"]["contracts"]["Row"]

export function ContractSetup({ projectId, onNext, onSkip }: StepComponentProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [includeSOV, setIncludeSOV] = useState(false)
  
  const [contract, setContract] = useState<Partial<Contract>>({
    project_id: parseInt(projectId),
    contract_number: "",
    title: "Prime Contract",
    status: "draft",
    original_contract_amount: 0,
    client_id: 1, // This would need to come from project data
  })
  
  const supabase = createClient()

  const updateContract = (field: keyof Contract, value: any) => {
    setContract(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveContract = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!contract.title || !contract.original_contract_amount || contract.original_contract_amount <= 0) {
        setError("Please provide a contract title and amount")
        return
      }

      // Insert the contract
      const { data: newContract, error: contractError } = await supabase
        .from("contracts")
        .insert({
          project_id: parseInt(projectId),
          contract_number: contract.contract_number || null,
          title: contract.title || "Prime Contract",
          status: "draft",
          original_contract_amount: contract.original_contract_amount || 0,
          revised_contract_amount: contract.original_contract_amount || 0,
          client_id: contract.client_id || 1,
        })
        .select()
        .single()

      if (contractError) throw contractError

      // If including SOV, create a basic schedule of values
      if (includeSOV && newContract) {
        const { error: sovError } = await supabase
          .from("schedule_of_values")
          .insert({
            contract_id: newContract.id,
            project_id: projectId,
            revision: 1,
            total_amount: newContract.original_contract_amount || 0,
            status: "draft",
            is_current: true,
          })

        if (sovError) throw sovError
      }

      onNext()

    } catch (err) {
      console.error("Error saving contract:", err)
      setError(err instanceof Error ? err.message : "Failed to save contract")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <p className="text-muted-foreground">
          Set up your prime contract with the project owner. This step is optional
          and can be completed later.
        </p>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Prime Contract Details</h3>
          </div>

          <div className="grid gap-4">
            {/* Contract Number */}
            <div className="grid gap-2">
              <Label htmlFor="contract-number">Contract Number</Label>
              <Input
                id="contract-number"
                value={contract.contract_number || ""}
                onChange={(e) => updateContract("contract_number", e.target.value)}
                placeholder="e.g., PC-2024-001"
              />
            </div>

            {/* Contract Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Contract Title *</Label>
              <Input
                id="title"
                value={contract.title || ""}
                onChange={(e) => updateContract("title", e.target.value)}
                placeholder="e.g., Construction Services Agreement"
              />
            </div>

            {/* Contract Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Contract Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={contract.original_contract_amount || ""}
                  onChange={(e) => updateContract("original_contract_amount", parseFloat(e.target.value) || 0)}
                  className="pl-9"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This should match your total project budget
              </p>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Contract Notes</Label>
              <Textarea
                id="notes"
                value={contract.notes || ""}
                onChange={(e) => updateContract("notes", e.target.value)}
                placeholder="Add any notes about this contract..."
                rows={4}
              />
            </div>

            {/* Schedule of Values Option */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="include-sov" className="font-medium cursor-pointer">
                  Include Schedule of Values
                </Label>
                <p className="text-sm text-muted-foreground">
                  Create a basic SOV structure for this contract
                </p>
              </div>
              <Switch
                id="include-sov"
                checked={includeSOV}
                onCheckedChange={setIncludeSOV}
              />
            </div>
          </div>
        </Card>

        {/* Contract Summary */}
        {(contract.title || contract.original_contract_amount) && (
          <Card className="p-4 bg-muted/50">
            <h4 className="text-sm font-medium mb-2">Contract Summary</h4>
            <div className="space-y-1 text-sm">
              {contract.title && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium">{contract.title}</span>
                </div>
              )}
              {contract.original_contract_amount && contract.original_contract_amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${contract.original_contract_amount.toLocaleString()}</span>
                </div>
              )}
              {includeSOV && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Schedule of Values:</span>
                  <Badge variant="secondary">Will be created</Badge>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onSkip} disabled={saving}>
          Skip for now
        </Button>
        <Button
          onClick={saveContract}
          disabled={saving || !contract.title || !contract.original_contract_amount || contract.original_contract_amount <= 0}
        >
          {saving ? "Saving..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  )
}