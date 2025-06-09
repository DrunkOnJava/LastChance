/**
 * Advanced Pagination Safeguards System
 * Provides multiple layers of protection against overflow and pagination issues
 */

class PaginationSafeguards {
    constructor() {
        this.config = {
            pageHeight: 11 * 96, // 11 inches at 96 DPI
            pageWidth: 8.5 * 96,
            marginTop: 0.75 * 96,
            marginBottom: 0.75 * 96,
            marginLeft: 0.75 * 96,
            marginRight: 0.75 * 96,
            safeZoneBuffer: 0.25 * 96, // Extra safety margin
            minContentHeight: 2 * 96, // Minimum 2 inches of content per page
            maxContentHeight: 9 * 96, // Maximum 9 inches of content
            orphanLines: 3, // Minimum lines to keep together
            widowLines: 2, // Minimum lines at top of page
            headerBuffer: 72, // Pixels after header before page break
        };
        
        this.monitors = new Map();
        this.overflowHandlers = new Map();
        this.validationRules = [];
        
        this.init();
    }

    init() {
        this.setupMutationObserver();
        this.setupResizeObserver();
        this.setupPrintListeners();
        this.installOverflowDetectors();
        this.createValidationRules();
        
        console.log('Pagination Safeguards initialized');
    }

    // LAYER 1: Real-time Overflow Detection
    installOverflowDetectors() {
        const pages = document.querySelectorAll('.page');
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Create overflow detector element
            const detector = document.createElement('div');
            detector.className = 'overflow-detector';
            detector.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 1px;
                height: 1px;
                background: transparent;
                pointer-events: none;
            `;
            content.appendChild(detector);
            
            // Monitor detector position
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            this.handleOverflow(page, index);
                        }
                    });
                },
                {
                    root: content,
                    threshold: 1.0
                }
            );
            
            observer.observe(detector);
            this.monitors.set(page, observer);
        });
    }

    // LAYER 2: Dynamic Content Reflow
    handleOverflow(page, pageIndex) {
        console.warn(`Overflow detected on page ${pageIndex + 1}`);
        
        const content = page.querySelector('.page-content');
        if (!content) return;
        
        // Strategy 1: Try to reduce spacing
        if (this.reduceSpacing(content)) {
            console.log('Fixed overflow by reducing spacing');
            return;
        }
        
        // Strategy 2: Move content to next page
        if (this.moveOverflowContent(page, content)) {
            console.log('Fixed overflow by moving content');
            return;
        }
        
        // Strategy 3: Split large elements
        if (this.splitLargeElements(content)) {
            console.log('Fixed overflow by splitting elements');
            return;
        }
        
        // Strategy 4: Create continuation page
        this.createContinuationPage(page, content);
    }

    reduceSpacing(content) {
        const elements = content.querySelectorAll('p, h2, h3, h4, ul, ol, .section');
        let reduced = false;
        
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const marginBottom = parseFloat(style.marginBottom);
            const marginTop = parseFloat(style.marginTop);
            
            if (marginBottom > 10) {
                el.style.marginBottom = `${marginBottom * 0.8}px`;
                reduced = true;
            }
            if (marginTop > 10) {
                el.style.marginTop = `${marginTop * 0.8}px`;
                reduced = true;
            }
        });
        
        return reduced && !this.checkOverflow(content);
    }

    moveOverflowContent(page, content) {
        const nextPage = page.nextElementSibling;
        if (!nextPage || !nextPage.classList.contains('page')) return false;
        
        const elements = Array.from(content.children);
        const contentHeight = this.getContentHeight(content);
        const maxHeight = this.config.pageHeight - this.config.marginTop - this.config.marginBottom - this.config.safeZoneBuffer;
        
        // Find elements that can be moved
        let heightAccumulator = 0;
        let elementsToMove = [];
        
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            const elHeight = el.offsetHeight;
            heightAccumulator += elHeight;
            
            if (contentHeight - heightAccumulator <= maxHeight) {
                elementsToMove = elements.slice(i);
                break;
            }
        }
        
        if (elementsToMove.length > 0) {
            const nextContent = nextPage.querySelector('.page-content');
            elementsToMove.forEach(el => {
                nextContent.insertBefore(el, nextContent.firstChild);
            });
            return true;
        }
        
        return false;
    }

    splitLargeElements(content) {
        const largeElements = content.querySelectorAll('ul, ol, .long-text');
        let split = false;
        
        largeElements.forEach(el => {
            if (el.offsetHeight > this.config.pageHeight * 0.6) {
                if (el.tagName === 'UL' || el.tagName === 'OL') {
                    this.splitList(el);
                    split = true;
                } else if (el.classList.contains('long-text')) {
                    this.splitParagraph(el);
                    split = true;
                }
            }
        });
        
        return split;
    }

    splitList(list) {
        const items = Array.from(list.children);
        const midpoint = Math.floor(items.length / 2);
        
        const newList = list.cloneNode(false);
        newList.classList.add('split-list');
        
        items.slice(midpoint).forEach(item => {
            newList.appendChild(item);
        });
        
        list.parentNode.insertBefore(newList, list.nextSibling);
    }

    // LAYER 3: Mutation Observer for Dynamic Content
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    this.scheduleValidation();
                }
            });
        });
        
        document.querySelectorAll('.page-content').forEach(content => {
            observer.observe(content, {
                childList: true,
                characterData: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    }

    // LAYER 4: Resize Observer for Layout Changes
    setupResizeObserver() {
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    if (entry.target.classList.contains('page-content')) {
                        this.validatePage(entry.target.closest('.page'));
                    }
                });
            });
            
            document.querySelectorAll('.page-content').forEach(content => {
                resizeObserver.observe(content);
            });
        }
    }

    // LAYER 5: Pre-print Validation
    setupPrintListeners() {
        window.addEventListener('beforeprint', () => {
            console.log('Running pre-print validation...');
            this.runFullValidation();
        });
        
        // Also intercept Cmd+P / Ctrl+P
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
                e.preventDefault();
                this.runFullValidation().then(() => {
                    window.print();
                });
            }
        });
    }

    // LAYER 6: Validation Rules Engine
    createValidationRules() {
        // Rule 1: No orphaned headers
        this.validationRules.push({
            name: 'no-orphaned-headers',
            validate: (page) => {
                const headers = page.querySelectorAll('h2, h3, h4');
                for (let header of headers) {
                    const rect = header.getBoundingClientRect();
                    const pageRect = page.getBoundingClientRect();
                    const spaceBelow = pageRect.bottom - rect.bottom;
                    
                    if (spaceBelow < this.config.headerBuffer) {
                        return {
                            valid: false,
                            message: `Orphaned header: ${header.textContent}`,
                            element: header
                        };
                    }
                }
                return { valid: true };
            }
        });
        
        // Rule 2: No content overflow
        this.validationRules.push({
            name: 'no-overflow',
            validate: (page) => {
                const content = page.querySelector('.page-content');
                if (this.checkOverflow(content)) {
                    return {
                        valid: false,
                        message: 'Content overflow detected',
                        element: content
                    };
                }
                return { valid: true };
            }
        });
        
        // Rule 3: Minimum content per page
        this.validationRules.push({
            name: 'minimum-content',
            validate: (page) => {
                const content = page.querySelector('.page-content');
                const height = this.getContentHeight(content);
                
                if (height < this.config.minContentHeight) {
                    return {
                        valid: false,
                        message: 'Page has insufficient content',
                        element: content
                    };
                }
                return { valid: true };
            }
        });
        
        // Rule 4: No broken tables
        this.validationRules.push({
            name: 'no-broken-tables',
            validate: (page) => {
                const tables = page.querySelectorAll('table');
                for (let table of tables) {
                    const rect = table.getBoundingClientRect();
                    const pageRect = page.getBoundingClientRect();
                    
                    if (rect.bottom > pageRect.bottom) {
                        return {
                            valid: false,
                            message: 'Table breaks across pages',
                            element: table
                        };
                    }
                }
                return { valid: true };
            }
        });
    }

    // Validation Runner
    async runFullValidation() {
        const results = [];
        const pages = document.querySelectorAll('.page');
        
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const pageResults = {
                pageNumber: i + 1,
                issues: []
            };
            
            for (let rule of this.validationRules) {
                const result = rule.validate(page);
                if (!result.valid) {
                    pageResults.issues.push({
                        rule: rule.name,
                        message: result.message,
                        element: result.element
                    });
                }
            }
            
            if (pageResults.issues.length > 0) {
                results.push(pageResults);
            }
        }
        
        if (results.length > 0) {
            this.showValidationReport(results);
            return false;
        }
        
        console.log('✅ All pagination validations passed!');
        return true;
    }

    // Validation Report UI
    showValidationReport(results) {
        const report = document.createElement('div');
        report.className = 'validation-report';
        report.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        let html = `
            <h2 style="color: #e74c3c; margin-bottom: 15px;">⚠️ Pagination Issues Detected</h2>
            <p style="margin-bottom: 20px;">Please fix these issues before printing:</p>
        `;
        
        results.forEach(pageResult => {
            html += `<h3>Page ${pageResult.pageNumber}</h3><ul>`;
            pageResult.issues.forEach(issue => {
                html += `<li><strong>${issue.rule}:</strong> ${issue.message}</li>`;
            });
            html += `</ul>`;
        });
        
        html += `
            <div style="margin-top: 20px; text-align: right;">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Close</button>
                <button onclick="paginationSafeguards.autoFix()" style="
                    background: #27ae60;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                ">Auto-Fix Issues</button>
            </div>
        `;
        
        report.innerHTML = html;
        document.body.appendChild(report);
    }

    // Auto-fix functionality
    autoFix() {
        console.log('Running auto-fix...');
        
        // Close report
        document.querySelector('.validation-report')?.remove();
        
        // Apply fixes
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            this.fixPage(page, index);
        });
        
        // Re-validate
        setTimeout(() => {
            this.runFullValidation();
        }, 1000);
    }

    fixPage(page, index) {
        const content = page.querySelector('.page-content');
        if (!content) return;
        
        // Fix orphaned headers
        this.fixOrphanedHeaders(content);
        
        // Fix overflow
        if (this.checkOverflow(content)) {
            this.handleOverflow(page, index);
        }
        
        // Fix broken tables
        this.fixBrokenTables(content);
    }

    fixOrphanedHeaders(content) {
        const headers = content.querySelectorAll('h2, h3, h4');
        headers.forEach(header => {
            const nextElements = [];
            let sibling = header.nextElementSibling;
            let count = 0;
            
            // Collect next 3 elements
            while (sibling && count < 3) {
                nextElements.push(sibling);
                sibling = sibling.nextElementSibling;
                count++;
            }
            
            // Add keep-together class
            const wrapper = document.createElement('div');
            wrapper.className = 'keep-together';
            header.parentNode.insertBefore(wrapper, header);
            wrapper.appendChild(header);
            nextElements.forEach(el => wrapper.appendChild(el));
        });
    }

    fixBrokenTables(content) {
        const tables = content.querySelectorAll('table');
        tables.forEach(table => {
            table.style.pageBreakInside = 'avoid';
            table.classList.add('keep-together');
            
            // If table is too large, try to make it smaller
            if (table.offsetHeight > this.config.pageHeight * 0.8) {
                table.style.fontSize = '0.9em';
                const cells = table.querySelectorAll('td, th');
                cells.forEach(cell => {
                    cell.style.padding = '0.3em 0.5em';
                });
            }
        });
    }

    // Utility methods
    checkOverflow(element) {
        return element.scrollHeight > element.clientHeight;
    }

    getContentHeight(element) {
        const children = Array.from(element.children);
        let totalHeight = 0;
        children.forEach(child => {
            totalHeight += child.offsetHeight;
        });
        return totalHeight;
    }

    scheduleValidation() {
        clearTimeout(this.validationTimeout);
        this.validationTimeout = setTimeout(() => {
            this.runFullValidation();
        }, 500);
    }

    createContinuationPage(currentPage, content) {
        const newPage = document.createElement('div');
        newPage.className = 'page';
        newPage.innerHTML = `
            <div class="page-content"></div>
            <div class="page-footer">
                <span>Continued...</span>
                <span class="page-number"></span>
            </div>
        `;
        
        currentPage.parentNode.insertBefore(newPage, currentPage.nextSibling);
        
        // Move overflow content
        const newContent = newPage.querySelector('.page-content');
        const elements = Array.from(content.children);
        const maxHeight = this.config.pageHeight - this.config.marginTop - this.config.marginBottom - this.config.safeZoneBuffer;
        
        let currentHeight = 0;
        let moveIndex = -1;
        
        for (let i = 0; i < elements.length; i++) {
            currentHeight += elements[i].offsetHeight;
            if (currentHeight > maxHeight) {
                moveIndex = i;
                break;
            }
        }
        
        if (moveIndex > 0) {
            elements.slice(moveIndex).forEach(el => {
                newContent.appendChild(el);
            });
        }
    }

    // Public API
    validatePage(page) {
        const results = [];
        for (let rule of this.validationRules) {
            const result = rule.validate(page);
            if (!result.valid) {
                results.push(result);
            }
        }
        return results;
    }

    getStats() {
        const pages = document.querySelectorAll('.page');
        let stats = {
            totalPages: pages.length,
            pagesWithOverflow: 0,
            orphanedHeaders: 0,
            brokenTables: 0,
            lowContentPages: 0
        };
        
        pages.forEach(page => {
            const results = this.validatePage(page);
            results.forEach(result => {
                if (result.message.includes('overflow')) stats.pagesWithOverflow++;
                if (result.message.includes('Orphaned')) stats.orphanedHeaders++;
                if (result.message.includes('Table')) stats.brokenTables++;
                if (result.message.includes('insufficient')) stats.lowContentPages++;
            });
        });
        
        return stats;
    }
}

// Initialize safeguards
const paginationSafeguards = new PaginationSafeguards();

// Add status indicator
const statusIndicator = document.createElement('div');
statusIndicator.id = 'pagination-status';
statusIndicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #27ae60;
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
`;
statusIndicator.innerHTML = `
    <span style="display: inline-block; width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 2s infinite;"></span>
    Pagination Safeguards Active
`;

document.body.appendChild(statusIndicator);

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('✅ Pagination Safeguards loaded and active');