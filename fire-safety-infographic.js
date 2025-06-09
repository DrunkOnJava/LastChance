/**
 * Fire Safety Infographic Components for BMPOA Document
 * Using only verified content from source materials
 */

class FireSafetyInfographic {
    constructor() {
        // Verified from source materials
        this.fireRegulations = {
            prohibition: "Open burning is FORBIDDEN AT ALL TIMES within BMPOA boundaries",
            moreRestrictive: "More restrictive than Warren County rules",
            code: "Warren County Code § 974.3575",
            penalty: {
                class: "Class 3 misdemeanor",
                fine: "Up to $500"
            },
            containmentRequired: {
                clearance: "15 feet",
                attendance: "Constantly attended",
                extinguishing: "Water or sand readily available"
            }
        };
    }
    
    createFireSafetyInfographic() {
        console.log('Creating fire safety infographic...');
        
        // Load infographic CSS
        const infographicCSS = document.createElement('link');
        infographicCSS.rel = 'stylesheet';
        infographicCSS.href = 'fire-safety-infographic.css';
        document.head.appendChild(infographicCSS);
        
        // Find fire safety sections
        const fireSafetyPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('fire') || 
            page.textContent.includes('burning') ||
            page.textContent.includes('FORBIDDEN')
        );
        
        fireSafetyPages.forEach(page => {
            const content = page.querySelector('.page-content');
            if (!content) return;
            
            // Look for fire safety content
            const fireSafetySection = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                h.textContent.includes('Fire') || h.textContent.includes('Burning')
            );
            
            if (fireSafetySection) {
                // Create main infographic
                const infographic = this.createMainInfographic();
                
                // Insert after the fire safety heading
                if (fireSafetySection.nextSibling) {
                    fireSafetySection.parentNode.insertBefore(infographic, fireSafetySection.nextSibling);
                }
                
                // Create fire zones visualization
                const zonesViz = this.createFireZonesVisualization();
                infographic.appendChild(zonesViz);
                
                // Create penalty box
                const penaltyBox = this.createPenaltyBox();
                infographic.appendChild(penaltyBox);
                
                // Create containment requirements
                const containmentViz = this.createContainmentVisualization();
                infographic.appendChild(containmentViz);
                
                // Create fire safety tips
                const tips = this.createFireSafetyTips();
                infographic.appendChild(tips);
            }
        });
    }
    
    createMainInfographic() {
        const infographic = document.createElement('div');
        infographic.className = 'fire-safety-infographic';
        
        infographic.innerHTML = `
            <div class="infographic-header">
                <h2 class="infographic-title">BMPOA Fire Safety Regulations</h2>
                <p class="infographic-subtitle">Critical Information for All Residents</p>
            </div>
            
            <div class="fire-ban-visual">
                <div class="ban-icon">🔥</div>
                <div class="ban-text">NO BURNING</div>
            </div>
        `;
        
        return infographic;
    }
    
    createFireZonesVisualization() {
        const zonesDiv = document.createElement('div');
        zonesDiv.className = 'fire-zones-section';
        
        zonesDiv.innerHTML = `
            <div class="fire-zones-grid">
                <div class="fire-zone zone-prohibited">
                    <div class="zone-icon">🚫</div>
                    <h4 class="zone-title">Open Burning</h4>
                    <p class="zone-description">FORBIDDEN at all times within BMPOA boundaries</p>
                </div>
                
                <div class="fire-zone zone-restricted">
                    <div class="zone-icon">⚠️</div>
                    <h4 class="zone-title">Contained Fires</h4>
                    <p class="zone-description">Must have 15ft clearance and constant attendance</p>
                </div>
                
                <div class="fire-zone zone-allowed">
                    <div class="zone-icon">✅</div>
                    <h4 class="zone-title">Permitted</h4>
                    <p class="zone-description">Indoor fireplaces and approved outdoor fire pits only</p>
                </div>
            </div>
        `;
        
        return zonesDiv;
    }
    
    createPenaltyBox() {
        const penaltyBox = document.createElement('div');
        penaltyBox.className = 'penalty-box';
        
        penaltyBox.innerHTML = `
            <h3 class="penalty-title">Violation Penalties</h3>
            <div class="penalty-details">
                <div class="penalty-item">
                    <div class="penalty-label">Classification</div>
                    <div class="penalty-value">${this.fireRegulations.penalty.class}</div>
                </div>
                <div class="penalty-item">
                    <div class="penalty-label">Maximum Fine</div>
                    <div class="penalty-value">${this.fireRegulations.penalty.fine}</div>
                </div>
                <div class="penalty-item">
                    <div class="penalty-label">Code Reference</div>
                    <div class="penalty-value">§ 974.3575</div>
                </div>
            </div>
        `;
        
        return penaltyBox;
    }
    
    createContainmentVisualization() {
        const containmentDiv = document.createElement('div');
        containmentDiv.className = 'containment-visual';
        
        containmentDiv.innerHTML = `
            <h3 class="containment-title">Fire Containment Requirements</h3>
            <div class="containment-diagram">
                <div class="fire-center">🔥</div>
                <div class="containment-ring ring-15ft">
                    <span class="ring-label">15 ft clearance</span>
                </div>
            </div>
            <div class="containment-requirements">
                <p><strong>All fires must be:</strong></p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Constantly attended</li>
                    <li>Have water or sand readily available</li>
                    <li>Be fully extinguished when done</li>
                    <li>In approved containers only</li>
                </ul>
            </div>
        `;
        
        return containmentDiv;
    }
    
    createFireSafetyTips() {
        const tipsDiv = document.createElement('div');
        tipsDiv.className = 'fire-tips-carousel';
        
        tipsDiv.innerHTML = `
            <div class="fire-tips-header">
                <h3 class="fire-tips-title">Fire Prevention Tips</h3>
            </div>
            <div class="fire-tips-grid">
                <div class="fire-tip">
                    <div class="tip-icon">🏠</div>
                    <p class="tip-text">Keep 30ft defensible space around structures</p>
                </div>
                <div class="fire-tip">
                    <div class="tip-icon">🌲</div>
                    <p class="tip-text">Remove dead vegetation and trim trees</p>
                </div>
                <div class="fire-tip">
                    <div class="tip-icon">💧</div>
                    <p class="tip-text">Keep hoses and water sources accessible</p>
                </div>
                <div class="fire-tip">
                    <div class="tip-icon">📱</div>
                    <p class="tip-text">Have emergency numbers readily available</p>
                </div>
            </div>
        `;
        
        return tipsDiv;
    }
    
    createFireRulesSection() {
        const rulesSection = document.createElement('div');
        rulesSection.className = 'fire-rules-section';
        
        rulesSection.innerHTML = `
            <div class="fire-rules-header">
                <span class="fire-rules-icon">📋</span>
                <h3 class="fire-rules-title">BMPOA Fire Safety Rules</h3>
            </div>
            <ul class="fire-rules-list">
                <li class="fire-rule-item">
                    <span class="rule-icon">🚫</span>
                    <span class="rule-text">No open burning of any kind</span>
                </li>
                <li class="fire-rule-item">
                    <span class="rule-icon">🚫</span>
                    <span class="rule-text">No burning of leaves or debris</span>
                </li>
                <li class="fire-rule-item">
                    <span class="rule-icon">✅</span>
                    <span class="rule-text">Indoor fireplaces allowed with proper maintenance</span>
                </li>
                <li class="fire-rule-item">
                    <span class="rule-icon">✅</span>
                    <span class="rule-text">Approved outdoor fire pits with screens</span>
                </li>
                <li class="fire-rule-item">
                    <span class="rule-icon">📞</span>
                    <span class="rule-text">Report violations to authorities</span>
                </li>
                <li class="fire-rule-item">
                    <span class="rule-icon">🚒</span>
                    <span class="rule-text">Fire department: (540) 635-1435</span>
                </li>
            </ul>
        `;
        
        return rulesSection;
    }
}

// Initialize
const fireSafetyInfographic = new FireSafetyInfographic();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.createFireSafetyInfographic = function() {
        fireSafetyInfographic.createFireSafetyInfographic();
    };
}