# Dual Deployment Setup - Complete Package
## MQ Studio: Vercel Development + Hostinger Production

**Date:** November 16, 2025
**Status:** ✅ Documentation Complete, Ready for Implementation
**Architecture:** Hybrid deployment (Vercel dev + Hostinger prod)

---

## What Has Been Prepared

### ✅ Complete Documentation Suite

This comprehensive deployment package includes:

1. **[DUAL_DEPLOYMENT_ARCHITECTURE.md](DUAL_DEPLOYMENT_ARCHITECTURE.md)** (NEW)
   - Complete architecture overview
   - Cost analysis and comparison
   - Development vs production workflows
   - Environment configuration guide
   - Deployment procedures
   - Troubleshooting guide

2. **[VERCEL_SETUP_COMPLETE_GUIDE.md](VERCEL_SETUP_COMPLETE_GUIDE.md)** (NEW)
   - Step-by-step Vercel configuration
   - Three setup options (Dashboard, CLI, Manual)
   - GitHub integration instructions
   - Environment variables reference
   - Deployment verification checklist

3. **[HOSTINGER_PURCHASE_GUIDE.md](HOSTINGER_PURCHASE_GUIDE.md)** (NEW)
   - How to avoid website builder confusion
   - Correct VPS purchase process
   - Plan selection guidance (KVM 2 recommended)
   - Post-purchase next steps
   - Cost breakdown

4. **[HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)** (EXISTING)
   - Comprehensive VPS setup (1,808 lines)
   - Server configuration
   - Application deployment
   - Nginx, SSL, monitoring setup

5. **[DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md)** (EXISTING)
   - Quick reference for deployments
   - Common commands
   - Emergency procedures

6. **[DEV_PRODUCTION_WORKFLOW.md](DEV_PRODUCTION_WORKFLOW.md)** (EXISTING)
   - Git workflow (dual remotes)
   - Branch strategy
   - Sync procedures

### ✅ Automation Scripts

**[scripts/deploy-to-production.sh](scripts/deploy-to-production.sh)** (NEW)
- Automated production deployment
- Pre-deployment checks (lint, TypeScript, build)
- Git push to production
- SSH deployment to VPS
- PM2 restart
- Verification

**Usage:**
```bash
# Full deployment with all checks
./scripts/deploy-to-production.sh

# Quick deployment (skip tests)
./scripts/deploy-to-production.sh --skip-tests
```

### ✅ Current Git & Vercel Status

**Git Remotes (Configured):**
```
origin      → https://github.com/mq-studio/mq-studio-dev.git      ✅
production  → https://github.com/mq-studio/mq-studio-site.git     ✅
```

**Vercel Status:**
```
CLI Version:     48.10.2  ✅
Authenticated:   rhart696  ✅
Project Created: website-mq-studio  ✅
Local Link:      .vercel/ directory  ✅
GitHub Connect:  Pending manual configuration  ⏳
```

---

## Implementation Checklist

### Phase 1: Vercel Development Setup

**Estimated Time:** 15-30 minutes

- [ ] **Review Documentation**
  - [ ] Read [DUAL_DEPLOYMENT_ARCHITECTURE.md](DUAL_DEPLOYMENT_ARCHITECTURE.md)
  - [ ] Read [VERCEL_SETUP_COMPLETE_GUIDE.md](VERCEL_SETUP_COMPLETE_GUIDE.md)

- [ ] **Connect Vercel to GitHub**
  - [ ] Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings/git
  - [ ] Click "Connect Git Repository"
  - [ ] Select `mq-studio/mq-studio-dev`
  - [ ] Set production branch to `main`
  - [ ] Enable auto-deploy for all branches

- [ ] **Configure Environment Variables**
  - [ ] Go to https://vercel.com/rhart696s-projects/website-mq-studio/settings/environment-variables
  - [ ] Add variables listed in [VERCEL_SETUP_COMPLETE_GUIDE.md#environment-variables-reference](VERCEL_SETUP_COMPLETE_GUIDE.md#environment-variables-reference)
  - [ ] Minimum required:
    - [ ] `NEXT_PUBLIC_SITE_URL`
    - [ ] `NEXT_PUBLIC_TINA_CLIENT_ID`
    - [ ] `TINA_TOKEN`
    - [ ] `NEXT_PUBLIC_GISCUS_*` (4 variables)

- [ ] **Test Deployment**
  - [ ] Make small change (e.g., update README)
  - [ ] Commit and push: `git push origin main`
  - [ ] Watch deployment in Vercel dashboard
  - [ ] Visit deployed site
  - [ ] Verify homepage loads

- [ ] **Optional: Rename Project**
  - [ ] Settings → General → Project Name
  - [ ] Change `website-mq-studio` to `mq-studio-dev`
  - [ ] New URL: `https://mq-studio-dev.vercel.app`

**Verification:**
```bash
# Test auto-deployment
echo "# Test" >> README.md
git add README.md
git commit -m "test: Verify Vercel auto-deploy"
git push origin main

# Check deployment
vercel ls

# Visit site
open https://website-mq-studio.vercel.app
```

---

### Phase 2: Hostinger Production Setup

**Estimated Time:** 6-10 hours (first time)

- [ ] **Purchase VPS**
  - [ ] Follow [HOSTINGER_PURCHASE_GUIDE.md](HOSTINGER_PURCHASE_GUIDE.md)
  - [ ] Go to https://www.hostinger.com/vps-hosting (NOT website creation)
  - [ ] Select VPS KVM 2 ($5.84/mo, 12 months)
  - [ ] Choose USA data center
  - [ ] Select Ubuntu 24.04 with Node.js
  - [ ] Set strong root password (save securely!)
  - [ ] Complete purchase
  - [ ] Wait for provisioning email (5-15 min)
  - [ ] Note VPS IP address

- [ ] **Initial VPS Configuration**
  - [ ] Follow [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)
  - [ ] SSH to VPS: `ssh root@YOUR_VPS_IP`
  - [ ] Update system: `apt update && apt upgrade -y`
  - [ ] Create user: `adduser mqstudio`
  - [ ] Configure firewall (UFW)
  - [ ] Set up SSH key authentication
  - [ ] Disable password authentication

- [ ] **Application Deployment**
  - [ ] Install Node.js 20.x (or verify pre-installed)
  - [ ] Install PM2: `npm install -g pm2`
  - [ ] Clone repository: `git clone https://github.com/mq-studio/mq-studio-site.git`
  - [ ] Install dependencies: `npm install`
  - [ ] Create `.env.production` with production variables
  - [ ] Build application: `npm run build`
  - [ ] Start with PM2: `pm2 start npm --name mq-studio -- start`
  - [ ] Configure PM2 startup: `pm2 startup && pm2 save`

- [ ] **Web Server Configuration**
  - [ ] Install Nginx
  - [ ] Create site configuration
  - [ ] Enable site and test config
  - [ ] Obtain SSL certificate: `certbot --nginx`
  - [ ] Configure HTTPS redirect

- [ ] **Domain Configuration**
  - [ ] Point DNS to VPS IP
  - [ ] Add A records for `@` and `www`
  - [ ] Wait for DNS propagation (1-24 hours)
  - [ ] Verify: `dig mouraquayle.ca`

- [ ] **Email Setup** (Optional, can do later)
  - [ ] Create email account in hPanel
  - [ ] Configure SMTP in `.env.production`
  - [ ] Test email sending

**Verification:**
```bash
# SSH to VPS
ssh mqstudio@YOUR_VPS_IP

# Check application status
pm2 list
pm2 logs mq-studio --lines 20

# Check Nginx
sudo systemctl status nginx

# Check SSL
sudo certbot certificates

# Exit and test
exit

# Test production site
curl -I https://mouraquayle.ca
# Should see: HTTP/2 200
```

---

### Phase 3: Workflow Integration

**Estimated Time:** 30 minutes

- [ ] **Set Up Deployment Script**
  - [ ] Set VPS IP: `export VPS_IP=YOUR_VPS_IP`
  - [ ] Or edit script: `scripts/deploy-to-production.sh`
  - [ ] Test deployment:
    ```bash
    ./scripts/deploy-to-production.sh
    ```

- [ ] **Document Your Workflow**
  - [ ] Update [DUAL_DEPLOYMENT_ARCHITECTURE.md](DUAL_DEPLOYMENT_ARCHITECTURE.md) with actual URLs
  - [ ] Add any custom procedures
  - [ ] Note any deviations from standard setup

- [ ] **Test Full Workflow**
  - [ ] Create feature branch: `git checkout -b feature/test-deployment`
  - [ ] Make change
  - [ ] Push to dev: `git push origin feature/test-deployment`
  - [ ] Verify Vercel preview URL
  - [ ] Merge to main: `git checkout main && git merge feature/test-deployment`
  - [ ] Push to dev: `git push origin main`
  - [ ] Deploy to production: `./scripts/deploy-to-production.sh`
  - [ ] Verify production site

- [ ] **Set Up Monitoring** (Recommended)
  - [ ] Sign up for UptimeRobot: https://uptimerobot.com
  - [ ] Add monitor for `https://mouraquayle.ca`
  - [ ] Configure email alerts
  - [ ] Optional: Add monitor for dev site

**Verification:**
```bash
# Verify dual deployment
echo "Test change" >> README.md
git add README.md
git commit -m "test: Verify dual deployment"

# Push to dev (auto-deploys to Vercel)
git push origin main
# Wait 30-60 seconds, check: https://website-mq-studio.vercel.app

# Deploy to production (Hostinger)
./scripts/deploy-to-production.sh
# Check: https://mouraquayle.ca
```

---

## Architecture Summary

### Development Environment (Vercel)

```
Local Development
       ↓
  git push origin main
       ↓
GitHub (mq-studio-dev)
       ↓
  Auto-Deploy (Vercel)
       ↓
https://website-mq-studio.vercel.app
```

**Features:**
- ⚡ Instant deployments (30-60 seconds)
- 🔄 Preview URLs for feature branches
- 📊 Built-in analytics
- 🌐 Global CDN
- 🎯 Zero-config Next.js optimization

**Cost:** $0-$20/month (likely $0 on free tier)

### Production Environment (Hostinger)

```
Local Development
       ↓
  ./scripts/deploy-to-production.sh
       ↓
GitHub (mq-studio-site)
       ↓
  SSH Deploy to VPS
       ↓
Hostinger VPS (Nginx + PM2 + Next.js)
       ↓
https://mouraquayle.ca
```

**Features:**
- 💰 Predictable cost ($5.84/month)
- 🛡️ DDoS protection included
- 📧 Email hosting included
- 🔧 Full server control
- 🌍 8 TB bandwidth

**Cost:** $5.84/month ($70.08/year)

### Total Architecture Cost

| Component | Cost |
|-----------|------|
| Vercel (Dev) | $0-$20/mo |
| Hostinger VPS (Prod) | $5.84/mo |
| Domain | $0-$15/mo |
| **Total** | **$5.84-$40.84/mo** |

**Likely actual:** $5.84-$25.84/mo ($70-$310/year)

---

## Quick Reference Commands

### Development Workflow

```bash
# Create feature
git checkout -b feature/my-feature

# Develop and test locally
npm run dev

# Push to dev (auto-deploys to Vercel)
git push origin feature/my-feature

# Preview URL (automatically created):
# https://website-mq-studio-git-feature-my-feature.vercel.app

# Merge to main
git checkout main
git merge feature/my-feature
git push origin main

# Live on Vercel dev site:
# https://website-mq-studio.vercel.app
```

### Production Deployment

```bash
# Ensure main is tested on dev
git checkout main
git pull origin main

# Deploy to production (automated script)
./scripts/deploy-to-production.sh

# Or manual deployment:
git push production main
ssh mqstudio@YOUR_VPS_IP
cd ~/apps/mq-studio-dev
git pull origin main
npm install
npm run build
pm2 restart mq-studio
exit

# Live on production:
# https://mouraquayle.ca
```

### Monitoring

```bash
# Check Vercel deployments
vercel ls

# Check production VPS
ssh mqstudio@YOUR_VPS_IP 'pm2 list'
ssh mqstudio@YOUR_VPS_IP 'pm2 logs mq-studio --lines 50'

# Check production site
curl -I https://mouraquayle.ca
```

---

## Troubleshooting Resources

**Documentation:**
- Full architecture: [DUAL_DEPLOYMENT_ARCHITECTURE.md](DUAL_DEPLOYMENT_ARCHITECTURE.md)
- Vercel setup: [VERCEL_SETUP_COMPLETE_GUIDE.md](VERCEL_SETUP_COMPLETE_GUIDE.md)
- Hostinger purchase: [HOSTINGER_PURCHASE_GUIDE.md](HOSTINGER_PURCHASE_GUIDE.md)
- VPS deployment: [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)
- Quick reference: [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md)

**Support:**
- Vercel: https://vercel.com/support
- Hostinger: https://www.hostinger.com/contact (24/7 live chat)
- Next.js: https://nextjs.org/docs

---

## Next Steps

### Immediate (Today)

1. ✅ Review all documentation
2. 🔧 Configure Vercel (Phase 1) - **15-30 minutes**
3. 🧪 Test dev deployment
4. 📝 Purchase Hostinger VPS (if not done)

### This Week

1. 🚀 Complete Hostinger setup (Phase 2) - **6-10 hours**
2. 🌐 Point domain to VPS
3. 🔒 Configure SSL
4. ✉️ Set up email

### Ongoing

1. 📊 Monitor both environments
2. 🔄 Use dual deployment workflow
3. 🛡️ Weekly VPS maintenance (security updates)
4. 📈 Optimize based on real traffic

---

## Success Criteria

**You'll know setup is complete when:**

✅ **Development:**
- Pushing to `mq-studio-dev` auto-deploys to Vercel
- Feature branches get preview URLs
- Dev site accessible at `https://website-mq-studio.vercel.app`
- All pages load correctly

✅ **Production:**
- VPS running and accessible via SSH
- Production site at `https://mouraquayle.ca`
- SSL certificate valid (green padlock)
- Email working (contact@mouraquayle.ca)
- PM2 auto-starts on reboot

✅ **Workflow:**
- Can develop and test on Vercel
- Can deploy to production with one script
- Monitoring alerts configured
- Documentation up to date

---

## Cost Summary

### Initial Investment

| Item | Cost |
|------|------|
| Hostinger VPS (Year 1) | $70.08 |
| Domain (if needed) | $15.00 |
| Vercel Dev (optional Hobby) | $0-$240 |
| **Total Year 1** | **$85-$325** |

### Annual Ongoing

| Item | Cost |
|------|------|
| Hostinger VPS (renewal) | ~$70-100 |
| Domain (renewal) | $15 |
| Vercel Dev (free tier likely) | $0 |
| **Total Annual** | **$85-$115** |

**Included at no extra cost:**
- 8 TB bandwidth
- DDoS protection
- Email hosting (300-unlimited/day)
- Weekly backups
- SSL certificates
- 24/7 support

---

## Questions & Answers

**Q: Do I need both Vercel and Hostinger?**

A: Technically no, but the hybrid approach gives you:
- Fast development iteration (Vercel)
- Low production cost (Hostinger)
- Best of both worlds

You could use Vercel-only or Hostinger-only, but you'd lose benefits.

**Q: Can I start with just one and add the other later?**

A: Yes! Recommended approach:
1. Start with Vercel (quick setup, test live)
2. Add Hostinger when ready (migrate production)

**Q: What if I want to switch later?**

A: Both platforms are migration-friendly:
- Vercel → Hostinger: ~1 day
- Hostinger → Vercel: ~2-3 hours

**Q: Is the deployment script required?**

A: No, it's a convenience. You can deploy manually via SSH every time. The script just automates the steps.

**Q: What if something breaks?**

A: Follow troubleshooting guides in each document. Both Vercel and Hostinger have excellent support.

---

## Conclusion

**You now have:**

✅ Complete dual deployment architecture designed
✅ Comprehensive documentation (6 guides, 10,000+ words)
✅ Automated deployment script
✅ Git repository structure ready
✅ Vercel project created and linked
✅ Clear implementation roadmap

**Ready to implement:**

1. **Phase 1:** Configure Vercel (15-30 min)
2. **Phase 2:** Deploy Hostinger (6-10 hours)
3. **Phase 3:** Integrate workflow (30 min)

**Total time to production:** 1-2 days

**Total cost:** $5.84-$25.84/month

**Result:** Professional dual deployment setup with dev preview environment and cost-effective production hosting.

---

**Setup Package Version:** 1.0
**Date:** November 16, 2025
**Status:** Complete and ready for implementation

**Package Includes:**
- 6 comprehensive guides
- 1 automation script
- Git configuration
- Vercel CLI setup
- Complete implementation checklist

🎉 **Everything is ready. Time to deploy!**

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
