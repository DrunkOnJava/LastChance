/**
 * Professional Amenities and Services Components
 * Using verified content from BMPOA source materials
 */

class ProfessionalAmenities {
    constructor() {
        // Verified amenities from source materials
        this.amenities = {
            lodge: {
                icon: '🏛️',
                name: 'The Lodge',
                subtitle: 'Community Gathering Space',
                address: '540 Cliff Road, Linden, VA 22642',
                features: [
                    'Large hall for up to 75 people',
                    'Full commercial kitchen',
                    'Wraparound deck with views',
                    'Board meetings 2nd Monday @ 6PM',
                    'Available for private rentals'
                ],
                contact: 'bluemountainlodgebooking@gmail.com'
            },
            deerLake: {
                icon: '🏊',
                name: 'Deer Lake',
                subtitle: 'Private Recreation Area',
                features: [
                    'Sandy beach area',
                    'Floating dock',
                    'Picnic tables',
                    'Catch-and-release fishing',
                    'Kayaking and swimming',
                    'Members only - pass required'
                ],
                contact: 'bmpoadeerlake@gmail.com'
            },
            trails: {
                icon: '🥾',
                name: 'Trail System',
                subtitle: 'Mountain Hiking Network',
                features: [
                    'Blue Mountain Trailhead access',
                    'Appalachian Trail connector',
                    'Multiple difficulty levels',
                    'Scenic overlooks',
                    'Wildlife viewing opportunities'
                ]
            },
            woodChipping: {
                icon: '🌲',
                name: 'Wood Chipping Service',
                subtitle: 'Annual Spring Service',
                features: [
                    'Free for all property owners',
                    'Early spring scheduling',
                    'Roadside brush removal',
                    'Branches up to 8" diameter',
                    'Free chips at Lodge & Deer Lake'
                ],
                contact: 'jcook0313@gmail.com'
            }
        };
        
        // Verified service providers
        this.services = {
            waste: [
                { name: 'County Convenience Sites', type: 'Free Drop-off', locations: 4 },
                { name: 'Freedom Disposal', type: 'Private Hauler', phone: '(540) 631-3467' },
                { name: 'Skyline Trash Service', type: 'Private Hauler', phone: '(540) 974-9418' }
            ],
            internet: [
                { name: 'Xfinity (Comcast)', type: 'Cable Internet', phone: '1-855-399-1542' },
                { name: 'Starlink', type: 'Satellite Internet', note: 'Available throughout BMPOA' }
            ],
            utilities: [
                { name: 'Rappahannock Electric', type: 'Power', phone: '(800) 552-3904' }
            ]
        };
    }
    
    createAmenitiesSection() {
        console.log('Creating professional amenities section...');
        
        // Load amenities CSS
        const amenitiesCSS = document.createElement('link');
        amenitiesCSS.rel = 'stylesheet';
        amenitiesCSS.href = 'professional-icons-amenities.css';
        document.head.appendChild(amenitiesCSS);
        
        // Find amenities sections
        const amenitiesPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Lodge') || 
            page.textContent.includes('Deer Lake') ||
            page.textContent.includes('Amenities') ||
            page.textContent.includes('Services')
        );
        
        amenitiesPages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Look for amenities headings
            const amenitiesHeading = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                h.textContent.includes('Amenities') || 
                h.textContent.includes('Facilities') ||
                h.textContent.includes('Services')
            );
            
            if (amenitiesHeading) {
                // Create amenities grid
                const amenitiesGrid = this.createAmenitiesGrid();
                
                // Insert after heading
                if (amenitiesHeading.nextSibling) {
                    amenitiesHeading.parentNode.insertBefore(amenitiesGrid, amenitiesHeading.nextSibling);
                }
            }
            
            // Look for service sections
            const serviceHeading = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                h.textContent.includes('Waste') || 
                h.textContent.includes('Internet') ||
                h.textContent.includes('Utilities')
            );
            
            if (serviceHeading) {
                // Create services section
                const servicesSection = this.createServicesSection();
                
                // Insert after heading
                if (serviceHeading.nextSibling) {
                    serviceHeading.parentNode.insertBefore(servicesSection, serviceHeading.nextSibling);
                }
            }
        });
        
        // Create quick access services card
        this.createQuickAccessServices();
    }
    
    createAmenitiesGrid() {
        const grid = document.createElement('div');
        grid.className = 'amenities-grid';
        
        Object.entries(this.amenities).forEach(([key, amenity]) => {
            const card = document.createElement('div');
            card.className = 'amenity-card';
            
            card.innerHTML = `
                <div class="amenity-header">
                    <span class="amenity-icon">${amenity.icon}</span>
                    <div>
                        <h3 class="amenity-title">${amenity.name}</h3>
                        <p class="amenity-subtitle">${amenity.subtitle}</p>
                    </div>
                </div>
                <ul class="amenity-features">
                    ${amenity.features.map(feature => 
                        `<li class="amenity-feature">${feature}</li>`
                    ).join('')}
                </ul>
                ${amenity.contact ? `
                    <div class="amenity-contact">
                        <span class="icon-amenity icon-email">${amenity.contact}</span>
                    </div>
                ` : ''}
            `;
            
            grid.appendChild(card);
        });
        
        return grid;
    }
    
    createServicesSection() {
        const section = document.createElement('div');
        section.className = 'services-section';
        
        // Waste Services
        const wasteCard = this.createServiceProviderCard('Waste Management', '♻️', this.services.waste);
        section.appendChild(wasteCard);
        
        // Internet Services
        const internetCard = this.createServiceProviderCard('Internet Providers', '📶', this.services.internet);
        section.appendChild(internetCard);
        
        // Utility Services
        const utilityCard = this.createServiceProviderCard('Utilities', '⚡', this.services.utilities);
        section.appendChild(utilityCard);
        
        return section;
    }
    
    createServiceProviderCard(title, icon, providers) {
        const card = document.createElement('div');
        card.className = 'service-provider-card';
        
        const providersHTML = providers.map(provider => `
            <div class="service-detail">
                <div class="service-detail-label">${provider.type}</div>
                <div class="service-detail-value">${provider.name}</div>
                ${provider.phone ? `<div class="icon-amenity icon-phone">${provider.phone}</div>` : ''}
                ${provider.note ? `<div style="font-size: 0.85rem; color: #5d6d7e;">${provider.note}</div>` : ''}
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="service-provider-header">
                <span class="service-icon-large">${icon}</span>
                <div class="service-provider-info">
                    <h3>${title}</h3>
                    <p class="service-provider-type">Essential Services</p>
                </div>
            </div>
            <div class="service-details-grid">
                ${providersHTML}
            </div>
        `;
        
        return card;
    }
    
    createQuickAccessServices() {
        // Find a good location for quick services
        const communityPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Community') && 
            page.textContent.includes('Service')
        );
        
        if (communityPages.length > 0) {
            const quickServices = document.createElement('div');
            quickServices.className = 'quick-services';
            
            quickServices.innerHTML = `
                <h2 class="quick-services-title">Quick Access Services</h2>
                <div class="quick-services-grid">
                    <div class="quick-service-item">
                        <span class="quick-service-icon">🚨</span>
                        <div class="quick-service-name">Emergency</div>
                        <div class="quick-service-info">911</div>
                    </div>
                    <div class="quick-service-item">
                        <span class="quick-service-icon">⚡</span>
                        <div class="quick-service-name">Power Outage</div>
                        <div class="quick-service-info">(800) 552-3904</div>
                    </div>
                    <div class="quick-service-item">
                        <span class="quick-service-icon">🏛️</span>
                        <div class="quick-service-name">Lodge Rental</div>
                        <div class="quick-service-info">Email via website</div>
                    </div>
                    <div class="quick-service-item">
                        <span class="quick-service-icon">🏊</span>
                        <div class="quick-service-name">Deer Lake Pass</div>
                        <div class="quick-service-info">bmpoadeerlake@</div>
                    </div>
                    <div class="quick-service-item">
                        <span class="quick-service-icon">♻️</span>
                        <div class="quick-service-name">Waste Sites</div>
                        <div class="quick-service-info">4 Locations</div>
                    </div>
                    <div class="quick-service-item">
                        <span class="quick-service-icon">🌲</span>
                        <div class="quick-service-name">Wood Chipping</div>
                        <div class="quick-service-info">Spring Service</div>
                    </div>
                </div>
            `;
            
            const pageContent = communityPages[0].querySelector('.page-content');
            if (pageContent) {
                pageContent.appendChild(quickServices);
            }
        }
    }
    
    addIconsToExistingContent() {
        // Add icons to existing lists and sections
        const listItems = document.querySelectorAll('li');
        listItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            let icon = '';
            
            // Match content to icons
            if (text.includes('lodge')) icon = '🏛️';
            else if (text.includes('deer lake')) icon = '🏊';
            else if (text.includes('trail')) icon = '🥾';
            else if (text.includes('waste') || text.includes('trash')) icon = '♻️';
            else if (text.includes('internet') || text.includes('xfinity')) icon = '📶';
            else if (text.includes('electric') || text.includes('power')) icon = '⚡';
            else if (text.includes('emergency')) icon = '🚨';
            else if (text.includes('fire')) icon = '🔥';
            else if (text.includes('bear')) icon = '🐻';
            else if (text.includes('wine') || text.includes('winery')) icon = '🍷';
            else if (text.includes('email')) icon = '✉️';
            else if (text.includes('phone')) icon = '📞';
            else if (text.includes('meeting')) icon = '📅';
            else if (text.includes('committee')) icon = '📋';
            
            if (icon && !item.innerHTML.includes(icon)) {
                item.innerHTML = `<span style="margin-right: 0.5rem;">${icon}</span> ${item.innerHTML}`;
            }
        });
    }
}

// Initialize
const professionalAmenities = new ProfessionalAmenities();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.createAmenitiesSection = function() {
        professionalAmenities.createAmenitiesSection();
        professionalAmenities.addIconsToExistingContent();
    };
}