/**
 * Script to optimize BMPOA HTML document for Pandoc DOCX conversion
 * Refactors complex HTML/CSS structures into simpler, semantic HTML
 */

class DocxOptimizer {
    constructor() {
        this.changes = [];
        this.warnings = [];
    }

    optimizeDocument() {
        console.log('Starting DOCX optimization...');
        
        // Step 1: Simplify complex div structures
        this.simplifyDivStructures();
        
        // Step 2: Convert CSS grids to tables
        this.convertGridsToTables();
        
        // Step 3: Replace custom classes with semantic HTML
        this.replaceCustomClasses();
        
        // Step 4: Optimize images
        this.optimizeImages();
        
        // Step 5: Fix table structures
        this.optimizeTables();
        
        // Step 6: Add proper page breaks
        this.addPageBreaks();
        
        // Step 7: Remove complex CSS
        this.simplifyCSS();
        
        // Step 8: Add metadata
        this.addMetadata();
        
        console.log(`Optimization complete! Made ${this.changes.length} changes.`);
        this.showReport();
    }

    simplifyDivStructures() {
        // Replace complex nested divs with simpler structures
        const complexDivs = document.querySelectorAll('.page-content > div > div > div');
        
        complexDivs.forEach(div => {
            if (div.children.length === 1 && div.children[0].tagName === 'P') {
                // Unwrap single paragraphs
                const p = div.children[0];
                div.parentNode.replaceChild(p, div);
                this.changes.push('Unwrapped nested paragraph');
            }
        });
        
        // Convert info/alert boxes to blockquotes
        const alertBoxes = document.querySelectorAll('.alert-box, .info-box, .warning-box');
        alertBoxes.forEach(box => {
            const blockquote = document.createElement('blockquote');
            blockquote.innerHTML = box.innerHTML;
            
            // Add visual indicator
            if (box.classList.contains('critical') || box.classList.contains('warning-box')) {
                blockquote.innerHTML = '<strong>⚠️ WARNING</strong><br>' + blockquote.innerHTML;
            } else if (box.classList.contains('info-box')) {
                blockquote.innerHTML = '<strong>ℹ️ INFO</strong><br>' + blockquote.innerHTML;
            }
            
            box.parentNode.replaceChild(blockquote, box);
            this.changes.push('Converted alert box to blockquote');
        });
    }

    convertGridsToTables() {
        // Convert contact grids to tables
        const contactGrids = document.querySelectorAll('.contact-grid');
        
        contactGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.contact-card');
            if (cards.length === 0) return;
            
            const table = document.createElement('table');
            const tbody = document.createElement('tbody');
            
            // Create rows (2 cards per row)
            for (let i = 0; i < cards.length; i += 2) {
                const tr = document.createElement('tr');
                
                for (let j = 0; j < 2 && i + j < cards.length; j++) {
                    const td = document.createElement('td');
                    td.innerHTML = cards[i + j].innerHTML;
                    tr.appendChild(td);
                }
                
                tbody.appendChild(tr);
            }
            
            table.appendChild(tbody);
            grid.parentNode.replaceChild(table, grid);
            this.changes.push('Converted contact grid to table');
        });
        
        // Convert feature grids
        const featureGrids = document.querySelectorAll('.features-grid, .provider-grid');
        featureGrids.forEach(grid => {
            const items = grid.children;
            if (items.length === 0) return;
            
            const list = document.createElement('ul');
            
            Array.from(items).forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.querySelector('h4')?.textContent || ''}</strong><br>` +
                              item.innerHTML.replace(/<h4[^>]*>.*?<\/h4>/gi, '');
                list.appendChild(li);
            });
            
            grid.parentNode.replaceChild(list, grid);
            this.changes.push('Converted feature grid to list');
        });
    }

    replaceCustomClasses() {
        // Replace custom paragraph classes with standard ones
        const mappings = {
            '.first-paragraph': (el) => {
                el.style.textIndent = '0';
                el.classList.add('First-Paragraph');
            },
            '.chapter-title': (el) => {
                el.style.pageBreakBefore = 'always';
                el.classList.add('chapter');
            },
            '.section-header': (el) => {
                if (el.tagName !== 'H2') {
                    const h2 = document.createElement('h2');
                    h2.innerHTML = el.innerHTML;
                    el.parentNode.replaceChild(h2, el);
                }
            }
        };
        
        Object.entries(mappings).forEach(([selector, transform]) => {
            document.querySelectorAll(selector).forEach(transform);
        });
    }

    optimizeImages() {
        // Ensure images have proper attributes
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Ensure alt text
            if (!img.alt) {
                img.alt = 'Image';
                this.warnings.push(`Image missing alt text: ${img.src}`);
            }
            
            // Wrap in figure if not already
            if (img.parentNode.tagName !== 'FIGURE') {
                const figure = document.createElement('figure');
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = img.alt;
                
                img.parentNode.insertBefore(figure, img);
                figure.appendChild(img);
                figure.appendChild(figcaption);
                
                this.changes.push('Wrapped image in figure element');
            }
            
            // Remove complex styling
            img.style.cssText = `max-width: 100%; height: auto;`;
        });
    }

    optimizeTables() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            // Ensure table has caption
            if (!table.querySelector('caption')) {
                const firstHeader = table.querySelector('h3, h4');
                if (firstHeader) {
                    const caption = document.createElement('caption');
                    caption.textContent = firstHeader.textContent;
                    table.insertBefore(caption, table.firstChild);
                    firstHeader.remove();
                }
            }
            
            // Ensure proper structure
            if (!table.querySelector('thead') && table.querySelector('tr')) {
                const firstRow = table.querySelector('tr');
                const cells = firstRow.querySelectorAll('th, td');
                
                // Check if first row contains headers
                const isHeader = Array.from(cells).every(cell => 
                    cell.tagName === 'TH' || cell.style.fontWeight === 'bold'
                );
                
                if (isHeader) {
                    const thead = document.createElement('thead');
                    const tbody = document.createElement('tbody');
                    
                    thead.appendChild(firstRow);
                    
                    // Move remaining rows to tbody
                    Array.from(table.querySelectorAll('tr')).forEach(tr => {
                        tbody.appendChild(tr);
                    });
                    
                    table.appendChild(thead);
                    table.appendChild(tbody);
                    
                    this.changes.push('Added proper table structure');
                }
            }
            
            // Simplify styling
            table.style.cssText = 'width: 100%; border-collapse: collapse;';
            table.querySelectorAll('td, th').forEach(cell => {
                cell.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
            });
        });
    }

    addPageBreaks() {
        // Add explicit page breaks before chapters
        const chapters = document.querySelectorAll('h1');
        
        chapters.forEach((chapter, index) => {
            if (index > 0) { // Skip first chapter
                const pageBreak = document.createElement('div');
                pageBreak.style.pageBreakBefore = 'always';
                pageBreak.className = 'page-break';
                chapter.parentNode.insertBefore(pageBreak, chapter);
                this.changes.push('Added page break before chapter');
            }
        });
        
        // Remove complex page structures
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (content) {
                // Extract content and replace page div
                const children = Array.from(content.children);
                const parent = page.parentNode;
                
                children.forEach(child => {
                    parent.insertBefore(child, page);
                });
                
                page.remove();
                this.changes.push('Simplified page structure');
            }
        });
    }

    simplifyCSS() {
        // Remove complex CSS rules
        const styles = document.querySelectorAll('style');
        
        styles.forEach(style => {
            let css = style.textContent;
            
            // Remove CSS Grid and Flexbox
            css = css.replace(/display:\s*(grid|flex)[^;]*;/gi, '');
            css = css.replace(/grid-[^:]+:[^;]*;/gi, '');
            css = css.replace(/flex-[^:]+:[^;]*;/gi, '');
            
            // Remove complex positioning
            css = css.replace(/position:\s*(absolute|fixed)[^;]*;/gi, '');
            
            // Remove animations
            css = css.replace(/@keyframes[^}]+\}[^}]*\}/gi, '');
            css = css.replace(/animation[^;]*;/gi, '');
            
            style.textContent = css;
            this.changes.push('Simplified CSS');
        });
    }

    addMetadata() {
        // Add metadata block for Pandoc
        const metadataDiv = document.createElement('div');
        metadataDiv.style.display = 'none';
        metadataDiv.innerHTML = `
---
title: Blue Mountain Property Owners Association Community Guide
author: BMPOA Board of Directors
date: 2025
subject: Community Guide and Regulations
keywords: [BMPOA, Blue Mountain, Property Owners, Community Guide]
lang: en-US
toc: true
toc-depth: 3
papersize: letter
geometry: margin=1in
fontsize: 11pt
mainfont: Georgia
sansfont: Arial
monofont: Courier New
---
        `;
        document.body.appendChild(metadataDiv);
        this.changes.push('Added Pandoc metadata');
    }

    showReport() {
        const report = document.createElement('div');
        report.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 10002;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        let html = `
            <h2>DOCX Optimization Report</h2>
            <p><strong>Changes Made:</strong> ${this.changes.length}</p>
            <p><strong>Warnings:</strong> ${this.warnings.length}</p>
            
            <h3>Summary of Changes</h3>
            <ul>
        `;
        
        // Count change types
        const changeCounts = {};
        this.changes.forEach(change => {
            changeCounts[change] = (changeCounts[change] || 0) + 1;
        });
        
        Object.entries(changeCounts).forEach(([change, count]) => {
            html += `<li>${change}: ${count}</li>`;
        });
        
        html += `</ul>`;
        
        if (this.warnings.length > 0) {
            html += `<h3>Warnings</h3><ul>`;
            this.warnings.forEach(warning => {
                html += `<li>${warning}</li>`;
            });
            html += `</ul>`;
        }
        
        html += `
            <h3>Next Steps</h3>
            <ol>
                <li>Save the optimized HTML</li>
                <li>Run Pandoc conversion: <code>pandoc optimized.html -o document.docx</code></li>
                <li>Review the DOCX output</li>
                <li>Create a reference document for styling</li>
            </ol>
            
            <div style="text-align: right; margin-top: 20px;">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #333;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Close</button>
                <button onclick="docxOptimizer.exportOptimizedHTML()" style="
                    background: #27ae60;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                ">Export Optimized HTML</button>
            </div>
        `;
        
        report.innerHTML = html;
        document.body.appendChild(report);
    }

    exportOptimizedHTML() {
        const html = document.documentElement.outerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bmpoa-docx-optimized.html';
        a.click();
        URL.revokeObjectURL(url);
        console.log('Exported optimized HTML');
    }
}

// Initialize optimizer
const docxOptimizer = new DocxOptimizer();

// Add control button
const optimizeButton = document.createElement('button');
optimizeButton.textContent = 'Optimize for DOCX';
optimizeButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 340px;
    padding: 10px 20px;
    background: #9b59b6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

optimizeButton.onclick = () => {
    if (confirm('This will modify the document structure for better DOCX conversion. Continue?')) {
        docxOptimizer.optimizeDocument();
    }
};

document.body.appendChild(optimizeButton);

console.log('DOCX Optimizer loaded. Click the purple button to optimize for Word conversion.');