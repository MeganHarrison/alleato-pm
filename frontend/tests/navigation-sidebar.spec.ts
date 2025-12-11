import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display all primary navigation items', async ({ page }) => {
    // Check primary navigation items
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meetings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Directory' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AI Chat' })).toBeVisible();
  });

  test('should display Project Tools section', async ({ page }) => {
    // Check for Project Tools section header
    await expect(page.getByText('Project Tools')).toBeVisible();

    // Check project tools items
    await expect(page.getByRole('link', { name: 'Drawings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Photos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Submittals' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Punch List' })).toBeVisible();
  });

  test('should display Financial section', async ({ page }) => {
    // Check for Financial section header
    await expect(page.getByText('Financial')).toBeVisible();

    // Check financial items
    await expect(page.getByRole('link', { name: 'Budget' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contracts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Commitments' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change Orders' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change Events' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Invoices' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Billing Periods' })).toBeVisible();
  });

  test('should display secondary navigation items', async ({ page }) => {
    // Check secondary navigation items
    await expect(page.getByRole('link', { name: 'Executive' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Archive' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  });

  test('should NOT display dev tools in production sidebar', async ({ page }) => {
    // Verify dev tools are removed
    await expect(page.getByRole('link', { name: 'API Docs' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Sitemap' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Docs Infinite' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Docs Query' })).not.toBeVisible();
  });

  test('should navigate to Tasks page', async ({ page }) => {
    await page.getByRole('link', { name: 'Tasks' }).click();
    await page.waitForURL('**/tasks');
    expect(page.url()).toContain('/tasks');
  });

  test('should navigate to Meetings page', async ({ page }) => {
    await page.getByRole('link', { name: 'Meetings' }).click();
    await page.waitForURL('**/meetings');
    expect(page.url()).toContain('/meetings');
  });

  test('should navigate to Budget page', async ({ page }) => {
    await page.getByRole('link', { name: 'Budget' }).click();
    await page.waitForURL('**/budget');
    expect(page.url()).toContain('/budget');
  });
});
