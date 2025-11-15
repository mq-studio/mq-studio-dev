# Iteration 7 - Major Framework Upgrades
## MQ Studio - Next.js 15, React 19, Tailwind CSS 4

**Created:** November 14, 2025
**Status:** Planning Phase
**Priority:** HIGH - Foundation for future development
**Estimated Duration:** 3-4 weeks

---

## Executive Summary

Iteration 7 focuses on upgrading MQ Studio's core framework dependencies to their latest stable versions, ensuring the project stays modern, performant, and maintainable.

**Primary Goals:**
1. Upgrade React 18 → React 19 (stable as of Dec 2024)
2. Upgrade Next.js 14.2.33 → Next.js 15.5 (stable as of Jan 2025)
3. Upgrade Tailwind CSS 3.4.1 → Tailwind CSS 4.0.0 (stable as of Jan 2025)
4. Update TinaCMS and related dependencies
5. Maintain 100% test coverage and type safety
6. Validate performance improvements

**Key Benefits:**
- Access to latest React features (actions, useFormStatus, useOptimistic)
- Improved Next.js performance (Turbopack dev, better build times)
- Tailwind 4 performance gains (5x faster builds, 100x faster incremental)
- Future-proof codebase for next 12-18 months
- Better developer experience

---

## Current State

### Dependency Versions (Pre-Iteration 7)

**Core Framework:**
- Next.js: 14.2.33
- React: ^18 (18.x.x)
- React DOM: ^18 (18.x.x)
- Tailwind CSS: 3.4.1

**Content Management:**
- TinaCMS: 2.9.3
- @tinacms/cli: 1.12.2

**TypeScript & Build:**
- TypeScript: 5.9.2 (website), 5.9.3 (root)
- PostCSS: 8.4.49
- Autoprefixer: 10.4.20

**Testing:**
- Jest: 29.7.0
- @testing-library/react: 14.3.1
- @testing-library/jest-dom: 6.8.0
- Playwright: Latest

**Authentication:**
- next-auth: 4.24.13

### Known Issues/Limitations
- None critical
- React 18 lacks newest features (actions, form hooks)
- Next.js 14 caching behavior different from 15
- Tailwind 3 slower builds than v4
- Missing latest Next.js performance improvements

---

## Target State

### Dependency Versions (Post-Iteration 7)

**Core Framework:**
- Next.js: 15.5 (or latest stable 15.x)
- React: 19.2.0
- React DOM: 19.2.0
- Tailwind CSS: 4.0.0

**Content Management:**
- TinaCMS: 2.9.3 (already compatible, minor update if available)
- @tinacms/cli: Latest (already compatible)

**TypeScript & Build:**
- TypeScript: 5.7.3 (verify 5.9.x intentional, or stay on stable)
- PostCSS: Latest compatible with Tailwind 4
- Autoprefixer: Integrated into Tailwind 4 (remove standalone)

**Testing:**
- Jest: 29.7.0 (compatible with React 19)
- @testing-library/react: 14.3.1 with npm overrides
- @testing-library/jest-dom: 6.8.0
- Playwright: Latest

**Authentication:**
- next-auth: 4.24.13 (test compatibility) OR Auth.js v5 (if migration needed)

### Expected Improvements
- **Build Performance:** 5x faster Tailwind builds, Turbopack dev speed
- **Developer Experience:** Faster hot reload, better error messages
- **Features:** React 19 actions, form hooks, optimistic updates
- **Maintainability:** Latest stable versions, extended support timeline

---

## Iteration Phases

### Phase 1: Foundation (Week 1)
**Duration:** 5 days
**Risk:** MEDIUM
**Goal:** Prepare codebase and validate compatibility

#### Tasks:

**1.1 Environment Setup** (0.5 days)
- Create `iteration-7-staging` branch from `main`
- Set up isolated testing environment
- Document current performance baselines (Lighthouse, build times)
- Take full codebase backup

**1.2 React 18.3.1 Staging Upgrade** (0.5 days)
- Upgrade React 18.x → 18.3.1
- Run all existing tests
- Identify React 19 compatibility warnings
- Document any issues found

**Rationale:** React 18.3.1 includes warnings for deprecated APIs that will break in React 19. This staging step identifies issues early.

**1.3 TypeScript Verification** (0.5 days)
- Verify TypeScript 5.9.x is intentional (may be beta/RC)
- If accidental, downgrade to stable 5.7.3
- Update @types/react and @types/react-dom for React 19 prep
- Ensure 100% type safety maintained

**1.4 Testing Library Preparation** (1 day)
- Add npm overrides for @testing-library/react peer dependencies
- Test all existing test suites
- Document any test failures
- Update test utilities if needed

**Testing Library Overrides:**
```json
// package.json
"overrides": {
  "@testing-library/react": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**1.5 Dependency Audit** (1 day)
- Audit all dependencies for React 19 / Next.js 15 compatibility
- Identify any blocking dependencies
- Document upgrade sequence
- Create rollback plan

**1.6 Code Audit for Breaking Changes** (1.5 days)
- Search codebase for `defaultProps` usage
- Search for `propTypes` usage (should be none with TypeScript)
- Identify all `forwardRef` instances (can be simplified in React 19)
- Audit fetch calls for caching assumptions
- Document manual migration work needed

**Deliverables:**
- ✅ React 18.3.1 running with all tests passing
- ✅ npm overrides configured
- ✅ TypeScript version verified/stabilized
- ✅ Complete compatibility audit report
- ✅ Baseline performance metrics documented
- ✅ Manual migration checklist created

---

### Phase 2: React 19 Upgrade (Week 2, Part 1)
**Duration:** 2-3 days
**Risk:** HIGH
**Goal:** Upgrade to React 19 with full compatibility

#### Tasks:

**2.1 React 19 Installation** (0.5 days)
- Create `iteration-7-react19` branch from `iteration-7-staging`
- Install React 19.2.0 and React DOM 19.2.0
- Run automated codemod: `npx react-codemod`
- Initial build test

**2.2 defaultProps Migration** (0.5 days)
- Replace `Component.defaultProps = {...}` with ES6 default parameters
- Example:
  ```javascript
  // Before
  function Button({ variant }) { ... }
  Button.defaultProps = { variant: 'primary' }

  // After
  function Button({ variant = 'primary' }) { ... }
  ```
- Run tests after each component migration

**2.3 forwardRef Cleanup** (0.5 days)
- Remove `forwardRef` wrappers (ref is now a prop)
- Example:
  ```javascript
  // Before
  const Input = forwardRef((props, ref) => <input ref={ref} {...props} />)

  // After
  function Input({ ref, ...props }) { return <input ref={ref} {...props} /> }
  ```
- Verify all ref usages still work

**2.4 Form Component Updates** (1 day)
- Evaluate new React 19 form features (useActionState, useFormStatus)
- Update contact form (if exists)
- Update newsletter subscription form (if exists)
- Test form submissions thoroughly

**2.5 Testing & Validation** (0.5 days)
- Run full Jest test suite
- Run Playwright visual tests
- Manual QA of all interactive components
- Verify no console warnings/errors
- Document any remaining issues

**Deliverables:**
- ✅ React 19 running with zero deprecation warnings
- ✅ All tests passing (unit, integration, visual)
- ✅ Form components using modern React 19 patterns
- ✅ Performance metrics compared to baseline

---

### Phase 3: Next.js 15 Upgrade (Week 2, Part 2)
**Duration:** 2-3 days
**Risk:** HIGH
**Goal:** Upgrade to Next.js 15 with proper caching configuration

#### Tasks:

**3.1 Next.js 15 Installation** (0.5 days)
- Create `iteration-7-nextjs15` branch from `iteration-7-react19`
- Install Next.js 15.5 (or latest stable 15.x)
- Run automated codemod: `npx @next/codemod@canary next-async-request-api`
- Initial build test

**3.2 Async Request API Migration** (1 day)
- Update all `cookies()`, `headers()`, `draftMode()` calls to await
- Update `params` and `searchParams` access to await
- Example:
  ```javascript
  // Before
  const cookieStore = cookies()

  // After
  const cookieStore = await cookies()
  ```
- Codemod should handle most, but manual review required

**3.3 Caching Behavior Review** (1-1.5 days)
**CRITICAL:** Next.js 15 changed default caching behavior

- Audit ALL `fetch()` calls - add explicit caching
- Example:
  ```javascript
  // Add caching if needed
  fetch('https://api.example.com', { cache: 'force-cache' })

  // Or explicitly opt out
  fetch('https://api.example.com', { cache: 'no-store' })
  ```
- Review GET route handlers - add `export const dynamic = 'force-static'` if caching needed
- Test data fetching on all pages
- Verify ISR (Incremental Static Regeneration) still works

**3.4 next-auth Compatibility** (0.5 days)
- Test authentication flows (login, logout, session)
- Check for any next-auth + Next.js 15 issues
- If issues found, evaluate Auth.js v5 migration (may add time)

**3.5 Build & Performance Validation** (0.5 days)
- Run production build
- Verify all 22 pages still generate
- Compare build times to baseline
- Test in development mode
- Enable Turbopack dev: `next dev --turbo` (optional, for speed)

**Deliverables:**
- ✅ Next.js 15 running with all features working
- ✅ Caching explicitly configured for all data fetching
- ✅ Authentication working
- ✅ Build performance documented
- ✅ All pages generating successfully

---

### Phase 4: Tailwind CSS 4 Upgrade (Week 3)
**Duration:** 2-3 days
**Risk:** MEDIUM-HIGH
**Goal:** Migrate to Tailwind 4 with CSS-based configuration

#### Tasks:

**4.1 Browser Compatibility Check** (0.5 days)
- Review analytics for browser usage
- Confirm Safari 16.4+, Chrome 111+, Firefox 128+ support
- **Decision point:** If older browsers needed, STAY on Tailwind 3

**4.2 Tailwind 4 Migration** (1 day)
- Create `iteration-7-tailwind4` branch from `iteration-7-nextjs15`
- Run migration tool: `npx @tailwindcss/upgrade@next`
- Convert `tailwind.config.js` to CSS-based `@theme`
- Update PostCSS configuration
- Replace `@tailwind` directives with `@import "tailwindcss"`

**Before (Tailwind 3):**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#...',
      },
    },
  },
}
```

**After (Tailwind 4):**
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.5 0.2 200);
  --font-display: "Montserrat", sans-serif;
}
```

**4.3 Custom Plugin Review** (0.5 days)
- Check if any custom Tailwind plugins used
- Verify compatibility with Tailwind 4
- Update or replace as needed

**4.4 Visual Regression Testing** (1 day)
- Run Playwright visual tests on all pages
- Manual QA of all styled components
- Verify no layout shifts or broken styles
- Test responsive breakpoints
- Test dark mode (if applicable)

**4.5 Performance Validation** (0.5 days)
- Measure build time improvements (expect 5x faster)
- Test hot reload speed (expect 100x faster incremental)
- Document performance gains

**Deliverables:**
- ✅ Tailwind 4 running with all styles working
- ✅ CSS-based configuration migrated
- ✅ Zero visual regressions
- ✅ Performance improvements documented

---

### Phase 5: TinaCMS & Remaining Dependencies (Week 3, Part 2)
**Duration:** 1 day
**Risk:** LOW
**Goal:** Update TinaCMS and any remaining dependencies

#### Tasks:

**5.1 TinaCMS Update** (0.5 days)
- Check for latest TinaCMS version
- Update if available (already compatible with React 19 + Next.js 15)
- Test CMS functionality (create, edit, delete content)
- Verify media uploads work
- Test both local and cloud modes

**5.2 Minor Dependency Updates** (0.5 days)
- Update any remaining dependencies to latest compatible versions
- Run `npm audit` and fix any vulnerabilities
- Update development dependencies
- Document any skipped updates with rationale

**Deliverables:**
- ✅ TinaCMS fully functional with React 19 + Next.js 15
- ✅ All dependencies up to date
- ✅ Zero security vulnerabilities

---

### Phase 6: Testing & Validation (Week 4)
**Duration:** 3-5 days
**Risk:** LOW-MEDIUM
**Goal:** Comprehensive testing before deployment

#### Tasks:

**6.1 Automated Testing** (1 day)
- Run full Jest test suite (all tests must pass)
- Run Playwright visual regression tests
- Run accessibility tests (if configured)
- Fix any test failures
- Verify test coverage maintained or improved

**6.2 Manual QA** (1 day)
- Test all pages (homepage, about, musings, publications, artworks)
- Test all interactive features
  - Newsletter subscription (if implemented)
  - Contact form (if implemented)
  - Comments (Giscus)
  - Social sharing
  - RSS feed
- Test TinaCMS admin (create/edit/delete content)
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on multiple devices (desktop, tablet, mobile)

**6.3 Performance Testing** (1 day)
- Run Lighthouse audits (aim for 95+ performance)
- Measure Core Web Vitals
  - LCP (Largest Contentful Paint): <1.5s
  - FID (First Input Delay): <50ms
  - CLS (Cumulative Layout Shift): <0.05
- Test with slow 3G throttling
- Document performance vs baseline

**6.4 Integration Testing** (1 day)
- Test full user journeys
  - Visitor reads musing → comments → shares
  - Editor logs into TinaCMS → creates content → publishes
  - Email subscription flow (if implemented)
- Test error handling
- Test loading states
- Verify analytics tracking (if configured)

**6.5 Security Audit** (0.5 days)
- Run `npm audit` (fix any vulnerabilities)
- Review authentication flows
- Check for XSS vulnerabilities (TinaCMS content)
- Verify environment variables secure
- Test HTTPS and SSL

**6.6 Documentation Update** (0.5 days)
- Update README with new dependency versions
- Update DEPLOYMENT_GUIDE if needed
- Document any new developer setup steps
- Update testing documentation

**Deliverables:**
- ✅ All tests passing (zero failures)
- ✅ Performance metrics meet targets
- ✅ Zero security vulnerabilities
- ✅ All documentation updated
- ✅ QA sign-off report

---

## Success Criteria

### Must Have (Iteration Incomplete Without These)
- ✅ React 19.2.0 installed and working
- ✅ Next.js 15.5 (or latest 15.x) installed and working
- ✅ Tailwind CSS 4.0.0 installed and working
- ✅ All existing tests passing (100% pass rate)
- ✅ Zero TypeScript errors
- ✅ Zero console errors or warnings
- ✅ TinaCMS fully functional
- ✅ Build completing successfully (22 pages)
- ✅ Lighthouse performance ≥95

### Should Have (Important but Not Blocking)
- ✅ Turbopack dev enabled (faster development)
- ✅ Build time improvements documented
- ✅ Performance baseline comparisons
- ✅ All deprecation warnings resolved
- ✅ Code quality improvements applied

### Nice to Have (Bonus if Time Allows)
- ✅ Auth.js v5 migration (if next-auth issues found)
- ✅ Additional test coverage
- ✅ Performance optimizations beyond upgrades
- ✅ Accessibility improvements

---

## Risk Assessment & Mitigation

### High-Risk Items

**1. Caching Behavior Changes (Next.js 15)**
- **Risk:** Data fetching breaks, pages show stale content
- **Mitigation:**
  - Comprehensive audit of all fetch calls
  - Explicit caching configuration
  - Thorough testing of all data-driven pages
  - Rollback plan ready

**2. Testing Library Compatibility**
- **Risk:** Tests fail with React 19, hard to debug
- **Mitigation:**
  - npm overrides configured early (Phase 1)
  - Test in React 18.3.1 first
  - Consider Vitest as alternative if issues persist

**3. Tailwind Config Migration**
- **Risk:** Styles break, complex config hard to migrate
- **Mitigation:**
  - Automated migration tool
  - Visual regression tests
  - Test in separate branch
  - Keep Tailwind 3 branch available

### Medium-Risk Items

**4. next-auth Compatibility**
- **Risk:** Authentication breaks, users locked out
- **Mitigation:**
  - Test auth early in Phase 3
  - Auth.js v5 migration plan ready
  - Session management thoroughly tested

**5. Custom Code Migrations**
- **Risk:** Manual migrations introduce bugs
- **Mitigation:**
  - Codemods handle most migrations
  - Peer review of manual changes
  - Incremental testing

### Low-Risk Items

**6. TinaCMS Update**
- **Risk:** CMS breaks, content management blocked
- **Mitigation:**
  - TinaCMS already compatible (2.9.3)
  - Test thoroughly before merging
  - Rollback ready

---

## Rollback Strategy

### Branch Strategy
```
main (production, stable)
  ↓
iteration-7-staging (React 18.3.1 tested)
  ↓
iteration-7-react19 (React 19 tested)
  ↓
iteration-7-nextjs15 (Next.js 15 tested)
  ↓
iteration-7-tailwind4 (Tailwind 4 tested)
  ↓
iteration-7 (final integration, ready to merge)
```

### Rollback Points

**Rollback to React 18:**
```bash
git checkout iteration-7-staging
# React 18.3.1, all other upgrades reverted
```

**Rollback to Before Next.js 15:**
```bash
git checkout iteration-7-react19
# React 19, Next.js 14, Tailwind 3
```

**Rollback to Before Tailwind 4:**
```bash
git checkout iteration-7-nextjs15
# React 19, Next.js 15, Tailwind 3
```

### Git Tags

Create tags at each major milestone:
```bash
git tag -a v7-react19 -m "React 19 upgrade complete"
git tag -a v7-nextjs15 -m "Next.js 15 upgrade complete"
git tag -a v7-tailwind4 -m "Tailwind 4 upgrade complete"
git tag -a v7-complete -m "Iteration 7 complete"
```

---

## Timeline & Milestones

### Week 1: Foundation
- **Milestone 1:** React 18.3.1 staging complete, all tests passing
- **Milestone 2:** npm overrides configured, testing library ready
- **Deliverable:** Compatibility audit report

### Week 2: Core Frameworks
- **Milestone 3:** React 19 upgrade complete, all features working
- **Milestone 4:** Next.js 15 upgrade complete, caching configured
- **Deliverable:** Framework migration report

### Week 3: Styling & CMS
- **Milestone 5:** Tailwind 4 migration complete, zero visual regressions
- **Milestone 6:** TinaCMS updated, all dependencies current
- **Deliverable:** Visual regression test results

### Week 4: Testing & Validation
- **Milestone 7:** All tests passing, performance validated
- **Milestone 8:** QA complete, ready for deployment
- **Deliverable:** Iteration 7 completion report

---

## Testing Strategy

### Unit Testing
**Tools:** Jest, @testing-library/react
**Target:** 100% of existing tests passing
**New Tests:** Add tests for React 19 features (form actions)

### Integration Testing
**Tools:** Jest, Playwright
**Target:** All user journeys tested
**Focus:** Data fetching, forms, authentication, CMS

### Visual Regression Testing
**Tools:** Playwright
**Target:** Zero visual regressions
**Focus:** All pages, all breakpoints, all components

### Performance Testing
**Tools:** Lighthouse, WebPageTest
**Target:**
- Performance score ≥95
- LCP <1.5s
- FID <50ms
- CLS <0.05

### Browser Compatibility Testing
**Browsers:**
- Chrome 111+ (Windows, macOS, Android)
- Firefox 128+ (Windows, macOS)
- Safari 16.4+ (macOS, iOS)
- Edge latest

### Accessibility Testing
**Tools:** axe, Lighthouse
**Target:** WCAG 2.1 AA compliance maintained
**Focus:** Keyboard navigation, screen readers, color contrast

---

## Performance Expectations

### Build Performance
**Current (Tailwind 3):**
- Full build: ~45 seconds
- Incremental rebuild: ~3-5 seconds

**Expected (Tailwind 4):**
- Full build: ~9 seconds (5x faster)
- Incremental rebuild: ~0.03-0.05 seconds (100x faster)

### Development Performance
**Current (Next.js 14):**
- Dev server startup: ~5 seconds
- Hot reload: ~500ms

**Expected (Next.js 15 + Turbopack):**
- Dev server startup: ~1-2 seconds (76.7% faster)
- Hot reload: ~20ms (96.3% faster)

### Runtime Performance
**Target:** Maintain or improve current Lighthouse scores
- Performance: 95-98 (currently ~96 after image optimization)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## Communication & Reporting

### Daily Updates (During Implementation)
**Format:**
```markdown
## Iteration 7 - Day [N] Update

**Phase:** [Current phase]
**Status:** [On track / Behind / Ahead]

**Completed:**
- Task 1
- Task 2

**In Progress:**
- Task 3

**Blockers:**
- Issue (if any)

**Metrics:**
- Tests passing: [N]%
- TypeScript errors: [N]
- Build status: [Pass/Fail]
```

### Weekly Reports
**Content:**
- Progress vs plan
- Milestones achieved
- Issues encountered and resolutions
- Timeline adjustments (if needed)
- Next week's plan

### Iteration Completion Report
**ITERATION_7_COMPLETION_REPORT.md will include:**
- Final dependency versions
- Performance improvements measured
- Issues encountered and resolved
- Lessons learned
- Recommendations for future iterations

---

## Dependencies & Prerequisites

### Before Starting Iteration 7

**Required:**
- ✅ Iteration 6 complete (deployment documentation ready)
- ✅ Current codebase stable (all tests passing)
- ✅ Staging environment available
- ✅ Performance baselines documented

**Recommended:**
- ✅ Stakeholder approval for 3-4 week timeline
- ✅ Deployment of Iteration 6 work (to isolate changes)
- ✅ Browser analytics reviewed (for Tailwind 4 compatibility)
- ✅ Backup strategy in place

### External Dependencies

**None Critical:**
- All major frameworks (React 19, Next.js 15, Tailwind 4) are STABLE
- TinaCMS compatible with target versions
- No breaking external API changes expected

---

## Out of Scope

**Not Included in Iteration 7:**
- New features (focus on framework upgrades only)
- Design changes
- Content migration
- Database implementation
- Advanced search (Algolia) - defer to Iteration 8
- Multi-language support (i18n) - defer to Iteration 8
- Mobile app development - defer to future
- Major architectural changes

**Deferred to Iteration 8:**
- Advanced search implementation
- Content recommendation engine
- Analytics dashboard
- Additional content types
- Performance monitoring integration

---

## Success Metrics

### Technical Metrics
- ✅ React 19 installed: Yes/No
- ✅ Next.js 15 installed: Yes/No
- ✅ Tailwind 4 installed: Yes/No
- ✅ Test pass rate: 100%
- ✅ TypeScript errors: 0
- ✅ Build success: Yes
- ✅ Lighthouse performance: ≥95

### Performance Metrics
- ✅ Build time: ≤10 seconds (vs 45s baseline)
- ✅ Dev server startup: ≤2 seconds (vs 5s baseline)
- ✅ Hot reload: ≤50ms (vs 500ms baseline)
- ✅ LCP: <1.5s (maintain from Iteration 6)

### Quality Metrics
- ✅ Zero console warnings
- ✅ Zero deprecation warnings
- ✅ All tests passing
- ✅ No visual regressions
- ✅ Accessibility maintained

---

## Handoff to Iteration 8

### Documentation to Create
- ITERATION_7_COMPLETION_REPORT.md
- Updated dependency version matrix
- Performance comparison report
- Lessons learned document

### State to Deliver
- All frameworks on latest stable versions
- Zero technical debt from upgrades
- 100% test coverage maintained
- Performance improvements documented
- Clean codebase ready for new features

### Recommendations for Iteration 8
- Build on React 19 features (Server Actions, form hooks)
- Leverage Next.js 15 performance improvements
- Consider advanced features deferred from Iteration 7
- Plan for next major upgrade cycle (12-18 months)

---

## Appendix

### Useful Commands

**Development:**
```bash
# Start dev server with Turbopack
npm run dev -- --turbo

# Run build
npm run build

# Run tests
npm test

# Type check
npx tsc --noEmit
```

**Migration Codemods:**
```bash
# React 19
npx react-codemod

# Next.js 15 async APIs
npx @next/codemod@canary next-async-request-api

# Tailwind 4
npx @tailwindcss/upgrade@next
```

**Testing:**
```bash
# Unit tests
npm test

# Visual regression
npx playwright test

# Lighthouse audit
npx lighthouse https://localhost:3000
```

### Reference Links

**Official Documentation:**
- React 19: https://react.dev/blog/2024/12/05/react-19
- Next.js 15: https://nextjs.org/blog/next-15
- Tailwind CSS 4: https://tailwindcss.com/blog/tailwindcss-v4
- TinaCMS: https://tina.io/docs

**Migration Guides:**
- React 19 Upgrade Guide: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- Next.js 15 Upgrade Guide: https://nextjs.org/docs/app/building-your-application/upgrading/version-15
- Tailwind 4 Upgrade Guide: https://tailwindcss.com/docs/v4-beta

---

**Plan Version:** 1.0
**Created:** November 14, 2025
**Status:** Ready for Execution
**Estimated Start:** After Iteration 6 Deployment Complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
