import { test, expect } from '@playwright/test';

test.describe('Project Homepage - Progress Reports and Photos', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display progress reports and recent photos sections', async ({ page }) => {
    // Click on the first project in the table
    await page.locator('table tbody tr').first().click();
    
    // Wait for the project homepage to load
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Check if Progress Reports section is visible
    const progressReportsSection = await page.locator('text=Progress Reports').first();
    await expect(progressReportsSection).toBeVisible();
    
    // Check if Recent Photos section is visible
    const recentPhotosSection = await page.locator('text=Recent Photos').first();
    await expect(recentPhotosSection).toBeVisible();
    
    // Verify Progress Reports content
    await expect(page.locator('text=Week 12 Progress Report')).toBeVisible();
    await expect(page.locator('text=February Monthly Report')).toBeVisible();
    await expect(page.locator('text=78% Complete')).toBeVisible();
    
    // Verify Recent Photos content
    const photoGrid = await page.locator('text=Recent Photos').locator('..').locator('..').locator('div.grid');
    const photos = await photoGrid.locator('> div');
    await expect(photos).toHaveCount(6);
    
    // Test photo titles are visible
    await expect(page.locator('text=Foundation Pour - West Wing')).toBeVisible();
    await expect(page.locator('text=Steel Frame Installation')).toBeVisible();
    
    // Test Create Report button
    const createReportButton = await page.locator('button:has-text("Create Report")');
    await expect(createReportButton).toBeVisible();
    
    // Test Upload Photos button
    const uploadPhotosButton = await page.locator('button:has-text("Upload Photos")');
    await expect(uploadPhotosButton).toBeVisible();
    
    // Test clicking on a photo to open dialog
    await page.locator('text=Foundation Pour - West Wing').click();
    await page.waitForTimeout(500); // Wait for dialog animation
    
    // Check if dialog opened with full image
    const dialog = await page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('text=Date Taken')).toBeVisible();
    await expect(dialog.locator('text=Uploaded By')).toBeVisible();
    
    // Close dialog
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Test view all links
    await expect(page.locator('text=View all reports →')).toBeVisible();
    await expect(page.locator('text=View all photos →')).toBeVisible();
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'frontend/tests/screenshots/project-homepage-with-progress.png',
      fullPage: true 
    });
  });

  test('should collapse and expand sections', async ({ page }) => {
    // Navigate to project homepage
    await page.locator('table tbody tr').first().click();
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Find the Progress Reports section button
    const progressReportsButton = await page.locator('button:has-text("Progress Reports")').first();
    
    // Verify section is initially open (defaultOpen={true})
    const progressContent = await page.locator('text=Week 12 Progress Report');
    await expect(progressContent).toBeVisible();
    
    // Click to collapse
    await progressReportsButton.click();
    await page.waitForTimeout(300);
    
    // Verify content is hidden
    await expect(progressContent).not.toBeVisible();
    
    // Click to expand again
    await progressReportsButton.click();
    await page.waitForTimeout(300);
    
    // Verify content is visible again
    await expect(progressContent).toBeVisible();
  });

  test('should display correct mock data in progress reports', async ({ page }) => {
    // Navigate to project homepage
    await page.locator('table tbody tr').first().click();
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Check progress report details
    const weeklyReport = await page.locator('text=Week 12 Progress Report').locator('..');
    await expect(weeklyReport.locator('text=weekly')).toBeVisible();
    await expect(weeklyReport.locator('text=published')).toBeVisible();
    await expect(weeklyReport.locator('text=by John Smith')).toBeVisible();
    
    // Check key highlights
    await expect(page.locator('text=Foundation work completed')).toBeVisible();
    await expect(page.locator('text=Steel structure 60% complete')).toBeVisible();
  });

  test('should display photo grid with correct layout', async ({ page }) => {
    // Navigate to project homepage
    await page.locator('table tbody tr').first().click();
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Check photo grid layout
    const photoGrid = await page.locator('text=Recent Photos').locator('..').locator('..').locator('div.grid');
    
    // Verify grid classes
    const gridClasses = await photoGrid.getAttribute('class');
    expect(gridClasses).toContain('grid-cols-2');
    expect(gridClasses).toContain('md:grid-cols-3');
    
    // Check photo metadata
    const firstPhoto = await photoGrid.locator('> div').first();
    await expect(firstPhoto.locator('text=Mar 18')).toBeVisible();
    await expect(firstPhoto.locator('text=John Smith')).toBeVisible();
    await expect(firstPhoto.locator('text=West Wing - Grid A-5')).toBeVisible();
  });
});