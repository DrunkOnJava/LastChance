/**
 * Final Polish and Flourishes Component for BMPOA
 * Professional finishing touches
 */

class FinalPolish {
    constructor() {
        this.appliedEnhancements = new Set();
    }
    
    applyFinalPolish() {
        console.log('Applying final polish and flourishes...');
        
        // Load final polish CSS
        const polishCSS = document.createElement('link');
        polishCSS.rel = 'stylesheet';
        polishCSS.href = 'final-polish.css';
        document.head.appendChild(polishCSS);
        
        // Apply various enhancements
        this.addDropCaps();
        this.addSectionBreaks();
        this.addOrnamentalDividers();
        this.enhanceQuotes();
        this.addCornerFlourishes();
        this.polishHeaders();
        this.enhanceFirstParagraphs();
        this.addSidebarHighlights();
        this.createElegantLists();
        
        console.log('Final polish complete!');
    }
    
    addDropCaps() {
        // Add drop caps to chapter openings
        const chapterStarts = document.querySelectorAll('.page[data-template="chapter-start"] .page-content > p:first-of-type');
        chapterStarts.forEach(paragraph => {
            if (!paragraph.classList.contains('has-drop-cap')) {
                paragraph.classList.add('chapter-opening');
                paragraph.classList.add('has-drop-cap');
            }
        });
        
        // Add drop caps to major sections
        const sectionStarts = Array.from(document.querySelectorAll('h1')).filter(h1 => {
            const nextElement = h1.nextElementSibling;
            return nextElement && nextElement.tagName === 'P';
        });
        
        sectionStarts.forEach(h1 => {
            const firstParagraph = h1.nextElementSibling;
            if (firstParagraph && !firstParagraph.classList.contains('has-drop-cap')) {
                firstParagraph.classList.add('first-line-enhance');
            }
        });
    }
    
    addSectionBreaks() {
        // Add decorative breaks between major sections
        const sections = document.querySelectorAll('.page-content > h2');
        sections.forEach((section, index) => {
            if (index > 0) {
                const prevElement = section.previousElementSibling;
                if (prevElement && !prevElement.classList.contains('section-break')) {
                    const breakDiv = document.createElement('div');
                    breakDiv.className = 'section-break';
                    section.parentNode.insertBefore(breakDiv, section);
                }
            }
        });
    }
    
    addOrnamentalDividers() {
        // Add ornamental dividers to special sections
        const specialSections = ['Emergency Information', 'Community Guidelines', 'Important Notice'];
        
        specialSections.forEach(sectionName => {
            const headings = Array.from(document.querySelectorAll('h2, h3')).filter(h =>
                h.textContent.includes(sectionName)
            );
            
            headings.forEach(heading => {
                if (!heading.nextElementSibling?.classList.contains('ornamental-divider')) {
                    const divider = document.createElement('div');
                    divider.className = 'ornamental-divider';
                    divider.innerHTML = '<span class="ornamental-divider-symbol">◆</span>';
                    heading.parentNode.insertBefore(divider, heading.nextSibling);
                }
            });
        });
    }
    
    enhanceQuotes() {
        // Enhance blockquotes with better styling
        const blockquotes = document.querySelectorAll('blockquote');
        blockquotes.forEach(quote => {
            if (!quote.classList.contains('enhanced')) {
                quote.classList.add('enhanced');
            }
        });
        
        // Create pull quotes from important text
        const importantParagraphs = Array.from(document.querySelectorAll('p')).filter(p =>
            p.textContent.includes('Mountain Home') && 
            p.textContent.length < 150 &&
            p.textContent.length > 50
        );
        
        if (importantParagraphs.length > 0 && this.appliedEnhancements.size < 3) {
            const quote = importantParagraphs[0];
            if (!quote.classList.contains('pull-quote')) {
                quote.classList.add('pull-quote');
                this.appliedEnhancements.add('pull-quote');
            }
        }
    }
    
    addCornerFlourishes() {
        // Add corner flourishes to cover page
        const coverPage = document.querySelector('.page[data-template="cover"]');
        if (coverPage && !coverPage.querySelector('.corner-flourish')) {
            const topLeft = document.createElement('div');
            topLeft.className = 'corner-flourish top-left';
            coverPage.appendChild(topLeft);
            
            const bottomRight = document.createElement('div');
            bottomRight.className = 'corner-flourish bottom-right';
            coverPage.appendChild(bottomRight);
        }
        
        // Add to chapter start pages
        const chapterPages = document.querySelectorAll('.page[data-template="chapter-start"]');
        chapterPages.forEach(page => {
            if (!page.querySelector('.corner-flourish')) {
                const topLeft = document.createElement('div');
                topLeft.className = 'corner-flourish top-left';
                page.appendChild(topLeft);
            }
        });
    }
    
    polishHeaders() {
        // Add polish to major headers
        const majorHeaders = document.querySelectorAll('h1');
        majorHeaders.forEach(header => {
            if (!header.classList.contains('polished') && 
                !header.classList.contains('toc-title') &&
                !header.parentElement.classList.contains('emergency-section-header')) {
                header.classList.add('polished');
            }
        });
        
        // Polish section headers
        const sectionHeaders = document.querySelectorAll('h2');
        sectionHeaders.forEach(header => {
            const isImportant = header.textContent.includes('Emergency') ||
                               header.textContent.includes('Safety') ||
                               header.textContent.includes('Important');
            
            if (isImportant && !header.classList.contains('polished')) {
                header.classList.add('polished');
            }
        });
    }
    
    enhanceFirstParagraphs() {
        // Enhance first paragraphs of sections
        const sections = document.querySelectorAll('.page-content');
        sections.forEach(section => {
            const firstPara = section.querySelector('p:first-of-type');
            if (firstPara && !firstPara.classList.contains('first-line-enhance') &&
                !firstPara.classList.contains('has-drop-cap')) {
                firstPara.classList.add('first-line-enhance');
            }
        });
    }
    
    addSidebarHighlights() {
        // Create sidebar highlights for key information
        const keyInfo = [
            {
                selector: 'p',
                searchText: 'Board meets',
                title: 'Regular Meetings',
                highlight: true
            },
            {
                selector: 'p',
                searchText: 'Founded',
                title: 'Our History',
                highlight: true
            }
        ];
        
        keyInfo.forEach(info => {
            const elements = Array.from(document.querySelectorAll(info.selector)).filter(el =>
                el.textContent.includes(info.searchText) && 
                !el.parentElement.classList.contains('sidebar-highlight')
            );
            
            if (elements.length > 0 && this.appliedEnhancements.size < 5) {
                const element = elements[0];
                const sidebar = document.createElement('div');
                sidebar.className = 'sidebar-highlight';
                sidebar.innerHTML = `
                    <h4>${info.title}</h4>
                    <p>${element.textContent.substring(0, 150)}...</p>
                `;
                
                // Insert sidebar near the element
                const parent = element.parentElement;
                if (parent && info.highlight) {
                    parent.insertBefore(sidebar, element);
                    this.appliedEnhancements.add(`sidebar-${info.title}`);
                }
            }
        });
    }
    
    createElegantLists() {
        // Convert certain lists to elegant style
        const lists = document.querySelectorAll('ul');
        lists.forEach(list => {
            // Check if it's a special list (committees, services, etc.)
            const isSpecialList = list.parentElement.textContent.includes('Committee') ||
                                 list.parentElement.textContent.includes('Services') ||
                                 list.parentElement.textContent.includes('Features');
            
            if (isSpecialList && !list.classList.contains('elegant-list')) {
                list.classList.add('elegant-list');
            }
        });
    }
    
    addSpecialEmphasis() {
        // Add special emphasis to important terms
        const importantTerms = ['FORBIDDEN', 'REQUIRED', 'MUST', 'Emergency: 911'];
        
        importantTerms.forEach(term => {
            const textNodes = this.getTextNodesContaining(term);
            textNodes.forEach(node => {
                if (node.parentElement && !node.parentElement.classList.contains('special-emphasis')) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'special-emphasis';
                    wrapper.textContent = term;
                    
                    const newText = node.textContent.replace(term, wrapper.outerHTML);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newText;
                    
                    while (tempDiv.firstChild) {
                        node.parentElement.insertBefore(tempDiv.firstChild, node);
                    }
                    node.remove();
                }
            });
        });
    }
    
    getTextNodesContaining(text) {
        const textNodes = [];
        const walk = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walk.nextNode()) {
            if (node.textContent.includes(text)) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }
}

// Initialize
const finalPolish = new FinalPolish();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.applyFinalPolish = function() {
        finalPolish.applyFinalPolish();
    };
}