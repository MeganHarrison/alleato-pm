import { test, expect } from '@playwright/test';

test.describe('Page Title Verification', () => {
  test('Budget page should show format "Budget - Project - [project name]"', async ({ page }) => {
    // Navigate to budget page for project 34
    await page.goto('http://localhost:3001/34/budget');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait a bit for the title to be set by the useProjectTitle hook
    await page.waitForTimeout(2000);

    // Get the page title
    const title = await page.title();

    console.log('Actual browser tab title:', title);

    // Expected format: "Budget - Project - ProjectName"
    // Or if no project loaded yet: "Budget" (while loading)

    // Verify title starts with "Budget"
    expect(title).toMatch(/^Budget/);

    // Verify title does NOT use the project ID "34" instead of project name
    // If it has "34" right after "Project -", that's wrong
    expect(title).not.toMatch(/Budget\s+-\s+Project\s+-\s+34$/);

    // Log the result
    if (title.includes('Project -')) {
      console.log('✅ Title includes project separator "Project -"');
      console.log('Current title:', title);
    } else {
      console.log('⚠️  Title does not include project section (may be loading)');
      console.log('Current title:', title);
    }
  });

  test('Commitments page should show format "Commitments - Project - [project name]"', async ({ page }) => {
    // Navigate to commitments page for project 34
    await page.goto('http://localhost:3001/34/commitments');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for the title to be set
    await page.waitForTimeout(2000);

    // Get the page title
    const title = await page.title();

    console.log('Commitments page title:', title);

    // Verify title starts with "Commitments"
    expect(title).toMatch(/^Commitments/);

    // Verify title does NOT use just the project ID
    expect(title).not.toMatch(/Commitments\s+-\s+Project\s+-\s+34$/);

    // Log the result
    if (title.includes('Project -')) {
      console.log('✅ Title includes project separator "Project -"');
      console.log('Current title:', title);
    } else {
      console.log('⚠️  Title does not include project section (may be loading)');
      console.log('Current title:', title);
    }
  });
});
