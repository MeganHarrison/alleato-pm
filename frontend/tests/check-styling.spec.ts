import { test, expect } from '@playwright/test';

test('check meetings page', async ({ page }) => {
  // Go to the meetings page
  await page.goto('http://localhost:3003/procore/meetings');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take a screenshot
  await page.screenshot({ path: 'tests/test-results/meetings-page.png', fullPage: true });

  // Check for error messages
  const errorText = await page.locator('body').textContent();
  console.log('Has "TypeError":', errorText?.includes('TypeError') || false);
  console.log('Has "Cannot read":', errorText?.includes('Cannot read') || false);
});
