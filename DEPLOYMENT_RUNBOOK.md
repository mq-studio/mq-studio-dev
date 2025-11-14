# Deployment Runbook
## MQ Studio - Quick Reference Production Deployment

**Last Updated:** November 14, 2025
**Target:** Hostinger VPS KVM 2
**Estimated Time:** 6-10 hours (first deployment)

---

## Quick Start Checklist

Use this condensed runbook for deployment. For detailed instructions, see [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md).

---

## Pre-Deployment (30 min)

- [ ] Purchase Hostinger VPS KVM 2 ($5.84/month)
- [ ] Select server location (USA for North America)
- [ ] Choose Ubuntu 24.04 with Node.js template
- [ ] Note VPS IP address from email
- [ ] Create TinaCMS Cloud account (https://app.tina.io)
- [ ] Create TinaCMS project, get Client ID and Token
- [ ] Enable GitHub Discussions on repository
- [ ] Install Giscus GitHub App
- [ ] Get Giscus repo ID and category ID (https://giscus.app)

---

## Server Setup (1-2 hours)

### 1. Initial Access
```bash
ssh root@YOUR_VPS_IP
# Enter password from Hostinger email
```

### 2. System Update
```bash
apt update && apt upgrade -y
apt install -y curl wget git ufw nano
```

### 3. Create User
```bash
adduser mqstudio
usermod -aG sudo mqstudio
```

### 4. Configure Firewall
```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 5. SSH Key Setup (Local Machine)
```bash
# Generate key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy to VPS
ssh-copy-id mqstudio@YOUR_VPS_IP

# Test login
ssh mqstudio@YOUR_VPS_IP
```

### 6. Disable Password Auth (Optional)
```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

---

## Node.js Setup (30 min)

```bash
# Verify Node.js installed
node --version  # Should be v18+ or v20+

# If not installed:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# Install PM2
npm install -g pm2
```

---

## Application Deployment (1 hour)

### 1. Clone Repository
```bash
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/mq-studio/mq-studio-dev.git
cd mq-studio-dev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env.production
nano .env.production
```

**Add these variables:**
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://mouraquayle.ca
CONTACT_EMAIL=moura@mouraquayle.ca

# TinaCMS (from app.tina.io)
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token

# Giscus (from giscus.app)
NEXT_PUBLIC_GISCUS_REPO=mq-studio/mq-studio-dev
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Musings
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id

# Email (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@mouraquayle.ca
SMTP_PASSWORD=your-email-password
SMTP_FROM_EMAIL=contact@mouraquayle.ca
SMTP_FROM_NAME=MQ Studio
```

**Secure the file:**
```bash
chmod 600 .env.production
```

### 4. Build Application
```bash
npm run build
```

### 5. Test Locally
```bash
npm start
# Should start on port 3000
# Ctrl+C to stop
```

### 6. Start with PM2
```bash
pm2 start npm --name "mq-studio" -- start
pm2 save
pm2 startup
# Run the command PM2 outputs
```

---

## Nginx Setup (1 hour)

### 1. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Create Site Configuration
```bash
sudo nano /etc/nginx/sites-available/mq-studio
```

**Paste this configuration:**
```nginx
upstream nextjs {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name mouraquayle.ca www.mouraquayle.ca;

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
    }

    location /_next/static {
        proxy_pass http://nextjs;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    client_max_body_size 10M;
}
```

### 3. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/mq-studio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL Certificate (30 min)

### 1. Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain Certificate
```bash
sudo certbot --nginx -d mouraquayle.ca -d www.mouraquayle.ca
# Enter email
# Accept terms
# Choose: Redirect HTTP to HTTPS (option 2)
```

### 3. Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

---

## Domain Configuration (15 min + 1-24 hr propagation)

### Option 1: Direct DNS (Hostinger)
1. Log into hPanel
2. Domains → Manage → DNS Zone
3. Add A records:
   - Name: `@` → Your VPS IP
   - Name: `www` → Your VPS IP

### Option 2: Cloudflare (Recommended)
1. Create Cloudflare account
2. Add domain
3. Add A records (proxy enabled):
   - Name: `@` → Your VPS IP
   - Name: `www` → Your VPS IP
4. Update nameservers at registrar

**Wait for DNS propagation (1-24 hours)**

---

## Email Setup (30 min)

### 1. Create Email Account
- Log into hPanel → Emails
- Create: `contact@mouraquayle.ca`
- Set strong password

### 2. Configure DNS (if not auto-configured)
- SPF: `v=spf1 include:spf.hostinger.com ~all`
- Check hPanel for DKIM record
- DMARC: `v=DMARC1; p=quarantine; rua=mailto:contact@mouraquayle.ca`

### 3. Test Email (Optional)
```bash
# Create test script and send test email
# See EMAIL_SUBSCRIPTION_SETUP.md for details
```

---

## Verification Checklist

### Application
- [ ] Visit `https://mouraquayle.ca` → Shows homepage
- [ ] All pages load: About, Musings, Publications, Artworks
- [ ] Images display correctly (WebP format)
- [ ] SSL certificate valid (padlock icon)
- [ ] HTTP redirects to HTTPS

### Admin & Services
- [ ] TinaCMS admin: `https://mouraquayle.ca/admin`
- [ ] Can login to TinaCMS
- [ ] Can edit content and save
- [ ] Comments section loads (Giscus)
- [ ] RSS feed: `https://mouraquayle.ca/musings/feed.xml`

### Performance
- [ ] Test on PageSpeed Insights (https://pagespeed.web.dev)
- [ ] Test on GTmetrix (https://gtmetrix.com)
- [ ] SSL grade: https://www.ssllabs.com/ssltest/
- [ ] DNS propagation: https://dnschecker.org

### Monitoring
- [ ] PM2 running: `pm2 list`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] Check logs: `pm2 logs mq-studio`
- [ ] No errors in logs

---

## Post-Deployment

### Enable Monitoring (Optional but Recommended)
- Sign up for UptimeRobot (https://uptimerobot.com)
- Add monitor for `https://mouraquayle.ca`
- Configure email alerts

### Schedule Backups
```bash
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/mq-studio-$DATE.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  ~/apps/mq-studio-dev
find $BACKUP_DIR -name "mq-studio-*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x ~/backup.sh
crontab -e
# Add: 0 2 * * * /home/mqstudio/backup.sh
```

---

## Maintenance Schedule

**Daily:**
- Monitor PM2 logs for errors: `pm2 logs mq-studio --lines 50`

**Weekly:**
- Security updates: `sudo apt update && sudo apt upgrade -y`
- Check disk space: `df -h`
- Review access logs: `sudo tail -100 /var/log/nginx/access.log`

**Monthly:**
- Full system upgrade: `sudo apt full-upgrade -y`
- Review uptime: `uptime`
- Check SSL renewal: `sudo certbot certificates`
- Backup verification

**Quarterly:**
- Performance audit (Lighthouse, GTmetrix)
- Review and rotate credentials
- Update dependencies: `npm update && npm audit`

---

## Quick Commands Reference

**Application Management:**
```bash
pm2 list                    # View processes
pm2 logs mq-studio          # View logs
pm2 restart mq-studio       # Restart app
pm2 stop mq-studio          # Stop app
pm2 start mq-studio         # Start app
```

**Deployment Updates:**
```bash
cd ~/apps/mq-studio-dev
git pull origin main
npm install
npm run build
pm2 restart mq-studio
```

**Nginx Management:**
```bash
sudo nginx -t               # Test config
sudo systemctl reload nginx # Reload Nginx
sudo systemctl restart nginx # Restart Nginx
```

**SSL Management:**
```bash
sudo certbot renew          # Renew certificates
sudo certbot certificates   # List certificates
```

**System Monitoring:**
```bash
htop                        # System resources
df -h                       # Disk usage
free -h                     # Memory usage
```

---

## Emergency Procedures

**Application Won't Start:**
```bash
pm2 logs mq-studio --lines 100  # Check logs
pm2 delete mq-studio            # Remove process
cd ~/apps/mq-studio-dev
npm start                        # Test manually
# If works, re-add to PM2:
pm2 start npm --name "mq-studio" -- start
pm2 save
```

**Site Down (502 Error):**
```bash
pm2 list                        # Check if app running
sudo systemctl status nginx     # Check Nginx
pm2 restart mq-studio
sudo systemctl restart nginx
```

**SSL Certificate Expired:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

**Out of Disk Space:**
```bash
df -h                           # Check usage
sudo apt autoremove -y          # Clean packages
sudo apt autoclean
pm2 flush                       # Clear PM2 logs
```

---

## Support Resources

**Hostinger:**
- 24/7 Chat: https://www.hostinger.com/contact
- Knowledge Base: https://support.hostinger.com

**Next.js:**
- Docs: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js/discussions

**TinaCMS:**
- Docs: https://tina.io/docs
- Discord: https://discord.com/invite/zumN63Ybpf

**PM2:**
- Docs: https://pm2.keymetrics.io/docs

**Nginx:**
- Docs: https://nginx.org/en/docs/

---

## Summary

**Deployment complete when all verification items checked!**

**Total time:** 6-10 hours (first time)
**Recurring deployments:** 5-10 minutes (git pull, build, restart)

**Key files to keep secure:**
- `.env.production` on VPS
- SSH private keys
- TinaCMS Cloud tokens
- Email passwords

For detailed explanations of any step, refer to:
- [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md)
- [ENVIRONMENT_VARIABLES_STRATEGY.md](ENVIRONMENT_VARIABLES_STRATEGY.md)
- [TINACMS_CLOUD_SETUP.md](TINACMS_CLOUD_SETUP.md)
- [EMAIL_SUBSCRIPTION_SETUP.md](EMAIL_SUBSCRIPTION_SETUP.md)

---

**Runbook Version:** 1.0
**Last Updated:** November 14, 2025

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
