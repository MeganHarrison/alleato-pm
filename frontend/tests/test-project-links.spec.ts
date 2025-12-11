import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/.auth/user.json' });

test.describe('Project Links', () => {
  test('clicking a project should navigate to project homepage', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Take screenshot before clicking
    await page.screenshot({
      path: 'tests/screenshots/before-project-click.png',
      fullPage: true
    });

    // Find and click the first project link
    const firstProjectLink = page.locator('button:has-text("Alleato Finance")').first();

    // Wait for the element to be visible
    await firstProjectLink.waitFor({ state: 'visible' });

    console.log('Found project link, clicking...');
    await firstProjectLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Take screenshot after clicking
    await page.screenshot({
      path: 'tests/screenshots/after-project-click.png',
      fullPage: true
    });

    // Check that we navigated to a project page
    const url = page.url();
    console.log('Current URL after click:', url);

    // URL should match pattern: /{project-id}/home
    expect(url).toMatch(/\/\d+\/home/);

    console.log('✅ Project link navigation successful');
  });
});
