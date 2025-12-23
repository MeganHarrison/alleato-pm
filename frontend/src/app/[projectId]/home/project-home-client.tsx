'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Pencil, Calendar, FileText, AlertCircle, ChevronDown, Star, CheckCircle2, CalendarClock, FolderKanban, MapPin, Truck, Hammer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { HeroMetrics } from './hero-metrics'
import { EditableSummary } from './editable-summary'
import { ProjectAccordions } from '@/app/[projectId]/home/project-accordions'
import type { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ProjectSidebar } from './project-sidebar'

type Project = Database['public']['Tables']['projects']['Row']
type Insight = Database['public']['Tables']['ai_insights']['Row']
type Task = Database['public']['Tables']['project_tasks']['Row']
type Meeting = Database['public']['Tables']['document_metadata']['Row']
type ChangeOrder = Database['public']['Tables']['change_orders']['Row']
type RFI = Database['public']['Tables']['rfis']['Row']
type DailyLog = Database['public']['Tables']['daily_logs']['Row']
type Commitment = Database['public']['Tables']['commitments']['Row']
type Contract = Database['public']['Tables']['financial_contracts']['Row']
type BudgetItem = Database['public']['Tables']['budget_lines']['Row']
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

// Project Tools Links - matching the dropdown in the header
interface ToolLink {
  name: string
  href: string
  badge?: string
  isFavorite?: boolean
  hasCreateAction?: boolean
}

const coreTools: ToolLink[] = [
  { name: 'Dashboard', href: '/dashboard'},
  { name: 'Directory', href: '/directory', },
  { name: 'Meetings', href: '/meetings' },
]

const projectManagementTools: ToolLink[] = [
  { name: 'Tasks', href: '/tasks' },
  { name: 'Schedule', href: '/schedule', hasCreateAction: true },
  { name: 'Daily Logs', href: '/daily-logs' },
]

const financialManagementTools: ToolLink[] = [
  { name: 'Commitments', href: '/commitments', hasCreateAction: true },
  { name: 'Invoices', href: '/invoices' },
  { name: 'Budget', href: '/budget', hasCreateAction: true },
]

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
  const [currentTool, setCurrentTool] = useState('Tools')

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

  const handleEditField = (field: string, value: string) => {
    setIsEditing(field)
    setEditValue(value)
  }

  const handleSaveField = async (field: string) => {
    try {
      await handleSaveProject({ [field]: editValue })
      setIsEditing(null)
      setEditValue('')
    } catch (error) {
      console.error(`Error saving field ${field}:`, error)
      // Keep the field in edit mode if save fails
      // Optionally, you could show an error message to the user here
    }
  }

  const handleAddTeamMember = async () => {
    // TODO: Implement team member addition logic
    console.log('Adding team member:', newTeamMember)
    setIsAddTeamMemberOpen(false)
    setNewTeamMember({ name: '', role: '', email: '', phone: '' })
  }

  // Calculate financial metrics for hero section
  const totalBudget = budget.reduce((sum, item) => sum + (item.original_amount || 0), 0)
  const committed = commitments.reduce((sum, c) => sum + (c.contract_amount || 0), 0)
  const spent = 0 // TODO: Implement cost tracking
  const forecastedCost = totalBudget // TODO: Implement cost forecasting

  // Change orders don't have an 'amount' field in the schema, so we'll count them instead
  const changeOrdersTotal = changeOrders.filter(co => co.status === 'approved').length
  const activeTasks = tasks.length

  // Calculate project setup steps completion
  const projectSteps = [
    { id: "prime-contract", label: "Prime Contract", completed: contracts.length > 0 },
    { id: "cost-codes", label: "Cost Codes", completed: budget.length > 0 },
    { id: "budget", label: "Budget", completed: budget.length > 0 },
    { id: "schedule", label: "Schedule", completed: schedule.length > 0 },
    { id: "project-team", label: "Project Team", completed: project.team_members && Array.isArray(project.team_members) && project.team_members.length > 0 },
    { id: "sov", label: "SOV", completed: sov.length > 0 },
    { id: "commitments", label: "Commitments", completed: commitments.length > 0 },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-6 max-w-[1800px] mx-auto">
      {/* Header Section - Refined Architectural Hierarchy */}
      <header className="mb-4 pb-4 sm:mb-8 sm:pb-8">
        {/* Client Pre-heading */}
        <div className="mb-2 sm:mb-4">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
            {project.client || ''}
          </p>
        </div>

        {/* Project Title - Editorial Typography with Enhanced Scale */}
        <div className="mb-4 sm:mb-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold tracking-tight text-neutral-900 leading-[1.05]">
            {project.name || project['job number']}
          </h1>

          {/* Project Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 rounded-sm justify-between px-4 bg-brand text-white hover:bg-brand/90 transition-colors md:w-auto md:justify-center"
              >
                <span className="text-sm font-medium">{currentTool}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-screen sm:max-w-4xl rounded-lg border-neutral-200 p-4 sm:p-8 shadow-lg max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
                {/* Core Tools */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-neutral-500">
                    Core Tools
                  </h3>
                  <div className="space-y-1">
                    {coreTools.map((tool) => (
                      <Link
                        key={tool.name}
                        href={`/${project.id}${tool.href}`}
                        onClick={() => setCurrentTool(tool.name)}
                        className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
                      >
                        <span className="text-neutral-900">{tool.name}</span>
                        {tool.badge && (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            {tool.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Project Management */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-neutral-500">
                    Project Management
                  </h3>
                  <div className="space-y-1">
                    {projectManagementTools.map((tool) => (
                      <Link
                        key={tool.name}
                        href={`/${project.id}${tool.href}`}
                        onClick={() => setCurrentTool(tool.name)}
                        className="flex w-full items-center rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-neutral-900">
                          {tool.isFavorite && <Star className="h-3.5 w-3.5 text-neutral-400" />}
                          {tool.name}
                          {tool.hasCreateAction && (
                            <Plus className="ml-1 h-4 w-4 rounded-full bg-orange-500 p-0.5 text-white" />
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Financial Management */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-neutral-500">
                    Financial Management
                  </h3>
                  <div className="space-y-1">
                    {financialManagementTools.map((tool) => (
                      <Link
                        key={tool.name}
                        href={`/${project.id}${tool.href}`}
                        onClick={() => setCurrentTool(tool.name)}
                        className="flex w-full items-center rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-neutral-900">
                          {tool.name}
                          {tool.hasCreateAction && (
                            <Plus className="ml-1 h-4 w-4 rounded-full bg-orange-500 p-0.5 text-white" />
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Row - Clean, Aligned Data Points with Better Spacing */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-8">
          
          {/* Status */}
          <button
            type="button"
            className="group w-full cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
            onClick={() => handleEditField('phase', project.phase || project.state || 'Active')}
          >
            {isEditing === 'phase' ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand flex-shrink-0" />
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveField('phase')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveField('phase')}
                  className="h-9 w-36 border-neutral-300 focus:border-brand focus:ring-brand/20"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand flex-shrink-0" />
                <span className={`text-sm font-medium tabular-nums ${project.phase || project.state ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {project.phase || project.state || 'Active' || 'Edit'}
                </span>
                <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </button>

          {/* Start Date */}
          <button
            type="button"
            className="group w-full cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
            onClick={() => handleEditField('start date', project['start date'] ? format(new Date(project['start date']), 'yyyy-MM-dd') : '')}
          >
            {isEditing === 'start date' ? (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand flex-shrink-0" />
                <Input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveField('start date')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveField('start date')}
                  className="h-9 w-44 border-neutral-300 focus:border-brand focus:ring-brand/20"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand flex-shrink-0" />
                <span className={`text-sm font-medium tabular-nums ${project['start date'] ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {project['start date'] ? format(new Date(project['start date']), 'MMM d, yyyy') : 'Start Date'}
                </span>
                <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </button>

          {/* Est Completion */}
          <button
            type="button"
            className="group w-full cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
            onClick={() => handleEditField('est completion', project['est completion'] ? format(new Date(project['est completion']), 'yyyy-MM-dd') : '')}
          >
            {isEditing === 'est completion' ? (
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-brand flex-shrink-0" />
                <Input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveField('est completion')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveField('est completion')}
                  className="h-9 w-44 border-neutral-300 focus:border-brand focus:ring-brand/20"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-brand flex-shrink-0" />
                <span className={`text-sm font-medium tabular-nums ${project['est completion'] ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {project['est completion'] ? format(new Date(project['est completion']), 'MMM d, yyyy') : 'Est Completion'}
                </span>
                <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </button>

            {/* State */}
            <button
              type="button"
              className="group w-full cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
              onClick={() => handleEditField('state', project.state || '')}
            >
              {isEditing === 'state' ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand flex-shrink-0" />
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveField('state')}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveField('state')}
                    className="h-9 w-28 border-neutral-300 focus:border-brand focus:ring-brand/20"
                    placeholder="CA, NY, TX, etc."
                    maxLength={2}
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand flex-shrink-0" />
                  <span className={`text-sm font-medium ${project.state ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {project.state || 'State'}
                  </span>
                  <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </button>


        </div>
      </header>

      {/* Hero Metrics - Executive Dashboard KPIs */}
      <HeroMetrics
        projectId={project.id.toString()}
        totalBudget={totalBudget}
        committed={committed}
        spent={spent}
        forecastedCost={forecastedCost}
        changeOrdersTotal={changeOrdersTotal}
        activeTasks={0}
      />

      {/* 2 Column - Summary, Team, and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4 lg:gap-10">

        {/* Project Summary - Takes 2 columns */}
        <div className="lg:col-span-2">
          <EditableSummary
            summary={project.summary || 'No project summary available.'}
            onSave={handleSaveSummary}
          />

          {/* Project Information Section - Architectural Layout */}
      <div className="mt-12 mb-6">

        <div className="gap-2">
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

        </div>

        {/* Right Column */}
        <div className="mb-8">

        {/* Stats */}
          <div>

          {/* Project Team */}
        <div className="border border-neutral-200 bg-white p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
            <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
              Project Team
            </h3>
            <Dialog open={isAddTeamMemberOpen} onOpenChange={setIsAddTeamMemberOpen}>
              <DialogTrigger asChild>
                <button type="button" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-brand transition-colors duration-200">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </DialogTrigger>
              <DialogContent className="border border-neutral-200">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif font-light">Add Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500">Name</Label>
                    <Input
                      id="name"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      placeholder="John Doe"
                      className="border-neutral-300 focus:border-brand focus:ring-brand/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500">Role</Label>
                    <Input
                      id="role"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      placeholder="Project Manager"
                      className="border-neutral-300 focus:border-brand focus:ring-brand/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                      placeholder="john@example.com"
                      className="border-neutral-300 focus:border-brand focus:ring-brand/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500">Phone</Label>
                    <Input
                      id="phone"
                      value={newTeamMember.phone}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="border-neutral-300 focus:border-brand focus:ring-brand/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsAddTeamMemberOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={handleAddTeamMember} className="px-5 py-2.5 text-sm font-medium bg-brand text-white hover:bg-brand-dark transition-colors">
                    Add Member
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {project.team_members && Array.isArray(project.team_members) && project.team_members.length > 0 ? (
              project.team_members.map((member, index) => {
                const memberName = typeof member === 'string' ? member : (member as Record<string, unknown>)?.name || 'Team Member'
                const memberRole = typeof member === 'object' && member !== null && (member as Record<string, unknown>)?.role ? (member as Record<string, unknown>).role : 'Role not specified'
                const initials = typeof member === 'string' ? member.substring(0, 2).toUpperCase() : 'TM'

                return (
                  <div key={`team-${project.id}-${index}`} className="flex items-center gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                    <Avatar className="h-10 w-10 border border-neutral-200">
                      <AvatarFallback className="bg-neutral-100 text-neutral-600 text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-neutral-900 truncate">{String(memberName)}</p>
                      <p className="text-xs text-neutral-500 truncate">{String(memberRole)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-neutral-400 mb-2">No team members</p>
                <p className="text-xs text-neutral-400">Click &quot;Add&quot; to assign team</p>
              </div>
            )}
          </div>
        </div>

          {/* Recent Meetings */}
          <div className="border border-neutral-200 bg-white p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand" />
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                  Recent Meetings
                </h3>
              </div>
              <Link
                href={`/${project.id}/meetings`}
                className="text-xs text-neutral-500 font-medium hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {meetings.slice(0, 3).map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/${project.id}/meetings/${meeting.id}`}
                  className="block group"
                >
                  <div className="text-sm font-medium text-neutral-900 group-hover:text-brand truncate transition-colors">
                    {meeting.title || 'Untitled Meeting'}
                  </div>
                  {meeting.date && (
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {format(new Date(meeting.date), 'MMM d, yyyy')}
                    </div>
                  )}
                </Link>
              ))}
              {meetings.length === 0 && (
                <p className="text-sm text-neutral-400">No recent meetings</p>
              )}
            </div>
          </div>

          {/* Critical Items */}
          <div className="border border-neutral-200 bg-white p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-brand" />
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                  Requires Attention
                </h3>
              </div>

              <span className="text-2xl font-light tabular-nums text-neutral-900">
                {tasks.filter(t => t.priority === 'high').length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.priority === 'high').slice(0, 3).map((task) => (
                <div key={task.id} className="text-sm text-neutral-700 truncate">
                  {task.task_description}
                </div>
              ))}
              {tasks.filter(t => t.priority === 'high').length === 0 && (
                <p className="text-sm text-neutral-400">No critical items</p>
              )}
            </div>
          </div>

          {/* RFI's */}
          <div className="border border-neutral-200 bg-white p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" />
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                  RFI&apos;s
                </h3>
              </div>

              <span className="text-2xl font-light tabular-nums text-neutral-900">
                {tasks.filter(t => t.priority === 'high').length}
              </span>
            </div>
            <div className="space-y-3">
              {rfis.slice(0, 3).map((rfi) => (
                <div key={rfi.id} className="text-sm text-neutral-700 truncate">
                  RFI #{rfi.number || rfi.id}
                </div>
              ))}
              {rfis.length === 0 && (
                <p className="text-sm text-neutral-400">No active RFIs</p>
              )}
            </div>
          </div>

           </div>

        </div>
      </div>

      {/* Drawings */}
      <div className="mb-20">

        {/* Heading */}
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
            Drawings
          </h2>
        </div>
        
      </div>

      {/* Photos */}
      <div className="mb-20">

        {/* Heading */}
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
            Photos
          </h2>
        </div>

      </div>

          </div>
        </div>
        <ProjectSidebar projectSteps={projectSteps} />
      </div>
    </SidebarProvider>
  )
}
