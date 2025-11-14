#!/usr/bin/env node

/**
 * Smart TinaCMS Build Script
 *
 * This script intelligently handles TinaCMS builds based on available credentials:
 * - If TinaCMS Cloud credentials are available, runs full tinacms build
 * - If no credentials, skips TinaCMS build (uses local file mode)
 * - Provides clear feedback about which mode is being used
 *
 * This enables flexible deployment across environments:
 * - Local development: Works without credentials
 * - Staging/Production: Uses TinaCMS Cloud when configured
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkTinaCredentials() {
  // Check for TinaCMS Cloud credentials in environment
  const hasClientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
  const hasToken = process.env.TINA_TOKEN;

  return {
    configured: !!(hasClientId && hasToken),
    clientId: hasClientId,
    token: hasToken
  };
}

function buildTinaCMS() {
  log('\n╔════════════════════════════════════════════╗', 'cyan');
  log('║     TinaCMS Build Configuration Check     ║', 'cyan');
  log('╚════════════════════════════════════════════╝\n', 'cyan');

  const credentials = checkTinaCredentials();

  if (credentials.configured) {
    log('✓ TinaCMS Cloud credentials detected', 'green');
    log('  Mode: Cloud-connected CMS', 'blue');
    log('  Building TinaCMS admin interface...\n', 'blue');

    try {
      execSync('tinacms build', {
        stdio: 'inherit',
        env: process.env
      });
      log('\n✓ TinaCMS build completed successfully', 'green');
      return true;
    } catch (error) {
      log('\n✗ TinaCMS build failed', 'yellow');
      log('  Continuing with Next.js build...', 'yellow');
      log('  (Admin panel may not be available)\n', 'yellow');
      return false;
    }
  } else {
    log('ℹ No TinaCMS Cloud credentials found', 'yellow');
    log('  Mode: Local file-based CMS', 'blue');
    log('  Skipping TinaCMS build (not required for deployment)', 'blue');
    log('\n  To enable TinaCMS Cloud:', 'cyan');
    log('  1. Sign up at https://app.tina.io', 'cyan');
    log('  2. Set environment variables:', 'cyan');
    log('     - NEXT_PUBLIC_TINA_CLIENT_ID', 'cyan');
    log('     - TINA_TOKEN', 'cyan');
    log('\n  Proceeding with Next.js build...\n', 'blue');
    return true;
  }
}

// Main execution
try {
  const success = buildTinaCMS();
  process.exit(success ? 0 : 0); // Always exit 0 to continue build
} catch (error) {
  log('\n✗ Unexpected error in TinaCMS build script', 'yellow');
  log(`  ${error.message}`, 'yellow');
  log('  Continuing with Next.js build...\n', 'yellow');
  process.exit(0); // Continue build even on error
}
