import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ 
  message = 'Loading...', 
  className,
  size = 'md' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      sizeClasses[size],
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-muted-foreground mb-2",
        iconSizes[size]
      )} />
      <p className="text-muted-foreground text-sm">
        {message}
      </p>
    </div>
  )
}