#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('Fixing URL wrapping issues...\n');

// Split HTML into head and body sections
const headEndIndex = htmlContent.indexOf('</head>');
const bodyStartIndex = htmlContent.indexOf('<body');

if (headEndIndex === -1 || bodyStartIndex === -1) {
    console.error('Error: Could not find head/body sections');
    process.exit(1);
}

const headSection = htmlContent.substring(0, headEndIndex + 7);
const bodySection = htmlContent.substring(bodyStartIndex);

// Only fix URLs in the body section
let fixedBody = bodySection;

// Remove any span wrapping that was incorrectly added
fixedBody = fixedBody.replace(
    /<span style="word-break: break-all;">([^<]+)<\/span>/g,
    (match, content) => {
        // Only keep the span if it's actually in content area
        if (match.includes('http://') || match.includes('https://') || match.includes('@')) {
            return match; // Keep it
        }
        return content; // Remove the span
    }
);

// Reconstruct the HTML
htmlContent = headSection + '\n' + fixedBody;

// Write the fixed file
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Fixed URL wrapping issues');
console.log('✅ Preserved head section integrity');
console.log('\nThe document should now load properly in Vite.');