#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'bmpoa-print-optimized.html'), 'utf8');

// Count pages
const pageMatches = htmlContent.match(/class="page"/g);
const pageCount = pageMatches ? pageMatches.length : 0;

// Count content blocks
const contentMatches = htmlContent.match(/class="page-content"/g);
const contentCount = contentMatches ? contentMatches.length : 0;

// Check for overflow indicators
const overflowWarnings = htmlContent.match(/overflow|orphan|widow/gi);
const warningCount = overflowWarnings ? overflowWarnings.length : 0;

// Check pagination scripts
const hasPaginationFix = htmlContent.includes('auto-pagination.js');
const hasPaginationCSS = htmlContent.includes('pagination-fixes.css');
const hasDynamicFix = htmlContent.includes('pagination-auto-fix.js');

console.log('=== BMPOA Document Status ===');
console.log(`Total Pages: ${pageCount}`);
console.log(`Content Sections: ${contentCount}`);
console.log(`Overflow Warnings in HTML: ${warningCount}`);
console.log('\n=== Pagination Fixes Applied ===');
console.log(`Auto-pagination script: ${hasPaginationFix ? '✓' : '✗'}`);
console.log(`Pagination CSS fixes: ${hasPaginationCSS ? '✓' : '✗'}`);
console.log(`Dynamic fix script: ${hasDynamicFix ? '✓' : '✗'}`);

// Check for specific problem areas mentioned
const problemAreas = [
    { pattern: /<h[1-6][^>]*>(?!.*page-break-before).*Emergency/i, name: 'Emergency section headers' },
    { pattern: /<table[^>]*>(?!.*page-break-inside:\s*avoid)/i, name: 'Tables without break protection' },
    { pattern: /page \d+[^>]*>\s*<\/div>/i, name: 'Empty pages' }
];

console.log('\n=== Potential Issues ===');
problemAreas.forEach(({ pattern, name }) => {
    const matches = htmlContent.match(pattern);
    if (matches) {
        console.log(`⚠️  ${name}: ${matches.length} instances found`);
    } else {
        console.log(`✓ ${name}: None found`);
    }
});

// Summary
console.log('\n=== Summary ===');
if (pageCount <= 20) {
    console.log(`✓ Document fits in ${pageCount} pages (target: 20)`);
} else {
    console.log(`⚠️  Document has ${pageCount} pages (exceeds target of 20)`);
}