 "use client"

import { useMemo, useState } from "react"
import { Bell, ChevronDown, ChevronRight, MessageSquare, Search } from "lucide-react"
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
import { usePathname } from "next/navigation"
import { useHeader } from "@/components/layout/header-context"

const primaryTools = ["Home", "Directory"]
const budgetTools = ["Budget", "Commitments", "Prime Contracts", "Invoicing"]
const projectOpsTools = ["RFIs", "Submittals", "Daily Log"]
const defaultAvatar = "/favicon-light.png"

export function SiteHeader({
  userAvatar,
}: {
  userAvatar?: string
} = {}) {
  const [currentTool, setCurrentTool] = useState("Home")
  const avatarSrc = userAvatar ?? defaultAvatar
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { header } = useHeader()
  const {
    companyName = "Alleato Group",
    projectName = "24-104 - Goodwill Bart",
  } = header
  const pathname = usePathname()
  const breadcrumbs = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? []
    const crumbs = [{ label: "Home", href: "/" }]
    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      const label = segment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
      crumbs.push({ label, href })
    })
    return crumbs
  }, [pathname])

  return (
    <header className="bg-gray-800 text-white flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm font-medium tracking-wide text-white/90"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-white/70 hover:text-white">
                  {crumb.label}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-3 w-3 text-white/40" />
              )}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {/* Company/Project Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 text-[hsl(var(--procore-header-text))] hover:bg-brand px-2"
              >
                <span className="text-xs text-gray-300">{companyName}</span>
                <span className="mx-1 text-gray-500">|</span>
                <span className="text-sm font-medium">{projectName}</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem>Switch Project</DropdownMenuItem>
              <DropdownMenuItem>Switch Company</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View All Projects</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 items-center gap-2 rounded px-2 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
              >
                <span className="text-xs text-gray-400">Project Tools</span>
                <span className="ml-2 text-sm font-medium">{currentTool}</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {primaryTools.map((tool) => (
                <DropdownMenuItem
                  key={tool}
                  onClick={() => setCurrentTool(tool)}
                >
                  {tool}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {budgetTools.map((tool, index) => (
                <DropdownMenuItem
                  key={tool}
                  className={index === 0 ? "font-semibold" : undefined}
                  onClick={() => setCurrentTool(tool)}
                >
                  {tool}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {projectOpsTools.map((tool) => (
                <DropdownMenuItem
                  key={tool}
                  onClick={() => setCurrentTool(tool)}
                >
                  {tool}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
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
                className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
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
            className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Toggle notifications sidebar"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 transition hover:border-white/30"
                aria-label="Open user menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={avatarSrc} alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-48">
              <DropdownMenuLabel className="text-sm font-semibold">
                User
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
