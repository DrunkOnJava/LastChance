#!/usr/bin/env python3
"""
Export reports from BMPOA database
"""

import sqlite3
import json
import csv
from datetime import datetime

def export_contacts_csv():
    """Export all contacts to CSV"""
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT category, name, title, phone, email, address, notes, is_emergency
        FROM contacts
        ORDER BY category, order_index
    ''')
    
    with open('database/exports/contacts.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Category', 'Name', 'Title', 'Phone', 'Email', 'Address', 'Notes', 'Emergency'])
        writer.writerows(cursor.fetchall())
    
    conn.close()
    print("Exported contacts to database/exports/contacts.csv")

def export_page_content_md():
    """Export all page content to Markdown"""
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM pages ORDER BY page_number')
    pages = cursor.fetchall()
    
    with open('database/exports/booklet_content.md', 'w') as f:
        f.write("# BMPOA Booklet Content\n\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("---\n\n")
        
        for page in pages:
            f.write(f"## Page {page['page_number']}: {page['title']}\n\n")
            f.write(f"**Component:** {page['component_name']}\n")
            f.write(f"**Section:** {page['section']}\n")
            f.write(f"**Finalized:** {'Yes' if page['is_finalized'] else 'No'}\n\n")
            
            # Get content blocks for this page
            cursor.execute('''
                SELECT block_type, content, metadata
                FROM content_blocks
                WHERE page_id = ?
                ORDER BY order_index
            ''', (page['id'],))
            
            blocks = cursor.fetchall()
            for block in blocks:
                if block['block_type'] == 'heading':
                    metadata = json.loads(block['metadata']) if block['metadata'] else {}
                    level = metadata.get('level', 1)
                    f.write(f"{'#' * (level + 2)} {block['content']}\n\n")
                elif block['block_type'] == 'paragraph':
                    f.write(f"{block['content']}\n\n")
                elif block['block_type'] == 'list':
                    metadata = json.loads(block['metadata']) if block['metadata'] else {}
                    bullet = '•' if metadata.get('style') == 'bullet' else '1.'
                    indent = '  ' * metadata.get('indent', 0)
                    f.write(f"{indent}{bullet} {block['content']}\n")
                elif block['block_type'] == 'sidebar':
                    f.write(f"> **{block['content']}**\n\n")
            
            f.write("\n---\n\n")
    
    conn.close()
    print("Exported page content to database/exports/booklet_content.md")

def export_emergency_contacts():
    """Export emergency contacts for quick reference"""
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT name, title, phone, email, notes
        FROM contacts
        WHERE is_emergency = 1
        ORDER BY order_index
    ''')
    
    with open('database/exports/emergency_contacts.txt', 'w') as f:
        f.write("BMPOA EMERGENCY CONTACTS\n")
        f.write("=" * 50 + "\n\n")
        
        for contact in cursor.fetchall():
            f.write(f"{contact['name']}")
            if contact['title']:
                f.write(f" - {contact['title']}")
            f.write("\n")
            if contact['phone']:
                f.write(f"Phone: {contact['phone']}\n")
            if contact['email']:
                f.write(f"Email: {contact['email']}\n")
            if contact['notes']:
                f.write(f"Notes: {contact['notes']}\n")
            f.write("\n")
    
    conn.close()
    print("Exported emergency contacts to database/exports/emergency_contacts.txt")

def export_regulations_summary():
    """Export regulations summary by category"""
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT DISTINCT category FROM regulations ORDER BY category')
    categories = [row[0] for row in cursor.fetchall()]
    
    with open('database/exports/regulations_summary.md', 'w') as f:
        f.write("# BMPOA Regulations Summary\n\n")
        
        for category in categories:
            f.write(f"## {category.replace('_', ' ').title()}\n\n")
            
            cursor.execute('''
                SELECT title, description, effective_date
                FROM regulations
                WHERE category = ?
                ORDER BY order_index
            ''', (category,))
            
            for reg in cursor.fetchall():
                f.write(f"### {reg['title']}\n")
                f.write(f"*Effective: {reg['effective_date']}*\n\n")
                f.write(f"{reg['description']}\n\n")
        
    conn.close()
    print("Exported regulations summary to database/exports/regulations_summary.md")

def main():
    """Run all exports"""
    import os
    
    # Create exports directory
    os.makedirs('database/exports', exist_ok=True)
    
    print("Exporting BMPOA database reports...\n")
    
    export_contacts_csv()
    export_page_content_md()
    export_emergency_contacts()
    export_regulations_summary()
    
    print("\nAll exports complete!")

if __name__ == '__main__':
    main()