# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The **Blue Mountain Property Owners Association (BMPOA) Guide** is a 20-page print-ready booklet for a mountain community in Warren County, Virginia. The project focuses on creating a professional, print-optimized document with strict content verification requirements.

## Key Architecture

### Content Management System
- **Single Source of Truth**: `AllowedContent-Strict/` folder contains all approved content
- **Database-Driven**: SQLite database (`bmpoa_booklet.db`) stores structured content
- **Content Verification**: All content must match approved sources exactly
- **Flagged Content Tracking**: `FLAGGED-CONTENT.md` tracks unauthorized content

### Print Optimization
- **Target**: 8.5x11" paper with 0.75" margins
- **Pagination**: Automatic overflow detection and page creation
- **Safe Zones**: 0.25" error boundaries for print margins
- **CSS Print Rules**: Specific styling for @media print

### Directory Structure
```
/AllowedContent-Strict/
  /database/              # SQLite database and Python scripts
  *.pdf                   # Source documents
  BMPOA-entities.txt      # Verified entity list
  BMPOA-Outline.md        # Official content outline

/images/                  # All booklet images
/logs/                    # Directory monitoring logs

bmpoa-print-optimized.html  # Main output file
auto-pagination.js          # Pagination system
```

## Common Commands

### Database Operations
```bash
# Query database content
cd AllowedContent-Strict/database
sqlite3 bmpoa_booklet.db "SELECT * FROM pages;"
sqlite3 bmpoa_booklet.db "SELECT * FROM content_blocks WHERE page_id = 1;"

# Run database population scripts
python3 populate_full_database.py
python3 export_reports.py
```

### Development Workflow
```bash
# Start directory monitoring
node start-directory-monitor.js

# Test pagination
node pagination-test-suite.js

# Generate print preview
open bmpoa-print-optimized.html
```

### Content Verification
```bash
# Check for flagged content
grep -n "FLAGGED" FLAGGED-CONTENT.md

# Verify image usage
rg -o 'images/[^"]+' bmpoa-print-optimized.html | sort | uniq

# Check page count
rg -c 'class="page"' bmpoa-print-optimized.html
```

## Critical Requirements

### Content Accuracy
- Only use content from `AllowedContent-Strict/` folder
- Cross-reference all facts with `BMPOA-entities.txt`
- Document any content not found in approved sources
- Maintain exact quotes from source PDFs

### Print Standards
- Test all pages for overflow using browser print preview
- Ensure images fit within safe zones
- Verify page numbers and cross-references
- Check that tables don't break across pages

### Image Guidelines
- All images must be in `/images/` folder
- Use `object-fit: cover` for consistent sizing
- Include descriptive alt text
- Wrap in `<figure>` with `<figcaption>`

## Database Schema

Key tables:
- `pages`: 20 pages with templates and finalization status
- `sections`: 8 major sections
- `content_blocks`: Text content organized by page
- `images`: Image metadata and page assignments
- `contacts`: Emergency and board contacts
- `resources`: Wineries, trails, services
- `regulations`: Community rules

## Testing Procedures

1. **Print Preview**: Always check in Chrome/Safari print preview
2. **Overflow Detection**: Run `auto-pagination.js` checks
3. **Image Verification**: Ensure all images load and display correctly
4. **Content Validation**: Cross-check against source documents
5. **Cross-References**: Verify all "see page X" references

## Current Status

- 19 of 20 pages need finalization
- All images have been placed appropriately
- Content structure matches approved outline
- Print optimization is functional but needs testing