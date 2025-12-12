'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

export interface Contact {
  id: number
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  role: string | null
  department: string | null
  birthday: string | null
  notes: string | null
  projects: string[] | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface ContactOption {
  value: string
  label: string
  email?: string
  role?: string
}

interface UseContactsOptions {
  // Filter contacts by search term
  search?: string
  // Filter by role
  role?: string
  // Filter by department
  department?: string
  // Limit number of results
  limit?: number
  // Whether to auto-fetch on mount
  enabled?: boolean
}

interface UseContactsReturn {
  contacts: Contact[]
  options: ContactOption[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createContact: (contact: Partial<Contact>) => Promise<Contact | null>
}

/**
 * Hook for fetching contacts from Supabase
 * Used in privacy settings, assignee dropdowns, etc.
 */
export function useContacts(options: UseContactsOptions = {}): UseContactsReturn {
  const { search, role, department, limit = 100, enabled = true } = options
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchContacts = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let query = supabase
        .from('contacts')
        .select('*')
        .order('last_name', { ascending: true })
        .limit(limit)

      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      if (role) {
        query = query.eq('role', role)
      }

      if (department) {
        query = query.eq('department', department)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        throw new Error(queryError.message)
      }

      setContacts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contacts'))
    } finally {
      setIsLoading(false)
    }
  }, [search, role, department, limit, enabled])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const createContact = useCallback(async (contact: Partial<Contact>): Promise<Contact | null> => {
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert({
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          role: contact.role,
          department: contact.department,
          notes: contact.notes,
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Refetch to update the list
      await fetchContacts()
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create contact'))
      return null
    }
  }, [fetchContacts])

  // Transform contacts to options for dropdowns
  const contactOptions: ContactOption[] = contacts.map((contact) => {
    const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(' ')
    return {
      value: contact.id.toString(),
      label: fullName || contact.email || 'Unnamed Contact',
      email: contact.email || undefined,
      role: contact.role || undefined,
    }
  })

  return {
    contacts,
    options: contactOptions,
    isLoading,
    error,
    refetch: fetchContacts,
    createContact,
  }
}
