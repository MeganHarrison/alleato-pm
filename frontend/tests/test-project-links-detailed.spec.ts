import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/.auth/user.json' });

test.describe('Project Links - Detailed Test', () => {
  test('clicking a project should navigate and show project home', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('Step 1: On homepage');
    const initialUrl = page.url();
    console.log('Initial URL:', initialUrl);

    // Take screenshot of homepage
    await page.screenshot({
      path: 'tests/screenshots/detailed-01-homepage.png',
      fullPage: true
    });

    // Find the first project name button
    const firstProjectLink = page.locator('tbody tr').first().locator('button').first();

    // Get the project name before clicking
    const projectName = await firstProjectLink.textContent();
    console.log('Step 2: Found project:', projectName);

    // Click the project
    await firstProjectLink.click();

    // Wait for navigation
    await page.waitForURL(/\/\d+\/home/, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    console.log('Step 3: Navigated to:', finalUrl);

    // Take screenshot of project page
    await page.screenshot({
      path: 'tests/screenshots/detailed-02-project-home.png',
      fullPage: true
    });

    // Check if we're on a different page
    expect(initialUrl).not.toBe(finalUrl);
    expect(finalUrl).toMatch(/\/\d+\/home/);

    // Check for project-specific content
    const pageContent = await page.textContent('body');
    console.log('Step 4: Checking page content...');

    // Look for indicators that we're on a project home page
    const hasProjectContent =
      pageContent?.includes('Project Overview') ||
      pageContent?.includes('Project Team') ||
      pageContent?.includes('My Open Items');

    console.log('Has project-specific content:', hasProjectContent);

    // Log what we see on the page
    const mainHeading = await page.locator('h1, h2').first().textContent();
    console.log('Main heading:', mainHeading);

    console.log('✅ Navigation test complete');
  });
});
