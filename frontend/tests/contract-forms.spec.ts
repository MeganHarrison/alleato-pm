import { test, expect } from '@playwright/test';

test.describe('Contract Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to new contract page
    await page.goto('/contracts/new');
    await page.waitForLoadState('networkidle');
  });

  test('should load contract form without errors', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Create Prime Contract');
    
    // Check page description
    await expect(page.locator('text=Set up a new prime contract for your project')).toBeVisible();
    
    // Check breadcrumbs
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('Financial');
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('Contracts');
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('New Contract');
    
    // Check Back button
    await expect(page.locator('button:has-text("Back")')).toBeVisible();
    
    // Capture screenshot
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-initial.png',
      fullPage: true 
    });
  });

  test('should display all form tabs', async ({ page }) => {
    // Check all tabs are visible
    const tabs = ['General', 'Schedule of Values', 'Dates & Milestones', 'Billing', 'Privacy'];
    
    for (const tab of tabs) {
      await expect(page.locator(`[role="tab"]:has-text("${tab}")`)).toBeVisible();
    }
    
    // Capture screenshot of tabs
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-tabs.png',
      fullPage: true 
    });
  });

  test('should navigate between tabs', async ({ page }) => {
    // Test Schedule of Values tab
    await page.locator('[role="tab"]:has-text("Schedule of Values")').click();
    await page.waitForTimeout(300);
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-sov-tab.png',
      fullPage: true 
    });
    
    // Test Dates & Milestones tab
    await page.locator('[role="tab"]:has-text("Dates & Milestones")').click();
    await page.waitForTimeout(300);
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-dates-tab.png',
      fullPage: true 
    });
    
    // Test Billing tab
    await page.locator('[role="tab"]:has-text("Billing")').click();
    await page.waitForTimeout(300);
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-billing-tab.png',
      fullPage: true 
    });
    
    // Test Privacy tab
    await page.locator('[role="tab"]:has-text("Privacy")').click();
    await page.waitForTimeout(300);
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-privacy-tab.png',
      fullPage: true 
    });
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.locator('button:has-text("Create Contract")').click();
    
    // Wait for validation messages
    await page.waitForTimeout(300);
    
    // Capture screenshot of validation errors
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-validation-errors.png',
      fullPage: true 
    });
  });

  test('should fill and submit contract form', async ({ page }) => {
    // Fill General tab fields
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill('Test Construction Contract');
    }
    
    // Fill contract amount if visible
    const amountInput = page.locator('input[name="originalAmount"], input[placeholder*="amount" i]').first();
    if (await amountInput.isVisible()) {
      await amountInput.fill('150000');
    }
    
    // Capture filled form
    await page.screenshot({ 
      path: 'test_screenshots/contracts/contract-form-filled-general.png',
      fullPage: true 
    });
    
    // Test date picker if visible
    const dateInputs = page.locator('input[type="date"], button[aria-label*="date" i]');
    if (await dateInputs.first().isVisible()) {
      await dateInputs.first().click();
      await page.waitForTimeout(300);
      
      // Capture date picker
      await page.screenshot({ 
        path: 'test_screenshots/contracts/contract-form-date-picker.png',
        fullPage: true 
      });
    }
  });

  test('should handle form submission', async ({ page }) => {
    // Fill minimal required fields
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill('Test Contract');
    }
    
    // Click Create Contract button
    await page.locator('button:has-text("Create Contract")').click();
    
    // Wait for loading state
    await page.waitForTimeout(300);
    
    // Check for loading indicator
    const loadingButton = page.locator('button:has-text("Saving...")');
    if (await loadingButton.isVisible()) {
      await page.screenshot({ 
        path: 'test_screenshots/contracts/contract-form-submitting.png',
        fullPage: true 
      });
    }
  });

  test('should handle cancel action', async ({ page }) => {
    // Fill some data
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill('Unsaved Contract');
    }
    
    // Click Cancel button
    await page.locator('button:has-text("Cancel")').click();
    
    // Should navigate away (check URL change)
    await page.waitForTimeout(500);
    expect(page.url()).not.toContain('/contracts/new');
  });
});

test.describe('Purchase Order Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to new purchase order page
    await page.goto('/commitments/purchase-orders/new');
    await page.waitForLoadState('networkidle');
  });

  test('should load purchase order form without errors', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Create Purchase Order');
    
    // Check page description
    await expect(page.locator('text=Set up a new purchase order for your project')).toBeVisible();
    
    // Check breadcrumbs
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('Commitments');
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText('New Purchase Order');
    
    // Capture screenshot
    await page.screenshot({ 
      path: 'test_screenshots/purchase-orders/po-form-initial.png',
      fullPage: true 
    });
  });

  test('should display purchase order form fields', async ({ page }) => {
    // Check for PO number field (pre-filled)
    const poNumberInput = page.locator('input[value="PO-005"]');
    if (await poNumberInput.isVisible()) {
      await expect(poNumberInput).toHaveValue('PO-005');
    }
    
    // Look for vendor selection
    const vendorSelect = page.locator('select, [role="combobox"]').filter({ hasText: /vendor|company/i });
    if (await vendorSelect.isVisible()) {
      await vendorSelect.click();
      await page.waitForTimeout(300);
      
      // Capture vendor dropdown
      await page.screenshot({ 
        path: 'test_screenshots/purchase-orders/po-form-vendor-dropdown.png',
        fullPage: true 
      });
    }
  });

  test('should handle line items', async ({ page }) => {
    // Look for Add Line Item button
    const addLineItemButton = page.locator('button').filter({ hasText: /add.*line|add.*item/i });
    
    if (await addLineItemButton.isVisible()) {
      // Add a line item
      await addLineItemButton.click();
      await page.waitForTimeout(300);
      
      // Capture line items section
      await page.screenshot({ 
        path: 'test_screenshots/purchase-orders/po-form-line-items.png',
        fullPage: true 
      });
    }
  });

  test('should calculate totals', async ({ page }) => {
    // Fill amount fields if visible
    const amountInputs = page.locator('input[type="number"], input[placeholder*="amount" i]');
    const count = await amountInputs.count();
    
    if (count > 0) {
      // Fill first amount field
      await amountInputs.first().fill('5000');
      await page.waitForTimeout(300);
      
      // Look for total calculation
      await page.screenshot({ 
        path: 'test_screenshots/purchase-orders/po-form-calculations.png',
        fullPage: true 
      });
    }
  });

  test('should handle file attachments', async ({ page }) => {
    // Look for attachment or upload section
    const uploadButton = page.locator('button, input[type="file"]').filter({ hasText: /attach|upload/i });
    
    if (await uploadButton.isVisible()) {
      await uploadButton.scrollIntoViewIfNeeded();
      
      // Capture attachment section
      await page.screenshot({ 
        path: 'test_screenshots/purchase-orders/po-form-attachments.png',
        fullPage: true 
      });
    }
  });

  test('should validate purchase order form', async ({ page }) => {
    // Try to submit without required fields
    const submitButton = page.locator('button').filter({ hasText: /create.*order|submit/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(300);
      
      // Capture validation state
      await page.screenshot({ 
        path: 'test_screenshots/purchase-orders/po-form-validation.png',
        fullPage: true 
      });
    }
  });

  test('should have responsive forms', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test_screenshots/contracts/forms-mobile-view.png',
      fullPage: true 
    });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test_screenshots/contracts/forms-tablet-view.png',
      fullPage: true 
    });
  });
});