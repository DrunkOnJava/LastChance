/**
 * Professional Components for BMPOA Document
 * All content verified from source materials
 */

class ProfessionalComponents {
    constructor() {
        // Verified from BMPOA-entities.txt and database
        this.organizationInfo = {
            name: "Blue Mountain Property Owners Association",
            tagline: "A Mountain Home",
            motto: "ANGULUS RIDET",
            address: "P.O. Box 114, Linden, VA 22642",
            website: "www.bmpoa.org",
            founded: "Late 1950s",
            type: "Sanitary District"
        };
        
        // Verified contact from source materials
        this.emergencyContact = "Emergency: 911";
        
        // Verified from database
        this.currentYear = "2025";
    }

    addProfessionalHeaders() {
        console.log('Adding professional headers to all pages...');
        
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            // Skip cover page and TOC
            if (index < 2) return;
            
            const header = this.createHeader();
            page.insertBefore(header, page.firstChild);
        });
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'professional-header no-print-margin';
        
        header.innerHTML = `
            <div class="header-logo">
                <img src="images/bmpoa-emblem.png" alt="BMPOA Emblem">
                <div class="header-text">
                    <h1>BMPOA</h1>
                    <p>${this.organizationInfo.tagline}</p>
                </div>
            </div>
            <div class="header-contact">
                <p>${this.organizationInfo.address}</p>
                <p>${this.emergencyContact}</p>
            </div>
        `;
        
        return header;
    }

    addProfessionalFooters() {
        console.log('Adding professional footers to all pages...');
        
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            // Skip cover page
            if (index === 0) return;
            
            // Get section name from page content
            const sectionName = this.getSectionName(page);
            
            const footer = this.createFooter(index + 1, sectionName);
            
            // Replace existing footer or add new one
            const existingFooter = page.querySelector('.page-footer');
            if (existingFooter) {
                existingFooter.replaceWith(footer);
            } else {
                page.appendChild(footer);
            }
        });
    }

    createFooter(pageNumber, sectionName) {
        const footer = document.createElement('div');
        footer.className = 'professional-footer';
        
        footer.innerHTML = `
            <div class="footer-left">${sectionName}</div>
            <div class="footer-center">${this.organizationInfo.name}</div>
            <div class="footer-right">
                <span class="page-number">${pageNumber}</span>
            </div>
        `;
        
        return footer;
    }

    getSectionName(page) {
        // Look for chapter headings
        const chapterHeading = page.querySelector('h1.chapter-title, h1');
        if (chapterHeading) {
            return chapterHeading.textContent.trim();
        }
        
        // Look for section data attribute
        const template = page.getAttribute('data-template');
        if (template === 'toc') return 'Table of Contents';
        if (template === 'chapter-start') {
            const h1 = page.querySelector('h1');
            return h1 ? h1.textContent.trim() : 'Chapter';
        }
        
        // Default sections based on content
        if (page.textContent.includes('Emergency')) return 'Emergency Information';
        if (page.textContent.includes('Governance')) return 'Governance';
        if (page.textContent.includes('Community')) return 'Community Life';
        
        return 'Community Guide';
    }

    createProfessionalCoverPage() {
        console.log('Keeping original cover page...');
        // Skip modifying the cover page to preserve original design
        return;
    }

    improveTOC() {
        console.log('Improving table of contents...');
        
        const tocPage = document.querySelector('.page[data-template="toc"]');
        if (!tocPage) return;
        
        const tocContent = tocPage.querySelector('.page-content');
        tocContent.classList.add('toc-professional');
        
        // Add title styling
        const tocTitle = tocContent.querySelector('h1');
        if (tocTitle) {
            tocTitle.className = 'toc-title';
        }
        
        // Process TOC entries
        const sections = tocContent.querySelectorAll('.toc-section');
        sections.forEach(section => {
            const entries = section.querySelectorAll('li');
            entries.forEach(entry => {
                const text = entry.textContent;
                const pageMatch = text.match(/(\d+)$/);
                
                if (pageMatch) {
                    const pageNum = pageMatch[1];
                    const title = text.replace(/\.+\s*\d+$/, '').trim();
                    
                    entry.className = entry.querySelector('strong') ? 'toc-entry toc-chapter' : 'toc-entry toc-section';
                    entry.innerHTML = `
                        <span class="toc-text">${title}</span>
                        <span class="toc-dots"></span>
                        <span class="toc-page">${pageNum}</span>
                    `;
                }
            });
        });
    }

    addSectionDividers() {
        console.log('Adding section dividers...');
        
        const chapterPages = document.querySelectorAll('.page[data-template="chapter-start"]');
        chapterPages.forEach(page => {
            const content = page.querySelector('.page-content');
            const h1 = content.querySelector('h1');
            
            if (h1) {
                // Get chapter number from content
                const chapterMatch = h1.textContent.match(/Chapter\s+([IVX]+)/i);
                const chapterNum = chapterMatch ? chapterMatch[1] : '';
                const chapterTitle = h1.textContent.replace(/Chapter\s+[IVX]+:?\s*/i, '');
                
                const divider = document.createElement('div');
                divider.className = 'section-header';
                divider.innerHTML = `
                    <div class="section-number">Chapter ${chapterNum}</div>
                    <h1 class="section-title">${chapterTitle}</h1>
                `;
                
                h1.replaceWith(divider);
            }
        });
    }

    improveContactCards() {
        console.log('Improving contact cards...');
        
        // Find board member contact sections
        const contactTables = document.querySelectorAll('table');
        contactTables.forEach(table => {
            // Check if this is a contact table
            const headers = table.querySelectorAll('th');
            const isContactTable = Array.from(headers).some(h => 
                h.textContent.includes('Name') || h.textContent.includes('Position')
            );
            
            if (isContactTable) {
                table.classList.add('table-professional');
                
                // Add caption if missing
                if (!table.querySelector('caption')) {
                    const caption = document.createElement('caption');
                    
                    // Determine caption based on content
                    if (table.textContent.includes('Board')) {
                        caption.textContent = 'Board of Directors';
                    } else if (table.textContent.includes('Committee')) {
                        caption.textContent = 'Committee Leadership';
                    } else if (table.textContent.includes('Emergency')) {
                        caption.textContent = 'Emergency Contacts';
                    }
                    
                    if (caption.textContent) {
                        table.insertBefore(caption, table.firstChild);
                    }
                }
            }
        });
    }

    improveAlertBoxes() {
        console.log('Improving alert boxes...');
        
        const alertBoxes = document.querySelectorAll('.alert-box, .warning-box, .info-box');
        alertBoxes.forEach(box => {
            const isEmergency = box.classList.contains('critical') || 
                               box.textContent.includes('911') ||
                               box.textContent.includes('EMERGENCY');
            const isWarning = box.classList.contains('warning-box') ||
                             box.textContent.includes('WARNING') ||
                             box.textContent.includes('IMPORTANT');
            
            box.className = 'alert-professional';
            
            if (isEmergency) {
                box.classList.add('alert-emergency');
            } else if (isWarning) {
                box.classList.add('alert-warning');
            } else {
                box.classList.add('alert-info');
            }
            
            // Add icon and structure
            const firstStrong = box.querySelector('strong');
            if (firstStrong) {
                firstStrong.className = 'alert-title';
                
                // Add appropriate icon
                let icon = '';
                if (isEmergency) icon = '🚨';
                else if (isWarning) icon = '⚠️';
                else icon = 'ℹ️';
                
                if (!firstStrong.textContent.includes(icon)) {
                    firstStrong.innerHTML = `${icon} ${firstStrong.textContent}`;
                }
            }
            
            // Wrap remaining content
            const content = document.createElement('div');
            content.className = 'alert-content';
            
            const childNodes = Array.from(box.childNodes);
            let startWrapping = false;
            
            childNodes.forEach(node => {
                if (startWrapping || (node !== firstStrong && node.nodeType !== Node.TEXT_NODE)) {
                    content.appendChild(node);
                    startWrapping = true;
                }
            });
            
            if (content.hasChildNodes()) {
                box.appendChild(content);
            }
        });
    }

    applyAllEnhancements() {
        console.log('Applying all professional enhancements...');
        
        // Load professional CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'professional-design-system.css';
        document.head.appendChild(link);
        
        // Apply enhancements
        // this.createProfessionalCoverPage(); // Keeping original cover page
        this.improveTOC();
        this.addProfessionalHeaders();
        this.addProfessionalFooters();
        this.addSectionDividers();
        this.improveContactCards();
        this.improveAlertBoxes();
        
        console.log('Professional enhancements complete!');
    }
}

// Initialize
const professionalComponents = new ProfessionalComponents();

// Add control button
const enhanceButton = document.createElement('button');
enhanceButton.textContent = 'Apply Professional Design';
enhanceButton.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    padding: 10px 20px;
    background: #1e3a5f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

enhanceButton.onclick = () => {
    professionalComponents.applyAllEnhancements();
    enhanceButton.textContent = '✅ Design Applied';
    enhanceButton.style.background = '#27ae60';
};

document.body.appendChild(enhanceButton);