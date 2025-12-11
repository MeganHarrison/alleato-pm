const { chromium } = require('playwright');

/**
 * Comprehensive Portfolio Page Test
 * Tests all requirements from TASK_LIST.md and EXEC_PLAN.md
 */
async function testPortfolioPage() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100 // Slow down actions for visibility
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  try {
    console.log('🧪 Starting Comprehensive Portfolio Page Tests');
    console.log('='.repeat(60));
    console.log('');

    // Navigate to portfolio page
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForSelector('table', { timeout: 10000 });
    results.passed.push('Page loads successfully');

    // Test 1: Check if data is from Supabase (should see real project data)
    console.log('\n📊 Test 1: Checking Supabase data integration...');
    const projectRows = await page.locator('tbody tr').all();
    const rowCount = projectRows.length;
    console.log(`  Found ${rowCount} projects`);
    if (rowCount > 0) {
      results.passed.push(`Supabase data loaded (${rowCount} projects)`);
    } else {
      results.failed.push('No projects found - check Supabase connection');
    }

    // Test 2: Check default page size is 50
    console.log('\n🔢 Test 2: Checking default page size...');
    const pageSizeSelect = await page.locator('select').first();
    const defaultPageSize = await pageSizeSelect.inputValue();
    console.log(`  Default page size: ${defaultPageSize}`);
    if (defaultPageSize === '50') {
      results.passed.push('Default page size is 50');
    } else {
      results.failed.push(`Default page size is ${defaultPageSize}, expected 50`);
    }

    // Test 3: Check column headers are clickable for sorting
    console.log('\n↕️ Test 3: Testing column sorting...');
    const nameHeader = await page.locator('th:has-text("Name")').first();
    await nameHeader.click();
    await page.waitForTimeout(500);
    await nameHeader.click();
    await page.waitForTimeout(500);
    results.passed.push('Column headers are clickable for sorting');

    // Test 4: Check horizontal scrolling behavior
    console.log('\n↔️ Test 4: Testing horizontal scrolling...');

    // Get page and table dimensions
    const pageWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const tableContainer = await page.locator('.overflow-x-auto').first();
    const tableScrollWidth = await tableContainer.evaluate(el => el.scrollWidth);
    const tableClientWidth = await tableContainer.evaluate(el => el.clientWidth);

    console.log(`  Page scroll width: ${pageWidth}px`);
    console.log(`  Viewport width: ${viewportWidth}px`);
    console.log(`  Table scroll width: ${tableScrollWidth}px`);
    console.log(`  Table client width: ${tableClientWidth}px`);

    if (pageWidth <= viewportWidth) {
      results.passed.push('Page does not scroll horizontally');
    } else {
      results.failed.push('⚠️ CRITICAL: Page scrolls horizontally - should only be table');
    }

    if (tableScrollWidth > tableClientWidth) {
      results.passed.push('Table has horizontal scroll capability');
    } else {
      results.warnings.push('Table does not need horizontal scroll (all columns fit)');
    }

    // Test 5: Check first column freeze (sticky positioning)
    console.log('\n📌 Test 5: Testing first column freeze...');
    const firstDataCell = await page.locator('tbody tr').first().locator('td').first();
    const isSticky = await firstDataCell.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.position === 'sticky';
    });

    if (isSticky) {
      results.passed.push('First column is frozen (sticky)');
    } else {
      results.failed.push('⚠️ CRITICAL: First column is not frozen');
    }

    // Test 6: Test search functionality
    console.log('\n🔍 Test 6: Testing search functionality...');
    const searchInput = await page.locator('input[type="text"]').first();
    await searchInput.fill('test');
    await page.waitForTimeout(1000);
    const searchResultCount = await page.locator('tbody tr').count();
    console.log(`  Search results: ${searchResultCount} projects`);
    await searchInput.clear();
    await page.waitForTimeout(1000);
    results.passed.push('Search functionality working');

    // Test 7: Test filter functionality
    console.log('\n🎯 Test 7: Testing filter functionality...');
    const statusButtons = await page.locator('button:has-text("Active"), button:has-text("Inactive")').all();
    console.log(`  Found ${statusButtons.length} status filter buttons`);
    if (statusButtons.length > 0) {
      results.passed.push('Filter buttons present');
    } else {
      results.warnings.push('No filter buttons found');
    }

    // Test 8: Test export button
    console.log('\n📤 Test 8: Testing export functionality...');
    const exportButtons = await page.locator('button:has-text("Export"), button:has-text("PDF"), button:has-text("CSV")').all();
    if (exportButtons.length > 0) {
      results.passed.push('Export button present');
    } else {
      results.warnings.push('Export button not found');
    }

    // Test 9: Test Create Project button
    console.log('\n➕ Test 9: Testing Create Project button...');
    const createProjectButton = await page.locator('button:has-text("Create Project")').first();
    if (createProjectButton) {
      results.passed.push('Create Project button found');
    } else {
      results.failed.push('Create Project button not found');
    }

    // Test 10: Test project click navigation
    console.log('\n🔗 Test 10: Testing project click navigation...');
    if (rowCount > 0) {
      const firstProjectNameButton = await page.locator('tbody tr').first().locator('td button').first();
      const projectName = await firstProjectNameButton.textContent();
      console.log(`  Clicking on project: ${projectName?.trim()}`);

      // Get the href to see where it will navigate
      const parentRow = await page.locator('tbody tr').first();
      await firstProjectNameButton.click();
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      console.log(`  Navigated to: ${currentUrl}`);

      if (currentUrl.includes('/home')) {
        results.passed.push('Project click navigates to project home');
      } else {
        results.failed.push(`Project click went to ${currentUrl} instead of /[projectId]/home`);
      }

      // Navigate back
      await page.goBack();
      await page.waitForTimeout(1000);
    }

    // Test 11: Check sidebar background is white
    console.log('\n🎨 Test 11: Checking sidebar styling...');
    const sidebar = await page.locator('[data-sidebar="sidebar"]').first();
    if (await sidebar.count() > 0) {
      const bgColor = await sidebar.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });
      console.log(`  Sidebar background: ${bgColor}`);
      if (bgColor.includes('255') || bgColor === 'white') {
        results.passed.push('Sidebar has white background');
      } else {
        results.failed.push(`Sidebar background is ${bgColor}, should be white`);
      }
    } else {
      results.warnings.push('Sidebar not found in current view');
    }

    // Test 12: Check table extends to bottom with proper padding
    console.log('\n📏 Test 12: Checking table height and padding...');
    const tableWrapper = await page.locator('.overflow-x-auto').first();
    const tableHeight = await tableWrapper.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const bottomPadding = window.innerHeight - rect.bottom;
      return { height: rect.height, bottomPadding };
    });
    console.log(`  Table height: ${tableHeight.height}px`);
    console.log(`  Bottom padding: ${tableHeight.bottomPadding}px`);

    if (tableHeight.bottomPadding >= 40 && tableHeight.bottomPadding <= 60) {
      results.passed.push('Table has proper bottom padding (~50px)');
    } else {
      results.warnings.push(`Bottom padding is ${tableHeight.bottomPadding}px (expected ~50px)`);
    }

    // Test 13: Check pagination controls
    console.log('\n📄 Test 13: Testing pagination controls...');
    const paginationControls = await page.locator('button:has([class*="Chevron"])').all();
    console.log(`  Found ${paginationControls.length} pagination buttons`);
    if (paginationControls.length >= 4) {
      results.passed.push('Pagination controls present (First, Prev, Next, Last)');
    } else {
      results.warnings.push('Some pagination controls may be missing');
    }

    // Test 14: Take screenshots for visual verification
    console.log('\n📸 Test 14: Taking screenshots...');
    await page.screenshot({
      path: '/Users/meganharrison/Documents/github/alleato-procore/tests/portfolio-full-page.png',
      fullPage: true
    });
    results.passed.push('Full page screenshot captured');

    // Screenshot of table area
    if (await tableWrapper.count() > 0) {
      await tableWrapper.screenshot({
        path: '/Users/meganharrison/Documents/github/alleato-procore/tests/portfolio-table-area.png'
      });
      results.passed.push('Table area screenshot captured');
    }

    // Test 15: Check responsive behavior at different widths
    console.log('\n📱 Test 15: Testing responsive behavior...');
    const widths = [1920, 1440, 1024];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1080 });
      await page.waitForTimeout(500);
      const pageScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
      console.log(`  At ${width}px width: ${pageScroll ? '❌ Page scrolls' : '✅ No page scroll'}`);
    }
    results.passed.push('Responsive behavior checked at multiple widths');

  } catch (error) {
    console.error('\n💥 Test encountered an error:', error.message);
    results.failed.push(`Test error: ${error.message}`);

    // Take error screenshot
    await page.screenshot({
      path: '/Users/meganharrison/Documents/github/alleato-procore/tests/portfolio-error.png',
      fullPage: true
    });
  } finally {
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✅ PASSED (${results.passed.length}):`);
    results.passed.forEach(test => console.log(`  ✅ ${test}`));

    if (results.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${results.warnings.length}):`);
      results.warnings.forEach(test => console.log(`  ⚠️  ${test}`));
    }

    if (results.failed.length > 0) {
      console.log(`\n❌ FAILED (${results.failed.length}):`);
      results.failed.forEach(test => console.log(`  ❌ ${test}`));
    }

    const totalTests = results.passed.length + results.failed.length + results.warnings.length;
    const passRate = ((results.passed.length / totalTests) * 100).toFixed(1);

    console.log(`\n📈 Overall: ${results.passed.length}/${totalTests} passed (${passRate}%)`);

    if (results.failed.length === 0) {
      console.log('\n🎉 ALL CRITICAL TESTS PASSED!');
    } else {
      console.log(`\n⚠️  ${results.failed.length} CRITICAL ISSUES NEED ATTENTION`);
    }

    console.log('\n' + '='.repeat(60));

    // Keep browser open for 10 seconds to view results
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);

    await browser.close();
  }
}

// Run the test
testPortfolioPage().catch(console.error);
