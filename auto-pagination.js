/**
 * Automatic Pagination System
 * Handles overflow detection and dynamic page creation
 */

class AutoPagination {
    constructor() {
        this.pageHeight = 11 * 96; // 11 inches at 96 DPI
        this.pageWidth = 8.5 * 96;
        this.marginTop = 0.75 * 96;
        this.marginBottom = 0.75 * 96;
        this.marginLeft = 0.75 * 96;
        this.marginRight = 0.75 * 96;
        this.safeZone = 0.25 * 96; // Error boundary
        
        this.contentHeight = this.pageHeight - this.marginTop - this.marginBottom - this.safeZone;
        this.contentWidth = this.pageWidth - this.marginLeft - this.marginRight;
        
        this.init();
    }

    init() {
        // Run pagination check on load
        this.checkAndFixPagination();
        
        // Monitor for dynamic content changes
        this.setupMutationObserver();
        
        // Re-check on window resize
        window.addEventListener('resize', () => this.checkAndFixPagination());
        
        // Re-check before print
        window.addEventListener('beforeprint', () => this.checkAndFixPagination());
    }

    checkAndFixPagination() {
        const pages = document.querySelectorAll('.page');
        let pagesModified = false;
        
        pages.forEach((page, pageIndex) => {
            const contentArea = page.querySelector('.page-content');
            if (!contentArea) return;
            
            // Check for overflow
            const overflow = this.detectOverflow(contentArea);
            
            if (overflow) {
                console.warn(`Page ${pageIndex + 1} has overflow:`, overflow);
                this.handlePageOverflow(page, contentArea, pageIndex);
                pagesModified = true;
            }
            
            // Check for margin violations
            this.checkMarginViolations(page, contentArea, pageIndex);
        });
        
        if (pagesModified) {
            // Re-number pages
            this.renumberPages();
            
            // Log to error system
            if (window.errorLogger) {
                window.errorLogger.logWarning('Pagination Auto-Fix', 'Pages were automatically adjusted for overflow');
            }
        }
    }

    detectOverflow(contentArea) {
        const rect = contentArea.getBoundingClientRect();
        const children = Array.from(contentArea.children);
        let overflow = null;
        
        // Check if content height exceeds available space
        if (contentArea.scrollHeight > contentArea.clientHeight) {
            overflow = {
                type: 'height',
                excess: contentArea.scrollHeight - contentArea.clientHeight
            };
        }
        
        // Check each child element
        children.forEach(child => {
            const childRect = child.getBoundingClientRect();
            const relativeBottom = childRect.bottom - rect.top;
            
            if (relativeBottom > this.contentHeight) {
                overflow = overflow || {};
                overflow.elements = overflow.elements || [];
                overflow.elements.push({
                    element: child,
                    excess: relativeBottom - this.contentHeight
                });
            }
        });
        
        return overflow;
    }

    handlePageOverflow(page, contentArea, pageIndex) {
        const overflowElements = this.findOverflowElements(contentArea);
        
        if (overflowElements.length === 0) return;
        
        // Create a new page after this one
        const newPage = this.createNewPage(pageIndex + 1);
        const newContentArea = newPage.querySelector('.page-content');
        
        // Move overflowing elements to the new page
        overflowElements.forEach(element => {
            // Check if element should be kept with previous
            if (this.shouldKeepWithPrevious(element)) {
                // Move the previous element too
                const prevSibling = element.previousElementSibling;
                if (prevSibling) {
                    newContentArea.appendChild(prevSibling);
                }
            }
            
            newContentArea.appendChild(element);
        });
        
        // Insert the new page after the current page
        page.insertAdjacentElement('afterend', newPage);
        
        // Check if the new page also has overflow (recursive)
        const newOverflow = this.detectOverflow(newContentArea);
        if (newOverflow) {
            this.handlePageOverflow(newPage, newContentArea, pageIndex + 1);
        }
    }

    findOverflowElements(contentArea) {
        const elements = Array.from(contentArea.children);
        const contentRect = contentArea.getBoundingClientRect();
        const maxBottom = contentRect.top + this.contentHeight;
        const overflowElements = [];
        let foundOverflow = false;
        
        elements.forEach(element => {
            const elementRect = element.getBoundingClientRect();
            
            // If element starts beyond the page boundary, it's overflow
            if (elementRect.top >= maxBottom || foundOverflow) {
                overflowElements.push(element);
                foundOverflow = true;
            }
            // If element extends beyond the boundary
            else if (elementRect.bottom > maxBottom) {
                // Check if it's splittable
                if (this.canSplitElement(element)) {
                    const splitPoint = this.findSplitPoint(element, maxBottom);
                    if (splitPoint) {
                        this.splitElement(element, splitPoint, overflowElements);
                    } else {
                        overflowElements.push(element);
                    }
                } else {
                    overflowElements.push(element);
                }
                foundOverflow = true;
            }
        });
        
        return overflowElements;
    }

    canSplitElement(element) {
        const tagName = element.tagName.toLowerCase();
        const avoidSplit = ['table', 'figure', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        
        if (avoidSplit.includes(tagName)) return false;
        if (element.classList.contains('keep-together')) return false;
        if (element.classList.contains('avoid-break')) return false;
        
        // Only split paragraphs and lists
        return ['p', 'ul', 'ol'].includes(tagName);
    }

    findSplitPoint(element, maxBottom) {
        if (element.tagName.toLowerCase() === 'p') {
            // For paragraphs, find sentence boundaries
            const text = element.textContent;
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
            
            if (sentences.length > 1) {
                // Find which sentence causes overflow
                // This is simplified - in reality, we'd measure each sentence
                return Math.floor(sentences.length / 2);
            }
        }
        
        return null;
    }

    splitElement(element, splitPoint, overflowElements) {
        // This is a simplified implementation
        // In reality, we'd need to handle splitting more carefully
        const clone = element.cloneNode(true);
        overflowElements.push(clone);
    }

    shouldKeepWithPrevious(element) {
        // Headers should keep with next paragraph
        if (element.previousElementSibling) {
            const prev = element.previousElementSibling;
            if (prev.tagName.match(/^H[1-6]$/)) return true;
            if (prev.classList.contains('keep-with-next')) return true;
        }
        
        // First list item should stay with list
        if (element.tagName === 'LI' && element === element.parentElement.firstElementChild) {
            return true;
        }
        
        return false;
    }

    createNewPage(pageNumber) {
        const template = `
            <div class="page" data-page-number="${pageNumber}">
                <div class="page-content">
                    <!-- Content will be added here -->
                </div>
                <div class="page-footer">
                    <span>Continued from previous page</span>
                    <span class="page-number"></span>
                </div>
            </div>
        `;
        
        const temp = document.createElement('div');
        temp.innerHTML = template.trim();
        return temp.firstChild;
    }

    checkMarginViolations(page, contentArea, pageIndex) {
        const pageRect = page.getBoundingClientRect();
        const elements = contentArea.querySelectorAll('*');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            
            // Skip absolute positioned elements
            if (style.position === 'absolute') return;
            
            // Check violations
            const violations = {
                left: rect.left < (pageRect.left + this.marginLeft - this.safeZone),
                right: rect.right > (pageRect.right - this.marginRight + this.safeZone),
                top: rect.top < (pageRect.top + this.marginTop - this.safeZone),
                bottom: rect.bottom > (pageRect.bottom - this.marginBottom + this.safeZone)
            };
            
            if (Object.values(violations).some(v => v)) {
                element.classList.add('margin-violation');
                
                if (window.errorLogger) {
                    window.errorLogger.logError('Margin Violation', {
                        page: pageIndex + 1,
                        element: element.tagName,
                        violations: violations
                    });
                }
                
                // Try to fix by adjusting element
                this.fixMarginViolation(element, violations);
            }
        });
    }

    fixMarginViolation(element, violations) {
        const style = window.getComputedStyle(element);
        
        // Reduce padding/margins if they're causing overflow
        if (violations.left || violations.right) {
            const currentPaddingLeft = parseFloat(style.paddingLeft);
            const currentPaddingRight = parseFloat(style.paddingRight);
            
            if (currentPaddingLeft > 10 || currentPaddingRight > 10) {
                element.style.paddingLeft = '10px';
                element.style.paddingRight = '10px';
            }
        }
        
        // For images, ensure max-width
        if (element.tagName === 'IMG') {
            element.style.maxWidth = '100%';
            element.style.height = 'auto';
        }
        
        // For tables, enable overflow scroll
        if (element.tagName === 'TABLE') {
            const wrapper = document.createElement('div');
            wrapper.style.overflowX = 'auto';
            wrapper.style.maxWidth = '100%';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        }
    }

    renumberPages() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            page.setAttribute('data-page-number', index + 1);
            
            // Update page number display if exists
            const pageNumber = page.querySelector('.page-number');
            if (pageNumber && !pageNumber.classList.contains('no-auto-number')) {
                pageNumber.textContent = index + 1;
            }
        });
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            // Debounce pagination check
            clearTimeout(this.mutationTimeout);
            this.mutationTimeout = setTimeout(() => {
                this.checkAndFixPagination();
            }, 500);
        });
        
        // Observe all pages for content changes
        document.querySelectorAll('.page').forEach(page => {
            observer.observe(page, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });
    }

    // Manual trigger for testing
    forceRepaginate() {
        console.log('Force repaginating document...');
        this.checkAndFixPagination();
        
        // Update stats
        if (window.updatePageStats) {
            window.updatePageStats();
        }
    }
}

// Initialize auto-pagination
document.addEventListener('DOMContentLoaded', () => {
    window.autoPagination = new AutoPagination();
    
    // Add manual trigger button to toolbar if exists
    const toolbarSection = document.querySelector('.toolbar-section');
    if (toolbarSection) {
        const button = document.createElement('button');
        button.className = 'toolbar-btn';
        button.innerHTML = '<span class="icon">📄</span> Fix Pagination';
        button.onclick = () => window.autoPagination.forceRepaginate();
        toolbarSection.appendChild(button);
    }
});