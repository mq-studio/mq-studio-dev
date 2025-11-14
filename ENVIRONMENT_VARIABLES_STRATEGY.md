# Environment Variables Strategy
## MQ Studio - Secure Configuration Management

**Last Updated:** November 14, 2025
**Application:** Next.js 14 App Router
**Deployment Targets:** Local Development, Hostinger VPS Production

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Files Structure](#environment-files-structure)
3. [Variable Categories](#variable-categories)
4. [Complete Variable Reference](#complete-variable-reference)
5. [Development vs Production](#development-vs-production)
6. [Security Best Practices](#security-best-practices)
7. [VPS Configuration](#vps-configuration)
8. [TinaCMS Cloud Credentials](#tinacms-cloud-credentials)
9. [Giscus Configuration](#giscus-configuration)
10. [Email SMTP Configuration](#email-smtp-configuration)
11. [Build-Time vs Runtime Variables](#build-time-vs-runtime-variables)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### Why Environment Variables Matter

Environment variables allow you to:
- **Separate configuration from code** (don't commit secrets)
- **Use different settings per environment** (dev vs production)
- **Secure sensitive credentials** (API keys, passwords)
- **Easily update configuration** without code changes

### Next.js Environment Variable Types

**1. Public Variables (`NEXT_PUBLIC_*`)**
- Accessible in browser JavaScript
- Embedded in frontend bundle at build time
- Use for non-sensitive, client-side data
- Example: `NEXT_PUBLIC_SITE_URL`

**2. Server-Only Variables**
- Only accessible in Node.js server code
- Never exposed to browser
- Use for sensitive credentials
- Example: `TINA_TOKEN`, `SMTP_PASSWORD`

**3. Build-Time Variables**
- Read during `npm run build`
- Baked into static pages
- Cannot change without rebuild

**4. Runtime Variables**
- Read when server starts (`npm start`)
- Can change without rebuild (restart server)
- Used in API routes, server components

---

## Environment Files Structure

### File Organization

```
website-mq-studio/
├── .env.example              # Template (committed to git)
├── .env.local                # Local development (gitignored)
├── .env.production           # Production on VPS (gitignored)
└── .gitignore                # Ensures .env.* not committed
```

### .gitignore Configuration

**Verify these lines exist in `.gitignore`:**

```gitignore
# Environment variables
.env
.env.local
.env.development
.env.production
.env*.local

# Keep .env.example (template)
!.env.example
```

### Environment File Priority

Next.js loads env files in this order (later overrides earlier):

1. `.env` (all environments)
2. `.env.local` (all environments, gitignored)
3. `.env.development` (only in `npm run dev`)
4. `.env.production` (only in `npm run build` and `npm start`)
5. `.env.development.local` / `.env.production.local`

**For MQ Studio:**
- **Local dev:** Use `.env.local`
- **VPS production:** Use `.env.production`

---

## Variable Categories

### 1. Core Application Settings

Controls fundamental app behavior.

| Variable | Required | Public | Purpose |
|----------|----------|--------|---------|
| `NODE_ENV` | Yes | No | Environment mode: `development` or `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes | Full site URL for links, SEO, RSS |
| `NEXT_PUBLIC_API_URL` | Optional | Yes | API endpoint URL (defaults to site URL) |
| `CONTACT_EMAIL` | Yes | No | Email address for contact form |

### 2. TinaCMS Configuration

Content management system credentials.

| Variable | Required | Public | Purpose |
|----------|----------|--------|---------|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Production | Yes | TinaCMS Cloud client ID |
| `TINA_TOKEN` | Production | No | TinaCMS Cloud read/write token |
| `TINA_SEARCH_TOKEN` | Optional | No | TinaCMS search feature token |

**Note:** Local dev can use local TinaCMS (no credentials needed). Production requires TinaCMS Cloud.

### 3. Giscus Comments (GitHub Discussions)

Comment system integration.

| Variable | Required | Public | Purpose |
|----------|----------|--------|---------|
| `NEXT_PUBLIC_GISCUS_REPO` | Yes | Yes | GitHub repository (format: `owner/repo`) |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | Production | Yes | Repository ID from giscus.app |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | Yes | Yes | Discussion category name |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | Production | Yes | Category ID from giscus.app |

**Note:** Works without IDs in development (for testing). Production requires actual IDs.

### 4. Email Configuration (SMTP)

Email sending for newsletters, contact forms.

| Variable | Required | Public | Purpose |
|----------|----------|--------|---------|
| `SMTP_HOST` | Yes | No | SMTP server hostname |
| `SMTP_PORT` | Yes | No | SMTP port (465 for SSL, 587 for TLS) |
| `SMTP_SECURE` | Yes | No | `true` for SSL, `false` for TLS |
| `SMTP_USER` | Yes | No | Email account username |
| `SMTP_PASSWORD` | Yes | No | Email account password |
| `SMTP_FROM_EMAIL` | Yes | No | "From" email address |
| `SMTP_FROM_NAME` | Optional | No | "From" display name |

### 5. Optional Services

Additional integrations.

| Variable | Required | Public | Purpose |
|----------|----------|--------|---------|
| `BLOB_READ_WRITE_TOKEN` | Optional | No | Vercel Blob storage (if using) |
| `GOOGLE_ANALYTICS_ID` | Optional | Yes | Google Analytics tracking ID |
| `ANTHROPIC_API_KEY` | Development | No | For testing/development only |

---

## Complete Variable Reference

### .env.example (Template)

**This file is committed to git as a template for developers.**

```bash
# ============================================================================
# CORE CONFIGURATION
# ============================================================================

NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3100
NEXT_PUBLIC_API_URL=http://localhost:3100
CONTACT_EMAIL=moura@mouraquayle.ca

# ============================================================================
# TINACMS CONFIGURATION
# ============================================================================

# TinaCMS Cloud (required for production CMS)
# Get these from https://app.tina.io after creating an account
# Development: Leave blank to use local TinaCMS
# Production: Required for content editing

# NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id-here
# TINA_TOKEN=your-token-here

# TinaCMS Search (optional)
# TINA_SEARCH_TOKEN=your-search-token-here

# ============================================================================
# GISCUS COMMENTS (GitHub Discussions)
# ============================================================================

# GitHub repository for comments (format: username/repo)
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev

# Giscus configuration (get from https://giscus.app after setup)
# You need to:
# 1. Enable Discussions on your GitHub repository
# 2. Install the Giscus GitHub App: https://github.com/apps/giscus
# 3. Visit https://giscus.app to get your IDs

# Repository ID (get from giscus.app)
# NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id

# Discussion category for comments
NEXT_PUBLIC_GISCUS_CATEGORY=Musings

# Category ID (get from giscus.app)
# NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id

# ============================================================================
# EMAIL CONFIGURATION (SMTP)
# ============================================================================

# Hostinger SMTP settings (for production)
# Get credentials from Hostinger email account
# Development: Use Hostinger email or testing service

# SMTP_HOST=smtp.hostinger.com
# SMTP_PORT=465
# SMTP_SECURE=true
# SMTP_USER=contact@mouraquayle.ca
# SMTP_PASSWORD=your-email-password
# SMTP_FROM_EMAIL=contact@mouraquayle.ca
# SMTP_FROM_NAME=MQ Studio

# ============================================================================
# OPTIONAL: ASSET STORAGE
# ============================================================================

# Vercel Blob Storage (optional, for large files)
# BLOB_READ_WRITE_TOKEN=your-blob-token

# ============================================================================
# OPTIONAL: ANALYTICS
# ============================================================================

# Google Analytics (optional)
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# ============================================================================
# DEVELOPMENT ONLY
# ============================================================================

# Stagehand/Testing (development only)
# ANTHROPIC_API_KEY=your-anthropic-key
# BROWSERBASE_API_KEY=your-browserbase-key
```

### .env.local (Local Development)

**Developer creates this file for local development. Never committed.**

```bash
# Core settings for local dev
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3100
NEXT_PUBLIC_API_URL=http://localhost:3100
CONTACT_EMAIL=moura@mouraquayle.ca

# TinaCMS - Local mode (no credentials needed)
# Leave blank to use local filesystem TinaCMS

# Giscus - Works without IDs in dev
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_CATEGORY=Musings

# Email - Optional for local dev
# Can use testing service like Ethereal Email
# SMTP_HOST=smtp.ethereal.email
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=test@ethereal.email
# SMTP_PASSWORD=test-password

# Development tools (optional)
# ANTHROPIC_API_KEY=sk-ant-...
```

### .env.production (VPS Production)

**Created on VPS server. Never committed. Contains real credentials.**

```bash
# ============================================================================
# CORE CONFIGURATION
# ============================================================================

NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mouraquayle.ca
NEXT_PUBLIC_API_URL=https://mouraquayle.ca
CONTACT_EMAIL=moura@mouraquayle.ca

# ============================================================================
# TINACMS CLOUD (REQUIRED FOR PRODUCTION)
# ============================================================================

# Get from https://app.tina.io
NEXT_PUBLIC_TINA_CLIENT_ID=12345678-1234-1234-1234-123456789abc
TINA_TOKEN=1234567890abcdef1234567890abcdef12345678

# Optional: TinaCMS Search
# TINA_SEARCH_TOKEN=search-token-here

# ============================================================================
# GISCUS COMMENTS (REQUIRED FOR PRODUCTION)
# ============================================================================

NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOKZabcd
NEXT_PUBLIC_GISCUS_CATEGORY=Musings
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOKZabcd4Cabcd

# ============================================================================
# EMAIL CONFIGURATION (REQUIRED FOR PRODUCTION)
# ============================================================================

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@mouraquayle.ca
SMTP_PASSWORD=YourStrongPasswordHere123!
SMTP_FROM_EMAIL=contact@mouraquayle.ca
SMTP_FROM_NAME=MQ Studio

# ============================================================================
# OPTIONAL SERVICES
# ============================================================================

# Vercel Blob Storage (if using)
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Google Analytics
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## Development vs Production

### Key Differences

| Aspect | Development (.env.local) | Production (.env.production) |
|--------|--------------------------|------------------------------|
| **Site URL** | `http://localhost:3100` | `https://mouraquayle.ca` |
| **Node ENV** | `development` | `production` |
| **TinaCMS** | Local filesystem mode | TinaCMS Cloud (credentials required) |
| **Giscus** | Works without IDs | Requires actual repo/category IDs |
| **Email** | Optional/testing service | Real SMTP credentials |
| **SSL** | HTTP (no SSL) | HTTPS (SSL required) |
| **Build** | `npm run dev` (hot reload) | `npm run build` + `npm start` |

### Environment Detection

**Next.js automatically sets `NODE_ENV`:**
- `npm run dev` → `NODE_ENV=development`
- `npm run build` → `NODE_ENV=production`
- `npm start` → `NODE_ENV=production`

**Check environment in code:**

```typescript
// Server-side
if (process.env.NODE_ENV === 'production') {
  // Production-only logic
}

// Client-side
if (process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
  // Development-only logic
}
```

---

## Security Best Practices

### 1. Never Commit Secrets

**Check before committing:**
```bash
# Search for potential secrets
git diff --cached | grep -E '(PASSWORD|TOKEN|SECRET|KEY|CREDENTIALS)'

# Ensure .env files gitignored
git status | grep .env
# Should show nothing or only .env.example
```

**If you accidentally committed secrets:**
```bash
# 1. Immediately rotate/change all exposed credentials
# 2. Remove from git history:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.production" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (if necessary)
git push --force
```

### 2. File Permissions on VPS

**Restrict environment file access:**

```bash
# On VPS
cd ~/apps/mq-studio-dev

# Set restrictive permissions (owner read/write only)
chmod 600 .env.production

# Verify
ls -la .env.production
# Should show: -rw------- (only owner can read/write)
```

**Why?**
- Prevents other users on VPS from reading secrets
- Standard security practice for credential files

### 3. Use Strong Passwords

**For production credentials:**
- **Minimum:** 16 characters
- **Include:** Uppercase, lowercase, numbers, symbols
- **Avoid:** Dictionary words, personal info, common patterns

**Generate strong passwords:**
```bash
# Linux/Mac
openssl rand -base64 32

# Or use password manager (1Password, Bitwarden, etc.)
```

### 4. Rotate Credentials Regularly

**Schedule:**
- **Critical credentials (SMTP, database):** Every 90 days
- **API tokens (TinaCMS, Giscus):** Every 180 days
- **After team member departure:** Immediately

**Rotation process:**
1. Generate new credentials in service (TinaCMS Cloud, Hostinger Email)
2. Update `.env.production` on VPS
3. Restart application: `pm2 restart mq-studio`
4. Test functionality
5. Revoke old credentials in service

### 5. Audit Access

**Regularly review who has access:**
- VPS SSH keys
- GitHub repository
- TinaCMS Cloud dashboard
- Hostinger email accounts

**Remove access for:**
- Former team members
- Unused keys
- Compromised credentials

### 6. Monitor for Leaks

**Use automated scanning:**
- **GitHub Secret Scanning:** Automatically enabled on public repos
- **GitGuardian:** Free tier available
- **TruffleHog:** Open-source secret scanner

**Manual checks:**
```bash
# Search codebase for potential secrets
grep -r "PASSWORD=" .
grep -r "sk-" .  # API keys often start with this
grep -r "@" . | grep "smtp"  # Email credentials
```

---

## VPS Configuration

### Creating .env.production on VPS

**Step-by-step process:**

1. **SSH into VPS:**
   ```bash
   ssh mqstudio@YOUR_VPS_IP
   cd ~/apps/mq-studio-dev
   ```

2. **Copy template:**
   ```bash
   cp .env.example .env.production
   ```

3. **Edit with nano:**
   ```bash
   nano .env.production
   ```

4. **Fill in production values** (see sections below for each credential)

5. **Save and exit:**
   - Press `Ctrl+X`
   - Press `Y` to confirm
   - Press `Enter` to save

6. **Set permissions:**
   ```bash
   chmod 600 .env.production
   ```

7. **Verify variables loaded:**
   ```bash
   # Start app temporarily
   npm start

   # In another terminal, check logs
   pm2 logs mq-studio | grep "SITE_URL"
   # Should show https://mouraquayle.ca
   ```

### PM2 Environment File Loading

**Option 1: PM2 Reads .env.production Automatically**

Start PM2 in project directory where `.env.production` exists:

```bash
cd ~/apps/mq-studio-dev
pm2 start npm --name "mq-studio" -- start
```

PM2 will automatically load `.env.production` because `NODE_ENV=production`.

**Option 2: Explicit env_file in ecosystem.config.js**

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'mq-studio',
    script: 'npm',
    args: 'start',
    cwd: '/home/mqstudio/apps/mq-studio-dev',
    env_file: '.env.production',
    env: {
      NODE_ENV: 'production',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

Start with ecosystem file:
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Updating Environment Variables

**When you need to change a variable:**

1. **Edit .env.production:**
   ```bash
   nano .env.production
   # Make changes
   # Save and exit
   ```

2. **Restart application:**
   ```bash
   pm2 restart mq-studio
   ```

3. **Verify changes:**
   ```bash
   pm2 logs mq-studio --lines 20
   # Check that new values are used
   ```

**Note:** Public variables (`NEXT_PUBLIC_*`) require rebuild:
```bash
npm run build
pm2 restart mq-studio
```

---

## TinaCMS Cloud Credentials

### Getting TinaCMS Cloud Credentials

**See detailed guide:** [TINACMS_CLOUD_SETUP.md](TINACMS_CLOUD_SETUP.md)

**Quick steps:**

1. **Create TinaCMS Cloud account:**
   - Visit: https://app.tina.io
   - Sign up with GitHub

2. **Create project:**
   - Click "Create a new project"
   - Name: "MQ Studio"
   - Select repository: `mq-studio/mq-studio-dev`

3. **Get credentials:**
   - Go to project settings
   - Copy **Client ID**: `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Copy **Token**: `TINA_TOKEN`

4. **Add to .env.production:**
   ```bash
   NEXT_PUBLIC_TINA_CLIENT_ID=12345678-1234-1234-1234-123456789abc
   TINA_TOKEN=1234567890abcdef1234567890abcdef12345678
   ```

### TinaCMS Modes

**Local Mode (Development):**
- No credentials needed
- Edits files directly in `content/` directory
- Changes immediately visible
- Perfect for local development

**Cloud Mode (Production):**
- Requires `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`
- Edits sync via TinaCMS Cloud API
- Multi-user editing support
- Required for production deployment

**Fallback Mode (Automatic):**
- If credentials missing in production, falls back to read-only
- Admin UI disabled
- Content still displays
- Graceful degradation

---

## Giscus Configuration

### Getting Giscus Credentials

**See detailed guide:** [GISCUS_SETUP_GUIDE.md](GISCUS_SETUP_GUIDE.md)

**Quick steps:**

1. **Enable GitHub Discussions:**
   - Go to repository: https://github.com/mq-studio/mq-studio-dev
   - Settings → Features → Enable Discussions

2. **Install Giscus GitHub App:**
   - Visit: https://github.com/apps/giscus
   - Install on `mq-studio/mq-studio-dev` repository

3. **Get configuration:**
   - Visit: https://giscus.app
   - Enter repository: `mq-studio/mq-studio-dev`
   - Select category: **Musings** (or create new)
   - Copy generated `data-repo-id` and `data-category-id`

4. **Add to .env.production:**
   ```bash
   NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
   NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOKZabcd
   NEXT_PUBLIC_GISCUS_CATEGORY=Musings
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOKZabcd4Cabcd
   ```

### Giscus Variables Explained

**NEXT_PUBLIC_GISCUS_REPO:**
- Format: `owner/repository`
- Example: `mq-studio/mq-studio-dev`
- Must be public repository

**NEXT_PUBLIC_GISCUS_REPO_ID:**
- GitHub's internal repository ID
- Get from giscus.app
- Format: `R_` followed by random string

**NEXT_PUBLIC_GISCUS_CATEGORY:**
- Human-readable category name
- Must match exactly with GitHub Discussions category
- Example: `Musings`, `Comments`, `General`

**NEXT_PUBLIC_GISCUS_CATEGORY_ID:**
- GitHub's internal category ID
- Get from giscus.app
- Format: `DIC_` followed by random string

---

## Email SMTP Configuration

### Hostinger Email Settings

**See detailed guide:** [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md)

**Quick setup:**

1. **Create email account in Hostinger:**
   - Log into hPanel: https://hpanel.hostinger.com
   - Go to Emails section
   - Create email: `contact@mouraquayle.ca`
   - Set strong password

2. **Get SMTP settings:**
   - **Host:** `smtp.hostinger.com`
   - **Port:** 465 (SSL) or 587 (TLS)
   - **Username:** Full email address (`contact@mouraquayle.ca`)
   - **Password:** Email account password

3. **Add to .env.production:**
   ```bash
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=contact@mouraquayle.ca
   SMTP_PASSWORD=YourEmailPasswordHere
   SMTP_FROM_EMAIL=contact@mouraquayle.ca
   SMTP_FROM_NAME=MQ Studio
   ```

### SMTP Variables Explained

**SMTP_HOST:**
- SMTP server hostname
- For Hostinger: `smtp.hostinger.com`
- Never use IP address, always use hostname

**SMTP_PORT:**
- `465` for SSL (recommended, more secure)
- `587` for STARTTLS
- `25` for non-encrypted (not recommended)

**SMTP_SECURE:**
- `true` for port 465 (SSL)
- `false` for port 587 (STARTTLS)

**SMTP_USER:**
- Full email address
- Example: `contact@mouraquayle.ca`
- Not just username

**SMTP_PASSWORD:**
- Email account password (NOT your Hostinger login password)
- Set when creating email account
- Store securely, never commit to git

**SMTP_FROM_EMAIL:**
- "From" address for sent emails
- Should match SMTP_USER
- Example: `contact@mouraquayle.ca`

**SMTP_FROM_NAME:**
- Display name in "From" field
- Example: `MQ Studio`, `Moura Quayle`, `MQ Studio Newsletter`
- Appears as: "MQ Studio <contact@mouraquayle.ca>"

### Testing Email Configuration

**Create test script** (development only):

```typescript
// scripts/test-email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: 'your-test-email@example.com',
      subject: 'Test Email from MQ Studio',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a test email to verify SMTP configuration.</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}

testEmail();
```

**Run test:**
```bash
npm install nodemailer @types/nodemailer
npx ts-node scripts/test-email.ts
```

---

## Build-Time vs Runtime Variables

### Build-Time Variables

**Variables read during `npm run build`:**

- All `NEXT_PUBLIC_*` variables
- Variables used in:
  - `next.config.js`
  - Static page generation
  - `generateMetadata` functions
  - Client components

**Important:** Changes require rebuild!

```bash
# After changing NEXT_PUBLIC_SITE_URL
npm run build  # REQUIRED
pm2 restart mq-studio
```

### Runtime Variables

**Variables read when server starts (`npm start`):**

- Server-only variables (no `NEXT_PUBLIC_` prefix)
- Variables used in:
  - API routes
  - Server Components
  - Server Actions
  - Middleware

**Changes only require restart:**

```bash
# After changing SMTP_PASSWORD
pm2 restart mq-studio  # Restart sufficient, no rebuild
```

### Quick Reference

| Variable | Type | Change Requires |
|----------|------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Build-time | Rebuild + Restart |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Build-time | Rebuild + Restart |
| `NEXT_PUBLIC_GISCUS_*` | Build-time | Rebuild + Restart |
| `TINA_TOKEN` | Runtime | Restart only |
| `SMTP_*` | Runtime | Restart only |
| `CONTACT_EMAIL` | Runtime | Restart only |

### Deployment Workflow

**Standard deployment with env changes:**

1. **Update .env.production on VPS**
2. **If public variables changed:**
   ```bash
   npm run build
   pm2 restart mq-studio
   ```
3. **If only server variables changed:**
   ```bash
   pm2 restart mq-studio
   ```

---

## Troubleshooting

### Variables Not Loading

**Symptom:** Application can't access environment variables

**Solutions:**

1. **Check file exists:**
   ```bash
   ls -la .env.production
   # Should show file
   ```

2. **Check file permissions:**
   ```bash
   ls -la .env.production
   # Should show: -rw-------
   ```

3. **Verify variable names:**
   - Public variables MUST start with `NEXT_PUBLIC_`
   - No spaces around `=`
   - No quotes needed (usually)
   - Example: `VAR=value` not `VAR = "value"`

4. **Check PM2 is loading env file:**
   ```bash
   pm2 restart mq-studio
   pm2 logs mq-studio --lines 50
   # Look for variable usage in logs
   ```

5. **Test variable access:**
   ```bash
   # Add temporary console.log in code
   console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
   pm2 logs mq-studio
   ```

### Public Variables Undefined in Browser

**Symptom:** `NEXT_PUBLIC_*` variables are `undefined` in client code

**Solutions:**

1. **Verify variable name starts with `NEXT_PUBLIC_`:**
   ```bash
   # ✅ Correct
   NEXT_PUBLIC_SITE_URL=https://mouraquayle.ca

   # ❌ Wrong (missing prefix)
   SITE_URL=https://mouraquayle.ca
   ```

2. **Rebuild application:**
   ```bash
   npm run build
   pm2 restart mq-studio
   ```

3. **Check variable at build time:**
   ```bash
   # During build, you should see variable value in output
   npm run build | grep -i "site"
   ```

### Server Variables Accessible in Browser

**Symptom:** Sensitive variables like `SMTP_PASSWORD` are visible in browser

**This should NEVER happen!** If it does:

1. **Immediately rotate/change the exposed credential**

2. **Check variable name:**
   ```bash
   # ❌ WRONG - this exposes to browser!
   NEXT_PUBLIC_SMTP_PASSWORD=secret

   # ✅ CORRECT - server-only
   SMTP_PASSWORD=secret
   ```

3. **Verify usage in code:**
   ```typescript
   // ✅ Server-only (API route, Server Component)
   const password = process.env.SMTP_PASSWORD;

   // ❌ WRONG - this tries to access in browser (will fail)
   // Client components cannot access non-NEXT_PUBLIC_ vars
   ```

### Email Credentials Not Working

**Symptom:** Email sending fails with authentication error

**Solutions:**

1. **Verify credentials in Hostinger hPanel:**
   - Log into hPanel
   - Go to Emails
   - Verify email account exists
   - Reset password if needed

2. **Check SMTP settings:**
   ```bash
   # Test SMTP connection
   telnet smtp.hostinger.com 465
   # Should connect (press Ctrl+] then type 'quit')
   ```

3. **Verify .env.production:**
   ```bash
   cat .env.production | grep SMTP
   # Check values are correct
   ```

4. **Check for typos:**
   - SMTP_HOST: Must be `smtp.hostinger.com` (not `mail.hostinger.com`)
   - SMTP_USER: Must be full email address (not just username)
   - SMTP_PORT: `465` for SSL, `587` for TLS

### TinaCMS "Unauthorized" Error

**Symptom:** TinaCMS admin shows "Unauthorized" or fails to load

**Solutions:**

1. **Verify credentials:**
   - Log into https://app.tina.io
   - Check Client ID and Token match .env.production

2. **Regenerate token:**
   - In TinaCMS dashboard, regenerate token
   - Update .env.production
   - Rebuild and restart:
     ```bash
     npm run build
     pm2 restart mq-studio
     ```

3. **Check repository access:**
   - TinaCMS Cloud needs access to GitHub repository
   - Verify GitHub integration in TinaCMS dashboard

### Giscus Comments Not Loading

**Symptom:** Comment section appears but doesn't load interface

**Solutions:**

1. **Verify GitHub Discussions enabled:**
   - Go to repository settings
   - Ensure Discussions feature is enabled

2. **Check Giscus app installed:**
   - Visit https://github.com/apps/giscus
   - Verify installed on your repository

3. **Verify IDs are correct:**
   - Visit https://giscus.app
   - Re-generate configuration
   - Compare IDs with .env.production

4. **Rebuild (public variables changed):**
   ```bash
   npm run build
   pm2 restart mq-studio
   ```

### Environment Mismatch (Dev vs Prod)

**Symptom:** App works locally but fails in production

**Solutions:**

1. **Compare environment files:**
   ```bash
   # Local
   cat .env.local

   # Production (SSH into VPS)
   cat .env.production

   # Look for missing variables
   ```

2. **Check NODE_ENV:**
   ```bash
   # Should be 'production' on VPS
   pm2 logs mq-studio | grep NODE_ENV
   ```

3. **Verify URLs:**
   - Local: `http://localhost:3100`
   - Production: `https://mouraquayle.ca` (note HTTPS)

---

## Summary

**Environment variables are critical for:**
- ✅ Securing sensitive credentials
- ✅ Separating dev and production configuration
- ✅ Enabling external service integrations
- ✅ Following security best practices

**Key takeaways:**
1. **Never commit** `.env.production` or `.env.local`
2. **Always use** `NEXT_PUBLIC_` prefix for browser-accessible variables
3. **Set restrictive permissions** (chmod 600) on VPS
4. **Rebuild required** for `NEXT_PUBLIC_*` changes
5. **Restart sufficient** for server-only variable changes
6. **Rotate credentials** regularly (every 90-180 days)

**Next steps:**
- Create `.env.production` on VPS following this guide
- Configure TinaCMS Cloud (see [TINACMS_CLOUD_SETUP.md](TINACMS_CLOUD_SETUP.md))
- Set up Giscus (see [GISCUS_SETUP_GUIDE.md](GISCUS_SETUP_GUIDE.md))
- Configure email (see [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md))

---

**Guide Version:** 1.0
**Last Updated:** November 14, 2025
**Maintained By:** MQ Studio Development Team

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
