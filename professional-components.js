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
        
        // Load contact card CSS
        const contactCardCSS = document.createElement('link');
        contactCardCSS.rel = 'stylesheet';
        contactCardCSS.href = 'professional-contact-cards.css';
        document.head.appendChild(contactCardCSS);
        
        // Find and transform board member tables
        const contactTables = document.querySelectorAll('table');
        contactTables.forEach(table => {
            const headers = table.querySelectorAll('th');
            const isContactTable = Array.from(headers).some(h => 
                h.textContent.includes('Name') || h.textContent.includes('Position') || 
                h.textContent.includes('Contact') || h.textContent.includes('Phone')
            );
            
            if (isContactTable) {
                // Check what type of contact table this is
                const tableText = table.textContent;
                
                if (tableText.includes('Board') || tableText.includes('President') || 
                    tableText.includes('Vice President') || tableText.includes('Secretary')) {
                    this.transformBoardTable(table);
                } else if (tableText.includes('Emergency') || tableText.includes('911') || 
                          tableText.includes('Fire') || tableText.includes('Police')) {
                    this.transformEmergencyTable(table);
                } else if (tableText.includes('Service') || tableText.includes('Waste') || 
                          tableText.includes('Internet') || tableText.includes('Hauler')) {
                    this.transformServiceTable(table);
                } else if (tableText.includes('Committee')) {
                    this.transformCommitteeTable(table);
                } else {
                    // Default professional table styling
                    table.classList.add('table-professional');
                }
            }
        });
        
        // Create quick reference card if emergency info exists
        this.createQuickReferenceCard();
    }
    
    transformBoardTable(table) {
        console.log('Transforming board member table...');
        
        const container = document.createElement('div');
        container.className = 'contact-cards-container';
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const card = document.createElement('div');
                card.className = 'contact-card board-member-card';
                
                // Extract data from verified sources
                const position = cells[0]?.textContent.trim() || '';
                const name = cells[1]?.textContent.trim() || '';
                const additionalRole = cells[2]?.textContent.trim() || '';
                
                // Check if executive officer
                if (position.includes('President') || position.includes('Secretary') || position.includes('VP')) {
                    card.classList.add('executive-officer');
                }
                
                card.innerHTML = `
                    <div class="position-badge">${position}</div>
                    <h3 class="member-name">${name}</h3>
                    ${additionalRole ? `<p class="committee-roles">${additionalRole}</p>` : ''}
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon icon-email"></span>
                            <span>Contact via BMPOA.org</span>
                        </div>
                    </div>
                `;
                
                container.appendChild(card);
            }
        });
        
        table.replaceWith(container);
    }
    
    transformEmergencyTable(table) {
        console.log('Transforming emergency contacts table...');
        
        const container = document.createElement('div');
        container.className = 'contact-cards-container';
        
        // Create primary emergency card
        const emergencyCard = document.createElement('div');
        emergencyCard.className = 'contact-card emergency-card';
        emergencyCard.innerHTML = `
            <div class="emergency-header">
                <span class="emergency-icon">🚨</span>
                <h3 class="emergency-title">Emergency</h3>
            </div>
            <div class="emergency-number">911</div>
            <div class="emergency-details">
                <div class="emergency-item">
                    <span class="emergency-label">Fire & Rescue Station #1</span>
                    <span class="emergency-value">(540) 635-1435</span>
                </div>
                <div class="emergency-item">
                    <span class="emergency-label">Fire & Rescue Station #5</span>
                    <span class="emergency-value">(540) 635-0053</span>
                </div>
                <div class="emergency-item">
                    <span class="emergency-label">Power Outages (REC)</span>
                    <span class="emergency-value">(800) 552-3904</span>
                </div>
            </div>
        `;
        container.appendChild(emergencyCard);
        
        // Process other emergency contacts from table
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2 && !cells[0].textContent.includes('911')) {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'contact-card service-card';
                
                const serviceName = cells[0]?.textContent.trim() || '';
                const phone = cells[1]?.textContent.trim() || '';
                
                let icon = '📞';
                if (serviceName.includes('Wildlife')) icon = '🦌';
                if (serviceName.includes('Animal')) icon = '🐕';
                
                serviceCard.innerHTML = `
                    <div class="service-header">
                        <span class="service-icon">${icon}</span>
                        <h4 class="service-name">${serviceName}</h4>
                    </div>
                    <div class="service-details">
                        <div class="service-phone">${phone}</div>
                    </div>
                `;
                
                container.appendChild(serviceCard);
            }
        });
        
        table.replaceWith(container);
    }
    
    transformServiceTable(table) {
        console.log('Transforming service provider table...');
        
        const container = document.createElement('div');
        container.className = 'contact-cards-container';
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const card = document.createElement('div');
                card.className = 'contact-card service-card';
                
                const serviceName = cells[0]?.textContent.trim() || '';
                const contact = cells[1]?.textContent.trim() || '';
                const address = cells[2]?.textContent.trim() || '';
                
                let icon = '📞';
                if (serviceName.includes('Waste') || serviceName.includes('Disposal')) icon = '♻️';
                if (serviceName.includes('Internet') || serviceName.includes('Xfinity')) icon = '📶';
                if (serviceName.includes('Electric')) icon = '⚡';
                
                card.innerHTML = `
                    <div class="service-header">
                        <span class="service-icon">${icon}</span>
                        <h4 class="service-name">${serviceName}</h4>
                    </div>
                    <div class="service-details">
                        <div class="service-phone">${contact}</div>
                        ${address ? `<div class="service-address">${address}</div>` : ''}
                    </div>
                `;
                
                container.appendChild(card);
            }
        });
        
        table.replaceWith(container);
    }
    
    transformCommitteeTable(table) {
        console.log('Transforming committee table...');
        
        const container = document.createElement('div');
        container.className = 'contact-cards-container';
        
        // Group by committee
        const committees = new Map();
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const committee = cells[0]?.textContent.trim() || '';
                const member = cells[1]?.textContent.trim() || '';
                const role = cells[2]?.textContent.trim() || 'Member';
                
                if (!committees.has(committee)) {
                    committees.set(committee, []);
                }
                committees.get(committee).push({ member, role });
            }
        });
        
        // Create cards for each committee
        committees.forEach((members, committeeName) => {
            const card = document.createElement('div');
            card.className = 'contact-card committee-card';
            
            const chair = members.find(m => m.role.includes('Chair'));
            const membersList = members
                .filter(m => m !== chair)
                .map(m => `<li class="committee-member">
                    ${m.member} ${m.role !== 'Member' ? `<span class="member-role">(${m.role})</span>` : ''}
                </li>`)
                .join('');
            
            card.innerHTML = `
                <div class="committee-header">
                    <h4 class="committee-name">${committeeName}</h4>
                    ${chair ? `<div class="committee-chair">Chair: ${chair.member}</div>` : ''}
                </div>
                ${membersList ? `<ul class="committee-members">${membersList}</ul>` : ''}
            `;
            
            container.appendChild(card);
        });
        
        table.replaceWith(container);
    }
    
    createQuickReferenceCard() {
        console.log('Creating quick reference card...');
        
        // Find a good location for the quick reference
        const emergencySection = Array.from(document.querySelectorAll('.page')).find(page =>
            page.textContent.includes('Emergency') && page.textContent.includes('911')
        );
        
        if (emergencySection) {
            const quickRef = document.createElement('div');
            quickRef.className = 'quick-reference-card';
            quickRef.innerHTML = `
                <h3>Quick Reference</h3>
                <div class="quick-reference-grid">
                    <div class="quick-reference-item">
                        <div class="quick-reference-label">Emergency</div>
                        <div class="quick-reference-value">911</div>
                    </div>
                    <div class="quick-reference-item">
                        <div class="quick-reference-label">Power Outage</div>
                        <div class="quick-reference-value">(800) 552-3904</div>
                    </div>
                    <div class="quick-reference-item">
                        <div class="quick-reference-label">BMPOA Office</div>
                        <div class="quick-reference-value">P.O. Box 114</div>
                    </div>
                    <div class="quick-reference-item">
                        <div class="quick-reference-label">Lodge Booking</div>
                        <div class="quick-reference-value">Email via Website</div>
                    </div>
                </div>
            `;
            
            // Insert at end of emergency section
            const pageContent = emergencySection.querySelector('.page-content');
            if (pageContent) {
                pageContent.appendChild(quickRef);
            }
        }
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
        
        // Load fire safety infographic script
        const fireScript = document.createElement('script');
        fireScript.src = 'fire-safety-infographic.js';
        document.head.appendChild(fireScript);
        
        // Apply enhancements
        // this.createProfessionalCoverPage(); // Keeping original cover page
        this.improveTOC();
        this.addProfessionalHeaders();
        this.addProfessionalFooters();
        this.addSectionDividers();
        this.improveContactCards();
        this.improveAlertBoxes();
        this.improveEmergencySection();
        
        // Apply fire safety infographic after script loads
        fireScript.onload = () => {
            if (typeof fireSafetyInfographic !== 'undefined') {
                fireSafetyInfographic.createFireSafetyInfographic();
            }
        };
        
        console.log('Professional enhancements complete!');
    }
    
    improveEmergencySection() {
        console.log('Improving emergency section visual hierarchy...');
        
        // Load emergency visual CSS
        const emergencyCSS = document.createElement('link');
        emergencyCSS.rel = 'stylesheet';
        emergencyCSS.href = 'professional-emergency-visual.css';
        document.head.appendChild(emergencyCSS);
        
        // Find emergency section
        const emergencyPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Emergency') && 
            (page.textContent.includes('911') || page.textContent.includes('Fire'))
        );
        
        emergencyPages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Check if this is the main emergency page
            if (content.textContent.includes('Emergency Contacts') || 
                content.querySelector('h1')?.textContent.includes('Emergency')) {
                
                // Add emergency section header
                const header = content.querySelector('h1');
                if (header) {
                    const emergencyHeader = document.createElement('div');
                    emergencyHeader.className = 'emergency-section-header';
                    emergencyHeader.innerHTML = `
                        <h1>Emergency Information</h1>
                        <div class="subtitle">Keep this page easily accessible</div>
                    `;
                    header.replaceWith(emergencyHeader);
                }
                
                // Create primary 911 display
                const existingEmergencyInfo = content.querySelector('.alert-box, .emergency-info');
                if (existingEmergencyInfo && existingEmergencyInfo.textContent.includes('911')) {
                    const primary911 = document.createElement('div');
                    primary911.className = 'primary-emergency';
                    primary911.innerHTML = `
                        <div class="emergency-label">For All Emergencies</div>
                        <div class="emergency-number">911</div>
                        <div class="emergency-instruction">Stay calm • Stay safe • Provide clear information</div>
                    `;
                    existingEmergencyInfo.replaceWith(primary911);
                }
                
                // Create emergency categories
                this.createEmergencyCategories(content);
                
                // Add emergency procedures if bear safety exists
                const bearSafety = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                    h.textContent.includes('Bear') || h.textContent.includes('Wildlife')
                );
                if (bearSafety) {
                    this.createEmergencyProcedures(bearSafety);
                }
                
                // Add critical warning for fire safety
                const fireSafety = Array.from(content.querySelectorAll('.alert-box, .warning-box')).find(box =>
                    box.textContent.includes('burning') || box.textContent.includes('FORBIDDEN')
                );
                if (fireSafety) {
                    const criticalWarning = document.createElement('div');
                    criticalWarning.className = 'critical-warning';
                    criticalWarning.innerHTML = `
                        <h3 class="critical-warning-title">Critical Fire Safety</h3>
                        <div class="critical-warning-content">
                            <strong>Open burning is FORBIDDEN AT ALL TIMES</strong> within BMPOA boundaries. 
                            This is more restrictive than Warren County rules. Violations are a Class 3 misdemeanor 
                            with fines up to $500.
                        </div>
                    `;
                    fireSafety.replaceWith(criticalWarning);
                }
            }
        });
    }
    
    createEmergencyCategories(content) {
        // Find all emergency contact tables or lists
        const tables = content.querySelectorAll('table');
        const emergencyData = {
            fire: {
                icon: '🔥',
                title: 'Fire & Rescue',
                contacts: [
                    { name: 'Station #1 (Front Royal)', number: '(540) 635-1435' },
                    { name: 'Station #5 (Linden)', number: '(540) 635-0053' }
                ]
            },
            utility: {
                icon: '⚡',
                title: 'Utilities',
                contacts: [
                    { name: 'Power Outages (REC)', number: '(800) 552-3904' }
                ]
            },
            wildlife: {
                icon: '🦌',
                title: 'Wildlife & Animal Control',
                contacts: [
                    { name: 'VA Wildlife Conflict', number: '(804) 367-1000' },
                    { name: 'Warren County Animal', number: '(540) 636-7834' }
                ]
            }
        };
        
        // Create categories grid
        const categoriesDiv = document.createElement('div');
        categoriesDiv.className = 'emergency-categories';
        
        Object.entries(emergencyData).forEach(([key, category]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'emergency-category';
            categoryDiv.innerHTML = `
                <div class="emergency-category-header">
                    <span class="emergency-category-icon">${category.icon}</span>
                    <h3 class="emergency-category-title">${category.title}</h3>
                </div>
                <ul class="emergency-contact-list">
                    ${category.contacts.map(contact => `
                        <li class="emergency-contact-item">
                            <span class="emergency-contact-name">${contact.name}</span>
                            <span class="emergency-contact-number">${contact.number}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            categoriesDiv.appendChild(categoryDiv);
        });
        
        // Insert after primary emergency display
        const primary911 = content.querySelector('.primary-emergency');
        if (primary911 && primary911.nextSibling) {
            primary911.parentNode.insertBefore(categoriesDiv, primary911.nextSibling);
        }
    }
    
    createEmergencyProcedures(bearSafetyHeader) {
        const proceduresDiv = document.createElement('div');
        proceduresDiv.className = 'emergency-procedures';
        proceduresDiv.innerHTML = `
            <div class="emergency-procedures-header">
                <span class="emergency-procedures-icon">🐻</span>
                <h3 class="emergency-procedures-title">Bear Encounter Procedures</h3>
            </div>
            <ol class="emergency-steps">
                <li class="emergency-step">
                    <div class="emergency-step-title">Remain Calm</div>
                    <div class="emergency-step-description">Do not run. Bears can run up to 35 mph.</div>
                </li>
                <li class="emergency-step">
                    <div class="emergency-step-title">Back Away Slowly</div>
                    <div class="emergency-step-description">Face the bear and back away slowly. Avoid direct eye contact.</div>
                </li>
                <li class="emergency-step">
                    <div class="emergency-step-title">Make Noise</div>
                    <div class="emergency-step-description">Talk in a calm, firm voice. Clap your hands or yell to scare the bear away.</div>
                </li>
                <li class="emergency-step">
                    <div class="emergency-step-title">Fight Back if Attacked</div>
                    <div class="emergency-step-description">Do not play dead. Fight back with everything available.</div>
                </li>
            </ol>
        `;
        
        // Insert after bear safety header
        if (bearSafetyHeader.nextSibling) {
            bearSafetyHeader.parentNode.insertBefore(proceduresDiv, bearSafetyHeader.nextSibling);
        }
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