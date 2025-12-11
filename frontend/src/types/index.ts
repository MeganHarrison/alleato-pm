/**
 * Type Exports - Single Source of Truth
 *
 * This file re-exports all types used in the application.
 * Import types from here rather than directly from individual files.
 *
 * Example: import { Project, Meeting } from '@/types'
 */

// Database types (auto-generated from Supabase)
export type { Database, Json } from './database'

// Derived table types for convenience
import type { Database } from './database'

// Table Row Types (what you get when fetching data)
export type Project = Database['public']['Tables']['projects']['Row']
export type Commitment = Database['public']['Tables']['commitments']['Row']
export type ChangeOrder = Database['public']['Tables']['change_orders']['Row']
export type BudgetItem = Database['public']['Tables']['budget_items']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type AppUser = Database['public']['Tables']['app_users']['Row']
export type OwnerInvoice = Database['public']['Tables']['owner_invoices']['Row']
export type MeetingSegment = Database['public']['Tables']['meeting_segments']['Row']

// Insert Types (for creating new records)
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type CommitmentInsert = Database['public']['Tables']['commitments']['Insert']
export type ChangeOrderInsert = Database['public']['Tables']['change_orders']['Insert']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']

// Update Types (for updating records)
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type CommitmentUpdate = Database['public']['Tables']['commitments']['Update']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

// Meeting data is stored in document_metadata table
// Filter by type='meeting' or source='fireflies' for meeting records
export type Meeting = Database['public']['Tables']['document_metadata']['Row']
export type MeetingInsert = Database['public']['Tables']['document_metadata']['Insert']
export type MeetingUpdate = Database['public']['Tables']['document_metadata']['Update']

// Re-export domain-specific types
export * from './financial'
export * from './project'
export * from './project-home'
export * from './portfolio'
export * from './budget'

// Common utility types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// Status types used across the application
export type StatusType = 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'completed'
export type PriorityType = 'low' | 'medium' | 'high' | 'urgent'

// Badge variant type (matches Badge component)
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'

// Helper to get status badge variant
export function getStatusBadgeVariant(status: string): BadgeVariant {
  const statusMap: Record<string, BadgeVariant> = {
    active: 'success',
    approved: 'success',
    completed: 'success',
    pending: 'warning',
    draft: 'secondary',
    rejected: 'destructive',
    inactive: 'outline',
  }
  return statusMap[status.toLowerCase()] || 'default'
}

// Helper to get priority badge variant
export function getPriorityBadgeVariant(priority: string): BadgeVariant {
  const priorityMap: Record<string, BadgeVariant> = {
    high: 'destructive',
    urgent: 'destructive',
    medium: 'warning',
    low: 'secondary',
  }
  return priorityMap[priority.toLowerCase()] || 'default'
}
