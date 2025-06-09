#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('=== BMPOA Document Test Results ===\n');

let passCount = 0;
let failCount = 0;
let warningCount = 0;

// Test 1: Page count
const pageCount = (htmlContent.match(/<div class="page"/g) || []).length;
if (pageCount <= 20) {
    passCount++;
    console.log(`✅ Page count: ${pageCount} (within target)`);
} else {
    warningCount++;
    console.log(`⚠️  Page count: ${pageCount} (exceeds target of 20)`);
}

// Test 2: Check for HTML syntax errors
const syntaxErrors = [];

// Check for unclosed tags in attributes
if (htmlContent.match(/<[^>]*<[^>]*>/)) {
    syntaxErrors.push('Found unclosed tags');
}

// Check for spans in wrong places
if (htmlContent.match(/<link[^>]*<span/)) {
    syntaxErrors.push('Found span tags inside link elements');
}

if (syntaxErrors.length === 0) {
    passCount++;
    console.log('✅ No HTML syntax errors detected');
} else {
    failCount++;
    console.log(`❌ HTML syntax errors: ${syntaxErrors.join(', ')}`);
}

// Test 3: CSS files loaded
const cssFiles = [
    'pagination-fixes.css',
    'fix-margin-violations.css',
    'pagination-ultra-fix.css',
    'critical-margin-fix.css'
];

let cssLoaded = 0;
cssFiles.forEach(file => {
    if (htmlContent.includes(file)) {
        cssLoaded++;
    }
});

if (cssLoaded === cssFiles.length) {
    passCount++;
    console.log(`✅ All ${cssFiles.length} CSS optimization files loaded`);
} else {
    warningCount++;
    console.log(`⚠️  Only ${cssLoaded}/${cssFiles.length} CSS files loaded`);
}

// Test 4: Check overflow protection
const overflowProtection = (htmlContent.match(/overflow:\s*hidden/g) || []).length;
if (overflowProtection > 50) {
    passCount++;
    console.log(`✅ Overflow protection applied (${overflowProtection} instances)`);
} else {
    warningCount++;
    console.log(`⚠️  Limited overflow protection (${overflowProtection} instances)`);
}

// Test 5: Check for problematic styles
const problematicStyles = {
    'position: absolute': (htmlContent.match(/position:\s*absolute/g) || []).length,
    'negative margins': (htmlContent.match(/margin.*:\s*-\d+px/g) || []).length,
    'fixed widths > 100%': (htmlContent.match(/width:\s*[1-9]\d{2,}%/g) || []).filter(m => !m.includes('100%')).length
};

let styleIssues = 0;
Object.entries(problematicStyles).forEach(([style, count]) => {
    if (count > 0) {
        styleIssues += count;
        console.log(`⚠️  Found ${count} instances of ${style}`);
    }
});

if (styleIssues === 0) {
    passCount++;
    console.log('✅ No problematic styles found');
} else {
    warningCount++;
}

// Test 6: Image checks
const images = htmlContent.match(/<img[^>]*>/g) || [];
const imagesWithAlt = htmlContent.match(/<img[^>]*alt="[^"]+"/g) || [];

if (images.length === imagesWithAlt.length) {
    passCount++;
    console.log(`✅ All ${images.length} images have alt attributes`);
} else {
    warningCount++;
    console.log(`⚠️  ${images.length - imagesWithAlt.length} images missing alt attributes`);
}

// Test 7: Check for broken class references
const classReferences = htmlContent.match(/class="([^"]+)"/g) || [];
const uniqueClasses = new Set();
classReferences.forEach(ref => {
    const classes = ref.match(/class="([^"]+)"/)[1].split(' ');
    classes.forEach(cls => uniqueClasses.add(cls));
});

console.log(`\n📊 Found ${uniqueClasses.size} unique CSS classes used`);

// Summary
console.log('\n=== TEST SUMMARY ===');
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`⚠️  Warnings: ${warningCount}`);

const total = passCount + failCount + warningCount;
const score = Math.round((passCount / total) * 100);
console.log(`\nOverall Score: ${score}%`);

if (failCount === 0) {
    console.log('\n🎉 All critical tests passed!');
} else {
    console.log('\n⚠️  Critical issues need attention');
}

// Save test results
const results = {
    timestamp: new Date(),
    pageCount,
    tests: {
        passed: passCount,
        failed: failCount,
        warnings: warningCount
    },
    score
};

fs.writeFileSync(
    path.join(__dirname, 'test-results.json'),
    JSON.stringify(results, null, 2)
);

console.log('\nTest results saved to test-results.json');