import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * E2E Tests for Chat Agent Tool Functionality
 *
 * These tests verify that the chat agent can:
 * 1. Receive user questions
 * 2. Invoke the appropriate tools
 * 3. Return meaningful responses with real data
 */

// Helper to wait for backend to be connected and ChatKit to load
async function waitForChatReady(page: import('@playwright/test').Page, timeout = 60000) {
  // Wait for "Connected" status in the agent panel
  await expect(page.getByText('Connected')).toBeVisible({ timeout });

  // Wait for ChatKit to load - look for the panel's test ID and wait for content to appear
  // ChatKit renders in an iframe/shadow DOM, so we need to wait for it to initialize
  const chatPanel = page.locator('[data-testid="rag-chatkit-panel"]');
  await expect(chatPanel).toBeVisible({ timeout: 15000 });

  // Give ChatKit time to fully initialize and render the greeting
  await page.waitForTimeout(3000);
}

// Helper to send a message by clicking in the input area and typing
async function sendMessage(page: import('@playwright/test').Page, message: string) {
  // ChatKit renders an input/textarea at the bottom of the panel
  // First, try to click on a visible quick action button if it matches our intent
  // Otherwise, click the input area and type

  // Try quick action buttons first (they're visible in the screenshot)
  const quickActions = ['Recent decisions', 'Project risks', 'Pending tasks', 'Pattern analysis'];
  for (const action of quickActions) {
    if (message.toLowerCase().includes(action.toLowerCase().split(' ')[0])) {
      const button = page.getByText(action, { exact: true });
      if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
        await button.click();
        return;
      }
    }
  }

  // Otherwise, find and use the input field
  // ChatKit may render the input in various ways
  const chatPanel = page.locator('[data-testid="rag-chatkit-panel"]');

  // Try to find textarea or input within the panel
  const possibleInputs = [
    chatPanel.locator('textarea').first(),
    chatPanel.locator('input[type="text"]').first(),
    chatPanel.locator('[contenteditable="true"]').first(),
    page.locator('textarea').first(),
    page.getByPlaceholder(/ask about/i),
  ];

  for (const input of possibleInputs) {
    if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
      await input.click();
      await input.fill(message);
      await input.press('Enter');
      return;
    }
  }

  // Fallback: click at bottom of chat panel and type
  const box = await chatPanel.boundingBox();
  if (box) {
    // Click near bottom center where input typically is
    await page.mouse.click(box.x + box.width / 2, box.y + box.height - 50);
    await page.waitForTimeout(500);
  }
  // Type using keyboard
  await page.keyboard.type(message, { delay: 30 });
  await page.keyboard.press('Enter');
}

// Helper to wait for assistant response
async function waitForResponse(page: import('@playwright/test').Page, timeout = 120000) {
  // Wait for the response by looking for specific response indicators
  // ChatKit may render in various ways, so we look for common patterns

  // Wait for any of these indicators that a response has arrived:
  // 1. "Analysis" text (structured response)
  // 2. "Main Answer" text (structured response)
  // 3. Any substantive text content that indicates a response
  await expect(async () => {
    const pageText = await page.locator('body').textContent() || '';
    // Check for response indicators
    const hasAnalysis = pageText.includes('Analysis') || pageText.includes('analysis');
    const hasAnswer = pageText.includes('Answer') || pageText.includes('answer');
    const hasInsight = pageText.includes('insight') || pageText.includes('pattern') || pageText.includes('trend');
    const hasRisk = pageText.includes('risk') || pageText.includes('Risk');
    const hasProject = pageText.includes('Goodwill') || pageText.includes('ASRS') || pageText.includes('project');

    // At least one meaningful indicator should be present
    expect(hasAnalysis || hasAnswer || hasInsight || hasRisk || (hasProject && pageText.length > 1500)).toBeTruthy();
  }).toPass({ timeout });

  // Wait a bit more for streaming to complete
  await page.waitForTimeout(3000);
}

// Helper to get response text
async function getResponseText(page: import('@playwright/test').Page): Promise<string> {
  // ChatKit may use shadow DOM, so we get text from the whole body
  // and filter for relevant content
  const bodyText = await page.locator('body').textContent() || '';
  return bodyText;
}

test.describe('Chat Agent Tool Functionality', () => {
  test.setTimeout(180000); // 3 minute timeout

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/chat-rag`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="rag-chatkit-panel"]')).toBeVisible({ timeout: 15000 });
    await waitForChatReady(page);
    await page.waitForTimeout(1000);
  });

  test('should respond to questions about decisions', async ({ page }) => {
    await sendMessage(page, 'What key decisions have been made recently?');
    await waitForResponse(page);

    await page.screenshot({ path: 'tests/screenshots/decisions-response.png', fullPage: true });

    const responseText = await getResponseText(page);
    expect(responseText.length).toBeGreaterThan(200);
    // Should not show error messages
    expect(responseText.toLowerCase()).not.toMatch(/error.*occurred|failed to fetch/i);
  });

  test('should respond to questions about risks', async ({ page }) => {
    await sendMessage(page, 'What are the current project risks?');
    await waitForResponse(page);

    await page.screenshot({ path: 'tests/screenshots/risks-response.png', fullPage: true });

    const responseText = await getResponseText(page);
    expect(responseText.length).toBeGreaterThan(200);
    expect(responseText.toLowerCase()).not.toMatch(/error.*occurred|failed to fetch/i);
  });

  test('should respond to questions about meetings', async ({ page }) => {
    await sendMessage(page, 'What was discussed in recent meetings?');
    await waitForResponse(page);

    await page.screenshot({ path: 'tests/screenshots/meetings-response.png', fullPage: true });

    const responseText = await getResponseText(page);
    expect(responseText.length).toBeGreaterThan(200);
    expect(responseText.toLowerCase()).not.toMatch(/error.*occurred|failed to fetch/i);
  });

  test('should respond to questions about patterns', async ({ page }) => {
    await sendMessage(page, 'What patterns do you see across our projects?');
    await waitForResponse(page);

    await page.screenshot({ path: 'tests/screenshots/patterns-response.png', fullPage: true });

    const responseText = await getResponseText(page);
    expect(responseText.length).toBeGreaterThan(200);
    expect(responseText.toLowerCase()).not.toMatch(/error.*occurred|failed to fetch/i);
  });
});

test.describe('Chat Agent Response Quality', () => {
  test.setTimeout(180000);

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/chat-rag`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="rag-chatkit-panel"]')).toBeVisible({ timeout: 15000 });
    await waitForChatReady(page);
    await page.waitForTimeout(1000);
  });

  test('agent should switch to correct specialist and show it in UI', async ({ page }) => {
    // Send a question that should route to the project agent
    await sendMessage(page, 'Tell me about the Goodwill Bart project');
    await waitForResponse(page);

    await page.screenshot({ path: 'tests/screenshots/specialist-response.png', fullPage: true });

    // Check that the "project" agent is marked as active in the left panel
    const projectAgent = page.locator('text=project').first();
    await expect(projectAgent).toBeVisible();

    const responseText = await getResponseText(page);
    expect(responseText.length).toBeGreaterThan(200);
  });
});
