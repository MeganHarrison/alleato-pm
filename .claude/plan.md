# Implementation Plan: Budget Line Item Editing & Change History

## Overview
Add inline editing capability for budget line items on the main budget page (`/[projectId]/budget`) and implement a comprehensive change history/audit trail system.

## Requirements Analysis

### 1. Inline Editing Features
- **Edit button/icon** on each budget line item row
- **Inline form** for editing qty, unit cost, description
- **Save/Cancel** actions
- **Validation** before saving
- **Optimistic UI** updates
- **Lock check** before allowing edits

### 2. Change History Features
- **History button/icon** on each row to view changes
- **Modal/drawer** showing chronological change log
- **Display**: Who changed what, when, old value → new value
- **Filter/search** capabilities (optional)

## Database Schema Design

### New Table: `budget_line_history`
```sql
CREATE TABLE budget_line_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_line_id UUID NOT NULL REFERENCES budget_lines(id) ON DELETE CASCADE,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- What changed
  field_name TEXT NOT NULL,  -- 'quantity', 'unit_cost', 'description', 'project_budget_code_id'
  old_value TEXT,
  new_value TEXT,

  -- Who and when
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Change context
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
  notes TEXT,

  -- Indexes
  CONSTRAINT idx_budget_line_history_budget_line ON budget_line_history(budget_line_id),
  CONSTRAINT idx_budget_line_history_changed_at ON budget_line_history(changed_at DESC)
);
```

### Database Trigger for Auto-Tracking
```sql
CREATE OR REPLACE FUNCTION track_budget_line_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO budget_line_history (
      budget_line_id, project_id, field_name, old_value, new_value,
      changed_by, change_type
    ) VALUES
      (NEW.id, NEW.project_id, 'quantity', NULL, NEW.quantity::TEXT, NEW.created_by, 'create'),
      (NEW.id, NEW.project_id, 'unit_cost', NULL, NEW.unit_cost::TEXT, NEW.created_by, 'create'),
      (NEW.id, NEW.project_id, 'description', NULL, NEW.description, NEW.created_by, 'create');
    RETURN NEW;
  END IF;

  -- On UPDATE
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.quantity != NEW.quantity) THEN
      INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
      VALUES (NEW.id, NEW.project_id, 'quantity', OLD.quantity::TEXT, NEW.quantity::TEXT, NEW.updated_by, 'update');
    END IF;

    IF (OLD.unit_cost != NEW.unit_cost) THEN
      INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
      VALUES (NEW.id, NEW.project_id, 'unit_cost', OLD.unit_cost::TEXT, NEW.unit_cost::TEXT, NEW.updated_by, 'update');
    END IF;

    IF (OLD.description != NEW.description) THEN
      INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
      VALUES (NEW.id, NEW.project_id, 'description', OLD.description, NEW.description, NEW.updated_by, 'update');
    END IF;

    RETURN NEW;
  END IF;

  -- On DELETE
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO budget_line_history (budget_line_id, project_id, field_name, old_value, new_value, changed_by, change_type)
    VALUES (OLD.id, OLD.project_id, 'deleted', 'active', 'deleted', auth.uid(), 'delete');
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER budget_line_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON budget_lines
FOR EACH ROW
EXECUTE FUNCTION track_budget_line_changes();
```

### Schema Updates Required
Add `updated_by` column to `budget_lines` table:
```sql
ALTER TABLE budget_lines
ADD COLUMN updated_by UUID REFERENCES auth.users(id),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

## API Endpoints Design

### 1. Update Budget Line Item
**Endpoint**: `PATCH /api/projects/[id]/budget/lines/[lineId]`

**Request Body**:
```typescript
{
  quantity?: number;
  unit_cost?: number;
  description?: string;
  notes?: string;  // Optional change notes
}
```

**Response**:
```typescript
{
  success: true;
  lineItem: {
    id: string;
    quantity: number;
    unit_cost: number;
    description: string;
    amount: number;  // calculated
    updated_at: string;
    updated_by: string;
  }
}
```

**Implementation**:
- Validate budget is not locked
- Validate user has permission (team member)
- Update `budget_lines` table (trigger auto-creates history)
- Recalculate totals if needed
- Return updated line item

### 2. Get Change History
**Endpoint**: `GET /api/projects/[id]/budget/lines/[lineId]/history`

**Response**:
```typescript
{
  history: Array<{
    id: string;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    changed_by: {
      id: string;
      email: string;
      name: string;
    };
    changed_at: string;
    change_type: 'create' | 'update' | 'delete';
    notes: string | null;
  }>;
}
```

**Implementation**:
- Query `budget_line_history` table
- Join with `auth.users` for user details
- Order by `changed_at DESC`
- Return formatted history

## Frontend Components Design

### 1. Enhanced BudgetTable Component
**Location**: `/components/budget/budget-table.tsx`

**Changes**:
- Add "Edit" button/icon to each row (when not locked)
- Add "History" button/icon to each row
- Implement inline editing state per row
- Handle save/cancel actions
- Show loading states during save

**Inline Edit Mode**:
```typescript
// State
const [editingRowId, setEditingRowId] = useState<string | null>(null);
const [editValues, setEditValues] = useState<{
  quantity: number;
  unit_cost: number;
  description: string;
}>({});

// Actions
const handleEdit = (row) => {
  if (isLocked) {
    toast.error('Budget is locked');
    return;
  }
  setEditingRowId(row.id);
  setEditValues({
    quantity: row.quantity,
    unit_cost: row.unit_cost,
    description: row.description,
  });
};

const handleSave = async (rowId) => {
  try {
    const response = await fetch(`/api/projects/${projectId}/budget/lines/${rowId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editValues),
    });

    if (!response.ok) throw new Error('Failed to update');

    const { lineItem } = await response.json();

    // Update local state
    setBudgetData(prev => prev.map(item =>
      item.id === rowId ? { ...item, ...lineItem } : item
    ));

    setEditingRowId(null);
    toast.success('Line item updated');
  } catch (error) {
    toast.error('Failed to update line item');
  }
};

const handleCancel = () => {
  setEditingRowId(null);
  setEditValues({});
};
```

### 2. New Component: BudgetLineHistoryModal
**Location**: `/components/budget/budget-line-history-modal.tsx`

**Props**:
```typescript
interface BudgetLineHistoryModalProps {
  open: boolean;
  onClose: () => void;
  lineItem: {
    id: string;
    description: string;
    budgetCode: string;
  };
  projectId: string;
}
```

**Features**:
- Dialog/Modal with close button
- Header showing line item details
- Timeline of changes
- Each change shows:
  - Date/time
  - User who made the change
  - Field changed
  - Old → New value
  - Change notes (if any)
- Loading state
- Empty state if no history

**Timeline Item Component**:
```typescript
<div className="border-l-2 border-gray-200 pl-4 pb-4">
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
      <UserIcon className="w-4 h-4" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium">{user.name || user.email}</div>
      <div className="text-xs text-gray-500">{formatDate(changed_at)}</div>
      <div className="mt-1 text-sm">
        Changed <span className="font-medium">{field_name}</span>
        {old_value && <> from <span className="line-through">{old_value}</span></>}
        {new_value && <> to <span className="font-medium">{new_value}</span></>}
      </div>
      {notes && <div className="mt-1 text-sm text-gray-600 italic">{notes}</div>}
    </div>
  </div>
</div>
```

## Implementation Steps

### Phase 1: Database & Backend (Migration + API)
1. ✅ Create migration file: `20251223_add_budget_line_history.sql`
2. ✅ Add `budget_line_history` table
3. ✅ Add `updated_by` and `updated_at` to `budget_lines`
4. ✅ Create trigger function for auto-tracking
5. ✅ Apply RLS policies to `budget_line_history`
6. ✅ Create API route: `PATCH /api/projects/[id]/budget/lines/[lineId]`
7. ✅ Create API route: `GET /api/projects/[id]/budget/lines/[lineId]/history`
8. ✅ Run migration to production database

### Phase 2: Frontend Components
1. ✅ Create `BudgetLineHistoryModal` component
2. ✅ Update `BudgetTable` to add Edit/History buttons
3. ✅ Implement inline editing logic in `BudgetTable`
4. ✅ Add state management for editing mode
5. ✅ Wire up API calls for save/update
6. ✅ Add loading/error states
7. ✅ Add validation

### Phase 3: Testing
1. ✅ Create Playwright test for inline editing
2. ✅ Create Playwright test for viewing history
3. ✅ Test with locked budget (should prevent edits)
4. ✅ Test validation (negative numbers, empty fields)
5. ✅ Test history timeline display

### Phase 4: Polish & Edge Cases
1. ✅ Handle concurrent edits (optimistic locking)
2. ✅ Add keyboard shortcuts (Escape to cancel, Enter to save)
3. ✅ Mobile responsive design for modals
4. ✅ Add loading skeletons
5. ✅ Error boundary for history modal

## File Structure
```
/supabase/migrations/
  └── 20251223_add_budget_line_history.sql

/frontend/src/app/api/projects/[id]/budget/lines/
  └── [lineId]/
      ├── route.ts (PATCH endpoint)
      └── history/
          └── route.ts (GET endpoint)

/frontend/src/components/budget/
  ├── budget-table.tsx (updated with inline edit)
  ├── budget-line-history-modal.tsx (new)
  └── index.ts (export new component)

/frontend/tests/e2e/
  ├── budget-line-edit.spec.ts (new)
  └── budget-line-history.spec.ts (new)
```

## Acceptance Criteria
- [ ] User can click Edit icon on any budget line item
- [ ] Inline editing shows input fields for qty, unit cost, description
- [ ] Save button updates the line item via API
- [ ] Cancel button discards changes
- [ ] History icon opens modal showing all changes
- [ ] History modal displays timeline with user, date, old→new values
- [ ] All changes are automatically tracked via database trigger
- [ ] Budget lock prevents editing but allows viewing history
- [ ] Playwright tests verify all functionality
- [ ] Mobile responsive design works correctly

## Risk Assessment & Mitigation

**Risk**: Concurrent edits from multiple users
**Mitigation**: Use optimistic locking with `updated_at` timestamp check

**Risk**: Database trigger performance with large datasets
**Mitigation**: Add indexes on `budget_line_id` and `changed_at`

**Risk**: User confusion with too many history entries
**Mitigation**: Paginate history if > 50 entries, add filters

**Risk**: Accidental edits
**Mitigation**: Add confirmation dialog for significant changes (>20% value change)
