import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  onClick?: () => void
  href?: string
}

/**
 * Statistical card component for displaying metrics
 * Features brand color accents and hover effects
 */
export function StatCard({ label, value, icon: Icon, trend, onClick, href }: StatCardProps) {
  const baseClasses = "border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-brand hover:shadow-sm"
  const interactiveClasses = onClick || href ? "cursor-pointer" : ""

  const content = (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-4 w-4 text-brand" />}
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
            {label}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-light tabular-nums tracking-tight text-neutral-900">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium tabular-nums ${
                trend.positive ? 'text-green-700' : 'text-red-700'
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses} text-left w-full`}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  )
}
