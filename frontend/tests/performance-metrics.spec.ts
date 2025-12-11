import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint - should be under 2.5s
  LCP: 2500,
  // First Input Delay - should be under 100ms
  FID: 100,
  // Cumulative Layout Shift - should be under 0.1
  CLS: 0.1,
  // First Contentful Paint - should be under 1.8s
  FCP: 1800,
  // Time to Interactive - should be under 3.8s
  TTI: 3800,
  // Total Blocking Time - should be under 200ms
  TBT: 200
};

test.describe('Performance Metrics', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.goto('/mock-login?redirect=/');
    await page.waitForTimeout(500);
  });

  test('home page performance metrics', async ({ page }) => {
    // Start performance measurement
    await page.goto('/', { waitUntil: 'networkidle' });

    // Collect performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Navigation Timing
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        
        // Paint Timing
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource Timing
        resources: performance.getEntriesByType('resource').length,
        
        // Memory (if available)
        memory: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize / 1048576, // Convert to MB
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize / 1048576,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit / 1048576
        } : null
      };
    });

    // Log metrics
    console.log('Performance Metrics:', JSON.stringify(metrics, null, 2));

    // Assert performance thresholds
    expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP);
    expect(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.TTI);

    // Capture performance screenshot
    await page.screenshot({
      path: 'tests/screenshots/performance/home-page-loaded.png',
      fullPage: true
    });
  });

  test('measure Core Web Vitals', async ({ page }) => {
    // Navigate to page
    await page.goto('/projects', { waitUntil: 'domcontentloaded' });

    // Inject Web Vitals library
    await page.addScriptTag({
      content: `
        window.webVitals = [];
        
        // Simplified Web Vitals collection
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              window.webVitals.push({ name: 'LCP', value: entry.startTime });
            }
            if (entry.entryType === 'first-input') {
              window.webVitals.push({ name: 'FID', value: entry.processingStart - entry.startTime });
            }
            if (entry.entryType === 'layout-shift') {
              window.webVitals.push({ name: 'CLS', value: entry.value });
            }
          }
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      `
    });

    // Wait for metrics to be collected
    await page.waitForTimeout(5000);

    // Interact with page to trigger FID
    const firstButton = page.locator('button').first();
    if (await firstButton.isVisible()) {
      await firstButton.click();
    }

    // Collect Web Vitals
    const webVitals = await page.evaluate(() => window.webVitals || []);
    console.log('Web Vitals:', webVitals);

    // Find and validate metrics
    const lcp = webVitals.find(v => v.name === 'LCP');
    const cls = webVitals.find(v => v.name === 'CLS');
    
    if (lcp) {
      expect(lcp.value).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
      console.log(`✅ LCP: ${lcp.value.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.LCP}ms)`);
    }
    
    if (cls) {
      expect(cls.value).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
      console.log(`✅ CLS: ${cls.value.toFixed(4)} (threshold: ${PERFORMANCE_THRESHOLDS.CLS})`);
    }
  });

  test('measure page load times across routes', async ({ page }) => {
    const routes = [
      { path: '/', name: 'Home' },
      { path: '/projects', name: 'Projects' },
      { path: '/commitments', name: 'Commitments' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/chat-rag', name: 'Chat' }
    ];

    const results = [];

    for (const route of routes) {
      const startTime = Date.now();
      
      await page.goto(route.path, { waitUntil: 'networkidle' });
      
      const loadTime = Date.now() - startTime;
      
      // Get additional metrics
      const metrics = await page.evaluate(() => ({
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        resourceCount: performance.getEntriesByType('resource').length,
        transferSize: performance.getEntriesByType('resource').reduce((acc, r: any) => acc + (r.transferSize || 0), 0)
      }));

      results.push({
        route: route.name,
        loadTime,
        ...metrics
      });

      console.log(`${route.name}: ${loadTime}ms (DOM ready: ${metrics.domReady}ms, Resources: ${metrics.resourceCount})`);
    }

    // Save results
    await page.evaluate((data) => {
      console.table(data);
    }, results);

    // Check all pages load within acceptable time
    for (const result of results) {
      expect(result.loadTime).toBeLessThan(3000); // 3 second max
    }
  });

  test('measure JavaScript bundle size', async ({ page }) => {
    await page.goto('/');
    
    // Get all JavaScript resources
    const jsResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((r: any) => r.name.endsWith('.js'))
        .map((r: any) => ({
          name: r.name.split('/').pop(),
          transferSize: r.transferSize,
          decodedBodySize: r.decodedBodySize,
          duration: r.duration
        }));
    });

    // Calculate total bundle size
    const totalSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    const totalDecodedSize = jsResources.reduce((acc, r) => acc + (r.decodedBodySize || 0), 0);

    console.log('\nJavaScript Bundle Analysis:');
    console.log(`Total Transfer Size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`Total Decoded Size: ${(totalDecodedSize / 1024).toFixed(2)} KB`);
    console.log('\nIndividual Bundles:');
    jsResources.forEach(r => {
      console.log(`- ${r.name}: ${(r.transferSize / 1024).toFixed(2)} KB (${r.duration.toFixed(2)}ms)`);
    });

    // Assert bundle size is reasonable
    expect(totalSize).toBeLessThan(2 * 1024 * 1024); // 2MB max for all JS
  });

  test('measure render performance with large datasets', async ({ page }) => {
    // Navigate to a page with tables
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Measure initial render (metrics not available in Playwright)
    const initialMetrics = await page.evaluate(() => ({
      JSHeapUsedSize: (performance as any).memory?.usedJSHeapSize || 0,
      Nodes: document.querySelectorAll('*').length,
      LayoutCount: 0, // Not directly available
      Frames: 0 // Not directly available
    }));
    console.log('Initial Metrics:', {
      Frames: initialMetrics.Frames,
      JSHeapUsedSize: `${(initialMetrics.JSHeapUsedSize / 1048576).toFixed(2)} MB`,
      Nodes: initialMetrics.Nodes,
      LayoutCount: initialMetrics.LayoutCount
    });

    // Simulate scrolling through large dataset
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(100);
    }

    // Measure after interaction
    const finalMetrics = await page.evaluate(() => ({
      JSHeapUsedSize: (performance as any).memory?.usedJSHeapSize || 0,
      Nodes: document.querySelectorAll('*').length,
      LayoutCount: 0,
      Frames: 0
    }));
    const memoryIncrease = (finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize) / 1048576;
    
    console.log('Final Metrics:', {
      Frames: finalMetrics.Frames,
      JSHeapUsedSize: `${(finalMetrics.JSHeapUsedSize / 1048576).toFixed(2)} MB`,
      MemoryIncrease: `${memoryIncrease.toFixed(2)} MB`,
      Nodes: finalMetrics.Nodes,
      LayoutCount: finalMetrics.LayoutCount
    });

    // Assert no major memory leaks
    expect(memoryIncrease).toBeLessThan(50); // Max 50MB increase
  });

  test('lighthouse performance audit', async ({ page }) => {
    // This test requires Chrome to be running
    // It's more suitable for CI environments
    
    console.log('Note: Full Lighthouse audit should be run in CI environment');
    
    // Basic performance checks as alternative
    await page.goto('/dashboard');
    
    // Check for performance best practices
    const hasLazyImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).some(img => img.loading === 'lazy');
    });
    
    const hasMinifiedJS = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[src]');
      return Array.from(scripts).some(script => 
        script.src.includes('.min.') || script.src.includes('_next')
      );
    });

    console.log('Performance Best Practices:');
    console.log(`- Lazy Loading Images: ${hasLazyImages ? '✅' : '❌'}`);
    console.log(`- Minified JavaScript: ${hasMinifiedJS ? '✅' : '❌'}`);
  });
});

// Utility function to run Lighthouse (for CI)
export async function runLighthouseAudit(url: string) {
  const puppeteer = await import('puppeteer');
  const lighthouse = await import('lighthouse');
  
  const browser = await puppeteer.launch({ headless: true });
  const { lhr } = await lighthouse.default(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'json',
    logLevel: 'info',
  });
  
  await browser.close();
  
  const scores = {
    performance: lhr.categories.performance.score * 100,
    accessibility: lhr.categories.accessibility.score * 100,
    'best-practices': lhr.categories['best-practices'].score * 100,
    seo: lhr.categories.seo.score * 100,
  };
  
  return { scores, metrics: lhr.audits };
}