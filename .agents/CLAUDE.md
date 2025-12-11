# CLAUDE.md

## Rules

### NEVER use git worktrees
- Do NOT create git worktrees under any circumstances
- Always work directly in the main repository at `/Users/meganharrison/Documents/github/alleato-procore`
- If asked to work in parallel or isolate changes, use git branches instead
- Worktrees cause confusion and errors - they are strictly forbidden

### Always test with playwright in the browser before stating a task is complete

## Project Overview

Alleato-Procore is a modern alternative to Procore (construction project management software) being built with:
- **Frontend**: Next.js 15 with App Router, Supabase, ShadCN UI, and Tailwind CSS
- **Backend**: Supabase (PostgreSQL with RLS, Auth, Storage)
- **AI System**: Multi-agent workflow using OpenAI Agents SDK and Codex MCP
- **Analysis Tools**: Playwright-based screenshot capture and AI analysis

### Edit in-place, don’t clone files
- When modifying code, you edit the original file.
- You do not create new files with suffixes like _fixed, _backup, _final, _copy, etc.
- If you need safety, you use Git (branches/commits), not duplicate files.

Backup = git commit or git branch
NOT myComponent_final.tsx


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

**IMPORTANT**: This project uses a **single, centralized `.env` file** in the root directory to avoid confusion.

### File Locations
- **Primary**: `/.env` (root directory) - Use this for all environment variables
- **Fallback**: `/.env.local` (root directory) - Legacy, but still supported
- **Python Helper**: `/python-backend/env_loader.py` - Centralized loader for all Python scripts

### Python Usage
All Python scripts use the centralized loader:
```python
from env_loader import load_env
load_env()  # Automatically loads from root .env
```

### Required Variables (in root `.env`)
Frontend (Next.js):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Backend (Python/FastAPI):
- `OPENAI_API_KEY` - Required for AI agents and embeddings
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

See `/python-backend/ENV_SETUP.md` for detailed documentation.