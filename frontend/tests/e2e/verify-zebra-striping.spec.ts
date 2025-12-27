import { test, expect } from '@playwright/test';

test('verify zebra striping on budget table', async ({ page }) => {
  // Navigate to budget page
  await page.goto('http://localhost:3000/67/budget');
  
  // Wait for table to load
  await page.waitForSelector('table tbody tr', { timeout: 10000 });
  
  // Take screenshot
  await page.screenshot({ 
    path: '/tmp/budget_zebra_striping.png',
    fullPage: true
  });
  
  // Get some info about the rows
  const rows = await page.locator('table tbody tr').count();
  console.log(`Found ${rows} rows in table`);
  
  // Check a few rows for background color
  const firstRow = page.locator('table tbody tr').nth(0);
  const secondRow = page.locator('table tbody tr').nth(1);
  const thirdRow = page.locator('table tbody tr').nth(2);
  
  const firstRowBg = await firstRow.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const secondRowBg = await secondRow.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const thirdRowBg = await thirdRow.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  
  console.log(`First row (odd) background: ${firstRowBg}`);
  console.log(`Second row (even) background: ${secondRowBg}`);
  console.log(`Third row (odd) background: ${thirdRowBg}`);
  
  // Verify odd rows have background, even rows don't
  expect(firstRowBg).not.toBe(secondRowBg);
  expect(firstRowBg).toBe(thirdRowBg);
});
