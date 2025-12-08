const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen to console messages
  page.on('console', msg => {
    console.log('Console:', msg.type(), msg.text());
  });
  
  // Listen to network requests
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), request.failure());
  });
  
  try {
    // Navigate to the page
    await page.goto('http://localhost:3000');
    
    // Wait for API call
    const response = await page.waitForResponse(response => 
      response.url().includes('/api/projects'), 
      { timeout: 10000 }
    );
    
    console.log('API Response status:', response.status());
    const responseBody = await response.json();
    console.log('API Response body:', JSON.stringify(responseBody, null, 2));
    
    // Wait a moment
    await page.waitForTimeout(2000);
    
    // Check table content
    const tableContent = await page.textContent('tbody');
    console.log('Table content:', tableContent);
    
    // Check if "No projects found" is displayed
    const noProjectsFound = await page.$('text=No projects found');
    if (noProjectsFound) {
      console.log('⚠️  "No projects found" message is displayed');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
})();