#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('Fixing margin violations in BMPOA document...\n');

// 1. Fix inline styles that might cause overflow
const inlineStyleFixes = [
    // Remove absolute positioning that might push content out
    [/position:\s*absolute;?/gi, 'position: relative;'],
    
    // Fix negative margins
    [/margin(-left|-right):\s*-\d+px/gi, 'margin$1: 0'],
    
    // Constrain widths over 100%
    [/width:\s*\d{3,}%/gi, 'width: 100%'],
    [/width:\s*[1-9]\d{2,}px/gi, 'width: 100%'],
    
    // Remove left/right positioning
    [/left:\s*-?\d+px/gi, 'left: 0'],
    [/right:\s*-?\d+px/gi, 'right: 0'],
    
    // Fix large paddings
    [/padding(-left|-right):\s*[4-9]\d+px/gi, 'padding$1: 20px'],
    
    // Constrain min-width
    [/min-width:\s*[5-9]\d{2,}px/gi, 'min-width: auto'],
];

let fixCount = 0;
inlineStyleFixes.forEach(([pattern, replacement]) => {
    const matches = htmlContent.match(pattern) || [];
    if (matches.length > 0) {
        htmlContent = htmlContent.replace(pattern, replacement);
        fixCount += matches.length;
        console.log(`Fixed ${matches.length} instances of ${pattern.source}`);
    }
});

// 2. Add overflow protection to all pages
htmlContent = htmlContent.replace(
    /<div class="page"/g,
    '<div class="page" style="overflow: hidden;"'
);

// 3. Wrap long text content
// Find and wrap email addresses
htmlContent = htmlContent.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<span style="word-break: break-all;">$1</span>'
);

// Find and wrap URLs
htmlContent = htmlContent.replace(
    /(https?:\/\/[^\s<>"]+)/g,
    '<span style="word-break: break-all;">$1</span>'
);

// 4. Fix table overflow issues
htmlContent = htmlContent.replace(
    /<table(?![^>]*style)/g,
    '<table style="table-layout: fixed; width: 100%; word-break: break-word;"'
);

// Add max-width to table cells
htmlContent = htmlContent.replace(
    /<td(?![^>]*style)/g,
    '<td style="word-break: break-word; overflow-wrap: break-word;"'
);

// 5. Fix divs with excessive nesting
// Add box-sizing to all divs
htmlContent = htmlContent.replace(
    /<div class="([^"]+)"(?![^>]*style)/g,
    '<div class="$1" style="box-sizing: border-box; max-width: 100%;"'
);

// 6. Special fixes for pages with most violations (21, 28, 14, 27, 25)
const problematicPages = [21, 28, 14, 27, 25];
problematicPages.forEach(pageNum => {
    const pagePattern = new RegExp(
        `(<div class="page"[^>]*>(?:[\\s\\S]*?)<div class="page-content"[^>]*>)([\\s\\S]*?)(</div>\\s*</div>)`,
        'g'
    );
    
    let pageCount = 0;
    htmlContent = htmlContent.replace(pagePattern, (match, before, content, after) => {
        pageCount++;
        if (pageCount === pageNum) {
            // Add extra overflow protection
            content = `<div style="overflow: hidden; max-width: 100%; word-wrap: break-word;">${content}</div>`;
            console.log(`Added extra overflow protection to page ${pageNum}`);
        }
        return before + content + after;
    });
});

// 7. Create an additional CSS file for critical fixes
const criticalFixCSS = `/* Critical Margin Violation Fixes */

/* Force all content to respect boundaries */
* {
    max-width: 100% !important;
    box-sizing: border-box !important;
}

/* Prevent any element from extending beyond page */
.page, .page-content {
    overflow: hidden !important;
}

.page-content > * {
    max-width: calc(100% - 1px) !important;
}

/* Fix specific elements that commonly overflow */
span, p, div, h1, h2, h3, h4, h5, h6, li, td, th {
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
}

/* Force tables to fit */
table {
    table-layout: fixed !important;
    width: calc(100% - 1px) !important;
}

/* Aggressive text wrapping */
@supports (overflow-wrap: anywhere) {
    * {
        overflow-wrap: anywhere !important;
    }
}

/* Print-specific boundary enforcement */
@media print {
    .page {
        width: 8.5in !important;
        height: 11in !important;
        overflow: hidden !important;
        position: relative !important;
    }
    
    .page-content {
        position: absolute !important;
        top: 0.75in !important;
        left: 0.75in !important;
        right: 0.75in !important;
        bottom: 0.75in !important;
        overflow: hidden !important;
        width: auto !important;
        height: auto !important;
    }
    
    /* Ensure nothing escapes the content area */
    .page-content * {
        position: static !important;
        float: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}
`;

// Write critical CSS file
fs.writeFileSync(
    path.join(__dirname, 'critical-margin-fix.css'),
    criticalFixCSS
);

// Add critical CSS to HTML if not present
if (!htmlContent.includes('critical-margin-fix.css')) {
    htmlContent = htmlContent.replace(
        '</head>',
        '    <link rel="stylesheet" href="critical-margin-fix.css">\n</head>'
    );
}

// 8. Write the fixed HTML
fs.writeFileSync(htmlPath, htmlContent);

console.log('\n=== MARGIN VIOLATION FIXES COMPLETE ===');
console.log(`Total inline style fixes: ${fixCount}`);
console.log('Added overflow protection to all pages');
console.log('Wrapped email addresses and URLs');
console.log('Fixed table layouts');
console.log('Added box-sizing to all divs');
console.log('Applied special fixes to problematic pages');
console.log('Created critical-margin-fix.css');
console.log('\nNext step: Re-run the test suite to verify fixes');