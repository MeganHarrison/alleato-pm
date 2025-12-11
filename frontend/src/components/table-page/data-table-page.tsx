"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus, IconRefresh } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { TablePageConfig } from "@/lib/table-config"
import { GenericDataTable } from "./generic-data-table"

interface DataTablePageProps<T extends Record<string, unknown>> {
  config: TablePageConfig<T>
}

export function DataTablePage<T extends Record<string, unknown>>({
  config,
}: DataTablePageProps<T>) {
  const router = useRouter()
  const [data, setData] = React.useState<T[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query params from config filters
      const params = new URLSearchParams()
      if (config.filters) {
        Object.entries(config.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
      }
      
      const url = `/api/${config.table}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${config.table}`)
      }
      const result = await response.json()
      setData(result.data || result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [config.table, config.filters])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleView = React.useCallback(
    (row: T) => {
      if (config.viewRoute) {
        const route = config.viewRoute.replace(":id", String((row as Record<string, unknown>).id))
        router.push(route)
      }
    },
    [config.viewRoute, router]
  )

  const handleEdit = React.useCallback(
    (row: T) => {
      if (config.editRoute) {
        const route = config.editRoute.replace(":id", String((row as Record<string, unknown>).id))
        router.push(route)
      }
    },
    [config.editRoute, router]
  )

  const handleDelete = React.useCallback(
    async (row: T) => {
      const id = (row as Record<string, unknown>).id
      if (!confirm("Are you sure you want to delete this item?")) return

      try {
        const response = await fetch(`/api/${config.table}/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Failed to delete")
        }
        // Refresh data after delete
        fetchData()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete")
      }
    },
    [config.table, fetchData]
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
          {config.description && (
            <p className="text-muted-foreground">{config.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <IconRefresh className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {config.createRoute && (
            <Button asChild size="sm">
              <Link href={config.createRoute}>
                <IconPlus className="h-4 w-4" />
                {config.createLabel || "Add New"}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !error && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <IconRefresh className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading {config.title.toLowerCase()}...</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <GenericDataTable
          config={config}
          data={data}
          onView={config.actions?.includes("view") ? handleView : undefined}
          onEdit={config.actions?.includes("edit") ? handleEdit : undefined}
          onDelete={config.actions?.includes("delete") ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
