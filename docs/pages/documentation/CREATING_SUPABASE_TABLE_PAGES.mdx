# Creating Pages for Supabase Tables

This guide documents the standardized process for creating new pages that display data from Supabase tables, ensuring consistency and efficiency across the application.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step-by-Step Process](#step-by-step-process)
- [Component Architecture](#component-architecture)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

Our application uses a standardized approach for creating pages that display Supabase table data. This approach:
- **Maintains consistency** across all data table pages
- **Reuses components** to reduce code duplication
- **Follows Next.js 15 App Router** conventions
- **Implements server-side data fetching** for optimal performance
- **Provides rich features** out-of-the-box (search, filter, sort, export, edit, delete)

## Prerequisites

### 1. Verify Schema and Generate Types

**CRITICAL**: Before creating any page, you must validate the database schema and generate/update Supabase types.

```bash
# Step 1: Run schema validation
cd backend
./scripts/check_schema.sh

# Step 2: Generate/update Supabase types
cd ../frontend
npx supabase gen types typescript --local > src/types/database.types.ts
# OR for production:
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/database.types.ts
```

**🚀 AUTOMATION TIP**: Set up automatic type generation with GitHub Actions (see [Type Automation](#type-automation) section below)

### 2. Read the Generated Types

Always read `src/types/database.types.ts` to understand:
- Exact table names
- Column names and types
- Relationships and foreign keys
- Required vs optional fields

**Never assume table or column names** - always verify from the types file.

### 3. Use Type Helpers (Recommended)

Use Supabase's helper types for cleaner code:

```typescript
import { Tables } from '@/types/database.types'

// ✅ RECOMMENDED: Clean and concise
type Meeting = Tables<'document_metadata'>
type MeetingInsert = Tables<'document_metadata'>['Insert']
type MeetingUpdate = Tables<'document_metadata'>['Update']

// ❌ OLD WAY: Verbose
type Meeting = Database['public']['Tables']['document_metadata']['Row']
```

## Step-by-Step Process

### Step 1: Create the Data Table Component

Create a reusable data table component in `frontend/src/components/tables/`.

**File**: `frontend/src/components/tables/[entity]-data-table.tsx`

```tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Download,
  Columns3,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Database } from '@/types/database.types'

// Use the exact type from database.types.ts
export type YourEntity = Database['public']['Tables']['your_table_name']['Row']

interface YourEntityDataTableProps {
  entities: YourEntity[]
}

// Define visible columns
const COLUMNS = [
  { id: "name", label: "Name", defaultVisible: true },
  { id: "status", label: "Status", defaultVisible: true },
  { id: "created_at", label: "Created", defaultVisible: true },
]

export function YourEntityDataTable({ entities: initialEntities }: YourEntityDataTableProps) {
  const router = useRouter()
  const [entities, setEntities] = useState(initialEntities)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(COLUMNS.filter(col => col.defaultVisible).map(col => col.id))
  )

  // Filter logic
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch =
        entity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || entity.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [entities, searchTerm, statusFilter])

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return format(new Date(date), 'MMM dd, yyyy')
  }

  const exportToCSV = () => {
    const headers = COLUMNS.filter(col => visibleColumns.has(col.id)).map(col => col.label)
    const rows = filteredEntities.map(entity => [
      entity.name || '',
      entity.status || '',
      formatDate(entity.created_at)
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'entities.csv'
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Entities</h2>
          <p className="text-muted-foreground">
            Manage and track all your entities
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {filteredEntities.length} of {entities.length} entities
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="h-4 w-4 mr-2" />
                Columns
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COLUMNS.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns.has(column.id)}
                  onCheckedChange={(checked) => {
                    const newVisibleColumns = new Set(visibleColumns)
                    if (checked) {
                      newVisibleColumns.add(column.id)
                    } else {
                      newVisibleColumns.delete(column.id)
                    }
                    setVisibleColumns(newVisibleColumns)
                  }}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.has('name') && <TableHead>Name</TableHead>}
              {visibleColumns.has('status') && <TableHead>Status</TableHead>}
              {visibleColumns.has('created_at') && <TableHead>Created</TableHead>}
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.filter(col => visibleColumns.has(col.id)).length + 1}
                  className="h-24 text-center"
                >
                  No entities found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEntities.map((entity) => (
                <TableRow
                  key={entity.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/entities/${entity.id}`)}
                >
                  {visibleColumns.has('name') && (
                    <TableCell>
                      <div className="font-medium">{entity.name}</div>
                    </TableCell>
                  )}
                  {visibleColumns.has('status') && (
                    <TableCell>
                      <Badge variant="outline">{entity.status}</Badge>
                    </TableCell>
                  )}
                  {visibleColumns.has('created_at') && (
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(entity.created_at)}
                    </TableCell>
                  )}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* Add edit/delete actions here */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

### Step 2: Create the Server-Side Page

Create a page component that fetches data server-side.

**File**: `frontend/src/app/(your-group)/[entity-name]/page.tsx`

```tsx
import { createClient } from '@/lib/supabase/server'
import { YourEntityDataTable } from '@/components/tables/your-entity-data-table'

export default async function YourEntityPage() {
  const supabase = await createClient()

  // Fetch data from Supabase
  // IMPORTANT: Use exact table name from database.types.ts
  const { data: entities, error } = await supabase
    .from('your_table_name')  // Use exact name from types
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching entities:', error)
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-600">
          Error loading entities. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <YourEntityDataTable entities={entities || []} />
    </div>
  )
}
```

### Step 3: Export from Index (Optional but Recommended)

Update `frontend/src/components/tables/index.ts`:

```tsx
export { YourEntityDataTable } from './your-entity-data-table'
```

### Step 4: Update Navigation

Add the new page to the site header navigation in `frontend/src/components/site-header.tsx`:

```tsx
const projectManagementTools = [
  // ... existing tools
  { name: "Your Entities", href: "/your-entities" },
]
```

### Step 5: Create E2E Test

Create a Playwright test in `frontend/tests/e2e/`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Your Entity Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/your-entities')
    await page.waitForLoadState('networkidle')
  })

  test('should display the page with correct heading', async ({ page }) => {
    const heading = page.locator('h2:has-text("Your Entities")')
    await expect(heading).toBeVisible()
  })

  test('should display the table', async ({ page }) => {
    const table = page.locator('table')
    await expect(table).toBeVisible()
  })

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()
  })

  test('should take a screenshot', async ({ page }) => {
    await page.screenshot({
      path: 'frontend/tests/screenshots/your-entities-page.png',
      fullPage: true
    })
  })
})
```

### Step 6: Update Playwright Config

Add the test to `frontend/config/playwright/playwright.config.ts`:

```typescript
testMatch: /comprehensive-page-check\.spec\.ts|check-styling\.spec\.ts|project-tools-dropdown\.spec\.ts|meetings2-page\.spec\.ts|your-entities-page\.spec\.ts/,
```

### Step 7: Run Tests

```bash
cd frontend
BASE_URL=http://localhost:3002 npx playwright test -c config/playwright/playwright.config.ts your-entities-page
```

## Component Architecture

### Standard Components Used

All table pages should use these standardized components:

1. **UI Components** (from `@/components/ui/`)
   - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
   - `Button`
   - `Input`
   - `Badge`
   - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
   - `DropdownMenu` and related components
   - `Dialog` (for edit/delete modals)

2. **Icons** (from `lucide-react`)
   - `Search`, `Download`, `Columns3`, `ChevronDown`, `MoreHorizontal`
   - `Pencil`, `Trash2`, `Eye`, etc.

3. **Utilities**
   - `date-fns` for date formatting
   - `@/lib/utils` for className merging

### Data Flow

```
┌─────────────────────────────────────────────┐
│  Page Component (Server-Side)              │
│  - Fetch data from Supabase                │
│  - Handle errors                            │
│  - Pass data to DataTable                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  DataTable Component (Client-Side)         │
│  - Search/Filter state management          │
│  - Column visibility toggle                │
│  - Export to CSV                            │
│  - Edit/Delete actions                      │
│  - Render table with data                  │
└─────────────────────────────────────────────┘
```

## Examples

### Example 1: Meetings Page

**Table**: `document_metadata` (where `type = 'meeting'`)

**Files**:
- Component: `frontend/src/components/tables/meetings-data-table.tsx`
- Page: `frontend/src/app/(project-mgmt)/meetings2/page.tsx`
- Test: `frontend/tests/e2e/meetings2-page.spec.ts`

**Key Features**:
- Year-based filtering with tabs
- Sortable columns
- Search across multiple fields
- Export to CSV
- Inline editing with dialog

### Example 2: Projects Page

**Table**: `projects`

**Files**:
- Component: `frontend/src/components/portfolio/projects-table.tsx`
- Uses: Generic editable table pattern

**Key Features**:
- Category and phase filters
- Budget display with currency formatting
- Timeline display with date ranges
- Edit/Delete with confirmation

## Best Practices

### 1. Always Validate Schema First

```bash
# BEFORE creating any page
cd backend && ./scripts/check_schema.sh
```

This prevents errors like:
- Wrong table names
- Incorrect column references
- Missing required fields
- Type mismatches

### 2. Use Exact Names from Types

```typescript
// ✅ CORRECT - Use exact name from database.types.ts
const { data } = await supabase.from('document_metadata').select('*')

// ❌ WRONG - Assumed name
const { data } = await supabase.from('documents').select('*')
```

### 3. Handle Loading and Error States

```tsx
if (error) {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center text-red-600">
        Error loading data. Please try again later.
      </div>
    </div>
  )
}

if (!data || data.length === 0) {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center text-muted-foreground">
        No data found.
      </div>
    </div>
  )
}
```

### 4. Implement Search Across Relevant Fields

```typescript
const matchesSearch =
  entity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  entity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  entity.category?.toLowerCase().includes(searchTerm.toLowerCase())
```

### 5. Use Memoization for Filtered Data

```typescript
const filteredEntities = useMemo(() => {
  return entities.filter(entity => {
    // Filter logic here
  })
}, [entities, searchTerm, statusFilter])
```

### 6. Provide Export Functionality

```typescript
const exportToCSV = () => {
  const headers = COLUMNS.filter(col => visibleColumns.has(col.id)).map(col => col.label)
  const rows = filteredEntities.map(entity => [
    // Map entity fields to row
  ])
  // Generate and download CSV
}
```

### 7. Implement Column Visibility Toggle

```typescript
const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
  new Set(COLUMNS.filter(col => col.defaultVisible).map(col => col.id))
)
```

### 8. Add Row Click Navigation

```typescript
<TableRow
  onClick={() => router.push(`/entities/${entity.id}`)}
  className="cursor-pointer hover:bg-muted/50"
>
```

### 9. Stop Propagation on Action Buttons

```typescript
<TableCell onClick={(e) => e.stopPropagation()}>
  {/* Action buttons */}
</TableCell>
```

### 10. Format Dates Consistently

```typescript
const formatDate = (date: string | null) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM dd, yyyy')
}
```

## Troubleshooting

### Common Issues

1. **Error: "column does not exist"**
   - Solution: Run schema validation and check column name in types

2. **Error: "relation does not exist"**
   - Solution: Verify table name in database.types.ts

3. **Empty table display**
   - Check filter logic
   - Verify data is being fetched correctly
   - Check for null/undefined values

4. **TypeScript errors**
   - Regenerate types: `npx supabase gen types typescript --local`
   - Check imports from `@/types/database.types`

### Debug Checklist

- [ ] Schema validation passed
- [ ] Types regenerated
- [ ] Exact table name used
- [ ] Exact column names used
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Search functionality working
- [ ] Filters working correctly
- [ ] Export to CSV working
- [ ] Column visibility toggle working
- [ ] Navigation working
- [ ] Tests passing

## Type Automation

### Automatic Type Updates with GitHub Actions

Set up automatic type synchronization to eliminate manual type generation:

**Step 1**: Add script to `package.json`:

```json
{
  "scripts": {
    "update-types": "npx supabase gen types typescript --project-id \"$PROJECT_REF\" --schema public > src/types/database.types.ts"
  }
}
```

**Step 2**: Create `.github/workflows/update-types.yml`:

```yaml
name: Update Supabase Types

on:
  schedule:
    # Runs every night at 2am UTC
    - cron: '0 2 * * *'
  workflow_dispatch:  # Allows manual trigger

jobs:
  update-types:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Generate types
        env:
          PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}
        run: cd frontend && npm run update-types

      - name: Commit updated types
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'chore: update database types'
          file_pattern: 'frontend/src/types/database.types.ts'
```

**Step 3**: Add GitHub secrets:
- `SUPABASE_PROJECT_REF`: Your Supabase project ID
- `SUPABASE_ACCESS_TOKEN`: Your Supabase access token

### Advanced Type Features

#### 1. Query-Based Type Inference

Let TypeScript infer types from your queries automatically:

```typescript
import { QueryData } from '@supabase/supabase-js'

const meetingsQuery = supabase
  .from('document_metadata')
  .select('id, title, date, project')
  .eq('type', 'meeting')

// Type automatically inferred from the query!
type Meeting = QueryData<typeof meetingsQuery>[number]

// Now use it:
const { data } = await meetingsQuery
// data is automatically typed as Meeting[]
```

#### 2. Type-Safe JSONB Columns

For tables with JSONB columns, extend the generated types:

```typescript
import { MergeDeep } from 'type-fest'
import { Database } from '@/types/database.types'

type CustomDatabase = MergeDeep<
  Database,
  {
    public: {
      Tables: {
        document_metadata: {
          Row: {
            metadata: {
              custom_field: string
              tags: string[]
            }
          }
        }
      }
    }
  }
>
```

#### 3. Helper Type Shortcuts

```typescript
import { Tables, Enums } from '@/types/database.types'

// Tables
type Meeting = Tables<'document_metadata'>
type Project = Tables<'projects'>

// Enums
type Status = Enums<'status_enum'>

// Insert/Update variants
type MeetingInsert = Tables<'document_metadata'>['Insert']
type MeetingUpdate = Tables<'document_metadata'>['Update']
```

### Benefits of Type Automation

✅ **Always in Sync**: Types automatically update when schema changes
✅ **Faster Development**: No manual type generation needed
✅ **Catch Errors Early**: Schema changes immediately visible in IDE
✅ **Team Collaboration**: Everyone gets updated types automatically
✅ **CI/CD Integration**: Types update before deployments

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Type Generation Guide](https://supabase.com/docs/guides/api/rest/generating-types)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Playwright Testing](https://playwright.dev/)

## Conclusion

By following this standardized process, you ensure:
- **Consistency** across all data table pages
- **Efficiency** through component reuse
- **Reliability** with proper schema validation
- **Maintainability** with clear patterns and documentation

Remember: **Always validate schema and generate types BEFORE creating any new page!**

---

**Last Updated**: 2025-12-12
**Version**: 1.0
