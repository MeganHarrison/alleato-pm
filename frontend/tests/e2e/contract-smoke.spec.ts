import { test, expect } from '@playwright/test';

const projectId = 24105;
const clientId = 5;

test.describe('Contract creation smoke', () => {
  test('creates a prime contract via API and verifies UI listing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contractNumber = `PC-${Date.now()}`;
    const title = `Automated Prime Contract ${new Date().toISOString()}`;

    const createResult = await page.evaluate(
      async ({ contractNumber, clientId, projectId, title }) => {
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contract_number: contractNumber,
            title,
            client_id: clientId,
            project_id: projectId,
            status: 'draft',
            original_contract_amount: 2500000,
            executed: false,
            notes: title,
          }),
        });
        const json = await response.json();
        return { ok: response.ok, data: json, status: response.status };
      },
      { contractNumber, clientId, projectId, title }
    );

    if (!createResult.ok) {
      console.error('Contract creation failed', createResult);
    }
    expect(createResult.ok).toBeTruthy();

    await page.goto(`/${projectId}/contracts`);
    await page.waitForLoadState('networkidle');

    const table = page.locator('table').first();
    await expect(table).toContainText(contractNumber);

    await page.screenshot({
      path: 'frontend/tests/screenshots/contract-smoke.png',
      fullPage: true,
    });
  });
});
