# Testing Guide

This document describes the testing strategy and how to run tests for the Per Diem Menu application.

## Testing Strategy

The project uses a comprehensive testing approach with three types of tests:

1. **Unit Tests** - Test individual functions and utilities in isolation
2. **Integration Tests** - Test component interactions and API endpoints
3. **E2E Tests** - Test complete user flows in a real browser environment

## Test Frameworks

- **Jest** - Test runner for unit and integration tests
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing framework

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui
```

## Test Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── utils.test.ts          # Unit tests for utilities
│   │   ├── api-error.test.ts      # Unit tests for error handling
│   │   └── ...
│   └── square/
│       └── __tests__/
│           └── service.test.ts    # Unit tests for Square service
├── components/
│   └── __tests__/
│       ├── search-bar.test.tsx    # Component integration tests
│       └── location-selector.test.tsx
└── app/
    └── api/
        └── __tests__/
            └── locations.test.ts  # API endpoint integration tests

e2e/
└── menu-display.spec.ts            # E2E tests
```

## Writing Tests

### Unit Test Example

```typescript
import { formatPrice } from '../service'

describe('formatPrice', () => {
  it('should format price from cents to currency string', () => {
    expect(formatPrice(1250)).toBe('$12.50')
  })
})
```

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react'
import { SearchBar } from '../search-bar'

describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Search menu items')).toBeInTheDocument()
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should display menu items when location is selected', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox').click()
  await page.getByText('Test Location').click()
  await expect(page.getByText('Spring Rolls')).toBeVisible()
})
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utility functions and services
- **Integration Tests**: All API endpoints and major component interactions
- **E2E Tests**: Critical user flows (location selection, menu display, search)

## Mocking

- API calls are mocked in tests to avoid external dependencies
- Next.js router is mocked for component tests
- localStorage is cleared between tests

## Continuous Integration

Tests should be run in CI/CD pipeline:
- Run unit/integration tests on every commit
- Run E2E tests on pull requests
- Fail build if tests fail or coverage drops below threshold

