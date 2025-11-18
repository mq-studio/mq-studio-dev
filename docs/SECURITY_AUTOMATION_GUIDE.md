# Security Automation Guide

**Last Updated:** 2025-11-18  
**Status:** Active

This document describes all automated security monitoring and actions configured for the MQ Studio website project.

---

## Overview

The security automation system consists of:
- **Cloud-based:** GitHub Actions workflows for CI/CD and scheduled monitoring
- **Local:** Scripts for on-demand security checks during development
- **Event-driven:** Automated responses to dependency changes and releases
- **Time-based:** Scheduled reviews and audits

---

## 1. GitHub Actions Workflows (Cloud)

All workflows are located in `.github/workflows/` and run on GitHub's infrastructure.

### 1.1 `security-audit.yml` - Continuous Security Auditing

**Triggers:**
- Every push to `main`
- Every pull request
- Weekly schedule (Mondays at 10:00 UTC)

**Actions:**
- Runs `npm audit` on all dependencies
- Runs production-only audit (`npm audit --production`) with critical threshold
- Blocks CI if critical production vulnerabilities found
- Uploads audit results as artifacts (30-day retention)
- Generates summary in GitHub Actions UI

**Manual Run:**
```bash
gh workflow run security-audit.yml
```

**View Results:**
```bash
gh run list --workflow=security-audit.yml
gh run view <run-id>
```

---

### 1.2 `dependabot.yml` - Automated Dependency Updates

**Configuration:** `.github/dependabot.yml`

**Schedule:** Weekly (Mondays at 10:00 UTC)

**Actions:**
- Scans npm dependencies for updates
- Groups minor/patch updates to reduce PR noise
- Creates individual PRs for security updates
- Ignores major version updates (requires manual review)

**Labels Applied:**
- `dependencies`
- `security` (for security updates only)

**Auto-merge:** Not configured (requires manual approval)

---

### 1.3 `tinacms-vulnerability-monitor.yml` - TinaCMS Update Tracker

**Triggers:**
- Weekly schedule (Mondays at 11:00 UTC, after Dependabot)
- Manual dispatch

**Actions:**
- Checks for new TinaCMS releases
- Compares current version vs. latest
- Fetches release notes and scans for security keywords (lodash, mermaid, vite, CVE)
- Creates GitHub issue if update available (or comments on existing issue)
- Prioritizes issues as P0 if security fixes detected

**Tracked Vulnerabilities:**
- `lodash.set` (HIGH) - 7 instances in TinaCMS dependencies
- `mermaid` DOMPurify bundling (HIGH)
- `vite` (MODERATE) - dev server only

**Manual Run:**
```bash
gh workflow run tinacms-vulnerability-monitor.yml
```

**View Issues:**
```bash
gh issue list --label tinacms
```

---

### 1.4 `quarterly-security-review.yml` - Comprehensive Review

**Triggers:**
- Quarterly schedule (1st of Jan, Apr, Jul, Oct at 09:00 UTC)
- Manual dispatch

**Actions:**
- Runs full `npm audit` with vulnerability counts
- Checks for outdated dependencies (`npm outdated`)
- Creates comprehensive GitHub issue with 10-section checklist:
  1. Vulnerability assessment
  2. Dependency updates
  3. Access control & secrets
  4. Deployment security
  5. Code security
  6. Monitoring & alerting
  7. Deferred structural improvements (post-Week 10)
  8. Documentation updates
  9. Testing
  10. Report & follow-up

**Manual Run:**
```bash
gh workflow run quarterly-security-review.yml
```

**Next Reviews:**
- Q1 2026: January 1, 2026
- Q2 2026: April 1, 2026
- Q3 2026: July 1, 2026
- Q4 2026: October 1, 2026

---

### 1.5 `dependency-review.yml` - PR Security Gate

**Triggers:**
- Pull requests that modify `package.json` or `package-lock.json`

**Actions:**
- Uses GitHub's Dependency Review API to compare dependency changes
- Fails CI if PR introduces new high/critical vulnerabilities
- Allows vulnerabilities we've deemed acceptable (TinaCMS admin/dev dependencies)
- Comments on PR with security summary
- Special handling for TinaCMS updates (adds testing checklist)

**Severity Threshold:** Fails on `high` or `critical`

**Scope:** Only fails on `runtime` dependencies (dev dependencies allowed to have vulnerabilities)

---

## 2. Local Scripts

Scripts located in `scripts/` directory for on-demand execution during development.

### 2.1 `security-monitor.sh` - Comprehensive Local Check

**Usage:**
```bash
./scripts/security-monitor.sh
```

**What It Does:**
1. **npm vulnerabilities** - Runs `npm audit` and saves JSON report
2. **Outdated dependencies** - Checks for available updates
3. **Exposed secrets** - Scans for hardcoded credentials using git-secrets or regex patterns
4. **Environment variables** - Verifies `.env` exists and is gitignored
5. **TinaCMS version** - Compares current vs. latest version
6. **CI/CD status** - Checks GitHub Actions workflow status (requires `gh` CLI)

**Output:**
- Color-coded console output (red/yellow/green)
- Saves audit reports to `.security-audits/audit-<timestamp>.json`
- Exit code 0 (pass) or 1 (critical vulnerabilities present)

**Recommended Frequency:**
- Before committing dependency changes
- Before creating release PRs
- Weekly during active development

**Integration Options:**
- Add to git pre-commit hook
- Add to VS Code tasks (already configured)
- Run in CI/CD (could be added to workflows)

---

## 3. VS Code Tasks

Configured in `.vscode/tasks.json` for easy access within VS Code.

**Available Tasks:**

| Task Name | Command | Description |
|-----------|---------|-------------|
| Security: Quick Audit | `npm audit` | Fast vulnerability check |
| Security: Full Monitor | `./scripts/security-monitor.sh` | Complete 6-step security check |
| Security: Check TinaCMS Updates | `npm view tinacms version && npm list tinacms` | Compare TinaCMS versions |
| Security: Production Audit | `npm audit --production` | Check only production dependencies |
| Security: Check Outdated Dependencies | `npm outdated` | List packages with updates |

**Run from VS Code:**
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select a security task

**Or from Command Palette:**
- `Tasks: Run Build Task` → Select security task

---

## 4. Automation Timing Calendar

### Weekly (Every Monday)

| Time (UTC) | Action | Location |
|------------|--------|----------|
| 10:00 | Dependabot scans for dependency updates | GitHub Actions |
| 10:00 | Security audit runs (scheduled) | GitHub Actions |
| 11:00 | TinaCMS vulnerability monitor checks for updates | GitHub Actions |

### Quarterly (1st of Jan/Apr/Jul/Oct)

| Time (UTC) | Action | Location |
|------------|--------|----------|
| 09:00 | Quarterly security review issue created | GitHub Actions |

### Event-Driven

| Event | Action | Location |
|-------|--------|----------|
| Push to `main` | Security audit runs | GitHub Actions |
| Pull request opened | Security audit + dependency review | GitHub Actions |
| `package.json` modified in PR | Dependency review + TinaCMS check | GitHub Actions |
| Manual: `./scripts/security-monitor.sh` | Full local security check | Local |

---

## 5. Integration with Existing Workflows

### 5.1 Development Workflow

```bash
# Before starting work
git checkout main
git pull origin main

# During development (run periodically)
./scripts/security-monitor.sh

# Before committing dependency changes
npm audit
npm outdated

# Create PR (triggers automated checks)
git push origin feature/my-branch
gh pr create
```

### 5.2 Release Workflow

```bash
# 1. Ensure security checks pass
npm audit --production  # Must show 0 critical
npm test                # Must pass 21/21 tests
npm run build           # Must build successfully

# 2. Create release PR
gh pr create --base main --head develop \
  --title "Release: vX.Y.Z" \
  --body-file docs/RELEASE_NOTES.md

# 3. Automated checks run:
#    - security-audit.yml
#    - dependency-review.yml (if deps changed)

# 4. After CI passes and review approved
gh pr merge

# 5. Push to production
git push production main  # Triggers production deployment
```

### 5.3 Security Incident Response

```bash
# 1. Critical vulnerability discovered
gh issue create \
  --title "Security: CVE-XXXX-YYYY in <package>" \
  --label "security,priority-critical" \
  --body "Details..."

# 2. Apply fix in security branch
git checkout -b security/cve-xxxx-yyyy
npm audit fix --force  # Or manual package override

# 3. Verify fix
./scripts/security-monitor.sh
npm test
npm run build

# 4. Create emergency PR
gh pr create --base main \
  --title "Security: Patch CVE-XXXX-YYYY" \
  --label "security" \
  --assignee @me

# 5. Fast-track review and merge
# 6. Deploy immediately to production
```

---

## 6. Notification Configuration

### GitHub Notifications

**To receive security alerts:**

1. **Repository settings** (per-repo):
   - Go to repository → Settings → Notifications
   - Enable "Security alerts"
   - Enable "Dependabot alerts"

2. **Personal settings** (all repos):
   - Go to GitHub Settings → Notifications
   - Under "Watching", enable:
     - Security alert emails
     - Dependabot alerts

3. **Team notifications** (if using GitHub Teams):
   - Go to organization → Teams → `security-team`
   - Add team as repository watcher
   - Configure notification preferences

### Email Digest

**Weekly Security Summary Email:**

Currently not configured. To implement:
- Option A: Use GitHub Apps like "Renovate" or "Dependency Dashboard"
- Option B: Create custom workflow that emails digest of:
  - New Dependabot PRs
  - New security advisories
  - Audit result summaries

---

## 7. Deferred Actions (Post-Week 10)

The following security improvements are **deferred** until after the website rebuild discovery phase completes (Week 10+):

### Phase 1: Critical Security Infrastructure
- [ ] R3.1: Branching strategy (develop → release → main)
- [ ] R4.1: Proper staging environment separate from dev
- [ ] R5.1: Security policies (SECURITY.md)

### Phase 2: Repository Cleanup
- [ ] R1.1: Disable alerts on archived repos (manual web UI action)
- [ ] R1.3: Configure CodeQL per repo
- [ ] R2.1: Consolidate documentation (organize .md files)
- [ ] R3.2: Separate dev/prod working directories

### Phase 3: Process Improvements
- [ ] R2.2: Align local and GitHub repo naming
- [ ] R4.3: Centralize env var management
- [ ] R5.2: Create security dashboard

**Why Deferred:**
The project is currently in a discovery phase (Weeks 1-2) experimenting with three different website rebuild approaches (BMAD-METHOD, Speckit, original unstructured). Implementing major repository structural changes now would disrupt active experimentation. These improvements will be applied after selecting the winning experiment and integrating cherry-picked features (Week 10+).

See: [SECURITY_AUDIT_2025-11-18_STRUCTURAL_RECOMMENDATIONS.md](./SECURITY_AUDIT_2025-11-18_STRUCTURAL_RECOMMENDATIONS.md)

---

## 8. Manual Actions Required

Some security actions cannot be fully automated and require manual intervention:

### One-Time Setup

- [ ] **Disable alerts on archived repository** (requires GitHub web UI):
  - Navigate to: https://github.com/mq-studio/website-mq-studio/settings/security_analysis
  - Disable Dependabot alerts
  - Disable Code scanning alerts
  - **Reason:** Archived repo won't receive patches; alerts are noise

- [ ] **Enable private vulnerability reporting** (optional):
  - Navigate to: https://github.com/mq-studio/mq-studio-dev/settings/security_analysis
  - Enable "Private vulnerability reporting"
  - **Benefit:** Security researchers can report issues privately

### Recurring Manual Tasks

- **Quarterly:** Review and complete quarterly security review checklist (created by automation)
- **On TinaCMS update:** Test admin functionality, content editing, schema validation
- **On major dependency update:** Review migration guides, test thoroughly before production
- **On security incident:** Coordinate response, communicate with stakeholders, document lessons learned

---

## 9. Monitoring Dashboard

### View Current Security Status

**GitHub Web UI:**
- **Security Overview:** https://github.com/mq-studio/mq-studio-dev/security
- **Dependabot Alerts:** https://github.com/mq-studio/mq-studio-dev/security/dependabot
- **Dependabot PRs:** https://github.com/mq-studio/mq-studio-dev/pulls?q=is%3Apr+is%3Aopen+label%3Adependencies

**GitHub CLI:**
```bash
# View recent security audit runs
gh run list --workflow=security-audit.yml --limit 5

# View Dependabot PRs
gh pr list --label dependencies

# View TinaCMS monitoring issues
gh issue list --label tinacms --state open

# View quarterly review issues
gh issue list --label security-review --state open

# Get security alert count (requires GraphQL)
gh api graphql -f query='
{
  repository(owner: "mq-studio", name: "mq-studio-dev") {
    vulnerabilityAlerts(first: 100) {
      totalCount
    }
  }
}'
```

**Local:**
```bash
# Quick security check
./scripts/security-monitor.sh

# View saved audit reports
ls -lh .security-audits/
cat .security-audits/audit-<latest-timestamp>.json | jq '.metadata.vulnerabilities'
```

---

## 10. Troubleshooting

### Workflow Not Running

**Problem:** Scheduled workflow didn't trigger on expected date/time

**Possible Causes:**
- GitHub Actions scheduled workflows have ~3-15 minute delay
- If repo has low activity, GitHub may disable scheduled workflows after 60 days
- Workflow syntax error

**Solutions:**
```bash
# Check workflow syntax
gh workflow view security-audit.yml

# Manual trigger to test
gh workflow run security-audit.yml

# View run logs
gh run list --workflow=security-audit.yml --limit 1
gh run view <run-id> --log
```

### Dependabot Not Creating PRs

**Problem:** No Dependabot PRs despite known outdated packages

**Check:**
```bash
# Verify Dependabot config syntax
cat .github/dependabot.yml

# Check Dependabot status (web UI)
# Navigate to: https://github.com/mq-studio/mq-studio-dev/network/updates

# Check for existing PRs (may be grouped)
gh pr list --label dependencies --state all
```

### Local Script Fails

**Problem:** `./scripts/security-monitor.sh` errors out

**Common Issues:**
1. **Not executable:** `chmod +x scripts/security-monitor.sh`
2. **Missing dependencies:** Install `jq`, `gh` CLI
3. **No node_modules:** Run `npm install` first
4. **Git secrets not installed:** Script falls back to basic regex patterns

**Debug:**
```bash
# Run with verbose output
bash -x ./scripts/security-monitor.sh

# Check dependencies
which jq    # JSON processor
which gh    # GitHub CLI
```

### False Positives in Dependency Review

**Problem:** PR blocked due to vulnerabilities we've deemed acceptable

**Solution:**
1. Check if vulnerability is in accepted list (VULNERABILITY_TRACKING.md)
2. If acceptable, update `.github/workflows/dependency-review.yml`:
   ```yaml
   with:
     # Add exception for specific vulnerability
     allow-ghsas: GHSA-xxxx-xxxx-xxxx
   ```
3. Or override PR check (requires admin permissions):
   ```bash
   # Add comment to PR explaining override reason
   gh pr review <pr-number> --approve --body "Overriding: vulnerability is admin-only per VULNERABILITY_TRACKING.md"
   ```

---

## 11. Cost & Resource Usage

### GitHub Actions Minutes

**Current Usage (estimated per month):**
- Dependabot: 0 minutes (free)
- Security audit (weekly): ~4 runs × 2 min = 8 min
- Security audit (on push): ~20 pushes × 2 min = 40 min
- TinaCMS monitor (weekly): ~4 runs × 1 min = 4 min
- Quarterly review: ~1 run × 1 min = 1 min
- Dependency review (PRs): ~10 PRs × 1 min = 10 min

**Total:** ~63 minutes/month

**Free tier:** 2,000 minutes/month for public repos (or 50,000 minutes/month for GitHub Pro)

**Cost:** $0 (well within free tier)

### Storage

**Artifacts (30-day retention):**
- Security audit reports: ~50 KB each
- Monthly storage: ~50 KB × 30 runs = 1.5 MB
- Annual storage: ~18 MB

**Free tier:** 500 MB for public repos

**Cost:** $0

### Local Resources

**`.security-audits/` directory:**
- Grows by ~100 KB per run
- Recommend periodic cleanup: `find .security-audits/ -mtime +90 -delete`

---

## 12. Future Enhancements

**Potential Additions:**

1. **Slack/Discord Notifications:**
   - Send alerts to team channel when security issues detected
   - Implementation: GitHub Actions → Webhook

2. **Automated Security Dashboard:**
   - Live dashboard showing current security status
   - Options: GitHub Pages site, README badges, custom web app

3. **Automated Minor Patch Updates:**
   - Auto-merge Dependabot PRs for patch versions after CI passes
   - Requires: Branch protection rules + auto-merge config

4. **SBOM (Software Bill of Materials) Generation:**
   - Automatically generate SBOM on releases
   - Format: SPDX or CycloneDX
   - Tool: `npm sbom` (available in npm 9+)

5. **Container Security Scanning:**
   - If Dockerizing application in future
   - Tool: Trivy, Snyk, or GitHub's built-in scanning

6. **Secret Scanning:**
   - Enable GitHub Advanced Security (requires paid plan for private repos)
   - Or use: git-secrets pre-commit hook

---

## 13. Related Documentation

- [VULNERABILITY_TRACKING.md](../VULNERABILITY_TRACKING.md) - Current vulnerability status
- [SECURITY_REMEDIATION_PLAN.md](./SECURITY_REMEDIATION_PLAN.md) - P0 security fixes applied
- [SECURITY_AUDIT_2025-11-18_STRUCTURAL_RECOMMENDATIONS.md](./SECURITY_AUDIT_2025-11-18_STRUCTURAL_RECOMMENDATIONS.md) - Deferred improvements
- [WEBSITE_REBUILD_WORKFLOW.md](../WEBSITE_REBUILD_WORKFLOW.md) - Discovery phase timeline

---

## 14. Quick Reference

### Commands Cheat Sheet

```bash
# === Local Security Checks ===
./scripts/security-monitor.sh          # Full security check
npm audit                               # Quick vulnerability scan
npm audit --production                  # Production-only scan
npm outdated                            # Check for updates

# === GitHub CLI ===
gh workflow run security-audit.yml      # Trigger security audit
gh workflow run tinacms-vulnerability-monitor.yml  # Check TinaCMS updates
gh run list --workflow=security-audit.yml  # View recent runs
gh issue list --label security          # View security issues
gh pr list --label dependencies         # View Dependabot PRs

# === Manual Workflow Triggers ===
gh workflow run quarterly-security-review.yml  # Run quarterly review now

# === Audit Reports ===
ls .security-audits/                    # View saved reports
cat .security-audits/audit-*.json | jq  # Parse latest report
```

### File Locations

```
.github/
  workflows/
    security-audit.yml                  # Continuous audit
    tinacms-vulnerability-monitor.yml   # TinaCMS update tracker
    quarterly-security-review.yml       # Quarterly review
    dependency-review.yml               # PR security gate
  dependabot.yml                        # Dependabot config
scripts/
  security-monitor.sh                   # Local security check
.vscode/
  tasks.json                            # VS Code security tasks
docs/
  SECURITY_AUTOMATION_GUIDE.md          # This document
  SECURITY_REMEDIATION_PLAN.md          # P0 fixes
  SECURITY_AUDIT_2025-11-18_STRUCTURAL_RECOMMENDATIONS.md  # Deferred improvements
VULNERABILITY_TRACKING.md               # Current status
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-18  
**Maintained By:** Security Engineering Team  
**Next Review:** 2026-01-01 (Q1 2026 Security Review)
