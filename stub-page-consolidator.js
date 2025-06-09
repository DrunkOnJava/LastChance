/**
 * Stub Page Consolidator for BMPOA Document
 * Identifies and consolidates pages with minimal content
 */

class StubPageConsolidator {
    constructor() {
        this.minContentHeight = 3 * 96; // 3 inches minimum for a full page
        this.stubThreshold = 2 * 96; // 2 inches or less = stub page
        this.consolidatedPages = [];
    }
    
    analyzeAndConsolidate() {
        console.log('Starting stub page analysis...');
        
        // Identify stub pages
        const stubPages = this.identifyStubPages();
        console.log(`Found ${stubPages.length} stub pages`);
        
        // Group pages by section
        const sectionGroups = this.groupPagesBySections();
        
        // Consolidate within sections
        this.consolidateStubPages(stubPages, sectionGroups);
        
        // Reflow document
        this.reflowAfterConsolidation();
        
        console.log('Stub page consolidation complete!');
    }
    
    identifyStubPages() {
        const pages = document.querySelectorAll('.page');
        const stubPages = [];
        
        pages.forEach((page, index) => {
            const pageNumber = index + 1;
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Skip special pages
            if (page.getAttribute('data-template') === 'cover' ||
                page.getAttribute('data-template') === 'toc' ||
                page.getAttribute('data-template') === 'back-cover') {
                return;
            }
            
            // Calculate meaningful content height (excluding headers/footers)
            const meaningfulElements = Array.from(content.children).filter(el => 
                !el.classList.contains('professional-header') &&
                !el.classList.contains('page-footer') &&
                !el.classList.contains('professional-footer')
            );
            
            let totalHeight = 0;
            meaningfulElements.forEach(el => {
                totalHeight += el.offsetHeight || this.estimateHeight(el);
            });
            
            // Check if it's a stub
            if (totalHeight < this.stubThreshold && meaningfulElements.length > 0) {
                stubPages.push({
                    page,
                    pageNumber,
                    content,
                    contentHeight: totalHeight,
                    elements: meaningfulElements,
                    section: this.identifySection(page, meaningfulElements)
                });
                
                console.log(`Page ${pageNumber} is a stub (${Math.round(totalHeight / 96 * 10) / 10}" of content)`);
            }
        });
        
        return stubPages;
    }
    
    identifySection(page, elements) {
        // Check for chapter start
        if (page.getAttribute('data-template') === 'chapter-start') {
            const h1 = page.querySelector('h1');
            if (h1) return h1.textContent.trim();
        }
        
        // Check for section headers
        for (let el of elements) {
            if (el.matches('h1, h2')) {
                return el.textContent.trim();
            }
        }
        
        // Check content for section clues
        const textContent = page.textContent;
        if (textContent.includes('Emergency')) return 'Emergency Information';
        if (textContent.includes('Governance')) return 'Governance';
        if (textContent.includes('Fire') && textContent.includes('Safety')) return 'Fire Safety';
        if (textContent.includes('Wildlife') || textContent.includes('Bear')) return 'Wildlife Safety';
        if (textContent.includes('Committee')) return 'Committees';
        if (textContent.includes('Community') && textContent.includes('Life')) return 'Community Life';
        if (textContent.includes('Nature') || textContent.includes('Conservation')) return 'Nature & Conservation';
        if (textContent.includes('Service') || textContent.includes('Utilities')) return 'Services & Utilities';
        if (textContent.includes('Construction') || textContent.includes('Building')) return 'Construction Guidelines';
        
        return 'General';
    }
    
    groupPagesBySections() {
        const pages = document.querySelectorAll('.page');
        const sections = new Map();
        let currentSection = 'Introduction';
        
        pages.forEach((page, index) => {
            // Update section based on content
            const newSection = this.identifySection(page, Array.from(page.querySelectorAll('.page-content > *')));
            if (newSection !== 'General') {
                currentSection = newSection;
            }
            
            if (!sections.has(currentSection)) {
                sections.set(currentSection, []);
            }
            
            sections.get(currentSection).push({
                page,
                pageNumber: index + 1,
                isStub: false // Will be updated
            });
        });
        
        return sections;
    }
    
    consolidateStubPages(stubPages, sectionGroups) {
        console.log('Consolidating stub pages...');
        
        // Mark stub pages in section groups
        stubPages.forEach(stub => {
            sectionGroups.forEach((pages, section) => {
                const pageInfo = pages.find(p => p.page === stub.page);
                if (pageInfo) {
                    pageInfo.isStub = true;
                    pageInfo.stubInfo = stub;
                }
            });
        });
        
        // Process each section
        sectionGroups.forEach((pages, section) => {
            console.log(`Processing section: ${section}`);
            
            for (let i = 0; i < pages.length; i++) {
                const currentPage = pages[i];
                
                if (currentPage.isStub) {
                    // Find best page to merge with
                    let targetPage = null;
                    
                    // Try previous page first (if in same section)
                    if (i > 0 && !pages[i - 1].isStub) {
                        targetPage = pages[i - 1];
                    }
                    // Try next page (if in same section)
                    else if (i < pages.length - 1 && !pages[i + 1].isStub) {
                        targetPage = pages[i + 1];
                    }
                    
                    if (targetPage) {
                        this.mergePages(currentPage, targetPage, section);
                    }
                }
            }
        });
    }
    
    mergePages(stubPage, targetPage, section) {
        console.log(`Merging stub page ${stubPage.pageNumber} into page ${targetPage.pageNumber} (${section})`);
        
        const stubContent = stubPage.page.querySelector('.page-content');
        const targetContent = targetPage.page.querySelector('.page-content');
        
        if (!stubContent || !targetContent) return;
        
        // Get stub elements (excluding headers/footers)
        const stubElements = Array.from(stubContent.children).filter(el => 
            !el.classList.contains('professional-header') &&
            !el.classList.contains('page-footer') &&
            !el.classList.contains('professional-footer')
        );
        
        // Check if target page has room
        const targetHeight = this.calculateContentHeight(targetContent);
        const stubHeight = stubPage.stubInfo.contentHeight;
        const maxHeight = 9.5 * 96; // 9.5 inches max
        
        if (targetHeight + stubHeight <= maxHeight) {
            // Add section divider if needed
            if (stubPage.pageNumber < targetPage.pageNumber) {
                // Stub content goes at beginning
                const firstNonHeader = Array.from(targetContent.children).find(el =>
                    !el.classList.contains('professional-header')
                );
                
                stubElements.reverse().forEach(el => {
                    if (firstNonHeader) {
                        targetContent.insertBefore(el, firstNonHeader);
                    } else {
                        targetContent.appendChild(el);
                    }
                });
            } else {
                // Stub content goes at end
                stubElements.forEach(el => {
                    targetContent.appendChild(el);
                });
            }
            
            // Mark stub page for removal
            stubPage.page.classList.add('remove-page');
            this.consolidatedPages.push(stubPage.pageNumber);
            
            // Add visual separator if different topics
            if (this.needsSeparator(stubElements, targetContent)) {
                const separator = document.createElement('div');
                separator.className = 'section-break';
                separator.style.cssText = 'margin: 2rem 0; text-align: center;';
                separator.innerHTML = '• • •';
                
                if (stubPage.pageNumber < targetPage.pageNumber) {
                    targetContent.insertBefore(separator, stubElements[stubElements.length - 1].nextSibling);
                } else {
                    targetContent.insertBefore(separator, stubElements[0]);
                }
            }
        } else {
            console.log(`Cannot merge - would exceed page height (${targetHeight + stubHeight}px)`);
        }
    }
    
    calculateContentHeight(content) {
        const elements = Array.from(content.children);
        let height = 0;
        
        elements.forEach(el => {
            if (!el.classList.contains('professional-header') &&
                !el.classList.contains('page-footer')) {
                height += el.offsetHeight || this.estimateHeight(el);
            }
        });
        
        return height;
    }
    
    estimateHeight(element) {
        // Estimate heights for common elements
        if (element.matches('h1')) return 48;
        if (element.matches('h2')) return 36;
        if (element.matches('h3')) return 30;
        if (element.matches('p')) return 24 * Math.ceil(element.textContent.length / 80);
        if (element.matches('ul, ol')) return 24 * element.querySelectorAll('li').length;
        return 50; // Default
    }
    
    needsSeparator(stubElements, targetContent) {
        // Check if topics are different enough to need a separator
        const stubText = stubElements.map(el => el.textContent).join(' ');
        const targetText = targetContent.textContent;
        
        // Simple topic detection
        const topics = ['Emergency', 'Fire', 'Wildlife', 'Committee', 'Construction', 'Services'];
        let stubTopic = '';
        let targetTopic = '';
        
        topics.forEach(topic => {
            if (stubText.includes(topic)) stubTopic = topic;
            if (targetText.includes(topic)) targetTopic = topic;
        });
        
        return stubTopic && targetTopic && stubTopic !== targetTopic;
    }
    
    reflowAfterConsolidation() {
        console.log('Reflowing document after consolidation...');
        
        // Remove marked pages
        const pagesToRemove = document.querySelectorAll('.page.remove-page');
        pagesToRemove.forEach(page => {
            page.remove();
        });
        
        // Update page numbers
        this.updatePageNumbers();
        
        // Update TOC if needed
        this.updateTableOfContents();
    }
    
    updatePageNumbers() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            const pageNumber = index + 1;
            
            // Update footer page numbers
            const footerNumber = page.querySelector('.page-footer .page-number, .professional-footer .footer-right .page-number');
            if (footerNumber) {
                footerNumber.textContent = pageNumber;
            }
            
            // Update any data attributes
            page.setAttribute('data-page-number', pageNumber);
        });
        
        console.log(`Document now has ${pages.length} pages (removed ${this.consolidatedPages.length} stub pages)`);
    }
    
    updateTableOfContents() {
        const tocPage = document.querySelector('.page[data-template="toc"]');
        if (!tocPage) return;
        
        console.log('Updating table of contents...');
        
        // This would need to scan the document and update page numbers
        // For now, we'll just log that it needs updating
        console.log('TOC update needed - page numbers have changed');
    }
}

// Initialize
const stubConsolidator = new StubPageConsolidator();

// Add control button
const consolidateButton = document.createElement('button');
consolidateButton.textContent = 'Consolidate Stub Pages';
consolidateButton.style.cssText = `
    position: fixed;
    top: 150px;
    right: 20px;
    padding: 10px 20px;
    background: #9b59b6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

consolidateButton.onclick = () => {
    consolidateButton.textContent = 'Consolidating...';
    consolidateButton.disabled = true;
    
    setTimeout(() => {
        stubConsolidator.analyzeAndConsolidate();
        consolidateButton.textContent = '✅ Pages Consolidated';
        consolidateButton.style.background = '#27ae60';
    }, 100);
};

document.body.appendChild(consolidateButton);