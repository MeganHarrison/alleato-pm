import { chromium } from 'playwright';

async function testMeetingsPage() {
  console.log('🚀 Testing Meetings Page...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('📄 Navigating to meetings page...');
    await page.goto('http://localhost:3000/meetings', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check for page title
    const title = await page.title();
    console.log(`📝 Page title: ${title}`);

    // Check for main heading
    const heading = await page.locator('h1').textContent().catch(() => null);
    console.log(`📋 Main heading: ${heading}`);

    // Check for table
    const tableExists = await page.locator('table').count();
    console.log(`📊 Table found: ${tableExists > 0 ? 'Yes' : 'No'}`);

    // Check for empty state message (since there's no data)
    const emptyStateText = await page.locator('text=No meetings found').isVisible().catch(() => false);
    console.log(`📭 Empty state visible: ${emptyStateText}`);

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/meetings-page.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved: tests/screenshots/meetings-page.png');

    // Check for errors
    const hasError = await page.locator('text=/Application error|Unhandled/i').first().isVisible().catch(() => false);

    if (hasError) {
      console.log('\n❌ FAIL: Error detected on page');
      await page.waitForTimeout(10000);
      await browser.close();
      process.exit(1);
    } else if (tableExists > 0) {
      console.log('\n✅ SUCCESS: Meetings page loaded with table view!');
      console.log('⏸️  Browser will remain open for 10 seconds for inspection...');
      await page.waitForTimeout(10000);
      await browser.close();
      process.exit(0);
    } else {
      console.log('\n❌ FAIL: No table found on page');
      await page.waitForTimeout(10000);
      await browser.close();
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    await browser.close();
    process.exit(1);
  }
}

testMeetingsPage();
