"use client"

import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function SidebarDemoPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarLeft />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold">Sidebar Demo</h1>
                <p className="text-muted-foreground mt-2">
                  This page demonstrates the sidebar-15 component from shadcn/ui
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Left Sidebar</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Team/workspace switcher</li>
                      <li>Main navigation menu</li>
                      <li>Favorite items</li>
                      <li>Workspaces section</li>
                      <li>Secondary navigation</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Right Sidebar</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>User profile dropdown</li>
                      <li>Date picker calendar</li>
                      <li>Multiple calendar views</li>
                      <li>Quick actions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-2xl font-semibold mb-4">Content Area</h2>
                <p className="text-muted-foreground">
                  This is the main content area. The sidebars are:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Sticky positioned</li>
                  <li>Collapsible on mobile</li>
                  <li>Responsive with breakpoints</li>
                  <li>Integrated with your existing NavUser component</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg border bg-card p-6">
                    <h3 className="font-semibold mb-2">Demo Card {i}</h3>
                    <p className="text-sm text-muted-foreground">
                      Example content to show the layout with sidebars on both sides.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <SidebarRight />
      </div>
    </SidebarProvider>
  )
}
