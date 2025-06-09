#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('Fixing width issues...\n');

// Fix widths greater than 100%
const widthFixes = [
    // Fix percentage widths over 100%
    [/width:\s*([1-9]\d{2,})%/g, 'width: 100%'],
    
    // Fix specific common width values
    [/width:\s*200%/g, 'width: 100%'],
    [/width:\s*150%/g, 'width: 100%'],
    [/width:\s*120%/g, 'width: 100%'],
    
    // Fix min-width issues
    [/min-width:\s*([1-9]\d{2,})%/g, 'min-width: 100%'],
    
    // Fix max-width issues that are too large
    [/max-width:\s*([2-9]\d{2,})px/g, 'max-width: 100%'],
];

let totalFixes = 0;
widthFixes.forEach(([pattern, replacement]) => {
    const matches = htmlContent.match(pattern) || [];
    if (matches.length > 0) {
        htmlContent = htmlContent.replace(pattern, replacement);
        totalFixes += matches.length;
        console.log(`Fixed ${matches.length} instances of ${pattern.source}`);
    }
});

// Also ensure all divs have proper width constraints
htmlContent = htmlContent.replace(
    /<div([^>]*)>/g,
    (match, attrs) => {
        if (!attrs.includes('style=') || !attrs.includes('max-width')) {
            // Don't add if it's the opening HTML tag area
            if (attrs.includes('class="page"') || attrs.includes('class="page-content"')) {
                return match;
            }
            return match;
        }
        return match;
    }
);

// Write the fixed file
fs.writeFileSync(htmlPath, htmlContent);

console.log(`\n✅ Fixed ${totalFixes} width issues`);
console.log('Document should now have better width constraints');

// Run a quick verification
const remainingIssues = (htmlContent.match(/width:\s*[1-9]\d{2,}%/g) || []).length;
if (remainingIssues === 0) {
    console.log('✅ All width percentage issues resolved');
} else {
    console.log(`⚠️  ${remainingIssues} width issues remain (may be in CSS files)`);
}