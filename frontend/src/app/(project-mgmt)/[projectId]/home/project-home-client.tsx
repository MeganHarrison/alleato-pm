'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Pencil, Calendar, FileText, AlertCircle } from 'lucide-react'
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
import { HeroMetrics } from './hero-metrics'
import { EditableSummary } from './editable-summary'
import { ProjectAccordions } from '@/components/project-accordions'
import type { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

  // Calculate financial metrics for hero section
  const totalBudget = budget.reduce((sum, item) => sum + (item.original_budget_amount || 0), 0)
  const committed = commitments.reduce((sum, c) => sum + (c.contract_amount || 0), 0)
  const spent = budget.reduce((sum, item) => sum + (item.direct_cost || 0), 0)
  const forecastedCost = budget.reduce((sum, item) => sum + (item.projected_cost || item.original_budget_amount || 0), 0)

  // Change orders don't have an 'amount' field in the schema, so we'll count them instead
  const changeOrdersTotal = changeOrders.filter(co => co.status === 'approved').length
  const activeTasks = tasks.length

  return (
    <div className="min-h-screen bg-neutral-50 px-6 md:px-10 lg:px-12 py-12 max-w-[1800px] mx-auto">
      {/* Header Section - Refined Architectural Hierarchy */}
      <header className="mb-20 pb-12 border-b border-neutral-200">
        {/* Client Pre-heading */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
            {project.client || 'No client assigned'}
          </p>
        </div>

        {/* Project Title - Editorial Typography with Enhanced Scale */}
        <div className="mb-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-neutral-900 leading-[1.05] mb-4">
            {project.name || project['job number']}
          </h1>
        </div>

        {/* Status Row - Clean, Aligned Data Points with Better Spacing */}
        <div className="flex flex-wrap items-center gap-8 md:gap-16">
          {/* Status */}
          <button
            type="button"
            className="group cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
            onClick={() => handleEditField('phase', project.phase || project.state || 'Active')}
          >
            {isEditing === 'phase' ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveField('phase')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveField('phase')}
                  className="h-9 w-36 border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
                  autoFocus
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900 tabular-nums">
                    {project.phase || project.state || 'Active'}
                  </span>
                  <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
          </button>

          {/* Start Date */}
          <button
            type="button"
            className="group cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
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
                  className="h-9 w-44 border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
                  autoFocus
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                  Start Date
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900 tabular-nums">
                    {project['start date'] ? format(new Date(project['start date']), 'MMM d, yyyy') : 'Not set'}
                  </span>
                  <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
          </button>

          {/* Est Completion */}
          <button
            type="button"
            className="group cursor-pointer hover:opacity-70 transition-opacity duration-200 border-0 bg-transparent text-left p-0"
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
                  className="h-9 w-44 border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
                  autoFocus
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                  Est. Completion
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900 tabular-nums">
                    {project['est completion'] ? format(new Date(project['est completion']), 'MMM d, yyyy') : 'Not set'}
                  </span>
                  <Pencil className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Hero Metrics - Executive Dashboard KPIs */}
      <HeroMetrics
        totalBudget={totalBudget}
        committed={committed}
        spent={spent}
        forecastedCost={forecastedCost}
        changeOrdersTotal={changeOrdersTotal}
        activeTasks={activeTasks}
      />

      {/* Project Overview Grid - Summary, Team, and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
        {/* Project Summary - Takes 2 columns */}
        <div className="lg:col-span-2">
          <EditableSummary
            summary={project.summary || 'No project summary available.'}
            onSave={handleSaveSummary}
          />
        </div>

        {/* Project Team */}
        <div className="border border-neutral-200 bg-white p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
            <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
              Project Team
            </h3>
            <Dialog open={isAddTeamMemberOpen} onOpenChange={setIsAddTeamMemberOpen}>
              <DialogTrigger asChild>
                <button type="button" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-[#DB802D] transition-colors duration-200">
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
                      className="border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500">Role</Label>
                    <Input
                      id="role"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      placeholder="Project Manager"
                      className="border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
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
                      className="border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500">Phone</Label>
                    <Input
                      id="phone"
                      value={newTeamMember.phone}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="border-neutral-300 focus:border-[#DB802D] focus:ring-[#DB802D]/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button type="button" onClick={() => setIsAddTeamMemberOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={handleAddTeamMember} className="px-5 py-2.5 text-sm font-medium bg-[#DB802D] text-white hover:bg-[#C4701F] transition-colors">
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
                <p className="text-xs text-neutral-400">Click “Add” to assign team</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-20">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
            Recent Activity
          </h2>
          <p className="text-sm text-neutral-500">Latest updates and project events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Meetings */}
          <Link
            href={`/${project.id}/meetings`}
            className="group border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-[#DB802D] hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <Calendar className="h-5 w-5 text-[#DB802D] mb-3" />
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                  Recent Meetings
                </h3>
              </div>
              <span className="text-2xl font-light tabular-nums text-neutral-900">
                {meetings.length}
              </span>
            </div>
            <div className="space-y-3">
              {meetings.slice(0, 3).map((meeting) => (
                <div key={meeting.id} className="text-sm text-neutral-700 truncate">
                  {meeting.title || 'Untitled Meeting'}
                </div>
              ))}
              {meetings.length === 0 && (
                <p className="text-sm text-neutral-400">No recent meetings</p>
              )}
            </div>
          </Link>

          {/* Active RFIs */}
          <Link
            href={`/${project.id}/rfis`}
            className="group border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-[#DB802D] hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <FileText className="h-5 w-5 text-[#DB802D] mb-3" />
                <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                  Active RFIs
                </h3>
              </div>
              <span className="text-2xl font-light tabular-nums text-neutral-900">
                {rfis.filter(r => r.status !== 'closed').length}
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
          </Link>

          {/* Critical Items */}
          <div className="border border-neutral-200 bg-white p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <AlertCircle className="h-5 w-5 text-[#DB802D] mb-3" />
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
        </div>
      </div>

      {/* Project Information Section - Architectural Layout */}
      <div className="mb-6">
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500 mb-6">
            Project Information
          </h2>
        </div>
        <div className="border border-neutral-200 bg-white">
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
  )
}
