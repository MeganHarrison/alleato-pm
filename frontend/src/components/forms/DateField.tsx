"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormField } from "./FormField"

interface DateFieldProps {
  label: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  error?: string
  hint?: string
  required?: boolean
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  placeholder?: string
}

export function DateField({
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  fullWidth = false,
  className,
  disabled = false,
  placeholder = "Pick a date",
}: DateFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      hint={hint}
      required={required}
      fullWidth={fullWidth}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-red-300",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormField>
  )
}