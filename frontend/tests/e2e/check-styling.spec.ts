import { test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('Capture budget page screenshot with table styling', async ({ page }) => {
  // Navigate to dev-login with credentials
  const devLoginResponse = await page.goto(
    'http://localhost:3001/dev-login?email=test@example.com&password=testpassword123',
  );

  console.warn('Dev login response:', devLoginResponse?.status());

  // Wait for page navigation to complete
  await page.waitForLoadState('networkidle');

  // Small delay to ensure login is fully processed
  await page.waitForTimeout(1000);

  // Take a screenshot after login
  await page.screenshot({
    path: '/Users/meganharrison/Documents/github/alleato-procore/frontend/tests/screenshots/after-login.png',
    fullPage: true,
  });

  console.warn('After login screenshot captured');

  // Now navigate to the budget page
  const budgetResponse = await page.goto('http://localhost:3001/67/budget');
  console.warn('Budget page response:', budgetResponse?.status());

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Wait a bit more for any animations to settle
  await page.waitForTimeout(1000);

  // Take a full-page screenshot
  await page.screenshot({
    path: '/Users/meganharrison/Documents/github/alleato-procore/frontend/tests/screenshots/budget-table-styling.png',
    fullPage: true,
  });

  console.warn('Budget page screenshot captured successfully');
});
