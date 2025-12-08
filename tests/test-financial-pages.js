import { chromium } from 'playwright';

async function testFinancialPages() {
  console.log('🚀 Starting financial pages test...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  const results = {
    passed: [],
    failed: []
  };

  // Test pages
  const pagesToTest = [
    { name: 'Portfolio/Home', url: '/' },
    { name: 'Budget', url: '/budget' },
    { name: 'Commitments', url: '/commitments' },
    { name: 'Contracts', url: '/contracts' },
    { name: 'New Commitment', url: '/commitments/new' }
  ];

  for (const testPage of pagesToTest) {
    try {
      console.log(`\n📄 Testing: ${testPage.name}`);
      console.log(`   URL: ${testPage.url}`);

      await page.goto(`${baseUrl}${testPage.url}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for page to load
      await page.waitForTimeout(2000);

      // Check for React/Next.js errors (not user-facing error messages)
      const errorTexts = [
        'Application error',
        'Unhandled Runtime Error',
        'not found',
        '404',
        'undefined is not',
        'ReferenceError',
        'TypeError'
      ];

      let hasError = false;
      for (const errorText of errorTexts) {
        const errorElement = await page.locator(`text=${errorText}`).first();
        if (await errorElement.isVisible().catch(() => false)) {
          console.log(`   ❌ Found error: "${errorText}"`);
          hasError = true;
          break;
        }
      }

      // Take screenshot
      const screenshotPath = `tests/screenshots/${testPage.name.replace(/\//g, '-')}.png`;
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      console.log(`   📸 Screenshot saved: ${screenshotPath}`);

      // Check page title
      const title = await page.title();
      console.log(`   📝 Page title: ${title}`);

      // Check for main content
      const body = await page.locator('body').textContent();
      const hasContent = body.length > 100;

      if (!hasError && hasContent) {
        console.log(`   ✅ Page loaded successfully`);
        results.passed.push(testPage.name);
      } else {
        console.log(`   ❌ Page has issues`);
        results.failed.push(testPage.name);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.failed.push(testPage.name);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}/${pagesToTest.length}`);
  if (results.passed.length > 0) {
    results.passed.forEach(name => console.log(`   - ${name}`));
  }

  if (results.failed.length > 0) {
    console.log(`\n❌ Failed: ${results.failed.length}/${pagesToTest.length}`);
    results.failed.forEach(name => console.log(`   - ${name}`));
  }
  console.log('='.repeat(60) + '\n');

  console.log('⏸️  Browser will remain open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  await browser.close();

  return results.failed.length === 0;
}

// Run the test
testFinancialPages()
  .then(success => {
    if (success) {
      console.log('🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('💥 Some tests failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
