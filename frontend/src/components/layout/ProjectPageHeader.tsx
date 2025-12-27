"use client"

import * as React from "react"
import { ChevronRight, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProject } from "@/contexts/project-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ProjectPageHeaderProps {
  title: string
  titleContent?: React.ReactNode
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
  showProjectName?: boolean
  showExportButton?: boolean
  onExportCSV?: () => void
  onExportPDF?: () => void
  exportLabel?: string
}

export function ProjectPageHeader({
  title,
  titleContent,
  description,
  breadcrumbs,
  actions,
  className,
  showProjectName = true,
  showExportButton = false,
  onExportCSV,
  onExportPDF,
  exportLabel = "Export",
}: ProjectPageHeaderProps) {
  const { selectedProject, isLoading } = useProject()

  return (
    <div className={cn(className)}>
      <div className="px-4 sm:px-6 lg:px-12">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex py-3" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((item) => (
                <li key={item.label} className="flex items-center">
                  {breadcrumbs.indexOf(item) > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title and Actions */}
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            {/* Project Name - Displayed prominently above page title */}
            {showProjectName && (
              <div className="mb-1">
                {isLoading ? (
                  // Loading skeleton
                  <div className="h-5 w-48 bg-gray-200 animate-pulse rounded" />
                ) : selectedProject ? (
                  // Project name with job number if available
                  <div className="text-sm font-medium text-muted-foreground">
                    {selectedProject.number && (
                      <span>
                        {selectedProject.number}
                        {' · '}
                      </span>
                    )}
                    <span>
                      {selectedProject.name}
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Page Title */}
            {titleContent ? (
              titleContent
            ) : (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}

            {/* Description */}
            {description && (
              <p className="mt-2 text-sm">{description}</p>
            )}
          </div>

          {/* Actions */}
          {(actions || showExportButton) && (
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              {showExportButton && (onExportCSV || onExportPDF) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {exportLabel}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onExportCSV && (
                      <DropdownMenuItem onClick={onExportCSV}>
                        Export as CSV
                      </DropdownMenuItem>
                    )}
                    {onExportPDF && (
                      <DropdownMenuItem onClick={onExportPDF}>
                        Export as PDF
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
