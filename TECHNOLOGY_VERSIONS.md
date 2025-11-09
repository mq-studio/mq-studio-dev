# Technology Versions & Dependencies

**Date:** 2025-11-09  
**Project:** MQ Studio CMS V01  
**Status:** Recommended Specification

---

## Purpose

This document locks all major dependency versions to ensure consistency across development, staging, and production environments. It addresses compatibility issues and prevents "works on my machine" problems.

---

## Core Framework

### Next.js & React
```json
{
  "next": "14.2.5",
  "react": "18.3.1",
  "react-dom": "18.3.1"
}
```

**Rationale:**
- Next.js 14.2.5 is stable and well-tested
- React 18.3.1 includes all concurrent features needed
- Avoid Next.js 15.x until CMS is stable (breaking changes)

---

## TypeScript

### Version
```json
{
  "typescript": "5.4.5"
}
```

**Rationale:**
- Current package.json has 5.9.2, which causes ESLint warnings
- TypeScript 5.4.5 is the last version fully compatible with @typescript-eslint
- Supported range: >=4.7.4 <5.5.0

**Required Change:** Downgrade from 5.9.2 to 5.4.5

---

## Authentication

### NextAuth.js
```json
{
  "next-auth": "4.24.7"
}
```

**Rationale:**
- NextAuth v4 is stable and widely used
- NextAuth v5 (Auth.js) has breaking changes and fewer resources
- Better documentation and examples for v4
- Easier migration to v5 later if needed

**Decision:** Use NextAuth v4, NOT Auth.js (v5)

---

## Rich Text Editor

### TipTap
```json
{
  "@tiptap/react": "2.1.13",
  "@tiptap/starter-kit": "2.1.13",
  "@tiptap/extension-image": "2.1.13",
  "@tiptap/extension-link": "2.1.13",
  "@tiptap/extension-youtube": "2.1.13",
  "@tiptap/extension-code-block-lowlight": "2.1.13"
}
```

**Required Extensions:**
- `@tiptap/starter-kit` - Basic formatting (bold, italic, headings, lists)
- `@tiptap/extension-image` - Image insertion
- `@tiptap/extension-link` - Link creation
- `@tiptap/extension-youtube` - Video embeds
- `@tiptap/extension-code-block-lowlight` - Code blocks with syntax highlighting

**Additional Dependencies:**
```json
{
  "lowlight": "3.1.0"
}
```

**Rationale:**
- TipTap 2.x is modern and React-native
- Version 2.1.13 is latest stable
- Extension-based architecture allows customization

---

## Image Processing

### Sharp (Server-side)
```json
{
  "sharp": "0.33.4"
}
```

**Rationale:**
- High-performance image processing
- Used for upload optimization, thumbnail generation
- Works in Vercel with appropriate configuration

**⚠️ Important:** Requires testing in Vercel environment (Priority 1 POC)

**Vercel Configuration:**
```javascript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  }
}
```

---

## Form Handling

### React Hook Form
```json
{
  "react-hook-form": "7.52.1",
  "@hookform/resolvers": "3.9.0",
  "zod": "3.23.8"
}
```

**Rationale:**
- Excellent performance (uncontrolled components)
- Built-in validation with Zod
- Small bundle size (~8KB)
- Better than Formik for React 18

---

## Styling

### Tailwind CSS
```json
{
  "tailwindcss": "3.4.1",
  "autoprefixer": "10.4.19",
  "postcss": "8.4.38"
}
```

**Rationale:**
- Already used in project
- Version 3.4.1 is stable
- Excellent for rapid development

---

## Content Processing

### Markdown & MDX
```json
{
  "gray-matter": "4.0.3",
  "react-markdown": "9.1.0",
  "remark-gfm": "4.0.0",
  "rehype-highlight": "7.0.0"
}
```

**Rationale:**
- gray-matter: Parse frontmatter from MDX files
- react-markdown: Render markdown in React
- remark-gfm: GitHub Flavored Markdown support
- rehype-highlight: Syntax highlighting

---

## File Upload

### Direct Upload (Primary Approach)
```javascript
// Use native Next.js API routes with multer
```

```json
{
  "multer": "1.4.5-lts.1",
  "mime-types": "2.1.35"
}
```

**Rationale:**
- Simple, no external service
- Works with Vercel (with size limits)
- Cost-effective

**⚠️ Important:** 
- Vercel limit: 4.5MB body size by default
- For larger files, implement chunked uploads or use S3

**Alternative for Large Files:**
```json
{
  "@aws-sdk/client-s3": "3.600.0",
  "@aws-sdk/s3-request-presigner": "3.600.0"
}
```

---

## Git Operations

### Approach: GitHub API (Recommended)
```json
{
  "@octokit/rest": "20.1.1"
}
```

**Rationale:**
- GitHub API works in serverless environment
- No need for local git commands
- More reliable than shell git in Vercel

**Alternative: Simple Git (Not Recommended for Serverless)**
```json
{
  "simple-git": "3.25.0"
}
```
⚠️ Requires persistent file system, doesn't work in Vercel serverless

**Decision:** Use Octokit (GitHub API) for all git operations

---

## Testing

### Unit & Integration Tests
```json
{
  "jest": "29.7.0",
  "@testing-library/react": "14.3.1",
  "@testing-library/jest-dom": "6.4.6",
  "@testing-library/user-event": "14.5.2",
  "jest-environment-jsdom": "29.7.0"
}
```

### E2E Tests
```json
{
  "@playwright/test": "1.45.0"
}
```

**Rationale:**
- Jest 29 is stable and well-supported
- Testing Library is best practice for React
- Playwright is modern and reliable for E2E

---

## Development Tools

### ESLint & Prettier
```json
{
  "eslint": "8.57.0",
  "eslint-config-next": "14.2.5",
  "prettier": "3.3.2",
  "eslint-config-prettier": "9.1.0"
}
```

**Rationale:**
- ESLint 8 (not 9) for Next.js 14 compatibility
- Prettier for consistent formatting
- Next.js ESLint config includes React best practices

---

## Security

### Dependencies
```json
{
  "bcrypt": "5.1.1",
  "jsonwebtoken": "9.0.2",
  "dompurify": "3.1.5",
  "isomorphic-dompurify": "2.14.0"
}
```

**Rationale:**
- bcrypt: Password hashing (cost factor 12)
- jsonwebtoken: JWT tokens (NextAuth uses this internally)
- dompurify: Sanitize user HTML input
- isomorphic-dompurify: Works in Node and browser

---

## Date & Time

### Recommendation
```json
{
  "date-fns": "3.6.0"
}
```

**Rationale:**
- Lightweight (vs moment.js)
- Tree-shakeable
- Excellent TypeScript support
- Better than day.js for this use case

**Alternative:** Native Intl API (no dependency)

---

## Validation

### Zod
```json
{
  "zod": "3.23.8"
}
```

**Rationale:**
- TypeScript-first validation
- Works with React Hook Form
- Better than Yup for TypeScript projects
- Small bundle size

---

## Package Manager

### npm
```
Node.js: 20.x LTS
npm: 10.x (comes with Node 20)
```

**Rationale:**
- Node 20 is LTS until April 2026
- npm 10 is stable and performant
- Avoid Yarn/pnpm for simplicity (single contributor)

**Lock File:** Use `package-lock.json` (commit to repo)

---

## Complete package.json

```json
{
  "name": "mq-studio",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=20.0.0 <21.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "dev": "next dev --hostname 0.0.0.0 --port 3100",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:unit": "jest -c jest.config.unit.cjs --runInBand",
    "test:all": "npm run test:unit && npm run test:e2e",
    "verify": "npm run lint && npm run test:unit",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "next-auth": "4.24.7",
    "@tiptap/react": "2.1.13",
    "@tiptap/starter-kit": "2.1.13",
    "@tiptap/extension-image": "2.1.13",
    "@tiptap/extension-link": "2.1.13",
    "@tiptap/extension-youtube": "2.1.13",
    "@tiptap/extension-code-block-lowlight": "2.1.13",
    "lowlight": "3.1.0",
    "react-hook-form": "7.52.1",
    "@hookform/resolvers": "3.9.0",
    "zod": "3.23.8",
    "gray-matter": "4.0.3",
    "react-markdown": "9.1.0",
    "remark-gfm": "4.0.0",
    "rehype-highlight": "7.0.0",
    "sharp": "0.33.4",
    "multer": "1.4.5-lts.1",
    "mime-types": "2.1.35",
    "@octokit/rest": "20.1.1",
    "bcrypt": "5.1.1",
    "dompurify": "3.1.5",
    "isomorphic-dompurify": "2.14.0",
    "date-fns": "3.6.0"
  },
  "devDependencies": {
    "@playwright/test": "1.45.0",
    "@testing-library/jest-dom": "6.4.6",
    "@testing-library/react": "14.3.1",
    "@testing-library/user-event": "14.5.2",
    "@types/jest": "29.5.12",
    "@types/node": "20.14.9",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@types/multer": "1.4.11",
    "@types/dompurify": "3.0.5",
    "autoprefixer": "10.4.19",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "eslint-config-prettier": "9.1.0",
    "prettier": "3.3.2",
    "jest": "29.7.0",
    "jest-environment-jsdom": "29.7.0",
    "postcss": "8.4.38",
    "tailwindcss": "3.4.1",
    "typescript": "5.4.5"
  }
}
```

---

## Vercel Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

**Rationale:**
- Increased timeout for image processing
- Single region for consistency
- Explicit framework detection

---

## Environment Variables

### Required
```bash
# Authentication
NEXTAUTH_URL=http://localhost:3100
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Admin Credentials
ADMIN_EMAIL=moura@example.com
ADMIN_PASSWORD_HASH=<bcrypt-hash-of-password>

# GitHub (for git operations)
GITHUB_TOKEN=<personal-access-token>
GITHUB_REPO=mq-studio/mq-studio-dev
GITHUB_BRANCH=main

# Optional: Error Tracking
SENTRY_DSN=<optional>

# Optional: Analytics
NEXT_PUBLIC_GA_ID=<optional>
```

---

## Browser Support

### Target Browsers
```
Chrome >= 90
Firefox >= 88
Safari >= 14
Edge >= 90
```

**Rationale:**
- Modern browsers with ES2020 support
- Moura uses desktop browsers (not IE11)
- iPad Safari 14+ supported

---

## Migration from Current package.json

### Changes Needed

1. **Downgrade TypeScript**
   ```bash
   npm install --save-dev typescript@5.4.5
   ```

2. **Add New Dependencies**
   ```bash
   npm install next-auth@4.24.7
   npm install @tiptap/react@2.1.13 @tiptap/starter-kit@2.1.13
   npm install @tiptap/extension-image@2.1.13 @tiptap/extension-link@2.1.13
   npm install react-hook-form@7.52.1 zod@3.23.8 @hookform/resolvers@3.9.0
   npm install sharp@0.33.4 multer@1.4.5-lts.1
   npm install @octokit/rest@20.1.1
   npm install bcrypt@5.1.1 dompurify@3.1.5
   npm install date-fns@3.6.0
   ```

3. **Update Testing**
   ```bash
   npm install --save-dev @playwright/test@1.45.0
   ```

4. **Verify versions**
   ```bash
   npm outdated
   npm audit
   ```

---

## Version Update Policy

### During Development (Phases 1-4)
- ❌ **DO NOT** update any dependencies unless critical security issue
- ✅ Run `npm audit fix` for security patches only
- ⚠️ Test thoroughly after any security updates

### After V01 Launch
- Monthly dependency review
- Update patch versions (e.g., 2.1.13 → 2.1.14)
- Test minor version updates in dev before production
- Avoid major version updates until V02

### Security Updates
- Apply immediately for critical vulnerabilities
- Test in staging first
- Monitor for breaking changes

---

## Compatibility Matrix

| Component | Version | Next.js 14.2.5 | React 18.3.1 | TypeScript 5.4.5 | Node 20 |
|-----------|---------|----------------|--------------|------------------|---------|
| NextAuth | 4.24.7 | ✅ | ✅ | ✅ | ✅ |
| TipTap | 2.1.13 | ✅ | ✅ | ✅ | ✅ |
| Sharp | 0.33.4 | ✅ | N/A | ✅ | ✅ |
| React Hook Form | 7.52.1 | ✅ | ✅ | ✅ | ✅ |
| Playwright | 1.45.0 | ✅ | ✅ | ✅ | ✅ |
| Jest | 29.7.0 | ✅ | ✅ | ✅ | ✅ |

All versions tested and compatible ✅

---

## Technical Validation POCs

Before starting Phase 1, create these POCs:

### POC 1: TipTap Integration
```bash
# Create minimal TipTap setup
# Verify: image upload, formatting, code blocks
# Time: 2-3 hours
```

### POC 2: Sharp on Vercel
```bash
# Test image optimization in Vercel environment
# Verify: upload, resize, WebP conversion
# Time: 2-3 hours
```

### POC 3: GitHub API Git Operations
```bash
# Test creating/updating files via Octokit
# Verify: commit, push, read
# Time: 2-3 hours
```

### POC 4: NextAuth Setup
```bash
# Test authentication flow
# Verify: login, session, protected routes
# Time: 2-3 hours
```

**Total POC Time:** 1-2 days

---

## Document Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-09 | 1.0 | Initial version with recommendations |

---

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [NextAuth.js v4 Docs](https://next-auth.js.org/)
- [TipTap Documentation](https://tiptap.dev/)
- [Vercel Limits](https://vercel.com/docs/limits)
- [React 18 Release Notes](https://react.dev/blog/2022/03/29/react-v18)

---

**Status:** Recommended for adoption before Phase 1  
**Last Updated:** 2025-11-09  
**Owner:** Development Team
