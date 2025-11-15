# Iteration 7 - Breaking Changes Guide
## MQ Studio - Critical Breaking Changes & Migration Steps

**Created:** November 14, 2025
**Status:** Planning Phase

---

## Quick Reference

| Framework | Breaking Change | Impact | Migration Tool | Manual Work |
|-----------|----------------|--------|----------------|-------------|
| React 19 | `defaultProps` removed | MEDIUM | react-codemod | Review all components |
| React 19 | `forwardRef` deprecated | LOW | react-codemod | Optional cleanup |
| Next.js 15 | Async request APIs | HIGH | @next/codemod | None if codemod works |
| Next.js 15 | Caching defaults changed | HIGH | None | **MANUAL AUDIT REQUIRED** |
| Tailwind 4 | CSS-based config | HIGH | @tailwindcss/upgrade | Review complex configs |

---

## React 19 Breaking Changes

### 1. defaultProps Removed from Function Components

**Impact:** MEDIUM (affects any component using defaultProps)

**What Changed:**
```javascript
// ❌ BREAKS in React 19
function Button({ variant }) {
  return <button className={variant}>Click</button>
}
Button.defaultProps = { variant: 'primary' }

// ✅ WORKS in React 19
function Button({ variant = 'primary' }) {
  return <button className={variant}>Click</button>
}
```

**Migration:**
1. Run codemod: `npx react-codemod default-props-to-default-parameters`
2. Review automated changes
3. Test each migrated component

**Search Command:**
```bash
# Find all defaultProps usage
grep -r "\.defaultProps" components/ app/
```

---

### 2. PropTypes Removed

**Impact:** NONE (you're using TypeScript)

**What Changed:**
- `prop-types` package no longer included with React
- `propTypes` property removed from components

**Action:** None required (TypeScript provides type checking)

---

### 3. forwardRef No Longer Required

**Impact:** LOW (ref now a regular prop)

**What Changed:**
```javascript
// ❌ Old pattern (still works but deprecated)
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// ✅ New pattern
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

**Migration:**
1. Optional - `forwardRef` still works in React 19
2. Codemod available: `npx react-codemod remove-forward-ref`
3. Consider cleaning up for simpler code

**Search Command:**
```bash
# Find all forwardRef usage
grep -r "forwardRef" components/ app/
```

---

### 4. Error Handling Changes

**Impact:** LOW (improves error reporting)

**What Changed:**
- Errors now reported to `window.reportError` (if available)
- Otherwise, `console.error`
- Caught errors in production re-throw to window error handlers

**Action:** None required (automatic improvement)

**Benefit:** Better error reporting in React DevTools

---

### 5. Strict Mode Changes

**Impact:** LOW (development only)

**What Changed:**
- `useMemo` and `useCallback` reuse memoized results (even in Strict Mode)
- Ref callback functions double-invoked on initial mount
- Development-only behavior for detecting bugs

**Action:** None required (improves detection of side effects)

---

## Next.js 15 Breaking Changes

### 1. Async Request APIs (HIGH IMPACT)

**What Changed:**
Request-specific APIs are now asynchronous:
- `cookies()`
- `headers()`
- `draftMode()`
- `params` (in page/layout props)
- `searchParams` (in page props)

**Migration:**

```javascript
// ❌ BREAKS in Next.js 15
import { cookies } from 'next/headers'

export function MyComponent() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
}

// ✅ WORKS in Next.js 15
import { cookies } from 'next/headers'

export async function MyComponent() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
}
```

**Automated Migration:**
```bash
npx @next/codemod@canary next-async-request-api
```

**Manual Review:**
- Codemod handles most cases
- Check any dynamic parameter access
- Verify all `params` and `searchParams` usage

**Search Commands:**
```bash
# Find cookies usage
grep -r "cookies()" app/

# Find headers usage
grep -r "headers()" app/

# Find params/searchParams
grep -r "params\." app/
grep -r "searchParams\." app/
```

**Temporary Compatibility:**
- Synchronous access shows warnings until Next.js 16
- Must migrate before Next.js 16
- Warnings help identify all instances

---

### 2. Caching Semantics Changed (CRITICAL)

**Impact:** HIGH (affects ALL data fetching)

**What Changed:**

**fetch() Requests:**
```javascript
// Next.js 14 default
fetch('https://api.example.com')
// → cache: 'force-cache' (CACHED by default)

// Next.js 15 default
fetch('https://api.example.com')
// → cache: 'no-store' (NOT CACHED by default)
```

**GET Route Handlers:**
```javascript
// Next.js 14
export async function GET() { /* ... */ }
// → CACHED by default

// Next.js 15
export async function GET() { /* ... */ }
// → NOT CACHED by default
```

**Client Router Cache:**
```javascript
// Next.js 14
// staleTime = 30 seconds (aggressive caching)

// Next.js 15
// staleTime = 0 (no caching for Page segments)
```

**Migration - fetch() Calls:**

```javascript
// Opt INTO caching (if needed)
fetch('https://api.example.com', {
  cache: 'force-cache'
})

// Explicitly opt OUT (new default)
fetch('https://api.example.com', {
  cache: 'no-store'
})

// Time-based revalidation
fetch('https://api.example.com', {
  next: { revalidate: 3600 } // 1 hour
})
```

**Migration - Route Handlers:**

```javascript
// Opt INTO caching
export const dynamic = 'force-static';
export async function GET() {
  // Will be cached
}

// Explicitly opt OUT (new default)
export const dynamic = 'force-dynamic';
export async function GET() {
  // Not cached
}
```

**CRITICAL - Manual Audit Required:**

**⚠️ NO CODEMOD AVAILABLE - Must manually review:**

1. **Find ALL fetch() calls:**
   ```bash
   grep -r "fetch(" app/ components/
   ```

2. **For EACH fetch call, decide:**
   - Should it be cached? Add `{ cache: 'force-cache' }`
   - Should it revalidate periodically? Add `{ next: { revalidate: N } }`
   - Should it never cache? Add `{ cache: 'no-store' }` or leave default

3. **Find ALL Route Handlers:**
   ```bash
   find app -name "route.ts" -o -name "route.js"
   ```

4. **For EACH GET handler, decide:**
   - Should it be static? Add `export const dynamic = 'force-static'`
   - Should it be dynamic? Add `export const dynamic = 'force-dynamic'` or leave default

5. **Test EVERY data-driven page:**
   - Verify data freshness
   - Check for stale data
   - Validate ISR behavior

**Performance Impact:**
- Pages may load slower if you relied on default caching
- Must explicitly opt in to caching for performance
- Consider your data freshness requirements

---

## Tailwind CSS 4 Breaking Changes

### 1. CSS-Based Configuration

**Impact:** HIGH (complete config migration)

**What Changed:**

**Before (Tailwind 3):**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Lora', 'serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
}
```

**After (Tailwind 4):**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Colors using OKLCH color space */
  --color-primary: oklch(0.6 0.2 250);
  --color-secondary: oklch(0.7 0.15 160);

  /* Fonts */
  --font-display: "Montserrat", sans-serif;
  --font-body: "Lora", serif;

  /* Spacing */
  --spacing-128: 32rem;
}
```

**Automated Migration:**
```bash
npx @tailwindcss/upgrade@next
```

**Manual Review Required:**
- Complex theme configurations
- Custom plugins (may need updates)
- Extend vs replace semantics

---

### 2. Import Statement Changes

**Impact:** MEDIUM

**What Changed:**

**Before (Tailwind 3):**
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**After (Tailwind 4):**
```css
/* app/globals.css */
@import "tailwindcss";
```

**Migration:** Automated by upgrade tool

---

### 3. PostCSS Integration Changes

**Impact:** MEDIUM

**What Changed:**
- Tailwind 3: Package was a PostCSS plugin
- Tailwind 4: PostCSS plugin in separate `@tailwindcss/postcss` package
- Autoprefixer now integrated (no longer needed as separate dependency)

**Before (Tailwind 3):**
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**After (Tailwind 4):**
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Migration:**
1. Install `@tailwindcss/postcss`
2. Remove `autoprefixer` from package.json
3. Update postcss.config

---

### 4. Browser Requirements

**Impact:** MEDIUM (may exclude older browsers)

**Tailwind 4 Requires:**
- Safari 16.4+ (April 2023)
- Chrome 111+ (March 2023)
- Firefox 128+ (July 2024)

**Action Required:**
1. Check Google Analytics for browser versions
2. Calculate % of users on older browsers
3. **Decision:** Upgrade or stay on Tailwind 3

**If <1% users on old browsers:** Upgrade
**If >1% users on old browsers:** Consider staying on Tailwind 3

---

## Migration Workflow

### Step-by-Step Process

**1. React 19 Migration:**
```bash
# Run codemod
npx react-codemod

# Search for remaining issues
grep -r "\.defaultProps" .
grep -r "forwardRef" .

# Test
npm test
npm run build
```

**2. Next.js 15 Migration:**
```bash
# Run codemod
npx @next/codemod@canary next-async-request-api

# MANUAL: Audit fetch calls
grep -r "fetch(" app/ components/

# MANUAL: Audit route handlers
find app -name "route.ts"

# For each fetch/route, add explicit caching

# Test
npm run build
# Verify all 22 pages generate
```

**3. Tailwind 4 Migration:**
```bash
# Run upgrade tool
npx @tailwindcss/upgrade@next

# Review generated @theme
# Update custom configs manually if needed

# Test
npm run build
npx playwright test  # Visual regression
```

---

## Testing After Each Migration

### After React 19
- [ ] All unit tests pass
- [ ] All Playwright tests pass
- [ ] No `defaultProps` usage remains
- [ ] Forms work correctly
- [ ] TinaCMS works

### After Next.js 15
- [ ] All pages load with fresh data
- [ ] Cached pages still cached (where intended)
- [ ] ISR works
- [ ] Authentication works
- [ ] Build generates 22 pages

### After Tailwind 4
- [ ] Zero visual regressions
- [ ] All breakpoints work
- [ ] All colors correct
- [ ] Typography correct
- [ ] Build time improved

---

## Rollback Procedures

### If React 19 Migration Fails
```bash
git checkout v7-pre-react19
npm install
npm test
```

### If Next.js 15 Migration Fails
```bash
git checkout v7-react19-complete
npm install
npm run build
```

### If Tailwind 4 Migration Fails
```bash
git checkout v7-nextjs15-complete
npm install
npm run build
```

---

## Common Issues & Solutions

### Issue: Tests Fail with React 19

**Problem:** `@testing-library/react` peer dependency error

**Solution:**
```json
// package.json
"overrides": {
  "@testing-library/react": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Issue: Data Not Updating in Next.js 15

**Problem:** Relied on default caching, now showing stale data

**Solution:** Add explicit caching:
```javascript
fetch('...', { cache: 'force-cache', next: { revalidate: 60 } })
```

### Issue: Tailwind Styles Not Applying

**Problem:** Config migration didn't handle custom theme

**Solution:** Manually convert to CSS `@theme` variables

---

## Summary Checklist

### Before Starting
- [ ] Create backup branch
- [ ] Document current behavior
- [ ] Tag git: `git tag v7-pre-upgrade`

### During Migration
- [ ] Run codemods first
- [ ] Review automated changes
- [ ] Manual audit for critical changes (Next.js 15 caching!)
- [ ] Test after each framework upgrade
- [ ] Document any issues

### Before Completing
- [ ] All breaking changes resolved
- [ ] All tests passing
- [ ] No console warnings
- [ ] Performance validated
- [ ] Documentation updated

---

**Guide Version:** 1.0
**Created:** November 14, 2025
**Critical Focus:** Next.js 15 caching changes require **MANUAL AUDIT**

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
