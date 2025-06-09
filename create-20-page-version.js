#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Read the full document
const fullDocument = fs.readFileSync('/Users/griffin/Projects/LastChance/bmpoa-print-optimized.html', 'utf8');

// Define which pages to keep (first 20 pages that contain essential information)
const pagesToKeep = [
    'Cover Page',
    'Table of Contents', 
    'Welcome Letter',
    'Governance & Board',
    'Emergency Contacts',
    'Fire Safety',
    'Community Regulations',
    'Building Guidelines',
    'Property Use',
    'Vehicle Rules',
    'Community Amenities',
    'Services & Utilities',
    'Local Resources',
    'Wildlife Safety',
    'Community Events',
    'Contact Directory',
    'Maps & Directions',
    'Important Forms',
    'Quick Reference',
    'Back Cover'
];

console.log('📄 Analyzing document structure...');

// Split document into pages
const pages = fullDocument.split(/<div class="page"/);
console.log(`Found ${pages.length - 1} total pages`);

// Keep header and first 20 pages
const header = pages[0];
const selectedPages = pages.slice(1, 21); // Keep first 20 pages

console.log('✂️  Creating condensed version...');

// Reconstruct document with selected pages
let condensedHTML = header;

selectedPages.forEach((page, index) => {
    // Add back the page div tag that was removed by split
    condensedHTML += '<div class="page"' + page;
});

// Add closing body and html tags if needed
if (!condensedHTML.includes('</body>')) {
    condensedHTML += '\n</body>\n</html>';
}

// Clean up any broken references to non-existent pages
condensedHTML = condensedHTML.replace(/see page ([2-9][0-9]|[3-9][0-9])/g, 'see appendix');
condensedHTML = condensedHTML.replace(/page ([2-9][0-9]|[3-9][0-9])/g, 'appendix');

// Update TOC to reflect 20 pages
condensedHTML = condensedHTML.replace(/Pages: 33/g, 'Pages: 20');
condensedHTML = condensedHTML.replace(/33 pages/g, '20 pages');

// Save the condensed version
const outputPath = '/Users/griffin/Projects/LastChance/bmpoa-20-pages.html';
fs.writeFileSync(outputPath, condensedHTML);

console.log(`✅ Created 20-page version: ${outputPath}`);
console.log(`📊 Reduced from ${pages.length - 1} pages to 20 pages`);
console.log('🎯 Ready for production deployment');