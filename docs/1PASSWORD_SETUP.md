# 1Password CLI Integration for MQ Studio

## Overview
This guide explains how to use 1Password CLI to manage credentials for the MQ Studio website, including TinaCMS and authentication secrets, without storing them in plain text files.

## Benefits of Using 1Password CLI
- ✅ **No secrets in files**: Credentials never touch the filesystem
- ✅ **Centralized management**: All secrets in one secure location
- ✅ **Team sharing**: Easy to share vault with team members
- ✅ **Audit trail**: Track who accessed what credentials
- ✅ **Automatic rotation**: Update credentials in one place

## Prerequisites

### 1. Install 1Password CLI
```bash
# macOS
brew install --cask 1password-cli

# Linux (Ubuntu/Debian)
curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
  sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" |
  sudo tee /etc/apt/sources.list.d/1password.list
sudo apt update && sudo apt install 1password-cli

# Windows (WSL)
# Follow Linux instructions above
```

### 2. Sign in to 1Password
```bash
# Initial sign-in
op signin

# Or if you have multiple accounts
op signin --account my-account
```

## Setting Up Credentials in 1Password

### Create a New Vault (Optional)
```bash
op vault create "MQ Studio Development"
```

### Create Items for Your Credentials

#### 1. TinaCMS Credentials
Create an item called "TinaCMS-MQ-Studio" with these fields:
- `client-id`: Your TinaCMS client ID (from https://app.tina.io)
- `token`: Your TinaCMS token

```bash
# Using 1Password CLI to create the item
op item create \
  --category=login \
  --title="TinaCMS-MQ-Studio" \
  --vault="Development" \
  client-id[text]="your-client-id-here" \
  token[password]="your-token-here"
```

#### 2. NextAuth Credentials
Create an item called "MQ-Studio-Auth" with these fields:
- `nextauth-secret`: A strong random secret for NextAuth
- `admin-email`: admin@mq-studio.com
- `password-hash`: The bcrypt hash of your admin password

```bash
# Generate a secure NextAuth secret
op item create \
  --category=login \
  --title="MQ-Studio-Auth" \
  --vault="Development" \
  nextauth-secret[password]="$(openssl rand -base64 32)" \
  admin-email[text]="admin@mq-studio.com" \
  password-hash[password]='$2b$12$2s0jjB7BtEMqxbEIHTaWEeRAop6YJLR0JyTIVgyf2LXh/bZcw6qfK'
```

## Usage Methods

### Method 1: NPM Scripts (Recommended)
Use the configured npm scripts that integrate with 1Password:

```bash
# Development with 1Password
npm run dev:1p

# Build with 1Password
npm run build:1p
```

### Method 2: Direct Script
Use the provided shell script:

```bash
./scripts/dev-with-1password.sh
```

### Method 3: Manual op run
Run commands directly with op:

```bash
op run --env-file="./.env.1password.template" -- npm run dev
```

### Method 4: Export to Environment (Temporary Session)
For a single session, you can export credentials:

```bash
# Export all credentials to current shell
eval $(op run --env-file="./.env.1password.template" -- sh -c 'env | grep -E "^(NEXT_PUBLIC_|TINA_|NEXTAUTH_|ADMIN_)"')

# Then run normally
npm run dev
```

## Template File Structure

The `.env.1password.template` file uses the format:
```
VARIABLE_NAME=op://vault/item/field
```

Example:
```env
NEXT_PUBLIC_TINA_CLIENT_ID=op://Development/TinaCMS-MQ-Studio/client-id
TINA_TOKEN=op://Development/TinaCMS-MQ-Studio/token
NEXTAUTH_SECRET=op://Development/MQ-Studio-Auth/nextauth-secret
```

## Production Deployment

### Vercel Deployment
For Vercel, you can use 1Password's GitHub Action:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Load secrets from 1Password
        uses: 1password/load-secrets-action@v1
        with:
          export-env: true
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          NEXT_PUBLIC_TINA_CLIENT_ID: op://Production/TinaCMS-MQ-Studio/client-id
          TINA_TOKEN: op://Production/TinaCMS-MQ-Studio/token
          NEXTAUTH_SECRET: op://Production/MQ-Studio-Auth/nextauth-secret

      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Docker Deployment
For Docker, inject secrets at runtime:

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build

# Use 1Password CLI in container
FROM node:18-alpine
RUN apk add --no-cache curl
RUN curl -sSfo op.zip https://cache.agilebits.com/dist/1P/op2/pkg/v2.24.0/op_linux_amd64_v2.24.0.zip && \
    unzip op.zip && mv op /usr/local/bin/

WORKDIR /app
COPY --from=0 /app .
CMD ["op", "run", "--env-file=.env.1password.template", "--", "npm", "start"]
```

## Security Best Practices

### 1. Never Commit Real Credentials
- ✅ Commit `.env.1password.template` (contains references, not secrets)
- ❌ Never commit `.env.local` with real values
- ❌ Never commit `.env` with real values

### 2. Use Different Vaults for Different Environments
```
Development/  - Local development secrets
Staging/      - Staging environment secrets
Production/   - Production secrets (restricted access)
```

### 3. Rotate Secrets Regularly
```bash
# Generate new NextAuth secret
op item edit "MQ-Studio-Auth" nextauth-secret="$(openssl rand -base64 32)"

# Generate new password hash (example with bcrypt)
npm install -g bcrypt-cli
op item edit "MQ-Studio-Auth" password-hash="$(bcrypt-cli 'new-password' 12)"
```

### 4. Use Service Accounts for CI/CD
Create a service account for automated deployments:
```bash
op service-account create "MQ Studio CI/CD" --expires-in 90d
```

## Troubleshooting

### Issue: "op: command not found"
**Solution**: Install 1Password CLI following the prerequisites section.

### Issue: "You are not currently signed in"
**Solution**: Run `op signin` or `eval $(op signin)`

### Issue: "Item not found"
**Solution**: Verify the vault/item/field names match exactly:
```bash
# List vaults
op vault list

# List items in vault
op item list --vault="Development"

# Get item details
op item get "TinaCMS-MQ-Studio" --vault="Development"
```

### Issue: "Permission denied" on script
**Solution**: Make the script executable:
```bash
chmod +x scripts/dev-with-1password.sh
```

## Migration from .env.local

If you have existing `.env.local` file, migrate to 1Password:

```bash
# 1. Create items in 1Password with your existing values
op item create --category=login --title="TinaCMS-MQ-Studio" --vault="Development" \
  client-id[text]="existing-client-id" \
  token[password]="existing-token"

# 2. Delete or gitignore .env.local
echo ".env.local" >> .gitignore
rm .env.local  # Optional: remove the file

# 3. Use the new 1Password-based commands
npm run dev:1p
```

## Quick Start Checklist

- [ ] Install 1Password CLI
- [ ] Sign in with `op signin`
- [ ] Create "Development" vault
- [ ] Create "TinaCMS-MQ-Studio" item with TinaCMS credentials
- [ ] Create "MQ-Studio-Auth" item with auth credentials
- [ ] Test with `npm run dev:1p`
- [ ] Remove/gitignore any `.env.local` files
- [ ] Commit `.env.1password.template` to Git

## Additional Resources

- [1Password CLI Documentation](https://developer.1password.com/docs/cli)
- [1Password Secret References](https://developer.1password.com/docs/cli/secret-references)
- [1Password GitHub Action](https://github.com/1password/load-secrets-action)
- [TinaCMS Documentation](https://tina.io/docs/)

---

**Security Note**: This setup ensures that sensitive credentials never exist in plain text on your filesystem, providing enterprise-grade security for your development workflow.