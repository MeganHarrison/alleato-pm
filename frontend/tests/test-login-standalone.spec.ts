import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

test.describe('Standalone Login Test', () => {
  test('should test login and capture error if any', async ({ page }) => {
    console.log('Starting standalone login test...');

    // Set up request listener to capture Supabase auth requests
    page.on('response', async response => {
      if (response.url().includes('supabase') && response.url().includes('auth')) {
        console.log(`Supabase Auth Response: ${response.status()} ${response.url()}`);
        if (response.status() >= 400) {
          try {
            const body = await response.text();
            console.log(`Error response body: ${body}`);
          } catch (e) {
            console.log('Could not read response body');
          }
        }
      }
    });

    // Clear all auth state before testing
    await page.context().clearCookies();
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });

    // Clear localStorage to remove stale Supabase sessions
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.reload({ waitUntil: 'networkidle' }); // Force fresh load
    console.log('Navigated to login page with cleared auth state');

    // Take screenshot of login page
    await page.screenshot({ path: 'tests/screenshots/standalone-01-login-page.png', fullPage: true });
    console.log('Screenshot: login page');

    // Fill in credentials using IDs for reliability
    await page.fill('#email', 'Megan@megankharrison.com');
    await page.fill('#password', 'Mandypup2025!');
    console.log('Credentials filled');

    // Take screenshot with credentials
    await page.screenshot({ path: 'tests/screenshots/standalone-02-credentials-filled.png', fullPage: true });

    // Set up console listener to capture errors
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Click login button
    await page.click('button[type="submit"]');
    console.log('Login button clicked');

    // Wait for response (either success or error)
    await page.waitForTimeout(5000);

    // Print console messages
    console.log('Browser console messages:');
    consoleMessages.forEach(msg => console.log(`  ${msg}`));

    // Take screenshot after clicking
    await page.screenshot({ path: 'tests/screenshots/standalone-03-after-submit.png', fullPage: true });

    // Check for error message
    const errorElement = page.locator('p.text-red-500');
    const errorExists = await errorElement.count() > 0;

    if (errorExists) {
      const errorMessage = await errorElement.textContent();
      const errorHTML = await errorElement.innerHTML();
      console.log(`❌ Login failed with error text: "${errorMessage}"`);
      console.log(`❌ Error HTML: ${errorHTML}`);
      console.log('Error screenshot saved');
    } else {
      console.log('No error message found');
    }

    // Check current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Check if we're still on login page
    if (currentUrl.includes('/auth/login')) {
      console.log('❌ Still on login page - login failed');

      // Try to get the error from toast/notification
      const toast = page.locator('[role="status"], .toast, [data-sonner-toast]');
      if (await toast.count() > 0) {
        const toastText = await toast.textContent();
        console.log(`Toast message: ${toastText}`);
      }
    } else {
      console.log(`✅ Redirected to: ${currentUrl}`);
      await page.screenshot({ path: 'tests/screenshots/standalone-04-logged-in.png', fullPage: true });
    }

    // Get all text content from the page for debugging
    const bodyText = await page.locator('body').textContent();
    if (bodyText && bodyText.includes('error')) {
      console.log('Page contains error-related text');
    }
  });
});
