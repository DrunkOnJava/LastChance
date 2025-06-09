#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('=== BMPOA PAGINATION ANALYSIS ===\n');

// Count pages
const pageMatches = htmlContent.match(/<div[^>]+class="page"[^>]*>/g) || [];
console.log(`Total pages found: ${pageMatches.length}`);

// Analyze each page
console.log('\n=== PAGE-BY-PAGE ANALYSIS ===');
const pages = htmlContent.split('<div class="page"');

pages.forEach((pageContent, index) => {
    if (index === 0) return; // Skip before first page
    
    // Extract page attributes
    const templateMatch = pageContent.match(/data-template="([^"]+)"/);
    const template = templateMatch ? templateMatch[1] : 'content';
    
    // Count content indicators
    const textLength = pageContent.replace(/<[^>]*>/g, '').trim().length;
    const imageCount = (pageContent.match(/<img/g) || []).length;
    const tableCount = (pageContent.match(/<table/g) || []).length;
    const headerCount = (pageContent.match(/<h[1-6]/g) || []).length;
    
    // Determine if page is sparse
    const isSparse = textLength < 500 && imageCount === 0;
    
    console.log(`\nPage ${index}:`);
    console.log(`  Template: ${template}`);
    console.log(`  Text length: ${textLength} chars`);
    console.log(`  Images: ${imageCount}`);
    console.log(`  Tables: ${tableCount}`);
    console.log(`  Headers: ${headerCount}`);
    if (isSparse) console.log(`  ⚠️  SPARSE PAGE - candidate for merging`);
});

// Find specific issues
console.log('\n=== SPECIFIC ISSUES ===');

// Check for orphaned headers
const orphanedHeaders = htmlContent.match(/<h[1-6][^>]*>[^<]+<\/h[1-6]>\s*<\/div>\s*<\/div>/g) || [];
console.log(`\nOrphaned headers: ${orphanedHeaders.length}`);
orphanedHeaders.forEach(header => {
    const text = header.match(/>([^<]+)</)[1];
    console.log(`  - "${text.trim()}"`);
});

// Check for excessive spacing
const largeSpacingCount = (htmlContent.match(/margin-(top|bottom):\s*[2-9]\d+px/g) || []).length;
console.log(`\nElements with large spacing (20px+): ${largeSpacingCount}`);

// Create optimization CSS
const optimizationCSS = `/* Ultra-Aggressive Pagination Fix for 20-page target */

/* Global resets */
* {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
}

/* Base typography - extremely compact */
body {
    font-size: 10pt !important;
    line-height: 1.2 !important;
}

/* Headings - minimal spacing */
h1 { 
    font-size: 16pt !important; 
    margin: 0.3em 0 0.2em 0 !important;
    page-break-after: avoid !important;
}

h2 { 
    font-size: 14pt !important; 
    margin: 0.25em 0 0.15em 0 !important;
    page-break-after: avoid !important;
}

h3 { 
    font-size: 12pt !important; 
    margin: 0.2em 0 0.1em 0 !important;
    page-break-after: avoid !important;
}

/* Paragraphs - tight spacing */
p {
    margin: 0 0 0.3em 0 !important;
    text-align: justify !important;
}

/* Lists - compact */
ul, ol {
    margin: 0.2em 0 0.3em 1.2em !important;
}

li {
    margin: 0 0 0.1em 0 !important;
}

/* Tables - space-saving */
table {
    font-size: 9pt !important;
    margin: 0.3em 0 !important;
    width: 100% !important;
}

th, td {
    padding: 0.15em 0.3em !important;
}

/* Images - constrained */
img {
    max-height: 150px !important;
    width: auto !important;
    margin: 0.2em auto !important;
    display: block !important;
}

/* Alert boxes - minimal */
.alert-box, .info-box, .warning-box {
    padding: 0.3em 0.5em !important;
    margin: 0.3em 0 !important;
    font-size: 9pt !important;
}

/* Page layout - maximized */
.page {
    padding: 0 !important;
}

.page-content {
    padding: 0.5in !important;
    margin: 0 !important;
}

/* Remove all decorative elements */
.divider, .separator, .spacer,
.decorative, .page-decoration {
    display: none !important;
}

/* Multi-column for appropriate content */
.amenity-list, .service-list,
.contact-list {
    column-count: 2 !important;
    column-gap: 0.5em !important;
}

/* Hide page numbers on screen, show in print */
@media screen {
    .page-number { display: none !important; }
}

@media print {
    .page {
        height: 11in !important;
        width: 8.5in !important;
        margin: 0 !important;
        padding: 0 !important;
        page-break-after: always !important;
    }
    
    .page-content {
        height: calc(11in - 1in) !important;
        width: calc(8.5in - 1in) !important;
        overflow: hidden !important;
    }
    
    /* Force keep together */
    .keep-together {
        page-break-inside: avoid !important;
    }
    
    /* Emergency section special handling */
    .emergency-section {
        page-break-before: always !important;
    }
}`;

// Write optimization CSS
fs.writeFileSync(
    path.join(__dirname, 'pagination-ultra-fix.css'),
    optimizationCSS
);

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. Created pagination-ultra-fix.css with aggressive spacing reduction');
console.log('2. Merge sparse pages where content < 500 characters');
console.log('3. Use multi-column layout for lists and contacts');
console.log('4. Reduce image sizes to max 150px height');
console.log('5. Consider moving detailed regulations to appendix or separate document');

// Calculate estimated savings
const sparsePages = pages.filter((p, i) => {
    if (i === 0) return false;
    const textLength = p.replace(/<[^>]*>/g, '').trim().length;
    return textLength < 500;
}).length;

const estimatedPages = pageMatches.length - Math.floor(sparsePages * 0.7);
console.log(`\n=== ESTIMATED RESULT ===`);
console.log(`Current pages: ${pageMatches.length}`);
console.log(`Sparse pages that can be merged: ${sparsePages}`);
console.log(`Estimated final pages: ${estimatedPages}`);

if (estimatedPages <= 20) {
    console.log(`✅ Target of 20 pages is achievable!`);
} else {
    console.log(`⚠️  Need to remove ${estimatedPages - 20} more pages of content`);
}