import { test, expect } from '@playwright/test';

test.describe('Project Homepage Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display comprehensive dashboard layout', async ({ page }) => {
    // Click on the first project
    await page.locator('table tbody tr').first().click();
    
    // Wait for project homepage to load
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Verify key stats cards are visible
    await expect(page.locator('text=Contract Value')).toBeVisible();
    await expect(page.locator('text=Budget Status')).toBeVisible();
    await expect(page.locator('text=Change Orders')).toBeVisible();
    await expect(page.locator('text=Open RFIs')).toBeVisible();
    await expect(page.locator('text=Schedule Status')).toBeVisible();
    await expect(page.locator('text=Active Commitments')).toBeVisible();
    
    // Verify recent activity feed
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Latest updates across all project areas')).toBeVisible();
    
    // Verify project tools navigation grid
    await expect(page.locator('text=Project Tools')).toBeVisible();
    const toolsGrid = await page.locator('text=Project Tools').locator('..').locator('..').locator('.grid');
    const tools = await toolsGrid.locator('> a');
    await expect(tools).toHaveCount(10);
    
    // Verify tabbed content area
    await expect(page.locator('text=Progress Reports')).toBeVisible();
    
    // Click on Photos tab
    await page.click('text=Recent Photos');
    await page.waitForTimeout(300);
    
    // Verify photos are visible
    await expect(page.locator('text=Foundation Pour - West Wing')).toBeVisible();
    
    // Click on Meetings tab
    await page.click('text=Meetings');
    await page.waitForTimeout(300);
    
    // Verify project details card
    await expect(page.locator('text=Project Details')).toBeVisible();
    await expect(page.locator('text=Start Date')).toBeVisible();
    await expect(page.locator('text=Est. Completion')).toBeVisible();
    
    // Verify key contacts
    await expect(page.locator('text=Key Contacts')).toBeVisible();
    await expect(page.locator('text=ABC Development Corp')).toBeVisible();
    
    // Take full screenshot of redesigned homepage
    await page.screenshot({ 
      path: 'frontend/tests/screenshots/project-homepage-redesigned.png',
      fullPage: true 
    });
    
    // Test clicking on a stat card
    await page.click('text=Budget Status');
    await expect(page.url()).toContain('/budget');
    
    // Go back to test project tools
    await page.goBack();
    await page.click('text=Commitments').first();
    await expect(page.url()).toContain('/commitments');
  });

  test('should not have collapsible sections hiding content', async ({ page }) => {
    await page.locator('table tbody tr').first().click();
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Check that there are no collapse/expand buttons (chevron icons in buttons)
    const collapsibleButtons = await page.locator('button:has(svg[viewBox="0 0 24 24"]:has(path[d="M9 5l7 7-7 7"]))');
    const count = await collapsibleButtons.count();
    
    // Should have zero or very few collapsible sections
    expect(count).toBeLessThanOrEqual(1); // Allow for maybe one collapsible section
    
    // All important content should be immediately visible
    await expect(page.locator('text=Contract Value')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Project Tools')).toBeVisible();
    await expect(page.locator('text=Key Contacts')).toBeVisible();
  });

  test('should have quick actions readily available', async ({ page }) => {
    await page.locator('table tbody tr').first().click();
    await page.waitForURL(/\/\d+\/home/);
    await page.waitForLoadState('networkidle');
    
    // Quick actions should be in the header
    await expect(page.locator('button:has-text("Create RFI")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Daily Log")')).toBeVisible();
    await expect(page.locator('button:has-text("Upload Document")')).toBeVisible();
    
    // Test clicking a quick action
    await page.click('button:has-text("Create RFI")');
    await expect(page.url()).toContain('/rfis/new');
  });
});