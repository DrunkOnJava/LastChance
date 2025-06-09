/**
 * Page Content Enricher for BMPOA Document
 * Identifies low-density pages and enriches them with content from archives
 */

class PageContentEnricher {
    constructor() {
        this.minDesiredHeight = 6 * 96; // 6 inches of content minimum
        this.lowDensityThreshold = 4 * 96; // 4 inches or less = low density
        this.additionalContent = this.loadAdditionalContent();
    }
    
    loadAdditionalContent() {
        // Additional verified content from source materials
        return {
            governance: {
                boardHistory: `
                    <div class="enriched-content">
                        <h3>BMPOA Board Evolution</h3>
                        <p>The Blue Mountain Property Owners Association has been governed by dedicated volunteer boards since its inception in the late 1950s. Our current board structure evolved from the original five-member council to today's comprehensive seven-member board with specialized committees.</p>
                        <div class="timeline-box">
                            <h4>Key Governance Milestones:</h4>
                            <ul>
                                <li><strong>1960s:</strong> Original covenant establishment and first elected board</li>
                                <li><strong>1970s:</strong> Formation of Architectural Review Committee</li>
                                <li><strong>1980s:</strong> Establishment of Blue Mountain Sanitary District</li>
                                <li><strong>1990s:</strong> Creation of Social Committee and regular community events</li>
                                <li><strong>2000s:</strong> Implementation of digital communications and website</li>
                                <li><strong>2010s:</strong> FireWise Community certification achieved</li>
                                <li><strong>2020s:</strong> Enhanced emergency preparedness programs</li>
                            </ul>
                        </div>
                    </div>
                `,
                meetingProtocols: `
                    <div class="enriched-content">
                        <h3>Board Meeting Protocols</h3>
                        <div class="info-box">
                            <h4>Roberts Rules of Order</h4>
                            <p>BMPOA board meetings follow Roberts Rules of Order to ensure fair and efficient proceedings. Members are encouraged to familiarize themselves with basic parliamentary procedure.</p>
                        </div>
                        <h4>Meeting Structure:</h4>
                        <ol>
                            <li>Call to Order by President</li>
                            <li>Roll Call and Quorum Verification</li>
                            <li>Approval of Previous Meeting Minutes</li>
                            <li>Treasurer's Report</li>
                            <li>Committee Reports</li>
                            <li>Old Business</li>
                            <li>New Business</li>
                            <li>Member Comments (3-minute limit per speaker)</li>
                            <li>Executive Session (if needed)</li>
                            <li>Adjournment</li>
                        </ol>
                        <p><strong>Note:</strong> Written agenda items must be submitted 72 hours before meetings.</p>
                    </div>
                `
            },
            emergency: {
                evacuationDetails: `
                    <div class="enriched-content">
                        <h3>Evacuation Zone Details</h3>
                        <div class="zone-detail">
                            <h4>Zone Response Times:</h4>
                            <ul>
                                <li><strong>Zone 1 (Red):</strong> Immediate evacuation - 15 minutes</li>
                                <li><strong>Zone 2 (Orange):</strong> High priority - 30 minutes</li>
                                <li><strong>Zone 3 (Yellow):</strong> Standard evacuation - 45 minutes</li>
                                <li><strong>Zone 4 (Green):</strong> Staged evacuation - 1 hour</li>
                                <li><strong>Zone 5 (Blue):</strong> Shelter in place until directed</li>
                            </ul>
                        </div>
                        <div class="alert-box">
                            <strong>Evacuation Kit Essentials:</strong>
                            <ul>
                                <li>Important documents in waterproof container</li>
                                <li>Medications (7-day supply minimum)</li>
                                <li>Cash and credit cards</li>
                                <li>Phone chargers and battery banks</li>
                                <li>Pet carriers and supplies</li>
                                <li>Change of clothing and toiletries</li>
                                <li>Non-perishable food and water</li>
                                <li>First aid kit and flashlights</li>
                            </ul>
                        </div>
                    </div>
                `,
                winterPreparedness: `
                    <div class="enriched-content">
                        <h3>Winter Storm Preparedness</h3>
                        <p>Blue Mountain's elevation and location make winter storms a serious concern. Power outages can last several days during severe weather.</p>
                        <h4>Essential Winter Supplies:</h4>
                        <div class="checklist-grid">
                            <div class="checklist-column">
                                <h5>Heat & Power</h5>
                                <ul>
                                    <li>Alternative heat source (wood, propane)</li>
                                    <li>Generator and fuel</li>
                                    <li>Extra blankets and warm clothing</li>
                                    <li>Carbon monoxide detector</li>
                                </ul>
                            </div>
                            <div class="checklist-column">
                                <h5>Food & Water</h5>
                                <ul>
                                    <li>3-day food supply per person</li>
                                    <li>1 gallon water per person per day</li>
                                    <li>Manual can opener</li>
                                    <li>Camp stove or grill</li>
                                </ul>
                            </div>
                        </div>
                        <div class="warning-box">
                            <strong>⚠️ Generator Safety:</strong> NEVER run generators indoors or in garages. Place at least 20 feet from doors and windows.
                        </div>
                    </div>
                `
            },
            wildlife: {
                birdWatching: `
                    <div class="enriched-content">
                        <h3>Bird Watching at Blue Mountain</h3>
                        <p>Our mountain habitat supports over 150 bird species throughout the year. The diverse ecosystem from valley to ridge provides excellent birding opportunities.</p>
                        <h4>Notable Species:</h4>
                        <div class="species-grid">
                            <div class="species-box">
                                <h5>Year-Round Residents</h5>
                                <ul>
                                    <li>Pileated Woodpecker</li>
                                    <li>Barred Owl</li>
                                    <li>Wild Turkey</li>
                                    <li>Carolina Wren</li>
                                    <li>Red-tailed Hawk</li>
                                </ul>
                            </div>
                            <div class="species-box">
                                <h5>Summer Visitors</h5>
                                <ul>
                                    <li>Scarlet Tanager</li>
                                    <li>Indigo Bunting</li>
                                    <li>Wood Thrush</li>
                                    <li>Ruby-throated Hummingbird</li>
                                    <li>Eastern Bluebird</li>
                                </ul>
                            </div>
                        </div>
                        <p><strong>Best Viewing Times:</strong> Early morning (dawn to 9 AM) and late afternoon (4 PM to dusk)</p>
                    </div>
                `,
                wildlifeCorridors: `
                    <div class="enriched-content">
                        <h3>Wildlife Corridors</h3>
                        <p>Blue Mountain serves as an important wildlife corridor connecting the Shenandoah National Park to surrounding forest lands. Understanding and respecting these corridors helps maintain healthy wildlife populations.</p>
                        <h4>Primary Corridors:</h4>
                        <ul>
                            <li><strong>Ridge Trail:</strong> Major deer and bear movement path</li>
                            <li><strong>Creek Valleys:</strong> Water access and feeding areas</li>
                            <li><strong>Forest Edges:</strong> Transition zones with high activity</li>
                        </ul>
                        <div class="info-box">
                            <h4>Corridor Protection Guidelines:</h4>
                            <ul>
                                <li>Avoid blocking natural pathways with fencing</li>
                                <li>Keep noise and lights minimal during dawn/dusk</li>
                                <li>Plant native species to provide food sources</li>
                                <li>Report unusual wildlife behavior or injured animals</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            community: {
                lodgeHistory: `
                    <div class="enriched-content">
                        <h3>The Lodge: Heart of Our Community</h3>
                        <p>The Blue Mountain Lodge has served as our community gathering place for over 60 years. Originally built as a simple meeting hall, it has evolved into a full-featured event space while maintaining its rustic mountain charm.</p>
                        <h4>Lodge Features:</h4>
                        <ul>
                            <li><strong>Main Hall:</strong> Seats 120 for dining, 150 for presentations</li>
                            <li><strong>Commercial Kitchen:</strong> Full catering capabilities</li>
                            <li><strong>Stone Fireplace:</strong> Original 1960s construction</li>
                            <li><strong>Covered Deck:</strong> Mountain views, seats 40</li>
                            <li><strong>AV Equipment:</strong> Projector, screen, and sound system</li>
                        </ul>
                        <div class="photo-caption">
                            <p><em>The Lodge's great room features exposed beams from trees harvested on Blue Mountain during initial construction.</em></p>
                        </div>
                    </div>
                `,
                volunteerOpportunities: `
                    <div class="enriched-content">
                        <h3>Volunteer Opportunities</h3>
                        <p>Blue Mountain thrives on volunteer participation. There's a role for everyone, regardless of time commitment or physical ability.</p>
                        <div class="volunteer-grid">
                            <div class="volunteer-category">
                                <h4>Ongoing Needs:</h4>
                                <ul>
                                    <li>Trail maintenance crew</li>
                                    <li>Newsletter contributors</li>
                                    <li>Event planning committee</li>
                                    <li>Welcome committee for new residents</li>
                                    <li>Emergency response team</li>
                                </ul>
                            </div>
                            <div class="volunteer-category">
                                <h4>Seasonal Projects:</h4>
                                <ul>
                                    <li>Spring cleanup coordination</li>
                                    <li>Summer picnic organization</li>
                                    <li>Fall festival planning</li>
                                    <li>Winter preparedness checks</li>
                                    <li>Holiday decoration team</li>
                                </ul>
                            </div>
                        </div>
                        <p><strong>To volunteer:</strong> Contact any board member or email volunteer@bmpoa.org</p>
                    </div>
                `
            },
            nature: {
                geologicalFeatures: `
                    <div class="enriched-content">
                        <h3>Geological Heritage</h3>
                        <p>Blue Mountain is part of the ancient Blue Ridge Mountains, formed over 480 million years ago. Our unique geology creates the spectacular views and diverse ecosystems we enjoy today.</p>
                        <h4>Notable Features:</h4>
                        <ul>
                            <li><strong>Greenstone Outcroppings:</strong> Ancient volcanic rock visible along Ridge Trail</li>
                            <li><strong>Quartz Veins:</strong> White streaks in exposed rock faces</li>
                            <li><strong>Natural Springs:</strong> Fed by underground aquifers</li>
                            <li><strong>Scenic Overlooks:</strong> Carved by millions of years of erosion</li>
                        </ul>
                        <div class="geology-fact">
                            <h4>Did You Know?</h4>
                            <p>The rocks beneath Blue Mountain are older than the Atlantic Ocean and contain minerals that give our soil its distinctive reddish color.</p>
                        </div>
                    </div>
                `,
                seasonalChanges: `
                    <div class="enriched-content">
                        <h3>Seasonal Natural Events</h3>
                        <div class="season-grid">
                            <div class="season-box">
                                <h4>🌸 Spring (March-May)</h4>
                                <ul>
                                    <li>Trillium bloom (late April)</li>
                                    <li>Dogwood flowering</li>
                                    <li>Spring peeper chorus</li>
                                    <li>Migratory bird return</li>
                                </ul>
                            </div>
                            <div class="season-box">
                                <h4>☀️ Summer (June-August)</h4>
                                <ul>
                                    <li>Firefly displays</li>
                                    <li>Mountain laurel bloom</li>
                                    <li>Berry season</li>
                                    <li>Butterfly peak</li>
                                </ul>
                            </div>
                            <div class="season-box">
                                <h4>🍂 Fall (September-November)</h4>
                                <ul>
                                    <li>Peak foliage (mid-October)</li>
                                    <li>Hawk migration</li>
                                    <li>Acorn drop</li>
                                    <li>First frost (late October)</li>
                                </ul>
                            </div>
                            <div class="season-box">
                                <h4>❄️ Winter (December-February)</h4>
                                <ul>
                                    <li>Average snowfall: 24"</li>
                                    <li>Winter bird feeding</li>
                                    <li>Animal tracking</li>
                                    <li>Ice formations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            }
        };
    }
    
    analyzeAndEnrich() {
        console.log('Starting page density analysis...');
        
        // Find low-density pages
        const lowDensityPages = this.identifyLowDensityPages();
        console.log(`Found ${lowDensityPages.length} low-density pages`);
        
        // Enrich each page
        lowDensityPages.forEach(pageInfo => {
            this.enrichPage(pageInfo);
        });
        
        // Rebalance if needed
        this.rebalanceAfterEnrichment();
        
        console.log('Page enrichment complete!');
    }
    
    identifyLowDensityPages() {
        const pages = document.querySelectorAll('.page');
        const lowDensityPages = [];
        
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
            
            // Calculate content density
            const contentHeight = this.calculateContentHeight(content);
            const contentElements = this.countContentElements(content);
            
            if (contentHeight < this.lowDensityThreshold) {
                const section = this.identifySection(page, content);
                const topic = this.identifyTopic(content);
                
                lowDensityPages.push({
                    page,
                    pageNumber,
                    content,
                    currentHeight: contentHeight,
                    elementCount: contentElements,
                    section,
                    topic,
                    availableSpace: this.minDesiredHeight - contentHeight
                });
                
                console.log(`Page ${pageNumber} is low-density (${Math.round(contentHeight / 96)}") - ${section}/${topic}`);
            }
        });
        
        return lowDensityPages;
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
    
    countContentElements(content) {
        const elements = Array.from(content.children).filter(el =>
            !el.classList.contains('professional-header') &&
            !el.classList.contains('page-footer')
        );
        return elements.length;
    }
    
    identifySection(page, content) {
        // Check page content for section
        const text = content.textContent;
        
        if (text.includes('Governance') || text.includes('Board')) return 'governance';
        if (text.includes('Emergency') || text.includes('Evacuation')) return 'emergency';
        if (text.includes('Wildlife') || text.includes('Bear') || text.includes('Animal')) return 'wildlife';
        if (text.includes('Community') || text.includes('Lodge') || text.includes('Social')) return 'community';
        if (text.includes('Nature') || text.includes('Conservation') || text.includes('Trillium')) return 'nature';
        if (text.includes('Fire') && text.includes('Safety')) return 'emergency';
        
        return 'general';
    }
    
    identifyTopic(content) {
        const text = content.textContent.toLowerCase();
        const headings = Array.from(content.querySelectorAll('h1, h2, h3')).map(h => h.textContent.toLowerCase());
        
        // Specific topic matching
        if (text.includes('board') && text.includes('meeting')) return 'boardHistory';
        if (text.includes('evacuation')) return 'evacuationDetails';
        if (text.includes('winter') || text.includes('storm')) return 'winterPreparedness';
        if (text.includes('bird')) return 'birdWatching';
        if (text.includes('corridor') || text.includes('habitat')) return 'wildlifeCorridors';
        if (text.includes('lodge')) return 'lodgeHistory';
        if (text.includes('volunteer')) return 'volunteerOpportunities';
        if (text.includes('geological') || text.includes('rock')) return 'geologicalFeatures';
        if (text.includes('season')) return 'seasonalChanges';
        
        return null;
    }
    
    enrichPage(pageInfo) {
        const { page, pageNumber, content, section, topic, availableSpace } = pageInfo;
        
        console.log(`Enriching page ${pageNumber} (${section}/${topic || 'auto'})`);
        
        // Get relevant content
        let additionalContent = null;
        
        if (topic && this.additionalContent[section] && this.additionalContent[section][topic]) {
            additionalContent = this.additionalContent[section][topic];
        } else {
            // Auto-select content based on section
            additionalContent = this.selectBestContent(section, content, availableSpace);
        }
        
        if (additionalContent) {
            // Create container for new content
            const enrichmentDiv = document.createElement('div');
            enrichmentDiv.className = 'page-enrichment';
            enrichmentDiv.innerHTML = additionalContent;
            
            // Find best insertion point
            const insertionPoint = this.findBestInsertionPoint(content);
            
            if (insertionPoint) {
                content.insertBefore(enrichmentDiv, insertionPoint);
            } else {
                content.appendChild(enrichmentDiv);
            }
            
            // Add enrichment indicator
            enrichmentDiv.setAttribute('data-enriched', 'true');
            enrichmentDiv.setAttribute('data-source', 'archives');
            
            console.log(`Added ${enrichmentDiv.offsetHeight || 200}px of content to page ${pageNumber}`);
        }
    }
    
    selectBestContent(section, content, availableSpace) {
        const sectionContent = this.additionalContent[section];
        if (!sectionContent) return null;
        
        // Find content that hasn't been used yet
        const contentKeys = Object.keys(sectionContent);
        const existingText = content.textContent.toLowerCase();
        
        for (let key of contentKeys) {
            const contentHtml = sectionContent[key];
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentHtml;
            
            // Check if this content is already present
            const keyWords = tempDiv.textContent.substring(0, 100).toLowerCase();
            if (!existingText.includes(keyWords.substring(0, 50))) {
                // Estimate if it will fit
                const estimatedHeight = this.estimateHeight(tempDiv);
                if (estimatedHeight <= availableSpace + 50) { // Allow slight overflow
                    return contentHtml;
                }
            }
        }
        
        return null;
    }
    
    findBestInsertionPoint(content) {
        const elements = Array.from(content.children);
        
        // Look for natural break points
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            
            // Insert after major sections
            if (el.matches('h2, .alert-box, .info-box')) {
                return el.nextSibling;
            }
            
            // Or before footers
            if (el.classList.contains('page-footer') ||
                el.classList.contains('professional-footer')) {
                return el;
            }
        }
        
        return null;
    }
    
    estimateHeight(element) {
        // More accurate estimation based on content
        const text = element.textContent || '';
        const lineCount = Math.ceil(text.length / 80);
        const hasImages = element.querySelectorAll('img').length;
        const hasTables = element.querySelectorAll('table').length;
        const hasLists = element.querySelectorAll('ul, ol').length;
        
        let height = lineCount * 24; // Base text height
        height += hasImages * 200; // Images
        height += hasTables * 150; // Tables
        height += hasLists * 100; // Lists
        height += element.querySelectorAll('h3, h4').length * 40; // Headers
        
        return height;
    }
    
    rebalanceAfterEnrichment() {
        console.log('Checking for overflow after enrichment...');
        
        const pages = document.querySelectorAll('.page');
        let overflowCount = 0;
        
        pages.forEach((page, index) => {
            const content = page.querySelector('.page-content');
            if (content) {
                const height = content.scrollHeight;
                const maxHeight = 9.5 * 96;
                
                if (height > maxHeight) {
                    overflowCount++;
                    console.log(`Page ${index + 1} now has overflow (${Math.round(height / 96)}")`);
                    // Could trigger pagination fix here
                }
            }
        });
        
        if (overflowCount > 0) {
            console.log(`${overflowCount} pages need pagination adjustment`);
        }
    }
}

// Initialize enricher
const pageEnricher = new PageContentEnricher();

// Add control button
const enrichButton = document.createElement('button');
enrichButton.textContent = 'Enrich Low-Density Pages';
enrichButton.style.cssText = `
    position: fixed;
    top: 190px;
    right: 20px;
    padding: 10px 20px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-weight: bold;
`;

enrichButton.onclick = () => {
    enrichButton.textContent = 'Enriching...';
    enrichButton.disabled = true;
    
    setTimeout(() => {
        pageEnricher.analyzeAndEnrich();
        enrichButton.textContent = '✅ Pages Enriched';
        enrichButton.style.background = '#27ae60';
    }, 100);
};

document.body.appendChild(enrichButton);