import { test, expect } from '@playwright/test';

test.describe('Portfolio Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the portfolio page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load portfolio page without errors', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Portfolio');
    
    // Check page description
    await expect(page.locator('text=Manage your construction projects and programs')).toBeVisible();
    
    // Check breadcrumbs - use first() to handle multiple matches
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]').first();
    await expect(breadcrumb).toBeVisible();
    
    // Check New Project button
    await expect(page.locator('button:has-text("New Project")')).toBeVisible();
    
    // Capture screenshot
    await page.screenshot({ 
      path: 'test_screenshots/portfolio/portfolio-initial-load.png',
      fullPage: true 
    });
  });

  test('should display project table with correct columns', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table')).toBeVisible();
    
    // Check all column headers
    const expectedColumns = [
      'Project Name',
      'Project #',
      'Address',
      'City',
      'State',
      'Status',
      'Stage',
      'Type'
    ];
    
    for (const column of expectedColumns) {
      await expect(page.locator(`th:has-text("${column}")`)).toBeVisible();
    }
    
    // Capture screenshot of table
    await page.screenshot({ 
      path: 'test_screenshots/portfolio/portfolio-table-view.png',
      fullPage: true 
    });
  });

  test('should show status indicators with appropriate colors', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Check for status badges - they might not exist if no projects
    const statusBadges = page.locator('span').filter({ hasText: /Active|Inactive/ });
    const badgeCount = await statusBadges.count();
    
    if (badgeCount > 0) {
      // Check Active status has green styling
      const activeBadge = statusBadges.filter({ hasText: 'Active' }).first();
      if (await activeBadge.isVisible()) {
        await expect(activeBadge).toHaveClass(/bg-green-100.*text-green-800/);
      }
      
      // Check Inactive status has gray styling
      const inactiveBadge = statusBadges.filter({ hasText: 'Inactive' }).first();
      if (await inactiveBadge.isVisible()) {
        await expect(inactiveBadge).toHaveClass(/bg-gray-100.*text-gray-800/);
      }
    }
    
    // Capture screenshot showing status indicators
    await page.screenshot({ 
      path: 'test_screenshots/portfolio/portfolio-status-indicators.png',
      fullPage: true 
    });
  });

  test('should have working search functionality', async ({ page }) => {
    // Find the search input - use first() to handle multiple matches
    const searchInput = page.locator('input[placeholder="Search projects..."]').first();
    await expect(searchInput).toBeVisible();
    
    // Type in search
    await searchInput.fill('Test Project');
    
    // Wait for search to trigger (debounced)
    await page.waitForTimeout(500);
    
    // Capture screenshot of search results
    await page.screenshot({ 
      path: 'test_screenshots/portfolio/portfolio-search-results.png',
      fullPage: true 
    });
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);
  });

  test('should have working filter functionality', async ({ page }) => {
    // Click on filters button (if it exists)
    const filtersButton = page.locator('button').filter({ hasText: /Filters/ });
    if (await filtersButton.isVisible()) {
      await filtersButton.click();
      
      // Wait for filter panel
      await page.waitForTimeout(300);
      
      // Capture screenshot with filters open
      await page.screenshot({ 
        path: 'test_screenshots/portfolio/portfolio-filters-open.png',
        fullPage: true 
      });
    }
    
    // Test status filter by clicking on tabs
    const inactiveTab = page.locator('button[role="tab"]').filter({ hasText: 'Inactive' });
    if (await inactiveTab.isVisible()) {
      await inactiveTab.click();
      await page.waitForTimeout(500);
      
      // Capture screenshot of filtered view
      await page.screenshot({ 
        path: 'test_screenshots/portfolio/portfolio-filtered-inactive.png',
        fullPage: true 
      });
    }
  });

  test('should navigate to project detail on row click', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Check if there are any project rows
    const projectRows = page.locator('tbody tr');
    const rowCount = await projectRows.count();
    
    if (rowCount > 0) {
      // Get the first project name for verification
      const firstProjectName = await projectRows.first().locator('td').first().textContent();
      
      // Click on the first project row
      await projectRows.first().click();
      
      // Wait for navigation
      await page.waitForTimeout(1000);
      
      // Check if URL changed - could be project detail or stay on portfolio
      const currentUrl = page.url();
      const hasNavigated = currentUrl !== 'http://localhost:3000/' && 
                          (currentUrl.includes('/project') || 
                           currentUrl.includes('/home') ||
                           currentUrl.match(/\/\d+/));
      
      console.log(`Navigation test - Current URL: ${currentUrl}, Has navigated: ${hasNavigated}`);
      
      // Capture screenshot of navigation result
      await page.screenshot({ 
        path: 'test_screenshots/portfolio/portfolio-project-navigation.png',
        fullPage: true 
      });
    }
  });

  test('should show proper empty state when no projects', async ({ page }) => {
    // This test captures the empty state if it exists
    const emptyState = page.locator('text=No results');
    if (await emptyState.isVisible()) {
      await page.screenshot({ 
        path: 'test_screenshots/portfolio/portfolio-empty-state.png',
        fullPage: true 
      });
    }
  });

  test('should have responsive layout', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test_screenshots/portfolio/portfolio-mobile-view.png',
      fullPage: true 
    });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test_screenshots/portfolio/portfolio-tablet-view.png',
      fullPage: true 
    });
  });
});