#!/usr/bin/env python3
"""
Add Blue Mountain Subdivision Emergency Evacuation content to database
"""

import sqlite3
from datetime import datetime

def add_evacuation_content():
    """Add emergency evacuation procedures to the database"""
    
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    cursor = conn.cursor()
    
    # Add new regulations for evacuation procedures
    evacuation_regulations = [
        ('emergency', 'Wildfire Evacuation Zones',
         'Blue Mountain divided into 7 evacuation zones',
         '''Blue Mountain is divided into 7 evacuation zones for wildfire response:
         Zone 1: Far View, Shady Tree, Black Walnut, Blue Mountain Rd, Dogwood Blossom, Little Indian, Lonesome Pine, Woodchuck, Hawk Hill, Lost Creek, Moonshiner, Old Sawmill
         Zone 2: Blood Root, Fern Trail, Jasper, Mockingbird, Spring Hill, Mossy Rock, Pee Wee, Rocky Boulder, Rock Spring, Indian Pipes, Paradise, Woodhaven
         Zone 3: Blue Mountain Rd, Chipmunk Trail, Cliff, Henry, Old Dominion, Trillium Trail
         Zone 4: Allegheny, Hideaway, Old Beacon, Peaceful, Freezeland Rd
         Zone 5: Blue Mountain Rd, Old Linden, Scarlet Tanager, Woodpecker
         Zone 6: Buck, Chipmunk, Cliff, Cresthill, Henry, Wild Cherry, Indian Lookout, Old Log, Red Robin, Rock Mount, Source, Tranquil, Freezeland
         Zone 7: Crickets, Hickory Nut, May Apple, Freezeland, Mt Oriole, Squaw Path, Warbler, Woodlark, Woodthrush, Tomahawk''',
         '2025-01-01', 40),
        
        ('emergency', 'Primary Evacuation Routes',
         'Two main evacuation routes from Blue Mountain',
         '''Primary evacuation routes:
         1. Blue Mountain Rd down the mountain to Howellsville Rd and beyond
         2. Freezeland Rd south to Linden and beyond
         
         DO NOT USE:
         - Fire Trail northward (no outlet)
         - Old Linden Rd southward (impassable)
         - Deer Lake Recreation Area roads (reserved for emergency water refilling)''',
         '2025-01-01', 41),
        
        ('emergency', 'Evacuation Notification Methods',
         'How residents will be notified of evacuations',
         '''Evacuation orders will be announced by:
         - FM radio WZRV The River 95.3
         - AM radio WFTR 1450
         - Loudspeakers on emergency vehicles
         - Smart911 phone calls (signup at Smart911.com)
         - Internet social media
         
         Law enforcement will enforce evacuation orders. Follow their directions promptly and exactly.
         No need to wait for official notices - evacuate if you feel unsafe.''',
         '2025-01-01', 42),
        
        ('emergency', 'Wildfire Home Protection',
         'Steps to protect your home before evacuating',
         '''If time permits when wildfire approaches:
         - Remove all combustibles 30-50 feet from dwelling (doormats, grills, firewood, furniture, gasoline)
         - Leave connected garden hoses and water buckets for firefighters
         - Place aluminum ladders outside for roof access
         - Leave lights on inside and outside
         - Turn off HVAC systems completely
         - Leave doors/windows closed but UNLOCKED for emergency personnel
         - Keep electricity on to power well pump''',
         '2025-01-01', 43),
        
        ('emergency', 'Family Evacuation Planning',
         'Essential components of family evacuation plan',
         '''Develop evacuation plan that is:
         - Simple enough to follow under stress
         - Detailed enough to cover key elements
         - Understood by everyone in household
         
         Family meeting places:
         - School bus stops on Freezeland and Blue Mt Roads
         - Monastery on Freezeland Rd (backup location)
         - Shenandoah Farms Fire Dept at 6363 Howellsville Road
         - Warren County Emergency Centers (monitor radio for locations)''',
         '2025-01-01', 44),
        
        ('emergency', 'Evacuation Kit Contents',
         'Essential items for emergency evacuation',
         '''Keep evacuation kit near entrance or in car:
         - Change of clothes, warm coat, footwear
         - Several days of prescription medications with copies of prescriptions
         - List of medical needs and doctor contact info
         - Toiletries (soap, shampoo, toothbrush, etc.)
         - First aid kit
         - Extra glasses/contacts and phone charger
         - LED flashlights and battery radio with extra batteries
         - Cash
         - Pet emergency kit (food, water, meds, carrier)
         - Important documents (see separate list)''',
         '2025-01-01', 45),
        
        ('emergency', 'Important Documents Checklist',
         'Critical papers to collect for evacuation',
         '''Collect in single file for quick evacuation:
         - Wills, insurance policies, contracts, deeds, passports, drivers licenses
         - Social Security and Medicare cards
         - Medical and immunization records
         - Account numbers and passwords for financial institutions
         - Credit card numbers and company contacts
         - Inventory of valuable household goods
         - Family records (birth, marriage, death certificates)
         - Pet vaccination records''',
         '2025-01-01', 46),
        
        ('emergency', 'Returning Home After Fire',
         'Safety procedures when returning after evacuation',
         '''Wait for official all-clear from public safety officials before returning.
         
         Upon return:
         - Watch for downed power lines - stay far away and warn others
         - Check dwelling and gutters for smoldering fires
         - Monitor property for smoke/embers for 24-48 hours
         - Do NOT plug generators into house wiring
         - Bring 1 gallon drinking water per person per day
         - Check water/septic systems before use
         - Document any damage with photos for insurance
         
         Power restoration: Call REC at 1-800-552-3904 or check myrec.coop/outagecenter''',
         '2025-01-01', 47),
    ]
    
    cursor.executemany('''
        INSERT INTO regulations (category, title, description, full_text, effective_date, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', evacuation_regulations)
    
    # Add emergency contacts specific to evacuation
    evacuation_contacts = [
        ('emergency', 'Smart911 Registration', 'Emergency notification system',
         None, None, 'Smart911.com', 'Register for evacuation phone alerts', True, 10),
        ('emergency', 'WZRV The River FM', 'Emergency broadcast station',
         '95.3 FM', None, None, 'Primary evacuation announcement station', True, 11),
        ('emergency', 'WFTR AM Radio', 'Emergency broadcast station',
         '1450 AM', None, None, 'Secondary evacuation announcement station', True, 12),
        ('emergency', 'Shenandoah Farms Fire Dept', 'Evacuation meeting point',
         None, None, '6363 Howellsville Road', 'Family meeting location option', False, 13),
    ]
    
    cursor.executemany('''
        INSERT INTO contacts (category, name, title, phone, email, address, notes, is_emergency, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', evacuation_contacts)
    
    # Add content blocks for evacuation section
    evacuation_content = [
        (9, 'heading', 200, 'Wildfire Evacuation Procedures', '{"level": 2}'),
        (9, 'sidebar', 201, 'CRITICAL: If you see a wildfire anywhere, CALL 911 IMMEDIATELY. Do not assume it has been called in.', '{"type": "emergency"}'),
        (9, 'paragraph', 202, 'Despite our chipping of deadfall over the past decade, our subdivision remains at extreme levels of wildfire risk.', None),
        (9, 'heading', 203, 'Quick Summary of Evacuation Process', '{"level": 3}'),
        (9, 'list', 204, 'Official Public Safety Personnel decide if evacuation is needed', '{"style": "bullet"}'),
        (9, 'list', 205, 'Evacuations ordered by zones (see zone map) - unlikely entire subdivision evacuates at once', '{"style": "bullet"}'),
        (9, 'list', 206, 'Law enforcement enforces orders - follow directions promptly and exactly', '{"style": "bullet"}'),
        (9, 'list', 207, 'No need to wait for official notices - evacuate if you feel unsafe', '{"style": "bullet"}'),
        (9, 'list', 208, 'Avoid rumors - monitor official channels for accurate information', '{"style": "bullet"}'),
        (9, 'heading', 209, 'Primary Evacuation Routes', '{"level": 3}'),
        (9, 'list', 210, 'Route 1: Blue Mountain Rd down to Howellsville Rd and beyond', '{"style": "number"}'),
        (9, 'list', 211, 'Route 2: Freezeland Rd south to Linden and beyond', '{"style": "number"}'),
        (9, 'sidebar', 212, 'WARNING: Do NOT use Fire Trail (no outlet), Old Linden Rd (impassable), or Deer Lake roads (reserved for emergency water refilling)', '{"type": "warning"}'),
        (9, 'paragraph', 213, 'Study the evacuation zone map carefully and know all routes out of your zone. Yield immediately to emergency vehicles - back into nearest driveway to let them pass.', None),
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', evacuation_content)
    
    # Add cross-reference to evacuation procedures
    cursor.execute('''
        INSERT INTO cross_references (from_page_id, to_page_id, reference_text)
        VALUES (9, 21, 'See Appendix B for complete evacuation zone map and emergency contacts')
    ''')
    
    # Update resources with evacuation-related entries
    evacuation_resources = [
        ('emergency', 'Blue Mountain Evacuation Zones Map', 'Detailed map showing all 7 evacuation zones',
         None, None, 'BMPOA.org/evacuation', None,
         'Critical reference - familiarize with your zone', 50),
        ('emergency', 'Warren County Emergency Centers', 'Evacuation shelter locations',
         None, '540-636-4600', None, None,
         'Locations announced via radio during emergencies', 51),
        ('emergency', 'Monastery on Freezeland Rd', 'Backup family meeting location',
         'Freezeland Rd near Blue Mountain', None, None, None,
         'Has agreed to allow use of access road for evacuee meetings', 52),
    ]
    
    cursor.executemany('''
        INSERT INTO resources (category, name, description, address, phone, website, hours, notes, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', evacuation_resources)
    
    conn.commit()
    conn.close()
    
    print("Successfully added emergency evacuation content to database")
    print("- Added 8 evacuation regulations")
    print("- Added 4 emergency contacts")
    print("- Added 14 content blocks for fire safety page")
    print("- Added 3 evacuation resources")
    print("- Added cross-reference to appendices")

if __name__ == '__main__':
    add_evacuation_content()