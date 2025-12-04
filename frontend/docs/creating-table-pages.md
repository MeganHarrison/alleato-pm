# Creating New Table Pages

This guide explains how to quickly create new pages that display Supabase table data using the reusable table page system.

## Quick Start

Creating a new table page requires 3 files:

1. **Type definition** - TypeScript interface for your data
2. **Table config** - Column definitions and page settings
3. **Page component** - The actual page (usually ~7 lines)
4. **API route** - Backend endpoint for fetching data

## Step-by-Step Guide

### 1. Create the Type Definition

Create a TypeScript interface that matches your Supabase table schema.

**File:** `types/{table-name}.ts`

```typescript
export interface Meeting {
  id: number
  created_at: string
  title: string | null
  date: string | null
  location: string | null
  attendees: string[] | null
  status: "scheduled" | "completed" | "cancelled" | null
  notes: string | null
}
```

### 2. Create the Table Config

Define how columns should be displayed and what features to enable.

**File:** `lib/table-config/{table-name}.ts`

```typescript
import { TablePageConfig } from "./types"
import { Meeting } from "@/types/meeting"

export const meetingsTableConfig: TablePageConfig<Meeting> = {
  // Page header
  title: "Meetings",
  description: "Manage project meetings and appointments",

  // Supabase table name (used for API route)
  table: "meetings",

  // Column definitions
  columns: [
    {
      key: "title",
      header: "Title",
      sortable: true,
    },
    {
      key: "date",
      header: "Date",
      format: "date",
      sortable: true,
    },
    {
      key: "location",
      header: "Location",
    },
    {
      key: "attendees",
      header: "Attendees",
      format: "array",
    },
    {
      key: "status",
      header: "Status",
      format: "badge",
      badgeColors: {
        "scheduled": "bg-blue-100 text-blue-800",
        "completed": "bg-green-100 text-green-800",
        "cancelled": "bg-red-100 text-red-800",
      },
    },
  ],

  // Optional: columns to add search filters for
  searchableColumns: ["title", "location"],

  // Optional: enable create button
  createRoute: "/meetings/new",
  createLabel: "New Meeting",

  // Optional: row actions
  actions: ["view", "edit", "delete"],
  viewRoute: "/meetings/:id",
  editRoute: "/meetings/:id/edit",

  // Optional: default sorting
  defaultSort: "date",
  defaultSortDirection: "desc",

  // Optional: pagination
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
}
```

### 3. Create the Page Component

The page component is minimal - it just passes the config to `DataTablePage`.

**File:** `app/{table-name}/page.tsx`

```typescript
"use client"

import { DataTablePage } from "@/components/table-page"
import { meetingsTableConfig } from "@/lib/table-config/meetings"

export default function MeetingsPage() {
  return <DataTablePage config={meetingsTableConfig} />
}
```

### 4. Create the API Route

Create the backend endpoint to fetch data from Supabase.

**File:** `app/api/{table-name}/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = (page - 1) * limit
    const search = searchParams.get("search")

    let query = supabase
      .from("meetings")  // <- Your table name
      .select("*", { count: "exact" })
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      meta: { page, limit, total: count },
    })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
```

**File:** `app/api/{table-name}/[id]/route.ts` (for delete functionality)

```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("meetings").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
```

## Column Configuration Reference

### Column Formats

| Format | Description | Example Output |
|--------|-------------|----------------|
| `text` | Plain text (default) | `Hello World` |
| `currency` | USD currency format | `$1,234.56` |
| `date` | Formatted date | `Dec 3, 2025` |
| `number` | Formatted number | `1,234` |
| `percent` | Percentage | `75.5%` |
| `link` | Clickable URL | `Link ↗` |
| `badge` | Colored badge | ![badge] |
| `array` | Comma-separated list | `Item 1, Item 2` |

### Column Options

```typescript
interface ColumnConfig {
  key: string           // Column key (matches data property)
  header: string        // Display header text
  format?: ColumnFormat // How to format values
  sortable?: boolean    // Enable sorting
  hidden?: boolean      // Hidden by default (toggleable)
  width?: string        // Tailwind width class
  badgeColors?: Record<string, string>  // For badge format
  linkExternal?: boolean // Open links in new tab
  cell?: (props) => ReactNode // Custom cell renderer
}
```

### Table Page Config Options

```typescript
interface TablePageConfig {
  // Required
  title: string         // Page title
  table: string         // Supabase table name
  columns: ColumnConfig[]

  // Optional - Page
  description?: string  // Subtitle text

  // Optional - Filtering
  searchableColumns?: string[]  // Column-specific filters
  filters?: Record<string, unknown>  // Default query filters

  // Optional - Actions
  createRoute?: string  // Route for "Add New" button
  createLabel?: string  // Button label (default: "Add New")
  actions?: ("view" | "edit" | "delete")[]
  viewRoute?: string    // Use :id placeholder
  editRoute?: string    // Use :id placeholder

  // Optional - Sorting
  defaultSort?: string
  defaultSortDirection?: "asc" | "desc"

  // Optional - Pagination
  defaultPageSize?: number
  pageSizeOptions?: number[]

  // Optional - Query
  selectQuery?: string  // Custom select (default: "*")
}
```

## Examples

### Financial Table (Currency Columns)

```typescript
export const invoicesTableConfig: TablePageConfig<Invoice> = {
  title: "Invoices",
  table: "invoices",
  columns: [
    { key: "number", header: "Invoice #", sortable: true },
    { key: "vendor", header: "Vendor", sortable: true },
    { key: "amount", header: "Amount", format: "currency", sortable: true },
    { key: "due_date", header: "Due Date", format: "date", sortable: true },
    {
      key: "status",
      header: "Status",
      format: "badge",
      badgeColors: {
        "paid": "bg-green-100 text-green-800",
        "pending": "bg-yellow-100 text-yellow-800",
        "overdue": "bg-red-100 text-red-800",
      },
    },
  ],
  actions: ["view", "edit"],
}
```

### Simple List Table

```typescript
export const categoriesTableConfig: TablePageConfig<Category> = {
  title: "Categories",
  table: "categories",
  columns: [
    { key: "name", header: "Name", sortable: true },
    { key: "description", header: "Description" },
    { key: "item_count", header: "Items", format: "number" },
  ],
  createRoute: "/categories/new",
  actions: ["edit", "delete"],
}
```

### Table with External Links

```typescript
export const documentsTableConfig: TablePageConfig<Document> = {
  title: "Documents",
  table: "documents",
  columns: [
    { key: "name", header: "Document Name", sortable: true },
    { key: "type", header: "Type" },
    { key: "url", header: "File", format: "link", linkExternal: true },
    { key: "uploaded_at", header: "Uploaded", format: "date", sortable: true },
  ],
  searchableColumns: ["name"],
}
```

## File Structure

After creating a new table page, your file structure should look like:

```
frontend/
├── app/
│   ├── {table-name}/
│   │   └── page.tsx
│   └── api/
│       └── {table-name}/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── lib/
│   └── table-config/
│       ├── types.ts
│       ├── formatters.ts
│       ├── index.ts
│       └── {table-name}.ts
└── types/
    └── {table-name}.ts
```

## Tips

1. **Start simple** - Add only the columns you need initially
2. **Use `hidden: true`** - For columns that should be toggleable but hidden by default
3. **Badge colors** - Use Tailwind color utilities like `bg-{color}-100 text-{color}-800`
4. **Custom cells** - For complex rendering, use the `cell` property with a custom function
5. **Reuse configs** - Export configs and modify them for different views of the same data
