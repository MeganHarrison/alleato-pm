import { createClient } from '@/lib/supabase/server'
import { GenericDataTable, type GenericTableConfig } from '@/components/tables/generic-table-factory'
import { Database } from '@/types/database.types'

type Opportunity = Database['public']['Tables']['opportunities']['Row']

const config: GenericTableConfig = {
  title: 'Opportunities',
  description: 'Track and pursue business opportunities',
  searchFields: ['description', 'type', 'owner_name', 'next_step'],
  exportFilename: 'opportunities-export.csv',
  editConfig: {
    tableName: 'opportunities',
    editableFields: ['description', 'type', 'status', 'owner_name', 'owner_email', 'next_step'],
  },
  columns: [
    {
      id: 'description',
      label: 'Description',
      defaultVisible: true,
      type: 'text',
    },
    {
      id: 'type',
      label: 'Type',
      defaultVisible: true,
      type: 'badge',
    },
    {
      id: 'status',
      label: 'Status',
      defaultVisible: true,
      renderConfig: {
        type: 'badge',
        variantMap: {
          'identified': 'outline',
          'pursuing': 'default',
          'won': 'default',
          'lost': 'outline',
        },
        defaultVariant: 'outline',
      },
    },
    {
      id: 'owner_name',
      label: 'Owner',
      defaultVisible: true,
      type: 'text',
    },
    {
      id: 'owner_email',
      label: 'Owner Email',
      defaultVisible: false,
      type: 'email',
    },
    {
      id: 'next_step',
      label: 'Next Step',
      defaultVisible: true,
      type: 'text',
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
  filters: [
    {
      id: 'status',
      label: 'Status',
      field: 'status',
      options: [
        { value: 'identified', label: 'Identified' },
        { value: 'pursuing', label: 'Pursuing' },
        { value: 'won', label: 'Won' },
        { value: 'lost', label: 'Lost' },
      ],
    },
    {
      id: 'type',
      label: 'Type',
      field: 'type',
      options: [
        { value: 'cost_savings', label: 'Cost Savings' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'efficiency', label: 'Efficiency' },
        { value: 'quality', label: 'Quality' },
      ],
    },
  ],
  rowClickPath: '/opportunities/{id}',
}

export default async function OpportunitiesPage() {
  const supabase = await createClient()

  const { data: opportunities, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching opportunities:', error)
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
          <div className="text-center text-red-600">
            Error loading opportunities. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
        <GenericDataTable data={opportunities || []} config={config} />
      </div>
    </div>
  )
}
