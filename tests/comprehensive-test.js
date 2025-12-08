const { chromium } = require('playwright');

async function comprehensiveTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  try {
    console.log('🚀 Comprehensive Project Navigation Test');
    console.log('=====================================\n');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Test multiple projects
    const testProjects = [
      { id: '1', name: '24-104 - Goodwill Bart' },
      { id: '2', name: '24-103 - Goodwill Manteca Outlet' },
      { id: '3', name: '24-102 - Goodwill Chowchilla' }
    ];

    for (const project of testProjects) {
      console.log(`📍 Testing Project: ${project.name}`);
      
      try {
        // Go back to home page
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        
        // Find and click project
        const projectButton = await page.locator(`button:has-text("${project.name}")`).first();
        if (await projectButton.count() === 0) {
          throw new Error(`Project button not found: ${project.name}`);
        }
        
        await projectButton.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        const expectedUrl = `http://localhost:3000/${project.id}/home`;
        
        if (currentUrl === expectedUrl) {
          // Check if page content loaded
          const pageTitle = await page.locator('h1').first().textContent();
          const hasContent = await page.locator('text=/Project Team|Project Overview/').count() > 0;
          
          results.push({
            project: project.name,
            success: true,
            url: currentUrl,
            pageTitle: pageTitle,
            hasContent: hasContent
          });
          
          console.log(`  ✅ SUCCESS: Navigated to ${currentUrl}`);
          console.log(`  📄 Page title: ${pageTitle}`);
          console.log(`  📊 Content loaded: ${hasContent ? 'Yes' : 'No'}`);
          
        } else {
          results.push({
            project: project.name,
            success: false,
            url: currentUrl,
            expectedUrl: expectedUrl,
            error: 'URL mismatch'
          });
          
          console.log(`  ❌ FAILED: Expected ${expectedUrl}, got ${currentUrl}`);
        }
        
      } catch (error) {
        results.push({
          project: project.name,
          success: false,
          error: error.message
        });
        
        console.log(`  💥 ERROR: ${error.message}`);
      }
      
      console.log('');
    }

    // Summary
    console.log('📊 TEST SUMMARY');
    console.log('==============');
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    
    console.log(`✅ Successful: ${successful}/${total}`);
    console.log(`❌ Failed: ${total - successful}/${total}`);
    
    if (successful === total) {
      console.log('\n🎉 ALL TESTS PASSED! Project navigation is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the details above.');
    }

    // Keep browser open briefly
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
  } finally {
    await browser.close();
  }
}

comprehensiveTest();