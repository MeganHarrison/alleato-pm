# Query Parameter Project Support

## Overview

Extended the project scoping system to support project IDs from **both URL paths AND query parameters**.

## Problem

Previously, the project context only worked with URL path-based project IDs:
- ✅ Works: `/123/home` (project ID in path)
- ❌ Doesn't work: `/change-orders?project=60` (project ID in query)

When navigating to pages like `/change-orders?project=60`, the project dropdown in the header would not display the selected project.

## Solution

Updated both the **ProjectContext** and **SiteHeader** to check for project IDs in query parameters as well as URL paths.

## Implementation Details

### 1. Project Context Provider ([project-context.tsx](frontend/src/contexts/project-context.tsx))

**Before:**
```tsx
const projectIdFromUrl = React.useMemo(() => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && /^\d+$/.test(segments[0])) {
    return parseInt(segments[0], 10)
  }
  return null
}, [pathname])
```

**After:**
```tsx
const projectIdFromUrl = React.useMemo(() => {
  // First check URL path segments
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && /^\d+$/.test(segments[0])) {
    return parseInt(segments[0], 10)
  }

  // Then check query parameters
  const projectParam = searchParams.get('project')
  if (projectParam && /^\d+$/.test(projectParam)) {
    return parseInt(projectParam, 10)
  }

  return null
}, [pathname, searchParams])
```

### 2. Site Header ([site-header.tsx](frontend/src/components/site-header.tsx))

**Before:**
```tsx
const projectId = useMemo(() => {
  const segments = pathname?.split("/").filter(Boolean) ?? []
  const firstSegment = segments[0]
  return firstSegment && /^\d+$/.test(firstSegment) ? parseInt(firstSegment) : null
}, [pathname])
```

**After:**
```tsx
const projectId = useMemo(() => {
  // First check URL path segments
  const segments = pathname?.split("/").filter(Boolean) ?? []
  const firstSegment = segments[0]
  if (firstSegment && /^\d+$/.test(firstSegment)) {
    return parseInt(firstSegment)
  }

  // Then check query parameters
  const projectParam = searchParams?.get('project')
  if (projectParam && /^\d+$/.test(projectParam)) {
    return parseInt(projectParam)
  }

  return null
}, [pathname, searchParams])
```

## Usage Examples

### URL Path Style (Original)
```
/123/home           → Project ID: 123 ✅
/456/budget         → Project ID: 456 ✅
/789/tasks          → Project ID: 789 ✅
```

### Query Parameter Style (New)
```
/change-orders?project=60       → Project ID: 60 ✅
/budget?project=123             → Project ID: 123 ✅
/commitments?project=456        → Project ID: 456 ✅
```

### Priority Order

When both are present, **URL path takes precedence**:
```
/123/home?project=456  → Uses project ID 123 (from path)
```

This ensures backward compatibility and prevents confusion.

## Benefits

1. ✅ **Flexibility** - Support both routing styles
2. ✅ **Backward Compatible** - Existing URLs still work
3. ✅ **Consistent UX** - Project always displays in header
4. ✅ **Query-Based Navigation** - Easier to pass project context via query params

## Use Cases

### When to use Query Parameters?

1. **Shareable Links**: Easy to share links with project context
   ```
   /reports?project=123&type=financial
   ```

2. **External Navigation**: When coming from external sources
   ```
   Email link: https://app.example.com/dashboard?project=60
   ```

3. **Filter-Heavy Pages**: Combine project with other filters
   ```
   /search?project=123&status=active&type=subcontract
   ```

### When to use URL Paths?

1. **Project-Scoped Routes**: When the entire section is project-specific
   ```
   /123/home
   /123/tasks
   /123/meetings
   ```

2. **Nested Resources**: When navigating within a project
   ```
   /123/tasks/456
   /123/meetings/789
   ```

## Technical Notes

### Next.js Hooks Used

- `usePathname()` - Get current URL path
- `useSearchParams()` - Get current query parameters
- `useRouter()` - Navigation

### Search Params Handling

The `useSearchParams()` hook is from Next.js 13+ and provides:
- Type-safe access to query parameters
- Automatic updates when URL changes
- Server and client component support

## Testing

### Manual Testing

1. **Test URL Path Style:**
   ```
   Navigate to: http://localhost:3001/60/home
   Expected: Project "60" shows in header dropdown
   ```

2. **Test Query Param Style:**
   ```
   Navigate to: http://localhost:3001/change-orders?project=60
   Expected: Project "60" shows in header dropdown
   ```

3. **Test Priority:**
   ```
   Navigate to: http://localhost:3001/123/home?project=60
   Expected: Project "123" shows (path takes precedence)
   ```

### Automated Testing

Add test cases to the existing Playwright tests:

```typescript
test('should extract project from query parameter', async ({ page }) => {
  await page.goto('/change-orders?project=60');

  const projectSelector = page.getByRole('button', { name: /Project/i });
  await expect(projectSelector).toBeVisible();
  await expect(projectSelector).not.toContainText('Select Project');
});
```

## Migration Considerations

### No Breaking Changes

This is a **purely additive** change:
- ✅ All existing URLs continue to work
- ✅ No API changes required
- ✅ No database changes required
- ✅ Backward compatible

### Recommended Approach

For new features, choose based on context:
- Use **URL paths** for project-centric navigation
- Use **query params** for filtering and sharing

## Files Modified

1. [project-context.tsx](frontend/src/contexts/project-context.tsx) - Added searchParams support
2. [site-header.tsx](frontend/src/components/site-header.tsx) - Added searchParams support

## Related Documentation

- [PROJECT_SCOPING_IMPLEMENTATION.md](PROJECT_SCOPING_IMPLEMENTATION.md) - Main project scoping system
- [BREADCRUMB_UPDATE.md](BREADCRUMB_UPDATE.md) - Breadcrumb improvements

---

**Last Updated**: 2025-12-14
**Related Issue**: Header not showing project when using query parameters
