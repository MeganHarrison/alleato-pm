# Page Title with Project Name

## Overview

Implemented automatic page title updates to show **project names instead of IDs** in browser tabs.

## Problem

When navigating to project-specific pages, the browser tab title would show:
- ❌ "Alleato OS - Procore Alternative" (generic, no context)
- ❌ "76 - Budget - Alleato OS" (shows project ID, not name)

This made it difficult to identify which project you were viewing when multiple tabs were open.

## Solution

Created a custom React hook `useProjectTitle` that automatically:
1. Extracts the current project from context
2. Combines project name with page title
3. Updates the browser document title
4. Falls back gracefully when no project is selected

## Implementation

### 1. Custom Hook ([useProjectTitle.ts](frontend/src/hooks/useProjectTitle.ts))

**Hook Signature:**
```typescript
function useProjectTitle(pageTitle?: string, includeProject = true): void
```

**Parameters:**
- `pageTitle` (optional): The name of the current page (e.g., "Budget", "Commitments")
- `includeProject` (optional): Whether to include project name (default: true)

**How It Works:**
1. Gets selected project from ProjectContext
2. Gets current pathname to infer page title if not provided
3. Builds title in format: `[Project Name] - [Page Title] - Alleato OS`
4. Updates `document.title` via useEffect
5. Cleans up on unmount

**Example Usage:**
```typescript
import { useProjectTitle } from '@/hooks/useProjectTitle';

function MyPage() {
  useProjectTitle('Budget');
  // Title will be: "Project Name - Budget - Alleato OS"

  return <div>...</div>;
}
```

### 2. Budget Page ([budget/page.tsx](frontend/src/app/(financial)/budget/page.tsx))

**Added:**
```typescript
import { useProjectTitle } from '@/hooks/useProjectTitle';

function BudgetPageContent() {
  const { selectedProject } = useProject();
  useProjectTitle('Budget'); // Set page title with project name
  // ...
}
```

**Result:**
- Before: `Alleato OS - Procore Alternative`
- After: `Alleato Finance - Budget - Alleato OS`

### 3. Commitments Page ([commitments/page.tsx](frontend/src/app/(financial)/commitments/page.tsx))

**Added:**
```typescript
import { useProjectTitle } from '@/hooks/useProjectTitle';

export default function CommitmentsPage() {
  const { projectId, selectedProject } = useProject();
  useProjectTitle('Commitments'); // Set page title with project name
  // ...
}
```

**Result:**
- Before: `Alleato OS - Procore Alternative`
- After: `Westside Construction - Commitments - Alleato OS`

## Title Formats

### With Project Selected

**URL Path Style:**
```
URL:   /76/budget
Title: "Alleato Finance - Budget - Alleato OS"
```

**Query Param Style:**
```
URL:   /budget?project=76
Title: "Alleato Finance - Budget - Alleato OS"
```

### Without Project Selected

```
URL:   /budget
Title: "Budget - Alleato OS"
```

### Auto-Inferred Page Title

If no page title is provided, the hook infers it from the URL:
```typescript
useProjectTitle(); // No title provided

// URL: /change-orders
// Title: "Project Name - Change Orders - Alleato OS"
```

## Benefits

1. ✅ **Better Tab Management** - Easy to identify tabs when multiple projects open
2. ✅ **Professional UX** - Enterprise-grade tab titles
3. ✅ **Context Clarity** - Always know which project you're viewing
4. ✅ **Automatic Updates** - Titles update when switching projects
5. ✅ **Graceful Fallback** - Works without project selection too

## Use Cases

### Multiple Tabs Open

With this feature:
```
Tab 1: "Alleato Finance - Budget - Alleato OS"
Tab 2: "Westside Construction - Budget - Alleato OS"
Tab 3: "Downtown Plaza - Commitments - Alleato OS"
```

Easy to identify which tab belongs to which project!

### Browser Bookmarks

Bookmarks now show meaningful names:
```
Bookmark: "Alleato Finance - Budget - Alleato OS"
```

Instead of generic:
```
Bookmark: "Alleato OS - Procore Alternative"
```

### Browser History

History entries are more descriptive:
```
History:
- Alleato Finance - Budget - Alleato OS
- Alleato Finance - Commitments - Alleato OS
- Westside Construction - Tasks - Alleato OS
```

## Technical Details

### React Hook Pattern

The hook uses standard React patterns:
- `useEffect` for side effects (updating document.title)
- `useProject` to access project context
- `usePathname` to get current URL
- Cleanup function to restore default title on unmount

### Title Building Logic

```typescript
const parts: string[] = []

// 1. Add project name (if available)
if (selectedProject?.name) {
  parts.push(selectedProject.name)
}

// 2. Add page title
if (pageTitle) {
  parts.push(pageTitle)
} else {
  // Infer from pathname
  parts.push(inferredTitle)
}

// 3. Add app name
parts.push('Alleato OS')

// Join with " - "
document.title = parts.join(' - ')
```

### Cleanup Behavior

When component unmounts:
```typescript
return () => {
  document.title = 'Alleato OS - Procore Alternative'
}
```

This ensures the title resets to default when navigating away.

## Migration Guide

### Add to Existing Pages

**Step 1:** Import the hook
```typescript
import { useProjectTitle } from '@/hooks/useProjectTitle';
```

**Step 2:** Call it at the top of your component
```typescript
function MyPage() {
  useProjectTitle('My Page Title');
  // ...rest of component
}
```

**Step 3:** That's it! The title will update automatically.

### Advanced Usage

**Without Project Name:**
```typescript
useProjectTitle('Settings', false); // Second param = false
// Title: "Settings - Alleato OS"
```

**Auto-Inferred Title:**
```typescript
useProjectTitle(); // No params
// Infers page title from URL pathname
```

**Dynamic Titles:**
```typescript
const pageTitle = isEditing ? 'Edit Budget' : 'View Budget';
useProjectTitle(pageTitle);
```

## Testing

### Manual Testing

1. **Navigate to a project page:**
   ```
   http://localhost:3001/76/budget
   ```

2. **Check browser tab:**
   ```
   Expected: "[Project Name] - Budget - Alleato OS"
   ```

3. **Switch projects:**
   ```
   Navigate to: /123/budget
   Expected: Title updates to new project name
   ```

4. **Open multiple tabs:**
   ```
   Tab 1: /76/budget
   Tab 2: /76/commitments
   Tab 3: /123/budget

   All tabs should show distinct titles
   ```

### Automated Testing

Add to E2E tests:
```typescript
test('should update page title with project name', async ({ page }) => {
  await page.goto('/76/budget');

  const title = await page.title();
  expect(title).toContain('Budget');
  expect(title).not.toContain('76'); // Should show name, not ID
  expect(title).toContain('Alleato OS');
});
```

## Best Practices

### Do's ✅

1. **Always provide a page title** for clarity
   ```typescript
   useProjectTitle('Budget'); // Good
   ```

2. **Use consistent title casing** (Title Case)
   ```typescript
   useProjectTitle('Change Orders'); // Good
   ```

3. **Keep titles concise** (1-3 words max)
   ```typescript
   useProjectTitle('Tasks'); // Good
   ```

### Don'ts ❌

1. **Don't use generic titles**
   ```typescript
   useProjectTitle('Page'); // Bad - not descriptive
   ```

2. **Don't include project name manually**
   ```typescript
   useProjectTitle(`${project.name} - Budget`); // Bad - duplicates project name
   ```

3. **Don't forget the hook on new pages**
   ```typescript
   // Bad - missing useProjectTitle()
   function NewPage() {
     return <div>...</div>;
   }
   ```

## Files Modified

1. [useProjectTitle.ts](frontend/src/hooks/useProjectTitle.ts) - New custom hook
2. [budget/page.tsx](frontend/src/app/(financial)/budget/page.tsx) - Added hook usage
3. [commitments/page.tsx](frontend/src/app/(financial)/commitments/page.tsx) - Added hook usage

## Next Steps

Apply this hook to all project-scoped pages:
- [ ] Change Orders
- [ ] Invoices
- [ ] Contracts
- [ ] Tasks
- [ ] Meetings
- [ ] RFIs
- [ ] Submittals
- [ ] Documents
- [ ] Schedule
- [ ] Daily Log

## Related Documentation

- [PROJECT_SCOPING_IMPLEMENTATION.md](PROJECT_SCOPING_IMPLEMENTATION.md) - Project context system
- [BREADCRUMB_UPDATE.md](BREADCRUMB_UPDATE.md) - Breadcrumb improvements
- [QUERY_PARAM_PROJECT_SUPPORT.md](QUERY_PARAM_PROJECT_SUPPORT.md) - Query parameter support

---

**Last Updated**: 2025-12-14
**Feature**: Dynamic page titles with project names
