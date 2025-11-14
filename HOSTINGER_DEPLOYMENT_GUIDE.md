# Hostinger VPS Deployment Guide
## MQ Studio Next.js 14 Production Deployment

**Last Updated:** November 14, 2025
**Target Platform:** Hostinger VPS KVM 2
**Application:** Next.js 14 App Router with SSR
**Estimated Setup Time:** 6-10 hours

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [VPS Selection and Purchase](#vps-selection-and-purchase)
4. [Initial Server Setup](#initial-server-setup)
5. [SSH Key Authentication](#ssh-key-authentication)
6. [Node.js Environment Setup](#nodejs-environment-setup)
7. [Application Deployment](#application-deployment)
8. [PM2 Process Management](#pm2-process-management)
9. [Nginx Reverse Proxy](#nginx-reverse-proxy)
10. [SSL Certificate Setup](#ssl-certificate-setup)
11. [Domain Configuration](#domain-configuration)
12. [Cloudflare CDN Integration](#cloudflare-cdn-integration)
13. [Environment Variables](#environment-variables)
14. [Email Configuration](#email-configuration)
15. [Monitoring and Maintenance](#monitoring-and-maintenance)
16. [Deployment Checklist](#deployment-checklist)
17. [Troubleshooting](#troubleshooting)

---

## Overview

### Why Hostinger VPS?

**Cost Efficiency:**
- Fixed pricing: $5.84/month (KVM 2 plan)
- No usage-based surprises (vs Vercel's potential $3K+ DDoS bills)
- Includes domain + email hosting

**Complete Control:**
- Full root access to server
- Custom configurations for performance
- Direct server management

**Production Features:**
- DDoS protection included
- 99.9% uptime guarantee
- Weekly automated backups
- 8TB bandwidth included

### Architecture Overview

```
Internet
    ↓
Cloudflare CDN (optional, recommended)
    ↓
Nginx (Port 80/443) - Reverse Proxy + SSL
    ↓
Next.js App (Port 3000) - Managed by PM2
    ↓
File System / Database
```

**Technology Stack:**
- **OS:** Ubuntu 24.04 LTS
- **Runtime:** Node.js 20.x LTS
- **Process Manager:** PM2
- **Web Server:** Nginx
- **SSL:** Let's Encrypt (Certbot)
- **CDN:** Cloudflare (optional)

---

## Prerequisites

### Required Before Starting

1. **Hostinger Account**
   - Create account at hostinger.com
   - Payment method ready

2. **Domain Name**
   - Register domain (included with some VPS plans)
   - Or use existing domain

3. **Local Development**
   - MQ Studio repository cloned locally
   - Application builds successfully (`npm run build`)
   - All environment variables documented

4. **Access Credentials**
   - GitHub account (for repository access)
   - TinaCMS Cloud account (create at app.tina.io)
   - Email for SSL certificate registration

5. **Local Tools**
   - SSH client (built-in on Linux/Mac, use PuTTY on Windows)
   - Git installed locally
   - Text editor for configuration files

### Recommended Knowledge

- Basic Linux command line
- SSH and file permissions
- DNS configuration basics
- Understanding of reverse proxies

**Don't worry if you're not an expert!** This guide provides step-by-step instructions for every command.

---

## VPS Selection and Purchase

### Recommended Plan: KVM 2

**Specifications:**
- 2 vCPU cores
- 8 GB RAM
- 100 GB NVMe SSD storage
- 8 TB bandwidth
- 1 Gb/s network speed

**Pricing:**
- 1-year commitment: ~$5.84/month
- Renewal: Higher (check current rates)
- 30-day money-back guarantee

**Why KVM 2?**
- Perfect for medium traffic sites (up to 50K visitors/month)
- Room to grow without immediate upgrade pressure
- Excellent price/performance ratio
- Handles Next.js build processes smoothly

### Purchase Steps

1. **Visit Hostinger VPS Hosting Page**
   - Go to: https://www.hostinger.com/vps-hosting
   - Click "See Plans"

2. **Select KVM 2 Plan**
   - Choose billing cycle (12 months recommended for best price)
   - Review total cost

3. **Choose Server Location**
   - Select data center closest to target audience:
     - **North America**: USA (recommended for Canada/US)
     - **Europe**: Netherlands, UK, France
     - **Asia**: Singapore, India
   - For MQ Studio (Canadian client): Choose USA

4. **Select Operating System**
   - **Recommended:** Ubuntu 24.04 with Node.js
   - This pre-configured template includes:
     - Ubuntu 24.04 LTS
     - Node.js pre-installed
     - OpenLiteSpeed (optional, we'll use Nginx)

5. **Optional Add-ons**
   - **Domain:** Add if you don't have one
   - **Email:** Included free (300 emails/day)
   - **Backups:** Weekly backups included
   - **DDoS Protection:** Included by default

6. **Complete Purchase**
   - Enter payment information
   - Review order summary
   - Complete checkout

7. **Wait for Provisioning**
   - VPS typically ready in 5-15 minutes
   - You'll receive email with:
     - VPS IP address
     - Root password (temporary)
     - Access to hPanel (Hostinger control panel)

---

## Initial Server Setup

### Access VPS via hPanel

1. **Log into hPanel**
   - Go to: https://hpanel.hostinger.com
   - Click on your VPS under "VPS" section

2. **Get VPS Credentials**
   - Note your VPS IP address (e.g., `123.45.67.89`)
   - Click "Reset Root Password" to set secure password
   - Save credentials securely

### First Login via SSH

**On Linux/Mac:**
```bash
ssh root@YOUR_VPS_IP
# Enter password when prompted
```

**On Windows:**
1. Download PuTTY: https://www.putty.org
2. Open PuTTY
3. Enter VPS IP in "Host Name"
4. Port: 22
5. Click "Open"
6. Login as: `root`
7. Enter password

### Update System Packages

**IMPORTANT:** Always update packages first for security.

```bash
# Update package lists
apt update

# Upgrade installed packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git ufw nano
```

**Expected time:** 5-10 minutes

### Create Non-Root User (Recommended)

Running applications as root is a security risk. Create a dedicated user:

```bash
# Create new user (replace 'mqstudio' with your preference)
adduser mqstudio

# Add to sudo group for administrative tasks
usermod -aG sudo mqstudio

# Switch to new user
su - mqstudio
```

**Why create a non-root user?**
- Better security (limits damage from compromised applications)
- Best practice for production servers
- Easier to manage permissions

### Configure Firewall (UFW)

```bash
# Switch back to root
exit

# Allow SSH (CRITICAL - don't lock yourself out!)
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## SSH Key Authentication

### Why Use SSH Keys?

- **More Secure:** Stronger than passwords
- **Convenient:** No password typing for each login
- **Required:** For automated deployments (Git hooks, CI/CD)

### Generate SSH Key (Local Machine)

**On Linux/Mac:**
```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your_email@example.com"

# Accept default location: ~/.ssh/id_ed25519
# Enter passphrase (optional but recommended)

# Display public key
cat ~/.ssh/id_ed25519.pub
```

**On Windows (Git Bash or PowerShell):**
```bash
# Same commands as above
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Add SSH Key to VPS

**Method 1: Manual Copy**

1. Copy your public key (output from `cat ~/.ssh/id_ed25519.pub`)
2. SSH into VPS as your user:
   ```bash
   ssh mqstudio@YOUR_VPS_IP
   ```
3. Create SSH directory and authorized_keys file:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   nano ~/.ssh/authorized_keys
   ```
4. Paste your public key, save and exit (Ctrl+X, Y, Enter)
5. Set permissions:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

**Method 2: ssh-copy-id (Linux/Mac)**

```bash
# Copy key from local machine
ssh-copy-id mqstudio@YOUR_VPS_IP
```

### Test SSH Key Login

```bash
# From local machine
ssh mqstudio@YOUR_VPS_IP

# Should log in WITHOUT password prompt
```

**If successful:** You'll log in directly
**If failed:** Check permissions and key content

### Disable Password Authentication (Optional, Recommended)

**WARNING:** Only do this AFTER confirming SSH key login works!

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Find and change these lines:
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no

# Save and exit (Ctrl+X, Y, Enter)

# Restart SSH service
sudo systemctl restart sshd
```

**Test:** Open new terminal and try SSH - should work with key only.

---

## Node.js Environment Setup

### Check Node.js Version

If you selected "Ubuntu 24.04 with Node.js" template, Node.js should be pre-installed:

```bash
node --version
# Should show v18.x or higher

npm --version
# Should show 9.x or higher
```

### Install/Update Node.js (If Needed)

**If Node.js is not installed or version is too old (<18.x):**

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
source ~/.bashrc

# Install Node.js 20.x LTS (recommended)
nvm install 20

# Set as default
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Install Global Packages

```bash
# Install PM2 (process manager)
npm install -g pm2

# Install Yarn (optional, if you prefer over npm)
npm install -g yarn

# Verify installations
pm2 --version
```

---

## Application Deployment

### Clone Repository

**Option A: HTTPS (Public Repository)**

```bash
# Navigate to home directory
cd ~

# Create apps directory
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/mq-studio/mq-studio-dev.git
cd mq-studio-dev
```

**Option B: SSH (Private Repository)**

1. Generate SSH key on VPS (if not done):
   ```bash
   ssh-keygen -t ed25519 -C "vps@mqstudio.com"
   cat ~/.ssh/id_ed25519.pub
   ```

2. Add public key to GitHub:
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste public key
   - Save

3. Clone repository:
   ```bash
   cd ~/apps
   git clone git@github.com:mq-studio/mq-studio-dev.git
   cd mq-studio-dev
   ```

### Install Dependencies

```bash
# Install all dependencies
npm install

# This may take 2-5 minutes depending on connection speed
```

**Expected output:** Hundreds of packages installed, no critical errors.

### Create Environment File

```bash
# Copy example environment file
cp .env.example .env.production

# Edit environment file
nano .env.production
```

**Configure production variables** (see [Environment Variables](#environment-variables) section below for full details):

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mouraquayle.ca

# TinaCMS Cloud (get from app.tina.io)
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id-here
TINA_TOKEN=your-token-here

# Giscus (get from giscus.app)
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Musings
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id

# Contact email
CONTACT_EMAIL=moura@mouraquayle.ca
```

Save and exit (Ctrl+X, Y, Enter).

### Build Application

```bash
# Run production build
npm run build
```

**Expected time:** 1-3 minutes
**Expected output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (22/22)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...
...
○  (Static)  prerendered as static content
```

**If build fails:** Check error messages, verify environment variables, ensure dependencies installed correctly.

### Test Application Locally on VPS

```bash
# Start Next.js in production mode
npm start
```

**Expected output:**
```
 ▲ Next.js 14.2.x
   - Local:        http://localhost:3000
   - Network:      http://0.0.0.0:3000

 ✓ Ready in 2.3s
```

**Test from your local machine:**
```bash
# From your local machine (not VPS)
curl http://YOUR_VPS_IP:3000

# Should return HTML content
```

**If successful:** You'll see HTML response
**If connection refused:** Check firewall rules

Stop the test server: `Ctrl+C`

---

## PM2 Process Management

### Why PM2?

- **Auto-restart:** Restarts app if it crashes
- **Process monitoring:** View logs, CPU, memory usage
- **Startup script:** Auto-start app when server reboots
- **Zero-downtime deploys:** Reload app without downtime
- **Log management:** Automatic log rotation

### Start Application with PM2

```bash
# Navigate to project directory
cd ~/apps/mq-studio-dev

# Start app with PM2
pm2 start npm --name "mq-studio" -- start

# Alternative: Start with ecosystem file (advanced)
# pm2 start ecosystem.config.js
```

**Expected output:**
```
[PM2] Starting npm in fork_mode (1 instance)
[PM2] Done.
┌─────┬──────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ mq-studio    │ fork    │ 0       │ online  │ 0%       │
└─────┴──────────────┴─────────┴─────────┴─────────┴──────────┘
```

### PM2 Management Commands

```bash
# View running processes
pm2 list

# View logs (real-time)
pm2 logs mq-studio

# View specific logs
pm2 logs mq-studio --lines 100

# Monitor resources
pm2 monit

# Restart application
pm2 restart mq-studio

# Stop application
pm2 stop mq-studio

# Delete from PM2
pm2 delete mq-studio

# Save PM2 process list (important!)
pm2 save
```

### Configure PM2 Startup Script

**This ensures your app auto-starts when server reboots:**

```bash
# Generate startup script
pm2 startup

# PM2 will output a command like:
# sudo env PATH=$PATH:/home/mqstudio/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u mqstudio --hp /home/mqstudio

# Copy and run that exact command
# Then save current PM2 process list
pm2 save
```

**Test auto-start:**
```bash
# Reboot server
sudo reboot

# Wait 2-3 minutes, then SSH back in
ssh mqstudio@YOUR_VPS_IP

# Check if app is running
pm2 list

# Should show mq-studio as "online"
```

### PM2 Ecosystem File (Advanced, Optional)

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [{
    name: 'mq-studio',
    script: 'npm',
    args: 'start',
    cwd: '/home/mqstudio/apps/mq-studio-dev',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '~/logs/mq-studio-error.log',
    out_file: '~/logs/mq-studio-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

**Start with ecosystem file:**
```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Nginx Reverse Proxy

### Why Nginx?

- **SSL Termination:** Handles HTTPS, passes HTTP to Next.js
- **Static File Serving:** Serves static assets efficiently
- **Load Balancing:** Can distribute traffic (future scaling)
- **Compression:** Gzip/Brotli for smaller transfers
- **Security:** Hide internal port (3000), add security headers

### Install Nginx

```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable auto-start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

**Expected output:**
```
● nginx.service - A high performance web server
     Loaded: loaded
     Active: active (running)
```

### Test Nginx Installation

Visit `http://YOUR_VPS_IP` in browser. You should see "Welcome to nginx!" page.

### Configure Nginx for Next.js

**Create Nginx configuration file:**

```bash
sudo nano /etc/nginx/sites-available/mq-studio
```

**Paste the following configuration:**

```nginx
# Upstream Next.js application
upstream nextjs {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP server (will redirect to HTTPS after SSL setup)
server {
    listen 80;
    listen [::]:80;
    server_name mouraquayle.ca www.mouraquayle.ca;

    # Redirect all HTTP to HTTPS (comment out until SSL is configured)
    # return 301 https://$server_name$request_uri;

    # Proxy to Next.js (temporary, for testing)
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files (Next.js serves these, but Nginx can cache)
    location /_next/static {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 60m;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Favicon and other static assets
    location ~* \.(ico|jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot)$ {
        proxy_pass http://nextjs;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Client body size (for file uploads)
    client_max_body_size 10M;
}
```

**Save and exit** (Ctrl+X, Y, Enter).

### Enable Site Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/mq-studio /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Reload Nginx

```bash
sudo systemctl reload nginx
```

### Test Reverse Proxy

Visit `http://YOUR_VPS_IP` in browser. You should see your Next.js application (not the nginx welcome page).

**If you see your app:** ✅ Reverse proxy working!
**If you see nginx welcome or error:** Check Nginx logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

---

## SSL Certificate Setup

### Install Certbot (Let's Encrypt)

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate

**Prerequisites:**
1. Domain must point to your VPS IP (see [Domain Configuration](#domain-configuration))
2. Nginx must be running and configured
3. Port 80 must be open (for verification)

**Request certificate:**

```bash
sudo certbot --nginx -d mouraquayle.ca -d www.mouraquayle.ca
```

**You'll be prompted for:**
1. **Email address:** For renewal notifications (use your real email)
2. **Terms of Service:** Accept (Y)
3. **Email sharing:** Your choice (N is fine)
4. **Redirect HTTP to HTTPS:** Choose option 2 (Redirect)

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/mouraquayle.ca/fullchain.pem
Key is saved at: /etc/letsencrypt/live/mouraquayle.ca/privkey.pem
```

**Certbot automatically:**
- Obtains certificate
- Updates Nginx configuration with SSL settings
- Adds HTTPS redirect
- Reloads Nginx

### Verify SSL Certificate

Visit `https://mouraquayle.ca` (note HTTPS). You should see:
- 🔒 Padlock icon in browser
- Valid SSL certificate
- Your Next.js application

**Test SSL grade:**
Visit https://www.ssllabs.com/ssltest/ and enter your domain. Should get A or A+ rating.

### Automatic Certificate Renewal

**Let's Encrypt certificates expire every 90 days.** Certbot sets up auto-renewal:

```bash
# Test renewal process
sudo certbot renew --dry-run
```

**Expected output:**
```
Congratulations, all simulated renewals succeeded
```

**Check renewal timer:**
```bash
sudo systemctl status certbot.timer
```

**Certbot will automatically renew certificates before expiration.**

### Manual Renewal (If Needed)

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Domain Configuration

### Point Domain to VPS

**You need to configure DNS to point your domain to the VPS IP address.**

#### Method 1: A Records (Recommended)

**If domain registered with Hostinger:**

1. Log into hPanel: https://hpanel.hostinger.com
2. Go to "Domains" section
3. Click "Manage" next to your domain
4. Click "DNS / Nameservers"
5. Click "DNS Zone"
6. Add/Edit A records:

```
Type    Name    Content (Points to)         TTL
A       @       YOUR_VPS_IP                 14400
A       www     YOUR_VPS_IP                 14400
```

**If domain registered elsewhere (Namecheap, GoDaddy, etc.):**

1. Log into your domain registrar
2. Find DNS management (often called "DNS Settings" or "Nameserver Settings")
3. Add A records as above
4. Save changes

#### Method 2: Using Cloudflare (Recommended for CDN)

1. Create free Cloudflare account: https://cloudflare.com
2. Add your domain to Cloudflare
3. Update nameservers at your domain registrar to Cloudflare's nameservers
4. In Cloudflare DNS settings, add A records:
   - Type: A
   - Name: @ (for root domain)
   - IPv4 address: YOUR_VPS_IP
   - Proxy status: Proxied (orange cloud) ← Enables CDN
   - TTL: Auto

5. Add another A record:
   - Type: A
   - Name: www
   - IPv4 address: YOUR_VPS_IP
   - Proxy status: Proxied
   - TTL: Auto

**Cloudflare benefits:**
- Free CDN (faster global performance)
- DDoS protection
- SSL/TLS encryption
- Analytics
- Caching

### DNS Propagation

**Changes take time to propagate globally:**
- Typical: 1-4 hours
- Maximum: 24-48 hours

**Check propagation:**
```bash
# From local machine
dig mouraquayle.ca

# Look for ANSWER section with your VPS IP
```

**Online tools:**
- https://dnschecker.org (check global propagation)
- https://whatsmydns.net

### Verify Domain Configuration

**Once DNS has propagated:**

```bash
# Ping your domain
ping mouraquayle.ca

# Should show your VPS IP address
```

**Visit your domain in browser:**
- http://mouraquayle.ca → Should redirect to HTTPS
- https://mouraquayle.ca → Should show your Next.js app with valid SSL

---

## Cloudflare CDN Integration

### Why Use Cloudflare CDN?

- **Performance:** Cache static assets globally (faster load times worldwide)
- **Bandwidth Savings:** Reduces load on your VPS
- **DDoS Protection:** Additional layer beyond Hostinger
- **Analytics:** Detailed traffic insights
- **Free Tier:** Generous free plan includes CDN

### Setup Steps

1. **Add Domain to Cloudflare** (covered in Domain Configuration above)

2. **Configure SSL/TLS Settings**
   - Go to Cloudflare dashboard → SSL/TLS
   - Set SSL/TLS encryption mode to: **Full (strict)**
   - This ensures end-to-end encryption

3. **Configure Caching**
   - Go to Caching → Configuration
   - Caching Level: **Standard**
   - Browser Cache TTL: **4 hours** (or higher)

4. **Create Page Rules** (Optional)
   - Go to Rules → Page Rules
   - Create rule for static assets:
     ```
     URL pattern: *mouraquayle.ca/_next/static/*
     Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month
     ```

5. **Enable Auto Minify**
   - Go to Speed → Optimization
   - Enable Auto Minify for:
     - JavaScript ✓
     - CSS ✓
     - HTML ✓

6. **Enable Brotli Compression**
   - Go to Speed → Optimization
   - Enable Brotli ✓

7. **Configure Security**
   - Go to Security → Settings
   - Security Level: **Medium** (adjust if needed)
   - Enable Bot Fight Mode: **On**

### Verify Cloudflare is Working

**Check response headers:**
```bash
curl -I https://mouraquayle.ca
```

**Look for Cloudflare headers:**
```
CF-Cache-Status: HIT
CF-RAY: ...
Server: cloudflare
```

**If you see these:** ✅ Cloudflare CDN is active!

### Cloudflare Analytics

- Go to Analytics & Logs → Web Analytics
- View traffic, requests, bandwidth saved
- Monitor cache hit ratio (aim for >80% for best performance)

---

## Environment Variables

### Production Environment Variables

**Location:** `/home/mqstudio/apps/mq-studio-dev/.env.production`

**Complete configuration:**

```bash
# ============================================================================
# CORE CONFIGURATION
# ============================================================================

NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mouraquayle.ca
NEXT_PUBLIC_API_URL=https://mouraquayle.ca
CONTACT_EMAIL=moura@mouraquayle.ca

# ============================================================================
# TINACMS CLOUD
# ============================================================================

# Get these from https://app.tina.io after creating account
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id-from-tina
TINA_TOKEN=your-token-from-tina

# Optional: TinaCMS Search
# TINA_SEARCH_TOKEN=your-search-token

# ============================================================================
# GISCUS COMMENTS (GitHub Discussions)
# ============================================================================

NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id-from-giscus
NEXT_PUBLIC_GISCUS_CATEGORY=Musings
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id-from-giscus

# ============================================================================
# EMAIL CONFIGURATION (Hostinger SMTP)
# ============================================================================

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@mouraquayle.ca
SMTP_PASSWORD=your-email-password
SMTP_FROM_EMAIL=contact@mouraquayle.ca
SMTP_FROM_NAME=MQ Studio

# ============================================================================
# OPTIONAL: ASSET STORAGE (if using Vercel Blob)
# ============================================================================

# BLOB_READ_WRITE_TOKEN=your-blob-token
```

### How to Get Each Credential

**NEXT_PUBLIC_TINA_CLIENT_ID & TINA_TOKEN:**
- See [TINACMS_CLOUD_SETUP.md](TINACMS_CLOUD_SETUP.md) for detailed guide
- Quick: Visit https://app.tina.io, create account, create project, copy credentials

**GISCUS_REPO_ID & GISCUS_CATEGORY_ID:**
- See [GISCUS_SETUP_GUIDE.md](GISCUS_SETUP_GUIDE.md) for detailed guide
- Quick: Visit https://giscus.app, enter your repo, select category, copy IDs

**SMTP Credentials:**
- See [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md) for detailed guide
- Quick: Use Hostinger email account credentials

### Security Best Practices

**File Permissions:**
```bash
# Restrict .env.production to owner only
chmod 600 .env.production

# Verify
ls -la .env.production
# Should show: -rw------- (owner read/write only)
```

**Never Commit Secrets:**
```bash
# Ensure .env.production is in .gitignore
echo ".env.production" >> .gitignore
```

**Use Environment Variables in PM2:**

Create `ecosystem.config.js` with env_file support:

```javascript
module.exports = {
  apps: [{
    name: 'mq-studio',
    script: 'npm',
    args: 'start',
    env_file: '.env.production',
    // ... other config
  }]
};
```

### Verify Environment Variables

**Test that Next.js reads variables:**

```bash
# Temporary test (DO NOT commit)
# Add to a test page or API route:
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
console.log('Tina Client ID:', process.env.NEXT_PUBLIC_TINA_CLIENT_ID ? 'SET' : 'NOT SET');

# Check PM2 logs
pm2 logs mq-studio | grep "Site URL"
```

---

## Email Configuration

### Hostinger Email Setup

**See detailed guide:** [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md)

**Quick setup:**

1. **Create Email Account**
   - Go to hPanel → Emails
   - Create email: `contact@mouraquayle.ca`
   - Set strong password

2. **Configure SMTP in `.env.production`**
   ```bash
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=contact@mouraquayle.ca
   SMTP_PASSWORD=your-password
   ```

3. **Test Email Sending**
   - Use test script or API route
   - Send test email
   - Verify receipt

**Full documentation in EMAIL_SUBSCRIPTION_SETUP.md**

---

## Monitoring and Maintenance

### PM2 Monitoring

**Real-time monitoring:**
```bash
pm2 monit
```

**View metrics:**
```bash
pm2 list
pm2 show mq-studio
```

**Check logs:**
```bash
# Real-time logs
pm2 logs mq-studio

# Last 100 lines
pm2 logs mq-studio --lines 100

# Error logs only
pm2 logs mq-studio --err
```

### Nginx Logs

**Access logs:**
```bash
sudo tail -f /var/log/nginx/access.log
```

**Error logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Search for specific errors:**
```bash
sudo grep "error" /var/log/nginx/error.log | tail -20
```

### System Monitoring

**Disk usage:**
```bash
df -h
```

**Memory usage:**
```bash
free -h
```

**CPU usage:**
```bash
top
# Press 'q' to exit
```

**Process usage:**
```bash
htop
# More user-friendly than top
# Install if not available: sudo apt install htop
```

### Automated Backups

**Hostinger provides weekly automated backups**, but you should also:

**1. Backup Application Files:**
```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR=~/apps/mq-studio-dev

mkdir -p $BACKUP_DIR

# Backup application (excluding node_modules)
tar -czf $BACKUP_DIR/mq-studio-$DATE.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  $APP_DIR

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mq-studio-*.tar.gz" -mtime +7 -delete

echo "Backup completed: mq-studio-$DATE.tar.gz"
```

```bash
# Make executable
chmod +x ~/backup.sh

# Test backup
~/backup.sh
```

**2. Schedule Automatic Backups:**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/mqstudio/backup.sh >> /home/mqstudio/backup.log 2>&1
```

**3. Backup Database** (if you add one later):
```bash
# MySQL backup example
mysqldump -u username -p database_name > ~/backups/db-$(date +%Y%m%d).sql
```

### Security Updates

**Weekly security updates:**
```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Update Node.js packages
cd ~/apps/mq-studio-dev
npm update
npm audit fix

# Rebuild and restart
npm run build
pm2 restart mq-studio
```

**Monthly full maintenance:**
```bash
# Full system upgrade
sudo apt update
sudo apt full-upgrade -y

# Clean old packages
sudo apt autoremove -y
sudo apt autoclean

# Check disk space
df -h

# Review logs for errors
pm2 logs mq-studio --lines 200 | grep -i error
```

### Uptime Monitoring (Recommended)

**Use free uptime monitoring service:**

**Options:**
- **UptimeRobot** (https://uptimerobot.com) - Free, 50 monitors
- **StatusCake** (https://www.statuscake.com) - Free tier available
- **Pingdom** (https://www.pingdom.com) - Free trial

**Setup:**
1. Create account
2. Add monitor: `https://mouraquayle.ca`
3. Configure alerts (email, SMS)
4. Get notified if site goes down

---

## Deployment Checklist

### Pre-Deployment

- [ ] VPS purchased and provisioned (KVM 2 recommended)
- [ ] Domain registered or transferred
- [ ] TinaCMS Cloud account created
- [ ] GitHub repository accessible
- [ ] Local development build successful

### Server Setup

- [ ] System packages updated (`apt update && apt upgrade`)
- [ ] Non-root user created
- [ ] Firewall configured (UFW: SSH, HTTP, HTTPS)
- [ ] SSH key authentication configured
- [ ] Password authentication disabled (optional but recommended)
- [ ] Node.js 20.x installed
- [ ] PM2 installed globally
- [ ] Nginx installed and enabled

### Application Deployment

- [ ] Repository cloned to VPS
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.production` created with all credentials
- [ ] Production build successful (`npm run build`)
- [ ] Test run successful (`npm start`)
- [ ] PM2 configured and running
- [ ] PM2 startup script configured
- [ ] PM2 process list saved

### Web Server Configuration

- [ ] Nginx site configuration created
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx reloaded successfully
- [ ] Application accessible via VPS IP
- [ ] Static files serving correctly

### Domain & SSL

- [ ] DNS A records configured (@ and www)
- [ ] DNS propagation complete (wait 1-24 hours)
- [ ] Domain resolves to VPS IP
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] HTTPS redirect configured
- [ ] SSL certificate auto-renewal tested
- [ ] Site accessible via HTTPS with valid certificate

### Email Setup

- [ ] Hostinger email account created
- [ ] SMTP credentials added to `.env.production`
- [ ] Email DNS records configured (SPF, DKIM, DMARC)
- [ ] Test email sent successfully

### External Services

- [ ] TinaCMS Cloud connected and working
- [ ] Giscus comments loading correctly
- [ ] All environment variables verified

### Optimization (Optional but Recommended)

- [ ] Cloudflare CDN configured
- [ ] Cloudflare SSL set to Full (strict)
- [ ] Page rules created for static assets
- [ ] Auto minify enabled
- [ ] Brotli compression enabled
- [ ] Cache hit ratio monitoring

### Monitoring & Maintenance

- [ ] PM2 monitoring tested
- [ ] Nginx logs accessible
- [ ] Backup script created
- [ ] Automated backups scheduled (cron)
- [ ] Uptime monitoring configured
- [ ] Security update schedule planned

### Final Testing

- [ ] Homepage loads correctly
- [ ] All pages accessible (about, musings, publications, artworks)
- [ ] Images optimized and loading (WebP format)
- [ ] RSS feed accessible (https://mouraquayle.ca/musings/feed.xml)
- [ ] Social sharing metadata present (Open Graph, Twitter Cards)
- [ ] Comments section loading (Giscus)
- [ ] TinaCMS admin accessible (/admin)
- [ ] Contact form working (if implemented)
- [ ] Mobile responsiveness verified
- [ ] Performance tested (Lighthouse, GTmetrix)
- [ ] SSL rating checked (SSL Labs)

---

## Troubleshooting

### Application Won't Start

**Symptom:** PM2 shows app as "errored" or constantly restarting

**Solutions:**

1. Check PM2 logs:
   ```bash
   pm2 logs mq-studio --lines 50
   ```

2. Common issues:
   - **Port 3000 already in use:**
     ```bash
     sudo lsof -i :3000
     sudo kill -9 PID
     ```

   - **Missing environment variables:**
     ```bash
     cat .env.production
     # Verify all required variables present
     ```

   - **Build artifacts missing:**
     ```bash
     ls -la .next/
     # If empty, run: npm run build
     ```

3. Test manually:
   ```bash
   cd ~/apps/mq-studio-dev
   npm start
   # Check for error messages
   ```

### Nginx 502 Bad Gateway

**Symptom:** Browser shows "502 Bad Gateway" error

**Solutions:**

1. Check if Next.js is running:
   ```bash
   pm2 list
   # Ensure mq-studio is "online"
   ```

2. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Verify upstream configuration:
   ```bash
   sudo nginx -t
   ```

4. Check if port 3000 is listening:
   ```bash
   sudo netstat -tulpn | grep 3000
   ```

5. Restart services:
   ```bash
   pm2 restart mq-studio
   sudo systemctl restart nginx
   ```

### SSL Certificate Issues

**Symptom:** "Your connection is not private" error

**Solutions:**

1. Verify certificate exists:
   ```bash
   sudo ls -la /etc/letsencrypt/live/mouraquayle.ca/
   ```

2. Check certificate expiration:
   ```bash
   sudo certbot certificates
   ```

3. Renew certificate manually:
   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

4. Check Nginx SSL configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/mq-studio
   # Verify ssl_certificate and ssl_certificate_key paths
   ```

### DNS Not Resolving

**Symptom:** Domain doesn't point to VPS

**Solutions:**

1. Check DNS propagation:
   ```bash
   dig mouraquayle.ca
   nslookup mouraquayle.ca
   ```

2. Verify A records at registrar/Cloudflare

3. Clear local DNS cache:
   ```bash
   # Linux
   sudo systemd-resolve --flush-caches

   # Mac
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns
   ```

4. Wait 24-48 hours for full propagation

### Out of Memory

**Symptom:** Application crashes, PM2 restarts frequently

**Solutions:**

1. Check memory usage:
   ```bash
   free -h
   ```

2. Increase swap space:
   ```bash
   # Create 2GB swap file
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile

   # Make permanent
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

3. Configure PM2 memory limits:
   ```javascript
   // ecosystem.config.js
   max_memory_restart: '1G'
   ```

4. Optimize Next.js build:
   - Consider static export for some pages
   - Enable ISR caching
   - Reduce bundle size

### Build Failures

**Symptom:** `npm run build` fails

**Solutions:**

1. Check Node.js version:
   ```bash
   node --version
   # Should be 18.x or higher
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

4. Increase build memory:
   ```bash
   NODE_OPTIONS=--max_old_space_size=4096 npm run build
   ```

### Email Not Sending

**Symptom:** Email subscription or contact form doesn't work

**Solutions:**

1. Verify SMTP credentials:
   ```bash
   # Test SMTP connection
   telnet smtp.hostinger.com 465
   ```

2. Check email logs in application

3. Verify DNS records (SPF, DKIM):
   ```bash
   dig TXT mouraquayle.ca
   ```

4. Check daily sending limits (300/day on free plan)

5. See [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md) for detailed troubleshooting

### Performance Issues

**Symptom:** Slow page loads, high server load

**Solutions:**

1. Enable Cloudflare CDN (see [Cloudflare CDN Integration](#cloudflare-cdn-integration))

2. Check PM2 metrics:
   ```bash
   pm2 monit
   ```

3. Optimize Nginx caching:
   ```nginx
   # Add to server block
   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
   ```

4. Enable image optimization in Next.js config

5. Run Lighthouse audit:
   - Visit https://pagespeed.web.dev
   - Enter your domain
   - Review recommendations

### Getting Help

**Hostinger Support:**
- 24/7 live chat: https://www.hostinger.com/contact
- Knowledge base: https://support.hostinger.com
- Community forum: https://www.hostingerforum.com

**Next.js Support:**
- Official docs: https://nextjs.org/docs
- GitHub discussions: https://github.com/vercel/next.js/discussions
- Discord community: https://nextjs.org/discord

**Stack Overflow:**
- Tag questions with: `nextjs`, `nginx`, `pm2`, `hostinger`

---

## Summary

You've successfully deployed MQ Studio to Hostinger VPS! 🎉

**What you've accomplished:**
- ✅ Configured production-ready VPS server
- ✅ Deployed Next.js 14 with full SSR support
- ✅ Set up PM2 for process management
- ✅ Configured Nginx reverse proxy
- ✅ Obtained free SSL certificate
- ✅ Pointed domain to VPS
- ✅ Configured email hosting
- ✅ Set up monitoring and backups

**Your deployment is:**
- **Secure:** SSL/TLS encryption, firewall configured, SSH key authentication
- **Fast:** Nginx caching, optional Cloudflare CDN, WebP images
- **Reliable:** PM2 auto-restart, automated backups, 99.9% uptime guarantee
- **Cost-effective:** $5.84/month fixed cost, no usage surprises

**Next steps:**
1. Monitor application for first few days
2. Configure uptime monitoring alerts
3. Set up automated backups
4. Optimize performance based on real traffic
5. Consider Cloudflare CDN if global audience

**Maintenance schedule:**
- **Daily:** Check PM2 logs for errors
- **Weekly:** Security updates (`apt update && apt upgrade`)
- **Monthly:** Full system maintenance, backup verification
- **Quarterly:** Performance audit, SSL certificate check

---

**Guide Version:** 1.0
**Last Updated:** November 14, 2025
**Maintained By:** MQ Studio Development Team

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
