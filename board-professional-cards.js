/**
 * Transform Board of Directors table into professional contact cards
 */

function createProfessionalBoardCards() {
    console.log('Creating professional board member cards...');
    
    // Find the board members table
    const boardTable = findBoardTable();
    if (!boardTable) {
        console.log('Board table not found');
        return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.className = 'board-cards-container';
    container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5em;
        margin: 2em 0;
    `;
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Current Board Members (2023-2025)';
    title.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        color: #1e3a5f;
        font-size: 1.6em;
        margin-bottom: 0.5em;
        border-bottom: 3px solid #e3f2fd;
        padding-bottom: 0.5em;
    `;
    container.appendChild(title);
    
    // Extract board members from table
    const rows = boardTable.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            const position = cells[0].textContent.trim();
            const name = cells[1].textContent.trim();
            const additionalRoles = cells[2].textContent.trim();
            
            const card = createBoardMemberCard(position, name, additionalRoles, index);
            container.appendChild(card);
        }
    });
    
    // Replace table with cards
    boardTable.parentNode.insertBefore(container, boardTable);
    boardTable.style.display = 'none';
    
    // Add CSS styles
    addBoardCardStyles();
}

function findBoardTable() {
    // Find the table with board members
    const tables = document.querySelectorAll('table');
    for (let table of tables) {
        const headers = table.querySelectorAll('th');
        const hasPositionHeader = Array.from(headers).some(h => 
            h.textContent.includes('Position') && h.textContent.includes('Name')
        );
        
        if (hasPositionHeader) {
            const firstCell = table.querySelector('tbody td');
            if (firstCell && firstCell.textContent.includes('President')) {
                return table;
            }
        }
    }
    return null;
}

function createBoardMemberCard(position, name, additionalRoles, index) {
    const card = document.createElement('div');
    card.className = 'board-member-card';
    
    // Determine card type
    let cardType = 'director';
    if (position.includes('President')) cardType = 'executive';
    if (position.includes('Secretary')) cardType = 'officer';
    
    // Create card structure
    card.innerHTML = `
        <div class="card-header ${cardType}">
            <div class="position-icon">${getPositionIcon(position)}</div>
            <div class="position-title">${position}</div>
        </div>
        <div class="card-body">
            <h4 class="member-name">${name}</h4>
            ${additionalRoles ? `<p class="additional-roles">${additionalRoles}</p>` : ''}
            <div class="contact-info">
                <p class="contact-method">Contact via BMPOA.org</p>
            </div>
        </div>
        <div class="card-footer">
            <span class="term">Term: 2023-2025</span>
        </div>
    `;
    
    // Add hover effect
    card.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    `;
    
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    return card;
}

function getPositionIcon(position) {
    if (position.includes('President') && !position.includes('Vice')) return '👔';
    if (position.includes('Vice President')) return '🤝';
    if (position.includes('Secretary')) return '📝';
    if (position.includes('Financial')) return '💰';
    return '👥';
}

function addBoardCardStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .board-member-card .card-header {
            padding: 1.5em;
            color: white;
            text-align: center;
        }
        
        .board-member-card .card-header.executive {
            background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
        }
        
        .board-member-card .card-header.officer {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        }
        
        .board-member-card .card-header.director {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        }
        
        .board-member-card .position-icon {
            font-size: 2.5em;
            margin-bottom: 0.3em;
        }
        
        .board-member-card .position-title {
            font-size: 1.1em;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .board-member-card .card-body {
            padding: 1.5em;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        
        .board-member-card .member-name {
            color: #1e3a5f;
            font-size: 1.3em;
            margin: 0 0 0.5em 0;
            font-weight: 700;
        }
        
        .board-member-card .additional-roles {
            color: #64748b;
            font-size: 0.95em;
            margin: 0 0 1em 0;
            flex-grow: 1;
        }
        
        .board-member-card .contact-method {
            text-align: center;
            color: #64748b;
            font-size: 0.9em;
            margin: 0;
        }
        
        .board-member-card .card-footer {
            padding: 1em 1.5em;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 0.85em;
            color: #64748b;
        }
        
        @media print {
            .board-cards-container {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1em !important;
            }
            
            .board-member-card {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    `;
    document.head.appendChild(style);
}

// Also transform committee table
function createProfessionalCommitteeCards() {
    console.log('Creating professional committee cards...');
    
    // Find committee table
    const committeeTable = findCommitteeTable();
    if (!committeeTable) {
        console.log('Committee table not found');
        return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.className = 'committee-cards-grid';
    container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1em;
        margin: 2em 0;
    `;
    
    // Extract committees from table
    const rows = committeeTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            const committee = cells[0].textContent.trim();
            const chair = cells[1].textContent.trim();
            const contact = cells[2].textContent.trim();
            
            const card = createCommitteeCard(committee, chair, contact);
            container.appendChild(card);
        }
    });
    
    // Replace table with cards
    committeeTable.parentNode.insertBefore(container, committeeTable);
    committeeTable.style.display = 'none';
}

function findCommitteeTable() {
    const tables = document.querySelectorAll('table.committee-table');
    if (tables.length > 0) return tables[0];
    
    // Fallback: find by content
    const allTables = document.querySelectorAll('table');
    for (let table of allTables) {
        const firstCell = table.querySelector('tbody td');
        if (firstCell && firstCell.textContent.includes('Social Committee')) {
            return table;
        }
    }
    return null;
}

function createCommitteeCard(committee, chair, contact) {
    const card = document.createElement('div');
    card.className = 'committee-card';
    
    const icon = getCommitteeIcon(committee);
    const color = getCommitteeColor(committee);
    
    card.innerHTML = `
        <div class="committee-icon" style="background: ${color}">
            ${icon}
        </div>
        <div class="committee-content">
            <h4 class="committee-name">${committee}</h4>
            <p class="committee-chair">Chair: ${chair}</p>
            ${contact.includes('@') ? 
                `<a href="mailto:${contact}" class="committee-contact">${contact}</a>` :
                `<p class="committee-contact">${contact}</p>`
            }
        </div>
    `;
    
    card.style.cssText = `
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1.5em;
        display: flex;
        align-items: flex-start;
        gap: 1em;
        transition: all 0.2s ease;
    `;
    
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = color;
        card.style.boxShadow = `0 4px 12px ${color}20`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = '#e5e7eb';
        card.style.boxShadow = 'none';
    });
    
    // Add committee-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .committee-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            color: white;
            flex-shrink: 0;
        }
        
        .committee-content {
            flex-grow: 1;
        }
        
        .committee-name {
            margin: 0 0 0.3em 0;
            color: #1e293b;
            font-size: 1.1em;
            font-weight: 600;
        }
        
        .committee-chair {
            margin: 0 0 0.3em 0;
            color: #64748b;
            font-size: 0.95em;
        }
        
        .committee-contact {
            margin: 0;
            color: #3b82f6;
            font-size: 0.9em;
            text-decoration: none;
        }
        
        .committee-contact:hover {
            text-decoration: underline;
        }
    `;
    
    if (!document.querySelector('style[data-committee-cards]')) {
        style.setAttribute('data-committee-cards', 'true');
        document.head.appendChild(style);
    }
    
    return card;
}

function getCommitteeIcon(committee) {
    if (committee.includes('Social')) return '🎉';
    if (committee.includes('Roads')) return '🛣️';
    if (committee.includes('Lake')) return '🏞️';
    if (committee.includes('Wood')) return '🌲';
    if (committee.includes('Membership')) return '👥';
    if (committee.includes('Legislative')) return '📜';
    return '📋';
}

function getCommitteeColor(committee) {
    if (committee.includes('Social')) return '#ec4899';
    if (committee.includes('Roads')) return '#8b5cf6';
    if (committee.includes('Lake')) return '#3b82f6';
    if (committee.includes('Wood')) return '#10b981';
    if (committee.includes('Membership')) return '#f59e0b';
    if (committee.includes('Legislative')) return '#6366f1';
    return '#64748b';
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        createProfessionalBoardCards();
        createProfessionalCommitteeCards();
    });
} else {
    createProfessionalBoardCards();
    createProfessionalCommitteeCards();
}

// Add button to toggle view
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Toggle Card/Table View';
toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    z-index: 1000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

let showCards = true;
toggleButton.onclick = () => {
    showCards = !showCards;
    document.querySelectorAll('.board-cards-container, .committee-cards-grid').forEach(el => {
        el.style.display = showCards ? 'grid' : 'none';
    });
    document.querySelectorAll('table').forEach(table => {
        if (table === findBoardTable() || table === findCommitteeTable()) {
            table.style.display = showCards ? 'none' : 'table';
        }
    });
};

document.body.appendChild(toggleButton);