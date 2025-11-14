#!/usr/bin/env node
/**
 * Content Validation Script
 *
 * Validates all content files (MDX and MD) for:
 * - Valid YAML frontmatter
 * - Required fields
 * - Correct date formats
 * - Valid category values
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const VALID_CATEGORIES = ['thinking', 'feeling', 'doing'];

// Statistics
const stats = {
  total: 0,
  valid: 0,
  errors: 0,
  warnings: 0,
};

/**
 * Extract frontmatter from content file
 */
function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return { error: 'No frontmatter found' };
  }

  try {
    const frontmatter = yaml.load(match[1]);
    return { frontmatter, raw: match[1] };
  } catch (err) {
    return { error: `YAML parsing error: ${err.message}` };
  }
}

/**
 * Validate frontmatter fields
 */
function validateFrontmatter(frontmatter, filePath) {
  const errors = [];
  const warnings = [];

  // Check required fields
  const requiredFields = ['title', 'date', 'slug'];
  requiredFields.forEach(field => {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate date format
  if (frontmatter.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(frontmatter.date)) {
      errors.push(`Invalid date format: ${frontmatter.date} (expected YYYY-MM-DD)`);
    } else {
      // Check if date is valid
      const date = new Date(frontmatter.date);
      if (isNaN(date.getTime())) {
        errors.push(`Invalid date value: ${frontmatter.date}`);
      }
    }
  }

  // Validate category
  if (frontmatter.category && !VALID_CATEGORIES.includes(frontmatter.category)) {
    errors.push(`Invalid category: ${frontmatter.category} (expected one of: ${VALID_CATEGORIES.join(', ')})`);
  }

  // Warnings for recommended fields
  const recommendedFields = ['excerpt', 'author', 'category'];
  recommendedFields.forEach(field => {
    if (!frontmatter[field]) {
      warnings.push(`Missing recommended field: ${field}`);
    }
  });

  // Validate slug matches filename
  const filename = path.basename(filePath, path.extname(filePath));
  if (frontmatter.slug && frontmatter.slug !== filename) {
    warnings.push(`Slug "${frontmatter.slug}" doesn't match filename "${filename}"`);
  }

  return { errors, warnings };
}

/**
 * Process a single file
 */
function validateFile(filePath) {
  const relativePath = path.relative(CONTENT_DIR, filePath);
  stats.total++;

  console.log(`\n${colors.blue}Checking:${colors.reset} ${relativePath}`);

  // Extract frontmatter
  const { frontmatter, error, raw } = extractFrontmatter(filePath);

  if (error) {
    stats.errors++;
    console.log(`  ${colors.red}✗ ${error}${colors.reset}`);
    return false;
  }

  // Validate frontmatter
  const { errors, warnings } = validateFrontmatter(frontmatter, filePath);

  // Report errors
  if (errors.length > 0) {
    stats.errors += errors.length;
    errors.forEach(err => {
      console.log(`  ${colors.red}✗ ${err}${colors.reset}`);
    });
  }

  // Report warnings
  if (warnings.length > 0) {
    stats.warnings += warnings.length;
    warnings.forEach(warn => {
      console.log(`  ${colors.yellow}⚠ ${warn}${colors.reset}`);
    });
  }

  // Success
  if (errors.length === 0) {
    stats.valid++;
    console.log(`  ${colors.green}✓ Valid${colors.reset}${warnings.length > 0 ? ` (${warnings.length} warnings)` : ''}`);
    return true;
  }

  return false;
}

/**
 * Recursively find all content files
 */
function findContentFiles(dir) {
  const files = [];

  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    });
  }

  walk(dir);
  return files;
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Content Validation${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.gray}Searching for content files in: ${CONTENT_DIR}${colors.reset}`);

  // Find all content files
  const files = findContentFiles(CONTENT_DIR);
  console.log(`${colors.gray}Found ${files.length} content files${colors.reset}`);

  if (files.length === 0) {
    console.log(`${colors.yellow}No content files found to validate${colors.reset}`);
    process.exit(0);
  }

  // Validate each file
  files.forEach(validateFile);

  // Print summary
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Validation Summary${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`Total files:    ${stats.total}`);
  console.log(`${colors.green}Valid files:    ${stats.valid}${colors.reset}`);
  console.log(`${colors.red}Errors:         ${stats.errors}${colors.reset}`);
  console.log(`${colors.yellow}Warnings:       ${stats.warnings}${colors.reset}`);

  // Exit with error code if there were errors
  if (stats.errors > 0) {
    console.log(`\n${colors.red}Validation failed with ${stats.errors} errors${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}All content files are valid!${colors.reset}`);
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFile, extractFrontmatter, validateFrontmatter };
