 "use client"

import { useMemo, useState, useEffect } from "react"
import { Bell, ChevronDown, ChevronRight, MessageSquare, Search, Star, Plus } from "lucide-react"
import {
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// Tool configuration - these will be scoped to projectId when available
const coreTools: Array<{ name: string; path: string; badge?: string; requiresProject?: boolean }> = [
  { name: "Home", path: "home", requiresProject: true },
  { name: "360 Reporting", path: "reporting", requiresProject: true },
  { name: "Documents", path: "documents", requiresProject: true },
  { name: "Directory", path: "directory", requiresProject: true },
  { name: "Connection Manager", path: "connection-manager", requiresProject: false },
  { name: "Tasks", path: "tasks", requiresProject: true },
  { name: "Admin", path: "admin", requiresProject: true },
]

const projectManagementTools: Array<{ name: string; path: string; hasCreateAction?: boolean; isFavorite?: boolean; requiresProject?: boolean }> = [
  { name: "Emails", path: "emails", requiresProject: true },
  { name: "RFIs", path: "rfis", hasCreateAction: true, requiresProject: true },
  { name: "Submittals", path: "submittals", hasCreateAction: true, requiresProject: true },
  { name: "Transmittals", path: "transmittals", requiresProject: true },
  { name: "Punch List", path: "punch-list", hasCreateAction: true, requiresProject: true },
  { name: "Meetings", path: "meetings", requiresProject: true },
  { name: "Schedule", path: "schedule", requiresProject: true },
  { name: "Daily Log", path: "daily-log", requiresProject: true },
  { name: "Photos", path: "photos", requiresProject: true },
  { name: "Drawings", path: "drawings", requiresProject: true },
  { name: "Specifications", path: "specifications", requiresProject: true }
]

const financialManagementTools: Array<{ name: string; path: string; hasCreateAction?: boolean; requiresProject?: boolean }> = [
  { name: "Prime Contracts", path: "contracts", requiresProject: true },
  { name: "Budget", path: "budget", requiresProject: true },
  { name: "Commitments", path: "commitments", requiresProject: true },
  { name: "Change Orders", path: "change-orders", requiresProject: true },
  { name: "Change Events", path: "change-events", hasCreateAction: true, requiresProject: true },
  { name: "Direct Costs", path: "direct-costs", requiresProject: true },
  { name: "Invoicing", path: "invoices", requiresProject: true }
]

interface Project {
  id: number
  name: string
  "job number": string | null
}

export function SiteHeader({
  userAvatar,
  userName,
  userInitials,
}: {
  userAvatar?: string
  userName?: string
  userInitials?: string
} = {}) {
  const avatarSrc = userAvatar
  // Generate initials from userName if userInitials not provided
  const fallbackInitials = userInitials || userName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract project ID from URL path or query parameters
  const projectId = useMemo(() => {
    // First check URL path segments
    const segments = pathname?.split("/").filter(Boolean) ?? []
    const firstSegment = segments[0]
    if (firstSegment && /^\d+$/.test(firstSegment)) {
      return parseInt(firstSegment)
    }

    // Then check query parameters
    const projectParam = searchParams?.get('project')
    if (projectParam && /^\d+$/.test(projectParam)) {
      return parseInt(projectParam)
    }

    return null
  }, [pathname, searchParams])

  // Fetch current project details when project ID changes
  useEffect(() => {
    const fetchCurrentProject = async () => {
      if (projectId) {
        try {
          const response = await fetch(`/api/projects`)
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            const project = data.data.find((p: Project) => p.id === projectId)
            if (project) {
              setCurrentProject(project)
            }
          }
        } catch (error) {
          console.error('Failed to fetch current project:', error)
        }
      } else {
        setCurrentProject(null)
      }
    }

    fetchCurrentProject()
  }, [projectId])

  // Fetch projects when dropdown is opened
  const fetchProjects = async () => {
    setLoadingProjects(true)
    try {
      const response = await fetch('/api/projects?limit=10&archived=false')
      const data = await response.json()
      if (data.data) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Handle project selection - navigate to the same tool for the new project
  const handleProjectSelect = (newProjectId: number) => {
    const segments = pathname?.split("/").filter(Boolean) ?? []

    // Check if we're currently on a project-scoped page
    if (segments.length >= 2 && /^\d+$/.test(segments[0])) {
      // We're on a project page - navigate to the same tool for the new project
      const toolPath = segments.slice(1).join('/')
      router.push(`/${newProjectId}/${toolPath}`)
    } else {
      // Not on a project page - navigate to home for the new project
      router.push(`/${newProjectId}/home`)
    }
  }

  // Helper function to build project-scoped URLs
  const buildToolUrl = (toolPath: string, requiresProject: boolean = true) => {
    if (requiresProject && projectId) {
      return `/${projectId}/${toolPath}`
    }
    return `/${toolPath}`
  }

  // Determine the currently active tool from the URL
  const activeToolName = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? []

    // Check if we're on a project-scoped page (/{projectId}/{tool})
    if (segments.length >= 2 && /^\d+$/.test(segments[0])) {
      const toolPath = segments[1]

      // Search through all tool arrays to find the matching tool name
      const allTools = [...coreTools, ...projectManagementTools, ...financialManagementTools]
      const matchingTool = allTools.find(tool => tool.path === toolPath)

      return matchingTool?.name || "Home"
    }

    // Check if we're on a legacy query-param based page (e.g., /budget/line-item/new?projectId=47)
    if (segments.length >= 1) {
      const firstSegment = segments[0]
      const allTools = [...coreTools, ...projectManagementTools, ...financialManagementTools]
      const matchingTool = allTools.find(tool => tool.path === firstSegment)

      if (matchingTool) {
        return matchingTool.name
      }
    }

    return "Home"
  }, [pathname])

  const breadcrumbs = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? []
    const crumbs = [{ label: "Home", href: "/" }]
    segments.forEach((segment, index) => {
      let href = `/${segments.slice(0, index + 1).join("/")}`

      // Check if this segment is a project ID (numeric)
      let label: string
      if (index === 0 && /^\d+$/.test(segment)) {
        // This is a project ID - use the project name if available and link to /home
        label = currentProject?.name || "Project"
        href = `/${segment}/home`
      } else {
        // Regular segment - format it nicely
        label = segment
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      }

      crumbs.push({ label, href })
    })
    return crumbs
  }, [pathname, currentProject])

  return (
    <header className="bg-gray-800 text-white flex flex-wrap items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full flex-wrap items-center gap-2 px-4 py-3 lg:gap-3 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="hidden h-4 sm:inline-flex"
          />
        </div>
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto text-sm font-medium tracking-wide text-white/90 whitespace-nowrap"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.href}-${index}`} className="flex items-center gap-2">
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-white/70 hover:text-brand transition-colors">
                  {crumb.label}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-3 w-3 text-white/40" />
              )}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex w-full flex-wrap items-center gap-2 sm:justify-end md:w-auto">
          {/* Company/Project Selector */}
          <DropdownMenu onOpenChange={(open) => open && fetchProjects()}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-8 text-[hsl(var(--procore-header-text))] px-2 ${
                  currentProject ? 'bg-brand/10' : ''
                }`}
              >
                {currentProject && (
                  <span className="mr-2 h-2 w-2 rounded-full bg-[hsl(var(--procore-orange))]" />
                )}
                <span className="text-xs text-gray-200">Project</span>
                <span className="mx-1 text-gray-500">|</span>
                <span className="text-sm font-medium">
                  {currentProject
                    ? `${currentProject["job number"] ? currentProject["job number"] + " - " : ""}${currentProject.name}`
                    : projectId
                    ? "Loading..."
                    : "Select Project"
                  }
                </span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loadingProjects ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading projects...
                </div>
              ) : projects.length > 0 ? (
                <>
                  {projects.slice(0, 10).map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() => handleProjectSelect(project.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{project.name}</span>
                        {project["job number"] && (
                          <span className="text-xs text-muted-foreground">
                            Job #{project["job number"]}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No projects found
                </div>
              )}
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer font-medium">
                  View All Projects
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 items-center gap-2 rounded px-2 text-[hsl(var(--procore-header-text))] transition-colors"
              >
                <span className="text-xs text-gray-200">Project Tools</span>
                <span className="ml-2 text-sm font-medium">{activeToolName}</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-screen p-6 rounded-none border-x-0">
              <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-12">
                {/* Core Tools Column */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Core Tools</h3>
                  <div className="space-y-1">
                    {coreTools.map((tool) => {
                      const href = buildToolUrl(tool.path, tool.requiresProject)
                      const isDisabled = tool.requiresProject && !projectId

                      return (
                        <Link
                          key={tool.name}
                          href={href}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault()
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                              : 'hover:bg-gray-100'
                          }`}
                          aria-disabled={isDisabled}
                        >
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              {tool.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Project Management Column */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Project Management</h3>
                  <div className="space-y-1">
                    {projectManagementTools.map((tool) => {
                      const href = buildToolUrl(tool.path, tool.requiresProject)
                      const isDisabled = tool.requiresProject && !projectId

                      return (
                        <Link
                          key={tool.name}
                          href={href}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault()
                            }
                          }}
                          className={`flex w-full items-center rounded px-2 py-1.5 text-left text-sm ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                              : 'hover:bg-gray-100'
                          }`}
                          aria-disabled={isDisabled}
                        >
                          <span className="flex items-center gap-2">
                            {tool.isFavorite && <Star className="h-3.5 w-3.5 text-gray-400" />}
                            {tool.name}
                            {tool.hasCreateAction && (
                              <Plus className="h-4 w-4 rounded-full bg-orange-500 p-0.5 text-white ml-1" />
                            )}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Financial Management Column */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Financial Management</h3>
                  <div className="space-y-1">
                    {financialManagementTools.map((tool) => {
                      const href = buildToolUrl(tool.path, tool.requiresProject)
                      const isDisabled = tool.requiresProject && !projectId

                      return (
                        <Link
                          key={tool.name}
                          href={href}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault()
                            }
                          }}
                          className={`flex w-full items-center rounded px-2 py-1.5 text-left text-sm ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                              : 'hover:bg-gray-100'
                          }`}
                          aria-disabled={isDisabled}
                        >
                          <span className="flex items-center gap-2">
                            {tool.name}
                            {tool.hasCreateAction && (
                              <Plus className="h-4 w-4 rounded-full bg-orange-500 p-0.5 text-white ml-1" />
                            )}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors"
          >
            <Link href="/team-chat" aria-label="Team chat">
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2">
                <Input
                  id="header-search"
                  placeholder="Search documents"
                  className="w-full"
                  aria-label="Search documents"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Toggle notifications sidebar"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 transition-colors hover:border-brand hover:bg-brand/10"
                aria-label="Open user menu"
              >
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarImage src={avatarSrc} alt="User avatar" className="rounded-full" />
                  <AvatarFallback className="rounded-full bg-brand/20 text-white font-medium text-sm">
                    {fallbackInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-48">
              <DropdownMenuLabel className="text-sm font-semibold">
                {userName || 'User'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconUserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSettings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconLogout className="mr-2 h-4 w-4 text-destructive" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetContent side="right" className="w-[320px] bg-gray-900 text-white">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle className="text-base">Notifications</SheetTitle>
              <SheetDescription className="text-sm text-gray-400">
                Latest activity for your workspace.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 px-4 py-2 text-sm">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-white">New message in project chat</p>
                <p className="text-xs text-gray-400">Just now</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-white">Budget update approved</p>
                <p className="text-xs text-gray-400">30m ago</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-white">New document shared</p>
                <p className="text-xs text-gray-400">1h ago</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
