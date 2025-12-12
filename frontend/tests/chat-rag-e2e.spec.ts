import { test, expect } from '@playwright/test';

test.describe('Chat RAG End-to-End Test', () => {
  test('Chat component renders and sends messages', async ({ page }) => {
    // Navigate to chat-rag page
    await page.goto('http://localhost:3000/chat-rag');
    await page.waitForLoadState('networkidle');

    // Wait for the SimpleRagChat component to load
    const chatPanel = page.locator('[data-testid="simple-rag-chat"]');
    await expect(chatPanel).toBeVisible({ timeout: 10000 });

    // Verify the heading is visible
    const heading = page.getByText('Alleato AI Assistant');
    await expect(heading).toBeVisible();

    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/screenshots/chat-rag-01-loaded.png', fullPage: true });
    console.log('Page loaded successfully');

    // Find the textarea by placeholder text
    const textarea = page.getByPlaceholder(/Ask about your projects/i);
    await expect(textarea).toBeVisible();
    await textarea.click();

    // Type a project-related question
    const testMessage = 'What projects do we have?';
    await textarea.fill(testMessage);
    console.log(`Typed: ${testMessage}`);

    // Screenshot after typing
    await page.screenshot({ path: 'tests/screenshots/chat-rag-02-typed.png', fullPage: true });

    // Click the send button (or press Enter)
    const sendButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    await sendButton.click();
    console.log('Message sent via button click');

    // Wait for loading spinner to appear (indicates message was sent)
    const loadingIndicator = page.locator('.animate-spin');

    // Wait for loading to appear and then disappear (response received)
    try {
      await loadingIndicator.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Loading indicator visible - request in progress');
    } catch {
      console.log('Loading indicator not found - may have already completed');
    }

    // Wait for response (up to 60 seconds for agent processing)
    console.log('Waiting for AI response...');

    let responseFound = false;
    const startTime = Date.now();
    const timeout = 60000;

    while (Date.now() - startTime < timeout) {
      await page.waitForTimeout(2000);

      // Check for assistant message bubble (bg-gray-100 class in assistant messages)
      const assistantMessages = await page.locator('.bg-gray-100.rounded-2xl').count();

      if (assistantMessages > 0) {
        responseFound = true;
        console.log(`Response received! Found ${assistantMessages} assistant message(s)`);
        break;
      }

      // Check for errors
      const pageContent = await page.content();
      if (pageContent.includes('Sorry, I encountered an error') ||
          pageContent.includes('Backend Not Running')) {
        await page.screenshot({ path: 'tests/screenshots/chat-rag-error.png', fullPage: true });
        throw new Error('Error message detected in response');
      }

      // Take periodic screenshots
      const elapsed = Date.now() - startTime;
      if (elapsed > 0 && elapsed % 15000 < 2000) {
        await page.screenshot({
          path: `tests/screenshots/chat-rag-03-waiting-${Math.floor(elapsed / 1000)}s.png`,
          fullPage: true
        });
      }
    }

    // Final screenshot
    await page.screenshot({ path: 'tests/screenshots/chat-rag-04-final.png', fullPage: true });

    if (!responseFound) {
      throw new Error('No response received within timeout - check backend connection');
    }

    // Verify the response contains some content
    const responseContent = await page.locator('.bg-gray-100.rounded-2xl p').first().textContent();
    console.log(`Response preview: ${responseContent?.substring(0, 100)}...`);

    expect(responseContent).toBeTruthy();
    expect(responseContent!.length).toBeGreaterThan(10);

    console.log('Test PASSED: Chat component works and received response');
  });

  test('Suggested prompts fill the input', async ({ page }) => {
    await page.goto('http://localhost:3000/chat-rag');
    await page.waitForLoadState('networkidle');

    // Wait for component to load
    const chatPanel = page.locator('[data-testid="simple-rag-chat"]');
    await expect(chatPanel).toBeVisible({ timeout: 10000 });

    // Click a suggested prompt
    const suggestedPrompt = page.getByText('What projects do we have?');
    await expect(suggestedPrompt).toBeVisible();
    await suggestedPrompt.click();

    // Verify the textarea was filled
    const textarea = page.getByPlaceholder(/Ask about your projects/i);
    const inputValue = await textarea.inputValue();

    expect(inputValue).toBe('What projects do we have?');
    console.log('Test PASSED: Suggested prompt filled the input');
  });
});
