/**
 * Advanced Pagination Testing Suite
 * Comprehensive validation for print-optimized documents
 */

class PaginationTestSuite {
    constructor() {
        this.testResults = [];
        this.config = {
            pageWidth: 8.5 * 96, // 8.5 inches in pixels at 96 DPI
            pageHeight: 11 * 96, // 11 inches in pixels at 96 DPI
            marginTop: 0.75 * 96,
            marginBottom: 0.75 * 96,
            marginLeft: 0.75 * 96,
            marginRight: 0.75 * 96,
            safeZone: 0.25 * 96, // Error boundary zone
            minOrphanLines: 2,
            minWidowLines: 2,
            headerKeepWithNext: 100, // pixels to keep with next element
        };
        this.initializeTestSuite();
    }

    initializeTestSuite() {
        // Create test report container
        this.createTestUI();
        this.attachPrintListeners();
        this.initializeObservers();
    }

    createTestUI() {
        const testPanel = document.createElement('div');
        testPanel.id = 'test-suite-panel';
        testPanel.className = 'test-suite-panel';
        testPanel.innerHTML = `
            <div class="test-panel-header">
                <h3>Pagination Test Suite</h3>
                <button onclick="testSuite.runAllTests()" class="run-all-btn">Run All Tests</button>
            </div>
            <div class="test-categories">
                <div class="test-category">
                    <h4>Layout Tests</h4>
                    <button onclick="testSuite.testPageDimensions()">Page Dimensions</button>
                    <button onclick="testSuite.testMarginCompliance()">Margin Compliance</button>
                    <button onclick="testSuite.testContentFlow()">Content Flow</button>
                    <button onclick="testSuite.testPageBreaks()">Page Breaks</button>
                </div>
                <div class="test-category">
                    <h4>Typography Tests</h4>
                    <button onclick="testSuite.testOrphansWidows()">Orphans & Widows</button>
                    <button onclick="testSuite.testHeaderPlacement()">Header Placement</button>
                    <button onclick="testSuite.testTextWrapping()">Text Wrapping</button>
                    <button onclick="testSuite.testHyphenation()">Hyphenation</button>
                </div>
                <div class="test-category">
                    <h4>Content Tests</h4>
                    <button onclick="testSuite.testTableSplitting()">Table Splitting</button>
                    <button onclick="testSuite.testImagePlacement()">Image Placement</button>
                    <button onclick="testSuite.testListContinuity()">List Continuity</button>
                    <button onclick="testSuite.testBoxElements()">Box Elements</button>
                </div>
                <div class="test-category">
                    <h4>Print Tests</h4>
                    <button onclick="testSuite.testPrintPreview()">Print Preview Match</button>
                    <button onclick="testSuite.testPrintMargins()">Print Margins</button>
                    <button onclick="testSuite.testPageNumbering()">Page Numbering</button>
                    <button onclick="testSuite.testPrintStyles()">Print-Only Styles</button>
                </div>
                <div class="test-category">
                    <h4>Advanced Tests</h4>
                    <button onclick="testSuite.testAccessibility()">Accessibility</button>
                    <button onclick="testSuite.testPerformance()">Performance</button>
                    <button onclick="testSuite.testBrowserCompat()">Browser Compatibility</button>
                    <button onclick="testSuite.stressTest()">Stress Test</button>
                </div>
            </div>
            <div class="test-results">
                <h4>Test Results</h4>
                <div id="test-results-container"></div>
            </div>
            <div class="test-actions">
                <button onclick="testSuite.exportTestReport()">Export Report</button>
                <button onclick="testSuite.clearResults()">Clear Results</button>
                <button onclick="testSuite.toggleAutoTest()">Auto-Test: <span id="auto-test-status">OFF</span></button>
            </div>
        `;
        document.body.appendChild(testPanel);
        this.addTestStyles();
    }

    addTestStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .test-suite-panel {
                position: fixed;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 300px;
                max-height: 90vh;
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 9999;
                overflow-y: auto;
                font-family: -apple-system, sans-serif;
            }
            
            .test-panel-header {
                background: #333;
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .test-panel-header h3 {
                margin: 0;
                font-size: 16px;
            }
            
            .run-all-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .test-category {
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .test-category h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #666;
            }
            
            .test-category button {
                display: block;
                width: 100%;
                padding: 8px;
                margin-bottom: 5px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                transition: all 0.2s;
            }
            
            .test-category button:hover {
                background: #e8e8e8;
                border-color: #999;
            }
            
            .test-results {
                padding: 15px;
                max-height: 300px;
                overflow-y: auto;
                background: #f9f9f9;
            }
            
            .test-result {
                padding: 8px;
                margin-bottom: 5px;
                border-radius: 4px;
                font-size: 12px;
                border-left: 4px solid;
            }
            
            .test-result.pass {
                background: #d4edda;
                border-color: #28a745;
                color: #155724;
            }
            
            .test-result.fail {
                background: #f8d7da;
                border-color: #dc3545;
                color: #721c24;
            }
            
            .test-result.warning {
                background: #fff3cd;
                border-color: #ffc107;
                color: #856404;
            }
            
            .test-result.info {
                background: #d1ecf1;
                border-color: #17a2b8;
                color: #0c5460;
            }
            
            .test-actions {
                padding: 15px;
                background: #f5f5f5;
                border-top: 1px solid #ddd;
            }
            
            .test-actions button {
                width: 100%;
                padding: 8px;
                margin-bottom: 5px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            }
            
            .test-highlight {
                outline: 3px solid red !important;
                outline-offset: 2px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { outline-color: red; }
                50% { outline-color: orange; }
                100% { outline-color: red; }
            }
            
            .margin-violation {
                background: rgba(255, 0, 0, 0.2) !important;
            }
            
            .overflow-indicator {
                position: absolute;
                right: 0;
                bottom: 0;
                background: red;
                color: white;
                padding: 2px 6px;
                font-size: 10px;
                font-weight: bold;
                z-index: 9999;
            }
            
            @media print {
                .test-suite-panel {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Core Testing Methods

    async runAllTests() {
        this.clearResults();
        this.logResult('info', 'Starting comprehensive test suite...');
        
        const tests = [
            () => this.testPageDimensions(),
            () => this.testMarginCompliance(),
            () => this.testContentFlow(),
            () => this.testPageBreaks(),
            () => this.testOrphansWidows(),
            () => this.testHeaderPlacement(),
            () => this.testTextWrapping(),
            () => this.testHyphenation(),
            () => this.testTableSplitting(),
            () => this.testImagePlacement(),
            () => this.testListContinuity(),
            () => this.testBoxElements(),
            () => this.testPrintPreview(),
            () => this.testPrintMargins(),
            () => this.testPageNumbering(),
            () => this.testPrintStyles(),
            () => this.testAccessibility(),
            () => this.testPerformance(),
            () => this.testBrowserCompat()
        ];

        for (const test of tests) {
            await test();
            await this.sleep(100); // Brief pause between tests
        }

        this.generateTestSummary();
    }

    // Layout Tests

    testPageDimensions() {
        this.logResult('info', 'Testing page dimensions...');
        const pages = document.querySelectorAll('.page');
        let issues = 0;

        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const expectedWidth = this.config.pageWidth;
            const expectedHeight = this.config.pageHeight;
            
            const widthDiff = Math.abs(rect.width - expectedWidth);
            const heightDiff = Math.abs(rect.height - expectedHeight);
            
            if (widthDiff > 1 || heightDiff > 1) {
                this.logResult('fail', `Page ${index + 1}: Incorrect dimensions. Expected ${expectedWidth}x${expectedHeight}px, got ${rect.width}x${rect.height}px`);
                issues++;
                this.highlightElement(page);
            }
        });

        if (issues === 0) {
            this.logResult('pass', `All ${pages.length} pages have correct dimensions`);
        }
        return issues === 0;
    }

    testMarginCompliance() {
        this.logResult('info', 'Testing margin compliance...');
        const pages = document.querySelectorAll('.page');
        let violations = 0;

        pages.forEach((page, pageIndex) => {
            const pageRect = page.getBoundingClientRect();
            const elements = page.querySelectorAll('*');
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const style = window.getComputedStyle(element);
                
                // Skip absolute positioned elements
                if (style.position === 'absolute') return;
                
                // Check margin violations
                const leftViolation = rect.left < (pageRect.left + this.config.marginLeft - this.config.safeZone);
                const rightViolation = rect.right > (pageRect.right - this.config.marginRight + this.config.safeZone);
                const topViolation = rect.top < (pageRect.top + this.config.marginTop - this.config.safeZone);
                const bottomViolation = rect.bottom > (pageRect.bottom - this.config.marginBottom + this.config.safeZone);
                
                if (leftViolation || rightViolation || topViolation || bottomViolation) {
                    violations++;
                    element.classList.add('margin-violation');
                    this.logResult('fail', `Page ${pageIndex + 1}: Margin violation - ${element.tagName} extends beyond safe zone`);
                }
            });
        });

        if (violations === 0) {
            this.logResult('pass', 'No margin violations detected');
        } else {
            this.logResult('fail', `Found ${violations} margin violations`);
        }
        return violations === 0;
    }

    testContentFlow() {
        this.logResult('info', 'Testing content flow between pages...');
        const pages = document.querySelectorAll('.page');
        let issues = 0;

        for (let i = 0; i < pages.length - 1; i++) {
            const currentPage = pages[i];
            const nextPage = pages[i + 1];
            
            const currentContent = currentPage.querySelector('.page-content');
            const nextContent = nextPage.querySelector('.page-content');
            
            if (currentContent && nextContent) {
                // Check if content properly flows
                const currentLastElement = currentContent.lastElementChild;
                const nextFirstElement = nextContent.firstElementChild;
                
                if (currentLastElement && nextFirstElement) {
                    // Check for split paragraphs
                    if (currentLastElement.tagName === 'P' && nextFirstElement.tagName === 'P') {
                        const currentText = currentLastElement.textContent.trim();
                        const nextText = nextFirstElement.textContent.trim();
                        
                        // Check if sentence is split
                        if (!currentText.match(/[.!?]$/) && nextText.match(/^[a-z]/)) {
                            this.logResult('warning', `Potential split sentence between pages ${i + 1} and ${i + 2}`);
                            issues++;
                        }
                    }
                }
            }
        }

        if (issues === 0) {
            this.logResult('pass', 'Content flows properly between pages');
        }
        return issues === 0;
    }

    testPageBreaks() {
        this.logResult('info', 'Testing page break rules...');
        let issues = 0;

        // Test elements that should avoid breaks
        const avoidBreakSelectors = [
            'h1, h2, h3, h4, h5, h6',
            'table',
            'figure',
            '.keep-together',
            '.info-box, .alert-box, .warning-box'
        ];

        avoidBreakSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this.isElementSplitAcrossPages(element)) {
                    this.logResult('fail', `${element.tagName} is split across pages`);
                    this.highlightElement(element);
                    issues++;
                }
            });
        });

        // Test keep-with-next
        const keepWithNextElements = document.querySelectorAll('.keep-with-next');
        keepWithNextElements.forEach(element => {
            const next = element.nextElementSibling;
            if (next && !this.areElementsOnSamePage(element, next)) {
                this.logResult('fail', 'Keep-with-next rule violated');
                issues++;
            }
        });

        if (issues === 0) {
            this.logResult('pass', 'All page break rules are respected');
        }
        return issues === 0;
    }

    // Typography Tests

    testOrphansWidows() {
        this.logResult('info', 'Testing orphans and widows...');
        const pages = document.querySelectorAll('.page');
        let issues = 0;

        pages.forEach((page, pageIndex) => {
            const content = page.querySelector('.page-content');
            if (!content) return;

            // Check for orphaned headers
            const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headers.forEach(header => {
                const rect = header.getBoundingClientRect();
                const pageRect = page.getBoundingClientRect();
                const distanceToBottom = pageRect.bottom - rect.bottom;
                
                if (distanceToBottom < this.config.headerKeepWithNext) {
                    const nextSibling = header.nextElementSibling;
                    if (!nextSibling || !this.areElementsOnSamePage(header, nextSibling)) {
                        this.logResult('fail', `Orphaned header on page ${pageIndex + 1}: "${header.textContent.substring(0, 30)}..."`);
                        this.highlightElement(header);
                        issues++;
                    }
                }
            });

            // Check for widowed lines in paragraphs
            const paragraphs = content.querySelectorAll('p');
            paragraphs.forEach(p => {
                const lines = this.getTextLines(p);
                if (lines.length > 0) {
                    // Check if paragraph starts at bottom of page
                    const firstLineRect = lines[0].getBoundingClientRect();
                    const pageTop = pageRect.top + this.config.marginTop;
                    if (firstLineRect.top - pageTop < 50 && pageIndex > 0) {
                        if (lines.length < this.config.minWidowLines) {
                            this.logResult('warning', `Widow: Only ${lines.length} line(s) at top of page ${pageIndex + 1}`);
                            issues++;
                        }
                    }
                    
                    // Check if paragraph ends at top of page
                    const lastLineRect = lines[lines.length - 1].getBoundingClientRect();
                    const pageBottom = pageRect.bottom - this.config.marginBottom;
                    if (pageBottom - lastLineRect.bottom < 50) {
                        if (lines.length < this.config.minOrphanLines) {
                            this.logResult('warning', `Orphan: Only ${lines.length} line(s) at bottom of page ${pageIndex + 1}`);
                            issues++;
                        }
                    }
                }
            });
        });

        if (issues === 0) {
            this.logResult('pass', 'No orphan or widow violations found');
        }
        return issues === 0;
    }

    testHeaderPlacement() {
        this.logResult('info', 'Testing header placement...');
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let issues = 0;

        headers.forEach(header => {
            const page = header.closest('.page');
            if (!page) return;

            const headerRect = header.getBoundingClientRect();
            const pageRect = page.getBoundingClientRect();
            
            // Check distance to bottom of page
            const distanceToBottom = pageRect.bottom - headerRect.bottom;
            
            if (distanceToBottom < 100) { // Less than ~1 inch
                const nextElement = header.nextElementSibling;
                if (!nextElement || !this.areElementsOnSamePage(header, nextElement)) {
                    this.logResult('fail', `Header too close to page bottom: "${header.textContent.substring(0, 30)}..."`);
                    issues++;
                }
            }
        });

        if (issues === 0) {
            this.logResult('pass', 'All headers are properly placed');
        }
        return issues === 0;
    }

    testTextWrapping() {
        this.logResult('info', 'Testing text wrapping...');
        const textElements = document.querySelectorAll('p, li, td');
        let issues = 0;

        textElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const page = element.closest('.page');
            if (!page) return;

            const pageRect = page.getBoundingClientRect();
            const maxWidth = pageRect.width - this.config.marginLeft - this.config.marginRight;
            
            // Check if text exceeds available width
            if (element.scrollWidth > rect.width + 1) {
                this.logResult('fail', `Text overflow in ${element.tagName}: "${element.textContent.substring(0, 30)}..."`);
                this.highlightElement(element);
                issues++;
            }
            
            // Check for very long words that might not wrap
            const words = element.textContent.split(/\s+/);
            words.forEach(word => {
                if (word.length > 30 && !word.includes('-')) {
                    this.logResult('warning', `Long word without hyphens: "${word}"`);
                }
            });
        });

        if (issues === 0) {
            this.logResult('pass', 'Text wrapping is functioning correctly');
        }
        return issues === 0;
    }

    testHyphenation() {
        this.logResult('info', 'Testing hyphenation...');
        const paragraphs = document.querySelectorAll('p');
        let hasHyphenation = false;
        let issues = 0;

        paragraphs.forEach(p => {
            const style = window.getComputedStyle(p);
            if (style.hyphens === 'auto' || style.webkitHyphens === 'auto') {
                hasHyphenation = true;
            } else if (style.textAlign === 'justify') {
                this.logResult('warning', 'Justified text without automatic hyphenation may cause spacing issues');
                issues++;
            }
        });

        if (hasHyphenation) {
            this.logResult('pass', 'Hyphenation is enabled for better text flow');
        } else {
            this.logResult('warning', 'Consider enabling automatic hyphenation for better text distribution');
        }
        return issues === 0;
    }

    // Content Tests

    testTableSplitting() {
        this.logResult('info', 'Testing table splitting behavior...');
        const tables = document.querySelectorAll('table');
        let issues = 0;

        tables.forEach((table, index) => {
            if (this.isElementSplitAcrossPages(table)) {
                // Check if headers repeat
                const thead = table.querySelector('thead');
                if (thead) {
                    const theadDisplay = window.getComputedStyle(thead).display;
                    if (theadDisplay !== 'table-header-group') {
                        this.logResult('warning', `Table ${index + 1}: Headers may not repeat on new pages`);
                        issues++;
                    }
                }
                
                // Check for split rows
                const rows = table.querySelectorAll('tr');
                rows.forEach((row, rowIndex) => {
                    if (this.isElementSplitAcrossPages(row)) {
                        this.logResult('fail', `Table ${index + 1}, Row ${rowIndex + 1}: Row is split across pages`);
                        this.highlightElement(row);
                        issues++;
                    }
                });
            }
        });

        if (issues === 0) {
            this.logResult('pass', 'Tables split correctly across pages');
        }
        return issues === 0;
    }

    testImagePlacement() {
        this.logResult('info', 'Testing image placement...');
        const images = document.querySelectorAll('img');
        let issues = 0;

        images.forEach((img, index) => {
            const rect = img.getBoundingClientRect();
            const page = img.closest('.page');
            if (!page) return;

            const pageRect = page.getBoundingClientRect();
            
            // Check if image fits within page
            if (rect.height > (pageRect.height - this.config.marginTop - this.config.marginBottom)) {
                this.logResult('fail', `Image ${index + 1} exceeds page height`);
                issues++;
            }
            
            // Check if image is cut off
            if (this.isElementSplitAcrossPages(img)) {
                this.logResult('fail', `Image ${index + 1} is split across pages`);
                this.highlightElement(img);
                issues++;
            }
            
            // Check figure captions
            const figure = img.closest('figure');
            if (figure) {
                const caption = figure.querySelector('figcaption');
                if (caption && !this.areElementsOnSamePage(img, caption)) {
                    this.logResult('fail', `Image ${index + 1} separated from its caption`);
                    issues++;
                }
            }
        });

        if (issues === 0) {
            this.logResult('pass', 'All images are properly placed');
        }
        return issues === 0;
    }

    testListContinuity() {
        this.logResult('info', 'Testing list continuity...');
        const lists = document.querySelectorAll('ul, ol');
        let issues = 0;

        lists.forEach((list, index) => {
            const items = list.querySelectorAll('li');
            
            items.forEach((item, itemIndex) => {
                // Check if list item is split
                if (this.isElementSplitAcrossPages(item)) {
                    // Check if it's a simple item or has nested content
                    const hasNestedList = item.querySelector('ul, ol');
                    if (!hasNestedList) {
                        this.logResult('warning', `List ${index + 1}, Item ${itemIndex + 1}: Item split across pages`);
                        issues++;
                    }
                }
            });
            
            // Check if list starts at very bottom of page
            const firstItem = items[0];
            if (firstItem) {
                const page = firstItem.closest('.page');
                const itemRect = firstItem.getBoundingClientRect();
                const pageRect = page.getBoundingClientRect();
                
                if (pageRect.bottom - itemRect.bottom < 50) {
                    this.logResult('warning', `List ${index + 1} starts too close to page bottom`);
                    issues++;
                }
            }
        });

        if (issues === 0) {
            this.logResult('pass', 'Lists maintain proper continuity');
        }
        return issues === 0;
    }

    testBoxElements() {
        this.logResult('info', 'Testing box elements (info, alert, warning boxes)...');
        const boxes = document.querySelectorAll('.info-box, .alert-box, .warning-box');
        let issues = 0;

        boxes.forEach((box, index) => {
            // Check if box is split across pages
            if (this.isElementSplitAcrossPages(box)) {
                this.logResult('fail', `Box element ${index + 1} is split across pages`);
                this.highlightElement(box);
                issues++;
            }
            
            // Check if box fits on page
            const rect = box.getBoundingClientRect();
            const page = box.closest('.page');
            if (page) {
                const pageRect = page.getBoundingClientRect();
                const availableHeight = pageRect.height - this.config.marginTop - this.config.marginBottom;
                
                if (rect.height > availableHeight) {
                    this.logResult('fail', `Box element ${index + 1} exceeds available page height`);
                    issues++;
                }
            }
        });

        if (issues === 0) {
            this.logResult('pass', 'All box elements are properly contained');
        }
        return issues === 0;
    }

    // Print Tests

    async testPrintPreview() {
        this.logResult('info', 'Testing print preview accuracy...');
        
        // Create a hidden iframe for print testing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '8.5in';
        iframe.style.height = '11in';
        document.body.appendChild(iframe);
        
        // Copy document content to iframe
        iframe.contentDocument.write(document.documentElement.outerHTML);
        iframe.contentDocument.close();
        
        // Wait for content to load
        await this.sleep(1000);
        
        // Compare layouts
        const originalPages = document.querySelectorAll('.page');
        const printPages = iframe.contentDocument.querySelectorAll('.page');
        
        let matches = true;
        if (originalPages.length !== printPages.length) {
            this.logResult('fail', `Page count mismatch: Screen has ${originalPages.length}, Print has ${printPages.length}`);
            matches = false;
        }
        
        // Clean up
        document.body.removeChild(iframe);
        
        if (matches) {
            this.logResult('pass', 'Print preview matches screen layout');
        }
        return matches;
    }

    testPrintMargins() {
        this.logResult('info', 'Testing print margin settings...');
        const styles = document.styleSheets;
        let hasPageRule = false;
        let issues = 0;
        
        // Check for @page rules
        for (let sheet of styles) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (let rule of rules) {
                    if (rule instanceof CSSPageRule) {
                        hasPageRule = true;
                        const margin = rule.style.margin;
                        if (!margin || margin !== '0.75in') {
                            this.logResult('warning', 'Print margins differ from screen margins');
                            issues++;
                        }
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets will throw
                continue;
            }
        }
        
        if (!hasPageRule) {
            this.logResult('warning', 'No @page rule found for print margins');
            issues++;
        }
        
        if (issues === 0) {
            this.logResult('pass', 'Print margins are properly configured');
        }
        return issues === 0;
    }

    testPageNumbering() {
        this.logResult('info', 'Testing page numbering...');
        const pages = document.querySelectorAll('.page');
        let hasNumbering = false;
        let issues = 0;
        
        // Check CSS counter
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle.counterReset && bodyStyle.counterReset.includes('page')) {
            hasNumbering = true;
        }
        
        // Check for page number elements
        pages.forEach((page, index) => {
            const pageNumber = page.querySelector('.page-number');
            if (!pageNumber && index > 0) { // Skip cover page
                this.logResult('warning', `Page ${index + 1} missing page number element`);
            }
        });
        
        // Check print CSS for page numbers
        const hasPrintNumbers = this.checkForPrintPageNumbers();
        
        if (hasNumbering || hasPrintNumbers) {
            this.logResult('pass', 'Page numbering is implemented');
        } else {
            this.logResult('warning', 'Consider implementing automatic page numbering');
            issues++;
        }
        return issues === 0;
    }

    testPrintStyles() {
        this.logResult('info', 'Testing print-specific styles...');
        let issues = 0;
        
        // Check for print media queries
        const hasPrintStyles = this.checkForPrintMediaQueries();
        if (!hasPrintStyles) {
            this.logResult('warning', 'No print-specific styles found');
            issues++;
        }
        
        // Check color handling
        const colorElements = document.querySelectorAll('.info-box, .alert-box, .warning-box');
        colorElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const printColorAdjust = style.printColorAdjust || style.webkitPrintColorAdjust;
            if (printColorAdjust !== 'exact') {
                this.logResult('warning', 'Important colored elements may not print with colors');
                issues++;
                return; // Use return instead of break in forEach
            }
        });
        
        // Check for no-print elements
        const noPrintElements = document.querySelectorAll('.no-print');
        if (noPrintElements.length > 0) {
            this.logResult('info', `${noPrintElements.length} elements marked as no-print`);
        }
        
        if (issues === 0) {
            this.logResult('pass', 'Print styles are properly configured');
        }
        return issues === 0;
    }

    // Advanced Tests

    testAccessibility() {
        this.logResult('info', 'Testing accessibility features...');
        let issues = 0;
        
        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                this.logResult('warning', `Heading hierarchy skip: H${lastLevel} to H${level}`);
                issues++;
            }
            lastLevel = level;
        });
        
        // Check images for alt text
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.alt) {
                this.logResult('fail', `Image ${index + 1} missing alt text`);
                issues++;
            }
        });
        
        // Check color contrast
        const textElements = document.querySelectorAll('p, li, td');
        const sampleSize = Math.min(10, textElements.length);
        for (let i = 0; i < sampleSize; i++) {
            const element = textElements[i];
            const style = window.getComputedStyle(element);
            const contrast = this.calculateContrast(style.color, style.backgroundColor);
            if (contrast < 4.5) {
                this.logResult('warning', 'Low color contrast detected');
                issues++;
                break;
            }
        }
        
        if (issues === 0) {
            this.logResult('pass', 'Accessibility checks passed');
        }
        return issues === 0;
    }

    async testPerformance() {
        this.logResult('info', 'Testing performance metrics...');
        const startTime = performance.now();
        
        // Test render performance
        const pages = document.querySelectorAll('.page');
        const renderTime = performance.now() - startTime;
        
        if (renderTime > 1000) {
            this.logResult('warning', `Slow initial render: ${renderTime.toFixed(0)}ms`);
        } else {
            this.logResult('pass', `Fast render time: ${renderTime.toFixed(0)}ms`);
        }
        
        // Test memory usage
        if (performance.memory) {
            const memoryMB = performance.memory.usedJSHeapSize / 1048576;
            if (memoryMB > 100) {
                this.logResult('warning', `High memory usage: ${memoryMB.toFixed(1)}MB`);
            } else {
                this.logResult('pass', `Memory usage: ${memoryMB.toFixed(1)}MB`);
            }
        }
        
        // Test reflow performance
        const reflowStart = performance.now();
        pages.forEach(page => {
            page.getBoundingClientRect(); // Force reflow
        });
        const reflowTime = performance.now() - reflowStart;
        
        if (reflowTime > 100) {
            this.logResult('warning', `Slow reflow: ${reflowTime.toFixed(0)}ms`);
        } else {
            this.logResult('pass', `Fast reflow: ${reflowTime.toFixed(0)}ms`);
        }
        
        return true;
    }

    testBrowserCompat() {
        this.logResult('info', 'Testing browser compatibility...');
        let issues = 0;
        
        // Check for required CSS features
        const requiredFeatures = [
            { property: 'break-inside', value: 'avoid' },
            { property: 'break-after', value: 'page' },
            { property: 'orphans', value: '2' },
            { property: 'widows', value: '2' }
        ];
        
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        
        requiredFeatures.forEach(feature => {
            testElement.style[feature.property] = feature.value;
            const computed = window.getComputedStyle(testElement)[feature.property];
            if (!computed || computed === 'auto') {
                this.logResult('warning', `Browser may not support ${feature.property}`);
                issues++;
            }
        });
        
        document.body.removeChild(testElement);
        
        // Check for print features
        if (!window.matchMedia('print').matches && window.matchMedia) {
            this.logResult('pass', 'Print media queries supported');
        }
        
        // Browser detection
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) {
            this.logResult('info', 'Chrome detected - full support expected');
        } else if (userAgent.includes('Firefox')) {
            this.logResult('info', 'Firefox detected - good support expected');
        } else if (userAgent.includes('Safari')) {
            this.logResult('warning', 'Safari detected - some features may vary');
        } else if (userAgent.includes('Edge')) {
            this.logResult('info', 'Edge detected - good support expected');
        }
        
        if (issues === 0) {
            this.logResult('pass', 'Browser compatibility checks passed');
        }
        return issues === 0;
    }

    async stressTest() {
        this.logResult('info', 'Running stress test...');
        
        // Add lots of content dynamically
        const testContainer = document.createElement('div');
        testContainer.id = 'stress-test-container';
        testContainer.innerHTML = `
            <div class="page">
                <div class="page-content">
                    <h1>Stress Test Page</h1>
        `;
        
        // Add various content types
        for (let i = 0; i < 100; i++) {
            testContainer.innerHTML += `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${i}</p>
                <ul>
                    <li>Item ${i * 3}</li>
                    <li>Item ${i * 3 + 1}</li>
                    <li>Item ${i * 3 + 2}</li>
                </ul>
            `;
            
            if (i % 10 === 0) {
                testContainer.innerHTML += `
                    <table>
                        <tr><th>Header 1</th><th>Header 2</th></tr>
                        <tr><td>Data ${i}</td><td>Data ${i + 1}</td></tr>
                    </table>
                    <div class="info-box">
                        <h4>Info Box ${i / 10}</h4>
                        <p>Test content for stress testing.</p>
                    </div>
                `;
            }
        }
        
        testContainer.innerHTML += `
                </div>
            </div>
        `;
        
        document.body.appendChild(testContainer);
        
        // Wait for render
        await this.sleep(500);
        
        // Test performance with heavy content
        const startTime = performance.now();
        const stressPages = testContainer.querySelectorAll('.page');
        const renderTime = performance.now() - startTime;
        
        // Clean up
        document.body.removeChild(testContainer);
        
        if (renderTime < 2000) {
            this.logResult('pass', `Stress test passed: ${renderTime.toFixed(0)}ms render time`);
        } else {
            this.logResult('warning', `Slow performance under stress: ${renderTime.toFixed(0)}ms`);
        }
        
        return true;
    }

    // Helper Methods

    isElementSplitAcrossPages(element) {
        const rect = element.getBoundingClientRect();
        const pages = document.querySelectorAll('.page');
        
        for (let i = 0; i < pages.length - 1; i++) {
            const pageRect = pages[i].getBoundingClientRect();
            const nextPageRect = pages[i + 1].getBoundingClientRect();
            
            // Check if element starts in one page and ends in another
            if (rect.top < pageRect.bottom && rect.bottom > nextPageRect.top) {
                return true;
            }
        }
        return false;
    }

    areElementsOnSamePage(element1, element2) {
        const page1 = element1.closest('.page');
        const page2 = element2.closest('.page');
        return page1 === page2;
    }

    getTextLines(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const rects = range.getClientRects();
        return Array.from(rects);
    }

    highlightElement(element) {
        element.classList.add('test-highlight');
        setTimeout(() => {
            element.classList.remove('test-highlight');
        }, 3000);
    }

    calculateContrast(color1, color2) {
        // Simplified contrast calculation
        const getLuminance = (color) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            const [r, g, b] = rgb.map(Number);
            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        };
        
        const l1 = getLuminance(color1);
        const l2 = getLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    checkForPrintMediaQueries() {
        for (let sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (let rule of rules) {
                    if (rule instanceof CSSMediaRule && rule.media.mediaText.includes('print')) {
                        return true;
                    }
                }
            } catch (e) {
                continue;
            }
        }
        return false;
    }

    checkForPrintPageNumbers() {
        for (let sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (let rule of rules) {
                    if (rule.selectorText && rule.selectorText.includes('@bottom')) {
                        return true;
                    }
                }
            } catch (e) {
                continue;
            }
        }
        return false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Result Management

    logResult(type, message) {
        const result = {
            type,
            message,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const container = document.getElementById('test-results-container');
        const resultDiv = document.createElement('div');
        resultDiv.className = `test-result ${type}`;
        resultDiv.textContent = message;
        container.appendChild(resultDiv);
        container.scrollTop = container.scrollHeight;
    }

    clearResults() {
        this.testResults = [];
        document.getElementById('test-results-container').innerHTML = '';
    }

    generateTestSummary() {
        const summary = {
            total: this.testResults.length,
            passed: this.testResults.filter(r => r.type === 'pass').length,
            failed: this.testResults.filter(r => r.type === 'fail').length,
            warnings: this.testResults.filter(r => r.type === 'warning').length,
            info: this.testResults.filter(r => r.type === 'info').length
        };
        
        const scorePercent = (summary.passed / (summary.passed + summary.failed)) * 100;
        
        this.logResult('info', '=== TEST SUMMARY ===');
        this.logResult('info', `Total tests: ${summary.total}`);
        this.logResult('info', `Passed: ${summary.passed}`);
        this.logResult('info', `Failed: ${summary.failed}`);
        this.logResult('info', `Warnings: ${summary.warnings}`);
        this.logResult('info', `Score: ${scorePercent.toFixed(1)}%`);
        
        if (scorePercent === 100) {
            this.logResult('pass', 'Perfect score! Document is print-ready.');
        } else if (scorePercent >= 80) {
            this.logResult('warning', 'Good score. Address failures for best results.');
        } else {
            this.logResult('fail', 'Multiple issues found. Review and fix failures.');
        }
    }

    exportTestReport() {
        const report = {
            documentTitle: document.title,
            testDate: new Date().toISOString(),
            testResults: this.testResults,
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.type === 'pass').length,
                failed: this.testResults.filter(r => r.type === 'fail').length,
                warnings: this.testResults.filter(r => r.type === 'warning').length
            },
            browserInfo: {
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            },
            documentInfo: {
                pageCount: document.querySelectorAll('.page').length,
                wordCount: document.body.textContent.split(/\s+/).length
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pagination-test-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.logResult('info', 'Test report exported');
    }

    // Auto-test functionality
    toggleAutoTest() {
        this.autoTest = !this.autoTest;
        document.getElementById('auto-test-status').textContent = this.autoTest ? 'ON' : 'OFF';
        
        if (this.autoTest) {
            this.startAutoTesting();
        } else {
            this.stopAutoTesting();
        }
    }

    startAutoTesting() {
        // Set up mutation observer for content changes
        this.observer = new MutationObserver((mutations) => {
            clearTimeout(this.autoTestTimeout);
            this.autoTestTimeout = setTimeout(() => {
                this.runAllTests();
            }, 1000);
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
        
        this.logResult('info', 'Auto-testing enabled');
    }

    stopAutoTesting() {
        if (this.observer) {
            this.observer.disconnect();
        }
        clearTimeout(this.autoTestTimeout);
        this.logResult('info', 'Auto-testing disabled');
    }

    // Print event listeners
    attachPrintListeners() {
        window.addEventListener('beforeprint', () => {
            this.logResult('info', 'Print dialog opened');
            this.testPrintPreview();
        });
        
        window.addEventListener('afterprint', () => {
            this.logResult('info', 'Print dialog closed');
        });
    }

    // Intersection Observer for real-time monitoring
    initializeObservers() {
        // Monitor elements entering danger zones
        const options = {
            root: null,
            rootMargin: `-${this.config.marginTop}px -${this.config.marginRight}px -${this.config.marginBottom}px -${this.config.marginLeft}px`,
            threshold: 0
        };
        
        this.marginObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.classList.add('margin-violation');
                } else {
                    entry.target.classList.remove('margin-violation');
                }
            });
        }, options);
        
        // Start observing content elements
        const contentElements = document.querySelectorAll('.page-content > *');
        contentElements.forEach(element => {
            this.marginObserver.observe(element);
        });
    }
}

// Initialize test suite
const testSuite = new PaginationTestSuite();

// Make it globally available
window.testSuite = testSuite;