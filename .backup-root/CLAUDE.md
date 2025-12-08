# CLAUDE.md

## Rules

### Always test with playwright in the broswer before stating a task is completge

## Project Overview

Alleato-Procore is a modern alternative to Procore (construction project management software) being built with:
- **Frontend**: Next.js 15 with App Router, Supabase, ShadCN UI, and Tailwind CSS
- **Backend**: Supabase (PostgreSQL with RLS, Auth, Storage)
- **AI System**: Multi-agent workflow using OpenAI Agents SDK and Codex MCP
- **Analysis Tools**: Playwright-based screenshot capture and AI analysis

## Key Commands

### Frontend Development (from `/frontend` directory)
```bash
npm run dev        # Start development server on localhost:3000
npm run build      # Build production bundle
npm run start      # Start production server
npm run lint       # Run ESLint with Next.js rules
```

### Screenshot Capture Tools (from `/procore-screenshot-capture` directory)
```bash
npm run setup              # Install dependencies and Playwright
npm run auth               # Create auth.json for Procore login
npm run capture:supabase   # Capture screenshots with Supabase storage
npm run ai:analyze         # Run AI analysis on captured screenshots
npm run db:modules         # Query module data from Supabase
npm run organize           # Organize screenshots for Figma
```

### Multi-Agent Workflow (from root directory)
```bash
python3 -m venv .venv && source .venv/bin/activate  # Create/activate virtual env
pip install --upgrade openai openai-agents python-dotenv
python codex_mcp.py                                  # Test MCP server
python multi_agent_workflow.py                       # Run full agent workflow
```

## Architecture

### Database Schema
The project uses Supabase with comprehensive PostgreSQL schema for construction management:
- **Core**: companies, users, projects with multi-tenant RLS policies
- **Financial**: commitments, change_orders, invoices, budget_items with full audit trails
- **Roles**: admin, project_manager, accountant, viewer with row-level security

### Frontend Structure
```
frontend/app/
├── api/            # API routes for commitments, companies
├── auth/           # Login, signup, password reset
├── financial/      # Budget, commitments, invoicing modules
└── protected/      # Routes requiring authentication

frontend/components/
├── financial/      # Module-specific components (CommitmentsTable, etc.)
└── ui/            # ShadCN UI components library

frontend/lib/
├── schemas/        # Zod validation schemas for forms
├── stores/         # Zustand state management
└── supabase/       # Client configuration and types
```

### Multi-Agent System
The workflow orchestrates five specialized agents:
1. **Project Manager**: Creates requirements from task_list
2. **Designer**: Generates design specifications
3. **Frontend Developer**: Builds UI components
4. **Backend Developer**: Creates server code
5. **Tester**: Develops test plans

Each agent uses Codex MCP for file operations and maintains full audit trails.

## Current Status

- **Phase 1 (Analysis)**: 70% complete - Screenshot tools built, sitemap created
- **Phase 2 (MVP)**: In progress - Financial modules being implemented
- **Infrastructure**: Supabase integration complete, UI library configured

## Important Patterns

### Supabase Client Usage
Always use the server-side client in server components and API routes:
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Form Validation
Use Zod schemas with React Hook Form:
```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { commitmentsSchema } from '@/lib/schemas/commitments'
```

### Component Structure
Financial modules follow this pattern:
```typescript
// Page component (app/financial/[module]/page.tsx)
// Table component (components/financial/[Module]Table.tsx)
// Form schemas (lib/schemas/[module].ts)
// API routes (app/api/[module]/route.ts)
```

### Authentication Pattern
Protected routes check authentication:
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/auth/login')
```

## Environment Variables

Required in `.env.local` for frontend:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required in `.env` for screenshot tools:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`