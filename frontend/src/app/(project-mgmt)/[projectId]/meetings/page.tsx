import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, Video } from 'lucide-react'

import { EmptyState, PageHeader, StatCard } from '@/components/design-system'
import { PageContainer } from '@/components/layout/PageContainer'

import { MeetingsTableWrapper } from './meetings-table-wrapper'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectMeetingsPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  // Fetch project info for header
  const { data: project } = await supabase
    .from('projects')
    .select('name, client')
    .eq('id', projectId)
    .single()

  if (!project) {
    notFound()
  }

  // Fetch meetings for this project
  const { data: meetings, error } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('project_id', projectId)
    .eq('type', 'meeting')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching meetings:', error)
  }

  // Calculate meeting statistics
  const totalMeetings = meetings?.length || 0
  const thisMonth = meetings?.filter(m => {
    if (!m.date) return false
    const meetingDate = new Date(m.date)
    const now = new Date()
    return meetingDate.getMonth() === now.getMonth() &&
           meetingDate.getFullYear() === now.getFullYear()
  }).length || 0

  const withRecordings = meetings?.filter(m => m.fireflies_link || m.video || m.audio).length || 0
  const totalParticipants = meetings?.reduce((acc, m) => {
    if (!m.participants) return acc
    return acc + m.participants.split(',').length
  }, 0) || 0
  const avgParticipants = totalMeetings > 0 ? Math.round(totalParticipants / totalMeetings) : 0

  return (
    <PageContainer>
      <PageHeader
        client={project.client || undefined}
        title="Meetings"
        description="Project meeting notes, recordings, and transcripts"
      />

      {/* Meeting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard
          label="Total Meetings"
          value={totalMeetings}
          icon={Calendar}
        />
        <StatCard
          label="This Month"
          value={thisMonth}
          icon={Clock}
        />
        <StatCard
          label="With Recordings"
          value={withRecordings}
          icon={Video}
        />
        <StatCard
          label="Avg. Participants"
          value={avgParticipants}
          icon={User}
        />
      </div>

      {/* Meetings Table */}
      {!meetings || meetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No meetings found"
          description="No meeting records for this project yet. Meetings will appear here once they are uploaded or synced from your meeting platform."
        />
      ) : (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
              Meeting History
            </h2>
            <p className="text-sm text-neutral-500">
              {totalMeetings} {totalMeetings === 1 ? 'meeting' : 'meetings'} recorded
            </p>
          </div>

          <MeetingsTableWrapper meetings={meetings || []} projectId={projectId} />
        </div>
      )}
    </PageContainer>
  )
}
