# Vercel Environment Variables Setup Guide
## Quick Reference for mq-studio-dev

**Date:** November 16, 2025
**Project:** mq-studio-dev
**URL:** https://mq-studio-dev.vercel.app

---

## 📁 Files Created

I've created two environment variable files for you:

1. **`.env.vercel`** - Complete reference with all variables and documentation
2. **`.env.vercel.minimal`** - Just the essential 10 variables needed

**⚠️ IMPORTANT:** These files contain placeholders. You need to replace them with actual values.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Credentials

Before adding variables to Vercel, you need these credentials:

#### A. TinaCMS Cloud (2 minutes)

1. **Go to:** https://app.tina.io
2. **Create account** (if you don't have one)
3. **Create new project:**
   - Click "Create Project"
   - Name: "MQ Studio Dev"
   - Choose "Start from scratch" or "Import from GitHub"
4. **Connect to GitHub:**
   - Select `mq-studio/mq-studio-dev` repository
   - Authorize Tina to access repo
5. **Get credentials:**
   - Go to project settings
   - Copy **Client ID** (starts with a hash/ID)
   - Copy **Token** (long string)
   - Save these securely!

**You'll use these for:**
- `NEXT_PUBLIC_TINA_CLIENT_ID` = Client ID
- `TINA_TOKEN` = Token

#### B. Giscus (GitHub Discussions) (3 minutes)

1. **Enable Discussions on your repo:**
   - Go to: https://github.com/mq-studio/mq-studio-dev/settings
   - Scroll to "Features" section
   - Check ✓ "Discussions"
   - Click "Set up discussions"

2. **Install Giscus GitHub App:**
   - Visit: https://github.com/apps/giscus
   - Click "Install"
   - Select `mq-studio` organization
   - Select "Only select repositories"
   - Choose `mq-studio-dev`
   - Click "Install"

3. **Get Giscus IDs:**
   - Go to: https://giscus.app
   - Enter repository: `mq-studio/mq-studio-dev`
   - Choose Discussion category: "General" (or create "Development")
   - Scroll down to "Enable giscus" section
   - Copy the values from the script:
     - `data-repo-id` = Your GISCUS_REPO_ID
     - `data-category-id` = Your GISCUS_CATEGORY_ID

**You'll use these for:**
- `NEXT_PUBLIC_GISCUS_REPO` = `mq-studio/mq-studio-dev`
- `NEXT_PUBLIC_GISCUS_REPO_ID` = Repo ID from giscus.app
- `NEXT_PUBLIC_GISCUS_CATEGORY` = `Development` (or whatever you chose)
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` = Category ID from giscus.app

---

### Step 2: Add Variables to Vercel

#### Option A: Via Dashboard (Recommended)

1. **Go to your Vercel project:**
   - https://vercel.com/rhart696s-projects/mq-studio-dev/settings/environment-variables

2. **For each variable below, click "Add":**

**Required Variables (10 total):**

```
Variable Name: NODE_ENV
Value: development
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://mq-studio-dev.vercel.app
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_API_URL
Value: https://mq-studio-dev.vercel.app
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: CONTACT_EMAIL
Value: dev@mouraquayle.ca
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_TINA_CLIENT_ID
Value: [paste your TinaCMS Client ID]
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: TINA_TOKEN
Value: [paste your TinaCMS Token]
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_GISCUS_REPO
Value: mq-studio/mq-studio-dev
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_GISCUS_REPO_ID
Value: [paste your Giscus Repo ID]
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_GISCUS_CATEGORY
Value: Development
Environments: ☑ Production ☑ Preview ☑ Development

Variable Name: NEXT_PUBLIC_GISCUS_CATEGORY_ID
Value: [paste your Giscus Category ID]
Environments: ☑ Production ☑ Preview ☑ Development
```

3. **Click "Save" after adding all variables**

#### Option B: Via CLI (Advanced)

```bash
# Navigate to project
cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio

# Add each variable
vercel env add NODE_ENV production preview development
# Enter value: development

vercel env add NEXT_PUBLIC_SITE_URL production preview development
# Enter value: https://mq-studio-dev.vercel.app

# ... repeat for all 10 variables
```

#### Option C: Import from File

**Unfortunately, Vercel doesn't support direct .env file upload.**

**Workaround:**
1. Open `.env.vercel.minimal` in a text editor
2. Replace all `REPLACE_WITH_*` placeholders with actual values
3. Copy each line
4. Paste into Vercel dashboard one by one

---

### Step 3: Verify and Redeploy

1. **Check all variables are added:**
   - Go to: https://vercel.com/rhart696s-projects/mq-studio-dev/settings/environment-variables
   - You should see 10 variables listed
   - Each should have all 3 environments checked

2. **Trigger a redeploy:**
   - Go to: https://vercel.com/rhart696s-projects/mq-studio-dev
   - Click "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - **OR** just push a change to GitHub (auto-deploys)

3. **Wait for deployment to complete** (~1-2 minutes)

4. **Visit your site:**
   - https://mq-studio-dev.vercel.app
   - Homepage should load
   - No environment variable errors

---

## ✅ Verification Checklist

After adding variables and deploying:

### Test Homepage
- [ ] Visit `https://mq-studio-dev.vercel.app`
- [ ] Page loads without errors
- [ ] Images display correctly
- [ ] Navigation works

### Test TinaCMS
- [ ] Visit `https://mq-studio-dev.vercel.app/admin`
- [ ] TinaCMS login screen appears
- [ ] Login with your TinaCMS credentials
- [ ] Can see content collections (Musings, Publications, Artworks)
- [ ] Can edit a post (test only, don't save yet)

### Test Giscus Comments
- [ ] Visit any blog post: `https://mq-studio-dev.vercel.app/musings/[any-post]`
- [ ] Scroll to bottom
- [ ] Giscus comments section loads
- [ ] Can see "Sign in with GitHub" option
- [ ] No errors in browser console (F12)

### Check Deployment Logs
- [ ] Go to Vercel deployment
- [ ] Click "View Function Logs"
- [ ] No environment variable warnings
- [ ] Build succeeded
- [ ] No runtime errors

---

## 🔧 Troubleshooting

### "NEXT_PUBLIC_TINA_CLIENT_ID is not defined"

**Fix:**
1. Verify variable is added in Vercel dashboard
2. Ensure it's enabled for all environments
3. Redeploy the project
4. Clear browser cache and reload

### TinaCMS admin page shows error

**Fix:**
1. Check both `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` are set
2. Verify credentials are correct (copy-paste from Tina dashboard)
3. Ensure TinaCMS project is connected to `mq-studio-dev` repo
4. Redeploy

### Giscus comments don't load

**Fix:**
1. Verify GitHub Discussions are enabled on repo
2. Check Giscus app is installed on `mq-studio/mq-studio-dev`
3. Verify all 4 Giscus variables are set correctly
4. Repository must be public for Giscus to work
5. Redeploy

### Build fails with "Missing environment variable"

**Fix:**
1. Check deployment logs for which variable is missing
2. Add the missing variable in Vercel dashboard
3. Ensure it's enabled for correct environments
4. Redeploy

---

## 📋 Quick Reference: All Variables

### Minimal (Required)
```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=https://mq-studio-dev.vercel.app
NEXT_PUBLIC_API_URL=https://mq-studio-dev.vercel.app
CONTACT_EMAIL=dev@mouraquayle.ca
NEXT_PUBLIC_TINA_CLIENT_ID=[from app.tina.io]
TINA_TOKEN=[from app.tina.io]
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=[from giscus.app]
NEXT_PUBLIC_GISCUS_CATEGORY=Development
NEXT_PUBLIC_GISCUS_CATEGORY_ID=[from giscus.app]
```

### Optional (Add Later)
```bash
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
NEXTAUTH_URL=https://mq-studio-dev.vercel.app
BLOB_READ_WRITE_TOKEN=[from Vercel Blob Storage]
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=dev@mouraquayle.ca
SMTP_PASSWORD=[your email password]
```

---

## 🔗 Helpful Links

**Credentials:**
- TinaCMS Dashboard: https://app.tina.io
- Giscus Setup: https://giscus.app
- GitHub Discussions: https://github.com/mq-studio/mq-studio-dev/discussions

**Vercel:**
- Project Dashboard: https://vercel.com/rhart696s-projects/mq-studio-dev
- Environment Variables: https://vercel.com/rhart696s-projects/mq-studio-dev/settings/environment-variables
- Deployments: https://vercel.com/rhart696s-projects/mq-studio-dev/deployments

**Documentation:**
- TinaCMS Docs: https://tina.io/docs/
- Giscus Docs: https://github.com/giscus/giscus
- Next.js Environment Variables: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

---

## 📝 Notes

**Security:**
- ✅ All sensitive values are stored in Vercel (encrypted)
- ✅ Never commit `.env.vercel` with actual values to git
- ✅ These files (`.env.vercel*`) are in `.gitignore`

**Best Practices:**
- Set all variables before first deployment
- Use same values across Production/Preview/Development for consistency
- Document any custom variables you add
- Keep credentials in password manager (1Password, etc.)

**After Setup:**
- You can delete `.env.vercel` and `.env.vercel.minimal` from local directory
- Or keep them as templates (just don't commit with real values)
- All values are now in Vercel dashboard

---

**Setup Time:** 5-10 minutes total
**Last Updated:** November 16, 2025

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
