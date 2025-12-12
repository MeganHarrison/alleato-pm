'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

export interface AppUser {
  id: string
  email: string
  full_name: string | null
  name: string | null
  role: string
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Employee {
  id: number
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  title: string | null
  department: string | null
}

export interface UserOption {
  value: string
  label: string
  email?: string
  role?: string
}

interface UseUsersOptions {
  // Filter users by search term
  search?: string
  // Filter by role
  role?: string
  // Limit number of results
  limit?: number
  // Whether to auto-fetch on mount
  enabled?: boolean
  // Whether to use app_users or employees table
  source?: 'app_users' | 'employees'
}

interface UseUsersReturn {
  users: (AppUser | Employee)[]
  options: UserOption[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching users from Supabase
 * Can query either app_users or employees table
 */
export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { search, role, limit = 100, enabled = true, source = 'app_users' } = options
  const [users, setUsers] = useState<(AppUser | Employee)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (source === 'app_users') {
        let query = supabase
          .from('app_users')
          .select('*')
          .order('full_name', { ascending: true })
          .limit(limit)

        if (search) {
          query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
        }

        if (role) {
          query = query.eq('role', role)
        }

        const { data, error: queryError } = await query

        if (queryError) {
          throw new Error(queryError.message)
        }

        setUsers(data || [])
      } else {
        // Query employees table
        let query = supabase
          .from('employees')
          .select('*')
          .order('last_name', { ascending: true })
          .limit(limit)

        if (search) {
          query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
        }

        const { data, error: queryError } = await query

        if (queryError) {
          throw new Error(queryError.message)
        }

        setUsers(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'))
    } finally {
      setIsLoading(false)
    }
  }, [search, role, limit, enabled, source])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Transform users to options for dropdowns
  const userOptions: UserOption[] = users.map((user) => {
    if (source === 'app_users') {
      const appUser = user as AppUser
      return {
        value: appUser.id,
        label: appUser.full_name || appUser.name || appUser.email,
        email: appUser.email,
        role: appUser.role,
      }
    } else {
      const employee = user as Employee
      const fullName = [employee.first_name, employee.last_name].filter(Boolean).join(' ')
      return {
        value: employee.id.toString(),
        label: fullName || employee.email || 'Unnamed Employee',
        email: employee.email || undefined,
      }
    }
  })

  return {
    users,
    options: userOptions,
    isLoading,
    error,
    refetch: fetchUsers,
  }
}

/**
 * Hook specifically for fetching employees (project managers, superintendents, etc.)
 */
export function useEmployees(options: Omit<UseUsersOptions, 'source'> = {}) {
  return useUsers({ ...options, source: 'employees' })
}
