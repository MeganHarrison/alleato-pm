"use client"

import React from 'react'
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CheckSquare,
  Lightbulb,
  Send,
  FolderOpen,
  Image
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface ProjectAccordionsProps {
  projectId: string
  meetings?: any[]
  budget?: any[]
  primeContracts?: any[]
  changeOrders?: any[]
  changeEvents?: any[]
  schedule?: any[]
  sov?: any[]
  rfis?: any[]
  tasks?: any[]
  insights?: any[]
  submittals?: any[]
  documents?: any[]
  drawings?: any[]
}

export function ProjectAccordions({
  projectId,
  meetings = [],
  budget = [],
  primeContracts = [],
  changeOrders = [],
  changeEvents = [],
  schedule = [],
  sov = [],
  rfis = [],
  tasks = [],
  insights = [],
  submittals = [],
  documents = [],
  drawings = []
}: ProjectAccordionsProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
      case 'closed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
      case 'in-progress':
      case 'open':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'rejected':
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full space-y-8">

        {/* Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0 * 0.1 }}
        >
        <AccordionItem value="meetings" className="px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand" />
                <span className="font-medium">Meetings</span>
                <Badge variant="secondary">{meetings.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/meetings`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {meetings.length > 0 ? (
                meetings.slice(0, 5).map((meeting) => (
                  <div key={meeting.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {meeting.date && format(new Date(meeting.date), 'MMM d, yyyy')}
                        {meeting.duration && ` • ${meeting.duration} min`}
                      </p>
                    </div>
                    <Link href={`/${projectId}/meetings/${meeting.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No meetings recorded</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Budget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 * 0.1 }}
        >
        <AccordionItem value="budget" className="px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-brand" />
                <span className="font-medium">Budget</span>
                <Badge variant="secondary">{budget.length} items</Badge>
              </div>
              <Link
                href={`/${projectId}/budget`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View Details <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {budget.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="p-3 bg-muted/50">
                      <p className="text-xs text-muted-foreground">Original Budget</p>
                      <p className="font-semibold">{formatCurrency(budget.reduce((sum, item) => sum + (item.original_budget || 0), 0))}</p>
                    </div>
                    <div className="p-3 bg-muted/50">
                      <p className="text-xs text-muted-foreground">Revised Budget</p>
                      <p className="font-semibold">{formatCurrency(budget.reduce((sum, item) => sum + (item.revised_budget || item.original_budget || 0), 0))}</p>
                    </div>
                    <div className="p-3 bg-muted/50">
                      <p className="text-xs text-muted-foreground">Variance</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(budget.reduce((sum, item) => sum + ((item.revised_budget || item.original_budget || 0) - (item.committed_cost || 0)), 0))}
                      </p>
                    </div>
                  </div>
                  <Link href={`/${projectId}/budget/line-item/new`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-3 w-3 mr-1" /> Add Budget Item
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No budget items created</p>
                  <Link href={`/${projectId}/budget/line-item/new`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Create Budget
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Prime Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2 * 0.1 }}
        >
        <AccordionItem value="prime-contracts" className="px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" />
                <span className="font-medium">Prime Contracts</span>
                <Badge variant="secondary">{primeContracts.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/contracts`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {primeContracts.length > 0 ? (
                primeContracts.map((contract) => (
                  <div key={contract.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">{contract.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium">Contract Value:</span>
                        <span className="text-foreground font-semibold">{formatCurrency(contract.amount || 0)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {getStatusIcon(contract.status)}
                        <span className="text-muted-foreground">{contract.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No prime contracts</p>
                  <Link href={`/${projectId}/contracts/new`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Create Contract
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Change Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 3 * 0.1 }}
        >
        <AccordionItem value="change-orders" className="px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-brand" />
                <span className="font-medium">Change Orders</span>
                <Badge variant="secondary">{changeOrders.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/change-orders`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {changeOrders.length > 0 ? (
                changeOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatCurrency(order.amount || 0)}</span>
                        <span>{order.status}</span>
                      </div>
                    </div>
                    {getStatusIcon(order.status)}
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No change orders</p>
                  <Link href={`/${projectId}/change-orders/new`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Create Change Order
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Change Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 4 * 0.1 }}
        >
        <AccordionItem value="change-events" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-brand" />
                <span className="font-medium">Change Events</span>
                <Badge variant="secondary">{changeEvents.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/change-events`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {changeEvents.length > 0 ? (
                changeEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-muted/50">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No change events recorded</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 5 * 0.1 }}
        >
        <AccordionItem value="schedule" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand" />
                <span className="font-medium">Schedule</span>
                <Badge variant="secondary">{schedule.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/schedule`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View Schedule <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {schedule.length > 0 ? (
                schedule.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{item.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.start_date && format(new Date(item.start_date), 'MMM d')} - 
                        {item.end_date && format(new Date(item.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {getStatusIcon(item.status)}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No schedule items</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Schedule of Values (SOV) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 6 * 0.1 }}
        >
        <AccordionItem value="sov" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" />
                <span className="font-medium">Schedule of Values</span>
                <Badge variant="secondary">{sov.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/sov`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View SOV <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {sov.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-muted/50">
                      <p className="text-xs text-muted-foreground">Total Value</p>
                      <p className="font-semibold">{formatCurrency(sov.reduce((sum, item) => sum + (item.scheduled_value || 0), 0))}</p>
                    </div>
                    <div className="p-3 bg-muted/50">
                      <p className="text-xs text-muted-foreground">Work Completed</p>
                      <p className="font-semibold">{formatCurrency(sov.reduce((sum, item) => sum + (item.work_completed || 0), 0))}</p>
                    </div>
                  </div>
                  {sov.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 bg-muted/50 mb-2">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-sm font-medium">{formatCurrency(item.scheduled_value || 0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3">No schedule of values created</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* RFIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 7 * 0.1 }}
        >
        <AccordionItem value="rfis" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" />
                <span className="font-medium">RFIs</span>
                <Badge variant="secondary">{rfis.length}</Badge>
                {rfis.filter(r => r.status === 'open').length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {rfis.filter(r => r.status === 'open').length} Open
                  </Badge>
                )}
              </div>
              <Link
                href={`/${projectId}/rfis`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {rfis.length > 0 ? (
                rfis.slice(0, 5).map((rfi) => (
                  <div key={rfi.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">RFI #{rfi.number}</p>
                        {getStatusIcon(rfi.status)}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{rfi.question}</p>
                      <p className="text-xs text-muted-foreground">
                        {rfi.created_at && format(new Date(rfi.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No RFIs submitted</p>
                  <Link href={`/${projectId}/rfis/new`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Create RFI
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 8 * 0.1 }}
        >
        <AccordionItem value="tasks" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-brand" />
                <span className="font-medium">Tasks</span>
                <Badge variant="secondary">{tasks.length}</Badge>
                {tasks.filter(t => t.status !== 'completed').length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {tasks.filter(t => t.status !== 'completed').length} Active
                  </Badge>
                )}
              </div>
              <Link
                href={`/${projectId}/tasks`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">{task.task_description || task.title}</p>
                      <div className="flex items-center gap-2 text-xs">
                        {getStatusIcon(task.status)}
                        <span className="text-muted-foreground">{task.status}</span>
                        {task.due_date && (
                          <span className="text-muted-foreground">
                            • Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No tasks assigned</p>
                  <Link href={`/${projectId}/tasks/new`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Create Task
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 9 * 0.1 }}
        >
        <AccordionItem value="insights" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-brand" />
                <span className="font-medium">AI Insights</span>
                <Badge variant="secondary">{insights.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/insights`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {insights.length > 0 ? (
                insights.slice(0, 5).map((insight) => (
                  <div key={insight.id} className="p-3 bg-muted/50">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{insight.category || 'General'}</p>
                      <Badge variant="outline" className="text-xs">
                        {insight.priority || 'Medium'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{insight.insight_text || insight.content}</p>
                    {insight.created_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(insight.created_at), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No AI insights generated yet</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Submittals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 10 * 0.1 }}
        >
        <AccordionItem value="submittals" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-brand" />
                <span className="font-medium">Submittals</span>
                <Badge variant="secondary">{submittals.length}</Badge>
                {submittals.filter(s => s.status === 'pending').length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {submittals.filter(s => s.status === 'pending').length} Pending
                  </Badge>
                )}
              </div>
              <Link
                href={`/${projectId}/submittals`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {submittals.length > 0 ? (
                submittals.slice(0, 5).map((submittal) => (
                  <div key={submittal.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">{submittal.title || `Submittal #${submittal.number}`}</p>
                      <div className="flex items-center gap-2 text-xs">
                        {getStatusIcon(submittal.status)}
                        <span className="text-muted-foreground">{submittal.status}</span>
                        {submittal.spec_section && (
                          <span className="text-muted-foreground">• Section {submittal.spec_section}</span>
                        )}
                      </div>
                      {submittal.created_at && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(submittal.created_at), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No submittals created</p>
                  <Link href={`/${projectId}/submittals/new`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Create Submittal
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 11 * 0.1 }}
        >
        <AccordionItem value="documents" className="border px-2 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-brand" />
                <span className="font-medium">Documents</span>
                <Badge variant="secondary">{documents.length}</Badge>
              </div>
              <Link
                href={`/${projectId}/documents`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {documents.length > 0 ? (
                documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-start justify-between p-3 bg-muted/50">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">{doc.title || doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.type || 'Document'}</span>
                        {doc.file_size && <span>• {(doc.file_size / 1024).toFixed(1)} KB</span>}
                      </div>
                      {doc.created_at && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(doc.created_at), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-3">No documents uploaded</p>
                  <Link href={`/${projectId}/documents/upload`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Upload Document
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>


      </Accordion>
    </div>
  )
}