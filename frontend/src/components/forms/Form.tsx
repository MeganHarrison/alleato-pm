"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Form({ children, className, onSubmit, ...props }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  )
}