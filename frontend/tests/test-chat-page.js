const { chromium } = require('playwright');

async function testChatPage() {
  console.log('Starting chat page test...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to /chat...');
    await page.goto('http://localhost:3000/chat', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Check if the AgentPanel is rendered
    console.log('Checking for AgentPanel...');
    const agentPanel = await page.locator('[class*="agent"]').first();
    if (await agentPanel.count() > 0) {
      console.log('✓ AgentPanel found');
    } else {
      console.log('✗ AgentPanel not found');
    }

    // Check if the RagChatKitPanel is rendered
    console.log('Checking for RagChatKitPanel...');
    const chatPanel = await page.locator('[class*="chat"]').first();
    if (await chatPanel.count() > 0) {
      console.log('✓ Chat panel found');
    } else {
      console.log('✗ Chat panel not found');
    }

    // Check for any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });

    // Take a screenshot
    await page.screenshot({
      path: 'tests/chat-page-test.png',
      fullPage: true
    });
    console.log('Screenshot saved to tests/chat-page-test.png');

    console.log('\nTest completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testChatPage();
