import { test, expect } from '@playwright/test';

test.describe('New Pages - Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Use mock login to bypass authentication
    await page.goto('http://localhost:3000/mock-login?redirect=/projects');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Punch List Page', () => {
    test('should display punch list page with table and summary cards', async ({ page }) => {
      await page.goto('http://localhost:3000/punch-list');
      await page.waitForSelector('h1:has-text("Punch List")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Punch List');

      // Check Create button
      const createButton = await page.locator('button:has-text("Create Item")');
      expect(await createButton.isVisible()).toBe(true);

      // Check summary cards
      const summaryCards = await page.locator('.bg-white.rounded-lg.border').count();
      expect(summaryCards).toBeGreaterThanOrEqual(4);

      // Check table exists
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      await page.screenshot({ path: 'tests/screenshots/punch-list-page.png', fullPage: true });
    });

    test('should filter punch list items', async ({ page }) => {
      await page.goto('http://localhost:3000/punch-list');
      await page.waitForSelector('table', { timeout: 10000 });

      // Check search functionality
      const searchInput = await page.locator('input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: 'tests/screenshots/punch-list-filtered.png', fullPage: true });
    });
  });

  test.describe('RFIs Page', () => {
    test('should display RFIs page with table', async ({ page }) => {
      await page.goto('http://localhost:3000/rfis');
      await page.waitForSelector('h1:has-text("RFIs")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('RFIs');

      // Check Create button
      const createButton = await page.locator('button:has-text("Create RFI")');
      expect(await createButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      // Check for RFI number column
      const headers = await page.locator('thead th').allTextContents();
      expect(headers.some(h => h.includes('RFI'))).toBe(true);

      await page.screenshot({ path: 'tests/screenshots/rfis-page.png', fullPage: true });
    });
  });

  test.describe('Submittals Page', () => {
    test('should display Submittals page with table', async ({ page }) => {
      await page.goto('http://localhost:3000/submittals');
      await page.waitForSelector('h1:has-text("Submittals")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Submittals');

      // Check Create button
      const createButton = await page.locator('button:has-text("Create Submittal")');
      expect(await createButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      await page.screenshot({ path: 'tests/screenshots/submittals-page.png', fullPage: true });
    });
  });

  test.describe('Daily Log Page', () => {
    test('should display Daily Log page with table', async ({ page }) => {
      await page.goto('http://localhost:3000/daily-log');
      await page.waitForSelector('h1:has-text("Daily Log")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Daily Log');

      // Check Create button
      const createButton = await page.locator('button:has-text("Add Entry")');
      expect(await createButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      // Check for weather icons (unique to daily log)
      const weatherIcons = await page.locator('svg').count();
      expect(weatherIcons).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/daily-log-page.png', fullPage: true });
    });
  });

  test.describe('Photos Page', () => {
    test('should display Photos page with grid view', async ({ page }) => {
      await page.goto('http://localhost:3000/photos');
      await page.waitForSelector('h1:has-text("Photos")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Photos');

      // Check Upload button
      const uploadButton = await page.locator('button:has-text("Upload Photos")');
      expect(await uploadButton.isVisible()).toBe(true);

      // Check view toggle buttons
      const gridButton = await page.locator('button[aria-label="Grid view"]');
      const listButton = await page.locator('button[aria-label="List view"]');
      expect(await gridButton.isVisible()).toBe(true);
      expect(await listButton.isVisible()).toBe(true);

      await page.screenshot({ path: 'tests/screenshots/photos-page-grid.png', fullPage: true });
    });

    test('should toggle between grid and list view', async ({ page }) => {
      await page.goto('http://localhost:3000/photos');
      await page.waitForSelector('h1', { timeout: 10000 });

      // Click list view
      const listButton = await page.locator('button[aria-label="List view"]');
      await listButton.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: 'tests/screenshots/photos-page-list.png', fullPage: true });

      // Click grid view
      const gridButton = await page.locator('button[aria-label="Grid view"]');
      await gridButton.click();
      await page.waitForTimeout(500);
    });
  });

  test.describe('Drawings Page', () => {
    test('should display Drawings page with table', async ({ page }) => {
      await page.goto('http://localhost:3000/drawings');
      await page.waitForSelector('h1:has-text("Drawings")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Drawings');

      // Check Upload button
      const uploadButton = await page.locator('button:has-text("Upload Drawing")');
      expect(await uploadButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      // Check for discipline badges
      const badges = await page.locator('.bg-blue-100, .bg-green-100, .bg-purple-100').count();
      expect(badges).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/drawings-page.png', fullPage: true });
    });
  });

  test.describe('Emails Page', () => {
    test('should display Emails page with table', async ({ page }) => {
      await page.goto('http://localhost:3000/emails');
      await page.waitForSelector('h1:has-text("Emails")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Emails');

      // Check Compose button
      const composeButton = await page.locator('button:has-text("Compose")');
      expect(await composeButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      // Check for mail icons (unique to emails)
      const mailIcons = await page.locator('svg').count();
      expect(mailIcons).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/emails-page.png', fullPage: true });
    });
  });

  test.describe('Company Directory Page', () => {
    test('should display Company Directory with table', async ({ page }) => {
      await page.goto('http://localhost:3000/directory/companies');
      await page.waitForSelector('h1:has-text("Company Directory")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Company Directory');

      // Check Add button
      const addButton = await page.locator('button:has-text("Add Company")');
      expect(await addButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      // Check for company type badges
      const badges = await page.locator('.bg-blue-100, .bg-green-100, .bg-orange-100').count();
      expect(badges).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/company-directory-page.png', fullPage: true });
    });
  });

  test.describe('Client Directory Page', () => {
    test('should display Client Directory with table', async ({ page }) => {
      await page.goto('http://localhost:3000/directory/clients');
      await page.waitForSelector('h1:has-text("Client Directory")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Client Directory');

      // Check Add button
      const addButton = await page.locator('button:has-text("Add Client")');
      expect(await addButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      await page.screenshot({ path: 'tests/screenshots/client-directory-page.png', fullPage: true });
    });
  });

  test.describe('User Directory Page', () => {
    test('should display User Directory with table', async ({ page }) => {
      await page.goto('http://localhost:3000/directory/users');
      await page.waitForSelector('h1:has-text("User Directory")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('User Directory');

      // Check Add button
      const addButton = await page.locator('button:has-text("Add User")');
      expect(await addButton.isVisible()).toBe(true);

      // Check table
      const table = await page.locator('table');
      expect(await table.isVisible()).toBe(true);

      // Check for avatars (unique to users)
      const avatars = await page.locator('[class*="avatar"]').count();
      expect(avatars).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/user-directory-page.png', fullPage: true });
    });
  });

  test.describe('Tasks Page', () => {
    test('should display Tasks page with Kanban board', async ({ page }) => {
      await page.goto('http://localhost:3000/tasks');
      await page.waitForSelector('h1:has-text("Tasks")', { timeout: 10000 });

      // Check header
      const header = await page.locator('h1').textContent();
      expect(header).toContain('Tasks');

      // Check Create button
      const createButton = await page.locator('button:has-text("Create Task")');
      expect(await createButton.isVisible()).toBe(true);

      // Check for Kanban columns
      const todoColumn = await page.locator('h2:has-text("To Do")');
      const inProgressColumn = await page.locator('h2:has-text("In Progress")');
      const reviewColumn = await page.locator('h2:has-text("Review")');
      const doneColumn = await page.locator('h2:has-text("Done")');

      expect(await todoColumn.isVisible()).toBe(true);
      expect(await inProgressColumn.isVisible()).toBe(true);
      expect(await reviewColumn.isVisible()).toBe(true);
      expect(await doneColumn.isVisible()).toBe(true);

      // Check for task cards
      const taskCards = await page.locator('.bg-white.border.rounded-lg').count();
      expect(taskCards).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/tasks-page.png', fullPage: true });
    });

    test('should display task cards with correct information', async ({ page }) => {
      await page.goto('http://localhost:3000/tasks');
      await page.waitForSelector('.bg-white.border.rounded-lg', { timeout: 10000 });

      // Get first task card
      const firstCard = await page.locator('.bg-white.border.rounded-lg').first();

      // Check for task title
      const title = await firstCard.locator('h3').textContent();
      expect(title).toBeTruthy();

      // Check for priority badge
      const priorityBadge = await firstCard.locator('[class*="bg-red-100"], [class*="bg-yellow-100"], [class*="bg-gray-100"]').count();
      expect(priorityBadge).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/tasks-card-detail.png', fullPage: true });
    });
  });

  test.describe('All Pages - Common Functionality', () => {
    const pages = [
      { url: '/punch-list', name: 'Punch List' },
      { url: '/rfis', name: 'RFIs' },
      { url: '/submittals', name: 'Submittals' },
      { url: '/daily-log', name: 'Daily Log' },
      { url: '/drawings', name: 'Drawings' },
      { url: '/emails', name: 'Emails' },
      { url: '/directory/companies', name: 'Company Directory' },
      { url: '/directory/clients', name: 'Client Directory' },
      { url: '/directory/users', name: 'User Directory' },
    ];

    pages.forEach(({ url, name }) => {
      test(`${name} should have action dropdown menus`, async ({ page }) => {
        await page.goto(`http://localhost:3000${url}`);
        await page.waitForSelector('table', { timeout: 10000 });

        // Look for dropdown trigger buttons
        const dropdownTriggers = await page.locator('button:has(svg)').count();
        expect(dropdownTriggers).toBeGreaterThan(0);
      });

      test(`${name} should have summary cards`, async ({ page }) => {
        await page.goto(`http://localhost:3000${url}`);
        await page.waitForSelector('.bg-white.rounded-lg.border', { timeout: 10000 });

        const summaryCards = await page.locator('.bg-white.rounded-lg.border').count();
        expect(summaryCards).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
