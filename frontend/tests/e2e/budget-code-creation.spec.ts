import { test, expect } from '@playwright/test';

test.describe('Budget Code Creation Flow (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dev login first to authenticate
    await page.goto('http://localhost:3000/dev-login?email=test@example.com&password=testpassword123');
    // Wait for initial redirect
    await page.waitForLoadState('networkidle');
  });

  test('should create a new budget code and use it for a budget line item', async ({ page }) => {
    // Navigate to budget page for project 67
    await page.goto('http://localhost:3000/67/budget');
    await page.waitForLoadState('networkidle');

    // Click the "Create Line Items" button to open the modal
    const createButton = page.locator('button:has-text("Create Line Items")');
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();

    // Wait for modal to open
    await expect(page.locator('text=Create Budget Line Items')).toBeVisible({ timeout: 5000 });

    // Click on the budget code selector for the first row
    const budgetCodeSelector = page.locator('button[role="combobox"]:has-text("Select budget code...")').first();
    await budgetCodeSelector.click();

    // Wait for popover to open
    await page.waitForTimeout(500);

    // Click "Create New Budget Code" option
    const createCodeOption = page.locator('text=Create New Budget Code');
    await expect(createCodeOption).toBeVisible({ timeout: 5000 });
    await createCodeOption.click();

    // Wait for "Create Budget Code" dialog to open
    await expect(page.locator('text=Create New Budget Code').nth(1)).toBeVisible({ timeout: 5000 });

    // Expand first division to see cost codes
    const firstDivision = page.locator('button').filter({ hasText: /^[A-Z]/ }).first();
    await firstDivision.click();
    await page.waitForTimeout(500);

    // Select first cost code under the expanded division
    const firstCostCode = page.locator('button').filter({ hasText: /-/ }).first();
    await firstCostCode.click();

    // Select cost type "L - Labor"
    const costTypeSelector = page.locator('button[role="combobox"]').filter({ hasText: /^R - Contract Revenue/ });
    await costTypeSelector.click();
    await page.waitForTimeout(300);

    const laborOption = page.locator('text=L - Labor');
    await laborOption.click();

    // Take screenshot before creating
    await page.screenshot({ path: 'frontend/tests/screenshots/budget-code-before-create.png', fullPage: true });

    // Click "Create Budget Code" button
    const createBudgetCodeButton = page.locator('button:has-text("Create Budget Code")');
    await createBudgetCodeButton.click();

    // Wait for success toast
    await expect(page.locator('text=Budget code created successfully')).toBeVisible({ timeout: 5000 });

    // Wait for dialog to close
    await page.waitForTimeout(1000);

    // Take screenshot after creating
    await page.screenshot({ path: 'frontend/tests/screenshots/budget-code-after-create.png', fullPage: true });

    // Verify the newly created budget code appears in the selector
    const budgetCodeSelectorAfter = page.locator('button[role="combobox"]').first();
    const selectedText = await budgetCodeSelectorAfter.textContent();

    // Should no longer say "Select budget code..."
    expect(selectedText).not.toContain('Select budget code...');
    expect(selectedText).toContain('.L');

    // Now fill in the rest of the line item details
    const qtyInput = page.locator('input[type="number"][step="0.001"]').first();
    await qtyInput.fill('100');

    const uomSelector = page.locator('button[role="combobox"]').filter({ hasText: 'Select' });
    await uomSelector.click();
    await page.waitForTimeout(300);
    const eaOption = page.locator('text=EA').first();
    await eaOption.click();

    const unitCostInput = page.locator('input[type="number"][step="0.01"]').first();
    await unitCostInput.fill('50');

    // Wait for auto-calculation of amount
    await page.waitForTimeout(500);

    // Verify amount calculated correctly (100 * 50 = 5000)
    const amountInput = page.locator('input[type="number"][step="0.01"]').nth(1);
    const amountValue = await amountInput.inputValue();
    expect(parseFloat(amountValue)).toBe(5000);

    // Take screenshot before submitting
    await page.screenshot({ path: 'frontend/tests/screenshots/budget-line-filled.png', fullPage: true });

    // Click "Create 1 Line Item" button
    const createLineButton = page.locator('button:has-text("Create 1 Line Item")');
    await createLineButton.click();

    // Wait for success toast
    await expect(page.locator('text=Budget line items created')).toBeVisible({ timeout: 5000 });

    // Take screenshot of result
    await page.screenshot({ path: 'frontend/tests/screenshots/budget-line-created.png', fullPage: true });

    console.warn('✅ SUCCESS: Budget code and line item created successfully');
  });
});
