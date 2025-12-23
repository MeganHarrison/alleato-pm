# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the Alleato-Procore project.

## Workflows

### `test.yml` - Automated Testing Pipeline

Comprehensive testing pipeline that runs on push and pull requests to `main` and `develop` branches.

#### Jobs

1. **Code Quality** (REQUIRED)
   - TypeScript type checking (`npm run typecheck`)
   - ESLint linting (`npm run lint`)
   - Blocks all other jobs if quality checks fail
   - Enforces CLAUDE.md code quality gates

2. **Frontend Unit Tests**
   - Runs Jest unit tests with coverage
   - Uploads coverage artifacts
   - Depends on Code Quality passing

3. **Backend Unit Tests**
   - Runs Python/pytest tests (if applicable)
   - Generates coverage reports
   - Conditional: only runs if backend files exist

4. **Playwright E2E Tests**
   - Browser-based end-to-end tests
   - Includes Postgres service container
   - Generates HTML and JSON reports
   - Screenshots saved on failure
   - Depends on Code Quality passing

5. **Build Test**
   - Verifies production build succeeds
   - Catches build-time errors
   - Depends on Code Quality passing

6. **Test Summary**
   - Aggregates results from all test jobs
   - Creates GitHub Step Summary with status
   - Fails if any test job fails

7. **Coverage Report** (PR only)
   - Posts coverage summary as PR comment
   - Links to detailed artifacts

## Configuration

### Required GitHub Secrets

To run E2E tests and builds, configure these secrets in your repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1...` |

**How to find these values:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the values from:
   - Project URL → `SUPABASE_URL`
   - Project API keys → `anon public` → `SUPABASE_ANON_KEY`

### IDE Warnings

The GitHub Actions YAML file may show warnings like:
```
Context access might be invalid: SUPABASE_URL
```

**These warnings are expected and safe to ignore.** They appear because:
- The IDE doesn't have access to your repository secrets
- The secrets are configured in GitHub repository settings
- At runtime, GitHub Actions will substitute the actual secret values

## Local Testing

Before pushing, run the same quality checks locally:

```bash
# Run all quality checks (matches CI)
cd frontend
npm run quality

# Individual checks
npm run typecheck  # TypeScript
npm run lint       # ESLint

# Run tests
npm run test:unit:ci      # Unit tests
npx playwright test        # E2E tests
npm run build              # Build test
```

## Workflow Triggers

The workflow runs on:
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop` branches

## Artifacts

The workflow generates several artifacts available for download:

| Artifact | Job | Retention | Description |
|----------|-----|-----------|-------------|
| `frontend-unit-coverage` | Frontend Unit Tests | 7 days | Jest coverage reports |
| `backend-coverage` | Backend Unit Tests | 7 days | Pytest coverage reports |
| `playwright-report` | Playwright E2E | 30 days | HTML test reports & screenshots |
| `playwright-test-results` | Playwright E2E | 7 days | Raw test results & traces |

## Debugging Failed Workflows

### 1. Check the Test Summary

Every workflow run creates a summary showing which jobs passed/failed:
- Go to Actions → Select the workflow run
- See the summary at the top of the run page

### 2. View Job Logs

Click on any failed job to see detailed logs:
- Red jobs indicate failures
- Expand steps to see command output
- Error messages are highlighted

### 3. Download Artifacts

For E2E test failures:
1. Scroll to bottom of workflow run
2. Download `playwright-report` artifact
3. Unzip and open `index.html` in a browser
4. View screenshots, traces, and video recordings

### 4. Reproduce Locally

```bash
# Run the same commands CI runs
cd frontend
npm ci
npm run quality
npx playwright test

# For specific tests
npx playwright test --debug  # Opens browser debugger
```

## Best Practices

1. **Always check CI before merging**
   - Wait for all checks to pass
   - Review any new warnings
   - Check test coverage changes

2. **Fix quality issues immediately**
   - TypeScript errors block commits
   - ESLint errors block commits
   - Don't use `@ts-ignore` or `any` types

3. **Keep tests fast**
   - Use test parallelization
   - Mock external services
   - Clean up test data

4. **Monitor artifact usage**
   - Artifacts count toward storage quota
   - Old artifacts auto-delete after retention period
   - Download important reports before they expire

## Troubleshooting

### Tests pass locally but fail in CI

**Common causes:**
- Different Node.js versions (check `NODE_VERSION` in workflow)
- Missing environment variables (check secrets)
- Timing issues in E2E tests (increase timeouts)
- Database state differences (use test fixtures)

**Solutions:**
```bash
# Match CI environment locally
nvm use 18  # Use same Node version as CI
CI=true npm test  # Run with CI environment variable
```

### Secrets not working

**Verify secrets are set:**
1. Go to repository Settings → Secrets and variables → Actions
2. Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` exist
3. Update secrets if they've changed
4. Re-run failed workflows

**Note:** Secret values are never displayed in logs for security.

### Build fails but works locally

**Check for:**
- Uncommitted files required for build
- Environment-specific code
- Missing dependencies in `package.json`
- Different build configurations

```bash
# Test production build locally
npm run build
```

## Workflow Maintenance

### Updating Node.js Version

Edit `.github/workflows/test.yml`:
```yaml
env:
  NODE_VERSION: '18'  # Change this value
```

### Adding New Test Jobs

1. Add job to `test.yml`
2. Add dependency in `test-summary` needs array
3. Update summary script to check new job result

### Modifying E2E Tests

When E2E tests change:
- Update timeout if tests take longer
- Adjust Postgres configuration if needed
- Increase retention if screenshots are important

## Support

For issues with:
- **Workflow configuration:** Check this README
- **Test failures:** Download artifacts and review logs
- **CLAUDE.md compliance:** Run `npm run quality` locally
- **Secrets:** Verify in repository settings

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Code quality requirements
- [Playwright Config](../../frontend/playwright.config.ts) - E2E test configuration
- [Package Scripts](../../frontend/package.json) - Available npm commands
