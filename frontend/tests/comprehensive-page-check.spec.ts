import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home (Projects)', url: 'http://localhost:3003' },
  { name: 'Dashboard', url: 'http://localhost:3003/dashboard' },
  { name: 'Meetings', url: 'http://localhost:3003/meetings' },
  { name: 'RFIs', url: 'http://localhost:3003/rfis' },
  { name: 'Submittals', url: 'http://localhost:3003/submittals' },
  { name: 'Change Orders', url: 'http://localhost:3003/change-orders' },
  { name: 'Punch List', url: 'http://localhost:3003/punch-list' },
  { name: 'Daily Log', url: 'http://localhost:3003/daily-log' },
  { name: 'Directory', url: 'http://localhost:3003/directory/users' },
  { name: 'Budget', url: 'http://localhost:3003/budget' },
  { name: 'Commitments', url: 'http://localhost:3003/commitments' },
  { name: 'Invoices', url: 'http://localhost:3003/invoices' },
];

for (const page of pages) {
  test(`check ${page.name} page`, async ({ page: browser }) => {
    console.log(`\n========== Testing ${page.name} ==========`);

    // Navigate to page
    await browser.goto(page.url, { waitUntil: 'domcontentloaded', timeout: 10000 });

    // Wait a bit for content to load
    await browser.waitForTimeout(2000);

    // Take screenshot
    const screenshotPath = `tests/test-results/${page.name.toLowerCase().replace(/[\s()]+/g, '-')}.png`;
    await browser.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);

    // Get page content
    const bodyText = await browser.locator('body').textContent();

    // Check for errors
    const hasTypeError = bodyText?.includes('TypeError') || false;
    const hasCannotRead = bodyText?.includes('Cannot read') || false;
    const hasUndefined = bodyText?.includes('undefined') && bodyText?.includes('error') || false;
    const has404 = bodyText?.includes('404') || false;
    const has500 = bodyText?.includes('500') || false;
    const hasError = bodyText?.toLowerCase().includes('error occurred') || false;

    console.log(`Has "TypeError": ${hasTypeError}`);
    console.log(`Has "Cannot read": ${hasCannotRead}`);
    console.log(`Has undefined error: ${hasUndefined}`);
    console.log(`Has 404: ${has404}`);
    console.log(`Has 500: ${has500}`);
    console.log(`Has error message: ${hasError}`);

    // Check if page title is present (basic sanity check)
    const title = await browser.title();
    console.log(`Page title: ${title}`);

    // Look for common UI elements to verify page loaded
    const hasSidebar = await browser.locator('[class*="sidebar"]').count() > 0;
    const hasHeader = await browser.locator('header').count() > 0;
    console.log(`Has sidebar: ${hasSidebar}`);
    console.log(`Has header: ${hasHeader}`);

    // Report any critical errors
    if (hasTypeError || hasCannotRead || has500) {
      console.log(`⚠️  CRITICAL ERROR DETECTED on ${page.name} page`);
    } else if (has404) {
      console.log(`⚠️  404 ERROR on ${page.name} page`);
    } else {
      console.log(`✓ ${page.name} page appears to be working`);
    }
  });
}
