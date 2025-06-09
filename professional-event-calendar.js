/**
 * Professional Event Calendar Component for BMPOA
 * Using verified events from source materials
 */

class ProfessionalEventCalendar {
    constructor() {
        // Verified events from source materials
        this.regularEvents = {
            monthly: {
                boardMeeting: {
                    name: "Board of Directors Meeting",
                    schedule: "Second Monday",
                    time: "6:00 PM EST",
                    location: "The Lodge",
                    icon: "📋"
                }
            },
            annual: {
                annualMeeting: {
                    name: "Annual Meeting",
                    date: "August 17, 2025",
                    location: "The Lodge",
                    description: "Annual community meeting and board elections",
                    icon: "🗳️"
                }
            },
            seasonal: [
                {
                    name: "Spring Cleanup & Potluck",
                    season: "Spring",
                    month: "April",
                    description: "Community cleanup day followed by potluck dinner",
                    icon: "🌱"
                },
                {
                    name: "Summer Picnic",
                    season: "Summer",
                    date: "July 4",
                    location: "The Lodge",
                    description: "Independence Day celebration and community picnic",
                    icon: "🎆"
                },
                {
                    name: "Fall Harvest Festival",
                    season: "Fall",
                    month: "September/October",
                    description: "Seasonal celebration with activities for all ages",
                    icon: "🍂"
                },
                {
                    name: "Winter Holiday Gathering",
                    season: "Winter",
                    month: "December",
                    description: "Holiday party and community celebration",
                    icon: "❄️"
                }
            ],
            woodChipping: {
                name: "Annual Wood Chipping Service",
                season: "Early Spring",
                description: "Free wood chipping for all property owners",
                contact: "jcook0313@gmail.com",
                icon: "🌲"
            }
        };
        
        // Generate monthly calendar
        this.months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    }
    
    createEventCalendar() {
        console.log('Creating professional event calendar...');
        
        // Load calendar CSS
        const calendarCSS = document.createElement('link');
        calendarCSS.rel = 'stylesheet';
        calendarCSS.href = 'professional-event-calendar.css';
        document.head.appendChild(calendarCSS);
        
        // Find events or community sections
        const eventPages = Array.from(document.querySelectorAll('.page')).filter(page =>
            page.textContent.includes('Events') || 
            page.textContent.includes('Calendar') ||
            page.textContent.includes('Social Committee') ||
            page.textContent.includes('Community Life')
        );
        
        if (eventPages.length > 0) {
            const page = eventPages[0];
            const content = page.querySelector('.page-content');
            
            if (content) {
                // Look for events heading
                const eventsHeading = Array.from(content.querySelectorAll('h2, h3')).find(h =>
                    h.textContent.includes('Event') || 
                    h.textContent.includes('Calendar') ||
                    h.textContent.includes('Social')
                );
                
                if (eventsHeading) {
                    // Create calendar container
                    const calendarContainer = this.createCalendarContainer();
                    
                    // Insert after heading
                    if (eventsHeading.nextSibling) {
                        eventsHeading.parentNode.insertBefore(calendarContainer, eventsHeading.nextSibling);
                    }
                    
                    // Add annual events section
                    const annualEvents = this.createAnnualEventsSection();
                    calendarContainer.appendChild(annualEvents);
                    
                    // Add regular schedule
                    const regularSchedule = this.createRegularSchedule();
                    calendarContainer.appendChild(regularSchedule);
                    
                    // Add contact card
                    const contactCard = this.createEventContactCard();
                    calendarContainer.appendChild(contactCard);
                }
            }
        }
    }
    
    createCalendarContainer() {
        const container = document.createElement('div');
        container.className = 'event-calendar-container';
        
        container.innerHTML = `
            <div class="calendar-header">
                <h3 class="calendar-title">BMPOA Community Calendar</h3>
                <p class="calendar-year">2025</p>
            </div>
            ${this.createCalendarGrid()}
            ${this.createEventLegend()}
        `;
        
        return container;
    }
    
    createCalendarGrid() {
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        // Show key months with events
        const keyMonths = [
            { month: "April", events: this.getAprilEvents() },
            { month: "July", events: this.getJulyEvents() },
            { month: "August", events: this.getAugustEvents() },
            { month: "September", events: this.getSeptemberEvents() },
            { month: "December", events: this.getDecemberEvents() },
            { month: "Monthly", events: this.getMonthlyEvents() }
        ];
        
        const monthCards = keyMonths.map(({ month, events }) => `
            <div class="month-card">
                <div class="month-header">
                    <h4 class="month-name">${month}</h4>
                </div>
                <div class="month-content">
                    ${events.map(event => `
                        <div class="event-item ${event.type}">
                            <div class="event-date">${event.date}</div>
                            <div class="event-name">${event.name}</div>
                            ${event.details ? `<div class="event-details">${event.details}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        return `<div class="calendar-grid">${monthCards}</div>`;
    }
    
    getAprilEvents() {
        return [
            {
                date: "Early April",
                name: "Wood Chipping Service",
                details: "Schedule with J Cook",
                type: "event-community"
            },
            {
                date: "Mid-April",
                name: "Spring Cleanup & Potluck",
                details: "Community cleanup day",
                type: "event-social"
            },
            {
                date: "2nd Monday",
                name: "Board Meeting",
                details: "6:00 PM at The Lodge",
                type: "event-board-meeting"
            }
        ];
    }
    
    getJulyEvents() {
        return [
            {
                date: "July 4",
                name: "Independence Day Picnic",
                details: "The Lodge - All day",
                type: "event-social"
            },
            {
                date: "2nd Monday",
                name: "Board Meeting",
                details: "6:00 PM at The Lodge",
                type: "event-board-meeting"
            }
        ];
    }
    
    getAugustEvents() {
        return [
            {
                date: "August 17",
                name: "Annual Meeting",
                details: "Board elections & community updates",
                type: "event-board-meeting"
            }
        ];
    }
    
    getSeptemberEvents() {
        return [
            {
                date: "Late September",
                name: "Fall Harvest Festival",
                details: "Family activities & potluck",
                type: "event-seasonal"
            },
            {
                date: "2nd Monday",
                name: "Board Meeting",
                details: "6:00 PM at The Lodge",
                type: "event-board-meeting"
            }
        ];
    }
    
    getDecemberEvents() {
        return [
            {
                date: "Mid-December",
                name: "Holiday Gathering",
                details: "Community celebration",
                type: "event-seasonal"
            },
            {
                date: "2nd Monday",
                name: "Board Meeting",
                details: "6:00 PM at The Lodge",
                type: "event-board-meeting"
            }
        ];
    }
    
    getMonthlyEvents() {
        return [
            {
                date: "2nd Monday",
                name: "Board Meeting",
                details: "6:00 PM EST at The Lodge",
                type: "event-board-meeting"
            },
            {
                date: "Various",
                name: "Yoga Sessions",
                details: "Check with Social Committee",
                type: "event-social"
            }
        ];
    }
    
    createAnnualEventsSection() {
        const section = document.createElement('div');
        section.className = 'annual-events';
        
        const events = this.regularEvents.seasonal.map(event => `
            <div class="annual-event-card">
                <div class="annual-event-icon">${event.icon}</div>
                <h4 class="annual-event-name">${event.name}</h4>
                <div class="annual-event-date">${event.date || event.month}</div>
                <p class="annual-event-description">${event.description}</p>
            </div>
        `).join('');
        
        section.innerHTML = `
            <h3 class="annual-events-title">Annual Community Events</h3>
            <div class="annual-events-grid">
                ${events}
                <div class="annual-event-card">
                    <div class="annual-event-icon">${this.regularEvents.woodChipping.icon}</div>
                    <h4 class="annual-event-name">${this.regularEvents.woodChipping.name}</h4>
                    <div class="annual-event-date">${this.regularEvents.woodChipping.season}</div>
                    <p class="annual-event-description">${this.regularEvents.woodChipping.description}</p>
                </div>
            </div>
        `;
        
        return section;
    }
    
    createRegularSchedule() {
        const schedule = document.createElement('div');
        schedule.className = 'regular-schedule';
        
        schedule.innerHTML = `
            <h3 class="schedule-title">Regular Activities</h3>
            <div class="schedule-items">
                <div class="schedule-item">
                    <span class="schedule-icon">📋</span>
                    <div class="schedule-info">
                        <div class="schedule-frequency">Monthly Board Meetings</div>
                        <div class="schedule-description">Second Monday at 6:00 PM EST</div>
                    </div>
                </div>
                <div class="schedule-item">
                    <span class="schedule-icon">🧘</span>
                    <div class="schedule-info">
                        <div class="schedule-frequency">Yoga Sessions</div>
                        <div class="schedule-description">Schedule varies - check with Social Committee</div>
                    </div>
                </div>
                <div class="schedule-item">
                    <span class="schedule-icon">🧹</span>
                    <div class="schedule-info">
                        <div class="schedule-frequency">Community Clean-up Days</div>
                        <div class="schedule-description">Seasonal - organized by Social Committee</div>
                    </div>
                </div>
                <div class="schedule-item">
                    <span class="schedule-icon">🏛️</span>
                    <div class="schedule-info">
                        <div class="schedule-frequency">Lodge Rentals</div>
                        <div class="schedule-description">Available year-round for private events</div>
                    </div>
                </div>
            </div>
        `;
        
        return schedule;
    }
    
    createEventLegend() {
        return `
            <div class="event-legend">
                <div class="legend-item">
                    <div class="legend-color legend-board"></div>
                    <span>Board Meetings</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-social"></div>
                    <span>Social Events</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-community"></div>
                    <span>Community Service</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-seasonal"></div>
                    <span>Seasonal Events</span>
                </div>
            </div>
        `;
    }
    
    createEventContactCard() {
        const card = document.createElement('div');
        card.className = 'event-contact-card';
        
        card.innerHTML = `
            <h4 class="event-contact-title">Event Information & Contacts</h4>
            <div class="event-contact-info">
                <div class="contact-item">
                    <span class="contact-icon">👥</span>
                    <span class="contact-text">Social Committee: Mackenzie Williams</span>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">✉️</span>
                    <span class="contact-text">mll2294@me.com</span>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">🏛️</span>
                    <span class="contact-text">Lodge Booking: Email via BMPOA.org</span>
                </div>
            </div>
        `;
        
        return card;
    }
}

// Initialize
const eventCalendar = new ProfessionalEventCalendar();

// Add to professional components
if (typeof professionalComponents !== 'undefined') {
    professionalComponents.createEventCalendar = function() {
        eventCalendar.createEventCalendar();
    };
}