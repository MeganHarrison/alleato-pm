import { chromium } from 'playwright';

const testFrontend = async () => {
  console.log('Starting frontend tests...');
  
  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
    slowMo: 500 // Slow down actions for visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Test 1: Check if frontend is running
    console.log('\n🧪 Test 1: Checking if frontend is accessible...');
    const response = await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    if (response && response.ok()) {
      console.log('✅ Frontend is running and accessible');
      
      // Test 2: Check page title
      const title = await page.title();
      console.log(`✅ Page title: ${title}`);
      
      // Test 3: Take screenshot
      await page.screenshot({ 
        path: 'outputs/screenshots/frontend-test.png',
        fullPage: true 
      });
      console.log('✅ Screenshot saved to outputs/screenshots/frontend-test.png');
      
      // Test 4: Check for key UI elements
      console.log('\n🧪 Test 2: Checking for UI elements...');
      
      const elements = {
        'navigation': '[role="navigation"], nav, .nav, .navbar, .sidebar',
        'main content': 'main, [role="main"], .main-content',
        'buttons': 'button, [role="button"]',
        'links': 'a[href]'
      };
      
      for (const [name, selector] of Object.entries(elements)) {
        try {
          const count = await page.locator(selector).count();
          if (count > 0) {
            console.log(`✅ Found ${count} ${name} element(s)`);
          } else {
            console.log(`⚠️  No ${name} elements found`);
          }
        } catch (e) {
          console.log(`❌ Error checking ${name}: ${e.message}`);
        }
      }
      
      // Test 5: Check for any console errors
      console.log('\n🧪 Test 3: Checking for console errors...');
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Navigate again to catch any errors
      await page.reload();
      await page.waitForTimeout(2000);
      
      if (consoleErrors.length === 0) {
        console.log('✅ No console errors detected');
      } else {
        console.log(`❌ Found ${consoleErrors.length} console errors:`);
        consoleErrors.forEach(err => console.log(`   - ${err}`));
      }
      
    } else {
      console.log('❌ Frontend is not accessible. Status:', response?.status());
      console.log('\n📝 Troubleshooting steps:');
      console.log('1. Make sure the frontend is running: cd frontend && npm run dev');
      console.log('2. Check if port 3000 is available');
      console.log('3. Check for any build errors in the terminal');
    }
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log('\n📝 The frontend server is not running!');
      console.log('Please start it with: cd frontend && npm run dev');
    } else {
      console.log('\n📝 Unexpected error occurred');
    }
    
    // Take error screenshot
    await page.screenshot({ 
      path: 'outputs/screenshots/frontend-error.png',
      fullPage: true 
    });
    console.log('📸 Error screenshot saved to outputs/screenshots/frontend-error.png');
  }
  
  await browser.close();
  console.log('\n🏁 Frontend tests completed');
};

// Run the tests
testFrontend().catch(console.error);