 "use client"

import { useMemo, useState, useEffect } from "react"
import { Bell, ChevronDown, ChevronRight, MessageSquare, Search, Star, Plus, Menu, StarOff } from "lucide-react"
import {
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { getBestAvatarUrl } from "@/lib/gravatar"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"
import { useFavorites } from "@/contexts/favorites-context"

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
  { name: "Tables Directory", path: "tables-directory", requiresProject: false, badge: "New" },
  { name: "Settings", path: "settings/plugins", requiresProject: false },
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
  { name: "Budget V2", path: "budget-v2", requiresProject: true },
  { name: "Commitments", path: "commitments", requiresProject: true },
  { name: "Change Orders", path: "change-orders", requiresProject: true },
  { name: "Change Events", path: "change-events", hasCreateAction: true, requiresProject: true },
  { name: "Direct Costs", path: "direct-costs", requiresProject: true },
  { name: "Invoicing", path: "invoices", requiresProject: true }
]

const adminTools: Array<{ name: string; path: string; requiresProject?: boolean }> = [
  { name: "Document Pipeline", path: "/admin/documents/pipeline", requiresProject: false },
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
  const [user, setUser] = useState<User | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projectToolsOpen, setProjectToolsOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  // Fetch current user on mount and listen for auth changes
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Generate avatar data from user or props
  const customAvatar = userAvatar || user?.user_metadata?.avatar_url
  const userEmail = user?.email || ''
  const avatarSrc = getBestAvatarUrl(customAvatar, userEmail)
  const displayName = userName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const fallbackInitials = userInitials ||
    (user?.user_metadata?.full_name
      ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
      : displayName.slice(0, 2).toUpperCase())

  const parseProjectsResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        return await response.json()
      } catch (error) {
        console.error('Failed to parse project response JSON:', error)
        return null
      }
    }

    const fallbackBody = await response.text()
    console.error('Projects API returned non-JSON response:', fallbackBody.slice(0, 200))
    return null
  }

  // Extract project ID from URL path or query parameters
  const projectId = useMemo(() => {
    // First check URL path segments
    const segments = pathname?.split("/").filter(Boolean) ?? []
    const firstSegment = segments[0]
    if (firstSegment && /^\d+$/.test(firstSegment)) {
      return parseInt(firstSegment)
    }

    // Then check query parameters (both 'project' and 'projectId' for compatibility)
    const projectParam = searchParams?.get('project') || searchParams?.get('projectId')
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
          const data = await parseProjectsResponse(response)
          if (data?.data?.length) {
            const project = data.data.find((p: Project) => p.id === projectId)
            if (project) {
              setCurrentProject(project)
            }
          } else if (!response.ok) {
            console.error('Failed to fetch current project:', response.statusText)
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
      const data = await parseProjectsResponse(response)
      if (data?.data) {
        setProjects(data.data)
      } else if (!response.ok) {
        console.error('Failed to fetch projects for dropdown:', response.statusText)
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
    const crumbs: Array<{ label: string; href: string; isLogo?: boolean }> = []

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
    <header className="bg-surface-inverse text-white flex flex-wrap items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full flex-wrap items-center gap-2 px-4 py-3 lg:gap-3 lg:px-6">
        {/* Mobile Header Layout */}
        <div className="flex md:hidden w-full items-center justify-between">
          {/* Logo - left side on mobile */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image src="/favicon-light.png" alt="Alleato" width={32} height={32} className="object-contain" />
          </Link>

          {/* Mobile Actions - right side */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={() => setNotificationsOpen(true)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden md:flex items-center gap-2 md:gap-3 w-full">
          {/* Sidebar Trigger */}
          <div className="flex items-center gap-2 md:gap-3">
            <SidebarTrigger className="-ml-1 opacity-70 hover:opacity-100 transition-opacity" />
            <Separator
              orientation="vertical"
              className="h-4"
            />
          </div>

          {/* Logo and Breadcrumbs */}
          <div className="min-w-0 flex-1 flex items-center gap-2 overflow-x-auto">
            {/* Alleato Logo - links to homepage */}
            <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
              <Image src="/favicon-light.png" alt="Alleato" width={32} height={32} className="object-contain" />
            </Link>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium tracking-wide text-white/90 whitespace-nowrap">
                {breadcrumbs.map((crumb, index) => (
                  <span key={`${crumb.href}-${index}`} className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-white/40" />
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-white">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="text-white/70 hover:text-brand transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Company/Project Selector */}
            <DropdownMenu onOpenChange={(open) => open && fetchProjects()}>
              <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden md:flex h-8 text-[hsl(var(--procore-header-text))] px-2 bg-white/10 hover:bg-white/20"
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

          {/* Project Tools - hidden on mobile */}
          <DropdownMenu open={projectToolsOpen} onOpenChange={setProjectToolsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden md:flex h-8 items-center gap-2 rounded px-2 text-[hsl(var(--procore-header-text))] transition-colors bg-white/10 hover:bg-white/20"
              >
                <span className="text-xs text-gray-200">Project Tools</span>
                <span className="ml-2 text-sm font-medium">{activeToolName}</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-screen p-6 rounded-none border-x-0">
              <div className="container mx-auto">
                <div className="grid grid-cols-4 gap-8">
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
                            } else {
                              setProjectToolsOpen(false)
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
                            } else {
                              setProjectToolsOpen(false)
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
                            } else {
                              setProjectToolsOpen(false)
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

                {/* Admin Tools Column */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Admin Tools</h3>
                  <div className="space-y-1">
                    {adminTools.map((tool) => {
                      const href = tool.path

                      return (
                        <Link
                          key={tool.name}
                          href={href}
                          onClick={() => setProjectToolsOpen(false)}
                          className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                        >
                          <span>{tool.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Team Chat - hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden md:flex h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors"
          >
            <Link href="/team-chat" aria-label="Team chat">
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>

          {/* Favorites Dropdown - hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors relative"
                aria-label="Favorites"
              >
                <Star className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] font-semibold text-white flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Favorites</span>
                {pathname && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      const pageName = activeToolName;
                      const currentUrl = pathname;
                      if (isFavorite(currentUrl)) {
                        removeFavorite(currentUrl);
                        toast.success(`Removed "${pageName}" from favorites`);
                      } else {
                        addFavorite(pageName, currentUrl);
                        toast.success(`Added "${pageName}" to favorites`);
                      }
                    }}
                  >
                    {isFavorite(pathname) ? (
                      <>
                        <StarOff className="h-3 w-3 mr-1" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Star className="h-3 w-3 mr-1" />
                        Add Page
                      </>
                    )}
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {favorites.length > 0 ? (
                favorites.map((favorite) => (
                  <DropdownMenuItem
                    key={favorite.url}
                    asChild
                    className="cursor-pointer"
                  >
                    <Link href={favorite.url} className="flex items-center justify-between w-full">
                      <span className="truncate">{favorite.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2 shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFavorite(favorite.url);
                          toast.success(`Removed "${favorite.name}" from favorites`);
                        }}
                      >
                        <StarOff className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  <Star className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No favorites yet</p>
                  <p className="text-xs mt-1">Click "Add Page" to favorite this page</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search - hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors"
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
          {/* Notifications - hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-brand transition-colors"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Toggle notifications sidebar"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Avatar - hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden md:flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 transition-colors hover:border-brand hover:bg-brand/10"
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
                {displayName}
              </DropdownMenuLabel>
              {user?.email && (
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={async () => {
                  try {
                    await supabase.auth.signOut()
                    toast.success('Logged out successfully')
                    router.push('/auth/login')
                    router.refresh()
                  } catch (error) {
                    console.error('Logout error:', error)
                    toast.error('Failed to log out')
                  }
                }}
              >
                <IconLogout className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="right" className="w-full sm:w-[400px] bg-surface-inverse text-white p-0">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/10">
              <SheetTitle className="text-white text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(100vh-80px)]">
              {/* Project Selector */}
              {currentProject && (
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Current Project</div>
                  <div className="text-sm font-medium text-white">
                    {currentProject["job number"] && `${currentProject["job number"]} - `}
                    {currentProject.name}
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="px-6 py-4 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Tools</h3>
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
                            } else {
                              setMobileMenuOpen(false)
                            }
                          }}
                          className={`block px-3 py-2 rounded text-sm ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          {tool.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Management</h3>
                  <div className="space-y-1">
                    {projectManagementTools.slice(0, 6).map((tool) => {
                      const href = buildToolUrl(tool.path, tool.requiresProject)
                      const isDisabled = tool.requiresProject && !projectId
                      return (
                        <Link
                          key={tool.name}
                          href={href}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault()
                            } else {
                              setMobileMenuOpen(false)
                            }
                          }}
                          className={`block px-3 py-2 rounded text-sm ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          {tool.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Financial</h3>
                  <div className="space-y-1">
                    {financialManagementTools.slice(0, 4).map((tool) => {
                      const href = buildToolUrl(tool.path, tool.requiresProject)
                      const isDisabled = tool.requiresProject && !projectId
                      return (
                        <Link
                          key={tool.name}
                          href={href}
                          onClick={(e) => {
                            if (isDisabled) {
                              e.preventDefault()
                            } else {
                              setMobileMenuOpen(false)
                            }
                          }}
                          className={`block px-3 py-2 rounded text-sm ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-white/10 text-white'
                          }`}
                        >
                          {tool.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* User Section */}
              <div className="px-6 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarSrc} alt="User avatar" />
                    <AvatarFallback className="bg-brand/20 text-white font-medium">
                      {fallbackInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-white">{displayName}</div>
                    {user?.email && (
                      <div className="text-xs text-gray-400">{user.email}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded text-sm text-white hover:bg-white/10"
                  >
                    <IconUserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await supabase.auth.signOut()
                        toast.success('Logged out successfully')
                        setMobileMenuOpen(false)
                        router.push('/auth/login')
                        router.refresh()
                      } catch (error) {
                        console.error('Logout error:', error)
                        toast.error('Failed to log out')
                      }
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded text-sm text-red-400 hover:bg-white/10"
                  >
                    <IconLogout className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Notifications Sheet */}
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
