# Iteration 7 - Testing Strategy
## MQ Studio - Comprehensive Testing Plan for Framework Upgrades

**Created:** November 14, 2025
**Status:** Planning Phase

---

## Testing Philosophy

**Goal:** Ensure zero regressions during major framework upgrades (React 19, Next.js 15, Tailwind 4)

**Approach:**
- Test after EACH upgrade (not batched at end)
- Automated tests run continuously
- Manual QA for critical paths
- Performance validated against baselines
- Visual regression testing for UI changes

---

## Testing Levels

### 1. Unit Testing (Jest + @testing-library/react)

**What:** Test individual components and functions in isolation

**Tools:**
- Jest 29.7.0
- @testing-library/react 14.3.1 (with npm overrides for React 19)
- @testing-library/jest-dom 6.8.0

**Scope:**
- All existing tests must pass (100% pass rate)
- Components with complex logic
- Utility functions
- Custom hooks

**Test After:**
- React 18.3.1 upgrade
- React 19 upgrade
- Any code changes

**Pass Criteria:**
- All tests pass
- No new warnings
- Test coverage maintained or improved

---

### 2. Integration Testing (Jest + Playwright)

**What:** Test how components work together and with APIs

**Scope:**
- Form submissions (contact, newsletter)
- Data fetching (musings, publications, artworks)
- TinaCMS integration (create, edit, delete)
- Authentication flows (if applicable)
- API routes

**Test After:**
- Next.js 15 upgrade (caching changes critical)
- Any data fetching changes

**Pass Criteria:**
- All user journeys complete successfully
- Data loads correctly
- Forms submit and validate
- TinaCMS operations work

---

### 3. Visual Regression Testing (Playwright)

**What:** Ensure UI looks identical before and after upgrades

**Tools:**
- Playwright (latest)
- Screenshot comparison

**Scope:**
- All pages: homepage, about, musings, publications, artworks
- All breakpoints: mobile (375px), tablet (768px), desktop (1920px)
- All interactive states: hover, focus, active
- Dark mode (if applicable)

**Test After:**
- Tailwind 4 upgrade (HIGH RISK for visual changes)
- Any component changes

**Pass Criteria:**
- Zero pixel differences
- All layouts correct
- Typography unchanged
- Colors accurate

**Baseline Creation:**
```bash
# Before Tailwind 4 upgrade
npx playwright test --update-snapshots
```

**Comparison:**
```bash
# After Tailwind 4 upgrade
npx playwright test
# Review any differences
```

---

### 4. Performance Testing

**What:** Measure build times, bundle sizes, runtime performance

**Tools:**
- Lighthouse (Chrome DevTools)
- WebPageTest
- Build time measurements
- Bundle analyzer

**Metrics to Track:**

| Metric | Baseline (Pre-Upgrade) | Target (Post-Upgrade) |
|--------|------------------------|----------------------|
| Build time | 45s | ≤10s (5x faster with Tailwind 4) |
| Dev startup | 5s | ≤2s (76.7% faster with Turbopack) |
| Hot reload | 500ms | ≤50ms (96.3% faster) |
| Lighthouse Performance | 96 | ≥95 (maintain) |
| LCP | <1.5s | ≤1.5s (maintain) |
| FID | <50ms | <50ms (maintain) |
| CLS | <0.05 | <0.05 (maintain) |
| First Load JS | 106KB | ≤110KB (maintain or improve) |

**Test After:**
- Each major upgrade
- Final validation before merge

**Pass Criteria:**
- Build time improved or maintained
- Runtime performance maintained or improved
- Bundle size maintained or reduced
- Core Web Vitals pass

---

### 5. Browser Compatibility Testing

**What:** Ensure site works across supported browsers

**Browsers to Test:**

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | 111+ | HIGH |
| Firefox | 128+ | HIGH |
| Safari | 16.4+ | HIGH |
| Edge | Latest | MEDIUM |
| Mobile Safari (iOS) | Latest | HIGH |
| Mobile Chrome (Android) | Latest | MEDIUM |

**Test After:**
- Tailwind 4 upgrade (new browser requirements)
- Final validation

**Pass Criteria:**
- All features work in supported browsers
- Graceful degradation in older browsers (if supporting)

---

### 6. Accessibility Testing

**What:** Ensure WCAG 2.1 AA compliance maintained

**Tools:**
- axe DevTools
- Lighthouse accessibility audit
- Manual keyboard navigation testing
- Screen reader testing (optional)

**Scope:**
- All interactive elements (buttons, forms, links)
- Keyboard navigation
- Focus management
- ARIA labels
- Color contrast

**Test After:**
- React 19 upgrade (forwardRef changes may affect refs)
- Tailwind 4 upgrade (color changes may affect contrast)

**Pass Criteria:**
- Lighthouse accessibility score ≥95
- Zero axe violations
- Full keyboard navigation works
- Focus indicators visible

---

## Testing Workflow Per Upgrade

### After React 18.3.1 (Staging)

**1. Automated Tests:**
```bash
npm test                    # All Jest tests pass
npm run build              # Build succeeds
```

**2. Manual Checks:**
- [ ] Dev server starts
- [ ] No console warnings in development
- [ ] TinaCMS admin loads

**3. Documentation:**
- Note any deprecation warnings (for React 19 prep)
- Document any test failures

---

### After React 19

**1. Setup npm Overrides:**
```json
"overrides": {
  "@testing-library/react": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**2. Automated Tests:**
```bash
npm install                # Install with overrides
npm test                   # All tests must pass
npm run build              # Build succeeds
```

**3. Manual Checks:**
- [ ] All components render
- [ ] Forms work (contact, newsletter)
- [ ] TinaCMS works (create/edit/delete)
- [ ] No `defaultProps` warnings
- [ ] No `forwardRef` deprecation warnings

**4. Code Verification:**
```bash
# Verify no remaining defaultProps
grep -r "\.defaultProps" components/ app/

# Verify forwardRef usage (optional cleanup)
grep -r "forwardRef" components/ app/
```

**5. Pass Criteria:**
- ✅ 100% tests passing
- ✅ Zero TypeScript errors
- ✅ Zero console warnings
- ✅ All features working

---

### After Next.js 15

**1. Automated Tests:**
```bash
npm test                   # All tests pass
npm run build              # All 22 pages generate
```

**2. Caching Validation (CRITICAL):**
```bash
# Test each data-driven page in dev mode
npm run dev

# Visit each page, check Network tab:
# - Homepage
# - /musings
# - /musings/[slug]
# - /publications
# - /artworks

# Verify data freshness vs caching as intended
```

**3. Manual Checks:**
- [ ] All pages load with correct data
- [ ] ISR works (if configured)
- [ ] Route handlers return correct data
- [ ] Authentication works (login, logout, session)
- [ ] TinaCMS admin works

**4. Performance Check:**
```bash
# Enable Turbopack dev (optional)
npm run dev -- --turbo

# Measure startup time and hot reload
```

**5. Pass Criteria:**
- ✅ All tests passing
- ✅ All pages generating (22 pages)
- ✅ Data fetching works correctly
- ✅ No stale data issues
- ✅ Build time acceptable

---

### After Tailwind 4

**1. Visual Regression Tests:**
```bash
# Run Playwright tests
npx playwright test

# Review any screenshot differences
npx playwright show-report
```

**2. Manual Visual QA:**
- [ ] Homepage - all sections
- [ ] About page
- [ ] Musings list page
- [ ] Individual musing page
- [ ] Publications page
- [ ] Artworks page
- [ ] TinaCMS admin (/admin)

**Check:**
- [ ] All colors correct
- [ ] Typography correct (fonts, sizes, weights)
- [ ] Spacing correct
- [ ] Responsive breakpoints work
- [ ] Hover states work
- [ ] Focus states visible

**3. Performance Validation:**
```bash
# Measure build time
time npm run build

# Should be ~10s or less (vs 45s baseline)
```

**4. Browser Testing:**
- [ ] Test in Chrome 111+
- [ ] Test in Firefox 128+
- [ ] Test in Safari 16.4+
- [ ] Test on mobile (iOS Safari, Chrome Android)

**5. Pass Criteria:**
- ✅ Zero visual regressions
- ✅ Build time ≤10s
- ✅ All browsers work
- ✅ All responsive breakpoints correct

---

## Final Integration Testing (After All Upgrades)

### Comprehensive User Journey Tests

**Visitor Journey:**
1. Visit homepage
2. Navigate to musings
3. Read a musing
4. Post comment (Giscus)
5. Share on social media
6. Subscribe to newsletter

**Editor Journey:**
1. Login to TinaCMS admin (/admin)
2. Create new musing
3. Add content and images
4. Preview
5. Save
6. Verify appears on site

**Developer Journey:**
1. Clone repository
2. Install dependencies
3. Run dev server
4. Make code change
5. See hot reload
6. Run tests
7. Build production

### Automated Test Suite

```bash
# Full test suite
npm run test:all
# Should include:
# - Unit tests (Jest)
# - Integration tests
# - Visual regression (Playwright)
# - Build test
# - Type check
```

### Performance Audit

```bash
# Build and measure
npm run build

# Start production server
npm start

# Run Lighthouse in Chrome DevTools
# - Performance: ≥95
# - Accessibility: ≥95
# - Best Practices: ≥95
# - SEO: 100
```

---

## Test Data Management

### Test Content

**Create Test Musings:**
- At least 3 test musings for list/detail pages
- Cover different categories (Thinking, Feeling, Doing)
- Include images, tags, excerpts

**Test Publications:**
- 2-3 test publications
- Different types (papers, articles)

**Test Artworks:**
- 2-3 test artworks
- Different media

### Environment Variables

**Test Environment:**
```bash
# .env.test
NODE_ENV=test
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Mock or test TinaCMS credentials
# Mock Giscus credentials
```

---

## Regression Testing Checklist

### Core Functionality

- [ ] All pages accessible
- [ ] Navigation works
- [ ] Search works (if implemented)
- [ ] Filters work (publications by year, etc.)
- [ ] Pagination works
- [ ] 404 page works
- [ ] RSS feed generates

### Interactive Features

- [ ] Forms validate
- [ ] Forms submit
- [ ] Comments load (Giscus)
- [ ] Social sharing works
- [ ] Newsletter subscription works (if implemented)
- [ ] Contact form works (if implemented)

### Content Management

- [ ] TinaCMS admin loads
- [ ] Can login to TinaCMS
- [ ] Can create content
- [ ] Can edit content
- [ ] Can delete content
- [ ] Can upload images
- [ ] Changes reflect on site

### SEO & Metadata

- [ ] Meta tags present
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Structured data valid
- [ ] Sitemap generates
- [ ] robots.txt accessible

---

## Performance Baselines

### Before Upgrades (Document These)

**Build Performance:**
```bash
time npm run build
# Record: Total time, cache usage
```

**Dev Performance:**
```bash
# Record startup time
time npm run dev

# Record hot reload time (manually measure)
```

**Runtime Performance:**
```bash
# Run Lighthouse, record:
# - Performance score
# - LCP
# - FID
# - CLS
# - First Load JS
```

### After Each Upgrade (Compare)

- Document improvements or regressions
- If regression >5%, investigate
- Target: Improvements in Tailwind 4 and Turbopack

---

## Test Automation

### GitHub Actions (Optional)

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: npx playwright test
```

### Pre-commit Hooks (Optional)

```bash
# Run tests before commit
npm test
npx tsc --noEmit
```

---

## Issue Tracking

### If Tests Fail

**1. Document:**
- Which test failed
- Error message
- Expected vs actual behavior

**2. Categorize:**
- Blocking (prevents upgrade)
- Non-blocking (can be fixed after merge)

**3. Triage:**
- Fix immediately (blocking issues)
- Create issue for later (non-blocking)
- Rollback if critical

**4. Resolve:**
- Fix code or test
- Verify fix with test
- Document resolution

---

## Success Criteria Summary

### Must Pass (Blocking)

- ✅ All Jest unit tests passing (100%)
- ✅ All Playwright visual tests passing (zero regressions)
- ✅ Build completes successfully (22 pages)
- ✅ Zero TypeScript errors
- ✅ Zero console errors/warnings
- ✅ TinaCMS fully functional
- ✅ Lighthouse Performance ≥95

### Should Pass (Important)

- ✅ Performance baselines maintained or improved
- ✅ Accessibility score ≥95
- ✅ All browser tests passing
- ✅ Load time <2s (LCP <1.5s)

### Nice to Have

- ✅ Test coverage improved
- ✅ Performance significantly better
- ✅ New tests added for React 19 features

---

## Testing Timeline

### Week 1: Foundation Testing

**After React 18.3.1:**
- Unit tests: 1 hour
- Manual QA: 30 min

**After TypeScript verify:**
- Type check: 15 min

**After Testing setup:**
- Test npm overrides: 30 min

**Total: ~2.5 hours**

### Week 2: Framework Testing

**After React 19:**
- Unit tests: 2 hours
- Integration tests: 2 hours
- Manual QA: 1 hour

**After Next.js 15:**
- Unit tests: 1 hour
- Integration tests: 3 hours (caching validation)
- Manual QA: 2 hours

**Total: ~11 hours**

### Week 3: Styling & Visual Testing

**After Tailwind 4:**
- Visual regression: 2 hours
- Manual visual QA: 3 hours
- Browser testing: 2 hours

**After TinaCMS:**
- CMS testing: 1 hour

**Total: ~8 hours**

### Week 4: Final Validation

**Comprehensive testing:**
- Full test suite: 2 hours
- Performance testing: 2 hours
- User journey testing: 2 hours
- Accessibility audit: 1 hour
- Documentation: 1 hour

**Total: ~8 hours**

**Grand Total Testing Time: ~30 hours (embedded in 3-4 week timeline)**

---

## Tools Reference

### Test Commands

```bash
# Unit tests
npm test

# Unit tests with coverage
npm test -- --coverage

# Visual regression tests
npx playwright test

# Visual regression with UI
npx playwright test --ui

# Update snapshots (after intentional changes)
npx playwright test --update-snapshots

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build

# Lighthouse audit
npx lighthouse http://localhost:3000

# Bundle analyzer
npm run analyze
```

---

**Testing Strategy Version:** 1.0
**Created:** November 14, 2025
**Status:** Ready for Execution
**Estimated Testing Time:** 30 hours (embedded in 3-4 week timeline)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
