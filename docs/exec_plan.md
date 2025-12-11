# Alleato-Procore Execution Plan

## Type Strategy

### Overview
This document outlines the type strategy for maintaining type safety across the codebase.

### Type Hierarchy

```
Supabase Database (Source of Truth)
        ↓
  npm run db:types
        ↓
frontend/src/types/database.ts (Auto-generated)
        ↓
frontend/src/types/index.ts (Re-exports + Helpers)
        ↓
    Application Code
```

### Key Principles

1. **Single Source of Truth**: Database types are generated from Supabase schema
2. **Never manually edit `database.ts`**: It's auto-generated and will be overwritten
3. **Use type helpers**: Import from `@/types` not directly from `database.ts`
4. **Zod for runtime validation**: Use Zod schemas for form validation, derive types with `z.infer<>`

### Commands

```bash
# Regenerate database types after schema changes
cd frontend && npm run db:types

# Type check the codebase
cd frontend && npm run typecheck
```

### Type Files Structure

```
frontend/src/types/
├── database.ts      # Auto-generated from Supabase (DO NOT EDIT)
├── index.ts         # Main export file - import from here
├── financial.ts     # Financial module types
├── project.ts       # Project types
├── project-home.ts  # Project home page types
├── portfolio.ts     # Portfolio types
├── budget.ts        # Budget types
└── next-auth.d.ts   # NextAuth type extensions
```

### Usage Examples

#### Importing Types
```typescript
// CORRECT: Import from @/types
import { Project, Meeting, getStatusBadgeVariant } from '@/types'

// AVOID: Direct imports from database.ts
import { Database } from '@/types/database' // Only for advanced cases
```

#### Form Validation with Zod
```typescript
import { z } from 'zod'
import type { ProjectInsert } from '@/types'

// Zod schema for form validation
const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['active', 'inactive', 'completed']),
})

// Type derived from Zod schema
type CreateProjectForm = z.infer<typeof createProjectSchema>
```

#### API Response Types
```typescript
import type { Project } from '@/types'

async function getProject(id: string): Promise<Project | null> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  return data
}
```

### Badge Variants
The Badge component supports these variants:
- `default` - Primary color
- `secondary` - Muted color
- `destructive` - Red/error
- `outline` - Border only
- `success` - Green
- `warning` - Yellow

Use helper functions for consistent styling:
```typescript
import { getStatusBadgeVariant, getPriorityBadgeVariant } from '@/types'

<Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
<Badge variant={getPriorityBadgeVariant(priority)}>{priority}</Badge>
```

---

## Authentication Strategy

### NextAuth.js v4
- Uses credentials provider with `app_users` table
- Passwords hashed with bcrypt
- JWT-based sessions (30-day expiry)
- Middleware protects routes

### Environment Variables
```env
AUTH_SECRET=<your-secret>
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000
```

### Test User
- Email: test@example.com
- Password: password123

---

## Testing Strategy

### Playwright E2E Tests
- Auth setup runs first, saves state
- Subsequent tests use authenticated state
- Run with `npm run test` from frontend directory

### Commands
```bash
cd frontend
npm run test              # Run all tests
npm run test:headed       # Run with browser visible
npm run test:auth         # Run auth tests only
npm run test:report       # View test report
```

---

## Development Workflow

### When Making Database Changes
1. Update schema in Supabase
2. Run `npm run db:types` to regenerate types
3. Update `@/types/index.ts` if adding new tables
4. Run `npm run typecheck` to verify

### When Adding New Features
1. Create Zod schema in `lib/schemas/`
2. Use generated types from `@/types`
3. Write Playwright tests
4. Run `npm run typecheck` before committing

### Code Quality Checks
```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Playwright tests
```
