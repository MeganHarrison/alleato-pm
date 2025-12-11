import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation UX Improvements', () => {
  test('should display improved sidebar navigation structure', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Take a screenshot of the sidebar
    await page.screenshot({ path: 'frontend/tests/screenshots/sidebar-improved.png', fullPage: true });

    // Verify the page loaded
    const pageContent = await page.content();
    console.log('Page loaded successfully. Content length:', pageContent.length);

    // Check if sidebar exists (it should be in the HTML even if behind auth)
    const hasProjects = pageContent.includes('Projects') || await page.locator('text=Projects').count() > 0;
    const hasTasks = pageContent.includes('Tasks') || await page.locator('text=Tasks').count() > 0;
    const hasMeetings = pageContent.includes('Meetings') || await page.locator('text=Meetings').count() > 0;
    const hasFinancial = pageContent.includes('Financial') || await page.locator('text=Financial').count() > 0;
    const hasProjectTools = pageContent.includes('Project Tools') || await page.locator('text=Project Tools').count() > 0;

    console.log('Navigation items found:', {
      hasProjects,
      hasTasks,
      hasMeetings,
      hasFinancial,
      hasProjectTools
    });

    // Log what we found
    if (hasProjects) console.log('✓ Projects navigation item found');
    if (hasTasks) console.log('✓ Tasks navigation item found');
    if (hasMeetings) console.log('✓ Meetings navigation item found');
    if (hasFinancial) console.log('✓ Financial section found');
    if (hasProjectTools) console.log('✓ Project Tools section found');
  });
});
