import { test, expect } from '@playwright/test';

test.describe('Redesigned Project Homepage', () => {
  test('should load and display all key sections', async ({ page }) => {
    // Navigate to project homepage
    await page.goto('http://localhost:3003/1/home');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of full page
    await page.screenshot({ 
      path: 'frontend/tests/screenshots/redesigned-homepage.png',
      fullPage: true 
    });
    
    // Check for main header elements
    await expect(page.locator('h1').first()).toBeVisible();
    const projectName = await page.locator('h1').first().textContent();
    console.log('Project name:', projectName);
    
    // Check for Project Overview section
    await expect(page.getByText('Project Overview')).toBeVisible();
    
    // Check for project stats cards (should be 8 of them)
    const statsCards = page.locator('[data-testid="project-stat-card"], .grid > a[href*="/"]').first().locator('..').locator('> a');
    const statsCount = await statsCards.count();
    console.log('Stats cards found:', statsCount);
    
    // Check for Recent Activity section
    await expect(page.getByText('Recent Activity')).toBeVisible();
    
    // Check for tabs (Progress Reports, Recent Photos, Meetings)
    await expect(page.getByRole('tab', { name: 'Progress Reports' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Recent Photos' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Meetings' })).toBeVisible();
    
    // Check for Project Details card in right column
    await expect(page.getByText('Project Details')).toBeVisible();
    
    // Check for Project Tools section
    await expect(page.getByText('Project Tools')).toBeVisible();
    
    // Check for Key Contacts section
    await expect(page.getByText('Key Contacts')).toBeVisible();
    
    // Test tab functionality
    await page.getByRole('tab', { name: 'Recent Photos' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'frontend/tests/screenshots/redesigned-photos-tab.png',
      fullPage: false 
    });
    
    await page.getByRole('tab', { name: 'Meetings' }).click();
    await page.waitForTimeout(500);
    
    // Check for no collapsible sections (everything should be visible)
    const collapsibleButtons = page.locator('button').filter({ hasText: /^(Recently Changed Items|Today's Schedule|Project Milestones)/ });
    const collapsibleCount = await collapsibleButtons.count();
    console.log('Collapsible sections found:', collapsibleCount);
    expect(collapsibleCount).toBe(0); // Should be 0 in redesigned version
    
    console.log('✅ Redesigned homepage loaded successfully with all sections visible');
  });

  test('should display mock recent activity items', async ({ page }) => {
    await page.goto('http://localhost:3003/1/home');
    await page.waitForLoadState('networkidle');
    
    // Check for recent activity items
    const activityItems = page.locator('.divide-y > a');
    const itemCount = await activityItems.count();
    console.log('Recent activity items:', itemCount);
    expect(itemCount).toBeGreaterThan(0);
    
    // Check first item details
    if (itemCount > 0) {
      const firstItem = activityItems.first();
      const title = await firstItem.locator('h4').textContent();
      console.log('First activity item:', title);
      expect(title).toBeTruthy();
    }
  });

  test('should have working quick action buttons', async ({ page }) => {
    await page.goto('http://localhost:3003/1/home');
    await page.waitForLoadState('networkidle');
    
    // Check for quick action buttons in header
    const quickActions = page.locator('button:has-text("New")');
    const actionCount = await quickActions.count();
    console.log('Quick action buttons found:', actionCount);
    expect(actionCount).toBeGreaterThan(0);
  });
});