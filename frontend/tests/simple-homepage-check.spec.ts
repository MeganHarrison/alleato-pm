import { test, expect } from '@playwright/test';

test.use({
  storageState: { cookies: [], origins: [] }, // Bypass auth
});

test('Check new homepage layout', async ({ page }) => {
  // Navigate directly to the project homepage
  await page.goto('http://localhost:3000/60/home', { waitUntil: 'domcontentloaded' });
  
  // Wait a moment for page to render
  await page.waitForTimeout(2000);
  
  // Take a screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/new-homepage-layout.png', 
    fullPage: true 
  });
  
  // Check if the title is visible
  const titleVisible = await page.locator('h1').isVisible();
  console.log('Title visible:', titleVisible);
  
  if (titleVisible) {
    const titleText = await page.locator('h1').textContent();
    console.log('Title text:', titleText);
  }
});