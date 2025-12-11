# Migration Quick Start Guide

**⚠️ IMPORTANT: Read [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for full details before executing!**

---

## TL;DR - Migration in 5 Steps

### Step 1: Review (5 min)
```bash
# Create branch
git checkout -b migration/plans-md-structure

# Dry-run to see what will happen
./scripts/migrate-to-plans-structure.sh
```

### Step 2: Execute Migration (15 min)
```bash
# Run the migration (after reviewing dry-run output)
DRY_RUN=0 ./scripts/migrate-to-plans-structure.sh
```

### Step 3: Update Configs (20 min)
```bash
# See required changes
./scripts/update-config-files.sh

# Manually update:
# - tsconfig.json (paths: "./*" → "./src/*", baseUrl: "./frontend")
# - package.json (scripts: "next dev" → "cd frontend && next dev")
# - playwright.config.ts (testDir: "./tests" → "./frontend/tests")
# - tailwind.config.ts (content paths)
```

### Step 4: Update Imports (10 min)
```bash
DRY_RUN=0 ./scripts/update-imports.sh
```

### Step 5: Test (30 min)
```bash
npm install
npm run dev
npm run test
```

---

## If Something Breaks

```bash
# Rollback everything
git reset --hard HEAD

# Or specific file
git checkout HEAD -- path/to/file
```

---

## Critical Files to Update

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "./frontend",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### package.json
```json
{
  "scripts": {
    "dev": "cd frontend && next dev",
    "build": "cd frontend && next build"
  }
}
```

### playwright.config.ts
```typescript
export default defineConfig({
  testDir: './frontend/tests',
})
```

---

## What Gets Moved

**Frontend:**
- `app/` → `frontend/src/app/`
- `components/` → `frontend/src/components/`
- `lib/` → `frontend/src/lib/`
- `hooks/` → `frontend/src/hooks/`
- `tests/` → `frontend/tests/`

**Backend:**
- `python-backend/` → `backend/src/`

**Deleted:**
- `app/(procore)/projects-copy/`
- `app/(procore)/infinite-meetings/`

---

## Timeline

- **Preparation:** 5 min
- **Execution:** 15 min
- **Config Updates:** 20 min
- **Import Updates:** 10 min
- **Testing:** 30 min
- **Total:** ~90 minutes

---

## Success Checklist

- [ ] Dev server starts (`npm run dev`)
- [ ] Homepage loads
- [ ] Tests pass (`npm run test`)
- [ ] No console errors
- [ ] Backend responds (`http://localhost:8000/health`)

---

## Need Help?

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for:
- Detailed step-by-step instructions
- Rollback procedures
- Troubleshooting guide
- Risk assessment
