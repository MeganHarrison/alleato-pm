import { TablePageConfig } from "./types"
import { Project } from "@/types/project"

export const projectsTableConfig: TablePageConfig<Project> = {
  title: "Projects",
  description: "Manage all construction projects",
  table: "projects",
  columns: [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sticky: true,
      linkToRow: true,
    },
    {
      key: "job_number",
      header: "Job Number",
      sortable: true,
    },
    {
      key: "start_date",
      header: "Start Date",
      format: "date",
      sortable: true,
    },
    {
      key: "est_completion_date",
      header: "Est. Completion",
      format: "date",
      sortable: true,
    },
    {
      key: "est_revenue",
      header: "Est. Revenue",
      format: "currency",
      sortable: true,
    },
    {
      key: "est_profit",
      header: "Est. Profit",
      format: "currency",
      sortable: true,
    },
    {
      key: "onedrive",
      header: "OneDrive",
      format: "link",
      linkExternal: true,
    },
    {
      key: "phase",
      header: "Phase",
      format: "badge",
      badgeColors: {
        "Planning": "bg-blue-100 text-blue-800",
        "Pre-Construction": "bg-yellow-100 text-yellow-800",
        "Construction": "bg-orange-100 text-orange-800",
        "Closeout": "bg-purple-100 text-purple-800",
        "Complete": "bg-green-100 text-green-800",
      },
    },
    {
      key: "state",
      header: "State",
    },
    {
      key: "summary",
      header: "Summary",
      hidden: true,
    },
  ],
  searchableColumns: ["name", "job_number"],
  createRoute: "/projects/new",
  createLabel: "New Project",
  actions: ["view", "edit", "delete"],
  viewRoute: "/projects/:id/home",
  editRoute: "/projects/:id/edit",
  defaultSort: "name",
  defaultSortDirection: "asc",
  filters: {
    archived: false,
    excludePhase: "archive",
    phase: "Current",
  },
  defaultPageSize: 20,
}
