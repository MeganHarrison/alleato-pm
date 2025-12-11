"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface ToggleFieldProps {
  label: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  error?: string
  hint?: string
  disabled?: boolean
  className?: string
}

export function ToggleField({
  label,
  checked = false,
  onCheckedChange,
  error,
  hint,
  disabled = false,
  className,
}: ToggleFieldProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(error && "border-red-300")}
        aria-invalid={!!error}
      />
    </div>
  )
}