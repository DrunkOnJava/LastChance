/**
 * Automatic Pagination Fixes for BMPOA Document
 * Handles orphaned headers and overflow issues
 */

document.addEventListener('DOMContentLoaded', function() {
    const pageHeight = 11 * 96; // 11 inches at 96 DPI
    const marginTop = 0.75 * 96;
    const marginBottom = 0.75 * 96;
    const contentHeight = pageHeight - marginTop - marginBottom;
    
    function fixOrphanedHeaders() {
        const headers = document.querySelectorAll('h2, h3, h4, h5');
        
        headers.forEach(header => {
            const headerRect = header.getBoundingClientRect();
            const nextElement = header.nextElementSibling;
            
            if (nextElement) {
                const nextRect = nextElement.getBoundingClientRect();
                const page = header.closest('.page');
                const pageRect = page.getBoundingClientRect();
                
                // Check if header is near bottom of page
                const headerBottom = headerRect.bottom - pageRect.top;
                const spaceRemaining = contentHeight - headerBottom;
                
                // If less than 3 lines of space remain, move header to next page
                if (spaceRemaining < 60) { // ~3 lines at 20px line height
                    header.style.pageBreakBefore = 'always';
                    header.style.breakBefore = 'page';
                }
            }
        });
    }
    
    function fixOverflowingContent() {
        const pages = document.querySelectorAll('.page');
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Check if content exceeds page height
            if (content.scrollHeight > content.clientHeight) {
                console.warn(`Page ${index + 1} has overflow. Height: ${content.scrollHeight}px, Available: ${content.clientHeight}px`);
                
                // Try to reduce spacing
                const elements = content.querySelectorAll('h2, h3, h4, p, ul, ol');
                elements.forEach(el => {
                    const currentMarginTop = parseFloat(window.getComputedStyle(el).marginTop);
                    const currentMarginBottom = parseFloat(window.getComputedStyle(el).marginBottom);
                    
                    // Reduce margins by 20%
                    el.style.marginTop = (currentMarginTop * 0.8) + 'px';
                    el.style.marginBottom = (currentMarginBottom * 0.8) + 'px';
                });
                
                // Recheck after adjustment
                if (content.scrollHeight > content.clientHeight) {
                    // Still overflowing, need to move content
                    const lastChild = content.lastElementChild;
                    if (lastChild && lastChild.tagName !== 'H2' && lastChild.tagName !== 'H3') {
                        lastChild.style.pageBreakBefore = 'always';
                    }
                }
            }
        });
    }
    
    function ensureTablesStayTogether() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            table.style.pageBreakInside = 'avoid';
            table.style.breakInside = 'avoid';
            
            // Add wrapper div if needed
            if (!table.parentElement.classList.contains('table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper keep-together';
                wrapper.style.pageBreakInside = 'avoid';
                wrapper.style.breakInside = 'avoid';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }
    
    // Apply fixes
    fixOrphanedHeaders();
    fixOverflowingContent();
    ensureTablesStayTogether();
    
    // Log results
    console.log('Pagination fixes applied');
    
    // Add print media query listener
    if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                fixOrphanedHeaders();
                fixOverflowingContent();
                ensureTablesStayTogether();
            }
        });
    }
});

// Export for use in other scripts
window.paginationFixer = {
    fixOrphanedHeaders,
    fixOverflowingContent,
    ensureTablesStayTogether,
    applyAllFixes: function() {
        fixOrphanedHeaders();
        fixOverflowingContent();
        ensureTablesStayTogether();
    }
};