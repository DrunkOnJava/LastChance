/**
 * Professional Checklist Component for BMPOA
 * Using verified procedures from source materials
 */

class ProfessionalChecklists {
    constructor() {
        // Verified checklists from source materials
        this.checklists = {
            newResident: {
                title: "New Resident Checklist",
                icon: "🏠",
                subtitle: "Essential steps for new BMPOA property owners",
                items: [
                    { text: "Obtain Deer Lake Recreation Pass", note: "Contact: bmpoadeerlake@gmail.com", priority: "high" },
                    { text: "Register with BMPOA membership", note: "Contact Membership Committee", priority: "high" },
                    { text: "Review Covenants and Restrictions", note: "Available on BMPOA.org", priority: "high" },
                    { text: "Set up waste disposal service", note: "Choose county sites or private hauler", priority: "medium" },
                    { text: "Contact internet provider", note: "Xfinity or Starlink available", priority: "medium" },
                    { text: "Join community Facebook groups", note: "Blue Mountain POA (private group)", priority: "low" },
                    { text: "Sign up for newsletter", note: "Contact Newsletter Committee", priority: "low" },
                    { text: "Attend board meeting", note: "2nd Monday at 6 PM", priority: "low" }
                ]
            },
            emergencyPrep: {
                title: "Emergency Preparedness",
                icon: "🚨",
                subtitle: "Be ready for mountain emergencies",
                items: [
                    { text: "Post emergency numbers near phone", note: "911 and local services", priority: "high" },
                    { text: "Know evacuation routes", note: "Review community evacuation plan", priority: "high" },
                    { text: "Maintain 30ft defensible space", note: "Fire safety requirement", priority: "high" },
                    { text: "Store emergency water supply", note: "3 gallons per person per day", priority: "high" },
                    { text: "Keep flashlights and batteries", note: "Power outages common", priority: "medium" },
                    { text: "Have battery/crank radio", note: "For emergency updates", priority: "medium" },
                    { text: "Stock first aid supplies", note: "Include medications", priority: "medium" },
                    { text: "Prepare go-bag", note: "Important documents and supplies", priority: "medium" }
                ]
            },
            bearSafety: {
                title: "Bear Safety Checklist",
                icon: "🐻",
                subtitle: "Prevent bear encounters",
                items: [
                    { text: "Remove bird feeders (April-Nov)", note: "Required during active season", priority: "high" },
                    { text: "Secure garbage in locked area", note: "Bears will investigate odors", priority: "high" },
                    { text: "Clean grills after each use", note: "Remove grease and food residue", priority: "high" },
                    { text: "No pet food left outdoors", note: "Bring inside after feeding", priority: "high" },
                    { text: "Install motion lights", note: "Deters nighttime visits", priority: "medium" },
                    { text: "Use electric fencing for gardens", note: "Effective deterrent", priority: "medium" },
                    { text: "Pick ripe fruit promptly", note: "Don't let fruit fall and rot", priority: "medium" },
                    { text: "Report bear sightings", note: "Call Wildlife Conflict: (804) 367-1000", priority: "low" }
                ]
            },
            construction: {
                title: "Construction Project Checklist",
                icon: "🔨",
                subtitle: "Required steps before building",
                items: [
                    { text: "Submit plans to ARC", note: "Via BMPOA.org 'Contact Us'", priority: "high" },
                    { text: "Wait for ARC approval", note: "30-day review period", priority: "high" },
                    { text: "Obtain county permits", note: "After ARC approval only", priority: "high" },
                    { text: "Verify setback requirements", note: "Check covenant restrictions", priority: "high" },
                    { text: "Confirm material compliance", note: "Natural materials required", priority: "medium" },
                    { text: "Plan for 1,000 sq ft minimum", note: "Living space requirement", priority: "medium" },
                    { text: "Schedule inspections", note: "County requirements", priority: "medium" }
                ]
            },
            seasonal: {
                spring: [
                    { text: "Schedule wood chipping service", note: "Contact: jcook0313@gmail.com" },
                    { text: "Clear winter debris from property" },
                    { text: "Check and clear drainage ditches" },
                    { text: "Inspect driveway for winter damage" },
                    { text: "Service lawn equipment" }
                ],
                summer: [
                    { text: "Maintain defensible space", note: "Fire safety" },
                    { text: "Monitor water usage" },
                    { text: "Trim vegetation near structures" },
                    { text: "Check AC units and fans" },
                    { text: "Plan for July 4th picnic" }
                ],
                fall: [
                    { text: "Remove bird feeders", note: "Bear safety" },
                    { text: "Clean gutters and downspouts" },
                    { text: "Service heating system" },
                    { text: "Winterize outdoor faucets" },
                    { text: "Stock emergency supplies" }
                ],
                winter: [
                    { text: "Keep emergency supplies stocked" },
                    { text: "Monitor heating fuel levels" },
                    { text: "Clear snow from fire hydrants" },
                    { text: "Check smoke/CO detectors" },
                    { text: "Plan for holiday gathering" }
                ]
            }
        };
    }
    
    createChecklists() {
        console.log('Creating professional checklists...');
        
        // Load checklist CSS
        const checklistCSS = document.createElement('link');
        checklistCSS.rel = 'stylesheet';
        checklistCSS.href = 'professional-checklist.css';
        document.head.appendChild(checklistCSS);
        
        // Find appropriate sections for checklists
        this.addNewResidentChecklist();
        this.addEmergencyChecklist();
        this.addBearSafetyChecklist();
        this.addConstructionChecklist();
        this.addSeasonalChecklists();
    }
    
    addNewResidentChecklist() {
        const welcomePages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Welcome') || 
            page.textContent.includes('New Resident') ||
            page.textContent.includes('Getting Started')
        );
        
        if (welcomePages.length > 0) {
            const checklist = this.createChecklistElement(this.checklists.newResident);
            const content = welcomePages[0].querySelector('.page-content');
            if (content) {
                content.appendChild(checklist);
            }
        }
    }
    
    addEmergencyChecklist() {
        const emergencyPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Emergency') && page.textContent.includes('Preparedness')
        );
        
        if (emergencyPages.length > 0) {
            const checklist = this.createChecklistElement(this.checklists.emergencyPrep);
            const content = emergencyPages[0].querySelector('.page-content');
            if (content) {
                content.appendChild(checklist);
            }
        }
    }
    
    addBearSafetyChecklist() {
        const bearPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Bear') && page.textContent.includes('Safety')
        );
        
        if (bearPages.length > 0) {
            const checklist = this.createChecklistElement(this.checklists.bearSafety);
            const content = bearPages[0].querySelector('.page-content');
            if (content) {
                // Find bear safety section
                const bearSection = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                    h.textContent.includes('Bear')
                );
                
                if (bearSection && bearSection.nextSibling) {
                    bearSection.parentNode.insertBefore(checklist, bearSection.nextSibling);
                }
            }
        }
    }
    
    addConstructionChecklist() {
        const constructionPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Construction') || 
            page.textContent.includes('Architectural Review') ||
            page.textContent.includes('Building')
        );
        
        if (constructionPages.length > 0) {
            const checklist = this.createChecklistElement(this.checklists.construction);
            const content = constructionPages[0].querySelector('.page-content');
            if (content) {
                content.appendChild(checklist);
            }
        }
    }
    
    addSeasonalChecklists() {
        const maintenancePages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Maintenance') || 
            page.textContent.includes('Seasonal') ||
            page.textContent.includes('Property Care')
        );
        
        if (maintenancePages.length > 0) {
            const seasonalContainer = this.createSeasonalChecklist();
            const content = maintenancePages[0].querySelector('.page-content');
            if (content) {
                content.appendChild(seasonalContainer);
            }
        }
    }
    
    createChecklistElement(checklistData) {
        const container = document.createElement('div');
        container.className = 'checklist-container';
        
        const itemsHTML = checklistData.items.map((item, index) => `
            <li class="checklist-item ${item.priority ? `priority-${item.priority}` : ''}" data-index="${index}">
                <div class="checklist-text">${item.text}</div>
                ${item.note ? `<div class="checklist-note">${item.note}</div>` : ''}
            </li>
        `).join('');
        
        container.innerHTML = `
            <div class="checklist-header">
                <h3 class="checklist-title">
                    <span class="checklist-icon">${checklistData.icon}</span>
                    ${checklistData.title}
                </h3>
                <p class="checklist-subtitle">${checklistData.subtitle}</p>
            </div>
            <ul class="checklist-items">
                ${itemsHTML}
            </ul>
            <div class="checklist-progress">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            <div class="progress-text">0 of ${checklistData.items.length} completed</div>
        `;
        
        // Add click handlers for interactive behavior
        this.addChecklistInteractivity(container);
        
        return container;
    }
    
    createSeasonalChecklist() {
        const container = document.createElement('div');
        container.className = 'checklist-container';
        
        container.innerHTML = `
            <div class="checklist-header">
                <h3 class="checklist-title">
                    <span class="checklist-icon">📅</span>
                    Seasonal Maintenance Checklist
                </h3>
                <p class="checklist-subtitle">Year-round property care tasks</p>
            </div>
            <div class="checklist-seasonal">
                ${Object.entries(this.checklists.seasonal).map(([season, items]) => `
                    <div class="season-checklist">
                        <div class="season-header season-${season}">${season.charAt(0).toUpperCase() + season.slice(1)}</div>
                        <div class="season-items">
                            <ul class="checklist-items checklist-compact">
                                ${items.map(item => `
                                    <li class="checklist-item">
                                        <div class="checklist-text">${item.text}</div>
                                        ${item.note ? `<div class="checklist-note">${item.note}</div>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    }
    
    addChecklistInteractivity(container) {
        const items = container.querySelectorAll('.checklist-item');
        const progressBar = container.querySelector('.progress-bar');
        const progressText = container.querySelector('.progress-text');
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('checked');
                this.updateProgress(container);
            });
        });
    }
    
    updateProgress(container) {
        const items = container.querySelectorAll('.checklist-item');
        const checkedItems = container.querySelectorAll('.checklist-item.checked');
        const progressBar = container.querySelector('.progress-bar');
        const progressText = container.querySelector('.progress-text');
        
        if (progressBar && progressText) {
            const percentage = (checkedItems.length / items.length) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${checkedItems.length} of ${items.length} completed`;
        }
    }
}

// Initialize
const professionalChecklists = new ProfessionalChecklists();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.createChecklists = function() {
        professionalChecklists.createChecklists();
    };
}