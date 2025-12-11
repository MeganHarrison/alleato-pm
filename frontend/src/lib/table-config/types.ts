import { ColumnDef } from "@tanstack/react-table"

export type ColumnFormat =
  | "text"
  | "currency"
  | "date"
  | "link"
  | "badge"
  | "number"
  | "percent"
  | "array"

export interface ColumnConfig<T = Record<string, unknown>> {
  /** The key/accessor for this column in the data */
  key: keyof T & string
  /** Display header text */
  header: string
  /** How to format the cell value */
  format?: ColumnFormat
  /** Whether this column is sortable */
  sortable?: boolean
  /** Whether this column is hidden by default */
  hidden?: boolean
  /** Custom width class (e.g., "w-32", "min-w-[200px]") */
  width?: string
  /** For badge format: mapping of values to colors */
  badgeColors?: Record<string, string>
  /** For link format: whether to open in new tab */
  linkExternal?: boolean
  /** Whether this column should be sticky (frozen) on horizontal scroll */
  sticky?: boolean
  /** Make the cell value a clickable link to the row's detail page */
  linkToRow?: boolean
  /** Custom cell renderer (overrides format) */
  cell?: ColumnDef<T>["cell"]
}

export interface TablePageConfig<T = Record<string, unknown>> {
  /** Page title */
  title: string
  /** Page description/subtitle */
  description?: string
  /** Supabase table name */
  table: string
  /** Column configurations */
  columns: ColumnConfig<T>[]
  /** Columns to use as search filters */
  searchableColumns?: (keyof T & string)[]
  /** Route for create button (if applicable) */
  createRoute?: string
  /** Label for create button */
  createLabel?: string
  /** Row actions to show */
  actions?: ("view" | "edit" | "delete")[]
  /** Route pattern for view action (use :id for id placeholder) */
  viewRoute?: string
  /** Route pattern for edit action */
  editRoute?: string
  /** Default sort column */
  defaultSort?: keyof T & string
  /** Default sort direction */
  defaultSortDirection?: "asc" | "desc"
  /** Select query string (defaults to "*") */
  selectQuery?: string
  /** Additional query filters */
  filters?: Record<string, unknown>
  /** Page size options */
  pageSizeOptions?: number[]
  /** Default page size */
  defaultPageSize?: number
}

export interface TablePageProps<T = Record<string, unknown>> {
  config: TablePageConfig<T>
}
