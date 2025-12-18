import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Empty state component for when no data is available
 * Maintains the executive design system aesthetic
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border border-neutral-200 bg-white p-12 md:p-16 text-center">
      <Icon className="h-12 w-12 md:h-16 md:w-16 text-neutral-300 mx-auto mb-6" strokeWidth={1.5} />
      <h3 className="text-xl md:text-2xl font-serif font-light text-neutral-900 tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 bg-white hover:border-brand hover:bg-brand/5 transition-all duration-300 text-sm font-medium text-neutral-900"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
