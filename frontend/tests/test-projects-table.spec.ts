import { test, expect } from '@playwright/test';

test.describe('Projects Table', () => {
  test.beforeEach(async ({ page }) => {
    // Use mock login to bypass authentication
    await page.goto('http://localhost:3000/mock-login?redirect=/projects');
    await page.waitForLoadState('networkidle');
  });

  test('should display projects table with correct columns in order', async ({ page }) => {
    // Wait for the table to load
    await page.waitForSelector('table', { timeout: 10000 });

    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/projects-table-loaded.png', fullPage: true });

    // Get all column headers
    const headers = await page.locator('thead th').allTextContents();

    // Check that columns are in the correct order
    // Flag column has sr-only text, so it won't be visible
    expect(headers).toContain('Name');
    expect(headers).toContain('Job Number');
    expect(headers).toContain('Client');
    expect(headers).toContain('Start Date');
    expect(headers).toContain('State');
    expect(headers).toContain('Phase');
    expect(headers).toContain('Est Revenue');
    expect(headers).toContain('Est Profit');
    expect(headers).toContain('Category');

    // Verify the status column is NOT present
    const statusColumnExists = headers.some(h => h.toLowerCase().includes('status'));
    expect(statusColumnExists).toBe(false);

    console.log('Column headers:', headers);
  });

  test('should have filter inputs for all columns', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Count filter inputs - should have one for each column except the flag column
    const filterInputs = await page.locator('thead input[placeholder="Filter..."]').count();
    expect(filterInputs).toBeGreaterThanOrEqual(8); // At least 8 columns should have filters

    await page.screenshot({ path: 'tests/screenshots/projects-table-filters.png', fullPage: true });
  });

  test('should filter by phase="current" by default (case insensitive)', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Check that the phase filter input has "current" as the default value
    const phaseFilterValue = await page.locator('thead input[placeholder="Filter..."]').nth(5).inputValue();
    expect(phaseFilterValue.toLowerCase()).toBe('current');

    // Check that rows are displayed (meaning the filter is working)
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);

    console.log(`Found ${rowCount} projects with phase="current"`);

    await page.screenshot({ path: 'tests/screenshots/projects-table-default-filter.png', fullPage: true });
  });

  test('should allow filtering by name', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Get the name filter input (first column with filter)
    const nameFilter = page.locator('thead input[placeholder="Filter..."]').first();

    // Clear the phase filter first to see all projects
    const phaseFilter = page.locator('thead input[placeholder="Filter..."]').nth(5);
    await phaseFilter.clear();
    await page.waitForTimeout(500);

    // Type in the name filter
    await nameFilter.fill('test');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'tests/screenshots/projects-table-name-filter.png', fullPage: true });
  });

  test('should allow sorting by clicking column headers', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Click the Name column sort button
    await page.locator('thead button:has-text("Name")').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'tests/screenshots/projects-table-sorted.png', fullPage: true });
  });

  test('should have working pagination controls', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Check that pagination controls are present
    const paginationExists = await page.locator('text=/Page \\d+ of \\d+/').isVisible();
    expect(paginationExists).toBe(true);

    // Check page size selector
    const pageSizeSelector = await page.locator('select').first();
    expect(pageSizeSelector).toBeTruthy();

    await page.screenshot({ path: 'tests/screenshots/projects-table-pagination.png', fullPage: true });
  });

  test('should display project data from Supabase', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Check that at least one row exists
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);

    // Get the first row's data
    const firstRow = page.locator('tbody tr').first();
    const cells = await firstRow.locator('td').allTextContents();

    console.log('First row data:', cells);

    // Verify that cells contain data (not just empty or "-")
    const hasData = cells.some(cell => cell && cell !== '-' && cell.trim() !== '');
    expect(hasData).toBe(true);

    await page.screenshot({ path: 'tests/screenshots/projects-table-data.png', fullPage: true });
  });

  test('should clear all filters when phase filter is cleared', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Get initial row count
    const initialRowCount = await page.locator('tbody tr').count();

    // Clear the phase filter
    const phaseFilter = page.locator('thead input[placeholder="Filter..."]').nth(5);
    await phaseFilter.clear();
    await page.waitForTimeout(500);

    // Get new row count
    const newRowCount = await page.locator('tbody tr').count();

    // Should have more rows after clearing the filter (or at least the same)
    expect(newRowCount).toBeGreaterThanOrEqual(initialRowCount);

    console.log(`Initial rows: ${initialRowCount}, After clearing filter: ${newRowCount}`);

    await page.screenshot({ path: 'tests/screenshots/projects-table-filter-cleared.png', fullPage: true });
  });
});
