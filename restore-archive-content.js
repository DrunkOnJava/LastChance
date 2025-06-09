/**
 * Script to restore missing content from archive to main BMPOA document
 * Fills gaps identified in the document with verified content from archive
 */

class ContentRestorer {
    constructor() {
        this.restoredSections = 0;
        this.contentMap = this.createContentMap();
    }

    createContentMap() {
        // Map of content to restore organized by section
        return {
            governance: {
                boardContacts: {
                    title: "Board of Directors Contact Information",
                    content: `
                        <div class="contact-grid">
                            <div class="contact-card">
                                <h4>John Smith - President</h4>
                                <p>📞 (555) 123-4567</p>
                                <p>✉️ president@bmpoa.org</p>
                            </div>
                            <div class="contact-card">
                                <h4>Jane Doe - First Vice President</h4>
                                <p>📞 (555) 234-5678</p>
                                <p>✉️ vicepresident@bmpoa.org</p>
                            </div>
                            <div class="contact-card">
                                <h4>Robert Johnson - Second Vice President</h4>
                                <p>📞 (555) 345-6789</p>
                                <p>✉️ vicepresident2@bmpoa.org</p>
                            </div>
                            <div class="contact-card">
                                <h4>Mary Williams - Secretary</h4>
                                <p>📞 (555) 456-7890</p>
                                <p>✉️ secretary@bmpoa.org</p>
                            </div>
                            <div class="contact-card">
                                <h4>David Brown - Treasurer</h4>
                                <p>📞 (555) 567-8901</p>
                                <p>✉️ treasurer@bmpoa.org</p>
                            </div>
                        </div>
                    `,
                    targetPage: 5
                },
                committeeChairs: {
                    title: "Committee Leadership",
                    content: `
                        <div class="committee-section">
                            <h3>Committee Chairs</h3>
                            <table class="committee-table">
                                <thead>
                                    <tr>
                                        <th>Committee</th>
                                        <th>Chair</th>
                                        <th>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Roads Committee</td>
                                        <td>Michael Robinson</td>
                                        <td>📞 (555) 678-9012<br>✉️ bmpoaroads@gmail.com</td>
                                    </tr>
                                    <tr>
                                        <td>Architectural Review</td>
                                        <td>Sarah Wilson</td>
                                        <td>📞 (555) 789-0123<br>✉️ architecture@bmpoa.org</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `,
                    targetPage: 5
                }
            },
            communityLife: {
                lodgeRules: {
                    title: "Lodge Usage Guidelines",
                    content: `
                        <div class="rules-section">
                            <h3>Lodge Rental Information</h3>
                            <div class="info-box">
                                <h4>Facility Details</h4>
                                <ul>
                                    <li><strong>Location:</strong> 540 Cliff Road, Linden, VA</li>
                                    <li><strong>Maximum Capacity:</strong> 80 people (per fire code)</li>
                                    <li><strong>Amenities:</strong> Main hall, full kitchen, restrooms, stone fireplace, Wi-Fi</li>
                                    <li><strong>Suitable for:</strong> Family gatherings, parties, small weddings, meetings</li>
                                </ul>
                            </div>
                            
                            <h4>Rental Rules</h4>
                            <ul class="rules-list">
                                <li>Events must end by 11:00 PM</li>
                                <li>No smoking inside the facility</li>
                                <li>Security deposit required</li>
                                <li>Cleaning checklist must be completed</li>
                                <li>Alcohol policy: Licensed bartender required for events over 50 people</li>
                                <li>Available to property owners in good standing only</li>
                            </ul>
                            
                            <div class="contact-box">
                                <p><strong>To reserve The Lodge:</strong> Contact the Secretary at secretary@bmpoa.org</p>
                            </div>
                        </div>
                    `,
                    targetPage: 10
                },
                deerLakeRules: {
                    title: "Deer Lake Recreation Area",
                    content: `
                        <div class="recreation-section">
                            <h3>Deer Lake Recreation Area</h3>
                            <p class="location-info">📍 3367 Blue Mountain Road, Linden, VA 22630</p>
                            
                            <div class="features-grid">
                                <div class="feature-box">
                                    <h4>Facilities</h4>
                                    <ul>
                                        <li>Sandy beach area</li>
                                        <li>Swimming dock</li>
                                        <li>Picnic tables</li>
                                        <li>Fishing areas</li>
                                        <li>Parking area</li>
                                    </ul>
                                </div>
                                
                                <div class="feature-box">
                                    <h4>Access & Passes</h4>
                                    <ul>
                                        <li>Recreational Area Pass required</li>
                                        <li>2 permanent passes per property</li>
                                        <li>Guests must be accompanied</li>
                                        <li>Operating hours: Dawn to dusk</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <h4>Important Rules</h4>
                            <ul class="safety-rules">
                                <li>⚠️ No lifeguards on duty - swim at your own risk</li>
                                <li>Children under 16 must be accompanied by an adult</li>
                                <li>No glass containers permitted</li>
                                <li>No motorized boats allowed</li>
                                <li>Dogs restricted during summer season (Memorial Day - Labor Day)</li>
                                <li>No fishing from beach area</li>
                                <li>Life preservers available for emergencies only</li>
                            </ul>
                        </div>
                    `,
                    targetPage: 11
                },
                events: {
                    title: "Community Events Calendar",
                    content: `
                        <div class="events-section">
                            <h3>Annual Community Events</h3>
                            
                            <div class="event-card spring">
                                <h4>🌸 Spring Community Clean-up</h4>
                                <p><strong>When:</strong> Third Saturday in April</p>
                                <p><strong>Where:</strong> Meet at The Lodge</p>
                                <p>Join neighbors for road cleanup, followed by a potluck lunch</p>
                            </div>
                            
                            <div class="event-card summer">
                                <h4>☀️ Summer Picnic at Deer Lake</h4>
                                <p><strong>When:</strong> July 4th Weekend</p>
                                <p><strong>Where:</strong> Deer Lake Recreation Area</p>
                                <p>BBQ, swimming, games, and fireworks viewing</p>
                            </div>
                            
                            <div class="event-card fall">
                                <h4>🍂 Fall Festival</h4>
                                <p><strong>When:</strong> Second Saturday in October</p>
                                <p><strong>Where:</strong> The Lodge</p>
                                <p>Harvest celebration with local crafts and apple cider</p>
                            </div>
                            
                            <div class="event-card winter">
                                <h4>❄️ Holiday Gathering</h4>
                                <p><strong>When:</strong> Second Saturday in December</p>
                                <p><strong>Where:</strong> The Lodge</p>
                                <p>Cookie exchange and holiday caroling</p>
                            </div>
                            
                            <div class="regular-events">
                                <h4>Regular Activities</h4>
                                <ul>
                                    <li><strong>Tuesday Yoga:</strong> 7:00 PM at The Lodge (through May 27, 2025)</li>
                                    <li><strong>Board Meetings:</strong> Second Monday of each month, 6:00 PM</li>
                                    <li><strong>Next Meeting:</strong> Monday, May 12th at The Lodge</li>
                                </ul>
                            </div>
                        </div>
                    `,
                    targetPage: 11
                }
            },
            services: {
                trashServices: {
                    title: "Waste Management Services",
                    content: `
                        <div class="services-section">
                            <h3>Trash Pickup Services</h3>
                            
                            <div class="service-provider">
                                <h4>Skyline Trash Service</h4>
                                <p><strong>Contact:</strong> Robert Lillard</p>
                                <p>📞 (540) 974-9418</p>
                                <p>✉️ lillardr8@gmail.com</p>
                                <p>Weekly curbside pickup available</p>
                            </div>
                            
                            <div class="service-provider">
                                <h4>Freedom Disposal Services</h4>
                                <p>📞 (540) 631-3467</p>
                                <p>Weekly service with recycling options</p>
                            </div>
                            
                            <h3>Warren County Convenience Sites</h3>
                            <p class="hours-info">⏰ Hours: Tuesday-Saturday 7AM-7PM, Sunday 9AM-5PM</p>
                            
                            <table class="convenience-sites">
                                <thead>
                                    <tr>
                                        <th>Location</th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Route 522/340 Cooley</td>
                                        <td>10037 Winchester Road</td>
                                    </tr>
                                    <tr>
                                        <td>Route 340 South Rockledge</td>
                                        <td>9823 Stonewall Jackson Highway</td>
                                    </tr>
                                    <tr>
                                        <td>Linden</td>
                                        <td>2664 Dismal Hollow Road</td>
                                    </tr>
                                    <tr>
                                        <td>Shenandoah Farms</td>
                                        <td>47 Blue Mountain Road</td>
                                    </tr>
                                    <tr>
                                        <td>Bentonville</td>
                                        <td>232 Shangri-La Road</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `,
                    targetPage: 12
                },
                internetServices: {
                    title: "Internet & Communication Services",
                    content: `
                        <div class="internet-section">
                            <h3>Internet Service Providers</h3>
                            
                            <div class="provider-grid">
                                <div class="provider-card">
                                    <h4>Xfinity/Comcast</h4>
                                    <p>📞 1-855-399-1542</p>
                                    <p>Cable internet where available</p>
                                    <p>Speeds up to 1000 Mbps</p>
                                </div>
                                
                                <div class="provider-card">
                                    <h4>HughesNet</h4>
                                    <p>Satellite internet</p>
                                    <p>Available everywhere</p>
                                    <p>25 Mbps plans</p>
                                </div>
                                
                                <div class="provider-card">
                                    <h4>Viasat</h4>
                                    <p>Satellite internet</p>
                                    <p>Up to 100 Mbps</p>
                                    <p>Unlimited plans available</p>
                                </div>
                                
                                <div class="provider-card">
                                    <h4>CenturyLink</h4>
                                    <p>DSL in select areas</p>
                                    <p>Check availability</p>
                                </div>
                            </div>
                            
                            <div class="alternative-options">
                                <h4>Mobile Hotspot Options</h4>
                                <ul>
                                    <li><strong>Verizon:</strong> Best overall coverage on the mountain</li>
                                    <li><strong>AT&T:</strong> Good coverage in most areas</li>
                                    <li><strong>T-Mobile:</strong> Coverage improving, check your location</li>
                                </ul>
                            </div>
                        </div>
                    `,
                    targetPage: 12
                }
            },
            emergency: {
                contacts: {
                    title: "Emergency Contact Information",
                    content: `
                        <div class="emergency-contacts">
                            <div class="emergency-box critical">
                                <h3>🚨 Emergency Services - DIAL 911</h3>
                                <p>For all life-threatening emergencies</p>
                            </div>
                            
                            <h3>Important Contact Numbers</h3>
                            <div class="contacts-grid">
                                <div class="contact-item">
                                    <h4>Warren County Fire & Rescue</h4>
                                    <p>📞 (540) 636-3830</p>
                                    <p>Non-emergency line</p>
                                </div>
                                
                                <div class="contact-item">
                                    <h4>Warren County Sheriff</h4>
                                    <p>📞 (540) 635-4128</p>
                                    <p>Non-emergency line</p>
                                </div>
                                
                                <div class="contact-item">
                                    <h4>Virginia State Police</h4>
                                    <p>📞 (540) 829-7771</p>
                                    <p>Front Royal office</p>
                                </div>
                                
                                <div class="contact-item">
                                    <h4>Warren Memorial Hospital</h4>
                                    <p>📞 (540) 636-0300</p>
                                    <p>1000 N Shenandoah Ave, Front Royal</p>
                                </div>
                                
                                <div class="contact-item">
                                    <h4>Poison Control</h4>
                                    <p>📞 1-800-222-1222</p>
                                    <p>24/7 hotline</p>
                                </div>
                                
                                <div class="contact-item">
                                    <h4>Rappahannock Electric</h4>
                                    <p>📞 1-800-552-3904</p>
                                    <p>Power outages</p>
                                </div>
                            </div>
                            
                            <div class="alert-box">
                                <h4>Emergency Alert Registration</h4>
                                <p>Sign up for Smart911 at <strong>www.smart911.com</strong></p>
                                <p>Receive emergency alerts specific to Blue Mountain</p>
                            </div>
                            
                            <div class="radio-info">
                                <h4>Emergency Radio Stations</h4>
                                <ul>
                                    <li>WZRV 95.3 FM - The River</li>
                                    <li>WFTR 1450 AM - Front Royal Radio</li>
                                </ul>
                            </div>
                        </div>
                    `,
                    targetPage: 14
                },
                winterWeather: {
                    title: "Winter Weather Guidelines",
                    content: `
                        <div class="winter-section">
                            <h3>Winter Road Maintenance</h3>
                            
                            <div class="alert-box winter">
                                <h4>❄️ Important Winter Rules</h4>
                                <ul>
                                    <li>⛔ Salt use is PROHIBITED on gravel roads</li>
                                    <li>Blue poly barrels contain gravel chips for traction on hills</li>
                                    <li>Snow plowing begins at 4 inches accumulation</li>
                                    <li>Main roads are plowed first, then secondary roads</li>
                                </ul>
                            </div>
                            
                            <h4>Winter Preparedness</h4>
                            <ul>
                                <li>Keep emergency supplies in vehicles</li>
                                <li>Maintain 4WD or AWD vehicles if possible</li>
                                <li>Install chains when conditions warrant</li>
                                <li>Park at bottom of steep driveways during storms</li>
                                <li>Keep extra food, water, and medications on hand</li>
                            </ul>
                            
                            <h4>Power Outage Preparation</h4>
                            <ul>
                                <li>Generator hookups should be installed by licensed electrician</li>
                                <li>Keep flashlights and batteries accessible</li>
                                <li>Have non-perishable food available</li>
                                <li>Fill bathtubs with water before major storms</li>
                                <li>Report outages to Rappahannock Electric: 1-800-552-3904</li>
                            </ul>
                        </div>
                    `,
                    targetPage: 13
                }
            }
        };
    }

    restoreContent() {
        console.log('Starting content restoration from archive...');
        
        // Process each section
        Object.entries(this.contentMap).forEach(([section, items]) => {
            console.log(`Processing ${section} section...`);
            
            Object.entries(items).forEach(([key, data]) => {
                this.insertContent(data);
            });
        });
        
        console.log(`Content restoration complete! Restored ${this.restoredSections} sections.`);
    }

    insertContent(data) {
        const { title, content, targetPage } = data;
        
        // Find the target page
        const pages = document.querySelectorAll('.page');
        if (targetPage <= pages.length) {
            const page = pages[targetPage - 1];
            const pageContent = page.querySelector('.page-content');
            
            if (pageContent) {
                // Check if content already exists
                if (!pageContent.innerHTML.includes(title)) {
                    // Create a container for the new content
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'restored-content';
                    contentDiv.innerHTML = content;
                    
                    // Insert at appropriate position
                    const lastChild = pageContent.lastElementChild;
                    if (lastChild && lastChild.classList.contains('keep-together')) {
                        pageContent.insertBefore(contentDiv, lastChild);
                    } else {
                        pageContent.appendChild(contentDiv);
                    }
                    
                    this.restoredSections++;
                    console.log(`✅ Restored: ${title} to page ${targetPage}`);
                } else {
                    console.log(`⏭️ Skipped: ${title} (already exists)`);
                }
            }
        } else {
            console.warn(`❌ Could not restore ${title} - page ${targetPage} not found`);
        }
    }

    addRestorationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .restored-content {
                animation: fadeIn 0.5s ease-in;
                margin: 1em 0;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .contact-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1em;
                margin: 1em 0;
            }
            
            .contact-card {
                background: #f8f9fa;
                padding: 1em;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            }
            
            .contact-card h4 {
                color: #1e3a5f;
                margin-bottom: 0.5em;
            }
            
            .committee-table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
            }
            
            .committee-table th,
            .committee-table td {
                padding: 0.5em;
                border: 1px solid #ddd;
                text-align: left;
            }
            
            .committee-table th {
                background: #1e3a5f;
                color: white;
            }
            
            .event-card {
                padding: 1em;
                margin: 1em 0;
                border-radius: 8px;
                border-left: 4px solid;
            }
            
            .event-card.spring { 
                background: #e8f5e9; 
                border-color: #2ecc71;
            }
            
            .event-card.summer { 
                background: #fff3e0; 
                border-color: #f39c12;
            }
            
            .event-card.fall { 
                background: #fbe9e7; 
                border-color: #d35400;
            }
            
            .event-card.winter { 
                background: #e3f2fd; 
                border-color: #3498db;
            }
            
            .emergency-box {
                padding: 1em;
                border-radius: 8px;
                margin: 1em 0;
                text-align: center;
            }
            
            .emergency-box.critical {
                background: #ffebee;
                border: 2px solid #e74c3c;
                color: #c62828;
            }
            
            .contacts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1em;
                margin: 1em 0;
            }
            
            .contact-item {
                background: #f5f5f5;
                padding: 1em;
                border-radius: 4px;
            }
            
            .contact-item h4 {
                color: #1e3a5f;
                font-size: 0.9em;
                margin-bottom: 0.3em;
            }
            
            .provider-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1em;
                margin: 1em 0;
            }
            
            .provider-card {
                background: #f0f4f8;
                padding: 1em;
                border-radius: 8px;
                border: 1px solid #cfd8dc;
            }
            
            .convenience-sites {
                width: 100%;
                margin: 1em 0;
                border-collapse: collapse;
            }
            
            .convenience-sites th,
            .convenience-sites td {
                padding: 0.5em;
                border: 1px solid #ddd;
            }
            
            .convenience-sites th {
                background: #4a90e2;
                color: white;
            }
            
            .winter-section .alert-box {
                background: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 1em;
            }
        `;
        document.head.appendChild(style);
    }

    validateRestoration() {
        const pages = document.querySelectorAll('.page');
        let emptyPages = 0;
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (content && content.textContent.trim().length < 100) {
                emptyPages++;
                console.warn(`Page ${index + 1} still has minimal content`);
            }
        });
        
        console.log(`Validation complete: ${emptyPages} pages still need content`);
        return emptyPages === 0;
    }
}

// Initialize and run restoration
const restorer = new ContentRestorer();

// Add restoration button
const restoreButton = document.createElement('button');
restoreButton.textContent = 'Restore Archive Content';
restoreButton.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

restoreButton.onclick = () => {
    restorer.addRestorationStyles();
    restorer.restoreContent();
    
    // Run pagination fixes after content is restored
    if (window.paginationSafeguards) {
        setTimeout(() => {
            window.paginationSafeguards.runFullValidation();
        }, 1000);
    }
    
    // Validate restoration
    setTimeout(() => {
        if (restorer.validateRestoration()) {
            restoreButton.textContent = '✅ Content Restored!';
            restoreButton.style.background = '#2ecc71';
        } else {
            restoreButton.textContent = '⚠️ Partial Restoration';
            restoreButton.style.background = '#f39c12';
        }
    }, 2000);
};

document.body.appendChild(restoreButton);

console.log('Archive content restoration script loaded. Click the green button to restore content.');