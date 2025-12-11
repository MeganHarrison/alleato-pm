"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "./FormField"
import { cn } from "@/lib/utils"

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  fullWidth?: boolean
}

export function TextareaField({
  label,
  error,
  hint,
  required = false,
  fullWidth = false,
  className,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      hint={hint}
      required={required}
      fullWidth={fullWidth}
    >
      <Textarea
        className={cn(error && "border-red-300", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaProps.id}-error` : undefined}
        {...textareaProps}
      />
    </FormField>
  )
}