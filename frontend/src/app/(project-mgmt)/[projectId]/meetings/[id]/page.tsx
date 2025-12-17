import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import {
  Calendar,
  User,
  FileText,
  ExternalLink,
  ArrowLeft,
  Clock,
  Tag,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  ListTodo,
  Sparkles
} from 'lucide-react'
import { PageHeader } from '@/components/design-system'
import Link from 'next/link'
import { FormattedTranscript } from '@/app/(project-mgmt)/meetings/[id]/formatted-transcript'

interface PageProps {
  params: Promise<{ projectId: string; id: string }>
}

export default async function ProjectMeetingDetailPage({ params }: PageProps) {
  const { projectId, id } = await params
  const supabase = await createClient()

  // Fetch project info
  const { data: project } = await supabase
    .from('projects')
    .select('name, client')
    .eq('id', projectId)
    .single()

  // Fetch meeting metadata
  const { data: meeting, error } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !meeting) {
    notFound()
  }

  // Fetch meeting segments
  const { data: segments } = await supabase
    .from('meeting_segments')
    .select('*')
    .eq('metadata_id', id)
    .order('segment_index', { ascending: true })

  // Aggregate all outcomes from segments
  const allTasks: string[] = []
  const allRisks: string[] = []
  const allDecisions: string[] = []
  const allOpportunities: string[] = []

  segments?.forEach(segment => {
    if (segment.tasks && Array.isArray(segment.tasks)) {
      segment.tasks.forEach((task: unknown) => {
        const text = typeof task === 'string' ? task : (task as Record<string, unknown>)?.description
        if (text) allTasks.push(String(text))
      })
    }
    if (segment.risks && Array.isArray(segment.risks)) {
      segment.risks.forEach((risk: unknown) => {
        const text = typeof risk === 'string' ? risk : (risk as Record<string, unknown>)?.description
        if (text) allRisks.push(String(text))
      })
    }
    if (segment.decisions && Array.isArray(segment.decisions)) {
      segment.decisions.forEach((decision: unknown) => {
        const text = typeof decision === 'string' ? decision : (decision as Record<string, unknown>)?.description
        if (text) allDecisions.push(String(text))
      })
    }
    if (segment.opportunities && Array.isArray(segment.opportunities)) {
      segment.opportunities.forEach((opportunity: unknown) => {
        const text = typeof opportunity === 'string' ? opportunity : (opportunity as Record<string, unknown>)?.description
        if (text) allOpportunities.push(String(text))
      })
    }
  })

  // Fetch transcript content
  let transcriptContent = null

  if (meeting.content) {
    transcriptContent = meeting.content
  } else {
    const storageUrl = meeting.url || meeting.source

    if (storageUrl && storageUrl.includes('supabase.co/storage')) {
      try {
        const response = await fetch(storageUrl)
        if (response.ok) {
          transcriptContent = await response.text()
        }
      } catch (error) {
        console.error('Error fetching transcript:', error)
      }
    } else {
      const { data: document } = await supabase
        .from('documents')
        .select('content')
        .eq('metadata_id', id)
        .single()

      transcriptContent = document?.content
    }
  }

  const participantsList = meeting.participants?.split(',').map((p: string) => p.trim()) || []

  return (
    <div className="min-h-screen bg-neutral-50 px-6 md:px-10 lg:px-12 py-12 max-w-[1800px] mx-auto">
      {/* Back Button */}
      <Link
        href={`/${projectId}/meetings`}
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#DB802D] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Meetings
      </Link>

      <PageHeader
        client={project?.client || undefined}
        title={meeting.title || 'Untitled Meeting'}
        description={meeting.summary || undefined}
      />

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {meeting.date && (
          <div className="border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-4 w-4 text-[#DB802D]" />
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                Date
              </p>
            </div>
            <p className="text-lg font-light text-neutral-900">
              {format(new Date(meeting.date), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        )}

        {meeting.duration && (
          <div className="border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-4 w-4 text-[#DB802D]" />
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                Duration
              </p>
            </div>
            <p className="text-lg font-light text-neutral-900">
              {meeting.duration} minutes
            </p>
          </div>
        )}

        {meeting.type && (
          <div className="border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-3">
              <Tag className="h-4 w-4 text-[#DB802D]" />
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                Type
              </p>
            </div>
            <p className="text-lg font-light text-neutral-900">
              {meeting.type}
            </p>
          </div>
        )}

        {participantsList.length > 0 && (
          <div className="border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-4 w-4 text-[#DB802D]" />
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
                Participants
              </p>
            </div>
            <p className="text-lg font-light text-neutral-900">
              {participantsList.length} {participantsList.length === 1 ? 'person' : 'people'}
            </p>
          </div>
        )}
      </div>

      {/* Participants List */}
      {participantsList.length > 0 && (
        <div className="border border-neutral-200 bg-white p-8 mb-16">
          <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500 mb-6">
            Attendees
          </h3>
          <div className="flex flex-wrap gap-3">
            {participantsList.map((participant, index) => (
              <span
                key={index}
                className="px-4 py-2 text-sm bg-neutral-50 border border-neutral-200 text-neutral-700"
              >
                {participant}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {(meeting.url || meeting.source || meeting.fireflies_link) && (
        <div className="flex flex-wrap gap-3 mb-16">
          {(meeting.url || meeting.source) && (
            <a
              href={meeting.url || meeting.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 bg-white hover:border-[#DB802D] hover:bg-[#DB802D]/5 transition-all duration-300 text-sm font-medium text-neutral-900"
            >
              <FileText className="h-4 w-4" />
              View Source Document
            </a>
          )}
          {meeting.fireflies_link && (
            <a
              href={meeting.fireflies_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 bg-white hover:border-[#DB802D] hover:bg-[#DB802D]/5 transition-all duration-300 text-sm font-medium text-neutral-900"
            >
              <ExternalLink className="h-4 w-4" />
              Fireflies Recording
            </a>
          )}
        </div>
      )}

      {/* Meeting Outcomes */}
      {(allDecisions.length > 0 || allTasks.length > 0 || allRisks.length > 0 || allOpportunities.length > 0) && (
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
              Meeting Outcomes
            </h2>
            <p className="text-sm text-neutral-500">
              Key decisions, action items, and insights from this meeting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Decisions */}
            {allDecisions.length > 0 && (
              <div className="border border-neutral-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                  <h3 className="text-lg font-serif font-light text-neutral-900">
                    Decisions ({allDecisions.length})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {allDecisions.map((decision, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                      <span className="text-green-700 mt-0.5">•</span>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {allTasks.length > 0 && (
              <div className="border border-neutral-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ListTodo className="h-5 w-5 text-blue-700" />
                  <h3 className="text-lg font-serif font-light text-neutral-900">
                    Action Items ({allTasks.length})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {allTasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                      <span className="text-blue-700 mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks */}
            {allRisks.length > 0 && (
              <div className="border border-neutral-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="h-5 w-5 text-amber-700" />
                  <h3 className="text-lg font-serif font-light text-neutral-900">
                    Risks ({allRisks.length})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {allRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                      <span className="text-amber-700 mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opportunities */}
            {allOpportunities.length > 0 && (
              <div className="border border-neutral-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-5 w-5 text-purple-700" />
                  <h3 className="text-lg font-serif font-light text-neutral-900">
                    Opportunities ({allOpportunities.length})
                  </h3>
                </div>
                <ul className="space-y-3">
                  {allOpportunities.map((opportunity, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                      <span className="text-purple-700 mt-0.5">•</span>
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meeting Topics/Segments */}
      {segments && segments.length > 0 && (
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
              Discussion Topics
            </h2>
            <p className="text-sm text-neutral-500">
              {segments.length} {segments.length === 1 ? 'topic' : 'topics'} covered
            </p>
          </div>

          <div className="space-y-6">
            {segments.map((segment, index) => (
              <div key={segment.id} className="border border-neutral-200 bg-white p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-serif font-light text-neutral-900 flex-1">
                    {segment.title || `Topic ${index + 1}`}
                  </h3>
                  <span className="px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {segment.segment_index + 1}
                  </span>
                </div>

                {segment.summary && (
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {segment.summary}
                  </p>
                )}

                {/* Segment-specific outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                  {segment.decisions && Array.isArray(segment.decisions) && segment.decisions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-3">
                        Decisions
                      </h4>
                      <ul className="space-y-2">
                        {segment.decisions.map((decision: unknown, idx: number) => {
                          const text = typeof decision === 'string' ? decision : (decision as Record<string, unknown>)?.description
                          return (
                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                              <span className="text-green-700">✓</span>
                              <span>{String(text)}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  {segment.tasks && Array.isArray(segment.tasks) && segment.tasks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-3">
                        Action Items
                      </h4>
                      <ul className="space-y-2">
                        {segment.tasks.map((task: unknown, idx: number) => {
                          const text = typeof task === 'string' ? task : (task as Record<string, unknown>)?.description
                          return (
                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                              <span className="text-blue-700">→</span>
                              <span>{String(text)}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  {segment.risks && Array.isArray(segment.risks) && segment.risks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-3">
                        Risks
                      </h4>
                      <ul className="space-y-2">
                        {segment.risks.map((risk: unknown, idx: number) => {
                          const text = typeof risk === 'string' ? risk : (risk as Record<string, unknown>)?.description
                          return (
                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                              <span className="text-amber-700">⚠</span>
                              <span>{String(text)}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  {segment.opportunities && Array.isArray(segment.opportunities) && segment.opportunities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-3">
                        Opportunities
                      </h4>
                      <ul className="space-y-2">
                        {segment.opportunities.map((opportunity: unknown, idx: number) => {
                          const text = typeof opportunity === 'string' ? opportunity : (opportunity as Record<string, unknown>)?.description
                          return (
                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                              <span className="text-purple-700">✨</span>
                              <span>{String(text)}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Transcript */}
      {transcriptContent && (
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-light tracking-tight text-neutral-900 mb-2">
              Full Transcript
            </h2>
            <p className="text-sm text-neutral-500">
              Complete meeting recording transcript
            </p>
          </div>
          <FormattedTranscript content={transcriptContent} />
        </div>
      )}

      {/* Empty State */}
      {!transcriptContent && (!segments || segments.length === 0) && (
        <div className="border border-neutral-200 bg-white p-12 md:p-16 text-center">
          <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-6" strokeWidth={1.5} />
          <h3 className="text-2xl font-serif font-light text-neutral-900 tracking-tight mb-3">
            No transcript available
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
            The full transcript for this meeting has not been processed yet.
          </p>
        </div>
      )}
    </div>
  )
}
