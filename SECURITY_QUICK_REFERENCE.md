# Security Quick Reference - MQ Studio CMS

## Configuration Setup (3 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Generate password hash
npm run generate-password-hash
# Then copy the output hash

# 3. Create .env.local file with:
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=admin@mq-studio.com
ADMIN_PASSWORD_HASH=<paste-from-step-2>
NEXT_PUBLIC_API_URL=http://localhost:3100
NODE_ENV=development

# 4. Test
npm run verify
npm run build
npm run dev
```

## Key Security Changes

### Authentication
- **Before:** Plain-text password, default "change-me-in-production"
- **After:** bcrypt hashing with 12-round salt, environment-based secrets

### Path Traversal
- **Before:** No slug validation, could access any file
- **After:** Only alphanumeric/hyphens/underscores, max 100 chars

### Content Safety
- **Before:** Unsanitized user input written to files
- **After:** Script tags removed, HTML entities escaped, event handlers stripped

### Error Messages
- **Before:** Full file paths in logs (information disclosure)
- **After:** Paths redacted, safe for production logging

### TypeScript
- **Before:** `any` types everywhere
- **After:** Strict types for all auth callbacks and content operations

## Environment Variables (Required)

```env
# Authentication - REQUIRED
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
ADMIN_EMAIL=admin@mq-studio.com
ADMIN_PASSWORD_HASH=<generate: npm run generate-password-hash>

# API
NEXT_PUBLIC_API_URL=http://localhost:3100

# Environment
NODE_ENV=development
```

## Common Tasks

### Change Admin Password
```bash
# 1. Generate new hash
npm run generate-password-hash

# 2. Update environment variable
# ADMIN_PASSWORD_HASH=<new-hash>

# 3. Restart application
npm run dev  # or redeploy
```

### Login
```
Email: admin@mq-studio.com
Password: <whatever you set during npm run generate-password-hash>
```

### Create Content (Secure)
```typescript
// Automatically validates and sanitizes
await contentService.createContent(
  'musing',           // Type validation
  'my-first-musing',  // Slug validation (alphanumeric only)
  { title: 'My First' },
  'Content here'      // Automatically sanitized
);
```

### What Gets Validated

| Input | Validation | Example |
|-------|-----------|---------|
| Slug | Alphanumeric, hyphens, underscores only | `my-post-1` ✓, `../etc/passwd` ✗ |
| Email | Format validation | `admin@domain.com` ✓, `invalid` ✗ |
| Password | Strength requirements | Min 12 chars, uppercase, lowercase, number, special char |
| Content Type | Whitelist | `musing`, `artwork`, `publication`, `project` |
| Status | Whitelist | `draft`, `published`, `archived` |
| Content | Sanitization | Script tags removed, HTML entities escaped |

## What's Protected

```
✓ Authentication - bcrypt passwords
✓ File Operations - slug validation
✓ User Input - content sanitization
✓ Errors - path redaction
✓ Database - type safety
✓ API - validation on all endpoints
```

## Testing

```bash
# Quick test
npm run lint       # ESLint check
npm run verify     # Full verification

# Type safety
npx tsc --noEmit   # TypeScript check

# Build (will fail without env vars)
npm run build

# Local development
npm run dev        # Starts on http://localhost:3100
```

## Production Deployment

### Before Deploying

1. ✓ Set all environment variables
2. ✓ Run `npm run verify` successfully
3. ✓ Run `npm run build` successfully
4. ✓ Test login with admin credentials
5. ✓ Verify HTTPS is enabled
6. ✓ Review SECURITY.md
7. ✓ Store secrets in 1Password or similar

### Environment Variables for Production

```env
NEXTAUTH_SECRET=<unique-per-environment>
ADMIN_EMAIL=<production-email>
ADMIN_PASSWORD_HASH=<production-hash>
NEXT_PUBLIC_API_URL=https://your-domain.com
NODE_ENV=production
```

## File Locations

| File | Purpose |
|------|---------|
| `lib/auth/config.ts` | Authentication configuration |
| `lib/services/ContentService.ts` | Content CRUD with validation |
| `lib/utils/validation.ts` | Input validation functions |
| `lib/utils/sanitization.ts` | Content sanitization |
| `lib/utils/password.ts` | Password hashing utilities |
| `scripts/generate-password-hash.ts` | Password generator tool |
| `SECURITY.md` | Full documentation |
| `SECURITY_FIXES_SUMMARY.md` | Detailed fix breakdown |

## API Usage Examples

### Validate Slug
```typescript
import { validateSlug } from '@/lib/utils/validation';

if (!validateSlug(userInput)) {
  throw new Error('Invalid slug format');
}
```

### Sanitize Content
```typescript
import { sanitizeContent } from '@/lib/utils/sanitization';

const safe = sanitizeContent(userGeneratedContent);
```

### Hash Password
```typescript
import { hashPassword, comparePassword } from '@/lib/utils/password';

// Generate hash
const hash = await hashPassword('MyPassword123!');

// Compare
const isValid = await comparePassword('MyPassword123!', hash);
```

## Troubleshooting

### Build fails with "NEXTAUTH_SECRET environment variable is required"
- Add `NEXTAUTH_SECRET` to `.env.local`
- Run: `openssl rand -base64 32` to generate one

### Login doesn't work
- Verify `ADMIN_PASSWORD_HASH` is set correctly
- Verify `ADMIN_EMAIL` matches login attempt
- Re-run: `npm run generate-password-hash` if in doubt

### Bcrypt not installed
- Run: `npm install bcrypt @types/bcrypt`

### Path traversal validation error
- Use only letters, numbers, hyphens, underscores in slugs
- No `..`, `/`, or `\` characters allowed

## Security Checklist

- [ ] NEXTAUTH_SECRET is set and unique per environment
- [ ] ADMIN_PASSWORD_HASH is properly hashed (not plain text)
- [ ] ADMIN_EMAIL uses proper email format
- [ ] All environment variables are in .env.local (not committed)
- [ ] Build completes without errors
- [ ] Login works with admin credentials
- [ ] Content creation sanitizes input
- [ ] Error logs don't show file paths
- [ ] HTTPS is enabled in production
- [ ] Regular security audits scheduled

## References

- Full guide: `/SECURITY.md`
- Detailed breakdown: `/SECURITY_FIXES_SUMMARY.md`
- Bcrypt docs: https://www.npmjs.com/package/bcrypt
- NextAuth docs: https://next-auth.js.org
- OWASP: https://owasp.org

---

For detailed information, see `SECURITY.md`
