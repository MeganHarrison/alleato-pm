'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

export interface Commitment {
  id: number
  number: string | null
  title: string | null
  contract_company_id: string | null
  status: string | null
  type: string | null
  original_amount: number | null
  revised_contract_amount: number | null
  balance_to_finish: number | null
  approved_change_orders: number | null
  executed_date: string | null
  start_date: string | null
  substantial_completion_date: string | null
  created_at: string
  // Joined data
  contract_company?: {
    id: string
    name: string | null
  } | null
}

export interface CommitmentOption {
  value: string
  label: string
  commitmentNumber?: string
  type?: string
  amount?: number
}

interface UseCommitmentsOptions {
  // Filter commitments by search term
  search?: string
  // Filter by status
  status?: string
  // Filter by type (subcontract, purchase_order)
  type?: string
  // Filter by company ID
  companyId?: string
  // Limit number of results
  limit?: number
  // Whether to auto-fetch on mount
  enabled?: boolean
}

interface UseCommitmentsReturn {
  commitments: Commitment[]
  options: CommitmentOption[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createCommitment: (commitment: Partial<Commitment>) => Promise<Commitment | null>
}

/**
 * Hook for fetching commitments (subcontracts and purchase orders) from Supabase
 * Used in change order forms, invoice forms, etc.
 */
export function useCommitments(options: UseCommitmentsOptions = {}): UseCommitmentsReturn {
  const { search, status, type, companyId, limit = 100, enabled = true } = options
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCommitments = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('commitments')
        .select(`
          *,
          contract_company:companies!contract_company_id(id, name)
        `)
        .order('number', { ascending: true })
        .limit(limit)

      if (search) {
        query = query.or(`number.ilike.%${search}%,title.ilike.%${search}%`)
      }

      if (status) {
        query = query.eq('status', status)
      }

      if (type) {
        query = query.eq('type', type)
      }

      if (companyId) {
        query = query.eq('contract_company_id', companyId)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        throw new Error(queryError.message)
      }

      setCommitments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch commitments'))
    } finally {
      setIsLoading(false)
    }
  }, [search, status, type, companyId, limit, enabled])

  useEffect(() => {
    fetchCommitments()
  }, [fetchCommitments])

  const createCommitment = useCallback(async (commitment: Partial<Commitment>): Promise<Commitment | null> => {
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('commitments')
        .insert({
          number: commitment.number,
          title: commitment.title,
          contract_company_id: commitment.contract_company_id,
          status: commitment.status || 'draft',
          type: commitment.type || 'subcontract',
          original_amount: commitment.original_amount || 0,
          revised_contract_amount: commitment.original_amount || 0,
          balance_to_finish: commitment.original_amount || 0,
          approved_change_orders: 0,
        })
        .select(`
          *,
          contract_company:companies!contract_company_id(id, name)
        `)
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Refetch to update the list
      await fetchCommitments()
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create commitment'))
      return null
    }
  }, [fetchCommitments])

  // Transform commitments to options for dropdowns
  const commitmentOptions: CommitmentOption[] = commitments.map((commitment) => {
    const typeLabel = commitment.type === 'purchase_order' ? 'PO' : 'SC'
    const companyName = commitment.contract_company?.name || ''
    const label = commitment.number
      ? `${commitment.number} - ${commitment.title || companyName || 'Untitled'}`
      : `${typeLabel} #${commitment.id}`

    return {
      value: commitment.id.toString(),
      label,
      commitmentNumber: commitment.number || undefined,
      type: commitment.type || undefined,
      amount: commitment.revised_contract_amount || commitment.original_amount || undefined,
    }
  })

  return {
    commitments,
    options: commitmentOptions,
    isLoading,
    error,
    refetch: fetchCommitments,
    createCommitment,
  }
}
