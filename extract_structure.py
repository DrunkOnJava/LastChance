#!/usr/bin/env python3
import re
from collections import OrderedDict

def extract_structure(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Find all pages - check for both paper-page and page
    if '<div class="paper-page">' in content:
        pages = content.split('<div class="paper-page">')
    else:
        pages = content.split('<div class="page')
    
    structure = OrderedDict()
    
    for i, page in enumerate(pages[1:], 1):  # Skip first empty split
        # Extract headers
        headers = re.findall(r'<h([1-6])[^>]*>(.*?)</h\1>', page, re.DOTALL)
        
        # Clean headers
        page_content = []
        for level, header_text in headers:
            # Remove HTML tags
            clean_text = re.sub(r'<[^>]+>', '', header_text).strip()
            if clean_text and clean_text != "TABLE OF CONTENTS":
                page_content.append({
                    'level': int(level),
                    'text': clean_text
                })
        
        # Extract images
        images = re.findall(r'<img[^>]+src="([^"]+)"', page)
        
        if page_content or images:
            structure[f'Page {i}'] = {
                'headers': page_content,
                'images': images
            }
    
    return structure

def print_structure(structure):
    for page, content in structure.items():
        print(f"\n{page}:")
        for header in content['headers']:
            indent = '  ' * (header['level'] - 1)
            print(f"{indent}- {header['text']}")
        if content['images']:
            print(f"  Images: {len(content['images'])} image(s)")

# Analyze archived file
print("=== ARCHIVED FILE (5th-Attempt-With-Pictures.html) ===")
archived_structure = extract_structure('/Users/griffin/Projects/LastChance/archives/5th-Attempt-With-Pictures.html')
print_structure(archived_structure)

# Analyze current file
print("\n\n=== CURRENT FILE (bmpoa-print-optimized.html) ===")
current_structure = extract_structure('/Users/griffin/Projects/LastChance/bmpoa-print-optimized.html')
print_structure(current_structure)