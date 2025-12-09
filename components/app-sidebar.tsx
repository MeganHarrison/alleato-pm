"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
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
  user: {
    name: "User",
    email: "user@alleato.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Projects",
      url: "/",
      icon: IconFolder,
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: IconListDetails,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Sitemap",
      url: "/sitemap-view",
      icon: IconListDetails,
    },
    {
      title: "Doc Viewer",
      url: "http://localhost:3333",
      icon: IconReport,
    },
    {
      title: "Docs Infinite",
      url: "/documents-infinite",
      icon: IconDatabase,
    },
    {
      title: "Docs Query",
      url: "/infinite-query",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Contracts",
      url: "/contracts",
      icon: IconChartBar,
    },
    {
      name: "Budget",
      url: "/budget",
      icon: IconDatabase,
    },
    {
      name: "Commitments",
      url: "/commitments",
      icon: IconReport,
    },
    {
      name: "Change Orders - Create",
      url: "/#",
      icon: IconFileAi,
    },
    {
      name: "Change Events - Create",
      url: "/#",
      icon: IconCamera,
    },
    {
      name: "Direct Costs - Create",
      url: "/#",
      icon: IconReport,
    },
    {
      name: "Invoicing - Create",
      url: "/#",
      icon: IconFolder,
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
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
