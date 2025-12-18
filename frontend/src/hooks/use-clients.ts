'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

export interface Client {
  id: number
  name: string | null
  company_id: string | null
  status: string | null
  created_at: string
  // Joined company data
  company?: {
    id: string
    name: string
    address: string | null
    city: string | null
    state: string | null
  } | null
}

export interface ClientOption {
  value: string
  label: string
}

interface UseClientsOptions {
  // Filter clients by search term
  search?: string
  // Filter by status
  status?: 'active' | 'inactive' | null
  // Limit number of results
  limit?: number
  // Whether to auto-fetch on mount
  enabled?: boolean
}

interface UseClientsReturn {
  clients: Client[]
  options: ClientOption[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createClient: (client: Partial<Client>) => Promise<Client | null>
}

/**
 * Hook for fetching clients from Supabase
 * Clients are linked to companies and represent project owners
 */
export function useClients(options: UseClientsOptions = {}): UseClientsReturn {
  const { search, status, limit = 100, enabled = true } = options
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchClients = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('clients')
        .select(`
          *,
          company:companies(id, name, address, city, state)
        `)
        .order('name', { ascending: true })
        .limit(limit)

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        throw new Error(queryError.message)
      }

      setClients(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'))
    } finally {
      setIsLoading(false)
    }
  }, [search, status, limit, enabled])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const createClientRecord = useCallback(async (client: Partial<Client> & { company_name?: string }): Promise<Client | null> => {
    try {
      const supabase = createClient()
      let companyId = client.company_id || null

      if (!companyId && client.company_name) {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: client.company_name,
          })
          .select('id')
          .single()

        if (companyError) {
          throw new Error(companyError.message)
        }
        companyId = company?.id || null
      }

      const { data, error: insertError } = await supabase
        .from('clients')
        .insert({
          name: client.name || '',
          company_id: companyId,
          status: client.status || 'active',
        })
        .select(`
          *,
          company:companies(id, name, address, city, state)
        `)
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Refetch to update the list
      await fetchClients()
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create client'))
      return null
    }
  }, [fetchClients])

  // Transform clients to options for dropdowns
  const clientOptions: ClientOption[] = clients.map((client) => ({
    value: client.id.toString(),
    label: client.name || 'Unnamed Client',
  }))

  return {
    clients,
    options: clientOptions,
    isLoading,
    error,
    refetch: fetchClients,
    createClient: createClientRecord,
  }
}
