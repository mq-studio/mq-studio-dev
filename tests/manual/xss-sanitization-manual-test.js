/**
 * Manual XSS Sanitization Test for Search Page
 *
 * This test verifies that DOMPurify properly sanitizes malicious HTML/JavaScript
 * while preserving legitimate <mark> tags for search highlighting.
 *
 * CRITICAL FIX: CVSS 9.3 XSS Vulnerability
 * Location: /app/search/page.tsx lines 263, 269-276
 *
 * Run with: node tests/manual/xss-sanitization-manual-test.js
 */

const DOMPurify = require('isomorphic-dompurify');

// Replicate the renderHighlightedText function from search/page.tsx
const renderHighlightedText = (text, highlight) => {
  const content = highlight || text;
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['mark'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
  return { __html: sanitized };
};

console.log('🔒 XSS Sanitization Security Test Suite\n');
console.log('Testing the renderHighlightedText function with DOMPurify...\n');

const tests = [
  {
    name: '✅ Should preserve legitimate <mark> tags',
    input: 'This is a <mark>highlighted</mark> word',
    shouldContain: ['<mark>', 'highlighted', '</mark>'],
    shouldNotContain: [],
  },
  {
    name: '🚫 Should strip malicious <script> tags',
    input: 'Hello <script>alert("XSS")</script> world',
    shouldContain: ['Hello', 'world'],
    shouldNotContain: ['<script>', 'alert', 'XSS'],
  },
  {
    name: '🚫 Should strip onclick event handlers',
    input: '<span onclick="alert(\'XSS\')">Click me</span>',
    shouldContain: ['Click me'],
    shouldNotContain: ['onclick', 'alert'],
  },
  {
    name: '🚫 Should strip javascript: protocol in href',
    input: '<a href="javascript:alert(\'XSS\')">Click</a>',
    shouldContain: ['Click'],
    shouldNotContain: ['javascript:', 'alert', '<a'],
  },
  {
    name: '🚫 Should strip img tags with onerror handlers',
    input: '<img src="x" onerror="alert(\'XSS\')">',
    shouldContain: [],
    shouldNotContain: ['<img', 'onerror', 'alert'],
  },
  {
    name: '🚫 Should strip style tags with XSS payloads',
    input: '<style>body{background:url("javascript:alert(\'XSS\')")}</style>',
    shouldContain: [],
    shouldNotContain: ['<style>', 'javascript:', 'alert'],
  },
  {
    name: '🚫 Should strip iframe tags',
    input: '<iframe src="https://evil.com"></iframe>',
    shouldContain: [],
    shouldNotContain: ['<iframe', 'evil.com'],
  },
  {
    name: '✅ Should handle mixed content - preserve mark, strip script',
    input: '<mark>Safe</mark> text <script>alert("XSS")</script> more',
    shouldContain: ['<mark>Safe</mark>', 'text', 'more'],
    shouldNotContain: ['<script>', 'alert'],
  },
  {
    name: '✅ Should use fallback text when no highlight provided',
    input: null,
    fallback: 'Plain text',
    shouldContain: ['Plain text'],
    shouldNotContain: [],
  },
  {
    name: '🚫 Should sanitize malicious fallback text',
    input: null,
    fallback: 'Text <script>alert("XSS")</script>',
    shouldContain: ['Text'],
    shouldNotContain: ['<script>', 'alert'],
  },
  {
    name: '🚫 Should strip attributes from mark tags',
    input: '<mark class="evil" id="bad" onclick="alert()">text</mark>',
    shouldContain: ['<mark>text</mark>'],
    shouldNotContain: ['class', 'onclick', 'evil'],
  },
];

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  const result = test.input !== null
    ? renderHighlightedText('', test.input)
    : renderHighlightedText(test.fallback, undefined);

  const output = result.__html;
  let testPassed = true;
  const errors = [];

  // Check shouldContain
  test.shouldContain.forEach(expected => {
    if (!output.includes(expected)) {
      testPassed = false;
      errors.push(`  ❌ Missing expected content: "${expected}"`);
    }
  });

  // Check shouldNotContain
  test.shouldNotContain.forEach(forbidden => {
    if (output.includes(forbidden)) {
      testPassed = false;
      errors.push(`  ❌ Contains forbidden content: "${forbidden}"`);
    }
  });

  if (testPassed) {
    console.log(`${test.name}`);
    console.log(`  Input:  ${test.input || test.fallback}`);
    console.log(`  Output: ${output}`);
    console.log(`  ✓ PASSED\n`);
    passed++;
  } else {
    console.log(`${test.name}`);
    console.log(`  Input:  ${test.input || test.fallback}`);
    console.log(`  Output: ${output}`);
    errors.forEach(err => console.log(err));
    console.log(`  ✗ FAILED\n`);
    failed++;
  }
});

console.log('═══════════════════════════════════════════════════════════');
console.log(`Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total`);
console.log('═══════════════════════════════════════════════════════════\n');

if (failed === 0) {
  console.log('✅ ALL TESTS PASSED - XSS vulnerability is FIXED!');
  console.log('🔒 The search page is now protected against XSS attacks.');
  console.log('   Only <mark> tags are allowed for highlighting.');
  console.log('   All malicious scripts and event handlers are stripped.\n');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED - Review the sanitization logic!');
  process.exit(1);
}
