#!/usr/bin/env python3
"""
Populate BMPOA SQLite database with comprehensive content from the full entity report
"""

import sqlite3
import json
from datetime import datetime
import os

def populate_database():
    """Populate the BMPOA database with all extracted entities and content"""
    
    # Connect to existing database
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    cursor = conn.cursor()
    
    # Clear existing data for fresh population
    tables_to_clear = ['contacts', 'resources', 'regulations', 'content_blocks']
    for table in tables_to_clear:
        cursor.execute(f'DELETE FROM {table}')
    
    # Comprehensive contacts data from the report
    contacts_data = [
        # Emergency contacts
        ('emergency', 'Warren County 9-1-1', 'Emergency Dispatch', '911', None, None, 
         'For all life/health/property emergencies', True, 1),
        ('emergency', 'Warren County Fire & Rescue Station #1', 'Front Royal Station', 
         '(540) 635-1435', None, None, None, True, 2),
        ('emergency', 'Warren County Fire & Rescue Station #5', 'Linden Station', 
         '(540) 635-0053', None, None, None, True, 3),
        ('emergency', 'Rappahannock Electric Cooperative', 'Power Outages', 
         '(800) 552-3904', None, 'myrec.coop/outagecenter', None, True, 4),
        ('emergency', 'Virginia DWR Wildlife Conflict Hotline', None, 
         '(804) 367-1000', None, None, 'For bear and wildlife issues', True, 5),
        ('emergency', 'Warren County Animal Control', 'Pet/Livestock Threats', 
         '(540) 636-7834', None, None, None, True, 6),
        
        # Board members 2023-2025
        ('board', 'Jim Critcher', 'President; ARC Chair', None, None, None, 
         'Elected head of BMPOA, oversees architectural approvals', False, 1),
        ('board', 'Harry Davis', '1st VP; Newsletter Editor', None, None, None, 
         'Second-in-command, edits BMPOA newsletter', False, 2),
        ('board', 'Jonathan Morrison', '2nd VP; Recreation Committee Chair', None, None, None, 
         'Oversees recreational activities and facilities', False, 3),
        ('board', 'Mike Veasey', 'Financial Secretary', None, None, None, 
         'Manages BMPOA finances and records', False, 4),
        ('board', 'Patrick Patton', 'Secretary', None, None, None, 
         'Takes board minutes, assists with newsletter', False, 5),
        ('board', 'David Cook', 'Director', None, None, None, 
         'Roads Committee Member, Lodge Access Chair', False, 6),
        ('board', 'Carl Herz', 'Director; Roads Committee Chair', None, None, None, 
         'Oversees road maintenance and infrastructure', False, 7),
        ('board', 'Garrett McNamara', 'Director; Deer Lake Rec Chair', None, None, None, 
         'Manages Deer Lake recreational programming', False, 8),
        ('board', 'Erica Santana', 'Director; CRMSC Chair', None, None, None, 
         'Leads covenant review and modernization', False, 9),
        
        # Committee chairs and key contacts
        ('community', 'Billy Orndorff', 'CEC Chair; Nominating Chair', None, None, None, 
         'Enforces covenants, manages board nominations', False, 10),
        ('community', 'Mackenzie Williams', 'Social Committee Chair', None, 
         'mll2294@me.com', None, 'Plans quarterly events and activities', False, 11),
        ('community', 'Morgan Fox Elder', 'LPRC Chair', None, None, None, 
         'Legislative & Public Relations liaison', False, 12),
        ('community', 'Beth Herz', 'Membership Committee Chair', None, None, None, 
         'Recruits and engages BMPOA members', False, 13),
        ('community', 'Toni Magro', 'Deer Lake Operations Chair', None, None, None, 
         'Manages day-to-day Deer Lake operations', False, 14),
        
        # Service contacts
        ('service', 'BMPOA General', None, None, None, 'P.O. Box 114, Linden, VA 22642', 
         'General mailing address', False, 20),
        ('service', 'Architectural Review Committee', None, None, None, 
         'P.O. Box 114, Linden, VA 22642', 'Submit via BMPOA.org Contact Us', False, 21),
        ('service', 'Lodge Booking', None, None, 
         'bluemountainlodgebooking@gmail.com', '540 Cliff Rd, Linden, VA 22642', 
         'Reserve lodge for events', False, 22),
        ('service', 'Deer Lake Passes', None, None, 
         'bmpoadeerlake@gmail.com', None, 'Request annual recreation passes', False, 23),
        ('service', 'Wood Chipping Coordinator', 'J Cook', None, 
         'jcook0313@gmail.com', None, 'Schedule free chip delivery', False, 24),
        ('service', 'Roads Committee', None, None, 
         'bmpoaroads@gmail.com', None, 'Report road issues', False, 25),
        ('service', 'Freedom Disposal Services', None, '540-631-3467', 
         None, None, 'Northern Shenandoah Valley trash service', False, 26),
        ('service', 'Skyline Trash Service', None, '540-974-9418', 
         None, None, 'Private curbside collection', False, 27),
        ('service', 'Xfinity (Comcast)', None, '1-855-399-1542', 
         None, None, 'Broadband internet provider', False, 28),
    ]
    
    cursor.executemany('''
        INSERT INTO contacts (category, name, title, phone, email, address, notes, is_emergency, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', contacts_data)
    
    # Resources data
    resources_data = [
        # Wineries
        ('winery', 'Fox Meadow Winery', 'Indoor/outdoor seating, seasonal live music, sunset vineyard views', 
         '3310 Freezeland Rd, Linden, VA 22642', None, None, 
         'Fri-Sun, 12 PM - 6 PM', 'Specialties: Chardonnay, Cabernet Franc, Blueberry wine', 1),
        ('winery', 'Capstone Vineyards', 'Tasting pavilion, panoramic views, farm-to-table events', 
         '13400 Crimson Ln, Linden, VA 22642', None, None, 
         'Sat-Sun, 11 AM - 5 PM', 'Reservations recommended on weekends', 2),
        ('winery', 'Crimson Lane Vineyards', 'Elevated picnic terrace, firepits, wood-fired pizza weekends', 
         '13334 Crimson Ln, Linden, VA 22642', None, None, 
         None, 'Small-batch wines, wine club quarterly shipments', 3),
         
        # Wildlife areas
        ('attraction', 'G. Richard Thompson Wildlife Management Area', 'Home to 18 million trilliums', 
         'Enter via Freezeland Road, Linden, VA', None, None, None, 
         'Peak bloom late April-early May, connects to Appalachian Trail', 10),
        ('attraction', 'Trillium Trail', 'Primary viewing path for spring wildflowers', 
         'TWMA, off Freezeland Road', None, None, None, 
         '~1 mile loop, moderate difficulty, connects to AT', 11),
         
        # Hiking trails
        ('hiking', 'Blue Mountain Trailhead', 'Main trailhead with interconnected loops', 
         'GPS: 38.9604° N, 78.4703° W', None, None, None, 
         'Free gravel lot (~20 spaces), portable restroom, trail maps', 20),
        ('hiking', 'Deer Run Loop', 'Easy family trail', 
         None, None, None, None, 
         '1.2 mi loop, <200 ft elevation, interpretive signs, creek crossings', 21),
        ('hiking', 'Blue Ridge Overlook Trail', 'Moderate scenic trail', 
         None, None, None, None, 
         '3.5 mi out-and-back, 800 ft gain, panoramic views at 2000 ft', 22),
        ('hiking', 'Appalachian Connector Trail', 'Strenuous summit trail', 
         None, None, None, None, 
         '5.2 mi one-way, 1200 ft gain, steep switchbacks, rocky', 23),
         
        # Services and facilities
        ('service', 'Warren County Citizen Convenience Sites', 'Five waste drop-off locations', 
         'Multiple locations', None, 
         'https://warrencountyva.gov/450/Citizen-Convenience-Sites', None, 
         'Bagged household waste and recycling accepted', 30),
        ('service', 'Bentonville Transfer Station', 'Bulk waste disposal', 
         '232 Shangri-La Road, Bentonville, VA 22610', None, 
         'https://warrencountyva.gov/460/Warren-County-Transfer-Station-Bentonvil', None, 
         'Large items, furniture, appliances (no scrap metal)', 31),
        ('service', 'Linden Convenience Site', 'Local waste drop-off', 
         '2664 Dismal Hollow Road, Linden', None, None, None, 
         'Nearest site for BMPOA residents', 32),
        ('service', 'The Lodge', 'Community gathering space', 
         '540 Cliff Rd, Linden, VA 22642', None, None, 
         'Monthly board meetings 2nd Monday 6PM', 
         'Full kitchen, restrooms, deck, event rentals available', 33),
        ('service', 'Deer Lake Recreation Area', 'Private lake for members', 
         'Blue Mountain', None, None, 
         'Memorial Day - Labor Day', 
         'Swimming, kayaking, fishing, picnic areas, security on weekends', 34),
        ('service', 'Starlink', 'Satellite internet', 
         None, None, 'Starlink.com', None, 
         'High-speed satellite internet for remote properties', 35),
         
        # Native plant nurseries
        ('nursery', 'Seven Bends Nursery', 'Native plant specialist', 
         'Berryville, VA', None, 'sevenbends.org', None, 
         'Ridge & Valley native plants', 40),
        ('nursery', 'Yellow House Natives', 'Native plant grower', 
         'Berryville, VA', None, 'via vaplantatlas.org', None, 
         'Works with Plant Virginia Natives initiative', 41),
    ]
    
    cursor.executemany('''
        INSERT INTO resources (category, name, description, address, phone, website, hours, notes, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', resources_data)
    
    # Comprehensive regulations data
    regulations_data = [
        # Fire safety
        ('fire_safety', '4 PM Burning Law', 
         'No open burning before 4 PM within 300 ft of woods/grass', 
         'Virginia Department of Forestry regulation. Open burning forbidden at all times within BMPOA boundaries. Warren County Code § 974.3575. Violations: Class 3 misdemeanor, fines up to $500 plus suppression costs. Contained fires exempt if in metal ring with ¼" screen, 20 ft cleared radius.',
         '2024-01-01', 1),
        ('fire_safety', 'Burn Barrel Requirements', 
         'Specifications for legal burn barrels', 
         'Metal barrels with vented lids 16" above vents, stable base, drip/ash pan to catch embers. Must keep lid in place when not burning. Clear 20 ft radius of combustibles.',
         '2024-01-01', 2),
        ('fire_safety', 'Debris Pile Guidelines', 
         'Wood chipping preparation requirements', 
         'Place brush within 5 ft of roadside. Branches ≤ 8" diameter and ≤ 12 ft length. Remove rocks, metal, trash—only clean wood/brush. Collect year-round to minimize accumulation.',
         '2024-01-01', 3),
        ('fire_safety', 'Charcoal Grilling', 
         'Grilling restrictions in BMPOA', 
         'Charcoal/grilling for cooking is NOT exempt within BMPOA. No open burning in common areas, including grills. Private gas grills on enclosed patios may be used at homeowner risk.',
         '2024-01-01', 4),
         
        # Construction
        ('construction', 'Pre-Construction Requirements', 
         'ARC approval mandatory before any construction', 
         'Before applying for Warren County permits, notify ARC Chair via BMPOA.org Contact Us. Include Name, Email, Property Address. Contractors must include sponsoring owner. ARC responds within 30 days with approval/disapproval/info request.',
         '2024-09-01', 10),
        ('construction', 'Building Setbacks', 
         'Minimum distances from property lines', 
         '≥ 75 ft from centerline of Route 638, ≥ 70 ft from centerline of any internal BMPOA road, ≥ 20 ft from each side line, ≥ 25 ft from rear line. ARC/Board may grant exceptions to side/rear setbacks.',
         '2024-09-01', 11),
        ('construction', 'Exterior Materials', 
         'Approved materials and colors', 
         'Wood or wood-look siding (cedar lap, HardiPlank, solid-surface synthetics). No vinyl siding. Solid log homes acceptable. Colors: Muted, nature-reflective (greens, browns, tans). No bright/vibrant colors. Fire-resistant materials strongly advised.',
         '2024-09-01', 12),
        ('construction', 'Minimum Dwelling Size', 
         '1,000 sq ft living space required', 
         'All dwellings must have minimum 1,000 sq ft living space. Manufactured homes must meet Class A design criteria. One detached single-family dwelling, one private garage, and one accessory building per lot allowed.',
         '2024-09-01', 13),
        ('construction', 'Tree Clearing', 
         'Restrictions on removing trees', 
         'Only remove trees needed for foundation, septic field, and driveway unless extra clearing approved by ARC. Construction must be sited unobtrusively using natural flora to screen from roads. Limited scenic view clearing may be allowed.',
         '2024-09-01', 14),
        ('construction', 'Accessory Buildings', 
         'Requirements for sheds and outbuildings', 
         'One per 1-acre lot allowed. Must comply with Warren County ordinances, match primary structure style/materials, be pre-approved by ARC. <200 sq ft exempt from County permit but still need ARC approval. Max 12 ft average height.',
         '2024-09-01', 15),
        ('construction', 'Fence Requirements', 
         'Only split-rail fences allowed', 
         'Only split-rail fences permitted. Submit design/materials plan to ARC for written approval. Exceptions granted case-by-case based on compatibility with community aesthetics.',
         '2024-09-01', 16),
        ('construction', 'Unpaved Road Development', 
         'Requirements for building on unpaved roads', 
         'Developer must construct road to BMPOA specs: 3" compacted #3 gravel base + 2" crusher run surface, 10 ft width between ditches, proper grading/crowning, culverts at low points. Once accepted by Roads Committee, BMPOA assumes maintenance.',
         '2024-09-01', 17),
         
        # Community rules
        ('community', 'Deer Lake Access', 
         'Members-only recreation area', 
         'Blue Mountain Recreational Area Pass required. Issued annually in May via bmpoadeerlake@gmail.com with proof of property ownership. Two passes per property. Under-18 guests must be accompanied. Unauthorized visitors may be removed.',
         '2024-01-01', 20),
        ('community', 'Deer Lake Rules', 
         'Behavior and safety requirements', 
         'No lifeguard - swim at risk. No dogs weekends/holidays Memorial Day-Labor Day. No underage drinking. No fishing from beach. No loud music. No unlicensed vehicles on roads or dam. Life preservers for emergencies only.',
         '2024-01-01', 21),
        ('community', 'Road Salt Prohibition', 
         'No salt on BMPOA gravel roads', 
         'Salt use prohibited on all BMPOA gravel roads as it damages roadbed and increases maintenance costs. Blue barrels of gravel chips placed on steep hills for traction. Tire chains recommended for ice/snow.',
         '2024-01-01', 22),
        ('community', 'Snow Plowing', 
         '4 inches triggers plowing', 
         'Snow plowing begins when 4" of snow accumulates at designated mountain location. Residents may clear downed trees or report via BMPOA.org Contact Us. Fire Trail Road not maintained by BMPOA.',
         '2024-01-01', 23),
         
        # Environmental
        ('environmental', 'Bear Safety', 
         'Preventing bear conflicts', 
         'Remove bird feeders April-November. Store garbage in locked structure. Clean grills after use. No food on porches. Feeding bears illegal under Virginia Code - fines and legal action possible. Use hazing: paintballs, air horns, noise.',
         '2024-01-01', 30),
        ('environmental', 'Wood Chipping Program', 
         'Annual fire mitigation service', 
         'Free to all BMPOA property owners in good standing. Place brush within 5 ft of roadside. Max 8" diameter, 12 ft length. Remove all non-wood debris. Occurs early spring for ~1 week. Surplus chips at Lodge and Deer Lake.',
         '2024-01-01', 31),
        ('environmental', 'Trillium Protection', 
         'Do not pick or transplant', 
         'Trilliums take 9+ years to mature from seed to flowering. Picking or transplanting prohibited. Stay on marked trails. Report illegal picking to DWR or local wardens. Peak bloom late April-early May.',
         '2024-01-01', 32),
    ]
    
    cursor.executemany('''
        INSERT INTO regulations (category, title, description, full_text, effective_date, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', regulations_data)
    
    # Add detailed content blocks for key pages
    content_blocks = [
        # Page 1 - Welcome Letter
        (1, 'heading', 1, 'Welcome to Blue Mountain', '{"level": 1}'),
        (1, 'paragraph', 2, 'Dear Neighbor,', None),
        (1, 'paragraph', 3, 'On behalf of the Blue Mountain Property Owners Association Board of Directors, we warmly welcome you to our mountain community. Whether you are a new resident, a longtime homeowner, or a visitor, we are delighted you are here.', None),
        (1, 'paragraph', 4, 'Blue Mountain has been a special place since the late 1950s, when it was established as a vacation retreat for Washington, D.C. area residents seeking clean mountain air and peaceful surroundings. Today, we are a vibrant mix of seasonal and year-round families who share a commitment to preserving the natural beauty and neighborly spirit that make our community unique.', None),
        (1, 'paragraph', 5, 'This guide provides comprehensive information about living in Blue Mountain, from governance and community services to recreational opportunities and safety guidelines. We encourage you to reference it often and to participate actively in our community life.', None),
        (1, 'paragraph', 6, 'We look forward to seeing you at community events, board meetings, and around the mountain. Together, we continue the tradition of stewardship and fellowship that has defined Blue Mountain for over six decades.', None),
        (1, 'paragraph', 7, 'Sincerely,\nThe BMPOA Board of Directors', None),
        
        # Page 4 - Governance
        (4, 'heading', 1, 'Governance and Structure', '{"level": 1}'),
        (4, 'heading', 2, 'BMPOA Overview', '{"level": 2}'),
        (4, 'paragraph', 3, 'Blue Mountain Property Owners Association (BMPOA) is run entirely by elected volunteer property-owner board members who dedicate their time and expertise to preserving our mountain community.', None),
        (4, 'list', 4, 'Mission: Preserve natural beauty, foster community engagement, and provide essential services', '{"style": "bullet"}'),
        (4, 'list', 5, 'Established in the late 1950s as a vacation community for Washington D.C. residents', '{"style": "bullet"}'),
        (4, 'list', 6, 'Now a mix of summer residents and year-round families', '{"style": "bullet"}'),
        (4, 'heading', 7, 'Board Meetings', '{"level": 2}'),
        (4, 'paragraph', 8, 'The BMPOA Board meets monthly to conduct association business:', None),
        (4, 'list', 9, 'When: Every second Monday at 6:00 PM EST', '{"style": "bullet"}'),
        (4, 'list', 10, 'Where: The Blue Mountain Lodge, 540 Cliff Road, Linden, VA 22642', '{"style": "bullet"}'),
        (4, 'list', 11, 'Annual Meeting: August 17, 2025', '{"style": "bullet"}'),
        (4, 'list', 12, 'All members welcome and encouraged to attend', '{"style": "bullet"}'),
        
        # Page 7 - Social Committee
        (7, 'heading', 1, 'Social Committee & Events', '{"level": 1}'),
        (7, 'sidebar', 2, 'Social Events – Stay Connected', '{"type": "highlight"}'),
        (7, 'paragraph', 3, 'BMPOA sponsors four community events per year, planned by the Social Committee (one event per season).', None),
        (7, 'paragraph', 4, 'Other activities include yoga sessions at The Lodge and community clean-up days throughout the year.', None),
        (7, 'paragraph', 5, 'Announcements are posted on BMPOA.org and the Facebook group.', None),
        (7, 'paragraph', 6, 'For questions or to help plan events, contact: Mackenzie Williams, Social Committee Chair at mll2294@me.com', None),
        (7, 'heading', 7, 'Quarterly Community Events', '{"level": 2}'),
        (7, 'list', 8, 'Spring Cleanup & Potluck (April)', '{"style": "bullet"}'),
        (7, 'list', 9, 'Summer Picnic at The Lodge (July 4)', '{"style": "bullet"}'),
        (7, 'list', 10, 'Fall Harvest Festival (September/October)', '{"style": "bullet"}'),
        (7, 'list', 11, 'Winter Holiday Gathering (December)', '{"style": "bullet"}'),
        
        # Page 9 - Fire Safety
        (9, 'heading', 1, 'Fire Safety & Emergency Preparedness', '{"level": 1}'),
        (9, 'heading', 2, '4 PM Burning Law', '{"level": 2}'),
        (9, 'sidebar', 3, 'IMPORTANT: Open burning is forbidden at ALL TIMES within BMPOA boundaries', '{"type": "warning"}'),
        (9, 'paragraph', 4, 'Even if Warren County lifts a burn ban, BMPOA maintains a complete prohibition on open burning to protect our mountain community.', None),
        (9, 'list', 5, 'Warren County Code § 974.3575: No burning within 300 ft of woods/dry grass before 4 PM', '{"style": "bullet"}'),
        (9, 'list', 6, 'BMPOA prohibits open burning entirely - more restrictive than county rules', '{"style": "bullet"}'),
        (9, 'list', 7, 'Violations: Class 3 misdemeanor; fines up to $500 plus suppression costs', '{"style": "bullet"}'),
        (9, 'heading', 8, 'Fire Containment Requirements', '{"level": 2}'),
        (9, 'list', 9, 'Fires must be in non-combustible container with ¼" mesh screen cover', '{"style": "bullet"}'),
        (9, 'list', 10, 'Clear 20 ft radius of all combustible materials', '{"style": "bullet"}'),
        (9, 'list', 11, 'Keep water source and shovel within 10 ft at all times', '{"style": "bullet"}'),
        (9, 'list', 12, 'Extinguish completely before leaving', '{"style": "bullet"}'),
        
        # Page 15 - Bear Safety
        (15, 'heading', 1, 'Bear Safety on the Mountain', '{"level": 1}'),
        (15, 'paragraph', 2, 'Black bears are intelligent and typically avoid humans. Most conflicts occur because bears seek food attractants, not out of aggression.', None),
        (15, 'heading', 3, 'Common Bear Attractants', '{"level": 2}'),
        (15, 'list', 4, 'Bird feeders (remove April-November)', '{"style": "bullet"}'),
        (15, 'list', 5, 'Unsecured garbage cans', '{"style": "bullet"}'),
        (15, 'list', 6, 'Pet food on porches', '{"style": "bullet"}'),
        (15, 'list', 7, 'Grills with residual grease', '{"style": "bullet"}'),
        (15, 'list', 8, 'Fruit trees (ripe or fallen fruit)', '{"style": "bullet"}'),
        (15, 'list', 9, 'Compost with meat/bones/fat', '{"style": "bullet"}'),
        (15, 'heading', 10, 'If You Encounter a Bear', '{"level": 2}'),
        (15, 'paragraph', 11, 'At Home:', None),
        (15, 'list', 12, 'Remain calm - do not run', '{"style": "bullet", "indent": 1}'),
        (15, 'list', 13, 'Back away slowly while making noise', '{"style": "bullet", "indent": 1}'),
        (15, 'list', 14, 'If indoors, open doors to allow bear to exit', '{"style": "bullet", "indent": 1}'),
        (15, 'paragraph', 15, 'While Hiking:', None),
        (15, 'list', 16, 'Make noise around corners and dense vegetation', '{"style": "bullet", "indent": 1}'),
        (15, 'list', 17, 'Keep children close and dogs leashed', '{"style": "bullet", "indent": 1}'),
        (15, 'list', 18, 'If charged, use bear spray or fight back targeting nose/eyes', '{"style": "bullet", "indent": 1}'),
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', content_blocks)
    
    # Update committee member associations
    committee_members = [
        # ARC members
        ('Jim Critcher', 'Architectural Review Committee', 'Chair'),
        ('Patrick Patton', 'Architectural Review Committee', 'Member'),
        ('Jonathan Morrison', 'Architectural Review Committee', 'Member'),
        
        # CRMSC members
        ('Erica Santana', 'Covenant Review/Modernization Subcommittee', 'Chair'),
        ('Elizabeth Owens', 'Covenant Review/Modernization Subcommittee', 'Member'),
        ('Jen Kessler', 'Covenant Review/Modernization Subcommittee', 'Member'),
        ('Jack Davis', 'Covenant Review/Modernization Subcommittee', 'Member'),
        ('Bill Jahn', 'Covenant Review/Modernization Subcommittee', 'Member'),
        ('Patrick Patton', 'Covenant Review/Modernization Subcommittee', 'Member'),
        
        # Lodge committees
        ('David Cook', 'Lodge Access Committee', 'Chair'),
        ('Mike Veasey', 'Lodge Access Committee', 'Member'),
        ('Cathy Jo Cook', 'Lodge Access Committee', 'Member'),
        ('Morgan Fox Elder', 'Lodge Update Committee', 'Member'),
        ('Carl Herz', 'Lodge Update Committee', 'Member'),
        ('David Cook', 'Lodge Update Committee', 'Member'),
        ('Jonathan Morrison', 'Lodge Update Committee', 'Member'),
        
        # Other committees
        ('Carl Herz', 'Roads Committee', 'Chair'),
        ('David Cook', 'Roads Committee', 'Member'),
        ('Billy Orndorff', 'Nominating Committee', 'Chair'),
        ('Kelly Ludke', 'Nominating Committee', 'Member'),
        ('Donna Gray', 'Nominating Committee', 'Member'),
    ]
    
    # Add cross-references
    cross_refs = [
        (11, 4, 'See Page 4 for complete information about the Architectural Review Committee process'),
        (9, 10, 'See Page 10 for detailed FireWise safety recommendations'),
        (15, 20, 'For hiking safety and bear encounters, see Page 20'),
        (4, 5, 'See Page 5 for current Board Officers and Committee Chairs'),
        (12, 13, 'See Page 13 for Deer Lake access and recreation information'),
        (17, 16, 'See Page 16 for information about native trilliums'),
    ]
    
    cursor.executemany('''
        INSERT INTO cross_references (from_page_id, to_page_id, reference_text)
        VALUES (?, ?, ?)
    ''', cross_refs)
    
    conn.commit()
    conn.close()
    
    print("Database populated with comprehensive entity data!")
    print(f"Added {len(contacts_data)} contacts")
    print(f"Added {len(resources_data)} resources")
    print(f"Added {len(regulations_data)} regulations")
    print(f"Added {len(content_blocks)} content blocks")
    print(f"Added {len(cross_refs)} cross-references")

if __name__ == '__main__':
    populate_database()