import { createClient } from '@/lib/supabase/server'
import { GenericDataTable, type GenericTableConfig } from '@/components/tables/generic-table-factory'
import { Database } from '@/types/database.types'

type MeetingSegment = Database['public']['Tables']['meeting_segments']['Row']

const config: GenericTableConfig = {
  title: 'Meeting Segments',
  description: 'Chunked meeting content for AI analysis and retrieval',
  searchFields: ['title', 'summary'],
  exportFilename: 'meeting-segments-export.csv',
  editConfig: {
    tableName: 'meeting_segments',
    editableFields: ['title', 'summary', 'segment_index', 'start_time', 'end_time', 'topics', 'participants', 'key_points'],
  },
  columns: [
    {
      id: 'title',
      label: 'Title',
      defaultVisible: true,
      type: 'text',
    },
    {
      id: 'summary',
      label: 'Summary',
      defaultVisible: true,
      renderConfig: {
        type: 'truncate',
        maxLength: 100,
      },
    },
    {
      id: 'segment_index',
      label: 'Segment #',
      defaultVisible: true,
      type: 'number',
    },
    {
      id: 'start_index',
      label: 'Start Index',
      defaultVisible: false,
      type: 'number',
    },
    {
      id: 'end_index',
      label: 'End Index',
      defaultVisible: false,
      type: 'number',
    },
    {
      id: 'decisions',
      label: 'Decisions',
      defaultVisible: true,
      renderConfig: {
        type: 'array',
        itemType: 'text',
        separator: ', ',
      },
    },
    {
      id: 'tasks',
      label: 'Tasks',
      defaultVisible: true,
      renderConfig: {
        type: 'array',
        itemType: 'text',
        separator: ', ',
      },
    },
    {
      id: 'risks',
      label: 'Risks',
      defaultVisible: true,
      renderConfig: {
        type: 'array',
        itemType: 'text',
        separator: ', ',
      },
    },
    {
      id: 'created_at',
      label: 'Created',
      defaultVisible: true,
      type: 'date',
    },
    {
      id: 'updated_at',
      label: 'Updated',
      defaultVisible: false,
      type: 'date',
    },
  ],
  rowClickPath: '/meeting-segments/{id}',
}

export default async function MeetingSegmentsPage() {
  const supabase = await createClient()

  const { data: meetingSegments, error } = await supabase
    .from('meeting_segments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching meeting segments:', error)
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
          <div className="text-center text-red-600">
            Error loading meeting segments. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
        <GenericDataTable data={meetingSegments || []} config={config} />
      </div>
    </div>
  )
}
