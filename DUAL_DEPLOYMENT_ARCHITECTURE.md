# Dual Deployment Architecture
## MQ Studio - Vercel Development + Hostinger Production

**Last Updated:** November 16, 2025
**Strategy:** Best of both worlds - Vercel for dev speed, Hostinger for production cost/control
**Status:** ✅ Ready for implementation

---

## Executive Summary

This architecture combines the **convenience of Vercel** for development with the **cost-efficiency of Hostinger VPS** for production.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                       │
│                                                                  │
│  Local Development → GitHub (mq-studio-dev) → Vercel            │
│                                                                  │
│  • Fast iteration cycle                                         │
│  • Automatic preview deployments                                │
│  • Zero-config deployment                                       │
│  • Free tier or Hobby plan ($20/mo)                            │
│                                                                  │
│  URL: mq-studio-dev.vercel.app                                 │
└─────────────────────────────────────────────────────────────────┘

                              ↓
                    (Tested and approved)
                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION ENVIRONMENT                         │
│                                                                  │
│  GitHub (mq-studio-site) → SSH Deploy → Hostinger VPS          │
│                                                                  │
│  • Predictable costs ($5.84/mo)                                │
│  • DDoS protection included                                     │
│  • Professional email hosting                                   │
│  • Full server control                                         │
│  • Manual deployment (5-10 min)                                │
│                                                                  │
│  URL: mouraquayle.ca                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Cost Comparison

| Environment | Platform | Monthly Cost | Annual Cost |
|-------------|----------|--------------|-------------|
| **Development** | Vercel Free/Hobby | $0-$20 | $0-$240 |
| **Production** | Hostinger VPS KVM 2 | $5.84 | $70.08 |
| **Total** | Hybrid | **$5.84-$25.84** | **$70-$310** |

**vs. Vercel-only production:** Save $170-$430/year
**vs. Hostinger-only:** Trade $70-$240/year for massive dev workflow improvement

---

## Why This Architecture?

### Development: Vercel ✅

**Use Vercel for development because:**

1. **⚡ Speed** - Zero-config deployment (git push = instant preview)
2. **🔄 Preview URLs** - Every PR gets its own URL for testing
3. **🚀 Iteration Speed** - Test changes live in seconds
4. **🎯 Next.js Optimized** - Built by Vercel, perfect Next.js integration
5. **💰 Free/Cheap** - Free tier adequate for development, or $20/mo for team features

**Perfect for:**
- Feature development and testing
- Experiment branches
- Stakeholder previews
- CI/CD integration
- Quick iterations

### Production: Hostinger VPS ✅

**Use Hostinger for production because:**

1. **💵 Cost Predictable** - Fixed $5.84/month (no usage-based surprises)
2. **🛡️ DDoS Protection** - Included (eliminates $3K+ bill risk)
3. **📧 Email Hosting** - Professional email (contact@mouraquayle.ca) included
4. **🔧 Full Control** - Root access, custom configurations
5. **🌍 Bandwidth** - 8 TB included (no overage charges)

**Perfect for:**
- Production traffic
- Email services
- Cost-conscious operation
- Long-term stability

---

## Repository Structure

### GitHub Repositories

```
mq-studio/ (GitHub Organization)
├── mq-studio-dev          # Development & Experimentation (PRIVATE)
│   ├── Connected to: Vercel (auto-deploy)
│   ├── Purpose: Daily development, experiments, testing
│   └── URL: mq-studio-dev.vercel.app
│
└── mq-studio-site         # Production Website (PUBLIC or PRIVATE)
    ├── Deployment: Manual SSH to Hostinger VPS
    ├── Purpose: Stable, tested production code only
    └── URL: mouraquayle.ca
```

### Local Git Configuration

```bash
# Your local repository has dual remotes:
origin      → https://github.com/mq-studio/mq-studio-dev.git      (default)
production  → https://github.com/mq-studio/mq-studio-site.git
```

**Verify with:** `git remote -v`

---

## Deployment Workflows

### Development Deployment (Vercel)

#### Automatic Deployment

```bash
# 1. Make changes locally
npm run dev  # Test on localhost:3100

# 2. Commit and push to dev repo
git add .
git commit -m "feat: Add new feature"
git push origin main

# 3. Vercel auto-deploys
# ✅ Live at: https://mq-studio-dev.vercel.app (within seconds)
```

#### Preview Deployments (Feature Branches)

```bash
# 1. Create feature branch
git checkout -b feature/new-gallery-layout

# 2. Push to dev repo
git push origin feature/new-gallery-layout

# 3. Vercel creates preview URL
# ✅ Live at: https://mq-studio-dev-git-feature-new-gallery-layout.vercel.app

# 4. Share preview URL with stakeholders for feedback
```

#### Experiment Branches

```bash
# 1. Create experiment
git checkout -b experiment/visual-redesign

# 2. Push to dev repo
git push origin experiment/visual-redesign

# 3. Get instant preview URL
# ✅ Test freely without affecting main
```

### Production Deployment (Hostinger VPS)

#### Standard Production Deploy

```bash
# === STEP 1: Ensure dev is tested and stable ===
git checkout main
git pull origin main

# Run all validation checks
npm run lint                    # ESLint
npx tsc --noEmit               # TypeScript
npm run build                   # Production build test
npm run test                    # Run tests

# === STEP 2: Push to production repository ===
git push production main

# === STEP 3: SSH to Hostinger VPS ===
ssh mqstudio@YOUR_VPS_IP

# === STEP 4: Pull latest code on VPS ===
cd ~/apps/mq-studio-dev
git pull origin main            # Pull from mq-studio-site repo

# === STEP 5: Install dependencies (if package.json changed) ===
npm install

# === STEP 6: Build application ===
npm run build

# === STEP 7: Restart PM2 process ===
pm2 restart mq-studio

# === STEP 8: Verify deployment ===
pm2 logs mq-studio --lines 20
# Check https://mouraquayle.ca

# === STEP 9: Exit SSH ===
exit
```

**Deployment time:** 5-10 minutes
**Can be automated:** Yes (via Git hooks or GitHub Actions)

#### Emergency Hotfix

```bash
# 1. Create hotfix from production
git fetch production
git checkout -b hotfix/urgent-fix production/main

# 2. Fix issue
# ... edit files ...
git commit -m "fix: Emergency fix for broken contact form"

# 3. Test locally
npm run build
npm run start

# 4. Push to production repo
git push production hotfix/urgent-fix:main

# 5. SSH and deploy immediately
ssh mqstudio@YOUR_VPS_IP
cd ~/apps/mq-studio-dev
git pull origin main
npm run build
pm2 restart mq-studio

# 6. Backport to dev
git push origin hotfix/urgent-fix
# Merge to dev main via PR or direct merge
```

---

## Environment Configuration

### Vercel Environment Variables (Development)

**Configure at:** https://vercel.com/[project]/settings/environment-variables

```bash
# Core
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=https://mq-studio-dev.vercel.app
NEXT_PUBLIC_API_URL=https://mq-studio-dev.vercel.app

# TinaCMS Cloud (development instance)
NEXT_PUBLIC_TINA_CLIENT_ID=your-dev-client-id
TINA_TOKEN=your-dev-token

# Giscus (can use same as production, or separate dev repo)
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=your-dev-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Development
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-dev-category-id

# Email (dev testing - optional)
CONTACT_EMAIL=dev@mouraquayle.ca
```

**Set via CLI:**
```bash
vercel env add NEXT_PUBLIC_SITE_URL
# Enter value, select environments (Production, Preview, Development)
```

### Hostinger Environment Variables (Production)

**Location:** `/home/mqstudio/apps/mq-studio-dev/.env.production`

```bash
# Core
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mouraquayle.ca
NEXT_PUBLIC_API_URL=https://mouraquayle.ca
CONTACT_EMAIL=moura@mouraquayle.ca

# TinaCMS Cloud (production instance)
NEXT_PUBLIC_TINA_CLIENT_ID=your-prod-client-id
TINA_TOKEN=your-prod-token

# Giscus Comments
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-site
NEXT_PUBLIC_GISCUS_REPO_ID=your-prod-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Musings
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-prod-category-id

# Email (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@mouraquayle.ca
SMTP_PASSWORD=your-email-password
SMTP_FROM_EMAIL=contact@mouraquayle.ca
SMTP_FROM_NAME=MQ Studio
```

**Security:**
```bash
chmod 600 .env.production  # Owner read/write only
```

---

## Vercel Setup Guide

### 1. Install Vercel CLI

```bash
npm install -g vercel
vercel --version
```

### 2. Login to Vercel

```bash
vercel login
# Follow authentication flow
```

### 3. Link Project to Vercel

#### Option A: Link Existing Project

```bash
cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio
vercel link

# Select options:
# - Set up existing project? Yes
# - Which scope? [Your username/team]
# - Link to existing project? Yes
# - What's the name? mq-studio-dev (or create new)
```

#### Option B: Create New Vercel Project

```bash
cd /home/ichardart/dev/projects/moura-quayle/website-mq-studio
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your username/team]
# - Link to existing project? No (create new)
# - Project name? mq-studio-dev
# - Directory? ./ (current directory)
# - Detected Next.js? Yes
# - Override settings? No (use defaults)
```

### 4. Connect to GitHub

**Via Vercel Dashboard:**

1. Go to https://vercel.com/[username]/mq-studio-dev/settings/git
2. Click "Connect Git Repository"
3. Select "GitHub"
4. Authorize Vercel GitHub App (if not already)
5. Select repository: `mq-studio/mq-studio-dev`
6. Configure:
   - **Production Branch:** `main`
   - **Auto Deploy:** Enabled
   - **Preview Deployments:** Enabled for all branches

**Result:** Every push to `mq-studio-dev` triggers automatic deployment

### 5. Configure Environment Variables

```bash
# Add environment variables via CLI
vercel env add NEXT_PUBLIC_SITE_URL
# Value: https://mq-studio-dev.vercel.app
# Environments: Production, Preview, Development

# Or via dashboard:
# https://vercel.com/[username]/mq-studio-dev/settings/environment-variables
```

### 6. Deploy

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

### 7. Configure Custom Domain (Optional)

If you want a custom subdomain for dev:

1. Add subdomain DNS record: `dev.mouraquayle.ca` → Vercel IPs
2. In Vercel dashboard: Settings → Domains → Add `dev.mouraquayle.ca`
3. Verify and auto-configure SSL

---

## Hostinger Setup Guide

**Comprehensive guide:** [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)
**Quick reference:** [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md)

### Quick Setup Checklist

- [ ] Purchase Hostinger VPS KVM 2 ($5.84/month)
- [ ] Choose Ubuntu 24.04 with Node.js template
- [ ] Configure SSH key authentication
- [ ] Install Node.js 20.x and PM2
- [ ] Clone repository to VPS
- [ ] Create `.env.production` with production variables
- [ ] Build application (`npm run build`)
- [ ] Start with PM2 (`pm2 start npm --name mq-studio -- start`)
- [ ] Configure Nginx reverse proxy
- [ ] Obtain SSL certificate (Let's Encrypt)
- [ ] Point domain DNS to VPS IP
- [ ] Configure Hostinger email

**Estimated setup time:** 6-10 hours (first time)

---

## Content Management Workflow

### Editing Content (TinaCMS)

#### Development Editing

```bash
# 1. Visit TinaCMS admin on dev
https://mq-studio-dev.vercel.app/admin

# 2. Login with TinaCMS credentials

# 3. Edit content
# - Create/edit musings posts
# - Update gallery images
# - Modify publications

# 4. Save changes
# - TinaCMS commits to GitHub (mq-studio-dev)
# - Vercel auto-deploys
# - Preview immediately
```

#### Production Content Updates

**Option 1: Via Development → Production Flow**

```bash
# 1. Edit on dev (https://mq-studio-dev.vercel.app/admin)
# 2. Test changes on dev site
# 3. When satisfied, sync to production:

git checkout main
git pull origin main
git push production main

# 4. SSH deploy to Hostinger (see deployment workflow above)
```

**Option 2: Direct Production Editing** (Not Recommended)

```bash
# 1. Configure TinaCMS to commit directly to mq-studio-site repo
# 2. Edit at https://mouraquayle.ca/admin
# 3. SSH deploy changes immediately

# ⚠️ Risk: No dev testing, direct production changes
```

**Recommendation:** Use Option 1 (dev → production flow) for safety

---

## Monitoring & Maintenance

### Development (Vercel)

**Monitoring:**
- Vercel Dashboard: https://vercel.com/[username]/mq-studio-dev
- Deployment logs: `vercel logs`
- Analytics (if enabled): Built-in Vercel Analytics

**Maintenance:**
- Zero maintenance required
- Automatic platform updates
- Automatic SSL renewal

**Costs to Monitor:**
- Check Vercel usage dashboard monthly
- Ensure staying within free/hobby tier limits
- Watch for bandwidth spikes

### Production (Hostinger VPS)

**Monitoring:**
```bash
# SSH to VPS
ssh mqstudio@YOUR_VPS_IP

# Check application status
pm2 list
pm2 logs mq-studio --lines 50

# Check system resources
htop           # CPU, memory
df -h          # Disk usage
free -h        # Memory usage
```

**Weekly Maintenance:**
```bash
# Security updates
sudo apt update
sudo apt upgrade -y

# Check logs for errors
pm2 logs mq-studio | grep -i error

# Verify SSL certificate
sudo certbot certificates
```

**Monthly Maintenance:**
```bash
# Full system upgrade
sudo apt full-upgrade -y

# Update Node.js packages
cd ~/apps/mq-studio-dev
npm update
npm audit fix

# Rebuild application
npm run build
pm2 restart mq-studio

# Verify backups
ls -lh ~/backups/
```

**Uptime Monitoring (Recommended):**
- Sign up: https://uptimerobot.com (free)
- Add monitor: https://mouraquayle.ca
- Configure email alerts

---

## Testing Strategy

### Local Testing

```bash
# Development server
npm run dev
# Visit: http://localhost:3100

# Production build test
npm run build
npm run start
# Visit: http://localhost:3000
```

### Development Environment Testing

```bash
# 1. Push to dev
git push origin feature/my-feature

# 2. Wait for Vercel deployment (30-60 seconds)

# 3. Visit preview URL
https://mq-studio-dev-git-feature-my-feature.vercel.app

# 4. Test functionality:
# - All pages load
# - Images display
# - TinaCMS admin works
# - Comments load (Giscus)
# - Forms function
# - Mobile responsiveness
```

### Pre-Production Testing

```bash
# Before deploying to Hostinger:

# 1. Ensure dev site fully tested
# 2. Run all validation
npm run lint
npx tsc --noEmit
npm run build

# 3. Visual regression testing (if applicable)
npm run test:e2e

# 4. Performance testing
# - Lighthouse audit on dev URL
# - Check Core Web Vitals
```

### Production Verification

```bash
# After deploying to Hostinger:

# 1. Verify deployment succeeded
pm2 logs mq-studio --lines 20

# 2. Check production site
https://mouraquayle.ca

# 3. Test critical paths:
# - Homepage loads
# - Gallery pages work
# - Musings posts display
# - Contact form sends email
# - SSL certificate valid
# - HTTP→HTTPS redirect

# 4. Performance check
# - Run Lighthouse on production
# - Check SSL grade: https://www.ssllabs.com/ssltest/
```

---

## Troubleshooting

### Vercel Issues

**Deployment Failed:**
```bash
# Check logs
vercel logs [deployment-url]

# Common issues:
# - Build errors → Fix locally first
# - Missing env vars → Add via dashboard
# - TypeScript errors → Run `npx tsc --noEmit`
```

**Environment Variables Not Working:**
```bash
# Redeploy to pick up new env vars
vercel --prod

# Or trigger via git push (if auto-deploy enabled)
```

**Domain Not Working:**
- Check DNS records point to Vercel
- Verify domain added in Vercel dashboard
- Wait for DNS propagation (24-48 hours)

### Hostinger VPS Issues

**Application Won't Start:**
```bash
# Check PM2 status
pm2 list

# View logs
pm2 logs mq-studio --lines 100

# Restart
pm2 restart mq-studio

# If still failing, check:
ls -la .next/         # Build artifacts present?
cat .env.production   # Environment variables correct?
node --version        # Node.js 18+ installed?
```

**502 Bad Gateway:**
```bash
# Is app running?
pm2 list

# Is Nginx running?
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart everything
pm2 restart mq-studio
sudo systemctl restart nginx
```

**SSL Certificate Issues:**
```bash
# Renew certificate
sudo certbot renew

# Check expiration
sudo certbot certificates

# Reload Nginx
sudo systemctl reload nginx
```

**See full troubleshooting guide:** [HOSTINGER_DEPLOYMENT_GUIDE.md#troubleshooting](HOSTINGER_DEPLOYMENT_GUIDE.md#troubleshooting)

---

## Cost Analysis

### Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel (Dev)** | $0-$20 | Free tier likely sufficient |
| **Hostinger VPS (Prod)** | $5.84 | Fixed, predictable |
| **Domain** | $0-$15 | Often included with Hostinger |
| **Email** | $0 | Included with Hostinger |
| **Total** | **$5.84-$40.84** | Likely $5.84-$25.84 |

### Annual Costs

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel (Dev)** | $0-$240 | $20/mo × 12 if Hobby plan |
| **Hostinger VPS (Prod)** | $70.08 | $5.84/mo × 12 |
| **Domain** | $0-$180 | Varies by TLD |
| **Total** | **$70-$490** | Likely $70-$310 |

### Cost Optimization Tips

**Keep Vercel Free:**
- Use free tier for development (100 GB bandwidth)
- Only upgrade to Hobby if need team features
- Delete old preview deployments to save bandwidth

**Hostinger Savings:**
- Purchase 1-year term for best price ($5.84/mo)
- 2-year term: Even cheaper per month
- 30-day money-back guarantee

**Total Estimated Cost:**
- **Minimum:** $70/year (Vercel free + Hostinger)
- **Recommended:** $310/year (Vercel Hobby + Hostinger + domain)
- **Maximum:** $490/year (Vercel Hobby + Hostinger + premium domain)

---

## Migration & Rollback

### Rollback Production to Previous Version

```bash
# SSH to VPS
ssh mqstudio@YOUR_VPS_IP

# Navigate to app directory
cd ~/apps/mq-studio-dev

# Find commit hash to revert to
git log --oneline -10

# Reset to specific commit
git reset --hard [commit-hash]

# Rebuild and restart
npm run build
pm2 restart mq-studio
```

### Migrate from Vercel-Only to Dual Architecture

**If you're currently using Vercel for production:**

1. **Keep Vercel production running** (no downtime)
2. **Set up Hostinger VPS** (follow setup guide)
3. **Test on VPS staging domain** (test.mouraquayle.ca)
4. **Switch DNS when ready** (point mouraquayle.ca to VPS)
5. **Keep Vercel dev** for development workflow
6. **Cancel/downgrade Vercel production** after successful migration

**Estimated migration time:** 1-2 days

### Migrate from Hostinger-Only to Dual Architecture

**If you're currently using only Hostinger:**

1. **Set up Vercel dev project** (this guide)
2. **Connect to mq-studio-dev GitHub repo**
3. **Configure dev environment variables**
4. **Test deployments**
5. **Keep Hostinger as production** (no changes needed)
6. **Enjoy faster dev workflow!**

**Estimated setup time:** 2-4 hours

---

## Security Considerations

### Vercel Security

**Built-in:**
- ✅ Automatic HTTPS/SSL
- ✅ DDoS protection (on paid plans)
- ✅ Edge network firewall
- ✅ Automatic platform security updates

**Your Responsibility:**
- 🔐 Secure environment variables
- 🔐 GitHub repository access control
- 🔐 TinaCMS credentials
- 🔐 Enable 2FA on Vercel account

### Hostinger VPS Security

**Configured:**
- ✅ UFW firewall (SSH, HTTP, HTTPS only)
- ✅ SSH key authentication
- ✅ Password authentication disabled (recommended)
- ✅ SSL/TLS via Let's Encrypt
- ✅ DDoS protection (Hostinger level)

**Ongoing:**
- 🔄 Weekly security updates (`apt upgrade`)
- 🔄 Monitor PM2 logs for suspicious activity
- 🔄 Review Nginx access logs
- 🔄 Keep Node.js packages updated (`npm audit`)

**Access Control:**
- 🔐 Strong VPS root password
- 🔐 SSH keys only (no password login)
- 🔐 Restrict .env.production permissions (chmod 600)
- 🔐 Rotate credentials quarterly

---

## FAQ

### Q: Why not just use Vercel for everything?

**A:** Vercel production has risks:
- **Cost spikes:** DDoS attacks can cost $3K+ in one month
- **No email hosting:** Need third-party service
- **Usage-based pricing:** Unpredictable costs
- **For MQ Studio:** Hostinger VPS saves $170-$430/year and includes email

### Q: Why not just use Hostinger for everything?

**A:** Hostinger-only loses dev workflow benefits:
- **Slow iteration:** Manual deploy takes 5-10 minutes
- **No preview URLs:** Can't share feature previews easily
- **No auto-deployment:** Must SSH and deploy manually every time
- **For MQ Studio:** Adding Vercel dev improves productivity significantly

### Q: Can I automate Hostinger deployments?

**A:** Yes! Options:

1. **Git Hooks:** Set up post-receive hook on VPS
2. **GitHub Actions:** CI/CD pipeline to SSH and deploy
3. **Custom Script:** Bash script to automate SSH commands

**Recommendation:** Start manual, automate later if needed

### Q: What if Vercel has an outage?

**A:** Development affected, production unaffected:
- ❌ Can't access dev preview URLs
- ❌ Can't deploy to Vercel
- ✅ Production site (Hostinger) continues running
- ✅ Can develop locally, deploy when Vercel recovers

### Q: What if Hostinger VPS has an outage?

**A:** Production affected, development unaffected:
- ❌ Production site (mouraquayle.ca) down
- ✅ Development site (Vercel) continues working
- ✅ Can continue development and testing
- ✅ Deploy to production when VPS recovers

**Mitigation:** Hostinger offers 99.9% uptime SLA

### Q: Should I make mq-studio-dev public or private?

**A:**
- **Private (Recommended):** Keep experiments and WIP code private
- **Public:** If you want to showcase development process
- **No impact on Vercel:** Works with both public and private repos

### Q: How do I give stakeholders access to preview?

**A:** Two options:

1. **Public dev site:** Share `mq-studio-dev.vercel.app` URL
2. **Password-protected:** Use Vercel's password protection feature (Hobby plan)

### Q: Can I use different TinaCMS instances for dev and prod?

**A:** Yes (recommended):
- **Dev:** Separate TinaCMS project, separate content
- **Prod:** Production TinaCMS project
- **Benefit:** Test CMS changes without affecting production

**Or** use same TinaCMS instance for simplicity (commits to both repos)

---

## Summary

**Dual Deployment Architecture = Best of Both Worlds**

### Development on Vercel ⚡
- Instant deployments
- Preview URLs for every feature
- Zero-config Next.js optimization
- Fast iteration cycle

### Production on Hostinger 💰
- Predictable costs ($5.84/mo)
- DDoS protection included
- Email hosting included
- Full server control

### Total Cost 💵
- **Minimum:** $70/year
- **Recommended:** $310/year
- **Savings vs Vercel-only:** $170-$430/year

### Next Steps

1. ✅ Review this architecture document
2. 🔧 Set up Vercel for development (see [Vercel Setup Guide](#vercel-setup-guide))
3. 🔧 Set up Hostinger for production (see [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md))
4. 🧪 Test both environments
5. 🚀 Deploy and enjoy!

---

**Architecture Version:** 1.0
**Last Updated:** November 16, 2025
**Status:** Ready for implementation
**Maintained By:** MQ Studio Development Team

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
