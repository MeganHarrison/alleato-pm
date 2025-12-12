# Database Types File Organization

## Summary
Moved `database.types.ts` to the centralized types folder to follow project conventions.

## Changes Made

### 1. File Movement
- **From**: `frontend/database.types.ts`
- **To**: `frontend/src/types/database.types.ts`

### 2. Import Path Updates
Updated import statements in the following files from `@/app/types/database.types` to `@/types/database.types`:

- `frontend/src/app/(procore)/[projectId]/home/page.tsx`
- `frontend/src/app/(procore)/meetings/[id]/page.tsx`
- `frontend/src/components/tables/meetings-data-table.tsx`
- `frontend/src/components/project-home/document-metadata-modal.tsx`

Files already using the correct import path (`@/types/database.types`):
- `frontend/src/components/tables/companies-data-table.tsx`
- `frontend/src/components/tables/document-details-sheet.tsx`
- `frontend/src/components/tables/contact-details-sheet.tsx`
- `frontend/src/components/tables/company-details-sheet.tsx`
- `frontend/src/components/tables/project-tasks-data-table.tsx`
- `frontend/src/components/tables/contacts-data-table.tsx`

### 3. Documentation Updates
Updated `.agents/rules/supabase/generate-supabase-types.md` to reflect the correct output location:

**Type generation commands now use:**
```bash
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/database.types.ts
npx supabase gen types typescript --local > src/types/database.types.ts
```

**Import examples now use:**
```typescript
import { Database } from '@/types/database.types'
```

## Rationale

Following the project's file conventions from CLAUDE.md:
> **Types are centralized.**
> - Prefer types from the `/types` directory, Supabase typegen, and shared schemas.

Benefits:
1. ✅ Consistent with project structure
2. ✅ Easier to find and maintain
3. ✅ Follows Next.js best practices
4. ✅ Centralized type management

## Verification

- [x] All imports updated and verified
- [x] Dev server running without errors
- [x] Documentation updated
- [x] No broken references

## Future Type Generation

When regenerating Supabase types, use:
```bash
cd frontend
npx supabase gen types typescript --local > src/types/database.types.ts
```

Or for production:
```bash
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/database.types.ts
```
