#!/usr/bin/env python3
"""
Query tool for BMPOA database - explore and verify content
"""

import sqlite3
import json
from tabulate import tabulate

def query_database():
    """Interactive query tool for BMPOA database"""
    
    conn = sqlite3.connect('database/bmpoa_booklet.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    while True:
        print("\n" + "="*60)
        print("BMPOA Database Query Tool")
        print("="*60)
        print("1. View all pages")
        print("2. View contacts by category")
        print("3. View resources by category")
        print("4. View regulations by category")
        print("5. Search content blocks")
        print("6. View cross-references")
        print("7. Custom SQL query")
        print("8. Database statistics")
        print("9. Exit")
        print("-"*60)
        
        choice = input("\nSelect option (1-9): ").strip()
        
        if choice == '1':
            # View all pages
            cursor.execute('''
                SELECT page_number, title, component_name, section, 
                       CASE WHEN is_finalized THEN 'Yes' ELSE 'No' END as finalized
                FROM pages ORDER BY page_number
            ''')
            results = cursor.fetchall()
            print("\n" + tabulate(results, headers=results[0].keys(), tablefmt='grid'))
            
        elif choice == '2':
            # View contacts by category
            print("\nCategories: emergency, board, community, service")
            category = input("Enter category (or 'all'): ").strip()
            
            if category == 'all':
                query = "SELECT * FROM contacts ORDER BY category, order_index"
            else:
                query = "SELECT * FROM contacts WHERE category = ? ORDER BY order_index"
                
            cursor.execute(query, (category,) if category != 'all' else ())
            results = cursor.fetchall()
            
            if results:
                # Format for display
                display_data = []
                for row in results:
                    display_data.append([
                        row['category'],
                        row['name'],
                        row['title'] or '',
                        row['phone'] or '',
                        row['email'] or '',
                        (row['notes'] or '')[:50] + '...' if row['notes'] and len(row['notes']) > 50 else row['notes'] or ''
                    ])
                print("\n" + tabulate(display_data, 
                    headers=['Category', 'Name', 'Title', 'Phone', 'Email', 'Notes'],
                    tablefmt='grid'))
            else:
                print("No contacts found.")
                
        elif choice == '3':
            # View resources by category
            cursor.execute("SELECT DISTINCT category FROM resources ORDER BY category")
            categories = [row[0] for row in cursor.fetchall()]
            print(f"\nCategories: {', '.join(categories)}")
            category = input("Enter category (or 'all'): ").strip()
            
            if category == 'all':
                query = "SELECT * FROM resources ORDER BY category, order_index"
            else:
                query = "SELECT * FROM resources WHERE category = ? ORDER BY order_index"
                
            cursor.execute(query, (category,) if category != 'all' else ())
            results = cursor.fetchall()
            
            if results:
                display_data = []
                for row in results:
                    display_data.append([
                        row['category'],
                        row['name'],
                        row['address'] or '',
                        row['phone'] or '',
                        row['website'] or '',
                        (row['description'] or '')[:40] + '...' if row['description'] and len(row['description']) > 40 else row['description'] or ''
                    ])
                print("\n" + tabulate(display_data,
                    headers=['Category', 'Name', 'Address', 'Phone', 'Website', 'Description'],
                    tablefmt='grid'))
            else:
                print("No resources found.")
                
        elif choice == '4':
            # View regulations
            cursor.execute("SELECT DISTINCT category FROM regulations ORDER BY category")
            categories = [row[0] for row in cursor.fetchall()]
            print(f"\nCategories: {', '.join(categories)}")
            category = input("Enter category (or 'all'): ").strip()
            
            if category == 'all':
                query = "SELECT * FROM regulations ORDER BY category, order_index"
            else:
                query = "SELECT * FROM regulations WHERE category = ? ORDER BY order_index"
                
            cursor.execute(query, (category,) if category != 'all' else ())
            results = cursor.fetchall()
            
            if results:
                for row in results:
                    print(f"\n{'='*60}")
                    print(f"Title: {row['title']}")
                    print(f"Category: {row['category']}")
                    print(f"Description: {row['description']}")
                    print(f"Effective Date: {row['effective_date']}")
                    print(f"Full Text:\n{row['full_text']}")
            else:
                print("No regulations found.")
                
        elif choice == '5':
            # Search content blocks
            search_term = input("Enter search term: ").strip()
            cursor.execute('''
                SELECT p.page_number, p.title as page_title, 
                       cb.block_type, cb.content
                FROM content_blocks cb
                JOIN pages p ON cb.page_id = p.id
                WHERE cb.content LIKE ?
                ORDER BY p.page_number, cb.order_index
            ''', (f'%{search_term}%',))
            
            results = cursor.fetchall()
            if results:
                for row in results:
                    print(f"\nPage {row['page_number']}: {row['page_title']}")
                    print(f"Type: {row['block_type']}")
                    print(f"Content: {row['content'][:200]}..." if len(row['content']) > 200 else f"Content: {row['content']}")
            else:
                print("No content found matching search term.")
                
        elif choice == '6':
            # View cross-references
            cursor.execute('''
                SELECT p1.page_number as from_page, p1.title as from_title,
                       p2.page_number as to_page, p2.title as to_title,
                       cr.reference_text
                FROM cross_references cr
                JOIN pages p1 ON cr.from_page_id = p1.id
                JOIN pages p2 ON cr.to_page_id = p2.id
                ORDER BY p1.page_number
            ''')
            
            results = cursor.fetchall()
            if results:
                display_data = []
                for row in results:
                    display_data.append([
                        f"Page {row['from_page']}",
                        row['from_title'][:30] + '...' if len(row['from_title']) > 30 else row['from_title'],
                        f"Page {row['to_page']}",
                        row['to_title'][:30] + '...' if len(row['to_title']) > 30 else row['to_title'],
                        row['reference_text'][:50] + '...' if len(row['reference_text']) > 50 else row['reference_text']
                    ])
                print("\n" + tabulate(display_data,
                    headers=['From', 'From Title', 'To', 'To Title', 'Reference'],
                    tablefmt='grid'))
            else:
                print("No cross-references found.")
                
        elif choice == '7':
            # Custom SQL query
            print("\nEnter SQL query (or 'back' to return):")
            query = input().strip()
            if query.lower() != 'back':
                try:
                    cursor.execute(query)
                    results = cursor.fetchall()
                    if results:
                        print("\n" + tabulate(results, headers=results[0].keys(), tablefmt='grid'))
                    else:
                        print("Query executed successfully. No results to display.")
                except sqlite3.Error as e:
                    print(f"SQL Error: {e}")
                    
        elif choice == '8':
            # Database statistics
            tables = ['pages', 'sections', 'contacts', 'resources', 'regulations', 
                     'content_blocks', 'images', 'cross_references']
            
            print("\nDatabase Statistics:")
            print("-"*40)
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"{table:20} {count:5} records")
                
            # Additional stats
            cursor.execute("SELECT COUNT(DISTINCT category) FROM contacts")
            contact_cats = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(DISTINCT category) FROM resources")
            resource_cats = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM pages WHERE is_finalized = 1")
            finalized = cursor.fetchone()[0]
            
            print("-"*40)
            print(f"Contact categories:  {contact_cats}")
            print(f"Resource categories: {resource_cats}")
            print(f"Finalized pages:     {finalized}")
            
        elif choice == '9':
            print("\nExiting...")
            break
            
        else:
            print("\nInvalid option. Please try again.")
    
    conn.close()

if __name__ == '__main__':
    try:
        from tabulate import tabulate
    except ImportError:
        print("Installing required package: tabulate")
        import subprocess
        subprocess.check_call(["pip3", "install", "tabulate"])
        from tabulate import tabulate
    
    query_database()