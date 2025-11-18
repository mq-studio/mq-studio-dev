# Security: Immediate Actions (Discovery Phase Compatible)

**Date:** 2025-11-18
**Status:** Ready to Execute
**Context:** Post-security remediation, pre-discovery phase

---

## ✅ Actions to Execute NOW (No Conflict with Discovery)

### 1. Push Security Fixes to GitHub

**Priority:** P0 (Critical)
**Estimated Time:** 5 minutes

```bash
# Push security remediation commit
git push origin main
```

**What this includes:**
- Vulnerability reduction (20→9)
- Package overrides for critical CVEs
- Stagehand moved to devDependencies
- Updated VULNERABILITY_TRACKING.md
- Security documentation

**No conflict because:** Production security fixes are independent of discovery phase experiments

---

### 2. Disable Alerts on Archived Repository

**Priority:** P1 (High)
**Estimated Time:** 5 minutes

```bash
# Disable Dependabot/CodeQL on archived repo
gh repo edit mq-studio/website-mq-studio \
  --enable-vulnerability-alerts=false \
  --enable-automated-security-fixes=false

# Verify
gh repo view mq-studio/website-mq-studio --json securityAndAnalysis
```

**Rationale:**
- `website-mq-studio` is archived and won't receive patches
- Reduces alert noise that obscures real issues
- Focuses attention on active repos (`mq-studio-dev`, `mq-studio-site`)

**No conflict because:** Archived repo is separate from discovery experiments

---

### 3. Configure Dependabot for Active Repositories

**Priority:** P0 (Critical)
**Estimated Time:** 15 minutes

#### 3a. Add to `mq-studio-dev` (development repo)

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"
      - "security"
    # During discovery phase: informational only
    # After discovery: enable auto-merge for patches
```

#### 3b. Add to `mq-studio-site` (production repo)

Same configuration as above

**Rationale:**
- Automated weekly security checks
- PRs are informational during discovery (don't need to merge immediately)
- After discovery, provides ongoing protection

**No conflict because:**
- Dependabot PRs are informational, not blocking
- You control when to merge
- Each experiment repo can have own Dependabot config

---

### 4. Add Security Scanning to GitHub Actions

**Priority:** P1 (High)
**Estimated Time:** 15 minutes

Create `.github/workflows/security-audit.yml` in `mq-studio-dev`:

```yaml
name: Security Audit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 10 * * 1'  # Weekly Monday 10am

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

      - name: Production audit (must pass)
        run: npm audit --production --audit-level=high
        continue-on-error: false

      - name: Full audit (informational during discovery)
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Create audit summary
        if: always()
        run: |
          echo "## Security Audit Results" >> $GITHUB_STEP_SUMMARY
          npm audit --json | jq -r '.metadata | "**Total:** \(.vulnerabilities.total) | **Critical:** \(.vulnerabilities.critical) | **High:** \(.vulnerabilities.high)"' >> $GITHUB_STEP_SUMMARY
```

**Rationale:**
- Production vulnerabilities block CI (must be addressed)
- Dev vulnerabilities are informational (won't block discovery work)
- Weekly scheduled audits catch new CVEs

**No conflict because:**
- Doesn't block legitimate discovery work
- Only fails on production-impacting issues
- Each experiment repo will get its own audit

---

### 5. Configure GitHub Security Advisories

**Priority:** P0 (Critical)
**Estimated Time:** 10 minutes

#### 5a. Create `.github/SECURITY.md` in both repos

```markdown
# Security Policy

## Supported Versions

| Version | Supported          | Context |
| ------- | ------------------ | ------- |
| main    | :white_check_mark: | Production baseline |
| experiments/* | :construction: | Discovery phase (informational) |

## Reporting a Vulnerability

**DO NOT** open public issues for security vulnerabilities.

Please report via:
- GitHub Security Advisories (preferred)
- Email: [your-email]

## Current Status

- **Last Audit:** 2025-11-18
- **Production Risk:** NEGLIGIBLE
- **Critical Vulnerabilities:** 0

See [VULNERABILITY_TRACKING.md](VULNERABILITY_TRACKING.md) for details.

## Discovery Phase (Current)

During experimentation (Weeks 1-10):
- Security audits run weekly (informational)
- Production fixes applied immediately
- Experiment vulnerabilities documented but may not block
- After choosing winning experiment, full remediation applied

## Response Timeline

- **Critical (Production):** 24 hours
- **High (Production):** 1 week
- **Critical (Dev/Experiments):** Documented, addressed post-discovery
- **Medium/Low:** Next sprint
```

#### 5b. Enable Private Vulnerability Reporting

```bash
# Enable for both repos
gh repo edit mq-studio/mq-studio-dev \
  --enable-vulnerability-alerts=true \
  --enable-automated-security-fixes=true

gh repo edit mq-studio/mq-studio-site \
  --enable-vulnerability-alerts=true \
  --enable-automated-security-fixes=true
```

**No conflict because:** Security policy clarifies discovery phase context

---

### 6. Create Security Status Badge (Optional but Recommended)

**Priority:** P2 (Low)
**Estimated Time:** 5 minutes

Add to README.md:

```markdown
## Security Status

[![npm audit](https://github.com/mq-studio/mq-studio-dev/actions/workflows/security-audit.yml/badge.svg)](https://github.com/mq-studio/mq-studio-dev/actions/workflows/security-audit.yml)

**Last Audit:** 2025-11-18
**Production Risk:** NEGLIGIBLE
**Status:** ✅ 0 critical, 9 dev/admin-only

See [VULNERABILITY_TRACKING.md](VULNERABILITY_TRACKING.md)
```

---

## ⏸️ DEFER Until After Discovery (Weeks 10+)

The following recommendations from `SECURITY_AUDIT_2025-11-18_STRUCTURAL_RECOMMENDATIONS.md` should be **deferred**:

### ❌ Do NOT Do Now (Conflicts with Discovery)

- **R2.1:** Documentation consolidation (active strategy docs in use)
- **R2.2:** Folder renaming (production baseline should stay frozen)
- **R3.1:** Full branching strategy (experiments need flexibility)
- **R4.1:** Formal staging environment (experiments ARE staging)
- **R4.3:** Environment variable centralization (each experiment may differ)

### ✅ Revisit After Discovery (Week 10)

Once you've chosen the winning experiment:
1. Review structural recommendations
2. Adapt recommendations to chosen tech stack
3. Consolidate infrastructure around winning approach
4. Implement formal staging, branching, etc.

---

## Execution Checklist

- [ ] 1. Push security fixes: `git push origin main`
- [ ] 2. Disable alerts on `mq-studio/website-mq-studio` (archived)
- [ ] 3. Add `.github/dependabot.yml` to `mq-studio-dev`
- [ ] 4. Add `.github/dependabot.yml` to `mq-studio-site`
- [ ] 5. Add `.github/workflows/security-audit.yml` to `mq-studio-dev`
- [ ] 6. Add `.github/SECURITY.md` to both repos
- [ ] 7. Enable private vulnerability reporting on both repos
- [ ] 8. (Optional) Add security status badge to README

**Estimated Total Time:** 45-60 minutes

---

## Notes for Discovery Phase

### Security During Experimentation (Weeks 1-10)

**Production (`mq-studio-site`):**
- ✅ Security fixes applied immediately
- ✅ Blocking CI/CD on critical issues
- ✅ Weekly audits

**Development (`mq-studio-dev`):**
- ✅ Security audits run (informational)
- ⚠️ Dev vulnerabilities documented but may not block
- ✅ Production vulnerabilities still block

**Experiments (future repos):**
- Each experiment documents its own dependencies
- Security audits informational only (won't block exploration)
- After choosing winner, apply full remediation

### Post-Discovery (Week 10+)

1. **Integration Week:**
   - Apply security fixes to winning experiment
   - Implement full structural recommendations
   - Create formal staging environment

2. **Production Deployment:**
   - Full security audit of integrated solution
   - Implement all deferred recommendations
   - Ongoing monitoring and weekly audits

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Review After:** Discovery phase completion (Week 10)
