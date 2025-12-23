"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconBriefcase,
  IconBuildingBank,
  IconCalendar,
  IconChartLine,
  IconCheckbox,
  IconCoin,
  IconFileDescription,
  IconFileInvoice,
  IconFileText,
  IconLayoutGrid,
  IconMessageChatbot,
  IconPencil,
  IconPhoto,
  IconReportMoney,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useProject } from "@/contexts/project-context"

// Static navigation items (not project-specific)
const staticNavMain = [
  {
    title: "Projects",
    url: "/",
    icon: IconLayoutGrid,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: IconCheckbox,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: IconCalendar,
  },
  {
    title: "Directory",
    url: "/directory/companies",
    icon: IconUsers,
  },
  {
    title: "AI Chat",
    url: "/chat-rag",
    icon: IconMessageChatbot,
  },
]

// Project-specific tools (require projectId prefix)
const projectToolsConfig = [
  {
    name: "Drawings",
    path: "/drawings",
    icon: IconPencil,
  },
  {
    name: "Photos",
    path: "/photos",
    icon: IconPhoto,
  },
  {
    name: "Submittals",
    path: "/submittals",
    icon: IconFileText,
  },
  {
    name: "Punch List",
    path: "/punch-list",
    icon: IconCheckbox,
  },
]

// Financial section - grouped by function (require projectId prefix)
const financialConfig = [
  {
    name: "Budget",
    path: "/budget",
    icon: IconReportMoney,
  },
  {
    name: "Contracts",
    path: "/contracts",
    icon: IconFileDescription,
  },
  {
    name: "Commitments",
    path: "/commitments",
    icon: IconBriefcase,
  },
  {
    name: "Change Orders",
    path: "/change-orders",
    icon: IconFileInvoice,
  },
  {
    name: "Change Events",
    path: "/change-events",
    icon: IconCoin,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: IconBuildingBank,
  },
  {
    name: "Billing Periods",
    path: "/billing-periods",
    icon: IconCalendar,
  },
]

// Secondary navigation - admin and settings
const navSecondary = [
  {
    title: "Executive",
    url: "/executive",
    icon: IconChartLine,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projectId } = useProject()

  // Build project-prefixed URLs for project-specific navigation
  const projectTools = React.useMemo(() => {
    if (!projectId) return []
    return projectToolsConfig.map((item) => ({
      name: item.name,
      url: `/${projectId}${item.path}`,
      icon: item.icon,
    }))
  }, [projectId])

  const financial = React.useMemo(() => {
    if (!projectId) return []
    return financialConfig.map((item) => ({
      name: item.name,
      url: `/${projectId}${item.path}`,
      icon: item.icon,
    }))
  }, [projectId])

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-white text-gray-900"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/Alleato Favicon.png"
                  alt="Alleato"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-base font-semibold">Alleato</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticNavMain} />
        {projectId && projectTools.length > 0 && (
          <NavDocuments items={projectTools} label="Project Tools" />
        )}
        {projectId && financial.length > 0 && (
          <NavDocuments items={financial} label="Financial" />
        )}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
