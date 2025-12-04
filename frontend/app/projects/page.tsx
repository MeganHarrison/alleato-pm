"use client"

import { DataTablePage } from "@/components/table-page"
import { projectsTableConfig } from "@/lib/table-config/projects"

export default function ProjectsPage() {
  return <DataTablePage config={projectsTableConfig} />
}
