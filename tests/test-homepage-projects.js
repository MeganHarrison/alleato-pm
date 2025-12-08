import { chromium } from 'playwright';

async function testHomepageProjects() {
  console.log('🚀 Testing Homepage Projects Display...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('📄 Navigating to homepage...');
    await page.goto('http://localhost:3000/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for loading to complete
    await page.waitForTimeout(3000);

    // Check for projects count text
    const projectsCountText = await page.locator('text=/\\d+ projects? found/').textContent().catch(() => null);
    console.log(`📊 Projects count: ${projectsCountText}`);

    // Try to find table rows
    const tableRows = await page.locator('table tbody tr').count();
    console.log(`📋 Table rows found: ${tableRows}`);

    // Check for "Loading projects..." text
    const isLoading = await page.locator('text=Loading projects...').isVisible().catch(() => false);
    console.log(`⏳ Loading state: ${isLoading ? 'Still loading' : 'Loaded'}`);

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/homepage-projects-test.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved: tests/screenshots/homepage-projects-test.png');

    // Check for errors
    const hasError = await page.locator('text=/error|failed/i').first().isVisible().catch(() => false);

    if (hasError) {
      console.log('❌ Error detected on page');
      const errorText = await page.locator('text=/error|failed/i').first().textContent();
      console.log(`   Error message: ${errorText}`);
    }

    // Final result
    if (tableRows > 0) {
      console.log(`\n✅ SUCCESS: ${tableRows} projects are displaying on homepage!`);
      console.log('⏸️  Browser will remain open for 10 seconds for inspection...');
      await page.waitForTimeout(10000);
      await browser.close();
      process.exit(0);
    } else if (isLoading) {
      console.log('\n⚠️  Page is still loading... waiting longer');
      await page.waitForTimeout(5000);
      const rowsAfterWait = await page.locator('table tbody tr').count();
      if (rowsAfterWait > 0) {
        console.log(`✅ SUCCESS: ${rowsAfterWait} projects loaded after waiting!`);
        await page.waitForTimeout(10000);
        await browser.close();
        process.exit(0);
      } else {
        console.log('❌ FAIL: No projects loaded even after waiting');
        await page.waitForTimeout(10000);
        await browser.close();
        process.exit(1);
      }
    } else {
      console.log('\n❌ FAIL: No projects found on homepage');
      console.log('⏸️  Browser will remain open for 10 seconds for debugging...');
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

testHomepageProjects();
