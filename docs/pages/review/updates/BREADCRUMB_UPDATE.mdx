# Breadcrumb Display Update

## Overview

Updated the breadcrumb display system to show **project names** instead of **project IDs** throughout the application.

## Changes Made

### 1. Site Header Breadcrumbs ([site-header.tsx](frontend/src/components/site-header.tsx:138-160))

Updated the main header breadcrumb logic to:
- Detect when a URL segment is a numeric project ID
- Replace the project ID with the actual project name
- Show "Project" as placeholder while loading

**Before:**
```
Home > 123 > Budget
```

**After:**
```
Home > Alleato Finance > Budget
```

### 2. Breadcrumb Utility Functions ([breadcrumbs.ts](frontend/src/lib/breadcrumbs.ts))

Created reusable breadcrumb helper functions:
- `getFinancialBreadcrumbs()` - For financial pages (Budget, Commitments, etc.)
- `getProjectManagementBreadcrumbs()` - For project management pages (Tasks, Meetings, etc.)
- `getGeneralBreadcrumbs()` - For general pages

These helpers automatically include the project name in the breadcrumb path.

### 3. Commitments Page ([commitments/page.tsx](frontend/src/app/(financial)/commitments/page.tsx))

Updated to use the new breadcrumb helper:

**Before:**
```tsx
breadcrumbs={[
  { label: 'Financial', href: '/financial' },
  { label: 'Commitments' },
]}
```

**After:**
```tsx
breadcrumbs={getFinancialBreadcrumbs('Commitments', selectedProject)}
```

**Result:**
```
Home > Alleato Finance > Financial > Commitments
```

## Examples

### Financial Pages
When viewing Budget for project "Alleato Finance":
```
Home > Alleato Finance > Financial > Budget
```

When viewing Commitments for project "Westside Construction":
```
Home > Westside Construction > Financial > Commitments
```

### Project Management Pages
When viewing Tasks for project "Downtown Plaza":
```
Home > Downtown Plaza > Tasks
```

### URL Structure
The URL remains the same (using project IDs):
```
/123/home         → Breadcrumb: Home > Alleato Finance
/123/budget       → Breadcrumb: Home > Alleato Finance > Budget (via site header)
/commitments      → Breadcrumb: Home > Alleato Finance > Financial > Commitments (via PageHeader)
```

## Implementation Details

### Site Header (Top Navigation Bar)
- Uses `useMemo` to generate breadcrumbs from URL pathname
- Checks if first segment matches numeric pattern (`/^\d+$/`)
- Replaces project ID with `currentProject?.name`
- Falls back to "Project" if name not loaded yet

### PageHeader (Page-specific breadcrumbs)
- Uses helper functions from `breadcrumbs.ts`
- Automatically includes Home and project name
- Adds category (Financial, etc.) and current page

## Benefits

1. **Better UX**: Users see meaningful project names instead of IDs
2. **Consistency**: Same project name shown in both header and breadcrumbs
3. **Context**: Always clear which project you're viewing
4. **Reusability**: Helper functions make it easy to add breadcrumbs to new pages

## Future Enhancements

1. **Add category breadcrumbs** for all page types (Project Management, Admin, etc.)
2. **Clickable breadcrumbs** that navigate to respective pages
3. **Breadcrumb truncation** for very long project names
4. **Mobile breadcrumb** optimization (show only last 2 items)

## Testing

To test the breadcrumb display:

1. Select a project from the header dropdown
2. Navigate to Budget or Commitments page
3. Check breadcrumb displays project name, not ID

### Expected Results

**Site Header Breadcrumbs** (Top navigation bar):
- `/` → `Home`
- `/123/home` → `Home > Project Name`
- `/123/budget` → `Home > Project Name > Budget`

**PageHeader Breadcrumbs** (Below page title):
- Commitments page: `Home > Project Name > Financial > Commitments`
- Budget page: Uses AppShell layout (no PageHeader breadcrumbs)

## Files Modified

1. [site-header.tsx](frontend/src/components/site-header.tsx) - Main header breadcrumbs
2. [commitments/page.tsx](frontend/src/app/(financial)/commitments/page.tsx) - Updated to use helper
3. [breadcrumbs.ts](frontend/src/lib/breadcrumbs.ts) - New utility functions

## Migration Guide

To add proper breadcrumbs to other pages:

### For Financial Pages
```tsx
import { getFinancialBreadcrumbs } from '@/lib/breadcrumbs';
import { useProject } from '@/contexts/project-context';

function YourPage() {
  const { selectedProject } = useProject();

  return (
    <PageHeader
      title="Your Page"
      breadcrumbs={getFinancialBreadcrumbs('Your Page', selectedProject)}
    />
  );
}
```

### For Project Management Pages
```tsx
import { getProjectManagementBreadcrumbs } from '@/lib/breadcrumbs';
import { useProject } from '@/contexts/project-context';

function YourPage() {
  const { selectedProject } = useProject();

  return (
    <PageHeader
      title="Your Page"
      breadcrumbs={getProjectManagementBreadcrumbs('Your Page', selectedProject)}
    />
  );
}
```

---

**Last Updated**: 2025-12-14
**Related**: PROJECT_SCOPING_IMPLEMENTATION.md
