import { createClient } from '@/lib/supabase/server'
import { GenericDataTable, type GenericTableConfig } from '@/components/tables/generic-table-factory'
import { Database } from '@/types/database.types'

type Risk = Database['public']['Tables']['risks']['Row']

const config: GenericTableConfig = {
  title: 'Risks',
  description: 'Track and manage project risks',
  searchFields: ['description', 'category', 'owner_name', 'mitigation_plan'],
  exportFilename: 'risks-export.csv',
  editConfig: {
    tableName: 'risks',
    editableFields: ['description', 'category', 'status', 'impact', 'likelihood', 'owner_name', 'mitigation_plan'],
  },
  columns: [
    {
      id: 'description',
      label: 'Description',
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
      id: 'status',
      label: 'Status',
      defaultVisible: true,
      renderConfig: {
        type: 'badge',
        variantMap: {
          'open': 'destructive',
          'mitigated': 'default',
          'closed': 'outline',
        },
        defaultVariant: 'outline',
      },
    },
    {
      id: 'impact',
      label: 'Impact',
      defaultVisible: true,
      renderConfig: {
        type: 'badge',
        variantMap: {
          'high': 'destructive',
          'medium': 'default',
          'low': 'outline',
        },
        defaultVariant: 'outline',
      },
    },
    {
      id: 'likelihood',
      label: 'Likelihood',
      defaultVisible: true,
      renderConfig: {
        type: 'badge',
        variantMap: {
          'high': 'destructive',
          'medium': 'default',
          'low': 'outline',
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
      id: 'mitigation_plan',
      label: 'Mitigation Plan',
      defaultVisible: false,
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
        { value: 'open', label: 'Open' },
        { value: 'mitigated', label: 'Mitigated' },
        { value: 'closed', label: 'Closed' },
      ],
    },
    {
      id: 'impact',
      label: 'Impact',
      field: 'impact',
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      id: 'likelihood',
      label: 'Likelihood',
      field: 'likelihood',
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
  ],
  rowClickPath: '/risks/{id}',
}

export default async function RisksPage() {
  const supabase = await createClient()

  const { data: risks, error } = await supabase
    .from('risks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching risks:', error)
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
          <div className="text-center text-red-600">
            Error loading risks. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 py-12">
        <GenericDataTable data={risks || []} config={config} />
      </div>
    </div>
  )
}
