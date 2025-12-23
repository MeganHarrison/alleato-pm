# Code Quality Enforcement System

## Overview

This repository now has **mandatory, automated code quality enforcement** at three levels:

1. **Pre-Commit** - Blocks bad commits
2. **Pre-Push** - Blocks bad pushes
3. **CI/CD** - Blocks bad PRs

**There is no way to merge code with type errors or lint errors.**

---

## What Gets Checked

### TypeScript
- All `.ts` and `.tsx` files must have zero type errors
- No `any` types allowed (use `unknown` instead)
- No `@ts-ignore` or `@ts-expect-error` comments

### ESLint
- No unused variables (prefix with `_` if intentionally unused)
- No `console.log` (use `console.warn` or `console.error`)
- No inline styles (use Tailwind classes)
- React hooks rules enforced
- No debugger statements
- No alert() calls

### Formatting
- Prettier auto-formats all code
- Consistent indentation and spacing

---

## How It Works

### Level 1: Pre-Commit Hook

When you run `git commit`:

1. **lint-staged** runs on your staged files
2. TypeScript checks the entire project
3. ESLint runs on staged files (and auto-fixes)
4. Prettier formats staged files

**If any check fails, your commit is blocked.**

```bash
# Example output when commit is blocked:
🔍 Running pre-commit checks...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Type error in src/components/Button.tsx
   Property 'variant' does not exist on type 'ButtonProps'

❌ Pre-commit checks FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix the errors above before committing.
Type errors and lint errors must be fixed.
```

### Level 2: Pre-Push Hook

When you run `git push`:

1. Full TypeScript check on entire codebase
2. Full ESLint check on entire codebase

**If either fails, your push is blocked.**

```bash
# Example output when push is blocked:
🚀 Running pre-push checks...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Type checking entire project...
✅ Type check passed

🔍 Linting entire project...
❌ 3 lint errors found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Pre-push checks FAILED

PUSH BLOCKED - Fix all errors before pushing

Run these commands to see errors:
  npm run typecheck --prefix frontend
  npm run lint --prefix frontend
```

### Level 3: GitHub Actions CI

Every Pull Request automatically runs:

1. `npm run typecheck` - Full TypeScript check
2. `npm run lint` - Full ESLint check

**PRs with failing checks cannot be merged.**

The CI check appears as a required status check on every PR.

---

## Commands

### Check for Errors

```bash
# TypeScript only
npm run typecheck --prefix frontend

# ESLint only
npm run lint --prefix frontend

# Both (recommended)
npm run quality --prefix frontend
```

### Auto-Fix Errors

```bash
# Auto-fix ESLint errors
npm run lint:fix --prefix frontend

# TypeCheck + Auto-fix ESLint
npm run quality:fix --prefix frontend
```

**Note:** TypeScript errors cannot be auto-fixed, only lint errors can.

---

## Workflow

### Before You Start Coding

```bash
# Make sure you're starting clean
npm run quality --prefix frontend
```

### After Making Changes

```bash
# Check for errors
npm run quality --prefix frontend

# Auto-fix what can be fixed
npm run quality:fix --prefix frontend

# Manually fix remaining errors
# Then commit
git add .
git commit -m "Your message"
```

### If Pre-Commit Hook Blocks You

1. Read the error message carefully
2. Fix the errors in your code
3. Run `npm run quality:fix --prefix frontend` to auto-fix lint issues
4. Manually fix remaining type errors
5. Try committing again

### If Pre-Push Hook Blocks You

1. Run `npm run quality --prefix frontend` to see all errors
2. Fix all errors
3. Commit your fixes
4. Try pushing again

---

## Emergency Override (NOT RECOMMENDED)

In absolute emergencies, you can bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip pre-push hook
git push --no-verify
```

**WARNING:**
- This will cause CI to fail
- Your PR will be blocked anyway
- Only use if you have a very good reason

---

## For Claude AI

Claude must follow these rules:

1. Run `npm run quality --prefix frontend` after EVERY code change
2. Fix ALL errors before marking task complete
3. Never commit code with type/lint errors
4. Never use `@ts-ignore` or `@ts-expect-error`
5. Never use `any` type (use `unknown` instead)
6. Never use `console.log` (use `console.warn` or `console.error`)

---

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/pre-push` - Pre-push hook script
- `.lintstagedrc.js` - lint-staged configuration
- `frontend/eslint.config.mjs` - ESLint rules
- `frontend/tsconfig.json` - TypeScript configuration
- `.github/workflows/code-quality.yml` - CI configuration

---

## Benefits

### For You
- Catch errors before they reach production
- No more "fix lint errors" commits
- Consistent code style across team
- Faster code reviews (no style bikeshedding)

### For The Team
- Guaranteed code quality baseline
- No surprises in production
- Builds always succeed
- Faster CI/CD pipeline

### For The Business
- Fewer bugs in production
- Lower maintenance costs
- Faster feature delivery
- Higher customer satisfaction

---

## Troubleshooting

### "Hooks not running"

```bash
# Reinstall hooks
npx husky install
```

### "lint-staged not found"

```bash
# Reinstall dependencies
cd frontend && npm install
```

### "TypeScript errors I didn't cause"

The pre-commit hook checks the ENTIRE project, not just your changes. This is intentional. Fix errors as you encounter them.

### "Too many errors to fix"

1. Focus on files you're actively changing
2. Fix one file at a time
3. Consider creating a separate PR just for cleanup

---

## Status

✅ **System is ACTIVE and ENFORCED**

All three levels of enforcement are now in place:
- Pre-commit hook: ACTIVE
- Pre-push hook: ACTIVE
- GitHub Actions CI: ACTIVE

**No code with type or lint errors can be merged.**
