#!/usr/bin/env python3
"""
Generate image inventory report from database
"""

import sqlite3
from collections import defaultdict

def generate_image_inventory():
    """Create a report of all images in the database"""
    
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all images grouped by category
    cursor.execute('''
        SELECT category, filename, alt_text, used_on_pages
        FROM images
        ORDER BY category, filename
    ''')
    
    images = cursor.fetchall()
    
    # Group by category
    categories = defaultdict(list)
    for img in images:
        categories[img['category']].append(img)
    
    # Generate report
    with open('database/exports/image_inventory.md', 'w') as f:
        f.write("# BMPOA Booklet Image Inventory\n\n")
        f.write(f"Total Images: {len(images)}\n\n")
        
        for category, imgs in sorted(categories.items()):
            f.write(f"## {category.title()} ({len(imgs)} images)\n\n")
            
            for img in imgs:
                f.write(f"### {img['filename']}\n")
                f.write(f"- **Alt Text**: {img['alt_text']}\n")
                if img['used_on_pages']:
                    f.write(f"- **Used on Pages**: {img['used_on_pages']}\n")
                f.write("\n")
        
        # Summary by category
        f.write("## Summary by Category\n\n")
        for category, imgs in sorted(categories.items()):
            f.write(f"- **{category.title()}**: {len(imgs)} images\n")
    
    conn.close()
    print("Generated image inventory at database/exports/image_inventory.md")

if __name__ == '__main__':
    generate_image_inventory()