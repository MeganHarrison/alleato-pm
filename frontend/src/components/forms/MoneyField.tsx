"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "./FormField"
import { cn } from "@/lib/utils"

interface MoneyFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value?: number
  onChange?: (value: number | undefined) => void
  error?: string
  hint?: string
  required?: boolean
  fullWidth?: boolean
  currency?: string
  showCurrency?: boolean
}

export function MoneyField({
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  fullWidth = false,
  currency = "USD",
  showCurrency = true,
  className,
  ...inputProps
}: MoneyFieldProps) {
  const [displayValue, setDisplayValue] = React.useState<string>('')

  // Format number to display with commas
  const formatMoney = (val: number): string => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Update display value when prop value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatMoney(value))
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    // Allow only numbers, decimal point, and commas
    const cleanedVal = val.replace(/[^0-9.]/g, '')

    if (cleanedVal === '') {
      setDisplayValue('')
      onChange?.(undefined)
    } else {
      // Parse the cleaned value
      const numVal = parseFloat(cleanedVal)
      if (!isNaN(numVal)) {
        setDisplayValue(val) // Keep user's input while typing
        onChange?.(numVal)
      }
    }
  }

  const handleBlur = () => {
    // Format the value on blur
    if (value !== undefined) {
      setDisplayValue(formatMoney(value))
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Remove formatting on focus for easier editing
    if (value !== undefined) {
      setDisplayValue(value.toString())
    }
    e.target.select()
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
          $
        </span>
        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            "pl-8",
            showCurrency && currency === "USD" && "pr-12",
            error && "border-red-300",
            className
          )}
          placeholder="0.00"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputProps.id}-error` : undefined}
          {...inputProps}
        />
        {showCurrency && currency === "USD" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            USD
          </span>
        )}
      </div>
    </FormField>
  )
}
