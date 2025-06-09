/**
 * Comprehensive Pagination Fix for BMPOA Document
 * Addresses content overflow and orphaned headers
 */

class ComprehensivePaginationFix {
    constructor() {
        this.pageHeight = 11 * 96; // 11 inches in pixels at 96 DPI
        this.pageWidth = 8.5 * 96; // 8.5 inches in pixels
        this.marginTop = 0.75 * 96; // 0.75 inches
        this.marginBottom = 0.75 * 96;
        this.marginLeft = 0.75 * 96;
        this.marginRight = 0.75 * 96;
        this.safeMargin = 0.25 * 96; // Safe margin for error
        
        // Calculate safe content area
        this.maxContentHeight = this.pageHeight - this.marginTop - this.marginBottom - this.safeMargin;
        this.maxContentWidth = this.pageWidth - this.marginLeft - this.marginRight;
        
        // Minimum content before considering page break
        this.minContentBeforeBreak = 2 * 96; // 2 inches
        this.orphanThreshold = 1.5 * 96; // 1.5 inches for orphan control
    }
    
    fixAllPages() {
        console.log('Starting comprehensive pagination fix...');
        
        // First, identify all problematic pages
        const problematicPages = this.identifyProblematicPages();
        console.log(`Found ${problematicPages.length} pages with issues`);
        
        // Fix each problematic page
        problematicPages.forEach((pageInfo, index) => {
            console.log(`Fixing page ${pageInfo.pageNumber} (${index + 1}/${problematicPages.length})`);
            this.fixPage(pageInfo);
        });
        
        // Reflow entire document
        this.reflowDocument();
        
        // Verify fixes
        this.verifyFixes();
        
        console.log('Pagination fix complete!');
    }
    
    identifyProblematicPages() {
        const pages = document.querySelectorAll('.page');
        const problematicPages = [];
        
        pages.forEach((page, index) => {
            const pageNumber = index + 1;
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            const contentHeight = content.scrollHeight;
            const hasOverflow = contentHeight > this.maxContentHeight;
            
            // Check for orphaned headers
            const headers = content.querySelectorAll('h1, h2, h3, h4');
            const orphanedHeaders = [];
            
            headers.forEach(header => {
                const headerTop = header.offsetTop;
                const nextElement = header.nextElementSibling;
                const spaceAfterHeader = nextElement ? 
                    (contentHeight - headerTop - header.offsetHeight) : 0;
                
                // Header is orphaned if it's near bottom with little content after
                if (spaceAfterHeader < this.orphanThreshold && spaceAfterHeader > 0) {
                    orphanedHeaders.push({
                        element: header,
                        text: header.textContent.trim(),
                        position: headerTop
                    });
                }
            });
            
            if (hasOverflow || orphanedHeaders.length > 0) {
                problematicPages.push({
                    page,
                    pageNumber,
                    content,
                    contentHeight,
                    overflow: hasOverflow,
                    overflowAmount: contentHeight - this.maxContentHeight,
                    orphanedHeaders
                });
            }
        });
        
        return problematicPages;
    }
    
    fixPage(pageInfo) {
        const { page, content, overflow, overflowAmount, orphanedHeaders } = pageInfo;
        
        // Fix orphaned headers first
        if (orphanedHeaders.length > 0) {
            this.fixOrphanedHeaders(pageInfo);
        }
        
        // Fix content overflow
        if (overflow) {
            this.fixContentOverflow(pageInfo);
        }
    }
    
    fixOrphanedHeaders(pageInfo) {
        const { content, orphanedHeaders } = pageInfo;
        
        orphanedHeaders.forEach(orphanInfo => {
            const header = orphanInfo.element;
            const nextSibling = header.nextElementSibling;
            
            // Add a page break before the header
            const pageBreak = document.createElement('div');
            pageBreak.className = 'page-break-before';
            pageBreak.style.cssText = 'page-break-before: always; break-before: page;';
            
            header.parentNode.insertBefore(pageBreak, header);
            
            // Ensure some content follows the header
            if (nextSibling) {
                // Keep header with at least one paragraph or element
                const keepTogether = document.createElement('div');
                keepTogether.className = 'keep-together';
                keepTogether.style.cssText = 'page-break-inside: avoid; break-inside: avoid;';
                
                header.parentNode.insertBefore(keepTogether, header);
                keepTogether.appendChild(header);
                
                // Move next element into keep-together container
                if (nextSibling && nextSibling.offsetHeight < this.orphanThreshold) {
                    keepTogether.appendChild(nextSibling);
                }
            }
        });
    }
    
    fixContentOverflow(pageInfo) {
        const { content, overflowAmount } = pageInfo;
        
        // Find natural break points
        const elements = Array.from(content.children);
        let currentHeight = 0;
        let breakPoint = null;
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const elementHeight = element.offsetHeight;
            
            if (currentHeight + elementHeight > this.maxContentHeight) {
                // Found overflow point
                breakPoint = i;
                break;
            }
            
            currentHeight += elementHeight;
        }
        
        if (breakPoint !== null && breakPoint > 0) {
            // Look for best break point (prefer before headers, after paragraphs)
            let bestBreakPoint = breakPoint;
            
            // Check previous elements for better break points
            for (let i = breakPoint; i >= Math.max(0, breakPoint - 3); i--) {
                const element = elements[i];
                const prevElement = elements[i - 1];
                
                // Prefer breaking before headers
                if (element.matches('h1, h2, h3, h4')) {
                    bestBreakPoint = i;
                    break;
                }
                
                // Or after complete paragraphs/lists
                if (prevElement && prevElement.matches('p, ul, ol, .alert-box')) {
                    bestBreakPoint = i;
                    break;
                }
            }
            
            // Insert page break
            const breakElement = elements[bestBreakPoint];
            if (breakElement) {
                const pageBreak = document.createElement('div');
                pageBreak.className = 'page-break-marker';
                pageBreak.setAttribute('data-break-reason', 'overflow');
                breakElement.parentNode.insertBefore(pageBreak, breakElement);
            }
        }
    }
    
    reflowDocument() {
        console.log('Reflowing document...');
        
        // Create new page structure
        const allContent = [];
        const pages = document.querySelectorAll('.page');
        
        // Collect all content
        pages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (content) {
                const elements = Array.from(content.children);
                elements.forEach(el => {
                    // Skip page footers and headers
                    if (!el.classList.contains('page-footer') && 
                        !el.classList.contains('professional-header')) {
                        allContent.push(el.cloneNode(true));
                    }
                });
            }
        });
        
        // Clear existing pages content
        pages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (content) {
                // Preserve headers and footers
                const header = page.querySelector('.professional-header');
                const footer = page.querySelector('.page-footer');
                
                content.innerHTML = '';
                
                if (header) content.appendChild(header);
                if (footer) page.appendChild(footer);
            }
        });
        
        // Redistribute content
        let currentPageIndex = 0;
        let currentPage = pages[currentPageIndex];
        let currentContent = currentPage.querySelector('.page-content');
        let currentHeight = 0;
        
        allContent.forEach(element => {
            // Check if element has page break marker
            if (element.classList.contains('page-break-marker') || 
                element.classList.contains('page-break-before')) {
                // Move to next page
                currentPageIndex++;
                if (currentPageIndex < pages.length) {
                    currentPage = pages[currentPageIndex];
                    currentContent = currentPage.querySelector('.page-content');
                    currentHeight = 0;
                }
            }
            
            const elementHeight = this.estimateElementHeight(element);
            
            // Check if element fits on current page
            if (currentHeight + elementHeight > this.maxContentHeight && currentHeight > 0) {
                // Move to next page
                currentPageIndex++;
                if (currentPageIndex < pages.length) {
                    currentPage = pages[currentPageIndex];
                    currentContent = currentPage.querySelector('.page-content');
                    currentHeight = 0;
                } else {
                    // Need to create new page
                    const newPage = this.createNewPage();
                    document.querySelector('.page').parentNode.appendChild(newPage);
                    currentPage = newPage;
                    currentContent = newPage.querySelector('.page-content');
                    currentHeight = 0;
                }
            }
            
            // Add element to current page
            if (currentContent) {
                currentContent.appendChild(element);
                currentHeight += elementHeight;
            }
        });
        
        // Remove empty pages
        this.removeEmptyPages();
    }
    
    estimateElementHeight(element) {
        // Estimate based on element type and content
        const baseLineHeight = 1.6 * 16; // 1.6em at 16px
        
        if (element.matches('h1')) return 3 * baseLineHeight;
        if (element.matches('h2')) return 2.5 * baseLineHeight;
        if (element.matches('h3')) return 2 * baseLineHeight;
        if (element.matches('p')) {
            const lines = Math.ceil(element.textContent.length / 80);
            return lines * baseLineHeight;
        }
        if (element.matches('ul, ol')) {
            const items = element.querySelectorAll('li').length;
            return items * baseLineHeight * 1.2;
        }
        if (element.matches('table')) {
            const rows = element.querySelectorAll('tr').length;
            return rows * baseLineHeight * 1.5;
        }
        if (element.matches('.alert-box')) return 4 * baseLineHeight;
        if (element.matches('img')) return 300; // Approximate image height
        
        return 2 * baseLineHeight; // Default
    }
    
    createNewPage() {
        const newPage = document.createElement('div');
        newPage.className = 'page';
        newPage.innerHTML = '<div class="page-content"></div>';
        
        // Add professional header and footer if they exist
        const existingPage = document.querySelector('.page:last-of-type');
        if (existingPage) {
            const header = existingPage.querySelector('.professional-header');
            const footer = existingPage.querySelector('.page-footer');
            
            if (header) {
                newPage.querySelector('.page-content').appendChild(header.cloneNode(true));
            }
            if (footer) {
                newPage.appendChild(footer.cloneNode(true));
            }
        }
        
        return newPage;
    }
    
    removeEmptyPages() {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (content) {
                // Check if page only has header/footer
                const meaningfulContent = Array.from(content.children).filter(el => 
                    !el.classList.contains('professional-header') &&
                    !el.classList.contains('page-footer')
                );
                
                if (meaningfulContent.length === 0) {
                    page.remove();
                }
            }
        });
    }
    
    verifyFixes() {
        console.log('Verifying pagination fixes...');
        
        const pages = document.querySelectorAll('.page');
        let issuesFound = 0;
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (content) {
                const contentHeight = content.scrollHeight;
                if (contentHeight > this.maxContentHeight) {
                    console.warn(`Page ${index + 1} still has overflow: ${contentHeight - this.maxContentHeight}px`);
                    issuesFound++;
                }
            }
        });
        
        if (issuesFound === 0) {
            console.log('✅ All pagination issues resolved!');
        } else {
            console.warn(`⚠️ ${issuesFound} pages still have issues`);
        }
        
        // Update page numbers
        this.updatePageNumbers();
    }
    
    updatePageNumbers() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            const footer = page.querySelector('.page-footer .page-number');
            if (footer) {
                footer.textContent = index + 1;
            }
        });
        
        console.log(`Document now has ${pages.length} pages`);
    }
}

// Initialize and add control
const paginationFix = new ComprehensivePaginationFix();

// Add fix button
const fixButton = document.createElement('button');
fixButton.textContent = 'Fix Pagination Issues';
fixButton.style.cssText = `
    position: fixed;
    top: 110px;
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
    fixButton.textContent = 'Fixing...';
    fixButton.disabled = true;
    
    setTimeout(() => {
        paginationFix.fixAllPages();
        fixButton.textContent = '✅ Pagination Fixed';
        fixButton.style.background = '#27ae60';
    }, 100);
};

document.body.appendChild(fixButton);