import React from 'react'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  variant?: 'default' | 'compact'
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
  variant = 'default'
}: EmptyStateProps) {
  const isCompact = variant === 'compact'
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      isCompact ? "py-8" : "py-12",
      className
    )}>
      {Icon && (
        <Icon className={cn(
          "text-muted-foreground mb-4",
          isCompact ? "h-8 w-8" : "h-12 w-12"
        )} />
      )}
      {title && (
        <h3 className={cn(
          "font-medium mb-1",
          isCompact ? "text-sm" : "text-base"
        )}>
          {title}
        </h3>
      )}
      <p className={cn(
        "text-muted-foreground mb-4",
        isCompact ? "text-xs" : "text-sm"
      )}>
        {message}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant="default"
          size={isCompact ? "sm" : "default"}
          className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}