"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArchive,
  IconBriefcase,
  IconBuildingBank,
  IconCalendar,
  IconCamera,
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
  IconSettings,
  IconUserCircle,
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

const data = {
  // Primary navigation - most frequently used features
  navMain: [
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
  ],
  // Project-specific tools
  projectTools: [
    {
      name: "Drawings",
      url: "/drawings",
      icon: IconPencil,
    },
    {
      name: "Photos",
      url: "/photos",
      icon: IconPhoto,
    },
    {
      name: "Submittals",
      url: "/submittals",
      icon: IconFileText,
    },
    {
      name: "Punch List",
      url: "/punch-list",
      icon: IconCheckbox,
    },
  ],
  // Financial section - grouped by function
  financial: [
    {
      name: "Budget",
      url: "/budget",
      icon: IconReportMoney,
    },
    {
      name: "Contracts",
      url: "/contracts",
      icon: IconFileDescription,
    },
    {
      name: "Commitments",
      url: "/commitments",
      icon: IconBriefcase,
    },
    {
      name: "Change Orders",
      url: "/change-orders",
      icon: IconFileInvoice,
    },
    {
      name: "Change Events",
      url: "/change-events",
      icon: IconCoin,
    },
    {
      name: "Invoices",
      url: "/invoices",
      icon: IconBuildingBank,
    },
    {
      name: "Billing Periods",
      url: "/billing-periods",
      icon: IconCalendar,
    },
  ],
  // Secondary navigation - admin and settings
  navSecondary: [
    {
      title: "Profile",
      url: "/profile",
      icon: IconUserCircle,
    },
    {
      title: "Executive",
      url: "/executive",
      icon: IconChartLine,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <Link href="/protected" className="flex items-center gap-2">
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.projectTools} label="Project Tools" />
        <NavDocuments items={data.financial} label="Financial" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
