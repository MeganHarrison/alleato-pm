# Quick Reference Card

## Essential Commands

```bash
# Development
npm run dev                  # Start frontend (localhost:3000)
npm run dev:backend          # Start backend (localhost:8000)

# Quality Checks (MANDATORY before commit)
npm run quality              # TypeScript + ESLint check
npm run quality:fix          # Check + auto-fix lint
npm run typecheck            # TypeScript only
npm run lint:fix             # ESLint fix only

# Testing
npm run test                 # All E2E tests
npm run test:ui              # Interactive test UI
npm run test:headed          # Visible browser
npm run test:unit            # Jest unit tests

# Database
npm run db:types             # Regenerate Supabase types
```

## File Locations

| What | Where |
|------|-------|
| Pages | `frontend/src/app/` |
| Components | `frontend/src/components/` |
| Hooks | `frontend/src/hooks/` |
| Types | `frontend/src/types/` |
| Supabase Client | `frontend/src/lib/supabase/` |
| State Stores | `frontend/src/lib/stores/` |
| E2E Tests | `frontend/tests/e2e/` |
| Migrations | `supabase/migrations/` |
| Backend Agents | `backend/src/services/alleato_agent_workflow/` |

## Import Aliases

```typescript
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/use-projects'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
```

## Code Patterns

### Create Supabase Client (Server)
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getData() {
  const supabase = await createClient()
  const { data } = await supabase.from('table').select('*')
  return data
}
```

### Create Supabase Client (Client)
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

### Data Hook Pattern
```typescript
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useData(id: string) {
  return useQuery({
    queryKey: ['data', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('table')
        .select('*')
        .eq('id', id)
      if (error) throw error
      return data
    }
  })
}
```

### Form Pattern
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  amount: z.number().positive()
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', amount: 0 }
  })

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## Mandatory Rules

1. **Run `npm run quality` before every commit**
2. **Never use `any` type** → use `unknown`
3. **Never use `@ts-ignore`** → fix the error
4. **Never use `console.log`** → use `console.warn` or `console.error`
5. **Regenerate types after DB changes** → `npm run db:types`
6. **Write E2E tests for new features**

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Type errors | `npm run db:types` |
| Lint errors | `npm run quality:fix` |
| Auth test failures | Delete `playwright/.auth/` |
| Build fails | `rm -rf .next && npm run build` |
| Port in use | `lsof -ti:3000 | xargs kill` |

## Key Documentation

- `/CLAUDE.md` - AI agent rules (READ FIRST)
- `/PLANS_DOC.md` - Planning framework
- `/docs/DEVELOPER_ONBOARDING.md` - Full onboarding guide
- `/backend/README.md` - Backend/agent docs
