/**
 * Project Intelligence Queries
 *
 * Fetches risks, opportunities, and tasks for specific projects
 * from Supabase using the project_ids array relationship
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Risk {
  id: string
  description: string
  category: string | null
  likelihood: string | null
  impact: string | null
  status: string
  metadata_id: string
  segment_id: string | null
  project_ids: number[]
  mitigation_plan: string | null
  created_at: string
  document_metadata?: {
    id: string
    title: string
    fireflies_id: string
  } | null
}

export interface Opportunity {
  id: string
  description: string
  type: string | null
  status: string
  metadata_id: string
  segment_id: string | null
  project_ids: number[]
  owner_name: string | null
  created_at: string
  document_metadata?: {
    id: string
    title: string
    fireflies_id: string
  } | null
}

export interface Task {
  id: string
  description: string
  assignee_name: string | null
  assignee_email: string | null
  due_date: string | null
  priority: string | null
  status: string
  metadata_id: string
  segment_id: string | null
  project_ids: number[]
  created_at: string
  document_metadata?: {
    id: string
    title: string
    fireflies_id: string
  } | null
}

export interface ProjectIntelligence {
  risks: Risk[]
  opportunities: Opportunity[]
  tasks: Task[]
  errors: {
    risks: Error | null
    opportunities: Error | null
    tasks: Error | null
  }
}

/**
 * Fetch all intelligence (risks, opportunities, tasks) for a specific project
 *
 * Uses the project_ids array field to filter intelligence items.
 * Joins with document_metadata to show which meeting each item came from.
 *
 * @param projectId - The project ID to query
 * @returns Object containing arrays of risks, opportunities, and tasks
 */
export async function getProjectIntelligence(projectId: number): Promise<ProjectIntelligence> {
  // Query risks for this project
  const { data: risks, error: risksError } = await supabase
    .from('risks')
    .select(`
      id,
      description,
      category,
      likelihood,
      impact,
      status,
      metadata_id,
      segment_id,
      project_ids,
      mitigation_plan,
      created_at,
      document_metadata (
        id,
        title,
        fireflies_id
      )
    `)
    .contains('project_ids', [projectId])
    .order('created_at', { ascending: false })

  // Query opportunities
  const { data: opportunities, error: oppsError } = await supabase
    .from('opportunities')
    .select(`
      id,
      description,
      type,
      status,
      metadata_id,
      segment_id,
      project_ids,
      owner_name,
      created_at,
      document_metadata (
        id,
        title,
        fireflies_id
      )
    `)
    .contains('project_ids', [projectId])
    .order('created_at', { ascending: false })

  // Query tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select(`
      id,
      description,
      assignee_name,
      assignee_email,
      due_date,
      priority,
      status,
      metadata_id,
      segment_id,
      project_ids,
      created_at,
      document_metadata (
        id,
        title,
        fireflies_id
      )
    `)
    .contains('project_ids', [projectId])
    .order('created_at', { ascending: false })

  // Fix document_metadata arrays to single objects
  const processedRisks = risks?.map(risk => ({
    ...risk,
    document_metadata: Array.isArray(risk.document_metadata) 
      ? risk.document_metadata[0] || null 
      : risk.document_metadata
  })) as Risk[] || []

  const processedOpportunities = opportunities?.map(opp => ({
    ...opp,
    document_metadata: Array.isArray(opp.document_metadata) 
      ? opp.document_metadata[0] || null 
      : opp.document_metadata
  })) as Opportunity[] || []

  const processedTasks = tasks?.map(task => ({
    ...task,
    document_metadata: Array.isArray(task.document_metadata) 
      ? task.document_metadata[0] || null 
      : task.document_metadata
  })) as Task[] || []

  return {
    risks: processedRisks,
    opportunities: processedOpportunities,
    tasks: processedTasks,
    errors: {
      risks: risksError,
      opportunities: oppsError,
      tasks: tasksError
    }
  }
}

/**
 * Get summary counts of intelligence items for a project
 */
export async function getProjectIntelligenceCounts(projectId: number) {
  const [risksCount, oppsCount, tasksCount] = await Promise.all([
    supabase
      .from('risks')
      .select('id', { count: 'exact', head: true })
      .contains('project_ids', [projectId]),
    supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true })
      .contains('project_ids', [projectId]),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .contains('project_ids', [projectId])
  ])

  return {
    risks: risksCount.count || 0,
    opportunities: oppsCount.count || 0,
    tasks: tasksCount.count || 0,
    total: (risksCount.count || 0) + (oppsCount.count || 0) + (tasksCount.count || 0)
  }
}

/**
 * Get only open/active items for a project
 */
export async function getActiveProjectIntelligence(projectId: number) {
  const { data: risks } = await supabase
    .from('risks')
    .select('*')
    .contains('project_ids', [projectId])
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .contains('project_ids', [projectId])
    .in('status', ['open', 'in_review'])
    .order('created_at', { ascending: false })

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .contains('project_ids', [projectId])
    .in('status', ['open', 'in_progress'])
    .order('due_date', { ascending: true })

  return {
    risks: risks || [],
    opportunities: opportunities || [],
    tasks: tasks || []
  }
}
