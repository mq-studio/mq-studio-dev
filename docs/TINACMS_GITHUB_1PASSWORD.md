# TinaCMS with GitHub Authentication & 1Password CLI

## How It Works

TinaCMS Cloud uses GitHub OAuth for authentication, which means:
- ✅ **No passwords to manage** - Use your existing GitHub account
- ✅ **No user database** - GitHub handles all authentication
- ✅ **Team access control** - Manage who can edit via GitHub repo permissions
- ✅ **Automatic authorization** - If you can push to the repo, you can edit content

## Setup Process

### Step 1: Create TinaCMS Cloud Account
1. Go to https://app.tina.io
2. Click "Sign in with GitHub"
3. Authorize TinaCMS to access your repositories
4. Select your repository: `moura-quayle/website-mq-studio`

### Step 2: Get Your Credentials from TinaCMS
After connecting your repo, TinaCMS will provide:
- **Client ID**: A public identifier (safe to share)
- **Read Token**: For fetching content (keep private)

### Step 3: Store Credentials in 1Password

Create a new item in 1Password:

```bash
# Using 1Password CLI
op item create \
  --category=login \
  --title="TinaCMS-MQ-Studio" \
  --vault="Development" \
  client-id[text]="<your-client-id-from-tina>" \
  token[password]="<your-read-token-from-tina>"
```

Or manually in 1Password app:
1. Create new Login item called "TinaCMS-MQ-Studio"
2. Add custom fields:
   - `client-id`: Your TinaCMS client ID
   - `token`: Your TinaCMS read token

### Step 4: Use with Development

#### Option A: NPM Script (Easiest)
```bash
# This injects credentials from 1Password automatically
npm run dev:1p
```

#### Option B: Direct 1Password CLI
```bash
op run --env-file="./.env.1password.template" -- npm run dev
```

#### Option C: Export for Session
```bash
# Export credentials to current terminal session
eval $(op run --env-file="./.env.1password.template" -- env)
npm run dev
```

## How Authentication Works

### Local Development (Without TinaCMS Cloud)
- No authentication required
- Edit interface available at `/admin`
- Changes saved directly to local files
- Perfect for development

### With TinaCMS Cloud Credentials
1. Navigate to http://localhost:3100/admin
2. TinaCMS detects cloud credentials
3. Redirects to GitHub OAuth
4. You authorize with GitHub
5. GitHub redirects back to your admin panel
6. You can now edit content!

### Authorization Flow
```
Your Browser → TinaCMS Admin → TinaCMS Cloud → GitHub OAuth
                                                      ↓
Your Browser ← Authorized Token ← TinaCMS Cloud ← GitHub
```

## Who Can Edit Content?

When using TinaCMS Cloud with GitHub auth:
- **Anyone with write access** to your GitHub repository
- **Repository collaborators** you've invited
- **Organization members** (if it's an org repo)

To manage access:
1. Go to your GitHub repository
2. Settings → Manage access
3. Add collaborators who should edit content

## Production Deployment

### For Vercel/Netlify/etc.

Add these environment variables to your hosting platform:
- `NEXT_PUBLIC_TINA_CLIENT_ID`: Your client ID (from 1Password or TinaCMS)
- `TINA_TOKEN`: Your read token (from 1Password or TinaCMS)

Using 1Password in CI/CD:
```yaml
# GitHub Actions example
- name: Load secrets from 1Password
  uses: 1password/load-secrets-action@v1
  with:
    export-env: true
  env:
    OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
    NEXT_PUBLIC_TINA_CLIENT_ID: op://Production/TinaCMS-MQ-Studio/client-id
    TINA_TOKEN: op://Production/TinaCMS-MQ-Studio/token
```

## Simplified .env for Local Development

If you prefer not using 1Password for local dev, create `.env.local`:

```env
# TinaCMS Cloud (optional for local dev)
# Leave empty to use local-only mode
NEXT_PUBLIC_TINA_CLIENT_ID=
TINA_TOKEN=

# Or add your actual values for cloud features
# NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
# TINA_TOKEN=your-read-token
```

## Quick Reference

### Check Your Setup
```bash
# Verify 1Password is configured
op item get "TinaCMS-MQ-Studio" --vault="Development"

# Test credentials are loading
op run --env-file="./.env.1password.template" -- env | grep TINA
```

### Start Development
```bash
# With 1Password
npm run dev:1p

# Without (local-only mode)
npm run dev
```

### Access Admin Panel
- Local: http://localhost:3100/admin
- Production: https://your-domain.com/admin

### Troubleshooting

**"Not authorized" error:**
- Ensure you have write access to the GitHub repo
- Check that TinaCMS app is authorized in GitHub settings
- Verify credentials are correctly set

**"Cannot connect to TinaCMS Cloud":**
- Check `NEXT_PUBLIC_TINA_CLIENT_ID` is set
- Verify `TINA_TOKEN` is correct
- Ensure you're connected to internet

**1Password issues:**
- Run `op signin` to authenticate
- Check vault and item names match exactly
- Verify with: `op item get "TinaCMS-MQ-Studio"`

## Benefits of This Setup

1. **Security**: Credentials never in plain text files
2. **Simplicity**: GitHub handles all user authentication
3. **Team-friendly**: Add editors via GitHub collaborators
4. **No passwords**: Nobody needs to remember CMS passwords
5. **Audit trail**: GitHub and 1Password track all access

## Summary

- **Local dev**: Works without any credentials
- **Cloud features**: Add TinaCMS credentials via 1Password
- **Authentication**: Handled entirely by GitHub OAuth
- **Access control**: Managed through GitHub repository permissions
- **Production**: Same credentials, just add to hosting platform

No complex authentication setup needed - TinaCMS + GitHub handles everything!