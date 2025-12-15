"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectPageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  projectName?: string
  showProjectName?: boolean
}

export function ProjectPageHeader({
  title,
  description,
  actions,
  className,
  projectName,
  showProjectName = true,
}: ProjectPageHeaderProps) {
  const params = useParams()
  const projectId = params?.projectId as string
  const [project, setProject] = React.useState<{ name: string; 'job number': string | null } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // If projectName is provided as prop, use it
    if (projectName) {
      setProject({ name: projectName, 'job number': null })
      setLoading(false)
      return
    }

    // Otherwise fetch project details if projectId is available
    if (projectId && showProjectName) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${projectId}`)
          if (response.ok) {
            const data = await response.json()
            setProject(data)
          }
        } catch (error) {
          console.error('Failed to fetch project:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProject()
    } else {
      setLoading(false)
    }
  }, [projectId, projectName, showProjectName])

  return (
    <div className={cn("border-b bg-white", className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Project Name Subtitle */}
        {showProjectName && !loading && project && (
          <div className="pt-4 pb-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">
                {project['job number'] ? `${project['job number']} - ` : ''}
                {project.name}
              </span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">{title}</span>
            </div>
          </div>
        )}

        {/* Title and Actions */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
