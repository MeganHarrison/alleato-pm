import { test, expect } from '@playwright/test';

// This test manually logs in and captures all required screenshots
test.describe('Manual Screenshot Capture', () => {
  test('capture all page screenshots with manual login', async ({ page }) => {
    // Set a longer timeout for this test
    test.setTimeout(300000); // 5 minutes
    
    // Navigate to login page
    await page.goto('http://localhost:3001/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Capture login page
    await page.screenshot({ 
      path: 'test_screenshots/auth/login-page.png',
      fullPage: true 
    });
    
    // Try to log in with the provided credentials
    await page.fill('input[type="email"], input[name="email"]', 'Megan@megankharrison.com');
    await page.fill('input[type="password"], input[name="password"]', 'Mandypup2025!');
    
    // Click login button
    await page.click('button[type="submit"], button:has-text("Login")');
    
    // Wait for navigation or error
    await page.waitForTimeout(5000);
    
    // Check if we're still on login page
    if (page.url().includes('/auth/login')) {
      console.log('Login failed - capturing error state');
      await page.screenshot({ 
        path: 'test_screenshots/auth/login-failed.png',
        fullPage: true 
      });
      
      // Try the home page directly
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
    }
    
    // Capture Portfolio/Home Page
    console.log('Capturing Portfolio page...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if we're on the portfolio page
    const isPortfolioPage = await page.locator('h1:has-text("Portfolio")').isVisible().catch(() => false);
    
    if (isPortfolioPage) {
      await page.screenshot({ 
        path: 'test_screenshots/portfolio/portfolio-full-page.png',
        fullPage: true 
      });
      console.log('Portfolio page captured');
    } else {
      console.log('Portfolio page not accessible, current URL:', page.url());
      await page.screenshot({ 
        path: 'test_screenshots/portfolio/portfolio-redirect.png',
        fullPage: true 
      });
    }
    
    // Try Commitments page
    console.log('Capturing Commitments page...');
    await page.goto('http://localhost:3001/commitments');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const isCommitmentsPage = await page.locator('h1:has-text("Commitments")').isVisible().catch(() => false);
    
    if (isCommitmentsPage) {
      await page.screenshot({ 
        path: 'test_screenshots/commitments/commitments-full-page.png',
        fullPage: true 
      });
      console.log('Commitments page captured');
    }
    
    // Try Contracts page
    console.log('Capturing Contracts form...');
    await page.goto('http://localhost:3001/contracts/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const isContractForm = await page.locator('h1:has-text("Create Prime Contract")').isVisible().catch(() => false);
    
    if (isContractForm) {
      await page.screenshot({ 
        path: 'test_screenshots/contracts/contract-form-full.png',
        fullPage: true 
      });
      console.log('Contract form captured');
    }
    
    // Try Purchase Order form
    console.log('Capturing Purchase Order form...');
    await page.goto('http://localhost:3001/commitments/purchase-orders/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const isPOForm = await page.locator('h1:has-text("Create Purchase Order")').isVisible().catch(() => false);
    
    if (isPOForm) {
      await page.screenshot({ 
        path: 'test_screenshots/purchase-orders/po-form-full.png',
        fullPage: true 
      });
      console.log('Purchase Order form captured');
    }
    
    // Capture current state regardless
    console.log('Final URL:', page.url());
    await page.screenshot({ 
      path: 'test_screenshots/final-state.png',
      fullPage: true 
    });
  });
});