#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('Applying ultra-aggressive pagination fixes...\n');

// 1. Add the ultra-fix CSS reference if not already present
if (!htmlContent.includes('pagination-ultra-fix.css')) {
    htmlContent = htmlContent.replace(
        '<link rel="stylesheet" href="pagination-fixes.css">',
        '<link rel="stylesheet" href="pagination-fixes.css">\n    <link rel="stylesheet" href="pagination-ultra-fix.css">'
    );
    console.log('✓ Added pagination-ultra-fix.css reference');
}

// 2. Remove excessive margins and padding inline styles
const styleReplacements = [
    // Large margins
    [/margin-(top|bottom):\s*[3-9]\d+px/g, 'margin-$1: 10px'],
    [/margin-(top|bottom):\s*[2]\d+px/g, 'margin-$1: 10px'],
    [/padding-(top|bottom):\s*[3-9]\d+px/g, 'padding-$1: 10px'],
    [/padding-(top|bottom):\s*[2]\d+px/g, 'padding-$1: 10px'],
    
    // Line height
    [/line-height:\s*1\.[6-9]/g, 'line-height: 1.3'],
    [/line-height:\s*[2-9]/g, 'line-height: 1.3'],
    
    // Font sizes
    [/font-size:\s*[2-9]\dpt/g, 'font-size: 12pt'],
    [/font-size:\s*1[8-9]pt/g, 'font-size: 14pt'],
];

styleReplacements.forEach(([pattern, replacement]) => {
    const matches = htmlContent.match(pattern);
    if (matches) {
        htmlContent = htmlContent.replace(pattern, replacement);
        console.log(`✓ Replaced ${matches.length} instances of ${pattern.source}`);
    }
});

// 3. Add keep-together classes to important elements
const keepTogetherElements = [
    ['<table', '<table class="keep-together"'],
    ['<div class="alert-box"', '<div class="alert-box keep-together"'],
    ['<div class="info-box"', '<div class="info-box keep-together"'],
    ['<div class="warning-box"', '<div class="warning-box keep-together"'],
];

keepTogetherElements.forEach(([search, replace]) => {
    if (!search.includes('keep-together')) {
        const count = (htmlContent.match(new RegExp(search, 'g')) || []).length;
        htmlContent = htmlContent.replace(new RegExp(search, 'g'), replace);
        console.log(`✓ Added keep-together to ${count} ${search} elements`);
    }
});

// 4. Merge consecutive short pages
console.log('\nAnalyzing pages for merging...');
const pages = htmlContent.split('<div class="page"');
const mergedPages = [pages[0]]; // Keep everything before first page

for (let i = 1; i < pages.length; i++) {
    const currentPage = pages[i];
    const textLength = currentPage.replace(/<[^>]*>/g, '').trim().length;
    const hasImages = currentPage.includes('<img');
    const isCoverOrTOC = currentPage.includes('data-template="cover"') || 
                         currentPage.includes('data-template="toc"');
    const isChapterStart = currentPage.includes('data-template="chapter-start"');
    
    // Don't merge special pages
    if (isCoverOrTOC || isChapterStart || hasImages || textLength > 2000) {
        mergedPages.push('<div class="page"' + currentPage);
        continue;
    }
    
    // Check if we can merge with previous page
    if (i > 1 && textLength < 1000 && mergedPages.length > 1) {
        const lastPage = mergedPages[mergedPages.length - 1];
        const lastPageText = lastPage.replace(/<[^>]*>/g, '').trim().length;
        
        if (lastPageText < 2000 && !lastPage.includes('data-template=')) {
            console.log(`  Merging page ${i} (${textLength} chars) with previous page`);
            // Extract content from current page
            const contentMatch = currentPage.match(/<div class="page-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
            if (contentMatch) {
                const content = contentMatch[1];
                // Insert before closing tags of previous page
                mergedPages[mergedPages.length - 1] = lastPage.replace(
                    '</div>\n    </div>',
                    '\n' + content + '\n</div>\n    </div>'
                );
                continue;
            }
        }
    }
    
    mergedPages.push('<div class="page"' + currentPage);
}

htmlContent = mergedPages.join('');

// 5. Write the optimized file
const outputPath = path.join(__dirname, 'bmpoa-print-optimized-ultra.html');
fs.writeFileSync(outputPath, htmlContent);

// Count final pages
const finalPageCount = (htmlContent.match(/<div class="page"/g) || []).length;

console.log('\n=== OPTIMIZATION COMPLETE ===');
console.log(`Original pages: 33`);
console.log(`Final pages: ${finalPageCount}`);
console.log(`Pages saved: ${33 - finalPageCount}`);
console.log(`\nOutput saved to: bmpoa-print-optimized-ultra.html`);

if (finalPageCount <= 20) {
    console.log('\n✅ SUCCESS: Document now fits within 20-page target!');
} else {
    console.log(`\n⚠️  Still need to reduce by ${finalPageCount - 20} pages`);
    console.log('Consider:');
    console.log('  - Moving detailed lists to appendix');
    console.log('  - Combining similar sections');
    console.log('  - Using QR codes for online resources');
}