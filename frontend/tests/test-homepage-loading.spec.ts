import { test, expect } from '@playwright/test';

test.describe('Homepage Loading Test', () => {
  test('should load portfolio page', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of current state
    await page.screenshot({ 
      path: 'frontend/tests/screenshots/current-homepage.png',
      fullPage: true 
    });
    
    // Check if portfolio elements are visible
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Check for any errors in console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // Try to find any visible text
    const bodyText = await page.textContent('body');
    console.log('Page contains text:', bodyText?.substring(0, 200));
  });

  test('should navigate to project homepage', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.waitForLoadState('networkidle');
    
    // Try clicking on first project if table exists
    const projectRow = page.locator('table tbody tr').first();
    const rowCount = await projectRow.count();
    
    if (rowCount > 0) {
      console.log('Found project row, clicking...');
      await projectRow.click();
      
      // Wait for navigation
      await page.waitForTimeout(3000);
      
      // Take screenshot of project homepage
      await page.screenshot({ 
        path: 'frontend/tests/screenshots/project-homepage-current.png',
        fullPage: true 
      });
      
      // Log current URL
      console.log('Current URL:', page.url());
      
      // Check for any content
      const content = await page.textContent('body');
      console.log('Project page content:', content?.substring(0, 200));
    } else {
      console.log('No project rows found');
    }
  });
});