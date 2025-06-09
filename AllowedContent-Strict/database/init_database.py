#!/usr/bin/env python3
"""
Initialize BMPOA SQLite database with content from the comprehensive outline
"""

import sqlite3
import json
from datetime import datetime
import os

def create_database():
    """Create and populate the BMPOA database"""
    
    # Create database directory if it doesn't exist
    os.makedirs('database', exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    cursor = conn.cursor()
    
    # Read and execute schema
    with open('database/schema.sql', 'r') as f:
        schema = f.read()
        cursor.executescript(schema)
    
    # Insert sections
    sections_data = [
        ('Welcome & Introduction', 1, 'Opening materials including welcome letter and guide overview'),
        ('Governance', 2, 'BMPOA structure, board information, and administrative details'),
        ('Community Life', 3, 'Social events, facilities, and community programs'),
        ('Safety & Emergency', 4, 'Fire safety, emergency preparedness, and construction requirements'),
        ('Services & Recreation', 5, 'Community services, Deer Lake, and recreational facilities'),
        ('Nature & Environment', 6, 'Wildlife, native plants, and environmental programs'),
        ('Local Attractions', 7, 'Wineries, hiking trails, and area attractions'),
        ('Appendices', 8, 'Emergency contacts, maps, and reference materials')
    ]
    
    cursor.executemany('''
        INSERT INTO sections (name, order_index, description)
        VALUES (?, ?, ?)
    ''', sections_data)
    
    # Insert pages
    pages_data = [
        (1, 'Welcome Letter', 'WelcomePage', 'Welcome & Introduction', False),
        (2, 'About the Guide', 'AboutPage', 'Welcome & Introduction', False),
        (3, 'Table of Contents', 'TableOfContents', 'Welcome & Introduction', True),
        (4, 'Governance and Structure', 'GovernancePage', 'Governance', False),
        (5, 'Board Officers and Directors', 'BoardPage', 'Governance', False),
        (6, 'History and Founding Principles', 'HistoryPage', 'Governance', False),
        (7, 'Social Committee & Events', 'SocialCommitteePage', 'Community Life', False),
        (8, 'The Lodge', 'LodgePage', 'Community Life', False),
        (9, 'Fire Safety and Emergency Preparedness', 'FireSafetyPage', 'Safety & Emergency', False),
        (10, 'FireWise Safety Pamphlet', 'FireWisePage', 'Safety & Emergency', False),
        (11, 'New Home Construction Requirements', 'ConstructionPage', 'Safety & Emergency', False),
        (12, 'Community Services', 'CommunityServicesPage', 'Services & Recreation', False),
        (13, 'Deer Lake', 'DeerLakePage', 'Services & Recreation', False),
        (14, 'Wood Chipping Program', 'WoodChippingPage', 'Services & Recreation', False),
        (15, 'Bear Safety', 'BearSafetyPage', 'Nature & Environment', False),
        (16, 'Trilliums', 'TrilliumsPage', 'Nature & Environment', False),
        (17, 'Plant Ridge & Valley Natives', 'NativePlantsPage', 'Nature & Environment', False),
        (18, 'Facebook Groups', 'FacebookGroupsPage', 'Community Life', False),
        (19, 'Wineries on the Mountain', 'WineriesPage', 'Local Attractions', False),
        (20, 'Hiking Trails on Blue Mountain', 'HikingTrailsPage', 'Local Attractions', False)
    ]
    
    for page in pages_data:
        cursor.execute('''
            INSERT INTO pages (page_number, title, component_name, section, is_finalized, finalized_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (*page, '2025-06-02' if page[4] else None))
    
    # Insert contacts
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
         '(804) 367-1000', None, None, None, True, 5),
        
        # Board members
        ('board', 'Jim Critcher', 'President', None, None, None, None, False, 1),
        ('board', 'Harry Davis', '1st VP', None, None, None, None, False, 2),
        ('board', 'Jonathan Morrison', '2nd VP', None, None, None, None, False, 3),
        ('board', 'Mike Veasey', 'Financial Secretary', None, None, None, None, False, 4),
        ('board', 'Patrick Patton', 'Secretary', None, None, None, None, False, 5),
        
        # Committee chairs
        ('community', 'Carl Herz', 'Roads Committee Chair', None, None, None, None, False, 10),
        ('community', 'Mackenzie Williams', 'Social Committee Chair', None, 
         'mll2294@me.com', None, None, False, 11),
        ('community', 'Billy Orndorff', 'Covenants Enforcement Committee Chair', None, 
         None, None, None, False, 12),
        
        # Service contacts
        ('service', 'BMPOA Lodge Booking', None, None, 
         'bluemountainlodgebooking@gmail.com', None, None, False, 20),
        ('service', 'Deer Lake Passes', None, None, 
         'bmpoadeerlake@gmail.com', None, None, False, 21),
        ('service', 'Wood Chipping Coordinator', None, None, 
         'jcook0313@gmail.com', None, None, False, 22),
        ('service', 'BMPOA Roads Committee', None, None, 
         'bmpoaroads@gmail.com', None, None, False, 23),
        ('service', 'Freedom Disposal Services', None, '540-631-3467', 
         None, None, 'Northern Shenandoah Valley', False, 24),
        ('service', 'Skyline Trash Service', None, '540-974-9418', 
         None, None, None, False, 25)
    ]
    
    cursor.executemany('''
        INSERT INTO contacts (category, name, title, phone, email, address, notes, is_emergency, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', contacts_data)
    
    # Insert resources
    resources_data = [
        # Wineries
        ('winery', 'Fox Meadow Winery', 'Indoor seating, outdoor patio, seasonal live music', 
         '3310 Freezeland Rd, Linden, VA 22642', None, None, 
         'Fri-Sun, 12 PM - 6 PM', 'Specialties: Chardonnay, Cabernet Franc, Blueberry wine', 1),
        ('winery', 'Capstone Vineyards', 'Tasting pavilion, panoramic views, farm-to-table events', 
         '13400 Crimson Ln, Linden, VA 22642', None, None, 
         'Sat-Sun, 11 AM - 5 PM', 'Reservations recommended on weekends', 2),
        ('winery', 'Crimson Lane Vineyards', 'Elevated picnic terrace, firepits, wood-fired pizza oven', 
         '13334 Crimson Ln, Linden, VA 22642', None, None, 
         None, 'Small-batch wines, wine club available', 3),
         
        # Hiking trails
        ('hiking', 'Blue Mountain Trailhead', 'Main trailhead with interconnected loops', 
         'GPS: 38.9604° N, 78.4703° W', None, None, None, 
         'Free gravel lot (~20 spaces), portable restroom onsite', 1),
        ('hiking', 'Deer Run Loop', '1.2 mi loop, < 200 ft elevation gain', 
         None, None, None, None, 'Easy trail with interpretive signage', 2),
        ('hiking', 'Blue Ridge Overlook Trail', '3.5 mi out-and-back, ~800 ft elevation gain', 
         None, None, None, None, 'Moderate trail with panoramic overlook', 3),
        ('hiking', 'Appalachian Connector Trail', '5.2 mi one-way to AT summit', 
         None, None, None, None, 'Strenuous trail with steep switchbacks', 4),
         
        # Services
        ('service', 'Warren County Citizen Convenience Sites', 'Waste disposal locations', 
         'Multiple locations', None, None, None, 
         'Accept bagged household waste and recycling', 10),
        ('service', 'Bentonville Transfer Station', 'Bulk item disposal', 
         '232 Shangri-La Road, Bentonville, VA 22610', None, None, None, 
         'For furniture, large appliances (no scrap metal)', 11),
        ('service', 'Xfinity (Comcast)', 'Local broadband provider', 
         None, '1-855-399-1542', None, None, None, 12),
        ('service', 'Starlink', 'Satellite internet', 
         None, None, 'Starlink.com', None, None, 13)
    ]
    
    cursor.executemany('''
        INSERT INTO resources (category, name, description, address, phone, website, hours, notes, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', resources_data)
    
    # Insert images
    images_data = [
        ('bmpoa-emblem.jpeg', 'BMPOA Emblem/Crest showing bear, deer, eagle, trout, mountains', 
         'BMPOA Emblem with ribbon "ANGULUS RIDET"', 'emblem', None, None, None, '[1]'),
        ('virginia-state-flag.png', 'Virginia State Flag', 
         'Commonwealth Seal: Virtus over Tyranny', 'service', None, None, None, '[4]'),
        ('blue-mountain-lodge.jpeg', 'Interior of The Blue Mountain Lodge', 
         'Wide-angle photo showing wood-beamed ceiling, seating, and communal areas', 
         'facility', None, None, None, '[8]'),
        ('debris-fire.png', 'Large debris fire near a lake', 
         'Photo showing controlled burning conditions', 'service', None, None, None, '[9]'),
        ('freedom-disposal.png', 'FREEDOM Disposal Truck & Logo', 
         'Photo of white truck', 'service', None, None, None, '[12]'),
        ('sts-business-card.png', 'Skyline Trash Service Business Card', 
         None, 'service', None, None, None, '[12]'),
        ('warren-county-waste-map.png', 'Warren County Waste Map', 
         'Citizen convenience sites and Bentonville Transfer Station', 'service', 
         None, None, None, '[12]'),
        ('deer-lake-dock.jpeg', 'Dock at Deer Lake', 
         'Wooden dock extending into tree-lined water', 'facility', None, None, None, '[13]'),
        ('trillium-bloom-thompson-wma.jpeg', 'Trillium bloom at Thompson WMA', 
         'Photo of millions of white trilliums', 'nature', None, None, None, '[16]'),
        ('winery-1.jpeg', 'Fox Meadow Winery', 
         'Interior tasting room', 'scenic', None, None, None, '[19]'),
        ('winery-2.jpeg', 'Capstone Vineyards', 
         'Vineyard sunrise', 'scenic', None, None, None, '[19]'),
        ('winery-3.jpeg', 'Crimson Lane Vineyards', 
         'Hillside vines', 'scenic', None, None, None, '[19]'),
        ('mountain-overlook.jpeg', 'Springtime overlook from Blue Mountain', 
         'Ridge-top vista with blooming shrubs', 'scenic', None, None, None, '[20]')
    ]
    
    cursor.executemany('''
        INSERT INTO images (filename, alt_text, caption, category, width, height, file_size, used_on_pages)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', images_data)
    
    # Insert regulations
    regulations_data = [
        ('fire_safety', '4 PM Burning Law', 
         'Open burning forbidden at all times within BMPOA boundaries', 
         'Warren County Code § 974.3575: No burning within 300 ft of woods/dry grass before 4 PM; BMPOA prohibits open burning entirely. Violations: Class 3 misdemeanor; fines up to $500 plus suppression costs',
         '2024-01-01', 1),
        ('fire_safety', 'Burn Barrel Regulations', 
         'Requirements for burn barrels if used', 
         'Metal barrels with vented lids 16″ above vents; stable base; drip/ash pan to catch embers; keep lid in place when not burning',
         '2024-01-01', 2),
        ('construction', 'Pre-Construction Requirements', 
         'ARC approval required before any construction', 
         'Before applying for any Warren County building permit or zoning variance, owner must notify ARC Chair. Submit in writing via return-receipt mail. ARC Chair will respond in writing within 30 days.',
         '2024-09-01', 10),
        ('construction', 'Building Setbacks', 
         'Minimum distance requirements from property lines', 
         '≥ 75 ft from centerline of Route 638, ≥ 70 ft from centerline of any internal BMPOA road, ≥ 20 ft from each side line, ≥ 25 ft from rear line',
         '2024-09-01', 11),
        ('construction', 'Exterior Materials', 
         'Approved materials for home construction', 
         'Wood or wood-look siding (cedar lap, HardiPlank, solid-surface synthetics). No vinyl siding. Solid log homes acceptable. Colors: Muted, nature-reflective (greens, browns, tans).',
         '2024-09-01', 12),
        ('community', 'Deer Lake Access', 
         'Private property for BMPOA members only', 
         'Blue Mountain Recreational Area Pass required for all users. Issued annually in May via email request to bmpoadeerlake@gmail.com with proof of property ownership.',
         '2024-01-01', 20),
        ('environmental', 'Wood Chipping Guidelines', 
         'Annual fire mitigation program', 
         'Place brush within 5 ft of roadside. Branches ≤ 8″ diameter and ≤ 12 ft length. Remove rocks, metal, trash—only clean wood/brush.',
         '2024-01-01', 30),
        ('environmental', 'Bear Safety', 
         'Preventing bear conflicts', 
         'Remove bird feeders April-November, secure garbage, clean grills. Feeding bears is illegal under Virginia Code.',
         '2024-01-01', 31)
    ]
    
    cursor.executemany('''
        INSERT INTO regulations (category, title, description, full_text, effective_date, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', regulations_data)
    
    # Commit all changes
    conn.commit()
    
    # Create some sample content blocks for key pages
    sample_content = [
        # Welcome Letter (Page 1)
        (1, 'heading', 1, 'Welcome to Blue Mountain', '{"level": 1}'),
        (1, 'paragraph', 2, 'Dear Neighbor,\n\nOn behalf of the Blue Mountain Property Owners Association Board of Directors, we warmly welcome you to our mountain community. Whether you are a new resident, a longtime homeowner, or a visitor, we are delighted you are here.', None),
        (1, 'paragraph', 3, 'Blue Mountain has been a special place since the late 1950s, when it was established as a vacation retreat for Washington, D.C. area residents seeking clean mountain air and peaceful surroundings. Today, we are a vibrant mix of seasonal and year-round families who share a commitment to preserving the natural beauty and neighborly spirit that make our community unique.', None),
        (1, 'paragraph', 4, 'This guide provides comprehensive information about living in Blue Mountain, from governance and community services to recreational opportunities and safety guidelines. We encourage you to reference it often and to participate actively in our community life.', None),
        (1, 'paragraph', 5, 'We look forward to seeing you at community events, board meetings, and around the mountain. Together, we continue the tradition of stewardship and fellowship that has defined Blue Mountain for over six decades.', None),
        (1, 'paragraph', 6, 'Sincerely,\nThe BMPOA Board of Directors', None),
        
        # Governance Page (Page 4)
        (4, 'heading', 1, 'Governance and Structure', '{"level": 1}'),
        (4, 'heading', 2, 'BMPOA Overview', '{"level": 2}'),
        (4, 'list', 3, 'Blue Mountain Property Owners Association (BMPOA) is run entirely by elected volunteer property-owner board members', '{"style": "bullet"}'),
        (4, 'list', 4, 'Mission: Preserve natural beauty, foster community engagement, and provide essential services', '{"style": "bullet"}'),
        (4, 'heading', 5, 'Board Meetings', '{"level": 2}'),
        (4, 'list', 6, 'Monthly meetings: Every second Monday, 6 PM EST at The Blue Mountain Lodge (540 Cliff Road, Linden, VA 22642)', '{"style": "bullet"}'),
        (4, 'list', 7, 'Annual meeting: Held on August 17, 2025', '{"style": "bullet"}'),
        
        # Fire Safety Page (Page 9)
        (9, 'heading', 1, 'Fire Safety & Emergency Preparedness', '{"level": 1}'),
        (9, 'heading', 2, '4 PM Burning Law (VA Dept. of Forestry)', '{"level": 2}'),
        (9, 'list', 3, 'Open burning forbidden at all times within BMPOA boundaries (even if Warren County lifts a burn ban)', '{"style": "bullet", "important": true}'),
        (9, 'list', 4, 'Warren County Code § 974.3575: No burning within 300 ft of woods/dry grass before 4 PM; BMPOA prohibits open burning entirely', '{"style": "bullet"}'),
        (9, 'list', 5, 'Violations: Class 3 misdemeanor; fines up to $500 plus suppression costs', '{"style": "bullet"}'),
        (9, 'list', 6, 'Official code link: https://ecode360.com/9743575#9743575', '{"style": "bullet"}')
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', sample_content)
    
    # Create cross-references
    cross_refs = [
        (11, 4, 'See Page 4 for more information about the Architectural Review Committee process'),
        (9, 10, 'See next page for detailed FireWise safety recommendations'),
        (15, 20, 'For hiking safety and bear encounters, see Page 20')
    ]
    
    cursor.executemany('''
        INSERT INTO cross_references (from_page_id, to_page_id, reference_text)
        VALUES (?, ?, ?)
    ''', cross_refs)
    
    conn.commit()
    conn.close()
    
    print("Database created and populated successfully!")
    print(f"Location: {os.path.abspath('database/bmpoa_booklet.db')}")

if __name__ == '__main__':
    create_database()