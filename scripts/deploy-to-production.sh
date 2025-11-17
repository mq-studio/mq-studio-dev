#!/bin/bash
#
# Production Deployment Script for MQ Studio
# Automates deployment to Hostinger VPS
#
# Usage: ./scripts/deploy-to-production.sh [--skip-tests]
#
# What this script does:
# 1. Runs pre-deployment checks (lint, tests, build)
# 2. Pushes to production GitHub repository
# 3. SSHs to VPS and deploys the application
# 4. Verifies deployment success
#
# Prerequisites:
# - SSH key authentication configured to VPS
# - VPS IP address set in config
# - PM2 running on VPS
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_USER="${VPS_USER:-mqstudio}"
VPS_IP="${VPS_IP:-}"  # Set this via environment variable or edit here
APP_DIR="${VPS_APP_DIR:-~/apps/mq-studio-dev}"
PM2_APP_NAME="${PM2_APP_NAME:-mq-studio}"

# Parse arguments
SKIP_TESTS=false
for arg in "$@"; do
  case $arg in
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
  esac
done

# Functions
print_header() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

check_vps_config() {
  if [ -z "$VPS_IP" ]; then
    print_error "VPS_IP not set!"
    echo ""
    echo "Please set VPS_IP environment variable:"
    echo "  export VPS_IP=YOUR_VPS_IP_ADDRESS"
    echo ""
    echo "Or edit this script and set VPS_IP at the top."
    exit 1
  fi
}

# Main deployment process
main() {
  print_header "MQ Studio Production Deployment"

  echo -e "${BLUE}Target:${NC} $VPS_USER@$VPS_IP"
  echo -e "${BLUE}Date:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""

  # Check VPS configuration
  print_header "Step 1: Checking Configuration"
  check_vps_config
  print_success "VPS configuration valid"

  # Pre-deployment checks
  print_header "Step 2: Pre-Deployment Checks"

  echo "Checking git status..."
  if [[ -n $(git status -s) ]]; then
    print_warning "Uncommitted changes detected"
    git status -s
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      print_error "Deployment cancelled"
      exit 1
    fi
  else
    print_success "Working directory clean"
  fi

  # Run tests (unless skipped)
  if [ "$SKIP_TESTS" = false ]; then
    print_header "Step 3: Running Tests"

    echo "Running ESLint..."
    if npm run lint > /dev/null 2>&1; then
      print_success "ESLint passed"
    else
      print_warning "ESLint warnings detected (continuing)"
    fi

    echo "Running TypeScript check..."
    if npx tsc --noEmit; then
      print_success "TypeScript check passed"
    else
      print_error "TypeScript errors detected"
      read -p "Continue anyway? (y/N): " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
      fi
    fi

    echo "Running production build test..."
    if npm run build > /dev/null 2>&1; then
      print_success "Production build successful"
    else
      print_error "Production build failed"
      echo ""
      echo "Build output:"
      npm run build
      exit 1
    fi
  else
    print_warning "Skipping tests (--skip-tests flag)"
  fi

  # Push to production repository
  print_header "Step 4: Pushing to Production Repository"

  echo "Fetching latest from production..."
  git fetch production

  echo "Current branch: $(git branch --show-current)"
  read -p "Push to production? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled"
    exit 1
  fi

  echo "Pushing to production remote..."
  if git push production main; then
    print_success "Pushed to mq-studio-site repository"
  else
    print_error "Failed to push to production"
    exit 1
  fi

  # Deploy to VPS
  print_header "Step 5: Deploying to VPS"

  echo "Connecting to $VPS_USER@$VPS_IP..."

  # SSH and deploy
  ssh -t "$VPS_USER@$VPS_IP" << 'ENDSSH'
    set -e

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Deploying on VPS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Navigate to app directory
    echo "Navigating to app directory..."
    cd ~/apps/mq-studio-dev

    # Pull latest code
    echo "Pulling latest code from production repository..."
    git pull origin main

    # Check if package.json changed
    if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
      echo "package.json changed, installing dependencies..."
      npm install
    else
      echo "No dependency changes detected"
    fi

    # Build application
    echo "Building application..."
    npm run build

    # Restart PM2
    echo "Restarting PM2 process..."
    pm2 restart mq-studio

    # Wait for app to start
    echo "Waiting for application to start..."
    sleep 3

    # Check PM2 status
    echo "Checking PM2 status..."
    pm2 list

    echo ""
    echo "✓ Deployment complete on VPS!"
ENDSSH

  print_success "VPS deployment complete"

  # Verification
  print_header "Step 6: Verification"

  echo "Checking application logs..."
  ssh "$VPS_USER@$VPS_IP" "pm2 logs $PM2_APP_NAME --lines 20 --nostream"

  echo ""
  print_success "Deployment successful!"
  echo ""
  echo "Next steps:"
  echo "1. Visit https://mouraquayle.ca to verify"
  echo "2. Test critical functionality"
  echo "3. Monitor PM2 logs: ssh $VPS_USER@$VPS_IP 'pm2 logs $PM2_APP_NAME'"
  echo ""
}

# Run main function
main "$@"
