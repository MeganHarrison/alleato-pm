# Manual Test: Documents Infinite - Filter Functionality

## Test URL
http://localhost:3002/documents-infinite

## Issue Fixed
The filters were not working because the `useInfiniteQuery` hook wasn't detecting changes to the `trailingQuery` function when filter state changed.

## Solution Implemented
1. **Frontend Page** ([documents-infinite/page.tsx](frontend/src/app/(procore)/documents-infinite/page.tsx)):
   - Added `useCallback` to memoize the `trailingQuery` function
   - The function now only recreates when filter values (`typeFilter`, `categoryFilter`, `statusFilter`) change

2. **Hook** ([use-infinite-query.ts](frontend/src/hooks/use-infinite-query.ts)):
   - Updated `useEffect` to properly detect when props change
   - When filters change, the store is recreated and data is refetched

## Manual Test Steps

### Test 1: Initial Load
1. Navigate to http://localhost:3002/documents-infinite
2. **Expected**: Page loads with documents displayed
3. **Expected**: See "Showing X of Y documents" (without "filtered" indicator)

### Test 2: Filter by Type
1. Click on the first dropdown (Document Type)
2. Select "Meeting"
3. **Expected**: Page reloads with only Meeting documents
4. **Expected**: See "Showing X of Y documents (filtered)"
5. **Expected**: Count should decrease (unless all documents are meetings)

### Test 3: Filter by Category
1. Reset type filter to "All Types"
2. Click on the second dropdown (Category)
3. Select "Financial"
4. **Expected**: Page filters to show only Financial category documents
5. **Expected**: See "(filtered)" indicator

### Test 4: Filter by Status
1. Reset all filters
2. Click on the third dropdown (Status)
3. Select "Active"
4. **Expected**: Only active documents shown
5. **Expected**: See "(filtered)" indicator

### Test 5: Multiple Filters
1. Set Type = "Meeting"
2. Set Category = "Technical"
3. Set Status = "Active"
4. **Expected**: Documents matching ALL three filters
5. **Expected**: Count reflects the combined filtering

### Test 6: Reset Filters
1. After applying filters, reset each to "All Types", "All Categories", "All Statuses"
2. **Expected**: Full list of documents returns
3. **Expected**: "(filtered)" indicator disappears
4. **Expected**: Count returns to original total

## Verification Points

✅ **Before Fix**: Changing filters would not reload data - the same documents would remain visible

✅ **After Fix**: Changing any filter should:
- Immediately trigger a new database query
- Show loading state (if observable)
- Update the displayed documents
- Update the count with "(filtered)" indicator
- Reset pagination to show first page of results

## Technical Details

### Root Cause
The `useInfiniteQuery` hook's `useEffect` wasn't tracking changes to the `trailingQuery` function. Since the function was recreated on every render (without `useCallback`), React couldn't detect when it actually changed due to filter state changes.

### Fix
- Used `useCallback` with proper dependencies (`[typeFilter, categoryFilter, statusFilter]`)
- Hook now uses `props` as a dependency, which includes the memoized `trailingQuery`
- When filters change → `useCallback` returns new function → props changes → store recreates → data refetches

## Files Changed
1. `frontend/src/hooks/use-infinite-query.ts` - Fixed dependency tracking
2. `frontend/src/app/(procore)/documents-infinite/page.tsx` - Added `useCallback` for trailingQuery
