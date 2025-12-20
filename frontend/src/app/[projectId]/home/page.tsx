import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import { ProjectHomeClient } from './project-home-client'

export default async function ProjectHomePage({ 
  params 
}: {
  params: Promise<{ projectId: string }>
}) {
  const supabase = createServiceClient()
  const { projectId } = await params
  const numericProjectId = parseInt(projectId, 10)

  // Validate projectId is a valid number
  if (isNaN(numericProjectId)) {
    notFound()
  }

  // Fetch project data with all related information in parallel
  const [
    projectResult,
    insightsResult,
    tasksResult,
    meetingsResult,
    changeOrdersResult,
    rfisResult,
    dailyLogsResult,
    commitmentsResult,
    contractsResult,
    budgetResult,
    changeEventsResult,
    scheduleResult
  ] = await Promise.all([
    // Fetch main project data
    supabase
      .from('projects')
      .select('*')
      .eq('id', numericProjectId)
      .single(),

    // Fetch project insights from ai_insights table
    supabase
      .from('ai_insights')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('created_at', { ascending: false })
      .limit(3),

    // Fetch tasks
    supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', numericProjectId)
      .neq('status', 'completed')
      .order('due_date', { ascending: true })
      .limit(4),

    // Fetch meetings from document_metadata
    supabase
      .from('document_metadata')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('date', { ascending: false })
      .limit(5),

    // Fetch change orders
    supabase
      .from('change_orders')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Fetch RFIs
    supabase
      .from('rfis')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Fetch daily logs/reports
    supabase
      .from('daily_logs')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('log_date', { ascending: false })
      .limit(5),

    // Fetch commitments
    supabase
      .from('commitments')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('created_at', { ascending: false }),

    // Fetch contracts
    supabase
      .from('financial_contracts')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('created_at', { ascending: false }),

    // Fetch budget items
    supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('cost_code_id', { ascending: true }),

    // Fetch change events
    supabase
      .from('change_events')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('created_at', { ascending: false }),

    // Fetch schedule tasks
    supabase
      .from('schedule_tasks')
      .select('*')
      .eq('project_id', numericProjectId)
      .order('start_date', { ascending: true })
  ])

  if (projectResult.error || !projectResult.data) {
    notFound()
  }

  const project = projectResult.data
  const insights = insightsResult.data || []
  const tasks = tasksResult.data || []
  const meetings = meetingsResult.data || []
  const changeOrders = changeOrdersResult.data || []
  const rfis = rfisResult.data || []
  const dailyLogs = dailyLogsResult.data || []
  const commitments = commitmentsResult.data || []
  const contracts = contractsResult.data || []
  const budget = budgetResult.data || []
  const changeEvents = changeEventsResult.data || []
  const schedule = scheduleResult.data || []

  return (
    <ProjectHomeClient
      project={project}
      insights={insights}
      tasks={tasks}
      meetings={meetings}
      changeOrders={changeOrders}
      rfis={rfis}
      dailyLogs={dailyLogs}
      commitments={commitments}
      contracts={contracts}
      budget={budget}
      changeEvents={changeEvents}
      schedule={schedule}
    />
  )
}