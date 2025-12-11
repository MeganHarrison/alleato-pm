import { test, expect } from '@playwright/test';

test('Project home page displays real data from Supabase', async ({ page }) => {
  // Navigate directly to a project page without auth (for testing)
  // Using project ID from the actual data
  await page.goto('http://localhost:3004/14/home');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if project title is displayed (not the hardcoded one)
  const title = await page.locator('h1').textContent();
  expect(title).not.toBe('Westfield Collective 24-115');
  
  // Check if the Overview card has real data
  const overviewCard = page.locator('text=OVERVIEW').locator('..');
  
  // Check for client field
  await expect(overviewCard.locator('text=Client:')).toBeVisible();
  const clientText = await overviewCard.locator('text=Client:').locator('..').textContent();
  expect(clientText).toContain('Client:');
  
  // Check for status field  
  await expect(overviewCard.locator('text=Status:')).toBeVisible();
  
  // Check for dates
  await expect(overviewCard.locator('text=Start Date:')).toBeVisible();
  await expect(overviewCard.locator('text=Est Completion:')).toBeVisible();
  
  // Check if Financials card exists
  const financialsCard = page.locator('text=FINANCIALS').locator('..');
  await expect(financialsCard).toBeVisible();
  
  // Check for financial fields
  await expect(financialsCard.locator('text=Est Revenue:')).toBeVisible();
  await expect(financialsCard.locator('text=Est Profit:')).toBeVisible();
  
  // Check if Summary section exists
  await expect(page.locator('text=Summary').first()).toBeVisible();
  
  // Check if Project Insights section exists
  await expect(page.locator('text=Project Insights:')).toBeVisible();
  
  // Check if Tasks section exists
  await expect(page.locator('text=Tasks').first()).toBeVisible();
  
  // Check if the tabbed section exists
  await expect(page.locator('text=Meetings').first()).toBeVisible();
  await expect(page.locator('text=Change Orders')).toBeVisible();
  
  // Click on Meetings tab to see if it has content
  await page.locator('[role="tab"]:has-text("Meetings")').click();
  await page.waitForTimeout(500);
  
  // Check for table headers in meetings
  const meetingsContent = page.locator('[role="tabpanel"]').first();
  const hasNoMeetings = await meetingsContent.locator('text=No meetings recorded yet.').isVisible().catch(() => false);
  
  if (!hasNoMeetings) {
    await expect(meetingsContent.locator('th:has-text("Title")')).toBeVisible();
    await expect(meetingsContent.locator('th:has-text("Summary")')).toBeVisible();
    await expect(meetingsContent.locator('th:has-text("Date")')).toBeVisible();
  }
  
  // Click on Change Orders tab
  await page.locator('[role="tab"]:has-text("Change Orders")').click();
  await page.waitForTimeout(500);
  
  // Check for change orders content
  const changeOrdersContent = page.locator('[role="tabpanel"]').filter({ hasText: /Change Orders|No change orders/ });
  const hasNoChangeOrders = await changeOrdersContent.locator('text=No change orders yet.').isVisible().catch(() => false);
  
  if (!hasNoChangeOrders) {
    await expect(changeOrdersContent.locator('th:has-text("Number")')).toBeVisible();
    await expect(changeOrdersContent.locator('th:has-text("Title")')).toBeVisible();
    await expect(changeOrdersContent.locator('th:has-text("Amount")')).toBeVisible();
  }
});