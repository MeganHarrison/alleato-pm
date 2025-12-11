import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Use mock login for consistent authentication
    await page.goto('/mock-login?userId=test-user-123&email=test@example.com&role=admin');
    await page.waitForURL('/');
  });

  test.describe('Core Pages', () => {
    test('Home page accessibility', async ({ page }) => {
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/home-a11y.png' });
    });

    test('Projects portfolio accessibility', async ({ page }) => {
      await page.goto('/projects');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/projects-a11y.png' });
    });

    test('Commitments list accessibility', async ({ page }) => {
      await page.goto('/commitments');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/commitments-a11y.png' });
    });

    test('RAG ChatKit accessibility', async ({ page }) => {
      await page.goto('/rag');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/rag-chat-a11y.png' });
    });

    test('Executive Dashboard accessibility', async ({ page }) => {
      await page.goto('/dashboard');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/dashboard-a11y.png' });
    });
  });

  test.describe('Form Pages', () => {
    test('Contract form accessibility', async ({ page }) => {
      await page.goto('/contracts/new');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude(['.mantine-RichTextEditor']) // Exclude rich text editor if it has known issues
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/contract-form-a11y.png' });
    });

    test('Purchase order form accessibility', async ({ page }) => {
      await page.goto('/commitments/purchase-orders/new');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/po-form-a11y.png' });
    });
  });

  test.describe('Interactive Components', () => {
    test('Data table interactions accessibility', async ({ page }) => {
      await page.goto('/commitments');
      
      // Test keyboard navigation
      await page.keyboard.press('Tab'); // Focus first interactive element
      await page.keyboard.press('Tab'); // Navigate through elements
      
      // Test with screen reader simulation
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .include('[data-testid="commitments-table"]')
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

    test('Modal dialog accessibility', async ({ page }) => {
      await page.goto('/commitments');
      
      // Open a modal (if create button exists)
      const createButton = page.locator('button:has-text("Create")');
      if (await createButton.isVisible()) {
        await createButton.click();
        
        // Wait for modal
        await page.waitForTimeout(500);
        
        // Test modal accessibility
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .include('[role="dialog"]')
          .analyze();
        
        expect(results.violations).toEqual([]);
      }
    });

    test('Form validation accessibility', async ({ page }) => {
      await page.goto('/contracts/new');
      
      // Submit empty form to trigger validation
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for validation errors
        await page.waitForTimeout(500);
        
        // Test error states accessibility
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        
        expect(results.violations).toEqual([]);
        await page.screenshot({ path: 'test_screenshots/accessibility/form-validation-a11y.png' });
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('Check color contrast ratios', async ({ page }) => {
      await page.goto('/');
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa']) // AA level requires 4.5:1 for normal text, 3:1 for large text
        .options({
          rules: {
            'color-contrast': { enabled: true }
          }
        })
        .analyze();
      
      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('Mobile viewport accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/projects');
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/mobile-a11y.png' });
    });

    test('Tablet viewport accessibility', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/commitments');
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(results.violations).toEqual([]);
      await page.screenshot({ path: 'test_screenshots/accessibility/tablet-a11y.png' });
    });
  });
});

// Helper to generate accessibility report
test.describe('Accessibility Report', () => {
  test('Generate comprehensive accessibility report', async ({ page }) => {
    const pages = [
      { url: '/', name: 'Home' },
      { url: '/projects', name: 'Projects' },
      { url: '/commitments', name: 'Commitments' },
      { url: '/contracts/new', name: 'Contract Form' },
      { url: '/rag', name: 'RAG Chat' },
      { url: '/dashboard', name: 'Dashboard' }
    ];

    const report = {
      timestamp: new Date().toISOString(),
      summary: { passed: 0, failed: 0, total: 0 },
      details: []
    };

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      report.details.push({
        page: pageInfo.name,
        url: pageInfo.url,
        violations: results.violations.length,
        violationDetails: results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          nodes: v.nodes.length
        }))
      });

      report.summary.total++;
      if (results.violations.length === 0) {
        report.summary.passed++;
      } else {
        report.summary.failed++;
      }
    }

    // Log report summary
    console.log('Accessibility Test Report:');
    console.log(`Total Pages: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log('\nDetailed Results:');
    report.details.forEach(detail => {
      console.log(`\n${detail.page} (${detail.url}): ${detail.violations} violations`);
      if (detail.violationDetails.length > 0) {
        detail.violationDetails.forEach(v => {
          console.log(`  - ${v.id} (${v.impact}): ${v.description}`);
        });
      }
    });
  });
});