# Budget Module Implementation Plan

**Created:** 2025-12-27
**Strategy:** Quick wins first, then foundational features, then advanced features
**Current Progress:** 61% complete

---

## Implementation Strategy

Instead of implementing tasks in order, I'll use this optimized approach:

### Phase 1: Quick Wins (Days 1-2) - Immediate Value ⚡
**Goal:** Deliver visible improvements fast
**Effort:** ~1-2 days
**Impact:** High user satisfaction, low effort

1. **Delete Confirmation Dialog** (~2 hours)
   - Add confirmation modal before deletion
   - Prevents accidental data loss
   - Improves user trust

2. **Filter Presets** (~3 hours)
   - "Over Budget" quick filter
   - "Under Budget" quick filter
   - "No Activity" quick filter
   - Save to user preferences

3. **Keyboard Shortcuts** (~2 hours)
   - Ctrl+S to save
   - Ctrl+E to edit selected row
   - Esc to cancel/close modals
   - Add tooltip showing shortcuts

4. **Column Visibility Toggle** (~3 hours)
   - Dropdown to hide/show columns
   - Save preferences per user
   - Reduce visual clutter

**Deliverable:** Improved UX with minimal effort

### Phase 2: Budget Views Foundation (Days 3-4) - Critical Infrastructure 🏗️
**Goal:** Enable customizable budget views
**Effort:** ~2 days
**Impact:** Unlocks view customization

5. **Database Schema for Views**
   - Create `budget_views` table
   - Create `budget_view_columns` table
   - Add migration with sample data
   - Add RLS policies

6. **Budget View Selector Enhancement**
   - Load views from database
   - Apply view configuration to table
   - Show column visibility per view
   - Cache view data

**Deliverable:** Database-driven budget views

### Phase 3: Views Configuration UI (Days 5-7) - User Control 🎨
**Goal:** Complete views management interface
**Effort:** ~3 days
**Impact:** Full feature parity with Procore

7. **View Management Page**
   - Create `/companies/[companyId]/budget-views` route
   - List all views with stats
   - Create/Edit/Delete view modals
   - Set default view per project

8. **Column Configuration Interface**
   - Drag-drop column ordering
   - Enable/disable columns
   - Set column widths
   - Configure descriptions

**Deliverable:** Fully functional view configuration

### Phase 4: Import/Export (Days 8-12) - Data Migration 📊
**Goal:** Enable users to import existing budgets
**Effort:** ~5 days
**Impact:** Critical for adoption

9. **Excel Import**
   - File upload component
   - Excel parser (xlsx library)
   - Column mapping interface
   - Data validation and preview
   - Cost code matching/creation
   - Bulk insert with progress

10. **CSV Import**
    - CSV parser
    - Reuse column mapping UI
    - Simpler validation

11. **Excel/CSV Export**
    - Export current view with filters
    - Generate formatted Excel
    - Generate CSV
    - Include metadata

**Deliverable:** Complete import/export system

### Phase 5: Testing & Quality (Days 13-15) - Production Ready ✅
**Goal:** Ensure reliability
**Effort:** ~3 days
**Impact:** Confidence in deployment

12. **Unit Tests**
    - Test calculation functions
    - Test validation logic
    - Test utilities
    - Target: 80% coverage

13. **Integration Tests**
    - Test CRUD workflows
    - Test view switching
    - Test import/export

14. **E2E Tests**
    - Budget creation flow
    - Budget editing flow
    - Import flow
    - Export flow
    - Visual regression

**Deliverable:** Production-ready budget module

---

## Implementation Order with Rationale

### Why This Order?

1. **Quick Wins First (Days 1-2)**
   - Immediate user satisfaction
   - Low risk, high confidence
   - Momentum builder

2. **Views Foundation (Days 3-4)**
   - Enables views UI work
   - Database work is straightforward
   - No UI complexity yet

3. **Views UI (Days 5-7)**
   - Now that DB is ready, build interface
   - High user visibility
   - Enables customization

4. **Import/Export (Days 8-12)**
   - Most complex feature
   - Critical for user migration
   - Requires views to be working
   - Can test thoroughly after views are done

5. **Testing (Days 13-15)**
   - After all features are complete
   - Comprehensive coverage
   - Catch integration issues

---

## Today's Plan (Day 1)

### Morning: Quick Wins Part 1 (4 hours)

**Task 1: Delete Confirmation Dialog** (2 hours)
```typescript
// Files to modify:
- frontend/src/components/budget/budget-table.tsx
- frontend/src/components/ui/alert-dialog.tsx (if needed)

// Implementation:
1. Add delete button to row actions menu
2. Create confirmation dialog component
3. Call server action on confirm
4. Show success/error toast
5. Test deletion workflow
```

**Task 2: Filter Presets** (2 hours)
```typescript
// Files to modify:
- frontend/src/components/budget/budget-filters.tsx
- frontend/src/lib/budget-filters.ts (new)

// Implementation:
1. Add quick filter buttons
2. Define filter logic for each preset
3. Apply to table data
4. Save active preset to localStorage
```

### Afternoon: Quick Wins Part 2 (4 hours)

**Task 3: Keyboard Shortcuts** (2 hours)
```typescript
// Files to modify:
- frontend/src/app/[projectId]/budget/page.tsx
- frontend/src/hooks/use-keyboard-shortcuts.ts (new)

// Implementation:
1. Create keyboard shortcut hook
2. Add event listeners
3. Trigger appropriate actions
4. Add tooltip showing shortcuts
```

**Task 4: Column Visibility Toggle** (2 hours)
```typescript
// Files to modify:
- frontend/src/components/budget/budget-page-header.tsx
- frontend/src/components/budget/column-visibility-dropdown.tsx (new)

// Implementation:
1. Add column visibility dropdown
2. Get column list from table
3. Toggle visibility
4. Save preferences to localStorage
```

---

## Progress Tracking

I'll update the todo list after completing each task and mark items in IMPLEMENTATION-TASKS.md as [x].

After each phase, I'll:
1. Mark completed tasks with [x]
2. Run tests
3. Update REMAINING-WORK.md
4. Show progress percentage

---

## Starting Now

I'm beginning with **Task 1: Delete Confirmation Dialog** because:
- Prevents data loss (safety critical)
- Easy to implement (~2 hours)
- Immediate user value
- Builds confidence

Let me start implementing!
