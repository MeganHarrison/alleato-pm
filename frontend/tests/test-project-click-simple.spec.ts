import { test, expect } from '@playwright/test';

test('test project click navigation', async ({ page }) => {
  // Use mock login
  await page.goto('http://localhost:3000/mock-login?redirect=/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Step 1: Loaded homepage via mock login');
  console.log('URL:', page.url());

  // Take screenshot of homepage
  await page.screenshot({
    path: 'tests/screenshots/simple-test-01-home.png',
    fullPage: false
  });

  // Click first project name
  console.log('Step 2: Looking for first project button...');
  const projectButton = page.locator('tbody tr').first().locator('button[type="button"]').first();

  const isVisible = await projectButton.isVisible();
  console.log('Button visible:', isVisible);

  if (isVisible) {
    const text = await projectButton.textContent();
    console.log('Button text:', text);

    await projectButton.click();
    console.log('Step 3: Clicked project button');

    // Wait for navigation
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');

    const newUrl = page.url();
    console.log('Step 4: New URL:', newUrl);

    // Take screenshot after navigation
    await page.screenshot({
      path: 'tests/screenshots/simple-test-02-project.png',
      fullPage: false
    });

    // Check if we're on project page
    const heading = await page.locator('h1').first().textContent();
    console.log('Page heading:', heading);

    // Verify URL changed to project page
    expect(newUrl).toMatch(/\/\d+\/home/);
    console.log('✅ Navigation successful!');
  } else {
    console.log('❌ Project button not visible');
    throw new Error('Could not find project button');
  }
});
