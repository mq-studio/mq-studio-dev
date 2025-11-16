# Iteration 7 - Phase 4 Handoff: Tailwind CSS 4 Migration
## MQ Studio - Paused at Manual Migration Step

**Date:** November 15, 2025
**Status:** ⏸️ PAUSED - Ready for Manual Migration
**Completion:** Phase 4: 40% complete (3 of 8 tasks done)
**Branch:** `iteration-7-staging`
**Last Tag:** `v7-pre-tailwind4`

---

## Executive Summary

Phase 4 (Tailwind CSS 4.0 upgrade) was **paused** at the manual migration step due to complexity requiring detailed CSS refactoring. The automated `@tailwindcss/upgrade` tool failed because this codebase uses extensive `@apply` directives (lines 113-174 in `app/globals.css`) that require manual `@layer` wrappers in Tailwind 4.

**Current State:**
- ✅ Tailwind CSS **4.1.17** installed (latest stable)
- ✅ Pre-flight compatibility report completed
- ✅ All Tailwind 3 configs backed up (`*.v3-backup` files)
- ✅ Rollback tags in place (`v7-pre-tailwind4`)
- ⏸️ **PAUSED:** Manual `globals.css` migration required

**Next Session Requirements:**
- **Estimated Time:** 2-3 hours for manual migration
- **Complexity:** Medium-High (175-line CSS file with custom utilities)
- **Skills Needed:** Tailwind 4 syntax, CSS layers, build testing

---

## ✅ Completed Work (Phase 4: Tasks 1-3)

### Task 1: Pre-flight Compatibility Check ✅

**File Created:** `PHASE4_TAILWIND4_PREFLIGHT.md`

**Key Findings:**
- **Browser Compatibility:** ✅ Safari 16.4+, Chrome 111+, Firefox 128+ fully supported
- **Config Analysis:** Minimal Tailwind config (only font families extended)
- **Risk Areas Identified:**
  1. `@apply` usage without `@layer` wrappers (lines 113-174)
  2. Custom CSS variables in `:root` (must preserve)
  3. Manual utilities (`.line-clamp-*`, `.publications-grid`) need layer wrappers

**Migration Strategy Outlined:**
1. Wrap `@apply` blocks in `@layer components`
2. Convert `@tailwind` → `@import "tailwindcss"`
3. Update PostCSS to use `@tailwindcss/postcss`
4. Add Browserslist to `package.json`
5. Visual regression testing
6. Build time validation (target: ≤10s vs current 71s)

---

### Task 2: Backup Configuration ✅

**Backups Created:**
```bash
-rw-r--r-- 1 ichardart ichardart 2104 Nov 15 15:27 package.json.v3-backup
-rw-r--r-- 1 ichardart ichardart   82 Nov 15 15:27 postcss.config.js.v3-backup
-rw-r--r-- 1 ichardart ichardart  397 Nov 15 15:27 tailwind.config.ts.v3-backup
-rw-r--r-- 1 ichardart ichardart 3364 Nov 15 15:27 app/globals.css.v3-backup
```

**Git Tags:**
```bash
v7-pre-tailwind4    Backup before Tailwind 4 upgrade
v7-pre-upgrade      Pre-Iteration 7 baseline (React 18, Next.js 14, Tailwind 3)
```

**Rollback Command:**
```bash
# If migration fails, restore Tailwind 3:
git checkout v7-pre-tailwind4
npm install
npm run build
```

---

### Task 3: Tailwind 4.1.17 Installation ✅

**Installed Version:** `tailwindcss@4.1.17` (latest stable as of Nov 2025)

**Package Changes:**
```bash
# Before
tailwindcss@3.4.18
postcss@8.5.6
autoprefixer@10.4.22

# After
tailwindcss@4.1.17  ← UPGRADED
postcss@8.5.6       ← (needs upgrade to 8.4.31+ for Tailwind 4)
autoprefixer@10.4.22 ← (will be integrated into Tailwind 4)
```

**Peer Dependency Warnings:** ⚠️ Expected (TinaCMS expects React 18, but we have overrides for React 19)

**Commit:**
```bash
commit 994700a - chore: Install Tailwind CSS 4.1.17 (pre-migration)
```

---

## ⏸️ Paused Work (Phase 4: Tasks 4-8)

### Why Paused?

The automated `@tailwindcss/upgrade` tool **failed** with this error:

```
Error: Cannot apply unknown utility class `gap-8`.
Are you using CSS modules or similar and missing `@reference`?
```

**Root Cause:**
`app/globals.css` lines 113-174 use `@apply` directives **without** `@layer` wrappers. Tailwind 4's new compiler requires explicit layer declarations for all `@apply` usage.

**Example of Problem Code:**
```css
/* Current (Tailwind 3) - BREAKS in Tailwind 4 */
.publications-grid {
  @apply grid gap-6;
}

/* Required (Tailwind 4) */
@layer components {
  .publications-grid {
    @apply grid gap-6;
  }
}
```

---

## 🎯 Next Steps: Manual Migration Guide

### Task 4: Manual `globals.css` Migration (REQUIRED)

**Estimated Time:** 1-2 hours
**Complexity:** Medium-High
**File:** `app/globals.css` (175 lines)

#### Step-by-Step Instructions:

**4.1 Update Tailwind Imports (Lines 1-3)**

```css
/* BEFORE */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* AFTER */
@import "tailwindcss";
```

**4.2 Wrap ALL `@apply` Blocks in `@layer` (Lines 113-174)**

Affected sections:
- **Publications Grid** (lines 113-129): Wrap in `@layer components`
- **View Mode Utilities** (lines 131-143): Wrap in `@layer components`
- **Line Clamp Utilities** (lines 145-154): Wrap in `@layer utilities`
- **Lightbox Utilities** (lines 156-160): Wrap in `@layer utilities`
- **Print Styles** (lines 162-174): Wrap in `@layer utilities`

**Example Fix:**
```css
/* BEFORE (line 113-129) */
.publications-grid {
  @apply grid gap-6 transition-all duration-200;
}
.publications-grid--full {
  @apply grid-cols-1 gap-8;
}
.publications-grid--moderate {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
.publications-grid--compact {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* AFTER */
@layer components {
  .publications-grid {
    @apply grid gap-6 transition-all duration-200;
  }
  .publications-grid--full {
    @apply grid-cols-1 gap-8;
  }
  .publications-grid--moderate {
    @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }
  .publications-grid--compact {
    @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
  }
}
```

**4.3 Preserve `:root` Variables (Lines 5-22)**

✅ **DO NOT CHANGE** - CSS custom properties are compatible with Tailwind 4:
```css
:root {
  /* MQ Studio Colors - Primary Palette */
  --rice-paper: #FDFCF8;
  --ink-black: #1A1A1A;
  /* ... keep all variables as-is ... */
}
```

**4.4 Test After Each Section**

After wrapping each section in `@layer`, run:
```bash
npm run build
```

If errors occur, check:
- All `@apply` statements inside `@layer` blocks
- No orphaned `@apply` outside layers
- Proper `@import "tailwindcss"` at top

---

### Task 5: Update PostCSS Configuration

**File:** `postcss.config.js`

**Current:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Option A - Keep Autoprefixer (Recommended):**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// No changes needed - Tailwind 4 works with autoprefixer
```

**Option B - Use Tailwind 4's Integrated Autoprefixer:**
```javascript
// Install: npm install @tailwindcss/postcss
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    // autoprefixer removed - integrated into @tailwindcss/postcss
  },
}
```

**Recommendation:** Keep current config (Option A) - less churn, same result.

---

### Task 6: Optional - Migrate to CSS-based `@theme`

**File:** `tailwind.config.ts`

**Current (JavaScript config):**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        lora: ['var(--font-lora)'],
      },
    },
  },
  plugins: [],
}
export default config
```

**Tailwind 4 Option (CSS-based `@theme`):**
```css
/* Add to app/globals.css */
@import "tailwindcss";

@theme {
  --font-family-montserrat: var(--font-montserrat);
  --font-family-lora: var(--font-lora);
}
```

**Decision:** This is **OPTIONAL** - JavaScript config still works in Tailwind 4. Only migrate if you want to embrace full CSS-first approach.

---

### Task 7: Add Browserslist to `package.json`

**Purpose:** Align Autoprefixer and Tailwind 4 browser targets

**Add to `package.json`:**
```json
{
  "browserslist": [
    "last 2 chrome versions",
    "last 2 firefox versions",
    "last 2 safari versions",
    "> 0.5%",
    "not dead"
  ]
}
```

---

### Task 8: Validation & Testing

**8.1 Production Build Test**
```bash
time npm run build
```

**Expected Results:**
- ✅ Build completes successfully
- ✅ 22 pages generated
- ✅ Build time: **≤10 seconds** (vs 71s with Tailwind 3)
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors

**8.2 Visual Regression Testing**

Run Playwright tests (if configured):
```bash
npx playwright test
```

**Manual QA:**
- Check all 22 pages render correctly
- Verify grid layouts (publications, artworks)
- Test responsive breakpoints
- Verify focus states (accessibility)
- Check print styles

**8.3 Build Time Validation**

Measure improvement:
```bash
# Tailwind 3 baseline: 71.2s (from Phase 3 build)
# Tailwind 4 target: ≤10s (5x improvement)

time npm run build
# Should complete in ~10-15 seconds
```

---

## 📁 Key Files Reference

| File | Purpose | Status | Action Needed |
|------|---------|--------|---------------|
| `app/globals.css` | Tailwind imports + custom CSS | ⏸️ **PAUSED** | Wrap `@apply` in `@layer` |
| `tailwind.config.ts` | Tailwind config | ✅ OK | Optional: migrate to `@theme` |
| `postcss.config.js` | PostCSS plugins | ✅ OK | No changes needed |
| `package.json` | Dependencies | ✅ Updated | Add `browserslist` |
| `PHASE4_TAILWIND4_PREFLIGHT.md` | Migration guide | ✅ Created | Reference for decisions |

---

## 🔧 Rollback Strategy

If migration fails or causes issues:

**Option 1: Restore Tailwind 3 via Git Tag**
```bash
git checkout v7-pre-tailwind4
npm install
npm run build
```

**Option 2: Restore Individual Files**
```bash
cp tailwind.config.ts.v3-backup tailwind.config.ts
cp postcss.config.js.v3-backup postcss.config.js
cp app/globals.css.v3-backup app/globals.css
cp package.json.v3-backup package.json
npm install
npm run build
```

**Option 3: Revert Last Commit**
```bash
git revert HEAD
npm install
npm run build
```

---

## 🎯 Success Criteria for Phase 4 Completion

When Phase 4 is fully complete, you should have:

| Criterion | Target | Validation Method |
|-----------|--------|-------------------|
| Tailwind Version | 4.1.17+ | `npm list tailwindcss` |
| Build Success | 22/22 pages | `npm run build` output |
| Build Time | ≤10 seconds | `time npm run build` |
| TypeScript Errors | 0 | `npx tsc --noEmit` |
| ESLint Errors | 0 | `npm run lint` |
| Visual Regressions | 0 | Manual QA + Playwright |
| Test Pass Rate | 51/101 (maintain) | `npm test` |

---

## 📊 Current Progress Overview

### Iteration 7 Overall: 50% Complete

| Phase | Status | Duration | Completion |
|-------|--------|----------|------------|
| Phase 1: Foundation | ✅ Complete | 2h | 100% |
| Phase 2: React 19 | ✅ Complete | 2h | 100% |
| Phase 3: Next.js 15 + Caching | ✅ Complete | 3h | 100% |
| **Phase 4: Tailwind 4** | **⏸️ Paused** | **1h/3h** | **40%** |
| Phase 5: TinaCMS & Deps | 📋 Pending | Est. 1d | 0% |
| Phase 6: Final Validation | 📋 Pending | Est. 3-5d | 0% |

**Total Time Invested:** ~7 hours
**Remaining Estimated:** 5-7 days

---

## 🚀 Starting Fresh Session - Quick Start

When resuming Phase 4 in a new session:

**1. Environment Setup (2 minutes)**
```bash
cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio
git checkout iteration-7-staging
git pull
npm install
```

**2. Read Context (5 minutes)**
```bash
# Read these files in order:
cat ITERATION_7_PHASE_4_HANDOFF.md  # This file
cat PHASE4_TAILWIND4_PREFLIGHT.md  # Migration strategy
cat app/globals.css.v3-backup       # Reference original
```

**3. Verify Current State (2 minutes)**
```bash
npm list tailwindcss  # Should show 4.1.17
git log --oneline -5  # Should show Tailwind 4 install commit
git status            # Should be clean
```

**4. Begin Migration (Start at Task 4)**
```bash
# Open app/globals.css
# Follow Task 4 instructions above
# Test after each change
```

---

## 🤖 Agent Deployment Recommendations

For optimal efficiency, deploy specialized agents:

**Agent 1: CSS Refactoring Specialist**
- **Task:** Migrate `app/globals.css` (Task 4)
- **Tools:** Edit tool for precise `@layer` wrapping
- **Duration:** 1 hour
- **Deliverable:** Updated `globals.css` with all `@apply` wrapped

**Agent 2: Build & Test Validator**
- **Task:** Run builds and tests after migration (Task 8)
- **Tools:** Bash for builds, Read for logs
- **Duration:** 30 minutes
- **Deliverable:** Build time metrics, test results

**Agent 3: Documentation Writer**
- **Task:** Create Phase 4 completion report
- **Tools:** Write tool
- **Duration:** 30 minutes
- **Deliverable:** `PHASE4_TAILWIND4_COMPLETE.md`

---

## 📝 Notes & Warnings

⚠️ **CRITICAL:**
- DO NOT remove `:root` CSS variables - they're used throughout the site
- Test builds AFTER each `@layer` section - don't batch changes
- Keep backups until Phase 4 fully validated (visual + build tests)

✅ **SAFE TO PROCEED:**
- Tailwind 4.1.17 is stable (not beta)
- All Tailwind 3 configs backed up
- Rollback tags in place
- React 19 + Next.js 15 already compatible

📊 **EXPECTED OUTCOMES:**
- Build time: 71s → ~10s (7x improvement)
- Dev HMR: Current → 100x faster incremental
- Bundle size: Similar or smaller (Tailwind 4 optimized)
- Visual output: Identical (zero regressions)

---

## 🔗 Git History

**Current State:**
```
iteration-7-staging (current branch)
  ↓
commit 994700a - chore: Install Tailwind CSS 4.1.17 (pre-migration)
  ↓
commit 51c7fe5 - feat: Complete Iteration 7 Phase 3 - Next.js 15 fetch() caching
  ↓
tag: v7-phase3-complete
tag: v7-pre-tailwind4 ← ROLLBACK POINT
```

**Next Commits:**
```
(to be created)
  ↓
feat: Complete Iteration 7 Phase 4 - Tailwind CSS 4.1.17 migration
  ↓
tag: v7-tailwind4-complete
```

---

## 📞 Support & Resources

**Official Docs:**
- [Tailwind CSS 4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS 4 Migration Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [@layer Directive Docs](https://tailwindcss.com/docs/functions-and-directives#layer)

**Iteration 7 Docs:**
- `ITERATION_7_PLAN.md` - Overall plan
- `ITERATION_7_PHASE_1_2_3_COMPLETE.md` - Phases 1-3 summary
- `ITERATION_7_REAL_LIFE_VALIDATION.md` - Validation results
- `PHASE3_FETCH_CACHING_REPORT.md` - Phase 3 details
- `PHASE4_TAILWIND4_PREFLIGHT.md` - Pre-flight analysis

---

**Handoff Version:** 1.0
**Created:** November 15, 2025
**Token Usage at Pause:** 114K/200K (57%)
**Recommended Fresh Start:** Yes (for optimal context)

🤖 **Generated with [Claude Code](https://claude.com/claude-code)**

**Co-Authored-By:** Claude <noreply@anthropic.com>
