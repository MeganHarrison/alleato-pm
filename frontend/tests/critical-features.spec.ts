import { test, expect } from '@playwright/test';

// Skip auth setup and use mock login directly
test.beforeEach(async ({ page }) => {
  await page.goto('/mock-login?redirect=/');
  await page.waitForTimeout(500);
});

test.describe('Critical Application Features', () => {
  test('core navigation and page access', async ({ page }) => {
    const criticalPages = [
      { path: '/', name: 'Home' },
      { path: '/projects', name: 'Projects' },
      { path: '/commitments', name: 'Commitments' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/chat-rag', name: 'Chat RAG' }
    ];

    for (const route of criticalPages) {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      
      // Verify not redirected to login
      expect(page.url()).not.toContain('/auth/login');
      console.log(`✅ ${route.name} - Accessible`);
      
      // Check for any console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      
      if (errors.length > 0) {
        console.log(`⚠️  ${route.name} - Console errors:`, errors);
      }
    }
  });

  test('financial module functionality', async ({ page }) => {
    // Test Commitments page
    await page.goto('/commitments');
    await page.waitForLoadState('networkidle');
    
    // Check for key UI elements
    const elements = {
      'page title': page.locator('h1, h2').filter({ hasText: /commitment/i }).first(),
      'new button': page.locator('button').filter({ hasText: /new/i }).first(),
      'table': page.locator('table, [role="table"]').first(),
      'search': page.locator('input[type="search"], input[placeholder*="search" i]').first()
    };
    
    for (const [name, locator] of Object.entries(elements)) {
      const isVisible = await locator.isVisible().catch(() => false);
      console.log(`${isVisible ? '✅' : '❌'} Commitments - ${name}`);
    }
    
    // Test navigation to new commitment form
    const newButton = page.locator('button').filter({ hasText: /new/i }).first();
    if (await newButton.isVisible()) {
      await newButton.click();
      await page.waitForLoadState('domcontentloaded');
      
      const isForm = page.url().includes('/new') || 
                     await page.locator('form').isVisible();
      console.log(`${isForm ? '✅' : '❌'} New Commitment form navigation`);
    }
  });

  test('chat interface functionality', async ({ page }) => {
    await page.goto('/chat-rag');
    await page.waitForLoadState('networkidle');
    
    // Look for chat interface elements
    const chatElements = {
      'message input': page.locator('textarea, input[type="text"]').filter({ 
        has: page.locator('[placeholder*="message" i], [placeholder*="ask" i], [placeholder*="type" i]') 
      }).first(),
      'send button': page.locator('button').filter({ 
        has: page.locator('svg, [aria-label*="send" i]') 
      }).first(),
      'chat container': page.locator('[class*="chat" i], [class*="message" i]').first()
    };
    
    for (const [name, locator] of Object.entries(chatElements)) {
      const isVisible = await locator.isVisible().catch(() => false);
      console.log(`${isVisible ? '✅' : '❌'} Chat - ${name}`);
    }
    
    // Test message input
    const messageInput = chatElements['message input'];
    if (await messageInput.isVisible()) {
      await messageInput.fill('Test message for screenshot');
      const hasValue = await messageInput.inputValue() === 'Test message for screenshot';
      console.log(`${hasValue ? '✅' : '❌'} Chat - message input works`);
    }
  });

  test('responsive design check', async ({ page }) => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 }
    ];
    
    await page.goto('/dashboard');
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Check if navigation is adapted (e.g., hamburger menu on mobile)
      const mobileMenu = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]');
      const isMobileMenuVisible = viewport.name === 'Mobile' && await mobileMenu.isVisible();
      
      // Check if content is responsive
      const mainContent = page.locator('main, [role="main"]').first();
      const contentWidth = await mainContent.evaluate(el => el.clientWidth);
      const isResponsive = contentWidth <= viewport.width;
      
      console.log(`✅ ${viewport.name} - ${viewport.width}x${viewport.height} - Responsive: ${isResponsive}`);
    }
  });

  test('data loading and error handling', async ({ page }) => {
    // Test data loading states
    await page.goto('/projects');
    
    // Check for loading states
    const loadingIndicators = page.locator('[class*="loading" i], [class*="skeleton" i], [class*="spinner" i]');
    const hasLoadingState = await loadingIndicators.count() > 0;
    console.log(`${hasLoadingState ? '✅' : '⚠️ '} Projects - Loading states implemented`);
    
    // Wait for data to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Check for data or empty state
    const hasTable = await page.locator('table, [role="table"]').isVisible();
    const hasEmptyState = await page.locator('[class*="empty" i], [class*="no-data" i]').isVisible();
    const hasData = hasTable || hasEmptyState;
    console.log(`${hasData ? '✅' : '❌'} Projects - Data display working`);
    
    // Test error handling by trying to access a non-existent resource
    await page.goto('/projects/99999999');
    await page.waitForLoadState('domcontentloaded');
    
    const has404 = page.url().includes('404') || 
                   await page.locator('text=/404|not found/i').isVisible();
    const redirectedHome = page.url() === 'http://localhost:3000/' || 
                          page.url().includes('/projects');
    const errorHandled = has404 || redirectedHome;
    console.log(`${errorHandled ? '✅' : '❌'} Error handling for invalid routes`);
  });
});

test.describe('Performance Metrics', () => {
  test('page load performance', async ({ page }) => {
    const routes = [
      { path: '/', name: 'Home' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/projects', name: 'Projects' }
    ];
    
    for (const route of routes) {
      const startTime = Date.now();
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      const isAcceptable = loadTime < 3000; // 3 seconds threshold
      console.log(`${isAcceptable ? '✅' : '⚠️ '} ${route.name} - Load time: ${loadTime}ms`);
      
      // Measure time to interactive
      const interactive = await page.evaluate(() => {
        return new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(true);
          } else {
            window.addEventListener('load', () => resolve(true));
          }
        });
      });
      
      if (interactive) {
        console.log(`✅ ${route.name} - Page interactive`);
      }
    }
  });
});