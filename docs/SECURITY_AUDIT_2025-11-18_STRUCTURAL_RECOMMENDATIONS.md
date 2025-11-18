# Security Audit 2025-11-18: Structural Recommendations

**Date:** 2025-11-18
**Context:** Post-security remediation analysis
**Scope:** Repository structure, deployment architecture, and GitHub organization improvements

---

## Executive Summary

While addressing 20 npm security vulnerabilities in the MQ Studio website, several structural improvements were identified that would enhance security posture, clarity, and maintainability. This document outlines recommendations for optimizing local folder structure, Git/GitHub repository organization, and deployment architecture.

**Key Findings:**
- ✅ Security vulnerabilities successfully reduced from 20 to 9 (55% reduction)
- ✅ All critical vulnerabilities eliminated
- ⚠️ Repository structure could be optimized for better security monitoring
- ⚠️ GitHub CodeQL alerts reference archived code, causing confusion
- ⚠️ Dependabot alerts need repository-specific configuration

---

## 1. GitHub Repository Structure

### Current State

The mq-studio GitHub organization has 6 repositories:

| Repository | Status | Purpose | Security Alerts |
|------------|--------|---------|-----------------|
| `mq-studio-dev` | **Active** | Development/staging | ✅ Should be monitored |
| `mq-studio-site` | **Active** | Production deployment | ✅ Should be monitored |
| `website-mq-studio` | **Archived** | Early development | ⚠️ Has stale alerts |
| `mq-studio-knowledge` | Active | Documentation | N/A |
| `mq-studio-assets` | Active | Media assets | N/A |
| `mq_studio_build` | **Archived** | Obsolete prototype | ⚠️ Should be deleted |

### Issues Identified

1. **Archived Repository Alerts:** The `website-mq-studio` repo (archived) shows CodeQL and Dependabot alerts that are confusing/irrelevant
2. **Python Governance Scripts:** CodeQL alerts reference `infra/tools/governance-enforcer.py` which doesn't exist in active repos
3. **Alert Noise:** Archived repos generate alert noise that obscures real security issues

### Recommendations

#### R1.1: Clean Up Archived Repositories

**Priority: P1 (High)**

```bash
# Disable security alerts on archived repositories
gh repo edit mq-studio/website-mq-studio --enable-vulnerability-alerts=false
gh repo edit mq-studio/mq_studio_build --enable-vulnerability-alerts=false

# Or consider deleting obsolete archived repo
gh repo delete mq-studio/mq_studio_build --confirm
```

**Rationale:**
- Reduces alert fatigue
- Focuses attention on active codebases
- Archived code won't be patched anyway

#### R1.2: Configure Repository-Specific Dependabot

**Priority: P0 (Critical)**

Create `.github/dependabot.yml` in `mq-studio-dev` and `mq-studio-site`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    reviewers:
      - "mq-studio/maintainers"
    labels:
      - "dependencies"
      - "security"
    # Group non-security updates
    groups:
      development-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"
    # Auto-merge patch updates for dev dependencies
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
```

**Benefits:**
- Automated security patches
- Weekly dependency updates
- Grouped PRs reduce noise
- Major versions require manual review

#### R1.3: Enable CodeQL Only Where Relevant

**Priority: P1**

- **Enable CodeQL:** `mq-studio-dev`, `mq-studio-site` (JavaScript/TypeScript analysis)
- **Disable CodeQL:** `website-mq-studio` (archived), `mq-studio-knowledge` (docs only), `mq-studio-assets` (media only)

**Action:**
```bash
# Via GitHub Settings > Security > Code scanning
# Or via GitHub API
gh api -X PATCH /repos/mq-studio/website-mq-studio \
  -f "security_and_analysis[advanced_security][status]=disabled"
```

---

## 2. Local Folder Structure

### Current State

```
/home/ichardart/dev/projects/moura-quayle/
├── website-mq-studio/          # Working directory (mq-studio-dev repo)
│   ├── package.json
│   ├── docs/
│   ├── app/
│   └── ...
├── [many .md files at root]    # Documentation proliferation
└── [various other files]
```

### Issues Identified

1. **Documentation Sprawl:** 130+ .md files in root directory
2. **Repository Naming Confusion:** Local directory is `website-mq-studio` but GitHub repo is `mq-studio-dev`
3. **No Clear Separation:** Documentation, infrastructure, and application code mixed

### Recommendations

#### R2.1: Consolidate Documentation

**Priority: P1**

```bash
# Create organized documentation structure
mkdir -p docs/{iterations,architecture,deployment,security,testing}

# Move iteration reports
mv ITERATION_*.md docs/iterations/
mv PHASE*.md docs/iterations/

# Move architecture docs
mv ARCHITECTURE*.md CMS_*.md docs/architecture/

# Move deployment docs
mv DEPLOYMENT*.md STAGING*.md VERCEL*.md HOSTINGER*.md docs/deployment/

# Move security docs
mv VULNERABILITY*.md SECURITY*.md RED_TEAM*.md docs/security/

# Move testing docs
mv *_TEST*.md *_TESTING*.md docs/testing/

# Create index
cat > docs/00-INDEX.md <<'EOF'
# Documentation Index

## Active Documents
- [README](../README.md) - Project overview
- [Architecture](architecture/)
- [Security](security/)
- [Deployment](deployment/)

## Historical Documents
- [Iterations](iterations/) - Development iteration reports
- [Testing](testing/) - Test reports and strategies
EOF
```

**Benefits:**
- Easier to find relevant documentation
- Reduces root directory clutter
- Historical docs separated from current docs
- Better for version control

#### R2.2: Align Local and GitHub Repository Names

**Priority: P2 (Medium)**

**Option A: Rename local directory (recommended)**
```bash
cd /home/ichardart/dev/projects/moura-quayle
mv website-mq-studio mq-studio-dev
cd mq-studio-dev
git remote -v  # Verify it points to mq-studio-dev repo
```

**Option B: Update GitHub repository name**
```bash
gh repo rename mq-studio/mq-studio-dev --new-name website-mq-studio
```

**Recommendation:** Option A (rename local to match GitHub) because:
- GitHub repo name `mq-studio-dev` is clearer (indicates development)
- Less disruptive (doesn't break external links)
- Aligns with `mq-studio-site` naming convention

---

## 3. Git Repository Structure

### Current State

```
mq-studio-dev (origin)
  ↓ push/pull
mq-studio-site (production remote)
  ↓ deploy
Vercel (automatic deployment)
```

### Issues Identified

1. **Dual Remote Configuration:** One local repo pushes to both dev and production repos
2. **No Separation of Concerns:** Same codebase for experimentation and stable releases
3. **Branch Strategy Unclear:** Main branch serves both development and production

### Recommendations

#### R3.1: Implement Clear Branching Strategy

**Priority: P0 (Critical)**

**Proposed Strategy:**

```
mq-studio-dev (Development Repository)
├── main (development-ready code)
├── feature/* (feature branches)
├── experiment/* (experimental work)
└── security/* (security patches)

mq-studio-site (Production Repository)
├── main (production-deployed code)
├── release/* (release candidates)
└── hotfix/* (emergency patches)
```

**Workflow:**
1. **Development:** Work in `mq-studio-dev` feature branches → merge to `mq-studio-dev/main`
2. **Release:** Create PR from `mq-studio-dev/main` to `mq-studio-site/release/v*`
3. **Production:** After QA, merge release branch to `mq-studio-site/main` → auto-deploy to Vercel

**Implementation:**
```bash
# In mq-studio-dev
git checkout -b security/vulnerability-remediation-2025-11-18
# ... make changes ...
git push origin security/vulnerability-remediation-2025-11-18

# Create PR to mq-studio-dev/main
gh pr create --base main --head security/vulnerability-remediation-2025-11-18 \
  --title "Security: Patch npm vulnerabilities (20→9)" \
  --body-file docs/SECURITY_REMEDIATION_PLAN.md

# After merge to dev, create release PR to production
gh pr create --repo mq-studio/mq-studio-site \
  --base main \
  --head mq-studio-dev:main \
  --title "Release: Security patches 2025-11-18"
```

#### R3.2: Separate Development and Production Environments

**Priority: P1**

**Current (Problematic):**
- Single working directory with dual remotes
- Confusion about which repo is being updated

**Proposed:**
```
/home/ichardart/dev/projects/mq-studio/
├── mq-studio-dev/          # Development work
│   └── .git (origin: mq-studio/mq-studio-dev)
├── mq-studio-site/         # Production releases
│   └── .git (origin: mq-studio/mq-studio-site)
└── shared/                 # Shared assets/docs
```

**Benefits:**
- Clear separation of dev and prod
- Prevents accidental pushes to wrong repo
- Easier to maintain different configurations

---

## 4. Deployment Architecture

### Current State

**Vercel Deployment:**
- Connected to GitHub repositories
- Automatic deployments on push to main
- Environment variables managed via Vercel dashboard and 1Password

### Issues Identified

1. **Environment Variable Management:** Complex, documented across multiple files
2. **No Staging Environment:** Development deploys directly to production
3. **Security Alert Integration:** Not connected to CI/CD pipeline

### Recommendations

#### R4.1: Implement Proper Staging Environment

**Priority: P0 (Critical)**

**Proposed Architecture:**

```
GitHub: mq-studio-dev/main
  ↓ (auto-deploy)
Vercel: staging.mqstudio.ca
  ↓ (manual promotion after QA)
GitHub: mq-studio-site/main
  ↓ (auto-deploy)
Vercel: mqstudio.ca (production)
```

**Implementation:**
```bash
# Configure Vercel projects
vercel link --scope mq-studio --project mq-studio-dev
vercel env add NEXT_PUBLIC_SITE_URL https://staging.mqstudio.ca

vercel link --scope mq-studio --project mq-studio-site
vercel env add NEXT_PUBLIC_SITE_URL https://mqstudio.ca
```

**Benefits:**
- Test changes in production-like environment
- Catch deployment issues before production
- Safer rollout of security patches

#### R4.2: Integrate Security Scanning in CI/CD

**Priority: P1**

Create `.github/workflows/security-check.yml` in both repos:

```yaml
name: Security Audit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 10 * * 1'  # Weekly on Monday

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=high

      - name: Check for production vulnerabilities
        run: npm audit --production --audit-level=high

      - name: Post results to PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const audit = require('child_process')
              .execSync('npm audit --json')
              .toString();
            const { vulnerabilities } = JSON.parse(audit);
            const summary = `## Security Audit\n\n${Object.keys(vulnerabilities).length} vulnerabilities found`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

**Benefits:**
- Automated security checks on every PR
- Prevents vulnerable code from merging
- Weekly scheduled audits catch new CVEs

#### R4.3: Centralize Environment Variable Management

**Priority: P2**

**Current Issues:**
- Variables documented in `.env.example`, `.env.1password.template`, `VERCEL_ENV_SETUP_GUIDE.md`
- Hard to keep synchronized
- Easy to miss required variables

**Proposed Solution:**

Create `scripts/verify-env.js`:

```javascript
// Required environment variables for each environment
const REQUIRED_VARS = {
  development: [
    'TINA_PUBLIC_CLIENT_ID',
    'TINA_PUBLIC_TOKEN',
    'NEXT_PUBLIC_SITE_URL'
  ],
  production: [
    'TINA_PUBLIC_CLIENT_ID',
    'TINA_PUBLIC_TOKEN',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_GISCUS_REPO',
    'NEXT_PUBLIC_GISCUS_REPO_ID',
    // ... all production vars
  ]
};

const env = process.env.NODE_ENV || 'development';
const required = REQUIRED_VARS[env];
const missing = required.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables for ${env}:`);
  missing.forEach(v => console.error(`   - ${v}`));
  process.exit(1);
}

console.log(`✅ All required environment variables present for ${env}`);
```

Add to `package.json`:
```json
{
  "scripts": {
    "verify:env": "node scripts/verify-env.js",
    "dev": "npm run verify:env && tinacms dev -c \"next dev --hostname 0.0.0.0 --port 3100\"",
    "build": "npm run verify:env && npm run build:tinacms && next build"
  }
}
```

**Benefits:**
- Fail fast if environment variables missing
- Self-documenting (code is source of truth)
- Prevents deployment failures

---

## 5. Security Monitoring and Alerting

### Recommendations

#### R5.1: GitHub Security Advisory Configuration

**Priority: P0**

**Action Items:**
1. Enable Dependabot security updates (automated PRs)
2. Configure security alert notifications
3. Set up GitHub security policy

Create `.github/SECURITY.md`:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities to security@mqstudio.ca or via GitHub Security Advisories.

**Do not** open public issues for security vulnerabilities.

## Security Monitoring

- Weekly automated dependency audits
- Dependabot security updates enabled
- CodeQL scanning on all PRs

## Response Timeline

- Critical: 24 hours
- High: 1 week
- Medium: 1 month
- Low: Best effort
```

#### R5.2: Security Dashboard

**Priority: P2**

Create `docs/security/DASHBOARD.md`:

```markdown
# Security Dashboard

## Current Status
- Last Audit: 2025-11-18
- Total Vulnerabilities: 9
- Critical: 0
- Production Risk: NEGLIGIBLE

## Quick Links
- [npm audit report](./latest-audit.json)
- [Dependabot PRs](https://github.com/mq-studio/mq-studio-dev/pulls?q=is%3Apr+is%3Aopen+label%3Adependencies)
- [Security Advisories](https://github.com/mq-studio/mq-studio-dev/security/advisories)

## Monitoring Checklist
- [ ] Weekly npm audit (Mondays)
- [ ] Review Dependabot PRs
- [ ] Check TinaCMS security releases
- [ ] Verify Vercel deployment security headers
```

---

## 6. Implementation Roadmap

### Phase 1: Critical Security Infrastructure (Week 1)

**Priority: P0 - Immediate**

- [ ] R3.1: Implement branching strategy
- [ ] R4.1: Set up staging environment on Vercel
- [ ] R4.2: Add security checks to GitHub Actions
- [ ] R5.1: Configure Dependabot and security policies
- [ ] R1.2: Add `.github/dependabot.yml` to active repos

**Estimated Effort:** 1 day
**Owner:** DevOps/Security Lead

### Phase 2: Repository Cleanup (Week 2)

**Priority: P1 - High**

- [ ] R1.1: Disable alerts on archived repositories
- [ ] R1.3: Configure CodeQL appropriately per repo
- [ ] R2.1: Consolidate documentation structure
- [ ] R3.2: Separate dev and prod working directories

**Estimated Effort:** 0.5 days
**Owner:** Repository Maintainer

### Phase 3: Process Improvements (Week 3-4)

**Priority: P2 - Medium**

- [ ] R2.2: Align local and GitHub repository names
- [ ] R4.3: Centralize environment variable management
- [ ] R5.2: Create security monitoring dashboard
- [ ] Document new workflows in CONTRIBUTING.md

**Estimated Effort:** 1 day
**Owner:** Engineering Team

### Phase 4: Ongoing Maintenance

**Priority: P3 - Low**

- Weekly security audits (automated)
- Monthly review of security posture
- Quarterly review of repository structure
- Annual disaster recovery test

---

## 7. Success Metrics

### Key Performance Indicators

1. **Security Response Time**
   - Target: <24h for critical vulnerabilities
   - Current: N/A (establish baseline)

2. **Vulnerability Count**
   - Baseline: 9 (2025-11-18)
   - Target: <5 high/critical
   - Measure: Weekly

3. **Deployment Confidence**
   - Target: 100% of releases through staging first
   - Measure: Via Vercel deployment logs

4. **Alert Fatigue**
   - Baseline: All repos generating alerts (including archived)
   - Target: Only active repos generate actionable alerts
   - Measure: GitHub alert count per repo

---

## 8. Conclusion

The security remediation work revealed opportunities to strengthen the MQ Studio development and deployment infrastructure. Implementing these recommendations will:

✅ **Improve Security Posture**
- Automated vulnerability scanning
- Clear separation of dev/prod
- Faster response to security issues

✅ **Reduce Maintenance Burden**
- Less alert noise from archived repos
- Organized documentation
- Automated dependency updates

✅ **Increase Deployment Confidence**
- Proper staging environment
- Security checks in CI/CD
- Clear release process

**Next Steps:**
1. Review and prioritize recommendations with team
2. Create GitHub issues for Phase 1 tasks
3. Assign owners and timeline
4. Begin implementation starting with P0 items

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Security Engineering Team
**Review Date:** 2025-12-18
