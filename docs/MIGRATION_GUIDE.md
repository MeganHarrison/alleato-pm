# Migration Guide: Restructure to PLANS.md Architecture

**Date:** 2025-12-10
**Purpose:** Migrate from monolithic structure to separate frontend/backend deployable architecture
**Status:** READY FOR REVIEW

---

## Table of Contents

1. [Overview](#overview)
2. [Why This Migration?](#why-this-migration)
3. [Current vs Target Structure](#current-vs-target-structure)
4. [Migration Scripts](#migration-scripts)
5. [Step-by-Step Execution Plan](#step-by-step-execution-plan)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Plan](#rollback-plan)
8. [Post-Migration Tasks](#post-migration-tasks)

---

## Overview

This migration restructures the codebase to comply with **PLANS.md** architecture, enabling:

- ✅ **Independent deployment** of frontend and backend
- ✅ **Clear separation of concerns** between client and server
- ✅ **Scalable architecture** for future growth
- ✅ **Team organization** with isolated workspaces
- ✅ **Efficient CI/CD** with parallel build pipelines

---

## Why This Migration?

### Current Issues:
- Monolithic structure makes independent deployment difficult
- Frontend and backend tightly coupled at root level
- Unclear boundaries for team collaboration
- Cannot scale frontend/backend independently

### Benefits After Migration:
- Deploy Next.js frontend to Vercel separately from Python backend
- Scale services independently based on load
- Frontend and backend teams work in isolated directories
- CI/CD can build/test/deploy each service independently
- Easier to swap technologies in future

---

## Current vs Target Structure

### BEFORE (Current):
```
alleato-procore/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utilities
├── hooks/                  # React hooks
├── types/                  # TypeScript types
├── contexts/               # React contexts
├── public/                 # Static assets
├── tests/                  # Playwright tests
├── test_screenshots/       # Test artifacts
├── python-backend/         # FastAPI backend
│   ├── api.py
│   ├── alleato_agent_workflow/
│   ├── ingestion/
│   ├── scripts/
│   └── tests/
├── scripts/                # Various scripts
└── package.json            # Frontend deps
```

### AFTER (Target):
```
alleato-procore/
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── lib/           # Frontend utilities
│   │   ├── hooks/         # React hooks
│   │   ├── types/         # TypeScript types
│   │   └── contexts/      # React contexts
│   ├── tests/
│   │   ├── e2e/           # E2E tests
│   │   ├── components/    # Component tests
│   │   ├── visual-regression/
│   │   └── screenshots/   # Test screenshots
│   ├── public/            # Static assets
│   └── package.json       # Frontend-specific deps
│
├── backend/
│   ├── src/
│   │   ├── api/           # FastAPI routes
│   │   ├── services/      # Business logic
│   │   ├── workers/       # Background jobs
│   │   └── database/      # DB utilities
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── requirements.txt
│
├── scripts/
│   ├── utilities/
│   ├── ingestion/
│   └── dev-tools/
│
└── Root config files
```

---

## Migration Scripts

Three scripts have been created to automate the migration:

### 1. **migrate-to-plans-structure.sh**
Main migration script that:
- Creates new directory structure
- Moves files using `git mv` (preserves history)
- Deletes obsolete folders
- Runs in dry-run mode by default

**Usage:**
```bash
# Dry-run (safe, shows what would happen)
./scripts/migrate-to-plans-structure.sh

# Execute migration (actually moves files)
DRY_RUN=0 ./scripts/migrate-to-plans-structure.sh
```

### 2. **update-imports.sh**
Updates import statements after migration:
- Verifies frontend `@/*` imports
- Updates Python imports from `python-backend.*` to `backend.src.*`
- Updates relative imports

**Usage:**
```bash
# Dry-run
./scripts/update-imports.sh

# Execute
DRY_RUN=0 ./scripts/update-imports.sh
```

### 3. **update-config-files.sh**
Shows required configuration file changes:
- tsconfig.json path mappings
- package.json scripts
- playwright.config.ts paths
- tailwind.config.ts content paths
- .gitignore additions

**Usage:**
```bash
./scripts/update-config-files.sh > config-changes.txt
```

---

## Step-by-Step Execution Plan

### Prerequisites
- [ ] All changes committed to git
- [ ] Working on a feature branch (not main)
- [ ] Backup created (optional but recommended)
- [ ] All tests passing before migration
- [ ] Dev server working before migration

### Phase 1: Review and Prepare (15 min)
```bash
# 1. Create feature branch
git checkout -b migration/plans-md-structure

# 2. Run dry-run to review changes
./scripts/migrate-to-plans-structure.sh

# 3. Review the output carefully
# 4. Ensure you understand each file movement
```

### Phase 2: Execute Directory Creation (5 min)
```bash
# Uncomment Phase 1 in migrate-to-plans-structure.sh
# Run to create directory structure only
DRY_RUN=0 ./scripts/migrate-to-plans-structure.sh
```

### Phase 3: Execute File Migration (10 min)
```bash
# Uncomment Phases 2-5 in migrate-to-plans-structure.sh
# This will move all files
DRY_RUN=0 ./scripts/migrate-to-plans-structure.sh
```

### Phase 4: Update Configuration Files (20 min)
```bash
# 1. Review required changes
./scripts/update-config-files.sh

# 2. Manually update each config file:
#    - tsconfig.json
#    - package.json
#    - playwright.config.ts
#    - tailwind.config.ts
#    - .gitignore
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": "./frontend",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "frontend/next-env.d.ts",
    "frontend/**/*.ts",
    "frontend/**/*.tsx",
    "frontend/.next/types/**/*.ts"
  ]
}
```

**package.json:**
```json
{
  "scripts": {
    "dev": "cd frontend && next dev",
    "build": "cd frontend && next build",
    "start": "cd frontend && next start",
    "lint": "cd frontend && eslint .",
    "dev:backend": "cd backend && ./start.sh",
    "dev:full": "concurrently \"npm run dev\" \"npm run dev:backend\""
  }
}
```

### Phase 5: Update Imports (10 min)
```bash
# Run import update script
DRY_RUN=0 ./scripts/update-imports.sh
```

### Phase 6: Test Migration (30 min)
```bash
# 1. Install dependencies (if needed)
npm install

# 2. Start dev server
npm run dev

# 3. Verify pages load correctly
# Visit: http://localhost:3000

# 4. Run tests
npm run test

# 5. Check for any import errors in console
```

### Phase 7: Fix Any Issues (variable)
- Address any compilation errors
- Fix broken imports
- Update missed configuration

### Phase 8: Commit and Review (10 min)
```bash
# 1. Review all changes
git status
git diff

# 2. Commit in logical chunks
git add frontend/
git commit -m "feat: migrate frontend files to frontend/src/"

git add backend/
git commit -m "feat: migrate backend files to backend/src/"

git add scripts/
git commit -m "feat: reorganize scripts directory"

git add *.json *.ts
git commit -m "chore: update config files for new structure"

# 3. Push to remote
git push origin migration/plans-md-structure
```

---

## Testing Strategy

### Pre-Migration Tests
```bash
# Ensure everything works before migration
npm run dev        # Dev server starts
npm run build      # Production build succeeds
npm run test       # All tests pass
```

### Post-Migration Tests
```bash
# Verify migration didn't break anything
npm run dev        # Dev server still starts
npm run build      # Production build still succeeds
npm run test       # All tests still pass

# Additional checks
npm run lint       # No linting errors
npm run test:e2e   # E2E tests pass
```

### Critical Paths to Test
- [ ] Homepage loads: http://localhost:3000
- [ ] Dashboard: http://localhost:3000/dashboard
- [ ] Commitments: http://localhost:3000/commitments
- [ ] Change Events: http://localhost:3000/change-events
- [ ] Billing Periods: http://localhost:3000/billing-periods
- [ ] Auth flow: Login/logout
- [ ] API routes: /api/health, /api/commitments
- [ ] Backend health: http://localhost:8000/health

---

## Rollback Plan

If migration fails or causes issues:

### Option 1: Git Reset (Immediate)
```bash
# If not yet committed
git reset --hard HEAD

# If committed but not pushed
git reset --hard origin/main

# If pushed
git revert <commit-hash>
```

### Option 2: Restore from Backup
```bash
# The script creates a backup automatically
ls -la .migration-backup-*

# Restore if needed
# (Manual file restoration)
```

### Option 3: Branch Rollback
```bash
# Switch back to main
git checkout main

# Delete migration branch
git branch -D migration/plans-md-structure
```

---

## Post-Migration Tasks

### Immediate (Day 1)
- [ ] Update README.md with new structure
- [ ] Update CLAUDE.md with new paths
- [ ] Update CI/CD workflows in .github/workflows/
- [ ] Update deployment configurations (Vercel, etc.)
- [ ] Update team documentation

### Short-term (Week 1)
- [ ] Create separate frontend/package.json for isolated deployment
- [ ] Create separate backend/requirements.txt verification
- [ ] Set up separate deployment pipelines
- [ ] Update local dev environment docs
- [ ] Train team on new structure

### Long-term (Month 1)
- [ ] Deploy frontend independently to Vercel
- [ ] Deploy backend independently to cloud service
- [ ] Set up separate CI/CD for frontend/backend
- [ ] Monitor for any missed import issues
- [ ] Optimize build/deploy times

---

## File Movement Summary

### Frontend Files to Move
```
app/                → frontend/src/app/
components/         → frontend/src/components/
lib/                → frontend/src/lib/
hooks/              → frontend/src/hooks/
types/              → frontend/src/types/
contexts/           → frontend/src/contexts/
public/             → frontend/public/
tests/              → frontend/tests/
test_screenshots/   → frontend/tests/screenshots/archive/
```

### Backend Files to Move
```
python-backend/api.py                     → backend/src/api/main.py
python-backend/main.py                    → backend/src/api/server.py
python-backend/alleato_agent_workflow/    → backend/src/services/alleato_agent_workflow/
python-backend/ingestion/                 → backend/src/services/ingestion/
python-backend/rfi_agent/                 → backend/src/services/rfi_agent/
python-backend/workers/                   → backend/src/workers/
python-backend/scripts/                   → backend/src/workers/scripts/
python-backend/tests/                     → backend/tests/
python-backend/requirements.txt           → backend/requirements.txt
```

### Scripts to Reorganize
```
scripts/procore-screenshot-capture/  → scripts/dev-tools/screenshot-capture/
scripts/docs-viewer/                 → scripts/utilities/docs-viewer/
scripts/agent-crawl4ai-rag-main/     → scripts/ingestion/crawl4ai-rag/
```

### Files to Delete
```
app/(procore)/projects-copy/        # Untracked duplicate
app/(procore)/infinite-meetings/    # Obsolete experiment
```

---

## Risk Assessment

### Low Risk
- Directory structure changes (reversible via git)
- Configuration file updates (can be reverted)
- Script organization

### Medium Risk
- Import path updates (may miss some)
- Build configuration changes
- Test path updates

### High Risk
- Breaking dev environment (mitigated by dry-run testing)
- Breaking CI/CD (mitigated by branch testing)
- Breaking production deployment (mitigated by staging testing)

### Mitigation Strategies
1. **Dry-run first** - Review all changes before execution
2. **Feature branch** - Test in isolation before merging
3. **Incremental commits** - Easy to identify issues
4. **Comprehensive testing** - Verify everything works
5. **Backup plan** - Can rollback at any point

---

## Questions & Answers

**Q: Will this break my current dev environment?**
A: Temporarily yes, but after running the scripts and updating configs, it will work again.

**Q: How long will this take?**
A: ~90 minutes total (30 min migration, 30 min testing, 30 min fixes)

**Q: Can I do this in stages?**
A: Yes, you can move frontend first, then backend, or vice versa.

**Q: What if I find an issue after merging?**
A: You can revert the commits or create a hotfix.

**Q: Will this affect deployment?**
A: Yes, you'll need to update deployment configs, but you'll gain better deployment flexibility.

---

## Support

If you encounter issues during migration:

1. **Check the dry-run output** - Review what the script would do
2. **Read error messages carefully** - They usually indicate the problem
3. **Check git status** - See what changed
4. **Review this guide** - Follow the steps exactly
5. **Create an issue** - Document the problem for future reference

---

## Conclusion

This migration is a significant but worthwhile refactoring that will:
- Improve deployment flexibility
- Enable independent scaling
- Clarify team responsibilities
- Follow industry best practices

**Recommendation:** Execute during low-traffic period with ability to rollback if needed.

---

**Last Updated:** 2025-12-10
**Script Versions:** v1.0
**Next Review:** After successful migration
