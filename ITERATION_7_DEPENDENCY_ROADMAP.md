# Iteration 7 - Dependency Upgrade Roadmap
## MQ Studio - Complete Dependency Matrix & Upgrade Path

**Created:** November 14, 2025
**Status:** Planning Phase

---

## Current Dependency Audit

### Core Framework (Pre-Upgrade)

| Package | Current Version | Latest Stable | Status | Risk |
|---------|----------------|---------------|--------|------|
| next | 14.2.33 | 15.5 | UPGRADE | HIGH |
| react | ^18 | 19.2.0 | UPGRADE | HIGH |
| react-dom | ^18 | 19.2.0 | UPGRADE | HIGH |
| tailwindcss | 3.4.1 | 4.0.0 | UPGRADE | MEDIUM-HIGH |
| typescript | 5.9.2/5.9.3 | 5.7.3 | VERIFY | LOW |

### Content Management

| Package | Current Version | Latest Stable | Status | Risk |
|---------|----------------|---------------|--------|------|
| tinacms | 2.9.3 | 2.9.0 | COMPATIBLE | LOW |
| @tinacms/cli | 1.12.2 | Latest | COMPATIBLE | LOW |

### Testing

| Package | Current Version | Latest Stable | Status | Risk |
|---------|----------------|---------------|--------|------|
| jest | 29.7.0 | 29.7.0 | COMPATIBLE | LOW |
| @testing-library/react | 14.3.1 | 14.3.1 | NEEDS OVERRIDES | MEDIUM |
| @testing-library/jest-dom | 6.8.0 | 6.8.0 | COMPATIBLE | LOW |
| playwright | Latest | Latest | COMPATIBLE | LOW |

### Build Tools

| Package | Current Version | Latest Stable | Status | Risk |
|---------|----------------|---------------|--------|------|
| postcss | 8.4.49 | Latest | UPDATE | LOW |
| autoprefixer | 10.4.20 | REMOVE (integrated in Tailwind 4) | LOW |

### Authentication

| Package | Current Version | Latest Stable | Status | Risk |
|---------|----------------|---------------|--------|------|
| next-auth | 4.24.13 | 4.24.13 | TEST COMPATIBILITY | MEDIUM |

---

## Upgrade Targets

### Phase 1: Foundation

**React 18 → 18.3.1 (Staging)**
- **Version:** 18.3.1
- **Release Date:** April 2024
- **Purpose:** Identify React 19 deprecations early
- **Effort:** 0.5 days
- **Risk:** LOW
- **Breaking Changes:** None (compatibility release)

**TypeScript Verification**
- **Current:** 5.9.2 (website), 5.9.3 (root)
- **Latest Stable:** 5.7.3
- **Action:** Verify 5.9.x is intentional (may be beta/RC) or downgrade
- **Effort:** 0.5 days
- **Risk:** LOW

### Phase 2: React 19 Upgrade

**React & React DOM → 19.2.0**
- **Version:** 19.2.0
- **Release Date:** December 5, 2024
- **Status:** STABLE
- **Effort:** 2-3 days
- **Risk:** HIGH
- **Breaking Changes:**
  - defaultProps removed from function components
  - PropTypes removed
  - Legacy Context removed
  - Error handling changes
  - Strict Mode behavior changes

**Required Changes:**
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0"
}
```

**npm Overrides for Testing:**
```json
"overrides": {
  "@testing-library/react": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Phase 3: Next.js 15 Upgrade

**Next.js → 15.5**
- **Version:** 15.5 (or latest 15.x)
- **Release Date:** October 21, 2024 (15.0), January 2025 (15.5)
- **Status:** STABLE
- **Effort:** 2-3 days
- **Risk:** HIGH
- **Breaking Changes:**
  - Async request APIs (cookies, headers, params, searchParams)
  - Caching semantics changed (fetch, Route Handlers, client router)
  - Requires React 19 for App Router

**Required Changes:**
```json
{
  "next": "^15.5"
}
```

### Phase 4: Tailwind CSS 4 Upgrade

**Tailwind CSS → 4.0.0**
- **Version:** 4.0.0
- **Release Date:** January 22, 2025
- **Status:** STABLE
- **Effort:** 2-3 days
- **Risk:** MEDIUM-HIGH
- **Breaking Changes:**
  - CSS-based configuration (vs JS config)
  - PostCSS integration changes
  - Import statement changes
  - Browser requirements (Safari 16.4+, Chrome 111+, Firefox 128+)

**Required Changes:**
```json
{
  "tailwindcss": "^4.0.0",
  "@tailwindcss/postcss": "^4.0.0"
}
```

**Remove:**
```json
{
  "autoprefixer": "..." // Now integrated into Tailwind 4
}
```

### Phase 5: Minor Updates

**TinaCMS**
- **Current:** 2.9.3
- **Target:** Latest (if available)
- **Effort:** 0.5 days
- **Risk:** LOW
- **Notes:** Already compatible with React 19 + Next.js 15

**PostCSS**
- **Current:** 8.4.49
- **Target:** Latest compatible
- **Effort:** 0.25 days
- **Risk:** LOW

---

## Compatibility Matrix

### React 19 Compatibility

| Dependency | Compatible? | Notes |
|------------|-------------|-------|
| Next.js 15.1+ | ✅ YES | React 19 support stable in 15.1+ |
| TinaCMS 2.9.3 | ✅ YES | Compatible since 2.7.7 |
| Jest 29.7.0 | ✅ YES | Full React 19 support |
| @testing-library/react 14.3.1 | ⚠️ YES (with overrides) | Peer dependency warning, use npm overrides |
| Playwright | ✅ YES | Framework-agnostic |
| next-auth 4.24.13 | ⚠️ TEST REQUIRED | Community reports some issues |

### Next.js 15 Compatibility

| Dependency | Compatible? | Notes |
|------------|-------------|-------|
| React 19 | ✅ REQUIRED | Next.js 15 requires React 19 for App Router |
| Tailwind 4 | ✅ YES | Compatible since Next.js 15.2 |
| TinaCMS 2.9.3 | ✅ YES | Works with Next.js 15 |
| next-auth 4.24.13 | ⚠️ TEST REQUIRED | Some build issues reported |

### Tailwind 4 Compatibility

| Dependency | Compatible? | Notes |
|------------|-------------|-------|
| Next.js 15 | ✅ YES | Compatible since 15.2 |
| PostCSS 8 | ✅ YES | But use @tailwindcss/postcss package |
| Autoprefixer | ❌ REMOVE | Integrated into Tailwind 4 core |

---

## Upgrade Sequence (Critical Order)

### Recommended Path

**DO NOT deviate from this order - dependencies matter!**

1. **React 18 → 18.3.1** (staging, identify issues)
2. **TypeScript verification** (ensure stable version)
3. **Testing library setup** (npm overrides)
4. **React 19 upgrade** (must come before Next.js 15)
5. **Next.js 15 upgrade** (requires React 19)
6. **Tailwind 4 upgrade** (can be done after Next.js 15)
7. **TinaCMS & minor updates** (low risk, can be last)

### Why This Order?

**React 18.3.1 First:**
- Provides warnings for React 19 breaking changes
- Low risk, identifies issues early
- Can test in isolation

**React 19 Before Next.js 15:**
- Next.js 15 App Router REQUIRES React 19
- Easier to debug React issues without Next.js changes
- Codemod works better on React alone

**Next.js 15 Before Tailwind 4:**
- Tailwind 4 needs Next.js 15.2+ for best compatibility
- Separates concerns (framework vs styling)
- Easier rollback if needed

**Tailwind 4 Last:**
- Most complex config migration
- Doesn't block other upgrades
- Can be deferred if browser compatibility issues

---

## Migration Tools

### Automated Codemods

**React 19:**
```bash
npx react-codemod
```
- Migrates `defaultProps` to default parameters
- Updates `forwardRef` patterns
- Handles `propTypes` removal

**Next.js 15:**
```bash
npx @next/codemod@canary next-async-request-api
```
- Makes `cookies()`, `headers()`, `draftMode()` async
- Updates `params` and `searchParams` access

**Tailwind 4:**
```bash
npx @tailwindcss/upgrade@next
```
- Converts `tailwind.config.js` to CSS `@theme`
- Updates PostCSS configuration
- Migrates import statements

### Manual Migration Required

**Next.js 15 Caching:**
- Audit ALL `fetch()` calls - add explicit `cache` option
- Review GET Route Handlers - add `export const dynamic` if needed
- Test ISR (Incremental Static Regeneration) behavior

**Tailwind 4 Config:**
- Complex `tailwind.config.js` may need manual conversion
- Custom plugins may need updates
- Review browser compatibility requirements

---

## Testing Checklist Per Upgrade

### After React 18.3.1 (Staging)

- [ ] All Jest tests pass
- [ ] All Playwright tests pass
- [ ] No console warnings
- [ ] TinaCMS works (create/edit/delete)
- [ ] Build completes successfully
- [ ] Note any deprecation warnings (for React 19 prep)

### After React 19

- [ ] All Jest tests pass (with npm overrides)
- [ ] All Playwright tests pass
- [ ] No `defaultProps` usage remains
- [ ] No `forwardRef` usage remains (or intentionally kept)
- [ ] Form components use new hooks (if applicable)
- [ ] TinaCMS works
- [ ] Build completes
- [ ] No console errors/warnings

### After Next.js 15

- [ ] All tests pass
- [ ] All `cookies()`, `headers()` calls are async
- [ ] All `fetch()` calls have explicit caching
- [ ] All Route Handlers have explicit `dynamic` export (if needed)
- [ ] ISR still works
- [ ] Authentication flows work (login, logout, session)
- [ ] Build completes (22 pages)
- [ ] Dev server starts with `--turbo` flag

### After Tailwind 4

- [ ] All tests pass
- [ ] Zero visual regressions (Playwright)
- [ ] All pages render correctly
- [ ] Responsive breakpoints work
- [ ] Dark mode works (if applicable)
- [ ] Build time improved (measure)
- [ ] Hot reload faster (measure)

---

## Rollback Procedures

### Git Tagging Strategy

```bash
# Before React 19
git tag -a v7-pre-react19 -m "Before React 19 upgrade"

# After React 19, before Next.js 15
git tag -a v7-react19-complete -m "React 19 upgrade complete"

# After Next.js 15, before Tailwind 4
git tag -a v7-nextjs15-complete -m "Next.js 15 upgrade complete"

# After Tailwind 4
git tag -a v7-complete -m "Iteration 7 complete"
```

### Quick Rollback Commands

**Rollback from React 19:**
```bash
git checkout v7-pre-react19
npm install
npm run build
```

**Rollback from Next.js 15:**
```bash
git checkout v7-react19-complete
npm install
npm run build
```

**Rollback from Tailwind 4:**
```bash
git checkout v7-nextjs15-complete
npm install
npm run build
```

---

## Effort Estimation

### Per-Package Breakdown

| Package | Effort (days) | Risk | Dependencies |
|---------|---------------|------|--------------|
| React 18.3.1 | 0.5 | LOW | None |
| TypeScript verify | 0.5 | LOW | None |
| Testing setup | 1 | MEDIUM | None |
| React 19 | 2-3 | HIGH | React 18.3.1 |
| Next.js 15 | 2-3 | HIGH | React 19 |
| Tailwind 4 | 2-3 | MEDIUM-HIGH | Next.js 15 |
| TinaCMS update | 0.5 | LOW | React 19, Next.js 15 |
| Testing & QA | 3-5 | MEDIUM | All above |

**Total: 12-18 days (2.5-3.5 weeks)**

### Critical Path

```
React 18.3.1 (0.5d)
  → React 19 (2.5d)
    → Next.js 15 (2.5d)
      → Tailwind 4 (2.5d)
        → Testing (4d)
          = 12 days minimum
```

---

## Success Metrics

### Version Targets

- ✅ React: 19.2.0
- ✅ React DOM: 19.2.0
- ✅ Next.js: 15.5 (or latest 15.x)
- ✅ Tailwind CSS: 4.0.0
- ✅ TinaCMS: Latest compatible
- ✅ TypeScript: 5.7.3 (or verified 5.9.x)

### Quality Metrics

- ✅ Test pass rate: 100%
- ✅ TypeScript errors: 0
- ✅ Console warnings: 0
- ✅ Build success: Yes
- ✅ Visual regressions: 0

### Performance Metrics

- ✅ Build time: <10s (vs 45s baseline)
- ✅ Dev startup: <2s (vs 5s baseline)
- ✅ Hot reload: <50ms (vs 500ms baseline)

---

## Dependencies to Remove

**After Tailwind 4:**
- `autoprefixer` (integrated into Tailwind 4)

**Consider Removing** (if compatibility issues):
- `next-auth` (migrate to Auth.js v5 if needed)

---

## New Dependencies to Add

**Tailwind 4:**
- `@tailwindcss/postcss` (replaces standalone PostCSS plugin)

**Optional:**
- None required for basic upgrades

---

## Browser Compatibility Requirements

### Tailwind 4 Minimum Requirements

- Safari: 16.4+ (April 2023)
- Chrome: 111+ (March 2023)
- Firefox: 128+ (July 2024)
- Edge: Latest (based on Chromium)

**Action Required:**
- Check analytics for browser usage
- If significant traffic from older browsers, STAY on Tailwind 3

**Fallback Plan:**
- Keep Tailwind 3 branch available
- Can upgrade other frameworks without Tailwind 4

---

## Documentation Updates Required

### After Each Upgrade

**README.md:**
- Update "Tech Stack" section with new versions
- Update installation instructions if changed
- Update development commands if changed

**DEPLOYMENT_GUIDE.md:**
- Update Node.js version requirements
- Update build commands if changed
- Update environment variables if changed

**CONTRIBUTING.md** (if exists):
- Update development setup
- Update testing procedures
- Update PR review guidelines

---

## Monitoring & Alerts

### During Upgrade

**Monitor:**
- Build times (should improve)
- Test suite runtime (should stay same or improve)
- Bundle sizes (should stay same or decrease)
- Memory usage during build
- Development server performance

**Alert if:**
- Build time increases >10%
- Test failures occur
- Bundle size increases >5%
- Memory usage spikes

---

## Final Checklist

### Before Starting
- [ ] Iteration 6 deployed to production
- [ ] Performance baselines documented
- [ ] Browser analytics reviewed
- [ ] Stakeholder approval obtained
- [ ] 3-4 weeks allocated

### During Upgrade
- [ ] Follow upgrade sequence exactly
- [ ] Tag git after each major milestone
- [ ] Test thoroughly after each upgrade
- [ ] Document any issues encountered
- [ ] Update progress daily

### Before Completing
- [ ] All target versions installed
- [ ] All tests passing
- [ ] Zero console warnings
- [ ] Performance metrics meet targets
- [ ] Documentation updated
- [ ] Completion report written

---

**Roadmap Version:** 1.0
**Created:** November 14, 2025
**Status:** Ready for Execution
**Next Step:** Begin with React 18.3.1 staging upgrade

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
