import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to mock login
  await page.goto('http://localhost:3000/mock-login?redirect=/');
  await page.waitForTimeout(1000);
  
  // Save storage state
  await page.context().storageState({ path: 'tests/.auth/global-auth.json' });
  
  await browser.close();
  
  console.log('✅ Global auth setup complete');
}

export default globalSetup;