# Hostinger VPS Purchase Guide
## How to Buy the Correct Hosting for MQ Studio Production

**Date:** November 16, 2025
**Goal:** Purchase Hostinger VPS KVM 2 for production deployment
**Cost:** $5.84/month (1-year term)

---

## ⚠️ IMPORTANT: Avoid Common Mistake

### ❌ DO NOT Use the "Website Creation" Options

**If you see this screen showing:**
- Hostinger Horizons (AI website builder)
- WordPress
- Hostinger Website Builder
- Custom PHP/HTML website

**YOU ARE IN THE WRONG PLACE!** ❌

These options are for **simple websites**, not Next.js applications.

### ✅ YOU NEED: VPS Hosting (Virtual Private Server)

**Why?**
- Next.js requires Node.js runtime (not available in website builders)
- You need server-side rendering (SSR) support
- You need process management (PM2) and reverse proxy (Nginx)
- You need full control for custom deployment

---

## Step-by-Step Purchase Process

### Step 1: Access VPS Hosting Page

**DO NOT go to "Websites" section in hPanel!**

#### Option A: Direct URL (Recommended)

1. Go directly to: **https://www.hostinger.com/vps-hosting**
2. This bypasses the website creation screen entirely

#### Option B: From Main Hostinger Page

1. Go to: https://www.hostinger.com
2. Hover over "Hosting" in top menu
3. Click "VPS Hosting" (NOT "Website Builder" or "Web Hosting")

#### Option C: From hPanel

1. Log into hPanel: https://hpanel.hostinger.com
2. Click "Services" in left sidebar
3. Click "VPS" tab (NOT "Websites")
4. Click "Order New VPS"

---

### Step 2: Select VPS Plan

**You should see a page with VPS plans like:**

```
┌──────────────────────────────────────────────────────┐
│         VPS HOSTING PLANS                             │
├──────────────────────────────────────────────────────┤
│                                                       │
│  KVM 1         KVM 2 ⭐        KVM 4        KVM 8    │
│  $4.99/mo      $5.84/mo       $10.99/mo    $18.99/mo │
│                                                       │
│  1 vCPU        2 vCPU         4 vCPU       8 vCPU    │
│  4 GB RAM      8 GB RAM       16 GB RAM    32 GB RAM │
│  50 GB SSD     100 GB SSD     200 GB SSD   400 GB    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Select: KVM 2** ⭐ (Recommended)

**Why KVM 2?**
- Perfect for Next.js application (50K visitors/month capacity)
- Enough RAM for builds (8 GB)
- Room to grow
- Best price/performance ratio for MQ Studio

**Click "Add to Cart" or "Select" on KVM 2**

---

### Step 3: Choose Billing Period

You'll see pricing options:

| Period | Price/Month | Total | Savings |
|--------|-------------|-------|---------|
| 1 Month | $14.99 | $14.99 | - |
| 12 Months | **$5.84** | **$70.08** | 61% ⭐ |
| 24 Months | $5.49 | $131.76 | 63% |
| 48 Months | $4.99 | $239.52 | 67% |

**Recommended: 12 Months** ($70.08 total)

**Why 12 months?**
- Best balance of commitment vs flexibility
- Significant savings vs month-to-month
- 30-day money-back guarantee (risk-free)
- Can upgrade/downgrade later

**Select: 12 months**

---

### Step 4: Choose Data Center Location

**You'll be asked to select a server location:**

```
North America:
  ⭐ USA (recommended for Canada/US)

Europe:
  • Netherlands
  • United Kingdom
  • France
  • Lithuania

Asia:
  • Singapore
  • India
```

**For MQ Studio: Select USA** ⭐

**Why USA?**
- Client is in Canada (lowest latency)
- Majority of visitors likely North American
- Good global reach
- Excellent infrastructure

---

### Step 5: Choose Operating System

**You'll see OS templates:**

```
┌─────────────────────────────────────────────┐
│  Operating Systems                          │
├─────────────────────────────────────────────┤
│                                             │
│  ⭐ Ubuntu 24.04 with Node.js               │
│  • Ubuntu 24.04 LTS                         │
│  • Ubuntu 22.04 LTS                         │
│  • Debian 11                                │
│  • CentOS 7                                 │
│  • AlmaLinux 8                              │
│  • Ubuntu 20.04 with Docker                 │
│  • Ubuntu 20.04 with CyberPanel             │
│                                             │
└─────────────────────────────────────────────┘
```

**Select: Ubuntu 24.04 with Node.js** ⭐

**Why this template?**
- Pre-configured Ubuntu 24.04 LTS (long-term support)
- Node.js pre-installed (saves setup time)
- Optimized for Node.js applications
- Most compatible with our deployment guide

**Alternative:** Plain Ubuntu 24.04 LTS (if Node.js template not available)
- You'll install Node.js manually (covered in deployment guide)

---

### Step 6: Configure VPS Settings

#### Set Hostname (Optional)

**Default:** `vps-XXXXX.hostinger.com`

**Custom suggestion:** `mq-studio-prod` or `mouraquayle-vps`

**Note:** This is just for identification, doesn't affect your domain

#### Set Root Password

**IMPORTANT:** Choose a strong password!

**Requirements:**
- Minimum 8 characters
- Include: uppercase, lowercase, numbers, symbols
- Don't use common words

**Example generator:**
```
MqStud!0Pr0d#2025$VPS
```

**⚠️ SAVE THIS PASSWORD SECURELY!**
- You'll need it for first SSH login
- Store in password manager (1Password, LastPass, etc.)

---

### Step 7: Add-ons (Optional)

**You may be offered add-ons:**

#### Domain Registration
- **If you don't have mouraquayle.ca yet:** ✅ Add it
- **If you already own the domain:** ❌ Skip (transfer later if desired)

#### Email Hosting
- **Already included FREE with VPS!** ✅
- 300 emails/day on free tier
- Unlimited on premium plans
- Professional email: contact@mouraquayle.ca

#### Backups
- **Already included!** ✅
- Weekly automated backups
- No need to purchase extra

#### SSL Certificate
- **Free via Let's Encrypt!** ✅
- No need to purchase
- We'll set up in deployment guide

#### DDoS Protection
- **Already included!** ✅
- Automatic DDoS mitigation
- No extra cost

**Recommendation: Skip all add-ons** (everything needed is included)

---

### Step 8: Review and Checkout

**Review your order:**

```
┌────────────────────────────────────────┐
│  ORDER SUMMARY                          │
├────────────────────────────────────────┤
│  VPS KVM 2 (12 months)       $70.08    │
│  Data Center: USA                      │
│  OS: Ubuntu 24.04 with Node.js         │
│  ──────────────────────────────────    │
│  Subtotal                    $70.08    │
│  Tax (if applicable)         $X.XX     │
│  ──────────────────────────────────    │
│  TOTAL                       $7X.XX    │
└────────────────────────────────────────┘
```

**Verify:**
- [ ] VPS KVM 2 selected (NOT website hosting)
- [ ] 12 months selected
- [ ] USA data center
- [ ] Ubuntu 24.04 with Node.js
- [ ] Total approximately $70-80 (including tax)

**Click "Proceed to Checkout"**

---

### Step 9: Payment

**Payment methods accepted:**
- Credit/Debit Card (Visa, Mastercard, Amex)
- PayPal
- Cryptocurrency (Bitcoin, etc.)
- Google Pay

**Enter payment information and complete purchase**

**30-Day Money-Back Guarantee:**
- If not satisfied, request refund within 30 days
- Full refund, no questions asked
- Contact support: https://www.hostinger.com/contact

---

### Step 10: Provisioning (Wait)

**After payment:**

1. You'll see "Order Confirmed" page
2. You'll receive email: "VPS Order Confirmation"
3. **Wait 5-15 minutes** for provisioning
4. You'll receive email: "VPS Ready" with:
   - VPS IP address (e.g., `123.45.67.89`)
   - SSH access information
   - hPanel access link

**Check your email inbox for:**
```
Subject: Your VPS is Ready!
From: Hostinger <noreply@hostinger.com>

Your VPS Details:
- IP Address: XXX.XXX.XXX.XXX
- Root Password: [As set in Step 6]
- Access via SSH: ssh root@XXX.XXX.XXX.XXX
- Manage in hPanel: https://hpanel.hostinger.com
```

---

## After Purchase

### Access hPanel

1. Go to: https://hpanel.hostinger.com
2. Login with your Hostinger account
3. Click "VPS" in left sidebar
4. You should see your VPS listed

**VPS Information Available:**
- IP Address
- Hostname
- Operating System
- Status (should be "Active" and "Running")
- Resource usage graphs

### First Login Test

**From your terminal:**

```bash
ssh root@YOUR_VPS_IP
# Replace YOUR_VPS_IP with the IP from email

# Enter password when prompted
```

**Expected result:**
```
Welcome to Ubuntu 24.04 LTS
root@vps-XXXXX:~#
```

**You're in! 🎉**

**Now proceed to deployment guide:**
- [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)
- [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md)

---

## Troubleshooting Purchase Issues

### "I only see website creation options"

**Solution:**
- Do NOT use these options
- Go directly to: https://www.hostinger.com/vps-hosting
- Or in hPanel: Services → VPS (not Websites)

### "VPS is too expensive"

**Check:**
- Are you looking at monthly price without discount?
- Select 12-month term for best price ($5.84/mo)
- Month-to-month is $14.99/mo (not worth it)

**Correct pricing:**
- 12 months: $5.84/mo = $70.08 total ✅
- 1 month: $14.99/mo = not recommended ❌

### "I need a cheaper option"

**Alternatives:**

**KVM 1 (Budget Option):**
- $4.99/mo (12 months)
- 1 vCPU, 4 GB RAM, 50 GB SSD
- Can handle smaller traffic (~20K visitors/month)
- May struggle with build processes
- Not recommended for growth

**Recommendation:** Stick with KVM 2 for better performance and headroom

### "Do I need to buy email separately?"

**No!** Email hosting included with VPS:
- Free tier: 300 emails/day
- Professional addresses (contact@mouraquayle.ca)
- SMTP for transactional emails
- Webmail access

**See:** [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md)

### "Can I transfer my existing domain?"

**Yes!** Two options:

**Option 1: Transfer domain to Hostinger**
- Unlock domain at current registrar
- Get transfer code
- Initiate transfer in hPanel: Domains → Transfer Domain
- Takes 5-7 days
- Costs: ~$8-15/year

**Option 2: Keep domain at current registrar**
- Update DNS records to point to VPS IP
- Simpler, faster (1-24 hours)
- No transfer needed

**Recommendation:** Keep domain where it is, just update DNS

---

## Next Steps After Purchase

**Immediate (5-15 minutes after purchase):**
1. ✅ Check email for VPS details
2. ✅ Note IP address
3. ✅ Test SSH login
4. ✅ Access hPanel to verify VPS active

**Within first day:**
1. 📋 Follow [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)
2. 🔧 Configure server (SSH keys, firewall, Node.js)
3. 🚀 Deploy application
4. 🌐 Point domain DNS to VPS
5. 🔒 Set up SSL certificate

**Within first week:**
1. ✉️ Configure email (contact@mouraquayle.ca)
2. 📊 Set up monitoring (UptimeRobot)
3. 🔄 Configure backups
4. 🧪 Test production site thoroughly

---

## Cost Breakdown

**Year 1:**
```
VPS KVM 2 (12 months)              $70.08
Domain (if not owned)              $15.00
─────────────────────────────────────────
Total Year 1                       $85.08
```

**Year 2+ (Renewal):**
```
VPS KVM 2 (renewal)                $X.XX (check renewal rates)
Domain (renewal)                   $15.00
─────────────────────────────────────────
Total Year 2+                      ~$100-150
```

**Note:** Renewal rates may be higher than introductory price. Check Hostinger for current renewal rates.

**Included at no extra cost:**
- ✅ 8 TB bandwidth
- ✅ DDoS protection
- ✅ Email hosting (300-unlimited emails/day)
- ✅ Weekly automated backups
- ✅ Free SSL certificate (Let's Encrypt)
- ✅ 99.9% uptime guarantee
- ✅ 24/7 support

---

## Support

**Need help with purchase?**

**Hostinger Support:**
- 24/7 Live Chat: https://www.hostinger.com/contact
- Phone support available
- Average response time: <2 minutes

**Before Purchase Questions:**
- VPS specifications: https://www.hostinger.com/vps-hosting
- Knowledge base: https://support.hostinger.com
- VPS tutorials: https://support.hostinger.com/en/collections/1578942-vps

**After Purchase Help:**
- hPanel access: https://hpanel.hostinger.com
- VPS management guide: https://support.hostinger.com/en/collections/1578942-vps

---

## Summary Checklist

**Correct Purchase Path:**
- [ ] Go to https://www.hostinger.com/vps-hosting
- [ ] Select VPS KVM 2 plan
- [ ] Choose 12-month billing ($5.84/mo)
- [ ] Select USA data center
- [ ] Choose Ubuntu 24.04 with Node.js OS
- [ ] Set strong root password (save securely!)
- [ ] Skip unnecessary add-ons
- [ ] Review order (total ~$70-80)
- [ ] Complete payment
- [ ] Wait for provisioning (5-15 min)
- [ ] Check email for VPS IP and details
- [ ] Test SSH login
- [ ] Proceed to deployment guide

**What NOT to do:**
- ❌ Don't use "Website Creation" options in hPanel
- ❌ Don't select Hostinger Website Builder
- ❌ Don't select WordPress hosting
- ❌ Don't select "Custom PHP/HTML website"
- ❌ These are for simple sites, not Next.js!

**Verification you're in right place:**
- ✅ You see "VPS Hosting Plans"
- ✅ Plans named KVM 1, KVM 2, KVM 4, etc.
- ✅ Specifications show vCPU, RAM, Storage
- ✅ Option to select OS (Ubuntu, Debian, etc.)

---

**Purchase Guide Version:** 1.0
**Last Updated:** November 16, 2025
**Estimated Purchase Time:** 15-20 minutes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
