# Testing Guide

## Overview

This document provides comprehensive information about the testing setup for the User Information Collection Web App.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run CI tests (as in GitHub Actions)
npm run test:ci
```

## Test Statistics

- **Total Test Suites**: 3
- **Total Tests**: 70+
- **Coverage Target**: 70% (statements, branches, functions, lines)
- **Testing Framework**: Jest v30+
- **HTTP Testing**: Supertest v7+

## Test Breakdown

### 1. Validation Tests (25+ tests)
**File**: `tests/models/validation.test.js`

Tests all validation logic to ensure data quality:

```
✓ Email Validation (5 tests)
  - Valid emails (multiple formats)
  - Invalid emails (various failure cases)

✓ Phone Number Validation (5 tests)
  - Valid phone formats
  - Invalid phone numbers

✓ Zip Code Validation (5 tests)
  - Valid zip codes
  - Invalid zip codes

✓ Complete User Data Validation (10+ tests)
  - Valid complete data
  - Missing required fields
  - Invalid individual fields
  - Multiple validation errors
  - Whitespace handling
  - Optional fields
```

### 2. User Model Tests (15+ tests)
**File**: `tests/models/User.test.js`

Tests data persistence and retrieval:

```
✓ File Initialization (1 test)
  - Creates data file on demand

✓ Get All Users (2 tests)
  - Returns array format
  - Returns users with correct structure

✓ Add User (5 tests)
  - Adds user with generated ID
  - Generates unique IDs
  - Persists to storage
  - Creates timestamp
  - Handles optional fields

✓ Data Integrity (3+ tests)
  - Maintains consistency across reads
  - Preserves data on multiple additions
```

### 3. Controller/API Tests (30+ tests)
**File**: `tests/controllers/userController.test.js`

Tests REST API endpoints:

```
✓ GET /api/users Endpoint (3 tests)
  - Returns 200 status
  - Includes success, message, data, count
  - Returns properly formatted user objects

✓ POST /api/users Endpoint (12 tests)
  - Creates user (201 status)
  - Returns created user with all fields
  - Rejects missing fields
  - Validates email format
  - Validates phone format
  - Validates zip code format
  - Trims whitespace
  - Converts email to lowercase
  - Accepts optional notes
  - Returns validation errors
  - Handles empty body

✓ Response Format (3 tests)
  - GET response consistency
  - POST success response format
  - POST error response format

✓ Edge Cases (3+ tests)
  - Special characters in names
  - Long text in notes
  - Various input combinations
```

## Coverage Report

After running tests with coverage:

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` to view:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage
- Uncovered lines highlighted

## GitHub Actions Integration

### Workflow Triggers
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests against `main` or `develop`

### Test Matrix
Tests run on:
- Node.js 16.x
- Node.js 18.x
- Node.js 20.x

### Workflow Steps

1. **Setup**
   - Checkout code
   - Setup Node.js with npm cache

2. **Test Job**
   - Install dependencies
   - Run linter (if configured)
   - Execute tests with coverage
   - Upload coverage to Codecov

3. **Code Quality Job** (depends on test job)
   - Check security vulnerabilities
   - Run code quality checks

4. **Build Job** (depends on test job)
   - Verify build succeeds
   - Test server startup

### PR Merge Checklist

Before merge, GitHub Actions verifies:

- [ ] All tests pass on Node 16.x
- [ ] All tests pass on Node 18.x
- [ ] All tests pass on Node 20.x
- [ ] Coverage threshold met (70%)
- [ ] No high-severity security vulnerabilities
- [ ] Build succeeds
- [ ] Server starts without errors

## Writing Tests

### Test File Naming
```
Unit tests: <component>.test.js
Integration tests: <feature>.integration.test.js
E2E tests: <feature>.e2e.test.js
```

### Test Structure

```javascript
describe('Component/Feature Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialize test data
  });

  // Cleanup after each test
  afterEach(() => {
    // Reset state
  });

  // Individual test
  test('should perform expected behavior', () => {
    // Arrange
    const input = getData();

    // Act
    const result = performAction(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Best Practices

1. **Use Descriptive Test Names**
   ```javascript
   ✅ test('should validate email format correctly')
   ❌ test('email test')
   ```

2. **Follow AAA Pattern** (Arrange, Act, Assert)
   ```javascript
   test('should add user successfully', async () => {
     // Arrange
     const userData = { /* ... */ };

     // Act
     const response = await request(app)
       .post('/api/users')
       .send(userData);

     // Assert
     expect(response.status).toBe(201);
   });
   ```

3. **Test One Thing**
   ```javascript
   ✅ test('should reject invalid email')
   ❌ test('should reject invalid email and phone')
   ```

4. **Use Before/After Hooks**
   ```javascript
   beforeEach(() => {
     // Reset state before each test
   });

   afterEach(() => {
     // Cleanup after each test
   });
   ```

## Running Specific Tests

```bash
# Run tests in a specific file
npm test -- validation.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="email"

# Run tests in a specific directory
npm test -- tests/models

# Run single test only
npm test -- --testNamePattern="should accept valid email"
```

## Debugging

### Debug Output
```bash
# Verbose output
npm test -- --verbose

# Show which tests are running
npm test -- --verbose --detectOpenHandles
```

### Using Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

### Temporary Skip/Focus
```javascript
// Skip a test
test.skip('should validate email', () => {
  // This test is skipped
});

// Run only this test
test.only('should validate email', () => {
  // Only this test runs
});
```

## Troubleshooting

### Tests Pass Locally but Fail in CI

**Solution 1: Clear dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

**Solution 2: Check Node version**
```bash
node --version
# Should match workflow versions (16.x, 18.x, 20.x)
```

**Solution 3: Check environment**
```bash
# Ensure clean data state
rm server/data/users.json
npm test
```

### Coverage Below Threshold

**Solution 1: Generate report**
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

**Solution 2: Add tests for uncovered code**
- Identify untested files
- Write tests for missing branches
- Verify coverage improves

### Test Timeout

**Solution 1: Increase timeout**
```javascript
jest.setTimeout(10000); // 10 seconds

test('async operation', async () => {
  // Test code
}, 15000); // Override for this test only
```

**Solution 2: Check for unresolved promises**
```javascript
test('should handle async', async () => {
  // Ensure promises are awaited
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Module Not Found

**Solution: Check imports**
```javascript
✅ const validation = require('../../server/models/validation');
❌ const validation = require('/server/models/validation');
```

## Performance

### Test Execution Time
- Current: ~5-10 seconds for full suite
- Parallel runs: Jest runs tests in parallel by default
- CI time: ~1-2 minutes per Node version

### Optimize Tests

```javascript
// Good: Independent tests
test('validates email', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});

// Bad: Dependent tests
test('creates and validates user', () => {
  const user = User.addUser(data);
  expect(user.email).toBeDefined();
});
```

## Continuous Integration

### GitHub Actions Workflow
See `.github/workflows/tests.yml` for the complete workflow definition.

### Environment Variables in CI
```yaml
# Available in GitHub Actions
NODE_ENV: test
CI: true
```

### Artifacts and Reports
- Coverage reports uploaded to Codecov
- Test summary in PR comments
- Coverage badge available

## Future Enhancements

- [ ] Add frontend unit tests (Jest + DOM testing library)
- [ ] Add integration tests (API + Database)
- [ ] Add E2E tests (Cypress or Playwright)
- [ ] Add performance tests
- [ ] Add security tests (OWASP)

## References

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Testing Best Practices](https://nodejs.org/en/docs/guides/testing/)

## Questions?

For questions about testing, please:
1. Check this document
2. Check test files for examples
3. Review Git commit messages for test changes
4. Open an issue with [TESTING] tag

---

**Last Updated**: March 24, 2026  
**Test Framework**: Jest v30+  
**Coverage Target**: 70%
