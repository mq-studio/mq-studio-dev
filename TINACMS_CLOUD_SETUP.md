# TinaCMS Cloud Setup Guide
## MQ Studio - Production Content Management

**Last Updated:** November 14, 2025
**Application:** Next.js 14 with TinaCMS
**Estimated Setup Time:** 30-45 minutes

---

## Table of Contents

1. [Overview](#overview)
2. [Why TinaCMS Cloud?](#why-tinacms-cloud)
3. [Prerequisites](#prerequisites)
4. [Account Creation](#account-creation)
5. [Project Setup](#project-setup)
6. [Getting Credentials](#getting-credentials)
7. [Configuration](#configuration)
8. [Testing](#testing)
9. [Content Editing Workflow](#content-editing-workflow)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### What is TinaCMS Cloud?

TinaCMS Cloud is a hosted backend for TinaCMS that enables:
- **Git-backed content management** - Content stored in your GitHub repository
- **Multi-user editing** - Multiple editors can work simultaneously
- **Real-time preview** - See changes before committing
- **Media management** - Upload and manage images
- **Version control** - All content changes tracked in Git

### TinaCMS Modes

**Local Mode (Development):**
```
Developer → TinaCMS UI → Local Files → Git
```
- Edits `content/` directory directly
- No cloud connection needed
- Perfect for development

**Cloud Mode (Production):**
```
Editor → TinaCMS UI → TinaCMS Cloud API → GitHub → Deployment
```
- Edits sync via TinaCMS Cloud
- Non-technical users can edit content
- Required for production

**MQ Studio uses:** Local mode for development, Cloud mode for production.

---

## Why TinaCMS Cloud?

### For Non-Technical Editors (Moura)

✅ **User-Friendly Interface**
- Visual editor, no code required
- Rich text editing with preview
- Image upload via drag-and-drop
- Form-based content management

✅ **No Git Knowledge Required**
- TinaCMS handles commits
- No terminal, no command line
- Click "Save" and content is live

✅ **Safe Editing**
- Preview before publishing
- Can revert changes (Git history)
- No risk of breaking site

### For Developers

✅ **Git-Backed**
- All content in version control
- Full audit trail
- Can edit via code OR CMS

✅ **Type-Safe**
- TypeScript schema enforcement
- Cannot save invalid content
- Prevents content errors

✅ **Flexible**
- Edit locally during development
- Deploy with cloud mode for production
- Fallback if cloud unavailable

### Cost

**Free Tier:**
- 2 users
- Unlimited content
- 1 GB media storage
- Perfect for MQ Studio

**Paid Plans** (if you grow):
- More users
- More storage
- Advanced features
- Starts at $29/month

---

## Prerequisites

### Required Before Starting

1. **GitHub Account**
   - Repository access to `mq-studio/mq-studio-dev`
   - Admin permissions (to install TinaCMS app)

2. **Repository Deployed**
   - Site must be accessible at production URL
   - Example: `https://mouraquayle.ca`

3. **Admin Access**
   - Ability to install GitHub apps
   - Access to repository settings

---

## Account Creation

### Step 1: Sign Up for TinaCMS Cloud

1. **Visit TinaCMS Cloud:**
   - Go to: https://app.tina.io

2. **Sign Up with GitHub:**
   - Click "Sign up with GitHub"
   - Authorize TinaCMS to access your GitHub account
   - Grant permissions when prompted

3. **Verify Email:**
   - Check your email for verification link
   - Click link to confirm account

4. **Complete Profile:**
   - Add your name
   - Choose username
   - Set up organization (if prompted)

**Expected time:** 5 minutes

---

## Project Setup

### Step 2: Create New Project

1. **Access TinaCMS Dashboard:**
   - Log in to https://app.tina.io
   - You'll see the projects dashboard

2. **Create Project:**
   - Click "Create a project" or "+ New Project"
   - You'll see project creation wizard

3. **Connect Repository:**
   - Select "Import your repository"
   - Authorize TinaCMS GitHub App (if not already authorized)
   - Select repository: `mq-studio/mq-studio-dev`
   - Choose branch: `main`

4. **Configure Project:**
   - **Project Name:** `MQ Studio`
   - **Description:** "Official Moura Quayle portfolio and blog"
   - Click "Continue"

5. **Detect Schema:**
   - TinaCMS will scan your repository
   - Should auto-detect schema in `tina/config.ts`
   - If detected: ✅ "Schema found"
   - If not detected: See [troubleshooting](#troubleshooting)

6. **Configure Build:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
   - These should be auto-detected
   - Click "Continue"

7. **Review and Create:**
   - Review all settings
   - Click "Create Project"

**Expected time:** 10 minutes

---

## Getting Credentials

### Step 3: Get Client ID and Token

**Once project is created:**

1. **Navigate to Project Settings:**
   - Click on your project ("MQ Studio")
   - Click "Settings" or gear icon

2. **Find API Credentials:**
   - Look for "API Credentials" section
   - OR navigate to "Overview" tab

3. **Copy Client ID:**
   - Find `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Click "Copy" or select and copy
   - Example: `12345678-1234-1234-1234-123456789abc`

4. **Generate/Copy Token:**
   - Find `TINA_TOKEN`
   - If not generated: Click "Generate Token"
   - Click "Copy" or select and copy
   - Example: `1234567890abcdef1234567890abcdef12345678`

5. **Save Credentials Securely:**
   - Store in password manager (recommended)
   - Or save in secure note
   - You'll need these for `.env.production`

**⚠️ IMPORTANT:**
- **Token is secret** - Never commit to git
- **Token has full access** - Treat like a password
- **Save it now** - May not be shown again

---

## Configuration

### Step 4: Configure Production Environment

**On your VPS (Hostinger):**

1. **SSH into VPS:**
   ```bash
   ssh mqstudio@YOUR_VPS_IP
   cd ~/apps/mq-studio-dev
   ```

2. **Edit .env.production:**
   ```bash
   nano .env.production
   ```

3. **Add TinaCMS Credentials:**
   ```bash
   # TinaCMS Cloud Configuration
   NEXT_PUBLIC_TINA_CLIENT_ID=12345678-1234-1234-1234-123456789abc
   TINA_TOKEN=1234567890abcdef1234567890abcdef12345678
   ```

4. **Save and Exit:**
   - Press `Ctrl+X`
   - Press `Y` to confirm
   - Press `Enter` to save

5. **Rebuild Application:**
   ```bash
   npm run build
   ```

   **Why rebuild?**
   - `NEXT_PUBLIC_TINA_CLIENT_ID` is a public variable
   - Public variables are embedded at build time
   - Rebuild required for changes to take effect

6. **Restart PM2:**
   ```bash
   pm2 restart mq-studio
   ```

7. **Verify Environment Variables:**
   ```bash
   pm2 logs mq-studio --lines 20 | grep -i tina
   ```

### Step 5: Configure TinaCMS Client

**Verify tina/config.ts:**

```typescript
// tina/config.ts

export default defineConfig({
  // TinaCMS Cloud configuration
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  // Branch configuration
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || 'main',

  // ... rest of schema configuration
});
```

**This should already be configured** in your project. If not, add the client configuration.

---

## Testing

### Step 6: Test TinaCMS Admin Access

1. **Access Admin Panel:**
   - Navigate to: `https://mouraquayle.ca/admin`
   - You should see TinaCMS login screen

2. **Log In:**
   - Click "Login with TinaCMS Cloud"
   - Authenticate with GitHub
   - Grant permissions if prompted

3. **Verify Admin Dashboard:**
   - Should see TinaCMS admin interface
   - Left sidebar shows collections:
     - Musings
     - Publications
     - Artworks
     - Pages

4. **Test Content Editing:**
   - Click "Musings" in sidebar
   - Select an existing musing
   - Make a small edit (add a space, change punctuation)
   - Click "Save"
   - TinaCMS should commit to GitHub

5. **Verify Git Commit:**
   - Go to GitHub repository
   - Check recent commits
   - Should see TinaCMS commit with your change

6. **Verify Live Site:**
   - Wait 1-2 minutes for deployment (if using auto-deploy)
   - OR manually rebuild on VPS:
     ```bash
     cd ~/apps/mq-studio-dev
     git pull origin main
     npm run build
     pm2 restart mq-studio
     ```
   - Visit the edited musing on live site
   - Verify change appears

**If all tests pass:** ✅ TinaCMS Cloud is working!

---

## Content Editing Workflow

### For Moura (Non-Technical Editor)

**Creating a New Musing:**

1. **Access Admin:**
   - Go to: `https://mouraquayle.ca/admin`
   - Login with GitHub (one-time per session)

2. **Navigate to Musings:**
   - Click "Musings" in left sidebar
   - Click "+ Create New" button

3. **Fill Out Form:**
   - **Title:** Post title (e.g., "Reflections on Urban Design")
   - **Date:** Publication date (defaults to today)
   - **Category:** Select from: Thinking, Feeling, Doing
   - **Tags:** Add relevant tags (comma-separated)
   - **Excerpt:** Short summary (1-2 sentences)
   - **Body:** Main content (rich text editor)
   - **Featured Image:** Upload image (optional)

4. **Preview:**
   - Click "Preview" to see how it looks
   - Make edits as needed

5. **Save:**
   - Click "Save" when ready
   - TinaCMS commits to GitHub
   - Content is live after rebuild (1-2 minutes)

**Editing Existing Musing:**

1. Access admin → Musings
2. Click on musing to edit
3. Make changes
4. Click "Save"

**Uploading Images:**

1. In rich text editor, click image icon
2. Drag and drop image OR click to browse
3. Image uploads to repository
4. Image embedded in content

### For Developers

**Local Development Workflow:**

```bash
# 1. Make code changes locally
cd ~/projects/mq-studio-dev

# 2. Edit content via local TinaCMS
npm run dev
# Visit http://localhost:3100/admin
# Make content changes (saves to local files)

# 3. Commit everything together
git add .
git commit -m "feat: Update content and add new feature"
git push origin main

# 4. Deploy to production
ssh mqstudio@VPS_IP
cd ~/apps/mq-studio-dev
git pull origin main
npm run build
pm2 restart mq-studio
```

**Production Content Editing:**

- Option A: Edit via `/admin` (TinaCMS Cloud)
- Option B: Edit files directly in repository, push to GitHub
- Both methods work, content stays in sync

---

## Troubleshooting

### Cannot Access /admin

**Symptom:** Visiting `/admin` shows 404 or blank page

**Solutions:**

1. **Verify build included admin routes:**
   ```bash
   ls .next/server/app/admin
   # Should show admin page artifacts
   ```

2. **Check TinaCMS initialization:**
   ```bash
   pm2 logs mq-studio | grep -i tina
   # Look for initialization messages
   ```

3. **Rebuild application:**
   ```bash
   npm run build
   pm2 restart mq-studio
   ```

### "Unauthorized" Error

**Symptom:** Admin shows "Unauthorized" or "Invalid credentials"

**Solutions:**

1. **Verify credentials in .env.production:**
   ```bash
   cat .env.production | grep TINA
   # Check Client ID and Token are correct
   ```

2. **Regenerate token in TinaCMS Cloud:**
   - Log into https://app.tina.io
   - Project Settings → API Credentials
   - Click "Regenerate Token"
   - Update .env.production with new token
   - Rebuild and restart

3. **Check GitHub permissions:**
   - Go to GitHub → Settings → Applications
   - Find TinaCMS
   - Ensure it has access to your repository

### Changes Not Saving

**Symptom:** Click "Save" but changes don't commit to GitHub

**Solutions:**

1. **Check GitHub integration:**
   - TinaCMS Cloud dashboard
   - Verify GitHub app is connected
   - Re-authorize if needed

2. **Check branch name:**
   ```typescript
   // tina/config.ts
   branch: 'main'  // Must match your default branch
   ```

3. **Verify repository permissions:**
   - TinaCMS GitHub App needs write access
   - Check repository → Settings → Integrations

4. **Check TinaCMS Cloud status:**
   - Visit https://status.tina.io
   - Ensure no outages

### Schema Errors

**Symptom:** Admin shows schema validation errors

**Solutions:**

1. **Validate tina/config.ts:**
   ```bash
   npx tinacms audit
   ```

2. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Rebuild schema:**
   ```bash
   npx tinacms build
   ```

### Images Not Uploading

**Symptom:** Image upload fails or images don't appear

**Solutions:**

1. **Check media configuration in tina/config.ts:**
   ```typescript
   media: {
     tina: {
       publicFolder: 'public',
       mediaRoot: 'images',
     },
   },
   ```

2. **Verify public/images directory exists:**
   ```bash
   ls -la public/images
   # Should show directory
   ```

3. **Check file permissions:**
   ```bash
   chmod 755 public/images
   ```

4. **Check storage limits:**
   - TinaCMS Cloud free tier: 1 GB
   - Check dashboard for usage

### Local vs Cloud Sync Issues

**Symptom:** Content differs between local and production

**Solutions:**

1. **Always pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Avoid editing same content in multiple places:**
   - Use local TinaCMS for development
   - Use cloud TinaCMS for production content
   - Don't edit same file simultaneously

3. **If conflict occurs:**
   ```bash
   # Pull latest
   git pull origin main

   # If merge conflicts, resolve manually
   # Or reset to remote (loses local changes!)
   git reset --hard origin/main
   ```

---

## Advanced Configuration

### Custom Media Storage

**By default**, TinaCMS stores media in `public/images`. To use external storage (Cloudinary, Vercel Blob, etc.):

```typescript
// tina/config.ts

export default defineConfig({
  // ... other config

  media: {
    // Option 1: Cloudinary
    loadCustomStore: async () => {
      const pack = await import('next-tinacms-cloudinary');
      return pack.TinaCloudCloudinaryMediaStore;
    },

    // Option 2: Vercel Blob (if using)
    // loadCustomStore: async () => {
    //   const pack = await import('@vercel/blob');
    //   return pack.TinaCloudBlobMediaStore;
    // },
  },
});
```

### Multiple Environments

**To separate staging and production:**

```bash
# .env.staging
NEXT_PUBLIC_TINA_CLIENT_ID=staging-client-id
TINA_TOKEN=staging-token

# .env.production
NEXT_PUBLIC_TINA_CLIENT_ID=production-client-id
TINA_TOKEN=production-token
```

Create separate TinaCMS Cloud projects for each environment.

### Content Branch Strategy

**Option 1: Direct to Main (Current Setup)**
```
Editor → TinaCMS → Commit to main → Deploy
```
- Simple, immediate updates
- Risk: Untested changes go live

**Option 2: Content Branch + PR Workflow**
```
Editor → TinaCMS → Commit to content branch → PR → Review → Merge → Deploy
```
- Safer, allows review
- More complex workflow

Configure in `tina/config.ts`:
```typescript
branch: process.env.NEXT_PUBLIC_TINA_BRANCH || 'content',
```

---

## Summary

**TinaCMS Cloud setup complete!** ✅

**What you've accomplished:**
- ✅ Created TinaCMS Cloud account
- ✅ Connected to GitHub repository
- ✅ Configured production credentials
- ✅ Tested admin access and content editing
- ✅ Verified Git integration

**Moura can now:**
- Edit content via visual interface (`/admin`)
- Upload images
- Create new musings/publications/artworks
- Preview before publishing
- No Git or code knowledge required

**For ongoing use:**
- **Editing:** Visit `https://mouraquayle.ca/admin`
- **Login:** GitHub authentication (one-time per session)
- **Workflow:** Edit → Preview → Save → Auto-deploys
- **Support:** See [TinaCMS docs](https://tina.io/docs) or [Discord](https://discord.com/invite/zumN63Ybpf)

**Cost:** Free tier (sufficient for MQ Studio)

**Next steps:**
- Train Moura on content editing workflow
- Set up email notifications for content changes (GitHub)
- Consider content approval workflow if multiple editors

---

**Guide Version:** 1.0
**Last Updated:** November 14, 2025
**Maintained By:** MQ Studio Development Team

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
