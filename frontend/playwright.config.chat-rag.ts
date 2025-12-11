import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'chat-rag-e2e.spec.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  timeout: 120000, // 2 minutes for AI responses
  expect: {
    timeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'tests/test-results',
});
