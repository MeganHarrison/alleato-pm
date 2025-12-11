"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "./FormField"
import { cn } from "@/lib/utils"

interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value?: number
  onChange?: (value: number | undefined) => void
  error?: string
  hint?: string
  required?: boolean
  fullWidth?: boolean
  prefix?: string
  suffix?: string
}

export function NumberField({
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  fullWidth = false,
  prefix,
  suffix,
  className,
  ...inputProps
}: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      onChange?.(undefined)
    } else {
      const numVal = parseFloat(val)
      if (!isNaN(numVal)) {
        onChange?.(numVal)
      }
    }
  }

  return (
    <FormField
      label={label}
      error={error}
      hint={hint}
      required={required}
      fullWidth={fullWidth}
    >
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          className={cn(
            error && "border-red-300",
            prefix && "pl-8",
            suffix && "pr-12",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputProps.id}-error` : undefined}
          {...inputProps}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </FormField>
  )
}