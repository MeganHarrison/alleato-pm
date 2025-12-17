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
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { FormattedTranscript } from '@/app/(project-mgmt)/meetings/[id]/formatted-transcript'

interface PageProps {
  params: Promise<{ projectId: string; id: string }>
}

export default async function ProjectMeetingDetailPage({ params }: PageProps) {
  const { projectId, id } = await params
  const supabase = await createClient()

  // Fetch meeting metadata
  const { data: meeting, error } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !meeting) {
    notFound()
  }

  // Fetch meeting segments for better organization
  const { data: segments } = await supabase
    .from('meeting_segments')
    .select('*')
    .eq('metadata_id', id)
    .order('segment_index', { ascending: true })

  // Fetch transcript content
  let transcriptContent = null

  // First, check if content is directly in document_metadata
  if (meeting.content) {
    transcriptContent = meeting.content
  } else {
    // Check both 'url' and 'source' columns for the storage URL
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
      // Fallback: Try to fetch from documents table
      const { data: document } = await supabase
        .from('documents')
        .select('content')
        .eq('metadata_id', id)
        .single()

      transcriptContent = document?.content
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Link href={`/${projectId}/meetings`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project Meetings
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {meeting.title || 'Untitled Meeting'}
          </h1>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meeting.date && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold text-sm">
                      {format(new Date(meeting.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
          )}

          {meeting.duration && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{meeting.duration} min</p>
                  </div>
                </div>
          )}


          {meeting.type && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="secondary" className="font-semibold">
                      {meeting.type}
                    </Badge>
                  </div>
                </div>
          )}

          {meeting.category && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="outline" className="font-semibold">
                      {meeting.category}
                    </Badge>
                  </div>
                </div>
          )}

          {meeting.project && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project</p>
                    <Badge variant="outline" className="font-semibold">
                      {meeting.project}
                    </Badge>
                  </div>
                </div>
          )}
        </div>

        {/* Participants Section */}
        {meeting.participants && (
              <div className="flex flex-wrap gap-2">
                {meeting.participants.split(',').map((participant, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                    <User className="h-3 w-3 mr-1.5" />
                    {participant.trim()}
                  </Badge>
                ))}
              </div>
        )}

        {/* External Links */}
        {(meeting.url || meeting.source || meeting.fireflies_link) && (
          <div className="flex gap-3">
            {(meeting.url || meeting.source) && (
              <a href={meeting.url || meeting.source} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Source
                </Button>
              </a>
            )}
            {meeting.fireflies_link && (
              <a href={meeting.fireflies_link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Fireflies Recording
                </Button>
              </a>
            )}
          </div>
        )}

        <div>
                    <p className="text-base">
            {meeting.summary || 'No summary available'}
          </p>
        </div>

        <Separator />

        {/* Meeting Segments */}
        {segments && segments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Meeting Topics</h2>
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <Card key={segment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl">
                          {segment.title || `Topic ${index + 1}`}
                        </CardTitle>
                        {segment.summary && (
                          <CardDescription className="text-base">
                            {segment.summary}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {segment.segment_index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  {(segment.decisions || segment.risks || segment.tasks) && (
                    <CardContent className="space-y-4">
                      {segment.decisions && Array.isArray(segment.decisions) && segment.decisions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Decisions</h4>
                          <ul className="space-y-1">
                            {segment.decisions.map((decision: any, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>{typeof decision === 'string' ? decision : decision.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {segment.risks && Array.isArray(segment.risks) && segment.risks.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Risks</h4>
                          <ul className="space-y-1">
                            {segment.risks.map((risk: any, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">⚠</span>
                                <span>{typeof risk === 'string' ? risk : risk.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {segment.tasks && Array.isArray(segment.tasks) && segment.tasks.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Action Items</h4>
                          <ul className="space-y-1">
                            {segment.tasks.map((task: any, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">→</span>
                                <span>{typeof task === 'string' ? task : task.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Full Transcript */}
        {transcriptContent && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Full Transcript</h2>
            <FormattedTranscript content={transcriptContent} />
          </div>
        )}

        {/* Show message if no transcript */}
        {!transcriptContent && (!segments || segments.length === 0) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transcript available</h3>
                <p className="text-muted-foreground">
                  The full transcript for this meeting has not been processed yet.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
