"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, AlertCircle, Building, User } from "lucide-react"
import { StepComponentProps } from "./project-setup-wizard"
import type { Database } from "@/types/database.types"

type Company = Database["public"]["Tables"]["companies"]["Row"]
type ProjectDirectory = Database["public"]["Tables"]["project_directory"]["Row"]

interface ProjectDirectoryWithCompany extends ProjectDirectory {
  company?: Company
}

const projectRoles = [
  { value: "owner", label: "Project Owner" },
  { value: "general_contractor", label: "General Contractor" },
  { value: "architect", label: "Architect" },
  { value: "engineer", label: "Engineer" },
  { value: "project_manager", label: "Project Manager" },
  { value: "superintendent", label: "Superintendent" },
  { value: "subcontractor", label: "Subcontractor" },
  { value: "supplier", label: "Supplier" },
  { value: "inspector", label: "Inspector" },
  { value: "consultant", label: "Consultant" },
]

export function ProjectDirectorySetup({ projectId, onNext, onSkip }: StepComponentProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [companies, setCompanies] = useState<Company[]>([])
  const [projectDirectory, setProjectDirectory] = useState<ProjectDirectoryWithCompany[]>([])
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
  })
  
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [projectId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load companies
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("*")
        .order("name")

      if (companiesError) throw companiesError

      // Load project directory with companies
      const { data: directoryData, error: directoryError } = await supabase
        .from("project_directory")
        .select(`
          *,
          company:companies(*)
        `)
        .eq("project_id", projectId)
        .order("created_at")

      if (directoryError) throw directoryError

      setCompanies(companiesData || [])
      setProjectDirectory(directoryData || [])

    } catch (err) {
      console.error("Error loading data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const createNewCompany = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!newCompany.name) {
        setError("Company name is required")
        return
      }

      const { data, error } = await supabase
        .from("companies")
        .insert({
          name: newCompany.name,
          address: newCompany.address || null,
          city: newCompany.city || null,
          state: newCompany.state || null,
        })
        .select()
        .single()

      if (error) throw error

      setCompanies([...companies, data])
      setSelectedCompanyId(data.id)
      setShowNewCompanyForm(false)
      setNewCompany({
        name: "",
        address: "",
        city: "",
        state: "",
      })

    } catch (err) {
      console.error("Error creating company:", err)
      setError(err instanceof Error ? err.message : "Failed to create company")
    } finally {
      setSaving(false)
    }
  }

  const addToDirectory = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!selectedCompanyId || !selectedRole) {
        setError("Please select a company and role")
        return
      }

      // Check if already exists
      const exists = projectDirectory.some(
        d => d.company_id === selectedCompanyId && d.role === selectedRole
      )
      if (exists) {
        setError("This company already has this role in the project")
        return
      }

      const { data, error } = await supabase
        .from("project_directory")
        .insert({
          project_id: projectId,
          company_id: selectedCompanyId,
          role: selectedRole,
          is_active: true,
          permissions: {
            can_view: true,
            can_edit: false,
            can_approve: false,
            can_submit: true,
          },
        })
        .select(`
          *,
          company:companies(*)
        `)
        .single()

      if (error) throw error

      setProjectDirectory([...projectDirectory, data])
      setShowAddDialog(false)
      setSelectedCompanyId("")
      setSelectedRole("")

    } catch (err) {
      console.error("Error adding to directory:", err)
      setError(err instanceof Error ? err.message : "Failed to add to directory")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (entryId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("project_directory")
        .update({ is_active: isActive })
        .eq("id", entryId)

      if (error) throw error

      setProjectDirectory(
        projectDirectory.map(entry =>
          entry.id === entryId ? { ...entry, is_active: isActive } : entry
        )
      )

    } catch (err) {
      console.error("Error updating directory entry:", err)
      setError(err instanceof Error ? err.message : "Failed to update entry")
    }
  }

  const removeFromDirectory = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from("project_directory")
        .delete()
        .eq("id", entryId)

      if (error) throw error

      setProjectDirectory(projectDirectory.filter(entry => entry.id !== entryId))

    } catch (err) {
      console.error("Error removing from directory:", err)
      setError(err instanceof Error ? err.message : "Failed to remove entry")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading project directory...</div>
      </div>
    )
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
          Add companies and assign their roles in this project. You can always
          update these assignments later.
        </p>

        {/* Directory Table */}
        {projectDirectory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-24">Active</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectDirectory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{entry.company?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {projectRoles.find(r => r.value === entry.role)?.label || entry.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {entry.company?.address && (
                      <div className="text-sm text-muted-foreground">
                        {entry.company.address}
                        {entry.company.city && entry.company.state && (
                          <>, {entry.company.city}, {entry.company.state}</>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={entry.is_active ?? true}
                      onCheckedChange={(checked) => toggleActive(entry.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromDirectory(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No companies added to the project yet
          </div>
        )}

        {/* Add Company Button */}
        <div className="flex justify-center">
          <Button onClick={() => setShowAddDialog(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onSkip} disabled={saving}>
          Skip for now
        </Button>
        <Button
          onClick={onNext}
          disabled={saving || projectDirectory.filter(d => d.is_active).length === 0}
        >
          Continue
        </Button>
      </div>

      {/* Add Company Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Company to Project</DialogTitle>
            <DialogDescription>
              Select a company and assign their role in this project
            </DialogDescription>
          </DialogHeader>
          
          {!showNewCompanyForm ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0"
                  onClick={() => setShowNewCompanyForm(true)}
                >
                  or create a new company
                </Button>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addToDirectory} disabled={saving}>
                  {saving ? "Adding..." : "Add to Project"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium">Create New Company</h4>
              
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newCompany.city}
                    onChange={(e) => setNewCompany({ ...newCompany, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newCompany.state}
                    onChange={(e) => setNewCompany({ ...newCompany, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewCompanyForm(false)
                    setNewCompany({
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                    })
                  }}
                >
                  Back
                </Button>
                <Button onClick={createNewCompany} disabled={saving}>
                  {saving ? "Creating..." : "Create Company"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}