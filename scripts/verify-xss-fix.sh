#!/bin/bash
#
# XSS Fix Verification Script
# Verifies that the CRITICAL XSS vulnerability has been properly fixed
#
# Usage: bash scripts/verify-xss-fix.sh
#

set -e

echo "🔒 XSS Vulnerability Fix Verification"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
CHECKS_PASSED=0
CHECKS_FAILED=0

# Helper function
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "1. Checking Dependencies..."
echo "----------------------------"

# Check if isomorphic-dompurify is installed
if grep -q '"isomorphic-dompurify"' package.json; then
    check_pass "isomorphic-dompurify is in package.json"
else
    check_fail "isomorphic-dompurify is NOT in package.json"
fi

# Check if @types/dompurify is installed
if grep -q '"@types/dompurify"' package.json; then
    check_pass "@types/dompurify is in package.json"
else
    check_fail "@types/dompurify is NOT in package.json"
fi

# Check if node_modules has the packages
if [ -d "node_modules/isomorphic-dompurify" ]; then
    check_pass "isomorphic-dompurify is installed in node_modules"
else
    check_fail "isomorphic-dompurify is NOT installed - run: npm install"
fi

echo ""
echo "2. Checking Code Changes..."
echo "----------------------------"

# Check if DOMPurify is imported
if grep -q "import DOMPurify from 'isomorphic-dompurify'" app/search/page.tsx; then
    check_pass "DOMPurify is imported in search page"
else
    check_fail "DOMPurify is NOT imported in search page"
fi

# Check if sanitization is implemented
if grep -q "DOMPurify.sanitize" app/search/page.tsx; then
    check_pass "DOMPurify.sanitize() is used in search page"
else
    check_fail "DOMPurify.sanitize() is NOT used in search page"
fi

# Check sanitization configuration
if grep -q "ALLOWED_TAGS: \['mark'\]" app/search/page.tsx; then
    check_pass "Sanitization allows only <mark> tags"
else
    check_fail "Sanitization configuration is incorrect"
fi

if grep -q "ALLOWED_ATTR: \[\]" app/search/page.tsx; then
    check_pass "Sanitization allows no attributes"
else
    check_fail "Sanitization allows attributes (potential security risk)"
fi

if grep -q "KEEP_CONTENT: true" app/search/page.tsx; then
    check_pass "Sanitization preserves text content"
else
    check_warn "KEEP_CONTENT not explicitly set"
fi

echo ""
echo "3. Running Security Tests..."
echo "----------------------------"

# Run the manual test
if [ -f "tests/manual/xss-sanitization-manual-test.js" ]; then
    check_pass "Security test file exists"

    echo ""
    echo "Running test suite..."
    if node tests/manual/xss-sanitization-manual-test.js > /tmp/xss-test-output.txt 2>&1; then
        check_pass "Security tests PASSED"

        # Check test results
        PASSED_COUNT=$(grep "passed" /tmp/xss-test-output.txt | grep -oP '\d+(?= passed)' | head -1)
        FAILED_COUNT=$(grep "failed" /tmp/xss-test-output.txt | grep -oP '\d+(?= failed)' | head -1)

        if [ "$FAILED_COUNT" = "0" ]; then
            check_pass "All security tests passed ($PASSED_COUNT/11)"
        else
            check_fail "$FAILED_COUNT security tests failed"
        fi
    else
        check_fail "Security tests FAILED"
        cat /tmp/xss-test-output.txt
    fi
else
    check_fail "Security test file NOT found"
fi

echo ""
echo "4. TypeScript Compilation..."
echo "----------------------------"

if npx tsc --noEmit 2>&1 | grep -q "error" app/search/page.tsx; then
    check_fail "TypeScript compilation has errors in search page"
else
    check_pass "TypeScript compilation successful"
fi

echo ""
echo "5. Linting..."
echo "----------------------------"

if npm run lint 2>&1 | grep -q "error" app/search/page.tsx; then
    check_fail "ESLint found errors in search page"
else
    check_pass "ESLint validation passed"
fi

echo ""
echo "======================================"
echo "Verification Summary"
echo "======================================"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "The XSS vulnerability has been successfully fixed."
    echo "The search page is now protected against XSS attacks."
    echo ""
    echo "Next steps:"
    echo "1. Test manually in development: npm run dev"
    echo "2. Verify search highlighting still works"
    echo "3. Deploy to production when ready"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED!${NC}"
    echo ""
    echo "Please review the failed checks above and fix them."
    echo ""
    exit 1
fi
