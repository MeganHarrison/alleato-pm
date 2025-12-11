"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "./FormField"
import { cn } from "@/lib/utils"

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  fullWidth?: boolean
}

export function TextField({
  label,
  error,
  hint,
  required = false,
  fullWidth = false,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      hint={hint}
      required={required}
      fullWidth={fullWidth}
    >
      <Input
        type="text"
        className={cn(error && "border-red-300", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputProps.id}-error` : undefined}
        {...inputProps}
      />
    </FormField>
  )
}