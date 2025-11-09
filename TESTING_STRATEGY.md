# CMS Testing Strategy

**Date:** 2025-11-09  
**Project:** MQ Studio CMS V01  
**Status:** Recommended Strategy  
**Testing Goal:** 80%+ code coverage, zero critical bugs at launch

---

## Testing Philosophy

> "Test the behavior, not the implementation."

### Core Principles
1. **User-focused testing** - Test what users actually do
2. **Confidence over coverage** - 80% meaningful coverage > 100% meaningless
3. **Test pyramid** - More unit tests, fewer E2E tests
4. **Fast feedback** - Tests should run in < 5 minutes
5. **Reliable tests** - No flaky tests (99%+ reliability)

---

## Test Pyramid

```
         /\
        /E2E\         ~10 tests (critical user journeys)
       /------\
      /Integ'n\       ~50 tests (API routes, services)
     /----------\
    /Unit Tests \    ~200 tests (components, utils, hooks)
   /--------------\
```

**Distribution:**
- Unit Tests: 75% of total tests
- Integration Tests: 20% of total tests
- E2E Tests: 5% of total tests

---

## 1. Unit Testing

### Tools
- **Framework:** Jest 29.7.0
- **React Testing:** @testing-library/react 14.3.1
- **Assertions:** @testing-library/jest-dom 6.4.6
- **User Simulation:** @testing-library/user-event 14.5.2
- **Mocking:** Jest built-in mocks

### What to Test

#### React Components
```typescript
// Test: Rendering, user interactions, accessibility
// File: src/components/Button.test.tsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is keyboard accessible', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalled()
  })
})
```

#### Custom Hooks
```typescript
// Test: State changes, side effects, error handling
// File: src/hooks/useAuth.test.ts

import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('user@example.com', 'password')
    })
    
    expect(result.current.user).toBeDefined()
    expect(result.current.isAuthenticated).toBe(true)
  })
})
```

#### Utility Functions
```typescript
// Test: Edge cases, error conditions, type handling
// File: src/lib/utils/slugify.test.ts

import { slugify } from './slugify'

describe('slugify', () => {
  it('converts title to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('handles special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('handles unicode', () => {
    expect(slugify('Café résumé')).toBe('cafe-resume')
  })
})
```

### Coverage Targets
- Components: 80%+
- Hooks: 90%+
- Utilities: 95%+
- Services: 85%+

### Run Commands
```bash
npm run test:unit              # Run all unit tests
npm run test:unit -- --watch   # Watch mode
npm run test:unit -- --coverage # Coverage report
```

---

## 2. Integration Testing

### Tools
- **Framework:** Jest 29.7.0
- **HTTP Mocking:** msw (Mock Service Worker)
- **File System:** Mock with jest.mock()

### What to Test

#### API Routes
```typescript
// Test: Request/response, validation, error handling
// File: src/pages/api/content/musings.test.ts

import { createMocks } from 'node-mocks-http'
import handler from './musings'

describe('/api/content/musings', () => {
  it('GET returns all musings', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toHaveProperty('musings')
  })

  it('POST creates new musing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Musing',
        content: 'Test content',
        category: 'thinking'
      }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(201)
  })

  it('POST validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { content: 'Missing title' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toHaveProperty('error')
  })
})
```

#### Service Layer
```typescript
// Test: Business logic, file operations, error scenarios
// File: src/lib/services/ContentService.test.ts

import { ContentService } from './ContentService'
import fs from 'fs/promises'

jest.mock('fs/promises')

describe('ContentService', () => {
  it('reads musing by slug', async () => {
    const mockContent = '---\ntitle: Test\n---\nContent'
    ;(fs.readFile as jest.Mock).mockResolvedValue(mockContent)
    
    const service = new ContentService()
    const musing = await service.getMusing('test-slug')
    
    expect(musing.title).toBe('Test')
  })

  it('handles missing file gracefully', async () => {
    ;(fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'))
    
    const service = new ContentService()
    
    await expect(service.getMusing('nonexistent')).rejects.toThrow()
  })
})
```

### Coverage Targets
- API Routes: 85%+
- Services: 90%+

---

## 3. End-to-End Testing

### Tools
- **Framework:** Playwright 1.45.0
- **Browsers:** Chromium, Firefox, WebKit
- **Accessibility:** @axe-core/playwright

### What to Test

#### Critical User Journeys

**Journey 1: Create and Publish Musing**
```typescript
// File: tests/e2e/create-musing.spec.ts

import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'

test.describe('Create and Publish Musing', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/studio/login')
    await page.fill('input[name="email"]', 'moura@example.com')
    await page.fill('input[name="password"]', 'testpassword')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/studio')
  })

  test('complete workflow', async ({ page }) => {
    // Navigate to new musing
    await page.click('text=New Musing')
    await expect(page).toHaveURL('/studio/musings/new')

    // Fill form
    await page.fill('input[name="title"]', 'My Test Musing')
    await page.click('input[value="thinking"]')
    
    // Add content
    const editor = page.locator('.tiptap')
    await editor.click()
    await editor.fill('This is my test content.')

    // Add tag
    await page.fill('input[name="tags"]', 'test')
    await page.press('input[name="tags"]', 'Enter')

    // Publish
    await page.click('button:has-text("Publish")')
    await page.click('button:has-text("Yes, Publish")')

    // Verify success
    await expect(page.locator('text=Published!')).toBeVisible()
  })

  test('has no accessibility violations', async ({ page }) => {
    await page.goto('/studio/musings/new')
    await injectAxe(page)
    await checkA11y(page)
  })
})
```

**Journey 2: Upload and Insert Image**
```typescript
// File: tests/e2e/media-upload.spec.ts

test('upload image and insert into content', async ({ page }) => {
  await page.goto('/studio/musings/new')

  // Upload image
  const fileInput = await page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/test-image.jpg')

  // Wait for upload
  await expect(page.locator('text=Upload complete')).toBeVisible()

  // Insert into content
  await page.click('button:has-text("Insert")')
  
  // Verify image in editor
  await expect(page.locator('.tiptap img')).toBeVisible()
})
```

### E2E Test List (10 Critical Journeys)

1. ✅ Login → Dashboard
2. ✅ Create → Publish → View Musing
3. ✅ Edit Existing Musing
4. ✅ Upload Image → Insert into Content
5. ✅ Create Tag → Apply to Content
6. ✅ Preview Content
7. ✅ Delete Content
8. ✅ Filter Content List
9. ✅ Search Content
10. ✅ Update Site Settings

### Run Commands
```bash
npm run test:e2e                    # Run all E2E tests
npm run test:e2e -- --headed        # Run with browser UI
npm run test:e2e -- --debug         # Debug mode
npm run test:e2e -- --project=chromium  # Specific browser
```

---

## 4. Accessibility Testing

### Automated Checks
- **Tool:** jest-axe / @axe-core/playwright
- **Standard:** WCAG 2.1 AA
- **Coverage:** All pages and components

### Manual Checks
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)
- [ ] Focus indicators visible
- [ ] Color contrast (4.5:1 for text)
- [ ] Form labels associated
- [ ] Error messages announced

### Example Test
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## 5. Security Testing

### Automated Scans
```bash
# Dependency vulnerabilities
npm audit

# Fix non-breaking issues
npm audit fix

# OWASP ZAP scan (CI/CD)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3100
```

### Manual Security Tests
- [ ] SQL Injection attempts (N/A - no database)
- [ ] XSS attempts in content
- [ ] CSRF protection verification
- [ ] Authentication bypass attempts
- [ ] File upload restrictions
- [ ] Rate limiting effectiveness
- [ ] Session hijacking prevention

---

## 6. Performance Testing

### Lighthouse CI
```yaml
# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3100/studio"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Load Testing
```bash
# k6 load test script
# File: tests/load/basic.js

import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  vus: 10, // Virtual users
  duration: '30s'
}

export default function() {
  const res = http.get('http://localhost:3100/studio')
  check(res, { 'status is 200': (r) => r.status === 200 })
  sleep(1)
}
```

### Performance Metrics
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100ms

---

## 7. Visual Regression Testing

### Tool
- **Playwright Screenshots**
- **Percy.io** (optional, for visual diffs)

### Example
```typescript
test('dashboard looks correct', async ({ page }) => {
  await page.goto('/studio')
  await expect(page).toHaveScreenshot('dashboard.png')
})
```

---

## Test Execution Strategy

### Development Phase (Phases 1-4)

**Daily:**
```bash
npm run test:unit  # Before each commit
```

**Weekly:**
```bash
npm run test:all   # All tests (unit + E2E)
npm audit          # Security check
```

**Before PR:**
```bash
npm run verify     # Lint + unit tests
npm run test:e2e   # E2E tests
```

### CI/CD Pipeline

**On Pull Request:**
```yaml
- Lint check
- Unit tests (must pass)
- Build check
- Type check
```

**On Merge to Main:**
```yaml
- All unit tests
- All E2E tests
- Security scan
- Lighthouse CI
- Deploy to staging
```

**Before Production Deploy:**
```yaml
- Manual smoke test
- Accessibility audit
- Performance check
- Security review
```

---

## Coverage Requirements

### Overall Coverage: 80%+

| Category | Target | Required |
|----------|--------|----------|
| Statements | 80% | Yes |
| Branches | 75% | Yes |
| Functions | 80% | Yes |
| Lines | 80% | Yes |

### Exemptions
- Type definitions (.d.ts files)
- Configuration files
- Test files themselves
- Third-party integrations (mock instead)

---

## Testing Checklist (Before Launch)

### Unit Tests
- [ ] All components tested
- [ ] All hooks tested
- [ ] All utilities tested
- [ ] All services tested
- [ ] 80%+ coverage achieved
- [ ] Zero flaky tests
- [ ] Tests run in < 3 minutes

### Integration Tests
- [ ] All API routes tested
- [ ] File operations tested
- [ ] Git operations tested
- [ ] Error scenarios covered
- [ ] Validation tested

### E2E Tests
- [ ] All 10 critical journeys tested
- [ ] Cross-browser tested (Chromium, Firefox, Safari)
- [ ] Mobile/tablet tested
- [ ] Tests run in < 5 minutes
- [ ] Zero flaky tests

### Accessibility
- [ ] Automated axe tests passing
- [ ] Manual keyboard navigation verified
- [ ] Screen reader tested (1 reader minimum)
- [ ] Color contrast verified
- [ ] WCAG 2.1 AA compliant

### Security
- [ ] npm audit clean (0 high/critical)
- [ ] OWASP ZAP scan passed
- [ ] Manual security tests passed
- [ ] Penetration test completed (optional)

### Performance
- [ ] Lighthouse scores > 90
- [ ] Load test passed (100 concurrent users)
- [ ] Bundle size < 250KB
- [ ] Performance budget met

---

## Common Testing Pitfalls to Avoid

### ❌ Don't
1. Test implementation details
2. Test third-party libraries
3. Couple tests to markup structure
4. Use `data-testid` excessively
5. Write flaky tests
6. Skip error scenarios
7. Mock everything

### ✅ Do
1. Test user behavior
2. Test your code
3. Query by role/label/text
4. Use semantic HTML
5. Write reliable tests
6. Test unhappy paths
7. Mock external services only

---

## Resources

- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [Playwright Docs](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

## Estimated Testing Effort

### Test Development
- Unit tests: 20 hours (parallel with dev)
- Integration tests: 10 hours
- E2E tests: 15 hours
- Accessibility tests: 5 hours
- **Total: 50 hours**

### Test Execution (per run)
- Unit: 3 minutes
- E2E: 5 minutes
- Full suite: 10 minutes

### Maintenance
- ~10% of development time
- Update tests when features change
- Fix flaky tests immediately

---

**Status:** Recommended strategy for CMS V01  
**Owner:** Development Team  
**Last Updated:** 2025-11-09
