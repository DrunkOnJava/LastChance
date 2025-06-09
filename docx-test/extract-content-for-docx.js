/**
 * Extract and simplify content from BMPOA HTML for DOCX conversion
 * This script runs in Node.js to process the HTML file
 */

const fs = require('fs');
const path = require('path');

// Read the original HTML file
const htmlContent = fs.readFileSync('bmpoa-print-optimized.html', 'utf8');

// Extract text content between specific markers
function extractContent(html) {
    // Remove scripts and styles
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Extract page content
    const pages = [];
    const pageRegex = /<div class="page"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="page"|$)/gi;
    let match;
    
    while ((match = pageRegex.exec(cleaned)) !== null) {
        const pageContent = match[1];
        // Extract content from page-content div
        const contentMatch = /<div class="page-content"[^>]*>([\s\S]*?)<\/div>\s*<div class="page-footer"/i.exec(pageContent);
        if (contentMatch) {
            pages.push(contentMatch[1]);
        }
    }
    
    return pages;
}

// Create simplified HTML structure
function createSimplifiedHTML(pages) {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blue Mountain Property Owners Association Community Guide</title>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; max-width: 8.5in; margin: 0 auto; }
        h1 { page-break-before: always; font-size: 24pt; }
        h2 { font-size: 18pt; color: #1e3a5f; margin-top: 24pt; }
        h3 { font-size: 14pt; color: #1e3a5f; }
        table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
        th, td { border: 1px solid #ddd; padding: 8pt; text-align: left; }
        th { background-color: #f0f0f0; }
        blockquote { margin: 12pt 0; padding: 12pt; border-left: 4pt solid #1e3a5f; background-color: #f5f5f5; }
    </style>
</head>
<body>
`;

    pages.forEach((page, index) => {
        if (index > 0) {
            html += '\n<div style="page-break-before: always;"></div>\n';
        }
        
        // Clean up the content
        let cleanedPage = page;
        
        // Remove complex divs
        cleanedPage = cleanedPage.replace(/<div class="[^"]*"[^>]*>/gi, '<div>');
        cleanedPage = cleanedPage.replace(/<div style="[^"]*"[^>]*>/gi, '<div>');
        
        // Convert custom classes to standard elements
        cleanedPage = cleanedPage.replace(/<div class="alert-box[^>]*>([\s\S]*?)<\/div>/gi, '<blockquote>$1</blockquote>');
        cleanedPage = cleanedPage.replace(/<div class="info-box[^>]*>([\s\S]*?)<\/div>/gi, '<blockquote>$1</blockquote>');
        cleanedPage = cleanedPage.replace(/<div class="contact-card[^>]*>([\s\S]*?)<\/div>/gi, '<p>$1</p>');
        
        // Remove empty divs
        cleanedPage = cleanedPage.replace(/<div>\s*<\/div>/gi, '');
        
        html += cleanedPage;
    });
    
    html += `
</body>
</html>`;
    
    return html;
}

// Process the document
console.log('Extracting content from BMPOA HTML...');
const pages = extractContent(htmlContent);
console.log(`Found ${pages.length} pages`);

const simplifiedHTML = createSimplifiedHTML(pages);

// Write the simplified HTML
fs.writeFileSync('bmpoa-extracted.html', simplifiedHTML);
console.log('Created: bmpoa-extracted.html');

// Create a metadata file for Pandoc
const metadata = `---
title: Blue Mountain Property Owners Association Community Guide
author: BMPOA Board of Directors
date: 2025
subject: Community Guide and Regulations
keywords: [BMPOA, Blue Mountain, Property Owners, Community Guide, Warren County, Virginia]
lang: en-US
toc: true
toc-title: Table of Contents
toc-depth: 3
papersize: letter
geometry: margin=1in
fontsize: 11pt
mainfont: Georgia
sansfont: Arial
monofont: Courier New
colorlinks: true
linkcolor: blue
urlcolor: blue
---

`;

fs.writeFileSync('metadata.yaml', metadata);
console.log('Created: metadata.yaml');

// Create conversion script
const conversionScript = `#!/bin/bash
echo "Converting BMPOA HTML to DOCX..."
pandoc bmpoa-extracted.html \\
  --metadata-file=metadata.yaml \\
  --reference-doc=../bmpoa-template.docx \\
  --toc \\
  --toc-depth=3 \\
  -o bmpoa-final.docx

echo "Conversion complete: bmpoa-final.docx"
`;

fs.writeFileSync('convert-final.sh', conversionScript);
fs.chmodSync('convert-final.sh', '755');
console.log('Created: convert-final.sh');

console.log('\nNext steps:');
console.log('1. Run: node extract-content-for-docx.js');
console.log('2. Run: ./convert-final.sh');
console.log('3. Open bmpoa-final.docx in Microsoft Word');