"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  children: React.ReactNode
  error?: string
  hint?: string
  required?: boolean
  className?: string
  fullWidth?: boolean
}

export function FormField({
  label,
  children,
  error,
  hint,
  required = false,
  className,
  fullWidth = false,
}: FormFieldProps) {
  return (
    <div className={cn(fullWidth ? "sm:col-span-2" : "", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {children}
        {hint && !error && (
          <p className="mt-2 text-sm text-gray-500">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}