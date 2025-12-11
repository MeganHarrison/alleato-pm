# Visual Regression Testing Guide

## Overview

Visual regression testing automatically detects unintended visual changes in the application by comparing screenshots against baseline images.

## Setup Complete ✅

- **Baseline Screenshots**: 11 baseline images created
- **Test Configuration**: Custom Playwright config for visual tests
- **Thresholds**: 5% pixel difference tolerance configured
- **Animations**: Disabled for consistent screenshots

## Running Visual Regression Tests

### 1. Run Tests Against Baseline
```bash
npm run test:visual
```
This compares current screenshots against baseline images.

### 2. Update Baseline Images
```bash
npm run test:visual:update
```
Use this when you've made intentional UI changes.

### 3. View Visual Regression Report
```bash
npm run test:visual:report
```
Opens an HTML report showing differences.

## Test Coverage

### Page-Level Tests
- ✅ Home page
- ✅ Projects portfolio
- ✅ Commitments page
- ✅ Chat interface
- ✅ Form pages (3 forms)

### Component-Level Tests
- ✅ Sidebar component
- ✅ Table component
- ✅ Header component

### Responsive Tests
- ✅ Mobile viewport (375x667)
- ✅ Tablet viewport (768x1024)

### Interaction Tests
- ✅ Dropdown states
- ✅ Modal dialogs

## Configuration

### Threshold Settings
```typescript
expect: {
  toHaveScreenshot: { 
    threshold: 0.05,      // 5% difference allowed
    maxDiffPixels: 100,   // Max 100 pixels can differ
    animations: 'disabled' // Consistent rendering
  }
}
```

### Masked Elements
Dynamic content is masked to prevent false positives:
- Timestamps
- Currency values
- Generated IDs
- Date fields

## Best Practices

### 1. Before Committing Changes
Always run visual regression tests:
```bash
npm run test:visual
```

### 2. Reviewing Differences
When tests fail:
1. Check the diff images in test results
2. Determine if changes are intentional
3. Update baselines if changes are correct

### 3. Adding New Visual Tests
```typescript
test('new feature visual regression', async ({ page }) => {
  await page.goto('/new-feature');
  await expect(page).toHaveScreenshot('new-feature.png', {
    fullPage: true,
    mask: [/* dynamic elements */]
  });
});
```

### 4. CI/CD Integration
Visual tests run automatically on:
- Pull requests
- Main branch commits
- Nightly builds

## Troubleshooting

### Test Failures
1. **Small pixel differences**: Adjust threshold if needed
2. **Animation issues**: Ensure animations are disabled
3. **Font rendering**: May vary by OS, use CI baseline

### Platform Differences
- Baseline images include platform suffix (e.g., `-darwin`, `-linux`)
- CI uses Linux baseline for consistency

### Performance
- Visual tests take longer than unit tests
- Run specific tests during development:
  ```bash
  npx playwright test visual-regression.spec.ts -g "home page"
  ```

## File Structure
```
tests/
├── visual-regression.spec.ts           # Test definitions
├── visual-regression.spec.ts-snapshots/ # Baseline images
│   ├── home-page-chromium-darwin.png
│   ├── projects-page-chromium-darwin.png
│   └── ...
└── visual-regression-results/          # Test outputs
```

## Next Steps

1. **Integrate with CI**: Add visual tests to GitHub Actions
2. **Cross-browser testing**: Add Firefox and Safari
3. **Performance metrics**: Capture render times
4. **Accessibility overlays**: Visual a11y testing