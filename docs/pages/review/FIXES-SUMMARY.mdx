# Fixes Summary - Infinite Query Issues

## Date: 2025-12-12

This document summarizes all fixes made to the infinite query functionality across the application.

---

## Issue 1: Filters Not Working on Documents Infinite Page

### Problem
Changing filters on `/documents-infinite` had no effect - the same documents remained visible.

### Root Cause
The `useInfiniteQuery` hook wasn't detecting when the `trailingQuery` function changed due to filter state updates.

### Solution
**File**: `frontend/src/app/(procore)/documents-infinite/page.tsx`

Wrapped `trailingQuery` in `useCallback` with proper dependencies:

```typescript
const trailingQuery = useCallback<SupabaseQueryHandler<'document_metadata'>>(
  (query) => {
    let filteredQuery = query
      .order('date', { ascending: false })
      .order('id', { ascending: false })

    if (typeFilter !== 'all') {
      filteredQuery = filteredQuery.eq('type', typeFilter)
    }
    if (categoryFilter !== 'all') {
      filteredQuery = filteredQuery.eq('category', categoryFilter)
    }
    if (statusFilter !== 'all') {
      filteredQuery = filteredQuery.eq('status', statusFilter)
    }

    return filteredQuery
  },
  [typeFilter, categoryFilter, statusFilter]
)
```

**File**: `frontend/src/hooks/use-infinite-query.ts`

Fixed the hook to properly detect when trailingQuery changes.

---

## Issue 2: Load More Button Not Working

### Problem
Clicking "Load More" on `/infinite-projects` and `/documents-infinite` did nothing - no new data loaded.

### Root Causes

1. **Store Recreated on Every Render**: The `useEffect` dependency on `props` (an object that changes every render) caused the store to be recreated and reinitialized constantly, wiping out pagination state.

2. **Race Condition with isFetching State**: Setting `isFetching: false` in a separate `setState` call created inconsistent state.

3. **Unstable fetchNextPage Reference**: The function reference changed on every render, causing stale closures.

### Solutions

#### Fix 1: Stable Dependencies Instead of Props Object
**File**: `frontend/src/hooks/use-infinite-query.ts` (lines 207-221)

Changed from using `props` (which changes every render) to individual stable dependencies:

```typescript
// Before (BROKEN):
useEffect(() => {
  if (storeRef.current.getState().hasInitialFetch) {
    storeRef.current = createStore<TData, T>(props)
    storeRef.current.initialize()
  }
}, [props]) // ❌ Props object changes every render!

// After (FIXED):
useEffect(() => {
  if (!storeRef.current.getState().hasInitialFetch) return

  const currentProps: UseInfiniteQueryProps<T> = {
    tableName,
    columns,
    pageSize,
    trailingQuery,
  }
  storeRef.current = createStore<TData, T>(currentProps)
  storeRef.current.initialize()
}, [tableName, columns, pageSize, trailingQuery]) // ✅ Only changes when values actually change
```

#### Fix 2: Consolidated State Updates
**File**: `frontend/src/hooks/use-infinite-query.ts` (lines 137-149)

Combined `isFetching: false` with data updates:

```typescript
// Before (BROKEN):
setState({
  data: [...state.data, ...(newData as TData[])],
  count: count || 0,
  isSuccess: true,
  error: null,
})
setState({ isFetching: false }) // ❌ Separate call = race condition

// After (FIXED):
setState({
  data: [...state.data, ...(newData as TData[])],
  count: count || 0,
  isSuccess: true,
  error: null,
  isFetching: false, // ✅ Atomic update
})
```

#### Fix 3: Stable fetchNextPage Callback
**File**: `frontend/src/hooks/use-infinite-query.ts` (lines 223-226)

Created a stable callback that always references the current store:

```typescript
const fetchNextPage = useCallback(() => {
  storeRef.current.fetchNextPage()
}, [])
```

#### Fix 4: Added Secondary Sort Order
**Files**:
- `frontend/src/app/(procore)/documents-infinite/page.tsx`
- `frontend/src/app/infinite-projects/page.tsx`

Added `id` as a secondary sort to prevent pagination overlap with duplicate dates:

```typescript
let filteredQuery = query
  .order('date', { ascending: false })
  .order('id', { ascending: false }) // ✅ Prevents duplicate-date overlap
```

---

## Issue 3: Database Types File Location

### Problem
`database.types.ts` was in the root of the frontend folder instead of the centralized types directory.

### Solution
- **Moved**: `frontend/database.types.ts` → `frontend/src/types/database.types.ts`
- **Updated**: 4 files with incorrect import paths
- **Updated**: Documentation in `.agents/rules/supabase/generate-supabase-types.md`

---

## Files Modified

### Core Hook
- `frontend/src/hooks/use-infinite-query.ts`
  - Fixed dependency tracking (stable deps instead of props object)
  - Consolidated state updates (atomic isFetching update)
  - Added stable fetchNextPage callback
  - Added debug logging

### Page Components
- `frontend/src/app/(procore)/documents-infinite/page.tsx`
  - Added useCallback for trailingQuery
  - Added secondary sort by id

- `frontend/src/app/infinite-projects/page.tsx`
  - Added secondary sort by id

### Database Types
- Moved `frontend/database.types.ts` → `frontend/src/types/database.types.ts`
- Updated imports in:
  - `frontend/src/app/(procore)/[projectId]/home/page.tsx`
  - `frontend/src/app/(procore)/meetings/[id]/page.tsx`
  - `frontend/src/components/tables/meetings-data-table.tsx`
  - `frontend/src/components/project-home/document-metadata-modal.tsx`

### Documentation
- `.agents/rules/supabase/generate-supabase-types.md` - Updated paths
- `frontend/CHANGELOG-database-types-move.md` - Created changelog
- `frontend/tests/manual-test-documents-filters.md` - Created test guide
- `frontend/tests/manual-test-infinite-projects-load-more.md` - Created test guide

---

## Testing

### Manual Testing
1. **Filters**: http://localhost:3002/documents-infinite
   - Select different filter values
   - Verify data updates immediately
   - Verify count shows "(filtered)"

2. **Load More**: http://localhost:3002/infinite-projects
   - Click "Load More" button
   - Verify button shows "Loading..." state
   - Verify new data appends (12 → 24 → 36, etc.)
   - Verify button disappears when all data loaded

3. **Combined**: Test filters + load more together
   - Apply a filter
   - Click "Load More"
   - Verify filtered results paginate correctly

### Console Output
With debug logging enabled, you should see:
```
fetchNextPage called { dataLength: 12, isFetching: false }
fetchPage: starting fetch { skip: 12, currentDataLength: 12 }
fetchPage: received data { newDataLength: 12, totalCount: 45 }
```

---

## Technical Details

### Why Props Object Causes Issues
```typescript
// In parent component:
useInfiniteQuery({
  tableName: 'document_metadata',
  columns: '*',
  pageSize: 12,
  trailingQuery,
})
```

This creates a **new object on every render**, even if the values haven't changed. Using it as a dependency causes effects to run on every render.

### Why useCallback Matters
```typescript
// Without useCallback:
const trailingQuery = (query) => { ... } // ❌ New function every render

// With useCallback:
const trailingQuery = useCallback((query) => { ... }, [deps]) // ✅ Stable reference
```

The memoized function only changes when its dependencies change, preventing unnecessary store recreation.

### Why Secondary Sort Matters
```sql
-- Without secondary sort:
SELECT * FROM documents ORDER BY date DESC LIMIT 12 OFFSET 0;
-- Returns: 12 items with date '2024-01-01'

SELECT * FROM documents ORDER BY date DESC LIMIT 12 OFFSET 12;
-- Returns: Could overlap with previous page if more than 12 items share the same date

-- With secondary sort:
SELECT * FROM documents ORDER BY date DESC, id DESC LIMIT 12 OFFSET 12;
-- Returns: Deterministic pagination, no overlap
```

---

## Before vs After

### Before
- ❌ Filters didn't work
- ❌ Load More button did nothing
- ❌ Store reset on every render
- ❌ Race conditions with state updates
- ❌ Pagination could overlap with duplicate dates
- ❌ Database types in wrong location

### After
- ✅ Filters work correctly
- ✅ Load More button loads next page
- ✅ Store only recreates when needed
- ✅ Atomic state updates
- ✅ Deterministic pagination
- ✅ Types in centralized location
- ✅ Debug logging for troubleshooting

---

## Credits
- **Filter fix**: Identified need for useCallback memoization
- **Load More fix**: ChatGPT identified the props dependency issue
- **Secondary sort**: ChatGPT suggested to prevent pagination overlap

---

## Future Improvements

1. **Remove debug logging** once issues are confirmed fixed
2. **Add automated tests** using Playwright
3. **Consider adding loading skeleton** during pagination
4. **Add error boundaries** for better error handling
5. **Consider virtualization** for very long lists

---

**Last Updated**: 2025-12-12
