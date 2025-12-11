# Portfolio Page Tests

This directory contains Playwright tests for the Alleato-Procore application, with a focus on testing the portfolio page functionality.

## Prerequisites

1. **Start the development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

2. **Ensure Playwright is installed:**
   ```bash
   # From the root directory
   npm install playwright
   ```

## Running Tests

### Comprehensive Portfolio Test

This test covers all the requirements from `TASK_LIST.md` including:

- ✅ Supabase data integration
- ✅ Default page size (50 projects)
- ✅ Column sorting functionality
- ✅ Horizontal scrolling behavior (only table should scroll)
- ✅ First column freeze (sticky positioning)
- ✅ Search functionality
- ✅ Filter functionality
- ✅ Export button
- ✅ Create Project button
- ✅ Project click navigation
- ✅ Sidebar styling (white background)
- ✅ Table height and padding
- ✅ Pagination controls
- ✅ Responsive behavior

**Run the comprehensive test:**
```bash
node tests/portfolio-comprehensive-test.js
```

### Other Tests

**Final validation test (Phase filter & 50 project limit):**
```bash
node tests/final-validation-test.js
```

**Filter verification:**
```bash
node tests/verify-filter-test.js
```

**Debug navigation:**
```bash
node tests/debug-navigation.js
```

**Debug errors:**
```bash
node tests/debug-errors.js
```

## Test Output

Tests will:
1. Open a browser window (non-headless by default)
2. Run all test scenarios
3. Take screenshots saved to the `tests/` directory
4. Print detailed results to the console
5. Keep the browser open for 10 seconds for visual inspection

## Understanding Results

The test will provide a summary with three categories:

- **✅ PASSED**: Tests that passed successfully
- **⚠️ WARNINGS**: Non-critical issues or informational messages
- **❌ FAILED**: Critical issues that need to be fixed

## Screenshots

The comprehensive test generates:
- `portfolio-full-page.png` - Full page screenshot
- `portfolio-table-area.png` - Table area close-up
- `portfolio-error.png` - Error screenshot (if test fails)

## Fixing Failed Tests

### "Page scrolls horizontally" Issue
**File:** [frontend/app/page.tsx](../frontend/app/page.tsx)

The entire page should not scroll horizontally. Only the table container should have horizontal scroll when needed.

**Fix:** Check the CSS classes and ensure the page wrapper has `overflow-x: hidden` while the table container has `overflow-x: auto`.

### "First column is not frozen" Issue
**File:** [frontend/components/portfolio/projects-table.tsx](../frontend/components/portfolio/projects-table.tsx:32-44)

The first column (flag) and second column (name) should remain visible when scrolling horizontally.

**Current implementation:** Check the `meta` property on columns and the `getStickyStyles` function.

### Other Common Issues

1. **Supabase connection**: Ensure `.env.local` has correct Supabase credentials
2. **Default page size**: Check the `pageSize` initial state in `projects-table.tsx:36`
3. **Navigation**: Verify `onProjectClick` handler in `page.tsx:125-128`

## Adding New Tests

To add a new test:

1. Create a new `.js` file in this directory
2. Follow the pattern from existing tests
3. Use Playwright's API to interact with the page
4. Document the test purpose and what it checks
5. Update this README with the new test

## Troubleshooting

**"Server is not running" error:**
```bash
cd frontend
npm run dev
```

**"Timeout waiting for selector" error:**
- Increase timeout values in the test
- Check if the element selector is correct
- Ensure the page loads successfully

**Browser doesn't open:**
- Check if Playwright is installed: `npx playwright install chromium`
- Try running with `headless: true` in the launch options
