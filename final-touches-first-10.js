/**
 * Final Touches for First 10 Pages
 * Professional finishing and PDF preparation
 */

class FinalTouchesFirst10 {
    constructor() {
        this.pagesToProcess = 10;
    }
    
    applyFinalTouches() {
        console.log('Applying final touches to first 10 pages...');
        
        // Get first 10 pages
        const pages = Array.from(document.querySelectorAll('.page')).slice(0, this.pagesToProcess);
        
        pages.forEach((page, index) => {
            console.log(`Finalizing page ${index + 1}...`);
            
            // Apply page-specific enhancements
            switch(index) {
                case 0: // Cover page
                    this.finalizeCoverPage(page);
                    break;
                case 1: // Table of Contents
                    this.finalizeTOC(page);
                    break;
                case 2: // Chapter start
                    this.finalizeChapterStart(page);
                    break;
                default:
                    this.finalizeContentPage(page, index + 1);
            }
            
            // Apply universal enhancements
            this.applyUniversalEnhancements(page, index + 1);
        });
        
        // Final quality check
        this.performQualityCheck();
        
        console.log('Final touches complete! Ready for PDF generation.');
    }
    
    finalizeCoverPage(page) {
        const content = page.querySelector('.page-content');
        if (!content) return;
        
        // Ensure cover elements are perfectly centered
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.justifyContent = 'center';
        content.style.alignItems = 'center';
        
        // Enhance emblem if present
        const emblem = content.querySelector('img[src*="emblem"]');
        if (emblem) {
            emblem.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
            emblem.style.marginBottom = '2rem';
        }
        
        // Ensure title prominence
        const title = content.querySelector('h1');
        if (title) {
            title.style.fontSize = '3rem';
            title.style.fontWeight = '800';
            title.style.letterSpacing = '1px';
            title.style.textTransform = 'uppercase';
            title.style.marginBottom = '1rem';
        }
        
        // Add subtle animation for screen viewing
        if (!window.matchMedia('print').matches) {
            title.style.animation = 'fadeInUp 1s ease-out';
        }
    }
    
    finalizeTOC(page) {
        const content = page.querySelector('.page-content');
        if (!content) return;
        
        // Enhance TOC styling
        const tocEntries = content.querySelectorAll('.toc-entry');
        tocEntries.forEach(entry => {
            // Ensure proper dot leaders
            const dots = entry.querySelector('.toc-dots');
            if (dots && !dots.textContent) {
                dots.style.flex = '1';
                dots.style.borderBottom = '2px dotted #ccc';
                dots.style.margin = '0 0.5rem';
                dots.style.position = 'relative';
                dots.style.top = '-0.3em';
            }
            
            // Enhance chapter entries
            if (entry.classList.contains('toc-chapter')) {
                entry.style.fontWeight = '600';
                entry.style.marginTop = '0.5rem';
            }
        });
        
        // Add page header if missing
        if (!page.querySelector('.professional-header')) {
            this.addProfessionalHeader(page, 'Table of Contents');
        }
    }
    
    finalizeChapterStart(page) {
        const content = page.querySelector('.page-content');
        if (!content) return;
        
        // Enhance chapter number display
        const chapterNum = content.querySelector('.section-number');
        if (chapterNum) {
            chapterNum.style.fontSize = '1.2rem';
            chapterNum.style.color = '#4a90e2';
            chapterNum.style.fontWeight = '300';
            chapterNum.style.letterSpacing = '2px';
            chapterNum.style.marginBottom = '0.5rem';
        }
        
        // Enhance chapter title
        const chapterTitle = content.querySelector('.section-title, h1');
        if (chapterTitle) {
            chapterTitle.style.fontSize = '2.5rem';
            chapterTitle.style.marginBottom = '2rem';
            chapterTitle.style.position = 'relative';
            
            // Add decorative underline
            if (!chapterTitle.querySelector('.title-underline')) {
                const underline = document.createElement('div');
                underline.className = 'title-underline';
                underline.style.cssText = `
                    position: absolute;
                    bottom: -1rem;
                    left: 0;
                    width: 100px;
                    height: 4px;
                    background: linear-gradient(to right, #1e3a5f, #4a90e2);
                    border-radius: 2px;
                `;
                chapterTitle.appendChild(underline);
            }
        }
    }
    
    finalizeContentPage(page, pageNumber) {
        const content = page.querySelector('.page-content');
        if (!content) return;
        
        // Ensure proper spacing
        const elements = content.querySelectorAll('p, ul, ol, .alert-box, .info-box');
        elements.forEach(el => {
            if (!el.style.marginBottom) {
                el.style.marginBottom = '1rem';
            }
        });
        
        // Enhance headers
        const headers = content.querySelectorAll('h2, h3');
        headers.forEach(header => {
            if (!header.style.marginTop) {
                header.style.marginTop = '1.5rem';
            }
            if (!header.style.marginBottom) {
                header.style.marginBottom = '0.75rem';
            }
        });
        
        // Fix any overflow issues
        this.checkAndFixOverflow(page, content);
    }
    
    applyUniversalEnhancements(page, pageNumber) {
        // Ensure page numbers are visible
        let footer = page.querySelector('.professional-footer, .page-footer');
        if (!footer && pageNumber > 1) {
            footer = this.createFooter(pageNumber);
            page.appendChild(footer);
        }
        
        // Update page number if footer exists
        if (footer) {
            const pageNumElement = footer.querySelector('.page-number, .footer-right');
            if (pageNumElement) {
                pageNumElement.textContent = pageNumber;
            }
        }
        
        // Ensure consistent margins
        const content = page.querySelector('.page-content');
        if (content) {
            content.style.padding = '0.75in';
            content.style.paddingBottom = '1in'; // Extra space for footer
        }
        
        // Add print optimization classes
        page.classList.add('print-optimized');
    }
    
    addProfessionalHeader(page, sectionName) {
        const header = document.createElement('div');
        header.className = 'professional-header no-print-margin';
        header.innerHTML = `
            <div class="header-logo">
                <img src="images/bmpoa-emblem.png" alt="BMPOA Emblem" style="height: 40px;">
                <div class="header-text">
                    <h1 style="font-size: 1.2rem; margin: 0;">BMPOA</h1>
                    <p style="font-size: 0.8rem; margin: 0;">A Mountain Home</p>
                </div>
            </div>
            <div class="header-contact">
                <p style="margin: 0; font-size: 0.9rem;">P.O. Box 114, Linden, VA 22642</p>
                <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">Emergency: 911</p>
            </div>
        `;
        
        const content = page.querySelector('.page-content');
        if (content && content.firstChild) {
            content.insertBefore(header, content.firstChild);
        }
    }
    
    createFooter(pageNumber) {
        const footer = document.createElement('div');
        footer.className = 'professional-footer';
        footer.style.cssText = `
            position: absolute;
            bottom: 0.5in;
            left: 0.75in;
            right: 0.75in;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            color: #666;
            border-top: 1px solid #e0e0e0;
            padding-top: 0.5rem;
        `;
        
        footer.innerHTML = `
            <div class="footer-left">Community Guide 2025</div>
            <div class="footer-center">Blue Mountain Property Owners Association</div>
            <div class="footer-right">
                <span class="page-number">${pageNumber}</span>
            </div>
        `;
        
        return footer;
    }
    
    checkAndFixOverflow(page, content) {
        const maxHeight = 9.5 * 96; // 9.5 inches in pixels
        if (content.scrollHeight > maxHeight) {
            console.warn(`Page ${page.getAttribute('data-page-number')} has overflow`);
            
            // Try to reduce spacing
            const elements = content.querySelectorAll('p, ul, ol');
            elements.forEach(el => {
                el.style.marginBottom = '0.75rem';
            });
            
            // If still overflowing, reduce font size slightly
            if (content.scrollHeight > maxHeight) {
                content.style.fontSize = '0.95em';
            }
        }
    }
    
    performQualityCheck() {
        console.log('Performing final quality check...');
        
        const issues = [];
        const pages = Array.from(document.querySelectorAll('.page')).slice(0, this.pagesToProcess);
        
        pages.forEach((page, index) => {
            const pageNum = index + 1;
            const content = page.querySelector('.page-content');
            
            // Check for overflow
            if (content && content.scrollHeight > 9.5 * 96) {
                issues.push(`Page ${pageNum}: Content overflow detected`);
            }
            
            // Check for headers/footers on appropriate pages
            if (pageNum > 2 && !page.querySelector('.professional-header, .professional-footer')) {
                issues.push(`Page ${pageNum}: Missing header or footer`);
            }
            
            // Check for empty pages
            if (content && content.children.length < 2) {
                issues.push(`Page ${pageNum}: Very little content`);
            }
        });
        
        if (issues.length > 0) {
            console.warn('Quality check issues:', issues);
        } else {
            console.log('✅ All quality checks passed!');
        }
    }
    
    prepareForPDF() {
        console.log('Preparing document for PDF generation...');
        
        // Hide all pages except first 10
        const allPages = document.querySelectorAll('.page');
        allPages.forEach((page, index) => {
            if (index >= this.pagesToProcess) {
                page.style.display = 'none';
            }
        });
        
        // Apply print styles
        document.body.classList.add('pdf-export-mode');
        
        // Remove control buttons
        const buttons = document.querySelectorAll('button[style*="position: fixed"]');
        buttons.forEach(btn => btn.style.display = 'none');
        
        console.log('Document ready for PDF export!');
    }
}

// Initialize
const finalTouches = new FinalTouchesFirst10();

// Add control button
const finalizeButton = document.createElement('button');
finalizeButton.textContent = 'Finalize First 10 Pages';
finalizeButton.style.cssText = `
    position: fixed;
    top: 230px;
    right: 20px;
    padding: 10px 20px;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

finalizeButton.onclick = () => {
    finalizeButton.textContent = 'Finalizing...';
    finalizeButton.disabled = true;
    
    // Apply all professional enhancements first
    if (typeof professionalComponents !== 'undefined') {
        professionalComponents.applyAllEnhancements();
    }
    
    setTimeout(() => {
        finalTouches.applyFinalTouches();
        finalizeButton.textContent = '✅ Ready for PDF';
        finalizeButton.style.background = '#27ae60';
        
        // Add PDF export button
        const pdfButton = document.createElement('button');
        pdfButton.textContent = 'Prepare for PDF Export';
        pdfButton.style.cssText = `
            position: fixed;
            top: 270px;
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
        
        pdfButton.onclick = () => {
            finalTouches.prepareForPDF();
            pdfButton.textContent = '✅ Print/Save as PDF Now';
            pdfButton.style.background = '#27ae60';
            
            // Trigger print dialog
            setTimeout(() => {
                window.print();
            }, 500);
        };
        
        document.body.appendChild(pdfButton);
    }, 1000);
};

document.body.appendChild(finalizeButton);