"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ProjectSetupStepper, type Step } from "@/components/project-setup-stepper"

interface ProjectStep {
  id: string
  label: string
  completed: boolean
}

interface ProjectSidebarProps extends React.ComponentProps<typeof Sidebar> {
  projectSteps?: ProjectStep[]
}

// Map step IDs to their corresponding routes
const stepRoutes: Record<string, string> = {
  "prime-contract": "/contracts",
  "cost-codes": "/budget/setup",
  "budget": "/budget",
  "schedule": "/schedule",
  "project-team": "/home", // Could be /team if that page exists
  "sov": "/sov",
  "commitments": "/commitments",
}

const defaultSteps: ProjectStep[] = [
  { id: "prime-contract", label: "Prime Contract", completed: false },
  { id: "cost-codes", label: "Cost Codes", completed: false },
  { id: "budget", label: "Budget", completed: false },
  { id: "schedule", label: "Schedule", completed: false },
  { id: "project-team", label: "Project Team", completed: false },
  { id: "sov", label: "SOV", completed: false },
  { id: "commitments", label: "Commitments", completed: false },
]

export function ProjectSidebar({
  projectSteps = defaultSteps,
  ...props
}: ProjectSidebarProps) {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  // Convert ProjectStep[] to Step[] for ProjectSetupStepper
  const convertedSteps: Step[] = projectSteps.map((step) => ({
    id: step.id,
    title: step.label,
    status: step.completed ? "completed" : "upcoming",
  }))

  // Find the first uncompleted step to mark as current
  const firstUncompletedIndex = convertedSteps.findIndex(s => s.status === "upcoming")
  if (firstUncompletedIndex !== -1) {
    convertedSteps[firstUncompletedIndex].status = "current"
  }

  // Handle step click - navigate to the appropriate page
  const handleStepClick = (step: Step) => {
    const route = stepRoutes[step.id]
    if (route && projectId) {
      router.push(`/${projectId}${route}`)
    }
  }

  return (
    <Sidebar
      collapsible="none"
      className="bg-white sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >

      <SidebarContent className="px-4 pt-6">
        {/* Project Setup Heading */}
        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
            Project Setup
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Complete these steps to get started
          </p>
        </div>

        <SidebarSeparator className="mx-0" />

        {/* Vertical Stepper */}
        <ProjectSetupStepper steps={convertedSteps} onStepClick={handleStepClick} />

        {/* Progress Summary */}
        <SidebarSeparator className="mx-0 my-6" />

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-semibold text-foreground">
              {projectSteps.filter(s => s.completed).length} / {projectSteps.length}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(projectSteps.filter(s => s.completed).length / projectSteps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
