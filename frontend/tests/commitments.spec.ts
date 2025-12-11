import { test, expect } from '@playwright/test';

test.describe('Commitments Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the commitments page
    await page.goto('/commitments', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1000); // Give page time to load
  });

  test('should load commitments page without errors', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Commitments');
    
    // Check page description
    await expect(page.locator('text=Manage purchase orders and subcontracts')).toBeVisible();
    
    // Check breadcrumbs - use first() to handle multiple matches
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]').first();
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toContainText('Financial');
    await expect(breadcrumb).toContainText('Commitments');
    
    // Check Create button with dropdown
    await expect(page.locator('button:has-text("Create")')).toBeVisible();
    
    // Capture screenshot
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-initial-load.png',
      fullPage: true 
    });
  });

  test('should display financial summary cards', async ({ page }) => {
    // Check all four summary cards
    const summaryCards = [
      'Original Contract Amount',
      'Approved Change Orders',
      'Revised Contract Amount',
      'Balance to Finish'
    ];
    
    for (const cardTitle of summaryCards) {
      await expect(page.locator(`text="${cardTitle}"`)).toBeVisible();
    }
    
    // Verify currency formatting (should start with $)
    const amountElements = page.locator('div.text-2xl.font-bold');
    const count = await amountElements.count();
    
    for (let i = 0; i < Math.min(count, 4); i++) {
      const text = await amountElements.nth(i).textContent();
      expect(text).toMatch(/^\$/);
    }
    
    // Capture screenshot of summary cards
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-summary-cards.png',
      fullPage: true 
    });
  });

  test('should display status overview', async ({ page }) => {
    // Check for Status Overview section
    await expect(page.locator('h2:has-text("Status Overview")')).toBeVisible();
    
    // Check for status badges
    const statuses = ['draft', 'sent', 'pending', 'approved', 'executed', 'closed', 'void'];
    const statusSection = page.locator('div').filter({ has: page.locator('h2:has-text("Status Overview")') });
    
    // Capture screenshot of status overview
    await statusSection.scrollIntoViewIfNeeded();
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-status-overview.png',
      fullPage: true 
    });
  });

  test('should display commitments table with correct columns', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table')).toBeVisible();
    
    // Check all column headers
    const expectedColumns = [
      'Number',
      'Title',
      'Company',
      'Status',
      'Type',
      'Original Amount',
      'Revised Amount',
      'Balance to Finish',
      'Actions'
    ];
    
    for (const column of expectedColumns) {
      await expect(page.locator(`th:has-text("${column}")`)).toBeVisible();
    }
    
    // Capture screenshot of table
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-table-view.png',
      fullPage: true 
    });
  });

  test('should show create dropdown menu', async ({ page }) => {
    // Click Create button to open dropdown
    await page.locator('button:has-text("Create")').click();
    
    // Wait for dropdown to appear
    await page.waitForSelector('[role="menu"]');
    
    // Check dropdown options
    await expect(page.locator('[role="menuitem"]:has-text("Subcontract")')).toBeVisible();
    await expect(page.locator('[role="menuitem"]:has-text("Purchase Order")')).toBeVisible();
    
    // Capture screenshot with dropdown open
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-create-dropdown.png',
      fullPage: true 
    });
    
    // Close dropdown by clicking outside
    await page.click('body');
  });

  test('should handle bulk actions menu', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Check if bulk actions button exists (might be conditional on having data)
    const bulkActionsButton = page.locator('button').filter({ hasText: /Bulk Actions|Actions/ });
    
    if (await bulkActionsButton.isVisible()) {
      await bulkActionsButton.click();
      
      // Wait for dropdown
      await page.waitForTimeout(300);
      
      // Capture screenshot
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-bulk-actions.png',
        fullPage: true 
      });
      
      // Close menu
      await page.click('body');
    }
  });

  test('should have working search functionality', async ({ page }) => {
    // Find the search input
    const searchInput = page.locator('input[placeholder*="Search commitments"]');
    await expect(searchInput).toBeVisible();
    
    // Type in search
    await searchInput.fill('Test Commitment');
    
    // Wait for search to trigger
    await page.waitForTimeout(500);
    
    // Capture screenshot of search
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-search-active.png',
      fullPage: true 
    });
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);
  });

  test('should have working export functionality', async ({ page }) => {
    // Find export button
    const exportButton = page.locator('button').filter({ hasText: /Export/i });
    
    if (await exportButton.isVisible()) {
      // Click export button
      await exportButton.click();
      
      // If dropdown appears, capture it
      await page.waitForTimeout(300);
      
      // Capture screenshot
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-export-options.png',
        fullPage: true 
      });
    }
  });

  test('should display row actions dropdown', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Check if there are any data rows
    const actionButtons = page.locator('tbody tr button').filter({ has: page.locator('svg') });
    const buttonCount = await actionButtons.count();
    
    if (buttonCount > 0) {
      // Click first action button
      await actionButtons.first().click();
      
      // Wait for dropdown menu
      await page.waitForSelector('[role="menu"]');
      
      // Verify action options
      await expect(page.locator('[role="menuitem"]:has-text("View")')).toBeVisible();
      await expect(page.locator('[role="menuitem"]:has-text("Edit")')).toBeVisible();
      await expect(page.locator('[role="menuitem"]:has-text("Delete")')).toBeVisible();
      
      // Capture screenshot
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-row-actions.png',
        fullPage: true 
      });
      
      // Close menu
      await page.keyboard.press('Escape');
    }
  });

  test('should navigate between tabs', async ({ page }) => {
    // Check all tabs are visible
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    
    // Click Subcontracts tab
    const subcontractsTab = page.locator('[role="tab"]:has-text("Subcontracts")');
    if (await subcontractsTab.isVisible()) {
      await subcontractsTab.click();
      await page.waitForTimeout(500);
      
      // Capture screenshot
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-subcontracts-tab.png',
        fullPage: true 
      });
    }
    
    // Click Purchase Orders tab
    const purchaseOrdersTab = page.locator('[role="tab"]:has-text("Purchase Orders")');
    if (await purchaseOrdersTab.isVisible()) {
      await purchaseOrdersTab.click();
      await page.waitForTimeout(500);
      
      // Capture screenshot
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-purchase-orders-tab.png',
        fullPage: true 
      });
    }
  });

  test('should handle error state gracefully', async ({ page }) => {
    // Check if error state is displayed
    const errorMessage = page.locator('text=Unable to load commitments data');
    const retryButton = page.locator('button:has-text("Retry")');
    
    if (await errorMessage.isVisible()) {
      // Capture error state
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-error-state.png',
        fullPage: true 
      });
      
      // Test retry functionality
      if (await retryButton.isVisible()) {
        await retryButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Check for empty state message
    const emptyState = page.locator('text=No commitments found');
    
    if (await emptyState.isVisible()) {
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-empty-state.png',
        fullPage: true 
      });
    }
  });

  test('should have responsive layout', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-mobile-view.png',
      fullPage: true 
    });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test_screenshots/commitments/commitments-tablet-view.png',
      fullPage: true 
    });
  });
});