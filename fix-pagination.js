/**
 * Pagination Fix Script for BMPOA Document
 * Resolves overflow issues and orphaned headers
 */

class PaginationFixer {
    constructor() {
        this.pageHeight = 11 * 96; // 11 inches at 96 DPI
        this.marginTop = 0.75 * 96;
        this.marginBottom = 0.75 * 96;
        this.safeZone = 0.25 * 96;
        this.contentHeight = this.pageHeight - this.marginTop - this.marginBottom - this.safeZone;
        
        // Orphan control settings
        this.minLinesAfterHeader = 3; // Minimum lines after a header
        this.orphanThreshold = 2; // Minimum lines at bottom of page
        this.widowThreshold = 2; // Minimum lines at top of page
    }

    fixAllPages() {
        console.log('Starting pagination fix...');
        
        // Step 1: Fix orphaned headers
        this.fixOrphanedHeaders();
        
        // Step 2: Fix content overflow
        this.fixContentOverflow();
        
        // Step 3: Consolidate content to reduce page count
        this.consolidatePages();
        
        // Step 4: Verify all fixes
        this.verifyPagination();
        
        console.log('Pagination fix complete!');
    }

    fixOrphanedHeaders() {
        const pages = document.querySelectorAll('.page');
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            const headers = content.querySelectorAll('h2, h3, h4');
            
            headers.forEach(header => {
                // Check if header is too close to bottom of page
                const headerRect = header.getBoundingClientRect();
                const contentRect = content.getBoundingClientRect();
                const spaceBelow = contentRect.bottom - headerRect.bottom;
                
                // If less than 3 lines of space below header, move to next page
                if (spaceBelow < (this.minLinesAfterHeader * 24)) { // Assuming 24px line height
                    this.moveElementToNextPage(header, page);
                }
            });
        });
    }

    fixContentOverflow() {
        const pages = document.querySelectorAll('.page');
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Check if content exceeds page height
            if (content.scrollHeight > this.contentHeight) {
                this.splitOverflowContent(content, page);
            }
        });
    }

    consolidatePages() {
        // Target: Reduce from 28 pages to 20 pages
        console.log('Consolidating content to meet 20-page target...');
        
        // Identify pages with minimal content that can be merged
        const pages = Array.from(document.querySelectorAll('.page'));
        const pageUtilization = pages.map(page => {
            const content = page.querySelector('.page-content');
            if (!content) return 0;
            return (content.scrollHeight / this.contentHeight) * 100;
        });
        
        // Merge pages with less than 50% utilization
        for (let i = pages.length - 1; i > 0; i--) {
            if (pageUtilization[i] < 50 && pageUtilization[i-1] < 80) {
                this.mergePages(pages[i-1], pages[i]);
            }
        }
    }

    moveElementToNextPage(element, currentPage) {
        const nextPage = currentPage.nextElementSibling;
        if (!nextPage || !nextPage.classList.contains('page')) {
            // Create new page if needed
            const newPage = this.createNewPage();
            currentPage.after(newPage);
            nextPage = newPage;
        }
        
        const nextContent = nextPage.querySelector('.page-content');
        const elementsToMove = [element];
        
        // Also move following content until next header
        let sibling = element.nextElementSibling;
        while (sibling && !sibling.matches('h2, h3, h4')) {
            elementsToMove.push(sibling);
            sibling = sibling.nextElementSibling;
        }
        
        // Move elements to next page
        elementsToMove.forEach(el => {
            nextContent.insertBefore(el, nextContent.firstChild);
        });
    }

    splitOverflowContent(content, page) {
        const elements = Array.from(content.children);
        let currentHeight = 0;
        let splitIndex = -1;
        
        // Find where to split
        for (let i = 0; i < elements.length; i++) {
            currentHeight += elements[i].offsetHeight;
            if (currentHeight > this.contentHeight * 0.95) { // Leave 5% buffer
                splitIndex = i;
                break;
            }
        }
        
        if (splitIndex > 0) {
            const nextPage = page.nextElementSibling || this.createNewPage();
            const nextContent = nextPage.querySelector('.page-content');
            
            // Move overflow elements
            for (let i = splitIndex; i < elements.length; i++) {
                nextContent.appendChild(elements[i]);
            }
            
            page.after(nextPage);
        }
    }

    mergePages(page1, page2) {
        const content1 = page1.querySelector('.page-content');
        const content2 = page2.querySelector('.page-content');
        
        if (!content1 || !content2) return;
        
        // Check if combined content will fit
        const combinedHeight = content1.scrollHeight + content2.scrollHeight;
        if (combinedHeight <= this.contentHeight * 0.95) {
            // Move all content from page2 to page1
            while (content2.firstChild) {
                content1.appendChild(content2.firstChild);
            }
            // Remove empty page
            page2.remove();
            console.log('Merged pages successfully');
        }
    }

    createNewPage() {
        const template = document.querySelector('.page');
        const newPage = template.cloneNode(true);
        const content = newPage.querySelector('.page-content');
        content.innerHTML = ''; // Clear content
        return newPage;
    }

    verifyPagination() {
        const pages = document.querySelectorAll('.page');
        console.log(`Final page count: ${pages.length}`);
        
        let issues = 0;
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Check for overflow
            if (content.scrollHeight > this.contentHeight) {
                console.warn(`Page ${index + 1} still has overflow`);
                issues++;
            }
            
            // Check for orphaned headers
            const headers = content.querySelectorAll('h2, h3, h4');
            headers.forEach(header => {
                const rect = header.getBoundingClientRect();
                const contentRect = content.getBoundingClientRect();
                if (contentRect.bottom - rect.bottom < 72) { // Less than 3 lines
                    console.warn(`Page ${index + 1} has orphaned header: ${header.textContent}`);
                    issues++;
                }
            });
        });
        
        console.log(`Verification complete. Found ${issues} remaining issues.`);
    }

    // Additional helper methods for specific content types
    
    fixTables() {
        // Ensure tables don't break across pages
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            table.style.pageBreakInside = 'avoid';
            table.classList.add('keep-together');
        });
    }

    fixLists() {
        // Keep list items together
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach(list => {
            if (list.children.length < 5) {
                list.classList.add('keep-together');
            }
        });
    }

    fixImages() {
        // Ensure images have proper spacing
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.pageBreakBefore = 'auto';
            img.style.pageBreakAfter = 'avoid';
            img.style.pageBreakInside = 'avoid';
        });
    }

    optimizeSpacing() {
        // Reduce excessive spacing to fit content better
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(content => {
            // Reduce paragraph spacing slightly
            const paragraphs = content.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.marginBottom = '0.8em'; // Reduced from 1em
            });
            
            // Optimize header spacing
            const headers = content.querySelectorAll('h2, h3, h4');
            headers.forEach(h => {
                h.style.marginTop = '1.2em'; // Reduced from 1.5em
                h.style.marginBottom = '0.6em'; // Reduced from 0.8em
            });
        });
    }
}

// Initialize and run fixes
const fixer = new PaginationFixer();

// Add control button to page
const fixButton = document.createElement('button');
fixButton.textContent = 'Fix Pagination Issues';
fixButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

fixButton.onclick = () => {
    fixer.fixAllPages();
    fixer.fixTables();
    fixer.fixLists();
    fixer.fixImages();
    fixer.optimizeSpacing();
};

document.body.appendChild(fixButton);

// Auto-run fixes on load
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('Auto-running pagination fixes...');
        fixButton.click();
    }, 1000);
});