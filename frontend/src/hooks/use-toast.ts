// Re-export toast from sonner for compatibility with existing imports
// This project uses sonner for toast notifications
import { toast as sonnerToast } from 'sonner'

export const toast = sonnerToast

// For backwards compatibility, provide a useToast hook that returns the toast function
export function useToast() {
  return { toast: sonnerToast }
}
