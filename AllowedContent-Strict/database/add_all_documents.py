#!/usr/bin/env python3
"""
Add all extracted content from PDFs to BMPOA database
"""

import sqlite3
from datetime import datetime

def add_all_documents():
    """Add content from all provided PDFs to database"""
    
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    cursor = conn.cursor()
    
    # Add Sanitary District information
    sanitary_district_content = [
        ('community', 'Sanitary District Powers',
         'Legal powers granted to sanitary districts',
         '''Sanitary districts have the following powers:
         - Construct, maintain and operate water supply, sewerage, garbage removal and disposal
         - Heat, light, fire-fighting equipment, power, gas utilities
         - Streets, parking lots, curbs, gutters, sidewalks
         - Community buildings, centers and recreational facilities
         - Acquire systems by gift, condemnation, purchase, lease
         - Levy and collect annual tax upon all property in district
         - Abate nuisances within the district''',
         '2024-01-01', 50),
         
        ('community', 'Sanitary District Formation',
         'Requirements to form a sanitary district',
         '''To create a sanitary district requires:
         - Petition from 50 qualified voters (or 50% if less than 100 voters)
         - Support from 50% of all real property owners
         - Board of Supervisors approval
         - Finding that district is necessary, practical, fiscally responsible
         - Warren County BOS becomes governing board''',
         '2024-01-01', 51),
         
        ('community', 'Sanitary District Benefits',
         'Advantages of sanitary district status',
         '''Benefits include:
         - Warren County collects taxes (5% fee + $350 annual)
         - No liens on individual properties needed
         - Uniform fees throughout subdivision
         - All lots subject to tax (including developer-owned)
         - Eligible for state/federal disaster relief funds
         - Can acquire surplus government property
         - Improved credit status and property values
         - Taxes may be deductible on federal returns''',
         '2024-01-01', 52),
    ]
    
    cursor.executemany('''
        INSERT INTO regulations (category, title, description, full_text, effective_date, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', sanitary_district_content)
    
    # Add new contacts from documents
    new_contacts = [
        # From evacuation document
        ('service', 'Warren County Administrator', 'Doug Stanley',
         '(540) 636-4600', 'dstanley@warrencountyva.net', '220 North Commerce Avenue, Suite 400, Front Royal, VA 22630',
         'Contact for sanitary district formation', False, 30),
        
        # From bluemountemail
        ('service', 'Blue Mountain Lodge Booking', None, None,
         'bluemountainlodgebooking@gmail.com', '540 Cliff Road, Linden, VA 22642',
         'Lodge rental reservations - books up to 2 years in advance', False, 31),
         
        ('service', 'Roads Committee Email', None, None,
         'bmpoaroads@gmail.com', None,
         'Report road conditions with name, email, location, photos', False, 32),
         
        ('service', 'Deer Lake Passes', None, None,
         'bmpoadeerlake@gmail.com', '3367 Blue Mountain Road, Linden, VA 22630',
         'Email with proof of ownership for recreational passes', False, 33),
         
        ('community', 'Mackenzie Williams', 'Social Committee Chair',
         '(703) 475-5353', 'mll2294@me.com', None,
         'Personal cell for emergencies', False, 34),
         
        ('service', 'Wood Chip Delivery', 'J Cook', None,
         'jcook0313@gmail.com', None,
         'Coordinate free wood chip delivery', False, 35),
         
        # VDGIF contacts for Fire Trail Road
        ('service', 'VDGIF Region 4 - Mamie Parker, PhD', 'Board of Directors',
         None, None, None,
         'Contact for Fire Trail Road issues', False, 36),
         
        ('service', 'VDGIF Region 4 - Douglas Dear', 'Board of Directors',
         None, None, None,
         'Contact for Fire Trail Road issues', False, 37),
    ]
    
    cursor.executemany('''
        INSERT INTO contacts (category, name, title, phone, email, address, notes, is_emergency, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', new_contacts)
    
    # Add construction requirements as regulations
    construction_reqs = [
        ('construction', 'ARC Notification Timeline',
         '30-day response requirement for ARC',
         '''ARC must respond within 30 days of request with:
         a) Approval
         b) Disapproval with reasons
         c) Request for additional information
         If no response within 30 days, request is deemed approved.
         If additional info requested, another 30-day period begins upon receipt.''',
         '2024-09-01', 60),
         
        ('construction', 'Accessory Building Definitions',
         'Warren County definitions and requirements',
         '''BUILDING: Any structure with roof supported by columns/walls
         PERMITS: Structures <200 sq ft in side/rear yard don't need county permit (but need ARC approval)
         HEIGHT: 12 ft average (eave to ridge divided by 2 plus wall height)
         SETBACK: No accessory building forward of residence front plane or within 50 ft of front property line
         Must be 10 ft from side lines
         NONCONFORMING: Pre-1992 buildings grandfathered by county but may violate covenants''',
         '2024-09-01', 61),
         
        ('construction', 'Unpaved Road Construction Specs',
         'Developer requirements for new roads',
         '''Developer must build road to BMPOA specs:
         - Within surveyed roadway easement only
         - Base: 3" compacted #3 gravel minimum
         - Surface: 2" compacted crusher run gravel
         - Width: 10 feet between ditch lines
         - Proper grading/crowning to prevent pooling
         - 12" minimum corrugated double-wall plastic culverts at low points
         - Once accepted by Roads Committee, BMPOA assumes maintenance''',
         '2024-09-01', 62),
         
        ('construction', 'Compliance Enforcement',
         'Violation correction procedures',
         '''Upon violation notification:
         1) 60 days to complete corrective action OR
         2) 20 days to submit alternative plan/appeal
         - Board has 30 days to respond to alternative plan
         - If no response, plan deemed approved
         - If disapproved, 60 days to complete original correction
         - Appeals go to Arbitration Committee (30 day process)
         - Failure to comply may result in legal action with attorney fees''',
         '2024-09-01', 63),
    ]
    
    cursor.executemany('''
        INSERT INTO regulations (category, title, description, full_text, effective_date, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', construction_reqs)
    
    # Add fire safety tips for children
    child_safety_content = [
        (9, 'heading', 300, '10 Tips for Keeping Children Safe in a Home Fire', '{"level": 3}'),
        (9, 'list', 301, 'Teach children fire is a tool, not a toy; demonstrate safe behavior around heat sources', '{"style": "number"}'),
        (9, 'list', 302, 'Install smoke alarms near kitchen, each level, and in bedrooms; test monthly, replace batteries yearly', '{"style": "number"}'),
        (9, 'list', 303, 'Introduce children to firefighters so they\'re not scared by gear and masks', '{"style": "number"}'),
        (9, 'list', 304, 'Keep matches and lighters out of reach or locked; use child-resistant mechanisms', '{"style": "number"}'),
        (9, 'list', 305, 'Never leave children unattended near stoves, candles, or fireplaces', '{"style": "number"}'),
        (9, 'list', 306, 'Teach children to call 9-1-1; post emergency numbers and address near phones', '{"style": "number"}'),
        (9, 'list', 307, 'Practice fire drills twice yearly (including at night) so children know escape routes', '{"style": "number"}'),
        (9, 'list', 308, 'Demonstrate how to escape smoke-filled room by crawling on floor to exit', '{"style": "number"}'),
        (9, 'list', 309, 'Emphasize "Get out and stay out" - don\'t re-enter; call for help from outside', '{"style": "number"}'),
        (9, 'list', 310, 'Teach STOP-DROP-and-ROLL if clothes catch fire: stop, drop covering face, roll until fire out', '{"style": "number"}'),
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', child_safety_content)
    
    # Add resources from documents
    new_resources = [
        # Warren County convenience sites with full addresses
        ('service', 'Route 522/340 Cooley Site', 'Citizen convenience site',
         '10037 Winchester Road, Front Royal', None, None, None,
         'Household waste and recycling', 60),
         
        ('service', 'Route 340 South Rockledge Site', 'Citizen convenience site',
         '9823 Stonewall Jackson Highway, Front Royal', None, None, None,
         'Household waste and recycling', 61),
         
        ('service', 'Linden Convenience Site', 'Citizen convenience site',
         '2664 Dismal Hollow Road, Linden', None, None, None,
         'Closest site to BMPOA - household waste and recycling', 62),
         
        ('service', 'Shenandoah Farms Site', 'Citizen convenience site',
         '47 Blue Mountain Road, Front Royal', None, None, None,
         'Household waste and recycling', 63),
         
        ('service', 'Warren County Planning Dept', 'Sanitary district information',
         '220 North Commerce Avenue, Suite 400, Front Royal, VA 22630',
         '(540) 636-3354', 'www.warrencountyva.net',
         None, 'planning@warrencountyva.net', 64),
         
        # Radio stations for emergencies
        ('emergency', 'WZRV The River', 'Emergency broadcast radio',
         None, '95.3 FM', None, None,
         'Primary station for evacuation announcements', 70),
         
        ('emergency', 'WFTR AM', 'Emergency broadcast radio',
         None, '1450 AM', None, None,
         'Secondary station for evacuation announcements', 71),
    ]
    
    cursor.executemany('''
        INSERT INTO resources (category, name, description, address, phone, website, hours, notes, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', new_resources)
    
    # Add winter weather and road content
    winter_content = [
        (8, 'heading', 150, 'Winter Weather Guidelines', '{"level": 3}'),
        (8, 'sidebar', 151, 'IMPORTANT: Salt use is PROHIBITED on all BMPOA gravel roads - damages roadbed', '{"type": "warning"}'),
        (8, 'paragraph', 152, 'For traction assistance:', None),
        (8, 'list', 153, 'Look for blue poly barrels filled with gravel chips placed on steep hills', '{"style": "bullet"}'),
        (8, 'list', 154, 'Use tire chains when conditions are poor - practice installation before winter', '{"style": "bullet"}'),
        (8, 'paragraph', 155, 'Snow plowing begins when accumulation reaches 4 inches at designated mountain location.', None),
        (8, 'heading', 156, 'Downed Trees and Power Lines', '{"level": 3}'),
        (8, 'list', 157, 'You may safely remove fallen trees from BMPOA roads or report via website', '{"style": "bullet"}'),
        (8, 'list', 158, 'If power line falls on vehicle: Stay inside! If you must exit, jump clear without touching car and ground simultaneously', '{"style": "bullet"}'),
        (8, 'list', 159, 'Report fallen lines to REC at (800) 552-3904 or myrec.coop/outagecenter', '{"style": "bullet"}'),
        (8, 'sidebar', 160, 'NOTE: Fire Trail Road is NOT maintained by BMPOA - contact VDGIF Region 4 for issues', '{"type": "info"}'),
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', winter_content)
    
    # Update Deer Lake content with new details
    deer_lake_updates = [
        (13, 'paragraph', 150, 'Location: 3367 Blue Mountain Road, Linden, Virginia 22630', None),
        (13, 'heading', 151, 'Pass Requirements', '{"level": 3}'),
        (13, 'paragraph', 152, 'To receive your passes, email bmpoadeerlake@gmail.com with documentation verifying property ownership.', None),
        (13, 'sidebar', 153, 'Guest Policy: Use good judgment when inviting guests. Frequent large gatherings may raise concerns about improper use. Board reserves right to review policies.', '{"type": "info"}'),
        (13, 'heading', 154, 'Weekend/Holiday Dog Restrictions', '{"level": 3}'),
        (13, 'list', 155, 'NO dogs on weekends/holidays from Memorial Day to Labor Day', '{"style": "bullet", "important": true}'),
        (13, 'list', 156, 'Weekdays: Dogs allowed near dam but NOT on dock', '{"style": "bullet"}'),
        (13, 'list', 157, 'Dogs must be leashed and owners must clean up after pets', '{"style": "bullet"}'),
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', deer_lake_updates)
    
    conn.commit()
    conn.close()
    
    print("Successfully added all document content to database")
    print("Database location: /Users/griffin/Projects/BMPOA-Fresh/database/bmpoa_booklet.db")
    print("\nAdded:")
    print("- 3 sanitary district regulations")
    print("- 8 new contacts")
    print("- 4 construction requirement regulations")  
    print("- 10 child fire safety tips")
    print("- 7 new resources")
    print("- 11 winter weather content blocks")
    print("- 8 Deer Lake policy updates")

if __name__ == '__main__':
    add_all_documents()