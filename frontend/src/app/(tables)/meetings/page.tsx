import { createClient } from '@/lib/supabase/server'
import { MeetingsDataTable } from '@/components/tables/meetings-data-table'

export default async function MeetingsPage() {
  const supabase = await createClient()

  // Fetch all meetings from document_metadata table
  const { data: meetings, error } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('type', 'meeting')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching meetings:', error)
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-600">
          Error loading meetings. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            View and manage all your meetings
          </p>
        </div>
        <MeetingsDataTable meetings={meetings || []} />
      </div>
    </div>
  )
}
