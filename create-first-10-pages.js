/**
 * Create First 10 Pages HTML File
 * Extracts exactly first 10 pages for PDF generation
 */

const fs = require('fs');
const path = require('path');

function createFirst10Pages() {
    console.log('Creating first 10 pages HTML file...');
    
    // Read the full HTML file
    const fullHtml = fs.readFileSync('bmpoa-print-optimized.html', 'utf8');
    
    // Find the first 10 page elements
    const pageMatches = [];
    let pageCount = 0;
    let lastIndex = 0;
    
    // Find page start and end positions
    while (pageCount < 10) {
        const pageStart = fullHtml.indexOf('<div class="page"', lastIndex);
        if (pageStart === -1) break;
        
        // Find the matching closing div
        let depth = 0;
        let pos = pageStart;
        let pageEnd = -1;
        
        while (pos < fullHtml.length) {
            if (fullHtml.substr(pos, 4) === '<div') {
                depth++;
            } else if (fullHtml.substr(pos, 6) === '</div>') {
                depth--;
                if (depth === 0) {
                    pageEnd = pos + 6;
                    break;
                }
            }
            pos++;
        }
        
        if (pageEnd !== -1) {
            pageMatches.push({
                start: pageStart,
                end: pageEnd,
                content: fullHtml.substring(pageStart, pageEnd)
            });
            pageCount++;
            lastIndex = pageEnd;
        } else {
            break;
        }
    }
    
    // Find the head section
    const headStart = fullHtml.indexOf('<head>');
    const headEnd = fullHtml.indexOf('</head>') + 7;
    const headContent = fullHtml.substring(headStart, headEnd);
    
    // Find the body opening and any initial content before pages
    const bodyStart = fullHtml.indexOf('<body');
    const firstPageStart = pageMatches.length > 0 ? pageMatches[0].start : -1;
    
    let bodyPrefix = '';
    if (firstPageStart !== -1) {
        const bodyOpenEnd = fullHtml.indexOf('>', bodyStart) + 1;
        bodyPrefix = fullHtml.substring(bodyOpenEnd, firstPageStart);
    }
    
    // Create the new HTML with only first 10 pages
    const first10Html = `<!DOCTYPE html>
<html lang="en">
${headContent}
<body class="pdf-export-mode">
${bodyPrefix}
${pageMatches.map(page => page.content).join('\n')}

<script>
// Auto-apply professional enhancements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading first 10 pages...');
    
    // Apply professional components after a delay
    setTimeout(() => {
        if (typeof professionalComponents !== 'undefined') {
            professionalComponents.applyAllEnhancements();
        }
        
        setTimeout(() => {
            if (typeof finalTouches !== 'undefined') {
                finalTouches.applyFinalTouches();
            }
            
            // Show ready indicator
            const indicator = document.createElement('div');
            indicator.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 10000;
                cursor: pointer;
                font-family: 'Montserrat', sans-serif;
            \`;
            indicator.innerHTML = '✅ Ready for PDF - Click to Print';
            indicator.onclick = () => window.print();
            document.body.appendChild(indicator);
            
            console.log('✅ First 10 pages ready for PDF!');
        }, 1500);
    }, 1000);
});
</script>
</body>
</html>`;
    
    // Write the file
    fs.writeFileSync('bmpoa-first-10-pages.html', first10Html);
    console.log('✅ Created bmpoa-first-10-pages.html with exactly 10 pages');
    console.log(`📄 Found ${pageCount} pages in the file`);
}

createFirst10Pages();