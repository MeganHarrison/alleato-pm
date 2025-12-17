import React from 'react'

interface PageHeaderProps {
  client?: string
  title: string
  description?: string
  actions?: React.ReactNode
}

/**
 * Executive-level page header component
 * Follows the architectural design system with serif typography and refined spacing
 */
export function PageHeader({ client, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-16 md:mb-20 pb-8 md:pb-12 border-b border-neutral-200">
      {/* Client Pre-heading */}
      {client && (
        <div className="mb-3 md:mb-4">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
            {client}
          </p>
        </div>
      )}

      {/* Page Title - Editorial Typography */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-neutral-900 leading-[1.05] mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
