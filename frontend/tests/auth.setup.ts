import { test as setup } from '@playwright/test';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const authFile = path.join(__dirname, '.auth/user.json');

// Test user credentials - must match user in app_users table
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'password123',
};

setup('authenticate', async ({ page }) => {
  console.log('Authenticating via NextAuth login...');

  // Navigate to login page
  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  console.log(`On login page: ${page.url()}`);

  // Fill in credentials
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
    timeout: 15000,
  });

  console.log(`Logged in, redirected to: ${page.url()}`);

  // Verify we're not on an error page
  if (page.url().includes('/auth/error')) {
    throw new Error('Login failed - redirected to error page');
  }

  // Navigate to a protected page to verify auth works
  await page.goto(`${BASE_URL}/chat-rag`, {
    waitUntil: 'domcontentloaded',
    timeout: 15000,
  });

  // If we're redirected back to login, auth failed
  if (page.url().includes('/auth/login')) {
    throw new Error('Auth not working - redirected to login after authentication');
  }

  console.log('Auth verified, saving state...');
  await page.context().storageState({ path: authFile });
  console.log(`Auth state saved to ${authFile}`);
});
