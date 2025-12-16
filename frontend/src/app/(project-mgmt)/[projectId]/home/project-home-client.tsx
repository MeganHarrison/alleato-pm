'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreVertical, ChevronDown, Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditableCard } from './editable-card'
import { EditableSummary } from './editable-summary'
import { FinancialToggles } from './financial-toggles'
import { ProjectAccordions } from '@/components/project-accordions'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Project = Database['public']['Tables']['projects']['Row']
type Insight = Database['public']['Tables']['ai_insights']['Row']
type Task = Database['public']['Tables']['project_tasks']['Row']
type Meeting = Database['public']['Tables']['document_metadata']['Row']
type ChangeOrder = Database['public']['Tables']['change_orders']['Row']
type RFI = Database['public']['Tables']['rfis']['Row']
type DailyLog = Database['public']['Tables']['daily_logs']['Row']
type Commitment = Database['public']['Tables']['commitments']['Row']
type Contract = Database['public']['Tables']['financial_contracts']['Row']
type BudgetItem = Database['public']['Tables']['budget_items']['Row']
type ChangeEvent = Database['public']['Tables']['change_events']['Row']
type SOV = Database['public']['Tables']['schedule_of_values']['Row']

interface ProjectHomeClientProps {
  project: Project
  insights: Insight[]
  tasks: Task[]
  meetings: Meeting[]
  changeOrders: ChangeOrder[]
  rfis: RFI[]
  dailyLogs: DailyLog[]
  commitments: Commitment[]
  contracts: Contract[]
  budget?: BudgetItem[]
  changeEvents?: ChangeEvent[]
  schedule?: any[]
  sov?: SOV[]
}

export function ProjectHomeClient({
  project,
  insights,
  tasks,
  meetings,
  changeOrders,
  rfis,
  dailyLogs,
  commitments,
  contracts,
  budget = [],
  changeEvents = [],
  schedule = [],
  sov = []
}: ProjectHomeClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false)
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  })

  // Handle saving project updates
  const handleSaveProject = async (updates: Record<string, string>) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  // Handle saving summary
  const handleSaveSummary = async (summary: string) => {
    await handleSaveProject({ summary })
  }

  // Tool definitions for navigation
  const financialTools = [
    { name: "Prime Contracts", path: "contracts" },
    { name: "Budget", path: "budget" },
    { name: "Commitments", path: "commitments" },
    { name: "Change Orders", path: "change-orders" },
    { name: "Change Events", path: "change-events" },
    { name: "Direct Costs", path: "direct-costs" },
    { name: "Invoicing", path: "invoices" }
  ]

  const projectManagementTools = [
    { name: "Emails", path: "emails" },
    { name: "RFIs", path: "rfis" },
    { name: "Submittals", path: "submittals" },
    { name: "Transmittals", path: "transmittals" },
    { name: "Punch List", path: "punch-list" },
    { name: "Meetings", path: "meetings" },
    { name: "Schedule", path: "schedule" },
    { name: "Daily Log", path: "daily-log" },
    { name: "Photos", path: "photos" },
    { name: "Drawings", path: "drawings" },
    { name: "Specifications", path: "specifications" }
  ]

  const coreTools = [
    { name: "Home", path: "home" },
    { name: "360 Reporting", path: "reporting" },
    { name: "Documents", path: "documents" },
    { name: "Directory", path: "directory" },
    { name: "Tasks", path: "tasks" },
    { name: "Admin", path: "admin" }
  ]

  const handleEditField = (field: string, value: string) => {
    setIsEditing(field)
    setEditValue(value)
  }

  const handleSaveField = async (field: string) => {
    await handleSaveProject({ [field]: editValue })
    setIsEditing(null)
    setEditValue('')
  }

  const handleAddTeamMember = async () => {
    // TODO: Implement team member addition logic
    console.log('Adding team member:', newTeamMember)
    setIsAddTeamMemberOpen(false)
    setNewTeamMember({ name: '', role: '', email: '', phone: '' })
  }

  return (
    <div className="min-h-screen p-6">
      {/* Client Pre-heading */}
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">{project.client || 'No client assigned'}</p>
      </div>

      {/* Project Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-brand">
          {project.name || project['job number']}
        </h1>
      </div>

      {/* Status Row - Editable on hover/click */}
      <div className="flex items-center gap-6 mb-6 pb-4 border-b">
        {/* Status */}
        <button
          type="button"
          className="group cursor-pointer hover:bg-muted/50 px-3 py-2 rounded transition-colors border-0 bg-transparent"
          onClick={() => handleEditField('phase', project.phase || project.state || 'Active')}
        >
          {isEditing === 'phase' ? (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveField('phase')}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveField('phase')}
                className="h-8 w-32"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase">Status:</span>
              <span className="text-sm font-medium">{project.phase || project.state || 'Active'}</span>
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </button>

        {/* Start Date */}
        <button
          type="button"
          className="group cursor-pointer hover:bg-muted/50 px-3 py-2 rounded transition-colors border-0 bg-transparent"
          onClick={() => handleEditField('start date', project['start date'] ? format(new Date(project['start date']), 'yyyy-MM-dd') : '')}
        >
          {isEditing === 'start date' ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveField('start date')}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveField('start date')}
                className="h-8 w-40"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase">Start Date:</span>
              <span className="text-sm font-medium">
                {project['start date'] ? format(new Date(project['start date']), 'MMM d, yyyy') : 'Not set'}
              </span>
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </button>

        {/* Est Completion */}
        <button
          type="button"
          className="group cursor-pointer hover:bg-muted/50 px-3 py-2 rounded transition-colors border-0 bg-transparent"
          onClick={() => handleEditField('est completion', project['est completion'] ? format(new Date(project['est completion']), 'yyyy-MM-dd') : '')}
        >
          {isEditing === 'est completion' ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveField('est completion')}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveField('est completion')}
                className="h-8 w-40"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase">Est. Completion:</span>
              <span className="text-sm font-medium">
                {project['est completion'] ? format(new Date(project['est completion']), 'MMM d, yyyy') : 'Not set'}
              </span>
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </button>
      </div>

      {/* Project Tools Dropdown */}
      <div className="mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-auto">
              Project Tools <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[800px] max-w-[95vw] p-6 bg-gradient-to-br from-white to-gray-50"
            align="start"
            sideOffset={8}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Finance Column */}
              <div>
                <h3 className="text-sm font-semibold text-brand uppercase tracking-wide mb-4 pb-2 border-b-2 border-brand/20">
                  Finance
                </h3>
                <nav className="space-y-2">
                  {financialTools.map((tool) => (
                    <Link
                      key={tool.path}
                      href={`/${project.id}/${tool.path}`}
                      className="block text-sm text-gray-700 hover:text-brand hover:translate-x-1 transition-all duration-200 py-1"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Project Management Column */}
              <div>
                <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-4 pb-2 border-b-2 border-orange-600/20">
                  Project Management
                </h3>
                <nav className="space-y-2">
                  {projectManagementTools.map((tool) => (
                    <Link
                      key={tool.path}
                      href={`/${project.id}/${tool.path}`}
                      className="block text-sm text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200 py-1"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Core Tools Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-300">
                  Core Tools
                </h3>
                <nav className="space-y-2">
                  {coreTools.map((tool) => (
                    <Link
                      key={tool.path}
                      href={`/${project.id}/${tool.path}`}
                      className="block text-sm text-gray-700 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 py-1"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Two Column Layout - Summary and Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Summary */}
        <div>
          <EditableSummary
            summary={project.summary || 'No project summary available.'}
            onSave={handleSaveSummary}
          />
        </div>

        {/* Right Column - Project Team */}
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Project Team</h3>
            <Dialog open={isAddTeamMemberOpen} onOpenChange={setIsAddTeamMemberOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      placeholder="Project Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newTeamMember.phone}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddTeamMemberOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTeamMember}>
                    Add Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {project.team_members && Array.isArray(project.team_members) && project.team_members.length > 0 ? (
              project.team_members.map((member, index) => {
                const memberName = typeof member === 'string' ? member : (member as any)?.name || 'Team Member'
                const memberRole = typeof member === 'object' && member !== null && (member as any)?.role ? (member as any).role : 'Role not specified'
                const initials = typeof member === 'string' ? member.substring(0, 2).toUpperCase() : 'TM'

                return (
                  <div key={`team-member-${index}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{memberName}</p>
                      <p className="text-xs text-muted-foreground">{memberRole}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">No team members assigned yet</p>
                <p className="text-xs text-muted-foreground">Click "Add Member" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

            {/* Project Accordions Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-brand mb-4">Project Information</h2>
        <ProjectAccordions
          projectId={project.id.toString()}
          meetings={meetings}
          budget={budget}
          primeContracts={contracts}
          changeOrders={changeOrders}
          changeEvents={changeEvents}
          schedule={schedule}
          sov={sov}
          rfis={rfis}
          tasks={tasks}
          insights={insights}
          submittals={[]}
          documents={[]}
          drawings={[]}
        />
      </div>

    </div>
  )
}
