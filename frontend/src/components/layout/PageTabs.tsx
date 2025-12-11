"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Tab {
  label: string
  href: string
  count?: number
  isActive?: boolean
}

interface PageTabsProps {
  tabs: Tab[]
  className?: string
}

export function PageTabs({ tabs, className }: PageTabsProps) {
  const pathname = usePathname()

  return (
    <div className={cn("border-b bg-white", className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.isActive ?? pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                  isActive
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    isActive
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {tab.count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}