# Testing Documentation

This document provides comprehensive information about the testing setup for the Alleato Procore project.

## Table of Contents

1. [Overview](#overview)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [Running Tests](#running-tests)
5. [Writing Tests](#writing-tests)
6. [Test Coverage](#test-coverage)
7. [CI/CD Integration](#cicd-integration)

## Overview

The project uses multiple testing frameworks to ensure code quality:

- **Frontend**: Jest for unit tests, Playwright for E2E tests
- **Backend**: Pytest for unit and integration tests
- **Coverage**: Both frontend and backend aim for 70% minimum coverage

## Frontend Testing

### Setup

Frontend tests use Jest with React Testing Library for unit testing components.

```bash
cd frontend
npm install # Dependencies are already in package.json
```

### Test Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/        # Component unit tests
│   │   └── ui/
│   │       └── __tests__/    # UI component tests
│   ├── app/
│   │   └── api/
│   │       └── __tests__/    # API route tests
│   └── test-utils/           # Test utilities and mocks
├── tests/                    # Playwright E2E tests
├── jest.config.js           # Jest configuration
└── jest.setup.js            # Jest setup file
```

### Running Frontend Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests with coverage
npm run test:unit:coverage

# Run tests in CI mode
npm run test:unit:ci

# Run Playwright E2E tests
npm run test

# Run specific test suites
npm run test:auth         # Authentication tests
npm run test:visual       # Visual regression tests
npm run test:performance  # Performance tests
npm run test:a11y        # Accessibility tests
```

### Writing Frontend Tests

Example component test:

```typescript
import { render, screen, fireEvent } from '@/test-utils/render'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Frontend Test Utils

- `test-utils/render.tsx`: Custom render function with providers
- `test-utils/mocks.ts`: Mock data and API responses

## Backend Testing

### Setup

Backend tests use Pytest with various plugins for async support and mocking.

```bash
cd backend
pip install -r requirements-test.txt
```

### Test Structure

```
backend/
├── src/
│   └── api/
│       └── main.py          # Main API file
├── tests/
│   ├── test_health.py       # Health check tests
│   ├── test_projects_api.py # Project endpoint tests
│   ├── test_chat_api.py     # Chat endpoint tests
│   ├── test_rag_chatkit.py  # RAG ChatKit tests
│   └── test_ingestion.py    # Ingestion tests
├── conftest.py              # Pytest fixtures
└── pytest.ini               # Pytest configuration
```

### Running Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov

# Run specific test file
pytest tests/test_health.py

# Run tests by marker
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
pytest -m api          # API tests only

# Run with verbose output
pytest -vv

# Run and generate HTML coverage report
pytest --cov --cov-report=html
```

### Writing Backend Tests

Example API test:

```python
import pytest

class TestHealthEndpoint:
    @pytest.mark.unit
    def test_health_check_success(self, client):
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
```

### Backend Fixtures

Key fixtures in `conftest.py`:
- `client`: FastAPI test client
- `async_client`: Async test client
- `mock_supabase_store`: Mocked Supabase store
- `mock_openai`: Mocked OpenAI client
- `mock_runner`: Mocked agent Runner

## Test Coverage

### Frontend Coverage

Jest is configured with coverage thresholds:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

View coverage report:
```bash
npm run test:unit:coverage
# Open coverage/lcov-report/index.html in browser
```

### Backend Coverage

Pytest is configured with coverage requirements:

```ini
--cov-fail-under=70
```

View coverage report:
```bash
pytest --cov --cov-report=html
# Open htmlcov/index.html in browser
```

## Best Practices

### General Testing Principles

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Test names should describe what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Mock External Dependencies**: Don't make real API calls
5. **Test Edge Cases**: Include error scenarios and edge cases

### Frontend Best Practices

1. **Use Testing Library Queries**: Prefer queries that reflect how users interact
2. **Avoid Implementation Details**: Test behavior, not implementation
3. **Use Custom Render**: Always use the custom render with providers
4. **Mock Next.js Features**: Router, Image component, etc.

### Backend Best Practices

1. **Use Fixtures**: Leverage pytest fixtures for setup
2. **Mark Tests**: Use markers for categorization
3. **Test All Response Codes**: Include success and error cases
4. **Mock External Services**: Supabase, OpenAI, etc.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test:unit:ci
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: frontend-coverage
          path: frontend/coverage

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd backend && pip install -r requirements.txt -r requirements-test.txt
      - run: cd backend && pytest --cov --cov-report=xml
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: backend-coverage
          path: backend/coverage.xml
```

## Troubleshooting

### Common Frontend Issues

1. **Module not found**: Check `moduleNameMapper` in jest.config.js
2. **React 18/19 warnings**: Handled in jest.setup.js
3. **Async testing**: Use `waitFor` from Testing Library

### Common Backend Issues

1. **Import errors**: Ensure PYTHONPATH includes the src directory
2. **Async test failures**: Use `@pytest.mark.asyncio` decorator
3. **Fixture not found**: Check fixture scope and conftest.py

## Running All Tests

To run all tests across the project:

```bash
# From project root
npm run test:all
```

Add this script to the root package.json:

```json
{
  "scripts": {
    "test:all": "concurrently \"cd frontend && npm run test:unit\" \"cd backend && pytest\""
  }
}
```

## Coverage Reports

Combined coverage reports can be generated using tools like:
- **Frontend**: nyc for combined Jest coverage
- **Backend**: coverage.py for Python coverage
- **SonarQube**: For unified reporting across languages

## Future Improvements

1. **Integration Tests**: Add more integration tests between frontend and backend
2. **Contract Testing**: Implement contract tests for API compatibility
3. **Performance Benchmarks**: Add performance regression tests
4. **Security Testing**: Add security-focused test suites
5. **Mutation Testing**: Implement mutation testing for test quality

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Coverage.py Documentation](https://coverage.readthedocs.io/)