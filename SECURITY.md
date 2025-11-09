# Security Implementation Guide - MQ Studio CMS

## Overview

This document outlines the security vulnerabilities that have been fixed in PR #1 and how to properly configure the application for secure production deployment.

## Fixed Security Issues

### 1. Authentication Security (lib/auth/config.ts)

**Issues Fixed:**
- Removed hardcoded default password (`'change-me-in-production'`)
- Made `NEXTAUTH_SECRET` required (enforced at module load time)
- Removed plain-text password comparison
- Added bcrypt-based password hashing with 12-round salt
- Added proper TypeScript types for JWT and session callbacks
- Implemented email validation

**Changes:**
- Replaced plain-text password comparison with `bcrypt.compare()`
- Password hashes are now stored securely in `ADMIN_PASSWORD_HASH` environment variable
- `NEXTAUTH_SECRET` must be set via environment variables (required)
- Added validation for `ADMIN_EMAIL` format

**How to Use:**

1. Generate a secure password hash:
   ```bash
   npm run generate-password-hash
   ```

2. Set environment variables in `.env.local`:
   ```
   NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
   ADMIN_EMAIL=your-email@domain.com
   ADMIN_PASSWORD_HASH=<output-from-generate-password-hash>
   ```

3. Never hardcode secrets in code or commit them to version control

### 2. Path Traversal Prevention (lib/services/ContentService.ts)

**Issues Fixed:**
- Added slug validation to prevent path traversal attacks (e.g., `../../../etc/passwd`)
- Sanitized content before writing to prevent XSS injection
- Fixed error logging to not expose file paths in production
- Added comprehensive input validation

**Changes:**
- All content operations validate slugs using `validateSlug()`
- Only alphanumeric characters, hyphens, and underscores allowed in slugs
- Max slug length: 100 characters
- All content is sanitized using `sanitizeContent()` before storage
- Error messages hide file paths using `sanitizeErrorForLogging()`

**Validation Rules:**
- Slugs must match regex: `/^[a-zA-Z0-9_-]+$/`
- No path traversal attempts: `..`, `/`, `\`
- Content types validated against whitelist: `'musing' | 'artwork' | 'publication' | 'project'`
- Status values validated: `'draft' | 'published' | 'archived'`

### 3. Content Sanitization (lib/utils/sanitization.ts)

**New Utility Functions:**

#### `sanitizeContent(content: string): string`
Removes potentially dangerous HTML:
- Strips `<script>` tags and content
- Removes `<iframe>` tags
- Removes event handlers (`onclick`, `onload`, etc.)
- Safe for user-generated content

#### `sanitizeMetadataString(value: string): string`
Cleans metadata strings:
- Removes HTML tags
- Decodes HTML entities
- Trims whitespace

#### `sanitizeMetadata(metadata: Record<string, any>): Record<string, any>`
Validates and sanitizes metadata objects:
- Removes null/undefined values
- Sanitizes string values
- Preserves dates, booleans, and numbers
- Safely handles arrays

#### `sanitizeErrorForLogging(error: unknown): string`
Removes sensitive information from error messages:
- Hides file paths
- Removes absolute paths
- Removes ENOENT file path details
- Safe for logging to production systems

### 4. Input Validation (lib/utils/validation.ts)

**New Validation Functions:**

#### `validateSlug(slug: string): boolean`
Ensures slug is safe for file operations:
- Only alphanumeric, hyphens, and underscores
- No path traversal characters
- Max 100 characters

#### `validateEmail(email: string): boolean`
Validates email format:
- Basic format validation
- Max 255 characters

#### `validatePasswordStrength(password: string): boolean`
Enforces strong password requirements:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### `validateContentType(type: string): boolean`
Validates content type against whitelist

#### `validateContentStatus(status: string): boolean`
Validates status against allowed values

### 5. TypeScript Type Safety

**Issues Fixed:**
- Removed `any` types from auth callbacks
- Properly typed JWT and Session interfaces
- Added proper types to ContentService
- Fixed settings page type errors

**Improvements:**
- All callbacks have explicit parameter types
- Frontmatter data properly typed with type guards
- Session user extends CMS User type with required fields

## Environment Configuration

### Required Environment Variables

```env
# Authentication (REQUIRED)
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
ADMIN_EMAIL=admin@mq-studio.com
ADMIN_PASSWORD_HASH=<use: npm run generate-password-hash>

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3100

# Other variables from .env.example
NODE_ENV=development
```

### Security Best Practices

1. **Never commit secrets to git**
   - Use `.env.local` for development (in `.gitignore`)
   - Use 1Password or similar for production secrets

2. **NEXTAUTH_SECRET**
   - Generate with: `openssl rand -base64 32`
   - Change in production
   - Never reuse across environments

3. **ADMIN_PASSWORD_HASH**
   - Generate using: `npm run generate-password-hash`
   - Never store plain-text passwords
   - Change password periodically

4. **ADMIN_EMAIL**
   - Use proper email format
   - Should be a dedicated admin account
   - Consider using a team email address

## Testing Security Fixes

### Run All Tests
```bash
npm run verify
```

### TypeScript Compilation
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## API Changes

### ContentService Methods

All methods now include security validation:

```typescript
// Will throw error if slug is invalid
async getContentBySlug(type: ContentType, slug: string)

// Validates slug, content type, and status
async createContent(type, slug, metadata, content)

// Sanitizes all inputs before updating
async updateContent(type, slug, updates, content)

// Validates slug before deletion
async deleteContent(type, slug)
```

### Authentication

```typescript
// CredentialsProvider now:
// 1. Validates email format
// 2. Uses bcrypt to compare passwords
// 3. Returns user with timestamps
// 4. Throws errors for missing config

const user = await authorize({
  email: 'admin@mq-studio.com',
  password: 'SecurePassword123!'
})
```

## Migration Guide

### For Existing Deployments

1. **Generate new password hash:**
   ```bash
   npm run generate-password-hash
   ```

2. **Update environment variables:**
   - Set `NEXTAUTH_SECRET` (required)
   - Set `ADMIN_PASSWORD_HASH` (required)
   - Ensure `ADMIN_EMAIL` is set

3. **Rebuild and deploy:**
   ```bash
   npm run build
   npm start
   ```

### For New Deployments

1. Set all required environment variables before building
2. The build will fail if secrets are missing (intentional safety feature)
3. Application will not start without proper configuration

## Security Audit Checklist

- [x] Password hashing with bcrypt (12 rounds)
- [x] NEXTAUTH_SECRET required
- [x] Path traversal validation
- [x] Content sanitization
- [x] Error logging safe for production
- [x] Input validation on all user content
- [x] TypeScript strict mode compliance
- [x] No hardcoded secrets
- [x] Email format validation
- [x] Type-safe authentication callbacks

## References

- [OWASP - Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [OWASP - XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [NextAuth.js Security](https://next-auth.js.org/getting-started/example#securing-pages-and-api-routes)
- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)

## Questions or Issues?

For security concerns or questions about these fixes, please contact the development team.
