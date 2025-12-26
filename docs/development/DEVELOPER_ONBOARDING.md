# Developer Onboarding Guide

## Alleato-Procore

**Production-Grade Construction Project Management System**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Quick Start](#2-quick-start)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database & Supabase](#7-database--supabase)
8. [API Routes](#8-api-routes)
9. [Testing Strategy](#9-testing-strategy)
10. [Build & Deployment](#10-build--deployment)
11. [Environment Variables](#11-environment-variables)
12. [Code Quality & Conventions](#12-code-quality--conventions)
13. [Common Workflows](#13-common-workflows)
14. [Troubleshooting](#14-troubleshooting)
15. [Task Splitting Recommendations](#15-task-splitting-recommendations)

---

## 1. Project Overview

Alleato-Procore is a production-grade construction project management system that combines AI-powered insights with comprehensive financial and project tracking. It integrates with Procore's APIs and provides custom tooling for:

- **Budget Management** - Line items, cost codes, change tracking
- **Financial Tracking** - Contracts, commitments, invoices
- **AI Assistant** - RAG-powered chat with project knowledge
- **Document Management** - Specs, drawings, and document storage
- **Meeting Intelligence** - Transcript processing with decision extraction
- **Portfolio Views** - Multi-project dashboards and analytics

### Key Integrations

- **Procore** - Construction management data sync
- **OpenAI** - LLM for chat and agents
- **Supabase** - Database, auth, storage, and real-time subscriptions

---

## 2. Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- Python 3.11+
- Git
- Supabase account with project access

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd alleato-procore

# Install frontend dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# Start development server
npm run dev
```

### Backend Setup (Optional - for AI features)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set up environment
cp .env.production.template .env
# Edit .env with your OpenAI and Supabase keys

# Start backend
./start.sh
```

### Verify Setup

1. Navigate to `http://localhost:3000`
2. Create an account or log in
3. Run tests: `npm run test` (from frontend directory)

---

## 3. Technology Stack

### Frontend

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI Library | React | 19.x |
| Components | ShadCN UI (Radix) | Latest |
| Styling | Tailwind CSS | 3.4.x |
| State | Zustand | 5.x |
| Data Fetching | TanStack Query | 5.x |
| Tables | TanStack Table | 8.x |
| Forms | React Hook Form + Zod | Latest |
| AI/Chat | OpenAI ChatKit | Latest |
| Language | TypeScript | 5.x |

### Backend

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Python | 3.11 |
| Framework | FastAPI | 0.104+ |
| AI Agents | OpenAI Agents SDK | Latest |
| LLM | OpenAI (GPT-4) | Latest |
| RAG | LangChain + pgvector | Latest |
| Data | Pandas, NumPy | Latest |

### Infrastructure

| Category | Technology |
|----------|------------|
| Database | Supabase (Postgres + pgvector) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Frontend Hosting | Vercel |
| Backend Hosting | Render (Docker) |
| CI/CD | GitHub Actions |

---

## 4. Project Structure

```
/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages & API routes
│   │   ├── components/      # React components (85+)
│   │   ├── hooks/           # Custom hooks (34+)
│   │   ├── lib/             # Utilities, stores, schemas
│   │   ├── types/           # TypeScript definitions
│   │   └── contexts/        # React Context providers
│   ├── tests/               # Playwright E2E tests
│   └── public/              # Static assets
│
├── backend/                  # Python FastAPI services
│   ├── src/
│   │   ├── api/             # FastAPI routes
│   │   ├── services/        # Business logic & agents
│   │   └── workers/         # Background jobs
│   └── tests/               # Python tests
│
├── supabase/                # Database configuration
│   └── migrations/          # SQL migration files
│
├── .agents/                 # AI agent configurations
├── docs/                    # Documentation
├── scripts/                 # Automation scripts
│
├── CLAUDE.md               # AI agent operating rules
├── PLANS_DOC.md            # Planning framework
└── package.json            # Root monorepo config
```

### Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `frontend/src/app/` | Next.js App Router - all pages and API routes |
| `frontend/src/components/ui/` | ShadCN base components |
| `frontend/src/components/tables/` | 30+ data table implementations |
| `frontend/src/hooks/` | Data fetching and state hooks |
| `frontend/src/lib/supabase/` | Supabase client configuration |
| `frontend/src/types/` | TypeScript types including generated DB types |
| `backend/src/services/alleato_agent_workflow/` | Main AI agent system |
| `supabase/migrations/` | Database schema changes |

---

## 5. Frontend Architecture

### Authentication Flow

```
User → /auth/login → Supabase Auth → JWT Token → Cookie Session
                                                        ↓
                                                   middleware.ts
                                                        ↓
                                          Protected Routes (RSC)
```

**Key Files:**
- `middleware.ts` - Auth guard for protected routes
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/app/auth/*` - Login, signup, password reset pages

### State Management

**Global State (Zustand):**
```typescript
// src/lib/stores/financial-store.ts
const useFinancialStore = create((set) => ({
  commitments: [],
  invoices: [],
  isLoading: false,
  // ...
}))
```

**Server State (React Query):**
```typescript
// src/hooks/use-projects.ts
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  })
}
```

**Form State (React Hook Form):**
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: '', budget: 0 }
})
```

### Component Organization

| Category | Location | Examples |
|----------|----------|----------|
| Base UI | `components/ui/` | Button, Dialog, Input, Select |
| Layout | `components/layout/` | Header, Sidebar, PageWrapper |
| Tables | `components/tables/` | ProjectsTable, BudgetTable |
| Forms | `components/forms/` | ContractForm, InvoiceForm |
| Feature | `components/[feature]/` | budget/, financial/, chat/ |

### Page Routing

**Dynamic Routes:**
- `/[projectId]/home` - Project dashboard
- `/[projectId]/budget` - Budget management
- `/[projectId]/chat` - AI assistant
- `/[projectId]/documents` - Document viewer

**Route Groups:**
- `/(tables)/` - Directory tables (projects, contacts, etc.)
- `/(forms)/` - Form entry pages
- `/(chat)/` - Chat-related routes

---

## 6. Backend Architecture

### Multi-Agent System

```
                    User Query
                         ↓
                ┌─────────────────┐
                │ Classification  │
                │     Agent       │
                └────────┬────────┘
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │  Project  │   │ Knowledge │   │ Strategist│
  │   Agent   │   │Base Agent │   │   Agent   │
  │ (10 tools)│   │ (3 tools) │   │ (9 tools) │
  └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
        └───────────────┼───────────────┘
                        ↓
              ┌─────────────────┐
              │  Vector Search  │
              │  (5 tools)      │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │   Supabase +    │
              │    pgvector     │
              └─────────────────┘
```

### Agent Types

1. **Classification Agent** - Routes queries to specialists
2. **Project Agent** - Project data, financials, team info
3. **Knowledge Base Agent** - Policy and document retrieval
4. **Strategist Agent** - Strategic analysis and recommendations

### RAG System

**Vector Tables:**
| Table | Content | Use Case |
|-------|---------|----------|
| `meeting_segments` | Meeting transcripts | Semantic Q&A |
| `decisions` | Extracted decisions | Decision history |
| `risks` | Risk assessments | Risk lookup |
| `document_chunks` | Document text | Detailed context |

**Embedding Model:** `text-embedding-3-small` (1536 dimensions)

---

## 7. Database & Supabase

### Type Generation (Critical)

**Always regenerate types after database changes:**

```bash
npx supabase gen types typescript \
  --project-id "lgveqfnpkxvzbnnwuled" \
  --schema public > frontend/src/types/database.types.ts
```

### Key Tables

**Core:**
- `projects` - Project records
- `users` - Application users
- `companies` - Clients and vendors
- `contacts` - People directory

**Financial:**
- `project_budgets` - Budget headers
- `budget_line_items` - Budget lines
- `prime_contracts` - Main contracts
- `commitments` - Subcontractor commitments
- `invoices` - Payment records

**Knowledge/RAG:**
- `documents` - Stored documents
- `document_chunks` - Text chunks with embeddings
- `meeting_segments` - Meeting transcripts
- `decisions`, `risks`, `opportunities` - Extracted insights

### Using Generated Types

```typescript
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type InsertProject = Database['public']['Tables']['projects']['Insert']
type UpdateProject = Database['public']['Tables']['projects']['Update']
```

---

## 8. API Routes

### Frontend API Routes (`/frontend/src/app/api/`)

| Route | Purpose |
|-------|---------|
| `/api/projects` | Project CRUD |
| `/api/contracts` | Contract management |
| `/api/commitments` | Commitment tracking |
| `/api/invoices` | Invoice data |
| `/api/rag-chatkit/*` | RAG ChatKit integration |
| `/api/auth/signup` | User registration |

### Backend API Routes (`/backend/src/api/`)

| Route | Purpose |
|-------|---------|
| `GET /health` | Health check |
| `POST /chat` | Chat with agents |
| `POST /query` | Direct query execution |

---

## 9. Testing Strategy

### E2E Tests (Playwright)

**Location:** `frontend/tests/e2e/`

**Running Tests:**
```bash
cd frontend

# Run all tests
npm run test

# Interactive UI mode
npm run test:ui

# With visible browser
npm run test:headed

# Visual regression
npm run test:visual
```

**Auth Setup:**
Tests use stored auth state from `playwright/.auth/user.json`

### Unit Tests (Jest)

**Running Tests:**
```bash
npm run test:unit
npm run test:unit:watch
npm run test:unit:coverage
```

### Writing Tests

**E2E Test Example:**
```typescript
import { test, expect } from '@playwright/test'

test('should create budget line item', async ({ page }) => {
  await page.goto('/123/budget')
  await page.click('[data-testid="add-line-item"]')
  await page.fill('[name="description"]', 'Test item')
  await page.click('[type="submit"]')
  await expect(page.locator('text=Test item')).toBeVisible()
})
```

---

## 10. Build & Deployment

### Development

```bash
# Frontend only
cd frontend && npm run dev

# Full stack (both frontend and backend)
npm run dev  # from root
```

### Code Quality Checks

```bash
cd frontend

# Type checking
npm run typecheck

# Linting
npm run lint

# Both
npm run quality

# Auto-fix lint issues
npm run quality:fix
```

### Production Build

```bash
cd frontend
npm run build
npm start
```

### Deployment

**Frontend (Vercel):**
- Automatic deploys from Git
- Configure env vars in Vercel dashboard

**Backend (Render):**
- Docker-based deployment
- Uses `backend/Dockerfile`
- Health check: `/health`

---

## 11. Environment Variables

### Frontend (.env.local)

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Optional
NEXT_PUBLIC_ENV=development
```

### Backend (.env)

```env
# Required
OPENAI_API_KEY=xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
SUPABASE_ANON_KEY=xxx

# Server
PORT=8000
HOST=0.0.0.0

# Optional
CORS_ORIGINS=https://yourdomain.com
LOG_LEVEL=INFO
```

---

## 12. Code Quality & Conventions

### Mandatory Rules

1. **No `any` type** - Use `unknown` with proper type narrowing
2. **No `@ts-ignore`** - Fix type errors properly
3. **No `console.log`** - Use `console.warn` or `console.error`
4. **Run `npm run quality`** after every change

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectHeader.tsx` |
| Hooks | camelCase, use- prefix | `useProjects.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types | PascalCase | `Project`, `BudgetItem` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE` |

### Import Aliases

```typescript
import { Component } from '@/components/...'
import { useHook } from '@/hooks/...'
import { utility } from '@/lib/...'
import { Type } from '@/types/...'
```

### Pre-commit Hooks

All commits are checked for:
- TypeScript errors
- ESLint errors
- Auto-formatting

**If checks fail, the commit is blocked.**

---

## 13. Common Workflows

### Adding a New Page

1. Create route in `src/app/[path]/page.tsx`
2. Add any needed API routes in `src/app/api/`
3. Create components in `src/components/`
4. Add data hook in `src/hooks/`
5. Write E2E tests in `tests/e2e/`
6. Run `npm run quality`

### Adding a Database Table

1. Create migration in `supabase/migrations/`
2. Apply migration via Supabase dashboard
3. Regenerate types: `npm run db:types`
4. Create TypeScript interfaces
5. Add RLS policies
6. Create API route and hook

### Creating a New Component

```typescript
// src/components/feature/MyComponent.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### Adding a Data Hook

```typescript
// src/hooks/use-my-data.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useMyData(projectId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['my-data', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('my_table')
        .select('*')
        .eq('project_id', projectId)

      if (error) throw error
      return data
    }
  })
}
```

---

## 14. Troubleshooting

| Problem | Solution |
|---------|----------|
| Type errors after DB changes | Run `npm run db:types` |
| Auth failures in tests | Delete `playwright/.auth/` and re-run |
| Supabase connection issues | Check `.env.local` variables |
| Build fails with lint errors | Run `npm run quality:fix` |
| Next.js cache issues | Delete `.next/` directory |
| Port 3000 in use | Kill process or set `PORT` env var |
| Pre-commit hook fails | Run `npm run quality:fix` then retry |

### Getting Help

1. Check existing documentation in `/docs/`
2. Review `CLAUDE.md` for AI agent rules
3. Search codebase for similar implementations
4. Check GitHub issues

---

## 15. Task Splitting Recommendations

### Team Structure Recommendations

Based on the codebase architecture, here's how to optimally split work:

#### Option A: Feature-Based Teams (Recommended for 3-5 developers)

```
┌─────────────────────────────────────────────────────────┐
│                    FEATURE TEAMS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Team 1: Financial Module                               │
│  ├── Budget management                                  │
│  ├── Contracts & commitments                            │
│  ├── Invoicing                                          │
│  └── Financial dashboards                               │
│                                                         │
│  Team 2: Project & Portfolio                            │
│  ├── Project setup wizard                               │
│  ├── Project home/dashboard                             │
│  ├── Portfolio views                                    │
│  └── Directory management (contacts, companies)         │
│                                                         │
│  Team 3: AI & Knowledge                                 │
│  ├── Chat interface                                     │
│  ├── RAG system                                         │
│  ├── Meeting transcripts                                │
│  └── Document processing                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Option B: Layer-Based Teams (Recommended for 2-3 developers)

```
┌─────────────────────────────────────────────────────────┐
│                    LAYER TEAMS                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend Team:                                         │
│  ├── UI components                                      │
│  ├── Page implementations                               │
│  ├── State management                                   │
│  └── E2E testing                                        │
│                                                         │
│  Backend Team:                                          │
│  ├── API routes                                         │
│  ├── Agent system                                       │
│  ├── RAG pipeline                                       │
│  └── Database & migrations                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Task Categories

#### 1. UI/Component Tasks
**Ownership:** Frontend developer
**Skills:** React, TypeScript, Tailwind, ShadCN

Examples:
- Create new table component
- Add form validation
- Implement responsive layout
- Build dashboard widget

**Files touched:**
- `src/components/`
- `src/app/*/page.tsx`
- Tests in `tests/e2e/`

---

#### 2. Data/Hook Tasks
**Ownership:** Frontend developer with backend knowledge
**Skills:** React Query, Supabase, TypeScript

Examples:
- Create data fetching hook
- Implement optimistic updates
- Add pagination/infinite scroll
- Cache management

**Files touched:**
- `src/hooks/`
- `src/lib/supabase/`
- `src/app/api/`

---

#### 3. Database Tasks
**Ownership:** Backend developer or full-stack
**Skills:** SQL, Postgres, Supabase, RLS

Examples:
- Create new table
- Add migration
- Configure RLS policies
- Optimize queries

**Files touched:**
- `supabase/migrations/`
- `src/types/database.types.ts` (regenerated)
- RLS policies in Supabase dashboard

---

#### 4. AI/Agent Tasks
**Ownership:** Backend developer with ML knowledge
**Skills:** Python, OpenAI, LangChain, RAG

Examples:
- Add new agent tool
- Improve retrieval quality
- Implement new agent type
- Optimize embeddings

**Files touched:**
- `backend/src/services/`
- `backend/src/workers/`

---

#### 5. Integration Tasks
**Ownership:** Full-stack developer
**Skills:** APIs, Auth, TypeScript, Python

Examples:
- Procore sync
- Third-party API integration
- Webhook handlers
- Auth flow changes

**Files touched:**
- `src/app/api/`
- `backend/src/api/`
- Environment configuration

---

### Task Sizing Guide

| Size | Description | Time Estimate | Example |
|------|-------------|---------------|---------|
| XS | Single file change | < 2 hours | Fix typo, update copy |
| S | Single component/feature | 2-4 hours | Add button, simple form |
| M | Multiple related files | 1-2 days | New table page with API |
| L | Cross-cutting feature | 3-5 days | New module with DB changes |
| XL | Major feature | 1-2 weeks | AI agent, integration |

### Parallel Work Guidelines

**Can Work in Parallel:**
- Different feature modules (budget vs documents)
- Frontend UI vs Backend API (for same feature)
- Different table implementations
- Test writing vs feature development

**Requires Coordination:**
- Database schema changes
- Shared component modifications
- Auth/middleware changes
- Type definition updates

### Code Review Checklist

Before merging any PR:

- [ ] `npm run quality` passes
- [ ] E2E tests pass for affected features
- [ ] Types are properly defined (no `any`)
- [ ] No `console.log` statements
- [ ] Documentation updated if needed
- [ ] Migration files reviewed for correctness
- [ ] RLS policies considered for new tables

---

## Onboarding Checklist

### Day 1
- [ ] Clone repository and run `npm install`
- [ ] Set up `.env.local` with Supabase credentials
- [ ] Run `npm run dev` and verify app loads
- [ ] Read this document completely
- [ ] Read `CLAUDE.md` for AI agent rules

### Day 2
- [ ] Run test suite: `npm run test`
- [ ] Explore the codebase structure
- [ ] Review `/backend/README.md` for agent system
- [ ] Set up backend locally (if working on AI features)

### Day 3
- [ ] Create a feature branch
- [ ] Make a small change (fix typo, update copy)
- [ ] Run `npm run quality` and commit
- [ ] Create a PR and go through review

### First Week
- [ ] Complete one small task end-to-end
- [ ] Write E2E test for your change
- [ ] Understand the Supabase type generation flow
- [ ] Review existing components for patterns

---

## Resources

| Resource | Location |
|----------|----------|
| Global Rules | `/CLAUDE.md` |
| Planning Framework | `/PLANS_DOC.md` |
| Agent Guidelines | `/AGENTS.md` |
| Backend Docs | `/backend/README.md` |
| This Guide | `/docs/DEVELOPER_ONBOARDING.md` |
| Supabase Dashboard | [Supabase Studio](https://supabase.com/dashboard) |
| Vercel Dashboard | [Vercel](https://vercel.com) |

---

*Last Updated: December 2024*
