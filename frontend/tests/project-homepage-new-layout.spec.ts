import { test, expect } from '@playwright/test';

test.describe('Project Homepage - New Layout', () => {
  test('should display the new layout correctly', async ({ page }) => {
    // Navigate to a specific project homepage
    await page.goto('/60/home');
    
    // Wait for page to load
    await page.waitForSelector('h1.text-orange-600');
    
    // Check the main title
    const title = await page.textContent('h1');
    expect(title).toBe('Westfield Collective 24-115');
    
    // Check Overview card is present
    const overviewCard = page.locator('text=OVERVIEW').first();
    await expect(overviewCard).toBeVisible();
    
    // Check Overview card content
    await expect(page.locator('text=Client: Collective Group')).toBeVisible();
    await expect(page.locator('text=Status: Current')).toBeVisible();
    await expect(page.locator('text=Start Date: July 1, 2025')).toBeVisible();
    
    // Check Project Team card
    const teamCard = page.locator('text=PROJECT TEAM').first();
    await expect(teamCard).toBeVisible();
    await expect(page.locator('text=Owner: Jesse Dawsin')).toBeVisible();
    await expect(page.locator('text=PM: Kevin Smith')).toBeVisible();
    
    // Check Financials card
    const financialsCard = page.locator('text=FINANCIALS').first();
    await expect(financialsCard).toBeVisible();
    await expect(page.locator('text=Est Revenue: $4.2 million')).toBeVisible();
    
    // Check left column sections
    await expect(page.locator('h2:has-text("Summary")')).toBeVisible();
    await expect(page.locator('h2:has-text("Project Insights:")')).toBeVisible();
    await expect(page.locator('h2:has-text("Open RFI\'s")')).toBeVisible();
    
    // Check Tasks section
    await expect(page.locator('h2:has-text("Tasks")')).toBeVisible();
    const taskItems = page.locator('text=Task title here');
    await expect(taskItems).toHaveCount(4);
    
    // Check tabs are present
    await expect(page.locator('button:has-text("Meetings")')).toBeVisible();
    await expect(page.locator('button:has-text("Insights")')).toBeVisible();
    await expect(page.locator('button:has-text("Files")')).toBeVisible();
    
    // Check meetings table
    await expect(page.locator('th:has-text("Title")')).toBeVisible();
    await expect(page.locator('th:has-text("Summary")')).toBeVisible();
    await expect(page.locator('th:has-text("Category")')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/project-homepage-new-layout.png', fullPage: true });
  });
  
  test('should switch between tabs', async ({ page }) => {
    await page.goto('/60/home');
    await page.waitForSelector('h1.text-orange-600');
    
    // Click on Insights tab
    await page.click('button:has-text("Insights")');
    await expect(page.locator('text=Insights content goes here')).toBeVisible();
    
    // Click on Files tab
    await page.click('button:has-text("Files")');
    await expect(page.locator('text=Files content goes here')).toBeVisible();
    
    // Go back to Meetings tab
    await page.click('button:has-text("Meetings")');
    await expect(page.locator('th:has-text("Title")')).toBeVisible();
  });
});