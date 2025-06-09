/**
 * Professional Back Cover Component for BMPOA
 * Essential contacts from verified source materials
 */

class ProfessionalBackCover {
    constructor() {
        // Verified contacts from source materials
        this.essentialContacts = {
            emergency: {
                primary: "911",
                fire: {
                    station1: "(540) 635-1435",
                    station5: "(540) 635-0053"
                }
            },
            utilities: {
                power: {
                    name: "Rappahannock Electric",
                    outages: "(800) 552-3904"
                }
            },
            bmpoa: {
                mail: "P.O. Box 114, Linden, VA 22642",
                website: "BMPOA.org",
                lodge: "bluemountainlodgebooking@gmail.com",
                deerLake: "bmpoadeerlake@gmail.com"
            },
            waste: {
                freedom: "(540) 631-3467",
                skyline: "(540) 974-9418"
            },
            wildlife: {
                conflict: "(804) 367-1000",
                animalControl: "(540) 636-7834"
            }
        };
        
        // Organization info
        this.orgInfo = {
            name: "Blue Mountain Property Owners Association",
            tagline: "A Mountain Home",
            motto: "ANGULUS RIDET",
            founded: "Late 1950s",
            type: "Sanitary District"
        };
    }
    
    createBackCover() {
        console.log('Creating professional back cover...');
        
        // Load back cover CSS
        const backCoverCSS = document.createElement('link');
        backCoverCSS.rel = 'stylesheet';
        backCoverCSS.href = 'professional-back-cover.css';
        document.head.appendChild(backCoverCSS);
        
        // Create back cover page
        const backCoverPage = document.createElement('div');
        backCoverPage.className = 'page back-cover';
        backCoverPage.setAttribute('data-template', 'back-cover');
        
        backCoverPage.innerHTML = `
            ${this.createEssentialContacts()}
            ${this.createQuickReference()}
            ${this.createWebsiteBanner()}
            ${this.createFooterInfo()}
        `;
        
        // Find the last page and insert after it
        const pages = document.querySelectorAll('.page');
        if (pages.length > 0) {
            const lastPage = pages[pages.length - 1];
            lastPage.parentNode.insertBefore(backCoverPage, lastPage.nextSibling);
        } else {
            document.body.appendChild(backCoverPage);
        }
    }
    
    createEssentialContacts() {
        return `
            <div class="essential-contacts">
                <h2 class="essential-contacts-title">Essential Contacts</h2>
                
                <div class="emergency-highlight">
                    <div class="contact-category">For All Emergencies</div>
                    <div class="contact-primary">911</div>
                </div>
                
                <div class="contacts-grid">
                    <div class="contact-block">
                        <div class="contact-category">Fire & Rescue</div>
                        <div class="contact-primary">Station #1</div>
                        <div class="contact-secondary">${this.essentialContacts.emergency.fire.station1}</div>
                        <div class="contact-primary" style="margin-top: 0.5rem;">Station #5</div>
                        <div class="contact-secondary">${this.essentialContacts.emergency.fire.station5}</div>
                    </div>
                    
                    <div class="contact-block">
                        <div class="contact-category">Power Outages</div>
                        <div class="contact-primary">${this.essentialContacts.utilities.power.name}</div>
                        <div class="contact-secondary">${this.essentialContacts.utilities.power.outages}</div>
                    </div>
                    
                    <div class="contact-block">
                        <div class="contact-category">Wildlife Issues</div>
                        <div class="contact-primary">Wildlife Conflict</div>
                        <div class="contact-secondary">${this.essentialContacts.wildlife.conflict}</div>
                        <div class="contact-secondary" style="margin-top: 0.5rem;">Animal Control: ${this.essentialContacts.wildlife.animalControl}</div>
                    </div>
                    
                    <div class="contact-block">
                        <div class="contact-category">Waste Services</div>
                        <div class="contact-primary">Private Haulers</div>
                        <div class="contact-secondary">Freedom: ${this.essentialContacts.waste.freedom}</div>
                        <div class="contact-secondary">Skyline: ${this.essentialContacts.waste.skyline}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createQuickReference() {
        return `
            <div class="quick-reference">
                <h3 class="quick-reference-title">Quick Reference</h3>
                <div class="reference-items">
                    <div class="reference-item">
                        <span class="reference-icon">📋</span>
                        <span class="reference-text">Board Meetings: 2nd Monday @ 6PM</span>
                    </div>
                    <div class="reference-item">
                        <span class="reference-icon">🏛️</span>
                        <span class="reference-text">Lodge: 540 Cliff Road</span>
                    </div>
                    <div class="reference-item">
                        <span class="reference-icon">📮</span>
                        <span class="reference-text">${this.essentialContacts.bmpoa.mail}</span>
                    </div>
                    <div class="reference-item">
                        <span class="reference-icon">🏊</span>
                        <span class="reference-text">Deer Lake Pass Required</span>
                    </div>
                    <div class="reference-item">
                        <span class="reference-icon">🔥</span>
                        <span class="reference-text">No Open Burning</span>
                    </div>
                    <div class="reference-item">
                        <span class="reference-icon">🐻</span>
                        <span class="reference-text">Remove Bird Feeders Apr-Nov</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    createWebsiteBanner() {
        return `
            <div class="website-banner">
                <h3 class="website-url">${this.essentialContacts.bmpoa.website}</h3>
                <p class="website-tagline">Your source for community information and updates</p>
            </div>
        `;
    }
    
    createFooterInfo() {
        return `
            <div class="back-cover-footer">
                <img src="images/bmpoa-emblem.png" alt="BMPOA Emblem" class="back-emblem">
                <h3 class="organization-name">${this.orgInfo.name}</h3>
                <p class="organization-tagline">${this.orgInfo.tagline}</p>
                <p class="organization-motto">${this.orgInfo.motto}</p>
                
                <div class="service-hours">
                    <div class="hours-title">County Convenience Sites</div>
                    <div>Linden • Route 340 South • Route 522/340 • Shenandoah Farms</div>
                    <div>Free disposal for residents</div>
                </div>
                
                <div class="document-info">
                    Community Guide • 2025 Edition • Established ${this.orgInfo.founded}
                </div>
            </div>
        `;
    }
}

// Initialize
const backCover = new ProfessionalBackCover();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.createBackCover = function() {
        backCover.createBackCover();
    };
}