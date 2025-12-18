import { createClient } from '@/lib/supabase/server'
import { GenericDataTable, type GenericTableConfig } from '@/components/tables/generic-table-factory'
import { Database } from '@/types/database.types'

type Issue = Database['public']['Tables']['issues']['Row']

const config: GenericTableConfig = {
  title: 'Issues',
  description: 'Track and manage project issues',
  searchFields: ['title', 'description', 'reported_by', 'notes'],
  exportFilename: 'issues-export.csv',
  editConfig: {
    tableName: 'issues',
    editableFields: ['title', 'category', 'severity', 'status', 'reported_by', 'date_reported', 'date_resolved', 'total_cost', 'direct_cost', 'indirect_cost', 'description', 'notes'],
  },
  columns: [
    {
      id: 'title',
      label: 'Title',
      defaultVisible: true,
      type: 'text',
    },
    {
      id: 'category',
      label: 'Category',
      defaultVisible: true,
      type: 'badge',
    },
    {
      id: 'severity',
      label: 'Severity',
      defaultVisible: true,
      renderConfig: {
        type: 'badge',
        variantMap: {
          'critical': 'destructive',
          'high': 'destructive',
          'medium': 'default',
          'low': 'outline',
        },
        defaultVariant: 'outline',
      },
    },
    {
      id: 'status',
      label: 'Status',
      defaultVisible: true,
      renderConfig: {
        type: 'badge',
        variantMap: {
          'open': 'destructive',
          'in_progress': 'default',
          'resolved': 'outline',
          'closed': 'outline',
        },
        defaultVariant: 'outline',
      },
    },
    {
      id: 'reported_by',
      label: 'Reported By',
      defaultVisible: true,
      type: 'text',
    },
    {
      id: 'date_reported',
      label: 'Date Reported',
      defaultVisible: true,
      type: 'date',
    },
    {
      id: 'date_resolved',
      label: 'Date Resolved',
      defaultVisible: false,
      type: 'date',
    },
    {
      id: 'total_cost',
      label: 'Total Cost',
      defaultVisible: true,
      renderConfig: {
        type: 'currency',
        prefix: '$',
      },
    },
    {
      id: 'direct_cost',
      label: 'Direct Cost',
      defaultVisible: false,
      renderConfig: {
        type: 'currency',
        prefix: '$',
      },
    },
    {
      id: 'indirect_cost',
      label: 'Indirect Cost',
      defaultVisible: false,
      renderConfig: {
        type: 'currency',
        prefix: '$',
      },
    },
    {
      id: 'description',
      label: 'Description',
      defaultVisible: false,
      type: 'text',
    },
    {
      id: 'notes',
      label: 'Notes',
      defaultVisible: false,
      type: 'text',
    },
    {
      id: 'created_at',
      label: 'Created',
      defaultVisible: false,
      type: 'date',
    },
  ],
  filters: [
    {
      id: 'category',
      label: 'Category',
      field: 'category',
      options: [
        { value: 'safety', label: 'Safety' },
        { value: 'quality', label: 'Quality' },
        { value: 'schedule', label: 'Schedule' },
        { value: 'cost', label: 'Cost' },
        { value: 'technical', label: 'Technical' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'severity',
      label: 'Severity',
      field: 'severity',
      options: [
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      field: 'status',
      options: [
        { value: 'open', label: 'Open' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' },
      ],
    },
  ],
  rowClickPath: '/issues/{id}',
}

export default async function IssuesPage() {
  const supabase = await createClient()

  const { data: issues, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching issues:', error)
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
          <div className="text-center text-red-600">
            Error loading issues. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
        <GenericDataTable data={issues || []} config={config} />
      </div>
    </div>
  )
}
