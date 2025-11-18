#!/bin/bash
# security-monitor.sh
# Local security monitoring script for quick checks during development
# Can be run manually or added to git hooks

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AUDIT_DIR="$PROJECT_ROOT/.security-audits"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

# Create audit directory if it doesn't exist
mkdir -p "$AUDIT_DIR"

echo -e "${BLUE}=== MQ Studio Security Monitor ===${NC}\n"

# 1. Check for npm vulnerabilities
echo -e "${BLUE}[1/6] Checking npm vulnerabilities...${NC}"
if npm audit --json > "$AUDIT_DIR/audit-$TIMESTAMP.json" 2>/dev/null; then
    TOTAL=$(jq '.metadata.vulnerabilities.total' "$AUDIT_DIR/audit-$TIMESTAMP.json")
    CRITICAL=$(jq '.metadata.vulnerabilities.critical' "$AUDIT_DIR/audit-$TIMESTAMP.json")
    HIGH=$(jq '.metadata.vulnerabilities.high' "$AUDIT_DIR/audit-$TIMESTAMP.json")
    
    if [ "$CRITICAL" -gt 0 ]; then
        echo -e "  ${RED}✗ CRITICAL: $CRITICAL critical vulnerabilities found!${NC}"
        echo -e "  ${RED}  Run: npm audit for details${NC}"
    elif [ "$HIGH" -gt 5 ]; then
        echo -e "  ${YELLOW}⚠ WARNING: $HIGH high vulnerabilities (baseline: ≤7)${NC}"
    else
        echo -e "  ${GREEN}✓ $TOTAL vulnerabilities (within acceptable baseline)${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ npm audit failed (expected if no node_modules)${NC}"
fi

# 2. Check for outdated dependencies
echo -e "\n${BLUE}[2/6] Checking outdated dependencies...${NC}"
if npm outdated --json > "$AUDIT_DIR/outdated-$TIMESTAMP.json" 2>/dev/null || true; then
    OUTDATED_COUNT=$(jq '. | length' "$AUDIT_DIR/outdated-$TIMESTAMP.json" 2>/dev/null || echo "0")
    if [ "$OUTDATED_COUNT" -gt 20 ]; then
        echo -e "  ${YELLOW}⚠ $OUTDATED_COUNT packages have updates available${NC}"
        echo -e "  ${YELLOW}  Run: npm outdated for details${NC}"
    elif [ "$OUTDATED_COUNT" -gt 0 ]; then
        echo -e "  ${GREEN}✓ $OUTDATED_COUNT packages have updates (reasonable)${NC}"
    else
        echo -e "  ${GREEN}✓ All dependencies up to date${NC}"
    fi
fi

# 3. Check for exposed secrets (requires git-secrets or grep patterns)
echo -e "\n${BLUE}[3/6] Checking for exposed secrets...${NC}"
if command -v git-secrets &> /dev/null; then
    if git secrets --scan 2>&1 | grep -q "WARN"; then
        echo -e "  ${RED}✗ Potential secrets detected!${NC}"
        echo -e "  ${RED}  Run: git secrets --scan for details${NC}"
    else
        echo -e "  ${GREEN}✓ No exposed secrets detected${NC}"
    fi
else
    # Fallback: basic grep patterns for common secrets
    PATTERNS=(
        "password.*=.*['\"].*['\"]"
        "api[_-]?key.*=.*['\"].*['\"]"
        "secret.*=.*['\"].*['\"]"
        "token.*=.*['\"].*['\"]"
        "AKIA[0-9A-Z]{16}"  # AWS Access Key
        "ghp_[a-zA-Z0-9]{36}"  # GitHub Personal Access Token
    )
    
    FOUND_SECRETS=false
    for pattern in "${PATTERNS[@]}"; do
        if git grep -E "$pattern" -- '*.js' '*.ts' '*.jsx' '*.tsx' '*.json' 2>/dev/null | grep -v node_modules | grep -q .; then
            echo -e "  ${RED}✗ Potential secret pattern found: $pattern${NC}"
            FOUND_SECRETS=true
        fi
    done
    
    if [ "$FOUND_SECRETS" = false ]; then
        echo -e "  ${GREEN}✓ No obvious secrets detected (install git-secrets for better scanning)${NC}"
    fi
fi

# 4. Check environment variables
echo -e "\n${BLUE}[4/6] Checking environment configuration...${NC}"
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo -e "  ${GREEN}✓ .env file exists${NC}"
    
    # Check if .env is in .gitignore
    if grep -q "^\.env$" "$PROJECT_ROOT/.gitignore" 2>/dev/null; then
        echo -e "  ${GREEN}✓ .env is in .gitignore${NC}"
    else
        echo -e "  ${RED}✗ .env is NOT in .gitignore!${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ No .env file (may be using Vercel env vars)${NC}"
fi

# 5. Check for TinaCMS updates
echo -e "\n${BLUE}[5/6] Checking TinaCMS version...${NC}"
if [ -f "$PROJECT_ROOT/package.json" ]; then
    CURRENT_TINA=$(jq -r '.dependencies.tinacms // .devDependencies.tinacms // "not installed"' "$PROJECT_ROOT/package.json")
    LATEST_TINA=$(npm view tinacms version 2>/dev/null || echo "unknown")
    
    if [ "$CURRENT_TINA" = "not installed" ]; then
        echo -e "  ${YELLOW}⚠ TinaCMS not found in package.json${NC}"
    elif [ "$CURRENT_TINA" = "$LATEST_TINA" ]; then
        echo -e "  ${GREEN}✓ TinaCMS $CURRENT_TINA (latest)${NC}"
    else
        echo -e "  ${YELLOW}⚠ TinaCMS $CURRENT_TINA (latest: $LATEST_TINA)${NC}"
        echo -e "  ${YELLOW}  Update may fix lodash.set, mermaid, or vite vulnerabilities${NC}"
    fi
fi

# 6. Check GitHub Actions status
echo -e "\n${BLUE}[6/6] Checking CI/CD security status...${NC}"
if command -v gh &> /dev/null && gh auth status &>/dev/null; then
    # Check if Dependabot is enabled
    DEPENDABOT_CONFIG="$PROJECT_ROOT/.github/dependabot.yml"
    if [ -f "$DEPENDABOT_CONFIG" ]; then
        echo -e "  ${GREEN}✓ Dependabot configured${NC}"
    else
        echo -e "  ${RED}✗ Dependabot not configured${NC}"
    fi
    
    # Check if security audit workflow exists
    SECURITY_WORKFLOW="$PROJECT_ROOT/.github/workflows/security-audit.yml"
    if [ -f "$SECURITY_WORKFLOW" ]; then
        echo -e "  ${GREEN}✓ Security audit workflow exists${NC}"
    else
        echo -e "  ${YELLOW}⚠ Security audit workflow not found${NC}"
    fi
    
    # Get latest workflow run status (requires gh cli and network)
    LATEST_RUN=$(gh run list --workflow=security-audit.yml --limit=1 --json conclusion --jq '.[0].conclusion' 2>/dev/null || echo "unknown")
    if [ "$LATEST_RUN" = "success" ]; then
        echo -e "  ${GREEN}✓ Latest security audit: passed${NC}"
    elif [ "$LATEST_RUN" = "failure" ]; then
        echo -e "  ${RED}✗ Latest security audit: FAILED${NC}"
        echo -e "  ${RED}  Check: gh run list --workflow=security-audit.yml${NC}"
    else
        echo -e "  ${YELLOW}⚠ Could not check workflow status (may need network)${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ GitHub CLI not authenticated (skipping CI checks)${NC}"
    echo -e "  ${YELLOW}  Run: gh auth login${NC}"
fi

# Summary
echo -e "\n${BLUE}=== Summary ===${NC}"
echo -e "Audit logs saved to: ${AUDIT_DIR}/"
echo -e "Latest audit: audit-$TIMESTAMP.json"
echo -e "\n${BLUE}Recommended actions:${NC}"
echo -e "  • Weekly: Run ${GREEN}npm audit${NC} and review results"
echo -e "  • Monthly: Run ${GREEN}npm outdated${NC} and update non-breaking dependencies"
echo -e "  • Quarterly: Full security review (see quarterly-security-review.yml)"
echo -e "  • Always: Keep TinaCMS updated for vulnerability patches"

# Exit code
if [ "$CRITICAL" -gt 0 ]; then
    echo -e "\n${RED}✗ Security check FAILED (critical vulnerabilities present)${NC}"
    exit 1
else
    echo -e "\n${GREEN}✓ Security check passed${NC}"
    exit 0
fi
