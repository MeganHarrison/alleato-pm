import { Suspense } from "react"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCards } from "@/components/section-cards"
import { Skeleton } from "@/components/ui/skeleton"

import data from "./data.json"

// Loading component for the data table
function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your construction projects and metrics"
      />
      <div className="@container/main flex flex-1 flex-col gap-6">
        <SectionCards />
        <ChartAreaInteractive />
        <Suspense fallback={<DataTableSkeleton />}>
          <DataTable data={data} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
