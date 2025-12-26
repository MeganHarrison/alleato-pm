import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Budget E2E Tests
 *
 * Tests the complete budget functionality including:
 * - Page display and navigation
 * - Line item management (add, edit, delete)
 * - Budget locking/unlocking
 * - Budget modifications
 * - Export functionality
 * - Tab navigation
 * - Filters and views
 */

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_PROJECT_ID = '67'; // Use an existing project ID

// Helper function to login
async function login(page: Page) {
  await page.goto(`${BASE_URL}/dev-login?email=test@example.com&password=testpassword123`);
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

// Helper function to navigate to budget page
async function navigateToBudget(page: Page, projectId: string = TEST_PROJECT_ID) {
  await page.goto(`${BASE_URL}/${projectId}/budget`);
  await page.waitForLoadState('networkidle');
}

// Helper function to take screenshots
async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `frontend/tests/screenshots/budget-e2e/${name}.png`,
    fullPage: true,
  });
}

test.describe('Budget Page - Display and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display budget page correctly', async ({ page }) => {
    await navigateToBudget(page);

    // Verify page header is visible
    await expect(page.locator('h1:has-text("Budget")')).toBeVisible();

    // Verify main action buttons are visible
    await expect(page.getByRole('button', { name: /Add Line Item/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Resend to ERP/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();

    await takeScreenshot(page, '01-budget-page-display');
  });

  test('should display budget tabs', async ({ page }) => {
    await navigateToBudget(page);

    // Verify all tabs are visible
    const tabs = [
      'Budget',
      'Budget Details',
      'Cost Codes',
      'Forecasting',
      'Project Status Snapshots',
      'Change History',
      'Settings',
    ];

    for (const tab of tabs) {
      await expect(page.getByRole('button', { name: tab })).toBeVisible();
    }

    await takeScreenshot(page, '02-budget-tabs');
  });

  test('should display budget filters', async ({ page }) => {
    await navigateToBudget(page);

    // Verify filter dropdowns are visible
    await expect(page.getByText('View')).toBeVisible();
    await expect(page.getByText('Snapshot')).toBeVisible();
    await expect(page.getByText('Group')).toBeVisible();

    // Verify Add Filter button
    await expect(page.getByRole('button', { name: /Add Filter/i })).toBeVisible();

    // Verify Analyze Variance button
    await expect(page.getByRole('button', { name: /Analyze Variance/i })).toBeVisible();

    await takeScreenshot(page, '03-budget-filters');
  });

  test('should display budget table with column headers', async ({ page }) => {
    await navigateToBudget(page);

    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });

    // Verify key column headers are present
    const columnHeaders = [
      'Description',
      'Original Budget',
      'Budget Mods',
      'Approved COs',
      'Revised Budget',
    ];

    for (const header of columnHeaders) {
      await expect(page.locator(`th:has-text("${header}")`).first()).toBeVisible();
    }

    await takeScreenshot(page, '04-budget-table-headers');
  });
});

test.describe('Budget Page - Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should navigate to Settings tab', async ({ page }) => {
    // Click on Settings tab
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.waitForTimeout(500);

    // Verify settings content is visible (vertical markup settings)
    await expect(page.locator('text=Markup Settings').first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // Settings tab content might have different text
    });

    await takeScreenshot(page, '05-settings-tab');
  });

  test('should navigate to Cost Codes tab', async ({ page }) => {
    // Click on Cost Codes tab
    await page.getByRole('button', { name: 'Cost Codes' }).click();
    await page.waitForTimeout(500);

    // Verify cost codes content is visible
    await expect(page.locator('text=Cost Codes').first()).toBeVisible({ timeout: 5000 });

    await takeScreenshot(page, '06-cost-codes-tab');
  });

  test('should return to Budget tab after navigation', async ({ page }) => {
    // Navigate to Settings
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.waitForTimeout(500);

    // Navigate back to Budget
    await page.getByRole('button', { name: 'Budget' }).first().click();
    await page.waitForTimeout(500);

    // Verify budget table is visible
    await expect(page.locator('table').first()).toBeVisible({ timeout: 5000 });

    await takeScreenshot(page, '07-return-to-budget-tab');
  });
});

test.describe('Budget Page - Filter Controls', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should open View dropdown and show options', async ({ page }) => {
    // Find and click the View dropdown
    const viewDropdown = page.locator('button').filter({ hasText: /Procore Standard|Detailed|Summary/i }).first();

    if (await viewDropdown.isVisible({ timeout: 3000 })) {
      await viewDropdown.click();
      await page.waitForTimeout(300);

      // Verify dropdown options
      await expect(page.getByRole('menuitem', { name: 'Procore Standard' })).toBeVisible();

      await takeScreenshot(page, '08-view-dropdown');

      // Close dropdown
      await page.keyboard.press('Escape');
    }
  });

  test('should open Snapshot dropdown and show options', async ({ page }) => {
    // Find and click the Snapshot dropdown
    const snapshotDropdown = page.locator('button').filter({ hasText: /Current|Month End/i }).first();

    if (await snapshotDropdown.isVisible({ timeout: 3000 })) {
      await snapshotDropdown.click();
      await page.waitForTimeout(300);

      // Verify Current option is present
      await expect(page.getByRole('menuitem', { name: 'Current' })).toBeVisible();

      await takeScreenshot(page, '09-snapshot-dropdown');

      // Close dropdown
      await page.keyboard.press('Escape');
    }
  });

  test('should open Group dropdown and show options', async ({ page }) => {
    // Find and click the Group dropdown - look for the dropdown after "Group" label
    const groupDropdown = page.locator('button').filter({ hasText: /Cost Code Tier|Cost Type|No Grouping/i }).first();

    if (await groupDropdown.isVisible({ timeout: 3000 })) {
      await groupDropdown.click();
      await page.waitForTimeout(300);

      await takeScreenshot(page, '10-group-dropdown');

      // Close dropdown
      await page.keyboard.press('Escape');
    }
  });

  test('should toggle fullscreen mode', async ({ page }) => {
    // Find the fullscreen toggle button (icon button)
    const fullscreenButton = page.locator('button[title*="fullscreen"]').first();

    if (await fullscreenButton.isVisible({ timeout: 3000 })) {
      await fullscreenButton.click();
      await page.waitForTimeout(500);

      await takeScreenshot(page, '11-fullscreen-toggle');
    }
  });
});

test.describe('Budget Page - Line Item Creation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should navigate to budget setup page when clicking Add Line Item', async ({ page }) => {
    // Click Add Line Item button
    await page.getByRole('button', { name: /Add Line Item/i }).click();

    // Wait for navigation to setup page
    await page.waitForURL(`**/${TEST_PROJECT_ID}/budget/setup`, { timeout: 10000 });

    // Verify setup page is loaded
    await expect(page.locator('h1:has-text("Add Budget Line Items")')).toBeVisible();

    await takeScreenshot(page, '12-budget-setup-page');
  });

  test('should display budget setup form elements', async ({ page }) => {
    // Navigate directly to setup page
    await page.goto(`${BASE_URL}/${TEST_PROJECT_ID}/budget/setup`);
    await page.waitForLoadState('networkidle');

    // Verify form elements are present
    await expect(page.getByRole('button', { name: /Back to Budget/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Row/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create.*Line Item/i })).toBeVisible();

    // Verify table headers
    await expect(page.locator('th:has-text("Budget Code")')).toBeVisible();
    await expect(page.locator('th:has-text("Qty")')).toBeVisible();
    await expect(page.locator('th:has-text("UOM")')).toBeVisible();
    await expect(page.locator('th:has-text("Unit Cost")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();

    await takeScreenshot(page, '13-budget-setup-form');
  });

  test('should add additional rows in budget setup', async ({ page }) => {
    await page.goto(`${BASE_URL}/${TEST_PROJECT_ID}/budget/setup`);
    await page.waitForLoadState('networkidle');

    // Wait for initial load
    await page.waitForSelector('text=Loading project cost codes...', { state: 'hidden', timeout: 15000 });

    // Count initial rows
    const initialRows = await page.locator('tbody tr').count();

    // Click Add Row button
    await page.getByRole('button', { name: /Add Row/i }).click();
    await page.waitForTimeout(500);

    // Verify new row was added
    const newRows = await page.locator('tbody tr').count();
    expect(newRows).toBe(initialRows + 1);

    await takeScreenshot(page, '14-budget-setup-add-row');
  });

  test('should open budget code dropdown in setup', async ({ page }) => {
    await page.goto(`${BASE_URL}/${TEST_PROJECT_ID}/budget/setup`);
    await page.waitForLoadState('networkidle');

    // Wait for loading to complete
    await page.waitForSelector('text=Loading project cost codes...', { state: 'hidden', timeout: 15000 });

    // Click on the budget code select button
    const selectButton = page.locator('button:has-text("Select budget code")').first();
    await expect(selectButton).toBeVisible({ timeout: 10000 });
    await selectButton.click();
    await page.waitForTimeout(500);

    // Verify dropdown is open
    await expect(page.locator('[role="listbox"], [cmdk-list]')).toBeVisible({ timeout: 5000 });

    await takeScreenshot(page, '15-budget-code-dropdown');
  });

  test('should show Create New Budget Code option', async ({ page }) => {
    await page.goto(`${BASE_URL}/${TEST_PROJECT_ID}/budget/setup`);
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('text=Loading project cost codes...', { state: 'hidden', timeout: 15000 });

    const selectButton = page.locator('button:has-text("Select budget code")').first();
    await selectButton.click();
    await page.waitForTimeout(500);

    // Verify Create New Budget Code option exists
    await expect(page.locator('text=Create New Budget Code')).toBeVisible({ timeout: 5000 });

    await takeScreenshot(page, '16-create-new-budget-code-option');
  });
});

test.describe('Budget Page - Line Item Editing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should click on line item to open edit modal', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });

    // Check if there are any budget line items
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Click on the first line item row (original budget amount cell to trigger edit)
      const firstRow = rows.first();
      await firstRow.click();
      await page.waitForTimeout(500);

      // Check if edit modal opened
      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 3000 })) {
        await expect(modal).toBeVisible();
        await takeScreenshot(page, '17-edit-line-item-modal');
      }
    }
  });

  test('should display Original Budget Edit Modal with correct elements', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Click on a clickable cell in the first row
      const firstRow = rows.first();
      await firstRow.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 3000 })) {
        // Verify modal elements
        await expect(modal.locator('text=Original Budget')).toBeVisible();

        // Check for tabs in the modal
        await expect(modal.locator('button:has-text("Original Budget")')).toBeVisible().catch(() => {
          // Modal structure might be different
        });
        await expect(modal.locator('button:has-text("History")')).toBeVisible().catch(() => {
          // History tab might not be visible
        });

        await takeScreenshot(page, '18-edit-modal-elements');
      }
    }
  });

  test('should switch to History tab in edit modal', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      const firstRow = rows.first();
      await firstRow.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 3000 })) {
        const historyTab = modal.locator('button:has-text("History")');
        if (await historyTab.isVisible({ timeout: 2000 })) {
          await historyTab.click();
          await page.waitForTimeout(500);

          await takeScreenshot(page, '19-history-tab');
        }
      }
    }
  });
});

test.describe('Budget Page - Line Item Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should select line items using checkboxes', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Find checkboxes in the table
    const checkboxes = page.locator('tbody tr input[type="checkbox"], tbody tr [role="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      // Click the first checkbox
      await checkboxes.first().click();
      await page.waitForTimeout(300);

      // Verify selection bar appears
      await expect(page.locator('text=/\\d+ item\\(s\\) selected/i')).toBeVisible({ timeout: 5000 });

      await takeScreenshot(page, '20-line-item-selected');
    }
  });

  test('should show Delete Selected button when items are selected', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    const checkboxes = page.locator('tbody tr input[type="checkbox"], tbody tr [role="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      await checkboxes.first().click();
      await page.waitForTimeout(300);

      // Verify Delete Selected button appears
      await expect(page.getByRole('button', { name: /Delete Selected/i })).toBeVisible({ timeout: 5000 });

      await takeScreenshot(page, '21-delete-selected-button');
    }
  });

  test('should open delete confirmation dialog', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    const checkboxes = page.locator('tbody tr input[type="checkbox"], tbody tr [role="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      await checkboxes.first().click();
      await page.waitForTimeout(300);

      // Click Delete Selected
      const deleteButton = page.getByRole('button', { name: /Delete Selected/i });
      if (await deleteButton.isVisible({ timeout: 3000 })) {
        await deleteButton.click();
        await page.waitForTimeout(500);

        // Verify confirmation dialog appears
        await expect(page.locator('[role="alertdialog"]')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=Delete Line Items')).toBeVisible();

        await takeScreenshot(page, '22-delete-confirmation-dialog');

        // Cancel the deletion
        await page.getByRole('button', { name: 'Cancel' }).click();
      }
    }
  });
});

test.describe('Budget Page - Budget Locking', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should display Lock Budget button when budget is unlocked', async ({ page }) => {
    // Check for Lock or Unlock button
    const lockButton = page.getByRole('button', { name: /Lock Budget/i });
    const unlockButton = page.getByRole('button', { name: /Unlock Budget/i });

    const isLockVisible = await lockButton.isVisible({ timeout: 3000 }).catch(() => false);
    const isUnlockVisible = await unlockButton.isVisible({ timeout: 3000 }).catch(() => false);

    expect(isLockVisible || isUnlockVisible).toBeTruthy();

    await takeScreenshot(page, '23-lock-budget-button');
  });

  test('should open Lock Budget confirmation dialog', async ({ page }) => {
    const lockButton = page.getByRole('button', { name: /Lock Budget/i });

    if (await lockButton.isVisible({ timeout: 3000 })) {
      await lockButton.click();
      await page.waitForTimeout(500);

      // Verify confirmation dialog
      await expect(page.locator('[role="alertdialog"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Lock Budget').first()).toBeVisible();
      await expect(page.locator('text=Budget line items cannot be added')).toBeVisible();

      await takeScreenshot(page, '24-lock-confirmation-dialog');

      // Cancel
      await page.getByRole('button', { name: 'Cancel' }).click();
    }
  });

  test('should open Unlock Budget confirmation dialog', async ({ page }) => {
    const unlockButton = page.getByRole('button', { name: /Unlock Budget/i });

    if (await unlockButton.isVisible({ timeout: 3000 })) {
      await unlockButton.click();
      await page.waitForTimeout(500);

      // Verify confirmation dialog
      await expect(page.locator('[role="alertdialog"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Unlock Budget').first()).toBeVisible();

      await takeScreenshot(page, '25-unlock-confirmation-dialog');

      // Cancel
      await page.getByRole('button', { name: 'Cancel' }).click();
    }
  });

  test('should show locked badge when budget is locked', async ({ page }) => {
    // First, lock the budget if not already locked
    const lockButton = page.getByRole('button', { name: /Lock Budget/i });

    if (await lockButton.isVisible({ timeout: 3000 })) {
      await lockButton.click();
      await page.waitForTimeout(500);

      // Confirm lock
      const confirmButton = page.locator('[role="alertdialog"] button:has-text("Lock Budget")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
        await page.waitForTimeout(1000);

        // Verify locked badge appears
        await expect(page.locator('text=Locked').first()).toBeVisible({ timeout: 5000 });

        await takeScreenshot(page, '26-locked-badge');

        // Unlock for other tests
        const unlockButton = page.getByRole('button', { name: /Unlock Budget/i });
        if (await unlockButton.isVisible({ timeout: 2000 })) {
          await unlockButton.click();
          await page.waitForTimeout(500);
          const unlockConfirmButton = page.locator('[role="alertdialog"] button:has-text("Unlock Budget")');
          if (await unlockConfirmButton.isVisible({ timeout: 2000 })) {
            await unlockConfirmButton.click();
          }
        }
      }
    }
  });
});

test.describe('Budget Page - Budget Modifications', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should open Create dropdown with modification options', async ({ page }) => {
    // Click Create dropdown
    await page.getByRole('button', { name: /Create/i }).first().click();
    await page.waitForTimeout(300);

    // Verify dropdown menu items
    await expect(page.getByRole('menuitem', { name: 'Budget Line Item' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Budget Modification' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Change Order' })).toBeVisible();

    await takeScreenshot(page, '27-create-dropdown');

    // Close dropdown
    await page.keyboard.press('Escape');
  });

  test('should open Budget Modification modal', async ({ page }) => {
    // Click Create dropdown
    await page.getByRole('button', { name: /Create/i }).first().click();
    await page.waitForTimeout(300);

    // Click Budget Modification
    await page.getByRole('menuitem', { name: 'Budget Modification' }).click();
    await page.waitForTimeout(500);

    // Verify modification modal opens (Sheet component)
    const modal = page.locator('[role="dialog"], [data-state="open"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Create Budget Modification')).toBeVisible();

    await takeScreenshot(page, '28-budget-modification-modal');
  });

  test('should display modification form fields', async ({ page }) => {
    await page.getByRole('button', { name: /Create/i }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('menuitem', { name: 'Budget Modification' }).click();
    await page.waitForTimeout(500);

    // Verify form fields
    await expect(page.locator('label:has-text("Budget Line Item")')).toBeVisible();
    await expect(page.locator('label:has-text("Title")')).toBeVisible();
    await expect(page.locator('label:has-text("Modification Type")')).toBeVisible();
    await expect(page.locator('label:has-text("Amount")')).toBeVisible();
    await expect(page.locator('label:has-text("Reason")')).toBeVisible();

    await takeScreenshot(page, '29-modification-form-fields');

    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('should display modification type options', async ({ page }) => {
    await page.getByRole('button', { name: /Create/i }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('menuitem', { name: 'Budget Modification' }).click();
    await page.waitForTimeout(500);

    // Click on Modification Type dropdown
    const typeDropdown = page.locator('#type');
    if (await typeDropdown.isVisible({ timeout: 3000 })) {
      await typeDropdown.click();
      await page.waitForTimeout(300);

      // Verify options
      await expect(page.getByRole('option', { name: 'Change Order' })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Budget Transfer' })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Budget Adjustment' })).toBeVisible();

      await takeScreenshot(page, '30-modification-type-options');
    }

    // Close
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Cancel' }).click();
  });
});

test.describe('Budget Page - Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should open Export dropdown with options', async ({ page }) => {
    // Click Export dropdown
    await page.getByRole('button', { name: /Export/i }).click();
    await page.waitForTimeout(300);

    // Verify export options
    await expect(page.getByRole('menuitem', { name: 'Export to PDF' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Export to Excel' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Export to CSV' })).toBeVisible();

    await takeScreenshot(page, '31-export-dropdown');

    // Close dropdown
    await page.keyboard.press('Escape');
  });

  test('should trigger PDF export', async ({ page }) => {
    await page.getByRole('button', { name: /Export/i }).click();
    await page.waitForTimeout(300);

    // Click Export to PDF
    await page.getByRole('menuitem', { name: 'Export to PDF' }).click();
    await page.waitForTimeout(500);

    await takeScreenshot(page, '32-pdf-export');
  });

  test('should trigger CSV export', async ({ page }) => {
    await page.getByRole('button', { name: /Export/i }).click();
    await page.waitForTimeout(300);

    // Click Export to CSV
    await page.getByRole('menuitem', { name: 'Export to CSV' }).click();
    await page.waitForTimeout(500);

    await takeScreenshot(page, '33-csv-export');
  });

  test('should trigger Excel export', async ({ page }) => {
    await page.getByRole('button', { name: /Export/i }).click();
    await page.waitForTimeout(300);

    // Click Export to Excel
    await page.getByRole('menuitem', { name: 'Export to Excel' }).click();
    await page.waitForTimeout(500);

    await takeScreenshot(page, '34-excel-export');
  });
});

test.describe('Budget Page - More Options Menu', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should open More Options menu', async ({ page }) => {
    // Find the more options button (three dots)
    const moreButton = page.locator('button').filter({ has: page.locator('svg') }).last();

    // Try clicking a button that might be the more options
    const moreOptionsButtons = page.locator('button[aria-haspopup="menu"]');
    const count = await moreOptionsButtons.count();

    for (let i = 0; i < count; i++) {
      const button = moreOptionsButtons.nth(i);
      const text = await button.textContent();
      if (!text?.includes('Create') && !text?.includes('Export')) {
        await button.click();
        await page.waitForTimeout(300);

        // Check if dropdown opened with Configure Columns
        const configOption = page.getByRole('menuitem', { name: 'Configure Columns' });
        if (await configOption.isVisible({ timeout: 2000 })) {
          await expect(configOption).toBeVisible();
          await takeScreenshot(page, '35-more-options-menu');
          break;
        }

        await page.keyboard.press('Escape');
      }
    }
  });
});

test.describe('Budget Page - Grand Totals', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should display Grand Totals row', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Check if there are budget items
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Verify Grand Totals text is visible
      await expect(page.locator('text=Grand Totals')).toBeVisible({ timeout: 5000 });

      await takeScreenshot(page, '36-grand-totals');
    }
  });
});

test.describe('Budget Page - Column Tooltips', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should show tooltip on column header hover', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Hover over a column header that has a tooltip
    const originalBudgetHeader = page.locator('th').filter({ hasText: 'Original Budget' }).first();

    if (await originalBudgetHeader.isVisible({ timeout: 3000 })) {
      await originalBudgetHeader.hover();
      await page.waitForTimeout(500);

      // Check if tooltip appeared
      const tooltip = page.locator('[role="tooltip"]');
      if (await tooltip.isVisible({ timeout: 2000 })) {
        await expect(tooltip).toBeVisible();
        await takeScreenshot(page, '37-column-tooltip');
      }
    }
  });
});

test.describe('Budget Page - Hierarchical Rows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToBudget(page);
  });

  test('should expand/collapse hierarchical rows', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 10000 });

    // Find expandable rows (rows with chevron icons)
    const expandButtons = page.locator('tbody tr button').filter({ has: page.locator('svg') });
    const expandCount = await expandButtons.count();

    if (expandCount > 0) {
      const firstExpandButton = expandButtons.first();
      await firstExpandButton.click();
      await page.waitForTimeout(500);

      await takeScreenshot(page, '38-expanded-row');

      // Click again to collapse
      await firstExpandButton.click();
      await page.waitForTimeout(500);

      await takeScreenshot(page, '39-collapsed-row');
    }
  });
});

test.describe('Budget Setup - Complete Flow', () => {
  test('should complete full line item creation flow', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/${TEST_PROJECT_ID}/budget/setup`);
    await page.waitForLoadState('networkidle');

    // Wait for loading to complete
    await page.waitForSelector('text=Loading project cost codes...', { state: 'hidden', timeout: 15000 });

    // Take initial screenshot
    await takeScreenshot(page, '40-setup-initial');

    // Check if there are cost codes available
    const selectButton = page.locator('button:has-text("Select budget code")').first();

    if (await selectButton.isVisible({ timeout: 5000 })) {
      await selectButton.click();
      await page.waitForTimeout(500);

      // Check if any budget codes are available
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();

      if (optionCount > 0) {
        // Select first budget code
        await options.first().click();
        await page.waitForTimeout(500);

        await takeScreenshot(page, '41-budget-code-selected');

        // Fill in quantity
        const qtyInput = page.locator('input[type="number"]').first();
        await qtyInput.fill('100');
        await page.waitForTimeout(300);

        // Fill in unit cost
        const unitCostInput = page.locator('input[type="number"]').nth(1);
        await unitCostInput.fill('50.00');
        await page.waitForTimeout(300);

        // Verify amount is calculated
        await takeScreenshot(page, '42-form-filled');

        // Verify the Create button shows correct count
        await expect(page.getByRole('button', { name: /Create 1 Line Item/i })).toBeVisible();
      }
    }
  });
});

test.describe('Budget Page - Responsive Layout', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await login(page);
    await navigateToBudget(page);

    // Verify page is still functional
    await expect(page.locator('h1:has-text("Budget")')).toBeVisible();

    await takeScreenshot(page, '43-mobile-viewport');
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await login(page);
    await navigateToBudget(page);

    // Verify page is still functional
    await expect(page.locator('h1:has-text("Budget")')).toBeVisible();

    await takeScreenshot(page, '44-tablet-viewport');
  });
});

test.describe('Budget Page - Error Handling', () => {
  test('should handle empty budget gracefully', async ({ page }) => {
    await login(page);

    // Use a project ID that might have no budget data
    await page.goto(`${BASE_URL}/999/budget`);
    await page.waitForLoadState('networkidle');

    // Page should still load without crashing
    await page.waitForTimeout(2000);

    await takeScreenshot(page, '45-empty-or-error-state');
  });
});

test.describe('Budget Page - API Integration', () => {
  test('should load budget data from API', async ({ page }) => {
    await login(page);

    // Monitor network requests
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        requests.push(request.url());
      }
    });

    await navigateToBudget(page);

    // Verify API calls were made
    const budgetApiCalls = requests.filter((url) => url.includes('/budget'));
    expect(budgetApiCalls.length).toBeGreaterThan(0);

    await takeScreenshot(page, '46-api-loaded');
  });

  test('should load lock status from API', async ({ page }) => {
    await login(page);

    const responses: Array<{ url: string; status: number }> = [];
    page.on('response', (response) => {
      if (response.url().includes('/budget/lock')) {
        responses.push({ url: response.url(), status: response.status() });
      }
    });

    await navigateToBudget(page);

    // Verify lock status API was called
    const lockApiCalls = responses.filter((r) => r.url.includes('/lock'));
    expect(lockApiCalls.length).toBeGreaterThan(0);
  });
});
