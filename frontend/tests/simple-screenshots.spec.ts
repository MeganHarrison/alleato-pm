import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } }); // Start fresh

test.describe('Simple Screenshot Capture', () => {
  test.beforeEach(async ({ page }) => {
    // Use mock login for each test
    await page.goto('/mock-login?redirect=/');
    await page.waitForLoadState('networkidle');
  });

  test('capture main pages', async ({ page }) => {
    // Home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/simple-01-home.png',
      fullPage: true 
    });
    console.log('✅ Captured Home');

    // Projects
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/simple-02-projects.png',
      fullPage: true 
    });
    console.log('✅ Captured Projects');

    // Commitments
    await page.goto('/commitments');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/simple-03-commitments.png',
      fullPage: true 
    });
    console.log('✅ Captured Commitments');

    // Chat RAG
    await page.goto('/chat-rag');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/simple-04-chat-rag.png',
      fullPage: true 
    });
    console.log('✅ Captured Chat RAG');

    // Dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/simple-05-dashboard.png',
      fullPage: true 
    });
    console.log('✅ Captured Dashboard');
  });
});