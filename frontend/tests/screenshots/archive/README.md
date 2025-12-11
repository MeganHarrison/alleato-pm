# Test Screenshots

This directory contains visual proof that all features are working correctly from an end-user perspective.

## Directory Structure

- `portfolio/` - Screenshots from Portfolio page tests
- `commitments/` - Screenshots from Commitments page and table tests  
- `contracts/` - Screenshots from Contract form tests
- `purchase-orders/` - Screenshots from Purchase Order form tests
- `layout/` - Screenshots from layout component tests

## Naming Convention

Screenshots follow this naming pattern:
`[module]-[feature]-[state]-[timestamp].png`

Examples:
- `portfolio-initial-load-2024-12-09.png`
- `contract-form-validation-error-2024-12-09.png`
- `commitments-table-sorted-2024-12-09.png`

## Test Coverage

Each module should have screenshots demonstrating:
1. Initial page load
2. User interactions (clicking, typing, selecting)
3. Success states
4. Error/validation states
5. Loading states (where applicable)
6. Mobile responsive views

## Running Tests

To generate these screenshots, run:
```bash
npx playwright test --headed
```

Screenshots are automatically captured during test execution.