# Playwright Configuration Files

This directory contains all Playwright test configuration files for the Alleato-Procore frontend.

## Available Configurations

- **playwright.config.ts** - Main configuration file (default)
- **playwright.config.chat-rag.ts** - Configuration for chat/RAG feature tests
- **playwright.config.nav.ts** - Configuration for navigation tests
- **playwright.config.no-auth.ts** - Configuration for tests without authentication
- **playwright.config.noauth.ts** - Legacy no-auth configuration
- **playwright.config.noauth-redesigned.ts** - No-auth configuration for redesigned features
- **playwright.config.quick.ts** - Quick test configuration for specific tests
- **playwright.config.smoke.ts** - Smoke test configuration
- **playwright.config.test-login.ts** - Configuration for login/auth tests
- **playwright.config.visual.ts** - Visual regression test configuration

## Usage

To run tests with a specific configuration:

```bash
# Default configuration
npm test

# Visual regression tests
npm run test:visual

# Run with a specific config
npx playwright test --config=config/playwright/playwright.config.smoke.ts
```

## Adding New Configurations

When creating a new Playwright configuration:
1. Add it to this directory
2. Use a descriptive name (e.g., `playwright.config.feature-name.ts`)
3. Consider adding a corresponding npm script in package.json if it will be used frequently
4. Update this README with the new configuration