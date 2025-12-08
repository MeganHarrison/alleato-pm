const { chromium } = require('playwright');

async function debugNavigation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Starting debug session...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Listen for console logs from the page
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    });
    
    // Check if the projects table exists
    const table = await page.locator('table').first();
    if (await table.count() > 0) {
      console.log('✅ Table found');
      
      // Find all buttons in the table
      const buttons = await page.locator('table button').all();
      console.log(`Found ${buttons.length} buttons in table`);
      
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const text = await buttons[i].textContent();
        const classes = await buttons[i].getAttribute('class');
        console.log(`Button ${i + 1}: "${text}" (classes: ${classes})`);
      }
      
      // Try to find the project name button specifically
      const projectButton = await page.locator('button:has-text("24-104 - Goodwill Bart")').first();
      if (await projectButton.count() > 0) {
        console.log('✅ Found project button');
        console.log('📍 Clicking project button...');
        await projectButton.click();
        
        // Wait a bit and check the URL
        await page.waitForTimeout(2000);
        console.log('Current URL after click:', page.url());
        
      } else {
        console.log('❌ Project button not found');
        
        // Try clicking the table row instead
        const row = await page.locator('tr:has-text("24-104 - Goodwill Bart")').first();
        if (await row.count() > 0) {
          console.log('📍 Trying to click table row...');
          await row.click();
          await page.waitForTimeout(2000);
          console.log('Current URL after row click:', page.url());
        }
      }
    }
    
    // Keep browser open for manual inspection
    console.log('Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugNavigation();