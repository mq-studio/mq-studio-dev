# Vercel Setup - Complete Configuration Guide
## Connect mq-studio-dev Repository to Vercel for Development Deployments

**Date:** November 16, 2025
**Status:** Ready to configure
**Goal:** Auto-deploy mq-studio-dev GitHub repository to Vercel for development previews

---

## Current Status

✅ **Vercel CLI Installed:** Version 48.10.2
✅ **Authenticated:** Logged in as `rhart696`
✅ **Project Created:** `website-mq-studio` (ID: prj_SdCFkIvNZKaT7lMthQshzh1audyA)
✅ **Local Directory Linked:** `.vercel/` directory created
⏳ **Pending:** Connect to GitHub mq-studio-dev repository

---

## Step-by-Step Configuration

### Option A: Configure via Vercel Dashboard (Recommended - Easiest)

**This is the easiest approach and what I recommend:**

#### 1. Access Vercel Dashboard

1. Open browser and go to: https://vercel.com/rhart696s-projects/website-mq-studio
2. Or navigate: https://vercel.com → Select `website-mq-studio` project

#### 2. Connect to GitHub Repository

1. In project dashboard, click **Settings** (top navigation)
2. Click **Git** in left sidebar
3. Under "Git Repository", click **Connect Git Repository**
4. Click **GitHub**
5. If prompted, authorize Vercel GitHub App
   - Select "Only select repositories"
   - Choose: `mq-studio/mq-studio-dev`
   - Click "Install & Authorize"
6. Back in Vercel, select `mq-studio/mq-studio-dev` from dropdown
7. Click **Connect**

#### 3. Configure Production Branch

1. Still in Settings → Git
2. Under "Production Branch", ensure it's set to: `main`
3. Enable "Automatically deploy all changes to main branch"
4. Enable "Preview Deployments": **All branches**
5. Click **Save**

#### 4. Verify Connection

1. Go to **Deployments** tab
2. You should see "Connected to mq-studio/mq-studio-dev"
3. Trigger a test deployment:
   ```bash
   # From your local machine
   git push origin main
   ```
4. Watch deployment start automatically in Vercel dashboard

#### 5. Configure Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

**Development Environment Variables:**

| Name | Value | Environments |
|------|-------|--------------|
| `NODE_ENV` | `development` | Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://website-mq-studio.vercel.app` | Preview, Development, Production |
| `NEXT_PUBLIC_API_URL` | `https://website-mq-studio.vercel.app` | Preview, Development, Production |
| `CONTACT_EMAIL` | `dev@mouraquayle.ca` | All |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | [Your dev TinaCMS client ID] | All |
| `TINA_TOKEN` | [Your dev TinaCMS token] | All |
| `NEXT_PUBLIC_GISCUS_REPO` | `mq-studio/mq-studio-dev` | All |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | [Your Giscus repo ID] | All |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | `Development` | All |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | [Your Giscus category ID] | All |

**Click "Add" for each variable, select appropriate environments**

#### 6. Trigger First Deployment

1. Go to **Deployments** tab
2. Click **Create Deployment** (or just push to GitHub)
3. Watch build progress
4. Once complete, click **Visit** to see your dev site

**Your dev site will be live at:**
- Production URL: `https://website-mq-studio.vercel.app`
- Or custom: `https://website-mq-studio-rhart696s-projects.vercel.app`

---

### Option B: Configure via CLI (Advanced)

**If you prefer command-line configuration:**

#### 1. Connect Git Repository

The CLI approach requires answering interactive prompts. Here's how:

```bash
cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio

# Connect to GitHub (will prompt for confirmation)
echo "y" | vercel git connect https://github.com/mq-studio/mq-studio-dev.git
```

**Manually answer prompts:**
- "Do you still want to connect?" → **Yes** (y)
- "Production branch?" → **main**
- "Enable automatic deployments?" → **Yes** (y)

#### 2. Set Environment Variables via CLI

```bash
# Add each environment variable
vercel env add NEXT_PUBLIC_SITE_URL production preview development
# When prompted, enter: https://website-mq-studio.vercel.app

vercel env add NODE_ENV preview development
# When prompted, enter: development

vercel env add NEXT_PUBLIC_TINA_CLIENT_ID production preview development
# When prompted, enter your TinaCMS client ID

vercel env add TINA_TOKEN production preview development
# When prompted, enter your TinaCMS token

# Continue for all variables listed in Option A
```

#### 3. Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

---

### Option C: Manual GitHub App Installation (If Needed)

**If Vercel GitHub App is not installed on mq-studio organization:**

#### 1. Install Vercel GitHub App

1. Go to: https://github.com/apps/vercel
2. Click **Configure**
3. Select organization: `mq-studio`
4. Under "Repository access":
   - Select "Only select repositories"
   - Choose: `mq-studio/mq-studio-dev`
5. Click **Save**

#### 2. Return to Vercel Dashboard

1. Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings/git
2. Click **Connect Git Repository**
3. GitHub should now show `mq-studio/mq-studio-dev` as available
4. Select it and click **Connect**

---

## Verification Checklist

After configuration, verify everything works:

### GitHub Connection
- [ ] Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings/git
- [ ] Should show: "Connected to mq-studio/mq-studio-dev"
- [ ] Production branch: `main`
- [ ] Auto-deploy enabled: ✓

### Environment Variables
- [ ] Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings/environment-variables
- [ ] All variables listed (minimum 8-10 variables)
- [ ] Each variable has correct environments selected

### Deployments
- [ ] Go to https://vercel.com/rhart696s-projects/website-mq-studio
- [ ] Click **Deployments** tab
- [ ] At least one deployment visible
- [ ] Latest deployment status: **Ready** (green checkmark)

### Live Site
- [ ] Visit: https://website-mq-studio.vercel.app
- [ ] Homepage loads correctly
- [ ] No 404 or build errors
- [ ] Images display
- [ ] Navigation works

### Auto-Deploy Test
- [ ] Make a small change locally (e.g., edit README.md)
- [ ] Commit and push:
  ```bash
  git add README.md
  git commit -m "test: Verify Vercel auto-deploy"
  git push origin main
  ```
- [ ] Watch Vercel dashboard - deployment should start automatically
- [ ] Deployment completes successfully
- [ ] Changes visible on live site

---

## Rename Project (Optional)

If you want to rename `website-mq-studio` to `mq-studio-dev`:

### Via Dashboard

1. Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings
2. Click **General** (if not already there)
3. Under "Project Name", click **Edit**
4. Change to: `mq-studio-dev`
5. Click **Save**

**New URLs will be:**
- `https://mq-studio-dev.vercel.app`
- `https://mq-studio-dev-git-[branch].vercel.app` (preview URLs)

### Update Local Configuration

```bash
cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio

# Update .vercel/project.json
nano .vercel/project.json
# Change "projectName": "website-mq-studio" to "projectName": "mq-studio-dev"
```

---

## Configure Custom Domain (Optional)

If you want dev site on a custom subdomain (e.g., `dev.mouraquayle.ca`):

### 1. Add DNS Record

**At your DNS provider (Hostinger, Cloudflare, etc.):**

Add CNAME record:
- Type: `CNAME`
- Name: `dev`
- Value: `cname.vercel-dns.com`
- TTL: 3600 (or Auto)

### 2. Add Domain in Vercel

1. Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings/domains
2. Click **Add**
3. Enter: `dev.mouraquayle.ca`
4. Click **Add**
5. Vercel will verify DNS and auto-configure SSL
6. Wait 1-24 hours for DNS propagation

**Result:** Your dev site will be accessible at `https://dev.mouraquayle.ca`

---

## Environment Variables Reference

### Complete List for Development

**Copy-paste this for reference:**

```bash
# === Core Configuration ===
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=https://website-mq-studio.vercel.app  # Update if renamed
NEXT_PUBLIC_API_URL=https://website-mq-studio.vercel.app
CONTACT_EMAIL=dev@mouraquayle.ca

# === TinaCMS Cloud (Development) ===
# Get from: https://app.tina.io
NEXT_PUBLIC_TINA_CLIENT_ID=your-dev-client-id-here
TINA_TOKEN=your-dev-token-here

# === Giscus Comments (Development) ===
# Get from: https://giscus.app
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id-from-giscus
NEXT_PUBLIC_GISCUS_CATEGORY=Development
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id-from-giscus

# === Optional: Email (Development Testing) ===
# Only if testing email features
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=dev@mouraquayle.ca
SMTP_PASSWORD=your-dev-email-password
SMTP_FROM_EMAIL=dev@mouraquayle.ca
SMTP_FROM_NAME=MQ Studio Dev
```

### Where to Get Credentials

**TinaCMS:**
1. Go to https://app.tina.io
2. Create account (if not already)
3. Create project: "MQ Studio Dev"
4. Copy `Client ID` and `Token` from project settings

**Giscus:**
1. Go to https://giscus.app
2. Enter repository: `mq-studio/mq-studio-dev`
3. Enable GitHub Discussions on repository (if not already)
4. Install Giscus GitHub App
5. Choose Discussion category: "Development" or "General"
6. Copy generated repo ID and category ID

---

## Deployment Workflow After Setup

### Automatic Deployments

**Every push to main branch:**
```bash
git add .
git commit -m "feat: Add new feature"
git push origin main

# Vercel automatically:
# 1. Detects push to mq-studio-dev repo
# 2. Starts build
# 3. Runs: npm install && npm run build
# 4. Deploys to: https://website-mq-studio.vercel.app
# 5. Updates within 30-60 seconds
```

**Preview deployments (feature branches):**
```bash
git checkout -b feature/new-gallery
# Make changes
git push origin feature/new-gallery

# Vercel automatically:
# 1. Creates preview deployment
# 2. URL: https://website-mq-studio-git-feature-new-gallery.vercel.app
# 3. Share URL with stakeholders
```

### Manual Deployments

```bash
# Deploy current branch to preview
vercel

# Deploy current branch to production
vercel --prod

# Deploy specific branch
git checkout feature/my-feature
vercel --prod
```

---

## Troubleshooting

### "Failed to connect to GitHub"

**Solution:**
1. Check GitHub App installation: https://github.com/apps/vercel
2. Ensure `mq-studio/mq-studio-dev` is selected
3. Re-authorize if needed

### "Build failed"

**Check:**
1. Vercel deployment logs: https://vercel.com/rhart696s-projects/website-mq-studio
2. Click failed deployment
3. View build logs
4. Common issues:
   - TypeScript errors → Fix locally first
   - Missing dependencies → Check package.json
   - Environment variables → Verify all are set

**Test build locally:**
```bash
npm run build
# Fix any errors before pushing
```

### "Environment variables not working"

**Solution:**
1. Verify variables are set: https://vercel.com/rhart696s-projects/website-mq-studio/settings/environment-variables
2. Check they're enabled for correct environments (Production/Preview/Development)
3. Redeploy after adding variables:
   ```bash
   vercel --prod --force
   ```

### "Site shows 404"

**Check:**
1. Build succeeded? (Green checkmark in deployments)
2. Correct output directory? (Should be `.next`)
3. Framework detected? (Should be "Next.js")

**Solution:**
1. Go to Settings → General
2. Under "Build & Development Settings"
3. Verify:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` or `next build`
   - Output Directory: Leave empty (Next.js default)
4. Redeploy

---

## Next Steps After Configuration

1. ✅ Complete configuration (Option A recommended)
2. ✅ Verify all checklist items above
3. ✅ Test automatic deployment (push to main)
4. ✅ Test preview deployment (push feature branch)
5. ✅ Update [DUAL_DEPLOYMENT_ARCHITECTURE.md](DUAL_DEPLOYMENT_ARCHITECTURE.md) with actual URLs
6. 📋 Proceed to Hostinger VPS setup (for production)
7. 🎉 Enjoy dual deployment architecture!

---

## Summary

**What You're Setting Up:**

```
GitHub (mq-studio-dev)
        ↓
   Auto-Deploy
        ↓
    Vercel Dev
        ↓
website-mq-studio.vercel.app
```

**Result:**
- Push code → Live in 30-60 seconds
- Feature branches → Instant preview URLs
- Zero manual deployment for dev environment

**Time Required:**
- Option A (Dashboard): **10-15 minutes**
- Option B (CLI): **15-20 minutes**
- Option C (Manual GitHub): **20-25 minutes**

---

## Support

**Vercel Documentation:**
- Getting Started: https://vercel.com/docs
- Git Integration: https://vercel.com/docs/deployments/git
- Environment Variables: https://vercel.com/docs/projects/environment-variables
- CLI Reference: https://vercel.com/docs/cli

**Need Help?**
- Vercel Discord: https://vercel.com/discord
- Vercel Support: https://vercel.com/support

---

**Setup Guide Version:** 1.0
**Last Updated:** November 16, 2025
**Status:** Ready for configuration

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
