import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

test.describe('Login Test', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    console.log('Starting login test...');

    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/login`);
    console.log('Navigated to login page');

    // Take screenshot of login page
    await page.screenshot({ path: 'tests/screenshots/01-login-page.png', fullPage: true });
    console.log('Screenshot taken: login page');

    // Fill in credentials
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');

    await emailInput.fill('Megan@megankharrison.com');
    await passwordInput.fill('Mandypup2025!');
    console.log('Credentials filled');

    // Take screenshot with credentials filled
    await page.screenshot({ path: 'tests/screenshots/02-credentials-filled.png', fullPage: true });

    // Click login button
    const loginButton = page.locator('button[type="submit"]').first();
    await loginButton.click();
    console.log('Login button clicked');

    // Wait a moment for the form to process
    await page.waitForTimeout(3000);

    // Check for error message
    const errorMessage = await page.locator('p.text-red-500').textContent().catch(() => null);
    if (errorMessage) {
      console.log(`Login error message: ${errorMessage}`);
      await page.screenshot({ path: 'tests/screenshots/03-login-error.png', fullPage: true });
    }

    // Wait for navigation (could be to dashboard, portfolio, or protected page)
    try {
      await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 10000 });
      console.log(`Redirected to: ${page.url()}`);
    } catch (error) {
      console.log('Did not redirect from login page');
      if (!errorMessage) {
        await page.screenshot({ path: 'tests/screenshots/03-login-error.png', fullPage: true });
      }
      if (errorMessage) {
        throw new Error(`Login failed with error: ${errorMessage}`);
      }
      throw error;
    }

    // Wait for page to fully load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Take screenshot of successful login page
    await page.screenshot({ path: 'tests/screenshots/04-logged-in.png', fullPage: true });
    console.log('Screenshot taken: logged in page');

    // Verify we're not on the login page anymore
    expect(page.url()).not.toContain('/auth/login');

    // Check for common authenticated UI elements (adjust based on your app)
    const isAuthenticated = await page.locator('[data-user-menu], [data-logout-button], nav a[href*="/portfolio"], nav a[href*="/financial"]').first().isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`Authentication status: ${isAuthenticated ? 'SUCCESS' : 'UNCERTAIN'}`);
    console.log(`Current URL: ${page.url()}`);

    // Log page title
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Take final screenshot with annotations
    await page.screenshot({ path: 'tests/screenshots/05-final-state.png', fullPage: true });

    expect(isAuthenticated || !page.url().includes('/auth/')).toBeTruthy();
  });
});
