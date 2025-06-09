#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a test report generator
const testHTML = `<!DOCTYPE html>
<html>
<head>
    <title>BMPOA Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f0f0f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .pass { color: green; }
        .fail { color: red; }
        .warning { color: orange; }
        .test-section { margin: 20px 0; }
        h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>BMPOA Document Test Report</h1>
    <div id="summary" class="summary">
        <p>Loading test results...</p>
    </div>
    <div id="results"></div>
    
    <iframe src="bmpoa-print-optimized.html" style="display:none;" id="testFrame"></iframe>
    
    <script>
        const iframe = document.getElementById('testFrame');
        const results = [];
        let passCount = 0;
        let failCount = 0;
        let warningCount = 0;
        
        function log(type, message) {
            results.push({ type, message, timestamp: new Date() });
            switch(type) {
                case 'pass': passCount++; break;
                case 'fail': failCount++; break;
                case 'warning': warningCount++; break;
            }
        }
        
        iframe.onload = function() {
            const doc = iframe.contentDocument;
            const pages = doc.querySelectorAll('.page');
            
            console.log('Starting tests...');
            
            // Test 1: Page count
            if (pages.length <= 20) {
                log('pass', \`Document has \${pages.length} pages (target: 20)\`);
            } else {
                log('warning', \`Document has \${pages.length} pages (exceeds target of 20)\`);
            }
            
            // Test 2: Margin violations
            let marginViolations = 0;
            pages.forEach((page, pageIndex) => {
                const pageRect = page.getBoundingClientRect();
                const elements = page.querySelectorAll('*');
                
                elements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const style = getComputedStyle(element);
                    
                    // Skip hidden elements
                    if (style.display === 'none' || style.visibility === 'hidden') return;
                    
                    // Check if element extends beyond page boundaries
                    const rightEdge = rect.left + rect.width;
                    const bottomEdge = rect.top + rect.height;
                    const pageRight = pageRect.left + pageRect.width;
                    const pageBottom = pageRect.top + pageRect.height;
                    
                    if (rightEdge > pageRight + 1 || rect.left < pageRect.left - 1) {
                        marginViolations++;
                        if (marginViolations <= 10) { // Only log first 10
                            log('fail', \`Page \${pageIndex + 1}: \${element.tagName} extends beyond horizontal boundaries\`);
                        }
                    }
                });
            });
            
            if (marginViolations === 0) {
                log('pass', 'No margin violations detected');
            } else {
                log('fail', \`Total margin violations: \${marginViolations}\`);
            }
            
            // Test 3: Image loading
            const images = doc.querySelectorAll('img');
            let brokenImages = 0;
            images.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    brokenImages++;
                }
            });
            
            if (brokenImages === 0) {
                log('pass', \`All \${images.length} images loaded successfully\`);
            } else {
                log('fail', \`\${brokenImages} broken images found\`);
            }
            
            // Test 4: Content overflow
            let overflowCount = 0;
            pages.forEach((page, index) => {
                const content = page.querySelector('.page-content');
                if (content && content.scrollHeight > content.clientHeight) {
                    overflowCount++;
                    log('warning', \`Page \${index + 1} has content overflow\`);
                }
            });
            
            if (overflowCount === 0) {
                log('pass', 'No content overflow detected');
            }
            
            // Display results
            displayResults();
        };
        
        function displayResults() {
            const summaryEl = document.getElementById('summary');
            const resultsEl = document.getElementById('results');
            
            summaryEl.innerHTML = \`
                <h2>Test Summary</h2>
                <p><span class="pass">Passed: \${passCount}</span> | 
                   <span class="fail">Failed: \${failCount}</span> | 
                   <span class="warning">Warnings: \${warningCount}</span></p>
                <p>Total tests: \${results.length}</p>
            \`;
            
            resultsEl.innerHTML = results.map(r => 
                \`<div class="\${r.type}">\${r.type.toUpperCase()}: \${r.message}</div>\`
            ).join('');
            
            // Save report
            const report = {
                summary: { passCount, failCount, warningCount },
                results,
                timestamp: new Date()
            };
            
            console.log('Test report:', report);
        }
    </script>
</body>
</html>`;

// Write test HTML
fs.writeFileSync(path.join(__dirname, 'test-report.html'), testHTML);

console.log('Test report created: test-report.html');
console.log('Open this file in a browser to run the tests');

// Also create a simpler command-line test
console.log('\nRunning basic command-line tests...\n');

const htmlContent = fs.readFileSync(path.join(__dirname, 'bmpoa-print-optimized.html'), 'utf8');

// Count pages
const pageCount = (htmlContent.match(/<div class="page"/g) || []).length;
console.log(`Page count: ${pageCount} ${pageCount <= 20 ? '✅' : '⚠️ (exceeds target)'}`);

// Check CSS files
const cssFiles = [
    'pagination-fixes.css',
    'fix-margin-violations.css',
    'pagination-ultra-fix.css',
    'critical-margin-fix.css'
];

console.log('\nCSS files loaded:');
cssFiles.forEach(file => {
    const loaded = htmlContent.includes(file);
    console.log(`  ${file}: ${loaded ? '✅' : '❌'}`);
});

// Check for common issues
console.log('\nQuick checks:');
const absolutePositions = (htmlContent.match(/position:\s*absolute/g) || []).length;
console.log(`  Absolute positions: ${absolutePositions} ${absolutePositions < 20 ? '✅' : '⚠️'}`);

const negativeMargins = (htmlContent.match(/margin.*:\s*-\d+px/g) || []).length;
console.log(`  Negative margins: ${negativeMargins} ${negativeMargins === 0 ? '✅' : '⚠️'}`);

const overflowHidden = (htmlContent.match(/overflow:\s*hidden/g) || []).length;
console.log(`  Overflow hidden applied: ${overflowHidden} instances ✅`);

console.log('\n✨ Open test-report.html in a browser for comprehensive testing');