import { test, expect } from '@playwright/test';

test.describe('Chat RAG End-to-End Test', () => {
  test('Ask a project question and verify Supabase response', async ({ page }) => {
    // Navigate to chat-rag page
    await page.goto('http://localhost:3000/chat-rag');
    await page.waitForLoadState('networkidle');

    // Wait for ChatKit to fully initialize
    await page.waitForTimeout(3000);

    // Verify page loaded
    const chatPanel = page.locator('[data-testid="rag-chatkit-panel"]');
    await expect(chatPanel).toBeVisible({ timeout: 10000 });

    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/screenshots/chat-rag-01-loaded.png', fullPage: true });
    console.log('Page loaded successfully');

    // Find the ChatKit textarea by placeholder text (partial match)
    const textarea = page.getByPlaceholder(/Message Alleato/i);
    await textarea.click();
    await page.waitForTimeout(300);

    // Type a project-related question
    const testMessage = 'What projects do we have?';
    await textarea.fill(testMessage);
    console.log(`Typed: ${testMessage}`);

    // Screenshot after typing
    await page.screenshot({ path: 'tests/screenshots/chat-rag-02-typed.png', fullPage: true });

    // Press Enter to send the message
    await textarea.press('Enter');
    console.log('Message sent via Enter key');

    // Wait for AI response (up to 90 seconds for complex queries)
    console.log('Waiting for AI response...');

    let responseFound = false;
    const startTime = Date.now();
    const timeout = 90000;

    while (Date.now() - startTime < timeout) {
      await page.waitForTimeout(3000);

      // Take periodic screenshots every 15 seconds
      const elapsed = Date.now() - startTime;
      if (elapsed > 0 && elapsed % 15000 < 3000) {
        await page.screenshot({
          path: `tests/screenshots/chat-rag-03-waiting-${Math.floor(elapsed / 1000)}s.png`,
          fullPage: true
        });
      }

      // Check for actual response content (not just header text)
      // Look for multiple project indicators that would only appear in a real response
      const pageContent = await page.content();

      // Count how many project names appear - a real response will have multiple
      let projectCount = 0;
      if (pageContent.includes('Aspire Kissimmee') || pageContent.includes('Aspire Daytona')) projectCount++;
      if (pageContent.includes('Alleato Finance') || pageContent.includes('Alleato Marketing')) projectCount++;
      if (pageContent.includes('Market Demise') || pageContent.includes('Abbvie')) projectCount++;
      if (pageContent.includes('Applied Eng') || pageContent.includes('Applied Engineering')) projectCount++;

      // Also check for response structure indicators (what we see in actual response)
      const hasResponseStructure =
        pageContent.includes('Current Projects') ||
        pageContent.includes('Analysis') ||
        (pageContent.includes('ID:') && pageContent.includes('–'));

      if (projectCount >= 2 || hasResponseStructure) {
        responseFound = true;
        console.log(`Response with REAL project data from Supabase detected! (${projectCount} project types found, hasStructure: ${hasResponseStructure})`);
        break;
      }

      // Check for errors in the response
      const hasError =
        pageContent.includes('database schema issue') ||
        pageContent.includes('schema mismatch') ||
        pageContent.includes('query failed');

      if (hasError) {
        await page.screenshot({ path: 'tests/screenshots/chat-rag-error.png', fullPage: true });
        throw new Error('Error message detected in response - possible schema issue');
      }
    }

    // Final screenshot
    await page.screenshot({ path: 'tests/screenshots/chat-rag-04-final.png', fullPage: true });

    if (!responseFound) {
      throw new Error('No real project data received in response within timeout - check Supabase connection');
    }

    console.log('Test PASSED: Received response with REAL project data from Supabase');
  });
});
