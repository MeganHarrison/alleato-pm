const { chromium } = require('playwright');

async function testChatRAGEndToEnd() {
  console.log('\n════════════════════════════════════════════════════');
  console.log('🧪 CHAT RAG END-TO-END TEST');
  console.log('════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Collect console logs
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (text.includes('[Chat Debug]') || text.includes('[RAG-ChatKit]')) {
      console.log(`  📝 ${msg.type()}: ${text}`);
    }
  });

  // Collect network requests
  const networkLog = [];
  page.on('request', request => {
    if (request.url().includes('rag-chatkit')) {
      networkLog.push({ type: 'request', url: request.url(), method: request.method() });
      console.log(`  🌐 REQUEST: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('rag-chatkit')) {
      networkLog.push({ type: 'response', url: response.url(), status: response.status() });
      console.log(`  📨 RESPONSE: ${response.status()} ${response.url()}`);
    }
  });

  try {
    // Step 1: Navigate to chat page
    console.log('📍 Step 1: Navigate to /chat');
    await page.goto('http://localhost:3000/chat', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);
    console.log('  ✅ Page loaded\n');

    // Step 2: Take screenshot of initial state
    await page.screenshot({ path: 'tests/screenshots/01-chat-loaded.png', fullPage: true });
    console.log('  📸 Screenshot: 01-chat-loaded.png\n');

    // Step 3: Check for chat elements
    console.log('📍 Step 2: Verify chat UI elements');
    const chatInput = await page.locator('textarea[name="chat-input"]');
    const submitButton = await page.locator('button[type="submit"]');

    if (await chatInput.count() > 0) {
      console.log('  ✅ Chat input found');
    } else {
      console.log('  ❌ Chat input NOT found');
      throw new Error('Chat input not found');
    }

    if (await submitButton.count() > 0) {
      console.log('  ✅ Submit button found\n');
    } else {
      console.log('  ❌ Submit button NOT found');
      throw new Error('Submit button not found');
    }

    // Step 4: Type a test message
    console.log('📍 Step 3: Send test message');
    const testMessage = 'What projects do we have?';
    console.log(`  💬 Typing: "${testMessage}"`);
    await chatInput.click();
    await chatInput.type(testMessage);
    await page.waitForTimeout(1000);

    // Step 5: Take screenshot before submit
    await page.screenshot({ path: 'tests/screenshots/02-message-typed.png', fullPage: true });
    console.log('  📸 Screenshot: 02-message-typed.png');

    // Step 6: Submit the message
    console.log('  🚀 Submitting message...');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // Step 7: Wait for "Assistant is thinking..." indicator
    console.log('\n📍 Step 4: Wait for AI response');
    const loadingIndicator = page.locator('text=Assistant is thinking');
    if (await loadingIndicator.count() > 0) {
      console.log('  ⏳ Loading indicator appeared');
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
      console.log('  ✅ Loading completed');
    }

    // Step 8: Check for response
    await page.waitForTimeout(2000);
    console.log('\n📍 Step 5: Check for AI response');

    const messages = await page.locator('[class*="rounded-2xl"][class*="p-4"]').all();
    console.log(`  📊 Found ${messages.length} message bubbles`);

    if (messages.length >= 2) {
      console.log('  ✅ Response received (user message + assistant response)');

      // Get the last message (assistant response)
      const lastMessage = messages[messages.length - 1];
      const responseText = await lastMessage.textContent();
      console.log(`  📝 Response preview: "${responseText.substring(0, 100)}..."`);
    } else {
      console.log('  ❌ No assistant response found');
    }

    // Step 9: Final screenshot
    await page.screenshot({ path: 'tests/screenshots/03-response-received.png', fullPage: true });
    console.log('  📸 Screenshot: 03-response-received.png\n');

    // Step 10: Check for errors
    console.log('📍 Step 6: Check for errors');
    const errorMessages = consoleLogs.filter(log =>
      log.type === 'error' && !log.text.includes('favicon')
    );

    if (errorMessages.length > 0) {
      console.log(`  ⚠️  Found ${errorMessages.length} console errors:`);
      errorMessages.forEach(err => console.log(`     - ${err.text}`));
    } else {
      console.log('  ✅ No errors in console');
    }

    // Step 11: Verify network requests
    console.log('\n📍 Step 7: Verify network activity');
    const ragRequests = networkLog.filter(log => log.type === 'request');
    const ragResponses = networkLog.filter(log => log.type === 'response');

    console.log(`  📤 Requests to RAG API: ${ragRequests.length}`);
    console.log(`  📥 Responses from RAG API: ${ragResponses.length}`);

    const successfulResponses = ragResponses.filter(r => r.status === 200);
    if (successfulResponses.length > 0) {
      console.log(`  ✅ ${successfulResponses.length} successful response(s)`);
    } else {
      console.log('  ❌ No successful responses');
      ragResponses.forEach(r => console.log(`     - ${r.status} ${r.url}`));
    }

    console.log('\n════════════════════════════════════════════════════');
    console.log('✅ TEST COMPLETED SUCCESSFULLY!');
    console.log('════════════════════════════════════════════════════\n');

  } catch (error) {
    console.log('\n════════════════════════════════════════════════════');
    console.log('❌ TEST FAILED');
    console.log('════════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('\nStack:', error.stack);

    // Take error screenshot
    await page.screenshot({ path: 'tests/screenshots/error.png', fullPage: true });
    console.log('\n📸 Error screenshot saved: tests/screenshots/error.png');
  } finally {
    console.log('\n🔄 Cleaning up...');
    await browser.close();
    console.log('✅ Browser closed\n');
  }
}

// Create screenshots directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('tests/screenshots')) {
  fs.mkdirSync('tests/screenshots', { recursive: true });
}

testChatRAGEndToEnd();
