"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type StepStatus = "completed" | "current" | "upcoming"

export interface Step {
  id: string
  title: string
  description?: string
  status: StepStatus
}

interface ProjectSetupStepperProps {
  steps: Step[]
  onStepClick?: (step: Step) => void
}

export function ProjectSetupStepper({ steps, onStepClick }: ProjectSetupStepperProps) {
  return (
    <div className="w-full">
      <nav aria-label="Project setup progress">
        <ol className="space-y-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            const isCompleted = step.status === "completed"
            const isCurrent = step.status === "current"
            const isUpcoming = step.status === "upcoming"

            return (
              <li key={step.id} className="relative">
                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-4 top-9 h-full w-0.5 -translate-x-1/2",
                      isCompleted ? "bg-success" : "bg-border",
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Step content */}
                <button
                  onClick={() => onStepClick?.(step)}
                  className={cn(
                    "group relative flex w-full items-start gap-3 py-2.5 text-left transition-colors",
                    onStepClick && "hover:bg-muted/50 rounded-lg px-2 -mx-2",
                  )}
                  disabled={!onStepClick}
                >
                  {/* Step indicator */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                        isCompleted && "border-success bg-success text-success-foreground",
                        isCurrent && "border-primary bg-primary text-primary-foreground shadow-sm",
                        isUpcoming && "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        <span className="text-xs font-semibold">{index + 1}</span>
                      )}
                    </div>

                    {/* Pulse animation for current step */}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Step text */}
                  <div className="flex-1 pt-0.5">
                    <h3
                      className={cn(
                        "text-sm font-semibold leading-tight transition-colors",
                        isCompleted && "text-foreground",
                        isCurrent && "text-foreground",
                        isUpcoming && "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </h3>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
