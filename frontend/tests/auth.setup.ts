import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Use dev-login for testing
  await page.goto('/dev-login?email=test@example.com&password=testpassword123');

  // Wait for any redirect to complete
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});