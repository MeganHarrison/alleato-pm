import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Configure visual regression settings
test.use({
  // Threshold for pixel differences (0-1, where 0 is identical)
  // Using 0.2 (20%) to allow for minor rendering differences
  threshold: 0.2,
  
  // Maximum allowed pixel difference
  maxDiffPixels: 100,
  
  // Animation handling
  animations: 'disabled',
  
  // Consistent viewport
  viewport: { width: 1280, height: 720 }
});

test.describe('Visual Regression Tests', () => {
  const screenshotDir = 'tests/screenshots/baseline';
  const diffDir = 'tests/screenshots/diff';
  
  test.beforeAll(async () => {
    // Create directories if they don't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    if (!fs.existsSync(diffDir)) {
      fs.mkdirSync(diffDir, { recursive: true });
    }
  });
  
  test.beforeEach(async ({ page }) => {
    // Mock auth for all tests
    await page.goto('/mock-login?redirect=/');
    await page.waitForTimeout(500);
  });
  
  test('home page visual regression', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      mask: [
        // Mask dynamic content like timestamps
        page.locator('[data-testid="timestamp"]'),
        page.locator('.date-time'),
      ],
    });
  });
  
  test('projects page visual regression', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('projects-page.png', {
      fullPage: true,
      mask: [
        // Mask any dynamic dates or IDs
        page.locator('[data-testid="last-updated"]'),
        page.locator('.project-id'),
      ],
    });
  });
  
  test('commitments page visual regression', async ({ page }) => {
    await page.goto('/commitments');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('commitments-page.png', {
      fullPage: true,
      mask: [
        // Mask dynamic financial values that might change
        page.locator('.currency-amount'),
        page.locator('[data-testid="total-value"]'),
      ],
    });
  });
  
  test('chat interface visual regression', async ({ page }) => {
    await page.goto('/chat-rag');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('chat-interface.png', {
      fullPage: true,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 720
      }
    });
  });
  
  test('forms visual regression', async ({ page }) => {
    const forms = [
      { path: '/commitments/new', name: 'new-commitment-form' },
      { path: '/contracts/new', name: 'new-contract-form' },
      { path: '/invoices/new', name: 'new-invoice-form' }
    ];
    
    for (const form of forms) {
      await page.goto(form.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot(`${form.name}.png`, {
        fullPage: true,
        mask: [
          // Mask form field placeholders that might have dates
          page.locator('input[type="date"]'),
          page.locator('[placeholder*="date"]'),
        ],
      });
    }
  });
  
  test('responsive visual regression', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`, {
        fullPage: false, // Use viewport size for responsive tests
      });
    }
  });
  
  test('component-level visual regression', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    // Test specific components
    const sidebar = page.locator('aside, [data-testid="sidebar"]').first();
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot('sidebar-component.png');
    }
    
    const table = page.locator('table, [role="table"]').first();
    if (await table.isVisible()) {
      await expect(table).toHaveScreenshot('table-component.png');
    }
    
    const header = page.locator('header, [data-testid="header"]').first();
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('header-component.png');
    }
  });
});

test.describe('Visual Regression with Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mock-login?redirect=/');
    await page.waitForTimeout(500);
  });
  
  test('dropdown menu visual states', async ({ page }) => {
    await page.goto('/commitments');
    await page.waitForLoadState('networkidle');
    
    // Find and click dropdown button
    const createButton = page.locator('button:has-text("Create")').first();
    if (await createButton.isVisible()) {
      // Capture closed state
      await expect(page).toHaveScreenshot('dropdown-closed.png', {
        clip: await createButton.boundingBox() || undefined,
        // Expand clip to include dropdown area
        fullPage: false,
      });
      
      // Open dropdown
      await createButton.click();
      await page.waitForTimeout(300);
      
      // Capture open state
      const dropdownArea = page.locator('[role="menu"], [data-testid="dropdown-menu"]').first();
      if (await dropdownArea.isVisible()) {
        const boundingBox = await dropdownArea.boundingBox();
        if (boundingBox) {
          await expect(page).toHaveScreenshot('dropdown-open.png', {
            clip: {
              x: boundingBox.x - 10,
              y: boundingBox.y - 10,
              width: boundingBox.width + 20,
              height: boundingBox.height + 20
            }
          });
        }
      }
    }
  });
  
  test('modal dialog visual states', async ({ page }) => {
    await page.goto('/commitments/new');
    await page.waitForLoadState('networkidle');
    
    // Look for a button that opens a modal
    const selectButton = page.locator('button:has-text("Select"), button:has-text("Choose")').first();
    if (await selectButton.isVisible()) {
      await selectButton.click();
      await page.waitForTimeout(500);
      
      // Capture modal if visible
      const modal = page.locator('[role="dialog"], [data-testid="modal"]').first();
      if (await modal.isVisible()) {
        await expect(page).toHaveScreenshot('modal-open.png', {
          fullPage: true,
          mask: [
            // Mask backdrop to focus on modal content
            page.locator('.modal-backdrop, [data-testid="backdrop"]'),
          ],
        });
      }
    }
  });
});

test.describe('Visual Regression Report', () => {
  test.afterAll(async () => {
    // Generate a simple HTML report of visual changes
    const reportPath = path.join('tests', 'visual-regression-report.html');
    const report = `
<!DOCTYPE html>
<html>
<head>
  <title>Visual Regression Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; }
    .pass { background-color: #e7f5e7; }
    .fail { background-color: #ffe7e7; }
    img { max-width: 300px; margin: 10px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>Visual Regression Test Report</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  <div id="results">
    <!-- Results will be populated by test runner -->
  </div>
</body>
</html>`;
    
    fs.writeFileSync(reportPath, report);
    console.log(`Visual regression report saved to ${reportPath}`);
  });
});