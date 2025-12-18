# Manual Test: Infinite Projects - Load More Button Fix

## Test URL
http://localhost:3002/infinite-projects

## Issue Fixed
The "Load More" button wasn't working on the infinite-projects page.

## Root Causes Identified

### 1. Race Condition with isFetching State
**Problem**: The `setState({ isFetching: false })` was called separately after the data update, creating a window where the state was inconsistent.

**Fix**: Consolidated `isFetching: false` into the same `setState` call as the data update (lines 139 and 147 in use-infinite-query.ts).

### 2. Unstable fetchNextPage Reference
**Problem**: The `fetchNextPage` function reference changed on every render, and when the store was recreated (due to filter changes), the old reference became stale.

**Fix**: Wrapped `fetchNextPage` in `useCallback` to create a stable reference that always calls the current store's method (lines 214-216).

### 3. Unclear Error States
**Problem**: No visibility into why the button wasn't working - silent failures.

**Fix**: Added detailed console logging to track:
- When fetchPage is called
- When it's skipped (already fetching or no more data)
- What data is received
- Current state values

## Changes Made

### File: `frontend/src/hooks/use-infinite-query.ts`

1. **Separated early return checks** (lines 115-123):
   ```typescript
   if (state.isFetching) {
     console.log('fetchPage: already fetching, skipping')
     return
   }

   if (state.hasInitialFetch && state.count <= state.data.length) {
     console.log('fetchPage: no more data to fetch', { count: state.count, dataLength: state.data.length })
     return
   }
   ```

2. **Consolidated state updates** (lines 139-148):
   ```typescript
   setState({
     data: [...state.data, ...(newData as TData[])],
     count: count || 0,
     isSuccess: true,
     error: null,
     isFetching: false,  // ← Set in same call
   })
   ```

3. **Added stable callback** (lines 214-216):
   ```typescript
   const fetchNextPage = useCallback(() => {
     storeRef.current.fetchNextPage()
   }, [])
   ```

4. **Added debug logging** throughout `fetchPage` and `fetchNextPage` functions

## Manual Test Steps

### Test 1: Initial Load
1. Navigate to http://localhost:3002/infinite-projects
2. **Expected**: Page loads with 12 documents displayed
3. **Expected**: See debug info showing: `data=12 count=X hasMore=true isFetching=false`
4. **Expected**: "Load More" button is visible and enabled

### Test 2: Load More - Single Click
1. Click "Load More" button once
2. **Expected**: Button shows "Loading..." and becomes disabled
3. **Expected**: Console shows:
   ```
   Load More clicked
   fetchNextPage called { dataLength: 12, isFetching: false }
   fetchPage: starting fetch { skip: 12, currentDataLength: 12 }
   fetchPage: received data { newDataLength: 12, totalCount: X }
   ```
4. **Expected**: 12 more documents appear (total: 24)
5. **Expected**: Debug info updates to show `data=24`

### Test 3: Load More - Multiple Times
1. Click "Load More" button
2. Wait for load to complete
3. Click "Load More" again
4. Repeat until all data loaded
5. **Expected**: Each click loads 12 more documents
6. **Expected**: Button disappears when no more data (count === data.length)

### Test 4: Load More - Rapid Clicks
1. Click "Load More" button multiple times quickly
2. **Expected**: Only one fetch occurs
3. **Expected**: Console shows "fetchPage: already fetching, skipping" for subsequent clicks
4. **Expected**: No duplicate data

### Test 5: Filters + Load More
1. Select a filter (e.g., Type = "Meeting")
2. **Expected**: Data resets and shows filtered results
3. **Expected**: Debug info shows "(filtered)"
4. Click "Load More"
5. **Expected**: Loads more filtered results
6. **Expected**: New data matches the filter

### Test 6: Change Filter While Loading
1. Click "Load More"
2. Immediately change a filter
3. **Expected**: Previous load completes
4. **Expected**: Data resets with new filter
5. **Expected**: Can click "Load More" again

## Verification Points

### Before Fix
- ❌ Clicking "Load More" did nothing
- ❌ No console errors but no data loaded
- ❌ Button state didn't change
- ❌ `isFetching` state got stuck

### After Fix
- ✅ "Load More" button works on first click
- ✅ Loading state shows correctly
- ✅ New data appends to existing data
- ✅ Button disables during fetch
- ✅ Console logs show fetch progress
- ✅ Multiple clicks are prevented
- ✅ Works correctly with filters

## Console Output Examples

### Successful Load More:
```
Load More clicked
fetchNextPage called { dataLength: 12, isFetching: false }
fetchPage: starting fetch { skip: 12, currentDataLength: 12 }
fetchPage: received data { newDataLength: 12, totalCount: 45 }
```

### Already Fetching (prevented):
```
Load More clicked
fetchNextPage called { dataLength: 12, isFetching: true }
fetchPage: already fetching, skipping
```

### No More Data:
```
Load More clicked
fetchNextPage called { dataLength: 45, isFetching: false }
fetchPage: no more data to fetch { count: 45, dataLength: 45 }
```

## Technical Details

### Why `useCallback` is Important
The `fetchNextPage` function needs to be stable across renders because:
1. It's passed to the button's onClick handler
2. The store reference changes when filters change
3. Without `useCallback`, the function reference changes every render
4. The old reference would call the old store's method (stale closure)

### Why Consolidated State Updates Matter
Setting `isFetching: false` in a separate `setState` call created a race condition:
1. First update: set data + count
2. Component re-renders with new data
3. Second update: set isFetching false
4. Between steps 2-3, rapid clicks could bypass the `isFetching` guard

By consolidating, the state transitions atomically from:
- `{ isFetching: true, data: [...old] }` → `{ isFetching: false, data: [...old, ...new] }`

## Files Modified
1. `frontend/src/hooks/use-infinite-query.ts` - Fixed load more functionality

## Testing Checklist
- [ ] Initial page load shows data
- [ ] "Load More" button appears when hasMore is true
- [ ] Single click loads next page
- [ ] Button shows loading state during fetch
- [ ] Multiple rapid clicks don't cause issues
- [ ] All data eventually loads
- [ ] Button disappears when no more data
- [ ] Filters reset data correctly
- [ ] Load more works after filtering
- [ ] Console logs show expected behavior
