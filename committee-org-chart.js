/**
 * Committee Organization Chart Component for BMPOA
 * Using verified committee structure from source materials
 */

class CommitteeOrgChart {
    constructor() {
        // Verified from BMPOA-entities.txt and database
        this.boardStructure = {
            board: "Board of Directors",
            executive: [
                { role: "President", name: "Jim Critcher", additional: "ARC Chair" },
                { role: "1st Vice President", name: "Harry Davis", additional: "Newsletter Editor" },
                { role: "2nd Vice President", name: "Jonathan Morrison", additional: "Recreation Chair" },
                { role: "Financial Secretary", name: "Mike Veasey" },
                { role: "Secretary", name: "Patrick Patton" }
            ],
            directors: [
                { name: "David Cook", roles: ["Roads Committee", "Lodge Access Chair"] },
                { name: "Carl Herz", roles: ["Roads Committee Chair"] },
                { name: "Garrett McNamara", roles: ["Deer Lake Recreation Chair"] },
                { name: "Erica Santana", roles: ["CRMSC Chair"] }
            ]
        };
        
        this.committees = {
            active: [
                {
                    name: "Roads Committee",
                    abbr: "RC",
                    chair: "Carl Herz",
                    members: ["David Cook"]
                },
                {
                    name: "Recreation Committee",
                    abbr: "RecC",
                    chair: "Jonathan Morrison",
                    subcommittees: [
                        "Deer Lake Recreation Area: Garrett McNamara",
                        "Deer Lake Operations: Toni Magro"
                    ]
                },
                {
                    name: "Lodge Access Committee",
                    abbr: "LAC",
                    chair: "Dave Cook",
                    members: ["Mike Veasey", "Cathy Jo Cook"]
                },
                {
                    name: "Membership Committee",
                    abbr: "MC",
                    chair: "Beth Herz"
                },
                {
                    name: "Legislative & Public Relations",
                    abbr: "LPRC",
                    chair: "Morgan Fox Elder"
                },
                {
                    name: "Lodge Update Committee",
                    abbr: "LUC",
                    members: ["Morgan Fox Elder", "Carl Herz", "David Cook", "Jonathan Morrison"]
                },
                {
                    name: "Architectural Review",
                    abbr: "ARC",
                    chair: "Jim Critcher",
                    members: ["Patrick Patton", "Jonathan Morrison"]
                },
                {
                    name: "Covenants Enforcement",
                    abbr: "CEC",
                    chair: "Billy Orndorff",
                    subcommittees: [
                        "CRMSC: Erica Santana (Chair), Elizabeth Owens, Jen Kessler, Jack Davis, Bill Jahn, Patrick Patton"
                    ]
                },
                {
                    name: "Nominating Committee",
                    abbr: "NC",
                    chair: "Billy Orndorff",
                    members: ["Kelly Ludke", "Donna Gray"]
                },
                {
                    name: "Newsletter Committee",
                    abbr: "News",
                    chair: "Harry Davis",
                    members: ["Patrick Patton (Assistant)"]
                },
                {
                    name: "Social Committee",
                    abbr: "SC",
                    chair: "Mackenzie Williams"
                }
            ],
            inactive: [
                {
                    name: "Public Safety Committee",
                    abbr: "PSC",
                    chair: null
                },
                {
                    name: "Arbitration Committee",
                    abbr: "AC",
                    chair: null
                },
                {
                    name: "Bylaw Review/Modernization",
                    abbr: "BRMSC",
                    chair: null
                }
            ]
        };
    }
    
    createOrgChart() {
        console.log('Creating committee organization chart...');
        
        // Load org chart CSS
        const chartCSS = document.createElement('link');
        chartCSS.rel = 'stylesheet';
        chartCSS.href = 'committee-org-chart.css';
        document.head.appendChild(chartCSS);
        
        // Find governance or committee sections
        const governancePages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Governance') || 
            page.textContent.includes('Committee') ||
            page.textContent.includes('Board')
        );
        
        if (governancePages.length > 0) {
            const page = governancePages[0];
            const content = page.querySelector('.page-content');
            
            if (content) {
                // Look for committee section
                const committeeHeading = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                    h.textContent.includes('Committee') || h.textContent.includes('Organization')
                );
                
                if (committeeHeading) {
                    const chartContainer = this.createChartContainer();
                    
                    // Insert after heading
                    if (committeeHeading.nextSibling) {
                        committeeHeading.parentNode.insertBefore(chartContainer, committeeHeading.nextSibling);
                    }
                    
                    // Add statistics
                    const stats = this.createCommitteeStats();
                    chartContainer.appendChild(stats);
                }
            }
        }
    }
    
    createChartContainer() {
        const container = document.createElement('div');
        container.className = 'org-chart-container';
        
        container.innerHTML = `
            <h3 class="org-chart-title">BMPOA Organizational Structure</h3>
            <div class="org-chart">
                ${this.createBoardLevel()}
                ${this.createExecutiveOfficers()}
                ${this.createCommitteesGrid()}
                ${this.createDirectorsSection()}
                ${this.createLegend()}
            </div>
        `;
        
        return container;
    }
    
    createBoardLevel() {
        return `
            <div class="board-level">
                <h4 class="board-title">${this.boardStructure.board}</h4>
                <p class="board-subtitle">9 Elected Members • 2-Year Terms</p>
            </div>
        `;
    }
    
    createExecutiveOfficers() {
        const officers = this.boardStructure.executive.map(officer => `
            <div class="officer-card">
                <div class="officer-role">${officer.role}</div>
                <h5 class="officer-name">${officer.name}</h5>
                ${officer.additional ? `<div class="officer-additional">${officer.additional}</div>` : ''}
            </div>
        `).join('');
        
        return `<div class="executive-officers">${officers}</div>`;
    }
    
    createCommitteesGrid() {
        const activeCommittees = this.committees.active.map(committee => 
            this.createCommitteeCard(committee, true)
        ).join('');
        
        const inactiveCommittees = this.committees.inactive.map(committee => 
            this.createCommitteeCard(committee, false)
        ).join('');
        
        return `
            <div class="committees-grid">
                ${activeCommittees}
                ${inactiveCommittees}
            </div>
        `;
    }
    
    createCommitteeCard(committee, isActive) {
        const cardClass = isActive ? 'committee-card committee-active' : 'committee-card committee-inactive';
        
        let subcommitteesHTML = '';
        if (committee.subcommittees) {
            subcommitteesHTML = `
                <div class="sub-committees">
                    <div class="sub-committee-label">Sub-Committees</div>
                    ${committee.subcommittees.map(sub => 
                        `<div class="sub-committee-item">${sub}</div>`
                    ).join('')}
                </div>
            `;
        }
        
        let membersHTML = '';
        if (committee.members && committee.members.length > 0) {
            membersHTML = `
                <div class="committee-members">
                    <div class="sub-committee-label">Members</div>
                    ${committee.members.map(member => 
                        `<div class="sub-committee-item">${member}</div>`
                    ).join('')}
                </div>
            `;
        }
        
        return `
            <div class="${cardClass}">
                <div class="committee-header">
                    <h5 class="committee-name">${committee.name}</h5>
                    <span class="committee-abbreviation">${committee.abbr}</span>
                </div>
                ${committee.chair ? `
                    <div class="committee-chair">
                        <span class="chair-icon">👤</span>
                        <div class="chair-info">
                            <div class="chair-label">Chair</div>
                            <div class="chair-name">${committee.chair}</div>
                        </div>
                    </div>
                ` : `
                    <div class="committee-chair">
                        <span class="chair-icon">❓</span>
                        <div class="chair-info">
                            <div class="chair-label">Chair</div>
                            <div class="chair-name">Position Open</div>
                        </div>
                    </div>
                `}
                ${membersHTML}
                ${subcommitteesHTML}
            </div>
        `;
    }
    
    createDirectorsSection() {
        const directors = this.boardStructure.directors.map(director => `
            <div class="director-item">
                <div class="director-name">${director.name}</div>
                <div class="director-roles">${director.roles.join(' • ')}</div>
            </div>
        `).join('');
        
        return `
            <div class="directors-section">
                <h4 class="directors-title">Board Directors</h4>
                <div class="directors-grid">
                    ${directors}
                </div>
            </div>
        `;
    }
    
    createCommitteeStats() {
        const totalCommittees = this.committees.active.length + this.committees.inactive.length;
        const activeCount = this.committees.active.length;
        const totalVolunteers = this.countTotalVolunteers();
        
        const stats = document.createElement('div');
        stats.className = 'committee-stats';
        stats.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">${totalCommittees}</div>
                <div class="stat-label">Total Committees</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${activeCount}</div>
                <div class="stat-label">Active Committees</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${totalVolunteers}+</div>
                <div class="stat-label">Community Volunteers</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">9</div>
                <div class="stat-label">Board Members</div>
            </div>
        `;
        
        return stats;
    }
    
    createLegend() {
        return `
            <div class="org-chart-legend">
                <div class="legend-item">
                    <div class="legend-color board"></div>
                    <span>Board of Directors</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color executive"></div>
                    <span>Executive Officers</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color active"></div>
                    <span>Active Committee</span>
                </div>
            </div>
        `;
    }
    
    countTotalVolunteers() {
        let count = 9; // Board members
        
        this.committees.active.forEach(committee => {
            if (committee.chair) count++;
            if (committee.members) count += committee.members.length;
        });
        
        return count;
    }
}

// Initialize
const committeeOrgChart = new CommitteeOrgChart();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.createOrgChart = function() {
        committeeOrgChart.createOrgChart();
    };
}