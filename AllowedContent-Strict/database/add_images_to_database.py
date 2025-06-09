#!/usr/bin/env python3
"""
Add the new images to the BMPOA database
"""

import sqlite3
from datetime import datetime

def add_images():
    """Add new image entries to database"""
    
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    cursor = conn.cursor()
    
    # New images data based on the provided photos
    new_images = [
        # Image 1 - Virginia Bluebells
        ('virginia-bluebells-field.jpeg', 'Field of Virginia Bluebells in full bloom', 
         'Vibrant blue Virginia Bluebells (Mertensia virginica) carpeting the forest floor', 
         'nature', None, None, None, '[16, 17]'),
         
        # Image 2 - Mountain sunset
        ('blue-mountain-sunset.jpeg', 'Dramatic sunset over Blue Mountain ridges', 
         'Sunset breaking through storm clouds over the Shenandoah Valley', 
         'scenic', None, None, None, '[20]'),
         
        # Image 3 - Virginia State Flag
        ('virginia-state-flag-official.png', 'Official Virginia State Flag', 
         'Commonwealth seal showing Virtus standing over Tyranny with motto "Sic Semper Tyrannis"', 
         'service', None, None, None, '[4]'),
         
        # Image 4 - Mountain vista daytime
        ('shenandoah-valley-vista.jpeg', 'Panoramic view of Shenandoah Valley', 
         'Daytime view from Blue Mountain overlook showing valley and distant ridges', 
         'scenic', None, None, None, '[20]'),
         
        # Image 5 - Lodge interior
        ('blue-mountain-lodge-interior.jpeg', 'Interior of Blue Mountain Lodge event space', 
         'Spacious lodge interior with vaulted ceiling, exposed beams, and event setup', 
         'facility', None, None, None, '[8]'),
         
        # Image 6 - Vineyard rows
        ('mountain-vineyard-rows.jpeg', 'Vineyard rows with mountain backdrop', 
         'Perfectly aligned grapevines with Blue Ridge Mountains in background', 
         'scenic', None, None, None, '[19]'),
         
        # Image 7 - Winery outdoor seating
        ('winery-outdoor-seating.jpeg', 'Outdoor seating area at mountain winery', 
         'Picnic tables and Adirondack chairs overlooking valley views', 
         'scenic', None, None, None, '[19]'),
         
        # Image 8 - Vineyard sunset
        ('vineyard-sunset-rows.jpeg', 'Sunset over vineyard rows', 
         'Golden hour light over newly planted vineyard with mountain silhouettes', 
         'scenic', None, None, None, '[19]'),
         
        # Image 9 - Trillium blooms close-up
        ('trillium-blooms-forest.jpeg', 'Great White Trilliums on forest floor', 
         'Close-up of Trillium grandiflorum blooms in natural habitat', 
         'nature', None, None, None, '[16]'),
         
        # Image 10 - Deer Lake dock view
        ('deer-lake-dock-floating.jpeg', 'Deer Lake with dock and floating platform', 
         'Serene view of Deer Lake showing dock and swimming platform', 
         'facility', None, None, None, '[13]'),
         
        # Image 11 - STS business card
        ('skyline-trash-service-card.png', 'Skyline Trash Service business card', 
         'Contact information for Robert Lillard, Owner/Operator', 
         'service', None, None, None, '[12]'),
         
        # Image 12 - Freedom Disposal logo
        ('freedom-disposal-logo.png', 'Freedom Disposal Services logo and branding', 
         'Patriotic logo with stars and stripes design', 
         'service', None, None, None, '[12]'),
         
        # Image 13 - Freedom Disposal truck
        ('freedom-disposal-truck.jpeg', 'Freedom Disposal Services collection truck', 
         'White commercial waste collection vehicle in service', 
         'service', None, None, None, '[12]'),
         
        # Image 14 - Debris fire
        ('large-debris-fire-lake.jpeg', 'Large debris fire near water', 
         'Example of dangerous open burning near lake - prohibited in BMPOA', 
         'service', None, None, None, '[9]'),
         
        # Image 15 - Wedding venue vista
        ('mountain-wedding-venue.jpeg', 'Wedding arbor with mountain vista', 
         'Decorated wedding arch overlooking Shenandoah Valley at sunset', 
         'scenic', None, None, None, '[19]'),
         
        # Image 16 - BMPOA emblem
        ('bmpoa-emblem-shield.png', 'Official BMPOA emblem', 
         'Shield design featuring bear, eagle, deer, trout with "ANGULUS RIDET" motto', 
         'emblem', None, None, None, '[Cover, 1]'),
    ]
    
    # Clear existing images first to avoid duplicates
    cursor.execute('DELETE FROM images')
    
    # Insert all images
    cursor.executemany('''
        INSERT INTO images (filename, alt_text, caption, category, width, height, file_size, used_on_pages)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', new_images)
    
    # Also update some content to reference these images
    image_references = [
        # Add image references to specific pages
        (4, 'paragraph', 100, 'Figure 2: Virginia State Flag - Commonwealth Seal showing Virtus over Tyranny', '{"type": "figure", "image": "virginia-state-flag-official.png"}'),
        (8, 'paragraph', 101, 'Figure 3: Interior of The Blue Mountain Lodge - Community gathering space', '{"type": "figure", "image": "blue-mountain-lodge-interior.jpeg"}'),
        (9, 'paragraph', 102, 'Figure 4: Example of prohibited open burning - debris fire near water', '{"type": "figure", "image": "large-debris-fire-lake.jpeg"}'),
        (12, 'paragraph', 103, 'Figure 6: Freedom Disposal Services - Northern Shenandoah Valley provider', '{"type": "figure", "image": "freedom-disposal-truck.jpeg"}'),
        (12, 'paragraph', 104, 'Figure 7: Skyline Trash Service - Contact information', '{"type": "figure", "image": "skyline-trash-service-card.png"}'),
        (13, 'paragraph', 105, 'Figure 10: Deer Lake dock and recreation area', '{"type": "figure", "image": "deer-lake-dock-floating.jpeg"}'),
        (16, 'paragraph', 106, 'Figure 12: Trillium blooms at Thompson WMA', '{"type": "figure", "image": "trillium-blooms-forest.jpeg"}'),
        (19, 'paragraph', 107, 'Figure 13-15: Local wineries showcase mountain views and vineyard rows', '{"type": "figure", "images": ["mountain-vineyard-rows.jpeg", "vineyard-sunset-rows.jpeg", "mountain-wedding-venue.jpeg"]}'),
        (20, 'paragraph', 108, 'Figure 20: Springtime overlook from Blue Mountain trails', '{"type": "figure", "image": "shenandoah-valley-vista.jpeg"}'),
    ]
    
    cursor.executemany('''
        INSERT INTO content_blocks (page_id, block_type, order_index, content, metadata)
        VALUES (?, ?, ?, ?, ?)
    ''', image_references)
    
    conn.commit()
    conn.close()
    
    print(f"Added {len(new_images)} images to the database")
    print("Updated content blocks with image references")

if __name__ == '__main__':
    add_images()