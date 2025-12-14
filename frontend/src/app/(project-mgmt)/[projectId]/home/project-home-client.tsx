'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditableCard } from './editable-card'
import { EditableSummary } from './editable-summary'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'

type Project = Database['public']['Tables']['projects']['Row']
type Insight = Database['public']['Tables']['ai_insights']['Row']
type Task = Database['public']['Tables']['project_tasks']['Row']
type Meeting = Database['public']['Tables']['document_metadata']['Row']
type ChangeOrder = Database['public']['Tables']['change_orders']['Row']
type RFI = Database['public']['Tables']['rfis']['Row']
type DailyLog = Database['public']['Tables']['daily_logs']['Row']

interface ProjectHomeClientProps {
  project: Project
  insights: Insight[]
  tasks: Task[]
  meetings: Meeting[]
  changeOrders: ChangeOrder[]
  rfis: RFI[]
  dailyLogs: DailyLog[]
}

export function ProjectHomeClient({
  project,
  insights,
  tasks,
  meetings,
  changeOrders,
  rfis,
  dailyLogs
}: ProjectHomeClientProps) {
  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Project Title */}
      <h1 className="text-2xl font-semibold text-orange-600 mb-6">
        {project.name || project.code}
      </h1>

      {/* Three Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Overview Card */}
        <EditableCard
          title="OVERVIEW"
          fields={[
            {
              label: 'Client',
              value: project.client || 'N/A',
              key: 'client'
            },
            {
              label: 'Status',
              value: project.phase || project.status || 'Active',
              key: 'phase'
            },
            {
              label: 'Start Date',
              value: project.start_date ? format(new Date(project.start_date), 'yyyy-MM-dd') : '',
              key: 'start_date'
            },
            {
              label: 'Est Completion',
              value: project.end_date ? format(new Date(project.end_date), 'yyyy-MM-dd') : '',
              key: 'end_date'
            }
          ]}
          onSave={handleSaveProject}
        />

        {/* Project Team Card */}
        <Card className="shadow-sm">
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-4">PROJECT TEAM</h3>
            <div className="space-y-3">
              {project.team_members ? (
                Object.entries(project.team_members as Record<string, string>).slice(0, 4).map(([role, name]) => (
                  <div key={role}>
                    <span className="text-sm font-medium">{role}:</span>
                    <span className="text-sm text-gray-700 ml-1">{name}</span>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <span className="text-sm font-medium">Owner:</span>
                    <span className="text-sm text-gray-700 ml-1">Not assigned</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">PM:</span>
                    <span className="text-sm text-gray-700 ml-1">Not assigned</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Estimator:</span>
                    <span className="text-sm text-gray-700 ml-1">Not assigned</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Superintendent:</span>
                    <span className="text-sm text-gray-700 ml-1">Not assigned</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Financials Card */}
        <EditableCard
          title="FINANCIALS"
          fields={[
            {
              label: 'Est Revenue',
              value: project.budget_total ? (project.budget_total / 1000000).toFixed(1) : '0',
              key: 'budget_total'
            },
            {
              label: 'Est Profit',
              value: project.budget_total ? ((project.budget_total * 0.2) / 1000000).toFixed(1) : '0',
              key: 'estimated_profit'
            },
            {
              label: 'Budget Used',
              value: project.budget_used ? (project.budget_used / 1000000).toFixed(1) : '0',
              key: 'budget_used'
            },
            {
              label: 'Balance',
              value: project.budget_total && project.budget_used
                ? ((project.budget_total - project.budget_used) / 1000000).toFixed(1)
                : '0',
              key: 'budget_balance'
            }
          ]}
          onSave={async (updates) => {
            // Convert million values back to actual values
            const converted: Record<string, string> = {}
            if (updates.budget_total) {
              converted.budget_total = (parseFloat(updates.budget_total) * 1000000).toString()
            }
            if (updates.budget_used) {
              converted.budget_used = (parseFloat(updates.budget_used) * 1000000).toString()
            }
            await handleSaveProject(converted)
          }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Summary, Insights, RFIs */}
        <div className="space-y-6">
          {/* Summary - Collapsible and Editable */}
          <EditableSummary
            summary={project.summary || project.description || 'No project summary available.'}
            onSave={handleSaveSummary}
          />

          {/* Project Insights */}
          <div>
            <h2 className="text-lg font-semibold text-orange-600 mb-3">Project Insights:</h2>
            {insights.length > 0 ? (
              <div className="space-y-2">
                {insights.map((insight) => (
                  <div key={insight.id}>
                    <p className="text-sm font-medium">
                      {insight.created_at ? format(new Date(insight.created_at), 'MMM d, yyyy') : 'No date'}
                    </p>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No insights available yet.</p>
            )}
          </div>

          {/* RFIs */}
          <div>
            <h2 className="text-lg font-semibold text-orange-600 mb-3">RFIs</h2>
            {rfis.length > 0 ? (
              <div className="space-y-2">
                {rfis.map((rfi) => (
                  <div key={rfi.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium">#{rfi.number} - {rfi.subject}</p>
                        <p className="text-sm text-gray-600 mt-1">{rfi.question}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Status: {rfi.status}</span>
                          {rfi.due_date && (
                            <span>Due: {format(new Date(rfi.due_date), 'MMM d')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No RFIs submitted yet.</p>
            )}
          </div>

        </div>

        {/* Right Column - Tasks */}
        <div>
          <h2 className="text-lg font-semibold text-orange-600 mb-3">Tasks</h2>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex-1">
                    <span className="text-sm">{task.task_description}</span>
                    {task.due_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                  {task.assigned_to && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {task.assigned_to.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No active tasks.</p>
          )}
        </div>
      </div>

      {/* Tabbed Section */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="meetings" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-auto p-0">
              <TabsTrigger value="meetings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Meetings</TabsTrigger>
              <TabsTrigger value="insights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Insights</TabsTrigger>
              <TabsTrigger value="files" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Files</TabsTrigger>
              <TabsTrigger value="reports" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Reports</TabsTrigger>
              <TabsTrigger value="schedule" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Schedule</TabsTrigger>
              <TabsTrigger value="expenses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Expenses</TabsTrigger>
              <TabsTrigger value="subs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Subs</TabsTrigger>
              <TabsTrigger value="change-orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600">Change Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="meetings" className="p-6">
              {meetings.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium text-sm">Title</th>
                      <th className="pb-3 font-medium text-sm">Summary</th>
                      <th className="pb-3 font-medium text-sm">Date</th>
                      <th className="pb-3 font-medium text-sm">Duration</th>
                      <th className="pb-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.map((meeting) => (
                      <tr key={meeting.id} className="border-b">
                        <td className="py-3">
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-sm">{meeting.title}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {meeting.transcript_summary
                            ? meeting.transcript_summary.substring(0, 100) + '...'
                            : 'No summary available'}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {meeting.date ? format(new Date(meeting.date), 'MMM d, yyyy') : 'N/A'}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {meeting.duration_minutes ? `${meeting.duration_minutes} min` : 'N/A'}
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">No meetings recorded yet.</p>
              )}
            </TabsContent>

            <TabsContent value="insights" className="p-6">
              <p className="text-sm text-gray-600">Insights content goes here</p>
            </TabsContent>

            <TabsContent value="files" className="p-6">
              <p className="text-sm text-gray-600">Files content goes here</p>
            </TabsContent>

            <TabsContent value="reports" className="p-6">
              {dailyLogs.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium text-sm">Date</th>
                      <th className="pb-3 font-medium text-sm">Weather</th>
                      <th className="pb-3 font-medium text-sm">Created By</th>
                      <th className="pb-3 font-medium text-sm">Created At</th>
                      <th className="pb-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="py-3 text-sm">
                          {format(new Date(log.log_date), 'MMM d, yyyy')}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {log.weather_conditions
                            ? (typeof log.weather_conditions === 'object'
                              ? (log.weather_conditions as { description?: string }).description || 'N/A'
                              : 'N/A')
                            : 'N/A'}
                        </td>
                        <td className="py-3 text-sm text-gray-600">{log.created_by || 'N/A'}</td>
                        <td className="py-3 text-sm text-gray-600">
                          {log.created_at ? format(new Date(log.created_at), 'MMM d, yyyy') : 'N/A'}
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">No daily reports yet.</p>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="p-6">
              <p className="text-sm text-gray-600">Schedule content goes here</p>
            </TabsContent>

            <TabsContent value="expenses" className="p-6">
              <p className="text-sm text-gray-600">Expenses content goes here</p>
            </TabsContent>

            <TabsContent value="subs" className="p-6">
              <p className="text-sm text-gray-600">Subs content goes here</p>
            </TabsContent>

            <TabsContent value="change-orders" className="p-6">
              {changeOrders.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium text-sm">Number</th>
                      <th className="pb-3 font-medium text-sm">Title</th>
                      <th className="pb-3 font-medium text-sm">Status</th>
                      <th className="pb-3 font-medium text-sm">Amount</th>
                      <th className="pb-3 font-medium text-sm">Created</th>
                      <th className="pb-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {changeOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3 text-sm">{order.co_number || `CO-${order.id}`}</td>
                        <td className="py-3 text-sm">{order.title || 'Untitled'}</td>
                        <td className="py-3 text-sm text-gray-600">{order.status || 'Draft'}</td>
                        <td className="py-3 text-sm">TBD</td>
                        <td className="py-3 text-sm text-gray-600">
                          {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : 'N/A'}
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">No change orders yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
