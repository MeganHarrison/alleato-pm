import { test, expect } from '@playwright/test';

test('basic homepage check', async ({ page }) => {
  // Navigate directly without auth
  await page.goto('http://localhost:3003/1/home');
  
  // Wait a bit for page to load
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'frontend/tests/screenshots/homepage-check.png',
    fullPage: true 
  });
  
  // Check if test text is visible
  const testText = await page.textContent('body');
  console.log('Page content:', testText);
  
  // Check for specific test elements
  const hasTestVersion = testText?.includes('Test Version');
  const hasProjectId = testText?.includes('Project ID');
  
  console.log('Has test version text:', hasTestVersion);
  console.log('Has project ID text:', hasProjectId);
});