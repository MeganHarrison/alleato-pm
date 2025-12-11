import { test, expect } from '@playwright/test';

test.describe('Expanded Sidebar Navigation', () => {
  test('should display all navigation sections when sidebar is expanded', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Find and click the sidebar toggle button to expand it
    const sidebarToggle = page.locator('[data-sidebar="trigger"]').first();
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      await page.waitForTimeout(500); // Wait for animation
    }

    // Take a screenshot of the expanded sidebar
    await page.screenshot({
      path: 'frontend/tests/screenshots/sidebar-expanded-verification.png',
      fullPage: true
    });

    // Verify primary navigation items
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meetings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Directory' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AI Chat' })).toBeVisible();

    // Verify Project Tools section
    await expect(page.getByText('Project Tools')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Drawings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Photos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Submittals' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Punch List' })).toBeVisible();

    // Verify Financial section
    await expect(page.getByText('Financial')).toBeVisible();

    // Scroll the sidebar to see financial items
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await sidebar.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(300);

    await expect(page.getByRole('link', { name: 'Budget' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contracts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Commitments' })).toBeVisible();

    // Verify secondary navigation
    await expect(page.getByRole('link', { name: 'Executive' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Archive' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();

    console.log('✅ All navigation sections verified successfully!');
  });

  test('should verify dev tools are removed from production sidebar', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Expand sidebar if needed
    const sidebarToggle = page.locator('[data-sidebar="trigger"]').first();
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      await page.waitForTimeout(500);
    }

    // Verify dev tools are NOT present
    const pageContent = await page.content();
    expect(pageContent).not.toContain('API Docs');
    expect(pageContent).not.toContain('Sitemap');
    expect(pageContent).not.toContain('Docs Infinite');
    expect(pageContent).not.toContain('Docs Query');
    expect(pageContent).not.toContain('Doc Viewer');

    console.log('✅ Dev tools successfully removed from sidebar!');
  });
});
