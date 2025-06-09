# FLAGGED CONTENT - Items Not Found in AllowedContent-Strict

This document tracks any content that appears in project files but was NOT sourced from the AllowedContent-Strict folder, which is the single source of truth for the BMPOA booklet.

## Overview

The AllowedContent-Strict folder contains:
- BMPOA-Outline.md - Comprehensive outline for 2025 edition
- BMPOA-entities.txt - Complete entity extraction report
- PDF files: Guide1, Emergency Evacuation, bluemountemail1, bluemountemail2
- Consolidated content files (.md, .txt, .json)
- Database folder with schema, scripts, and exports

## Authorized Content Summary

### 1. Governance & Leadership
- **Board Officers (2023-2025)**: Jim Critcher (President), Harry Davis (1st VP), Jonathan Morrison (2nd VP), Mike Veasey (Financial Secretary), Patrick Patton (Secretary)
- **Directors**: David Cook, Carl Herz, Garrett McNamara, Erica Santana
- **Committee Chairs**: Multiple committees with designated chairs and members

### 2. Contact Information
- **Emergency**: Warren County 911, Fire Stations #1 & #5, REC Power, DWR Wildlife
- **Email Contacts**: 
  - mll2294@me.com (Mackenzie Williams - Social Committee)
  - jcook0313@gmail.com (J Cook - Wood Chipping)
  - bluemountainlodgebooking@gmail.com (Lodge Booking)
  - bmpoadeerlake@gmail.com (Deer Lake Passes)
  - bmpoaroads@gmail.com (Roads Committee)

### 3. Key Locations
- **Blue Mountain Lodge**: 540 Cliff Road, Linden, VA 22642
- **BMPOA Mailing**: P.O. Box 114, Linden, VA 22642
- **Wineries**: Fox Meadow (3310 Freezeland Rd), Capstone (13400 Crimson Ln), Crimson Lane (13334 Crimson Ln)

### 4. Important Dates
- **Annual Meeting**: August 17, 2025
- **Board Meetings**: Second Monday of each month, 6 PM EST
- **Burning Law**: 4 PM - Midnight (though BMPOA prohibits all open burning)

## FLAGGED CONTENT

### From 5th-Attempt-With-Pictures.html

1. **Kelly Jo Russell** - Listed as Social Committee Chair with phone 540-955-4721 and email kjrussell.3@hotmail.com
   - ❌ NOT FOUND in AllowedContent-Strict
   - ✅ Mackenzie Williams is the authorized Social Committee Chair per BMPOA-entities.txt

2. **Monthly Event Details** not in source material:
   - ❌ First Friday Potluck
   - ❌ Book Club (Third Tuesday)
   - ❌ Ladies' Lunch (Second Wednesday)
   - ❌ Men's Breakfast (Last Saturday)
   - ❌ Youth Activities

3. **Special Interest Groups** not in source material:
   - ❌ Photography Club
   - ❌ Gardening Circle
   - ❌ Hiking Group (weekly)
   - ❌ Craft Circle
   - ❌ Game Night

4. **Specific Event Details** not authorized:
   - ❌ Easter Egg Hunt
   - ❌ Mother's Day Brunch
   - ❌ Father's Day BBQ
   - ❌ Outdoor Movie Nights
   - ❌ Summer Concert Series
   - ❌ Holiday Cookie Exchange
   - ❌ New Year's Day Brunch
   - ❌ Valentine's Day Dinner

5. **Meeting Times** not in source:
   - ❌ Social Committee meets "second Thursday of each month at 7:00 PM"

### From consolidated_files LaTeX content

1. **Native Plant Sources** partially verified:
   - ✅ Seven Bends Nursery - Berryville (mentioned in BMPOA-Outline.md)
   - ✅ Yellow House Natives - Berryville (mentioned)
   - ❌ Specific deer-resistant plant lists with Latin names (while native plants are mentioned, the extensive lists are not in source)

2. **Trail Details** not fully verified:
   - ✅ Blue Mountain Trailhead GPS coordinates mentioned
   - ❌ Specific trail distances and elevation gains
   - ❌ Detailed trail descriptions beyond basic mentions

## Database Structure (Verified)

The database schema in AllowedContent-Strict/database/schema.sql defines:
- **Pages**: Booklet structure with component names
- **Sections**: Major booklet divisions
- **Content Blocks**: Actual text with formatting metadata
- **Contacts**: Emergency, board, community, service contacts
- **Resources**: Wineries, hiking, services, attractions
- **Images**: Asset management with alt text and captions
- **Regulations**: Construction, fire safety, community rules
- **Cross References**: Page-to-page links
- **Version Tracking**: Content change history

## Images Available (Verified)

From root directory:
- bmpoa-emblem.png (383x400)
- debris-fire.png (940x788) 
- warren-county-waste-map.png (1968x1872)
- Lodge photos: TheLodge.jpg, TheLodgeEntrance.jpg, TheLodgeOverlook.jpg
- Nature: deer-lake-dock.jpeg, trillium-bloom-at-thompson-wma-in-virginia.jpeg, virginia-bluebells.jpeg
- Wineries: winery-1.jpeg, winery-3.jpeg, winery-interior.jpeg
- Other: VA-Flag.jpeg, OverlookatVineyard.png

## Recommendations

1. **Replace Kelly Jo Russell** with Mackenzie Williams as Social Committee Chair
2. **Remove all unauthorized events** unless they can be verified from source PDFs
3. **Simplify plant lists** to only those explicitly mentioned in BMPOA-Outline.md
4. **Verify trail information** against source materials only
5. **Use only contact information** from BMPOA-entities.txt

## Next Steps

All content in the final booklet must be traceable to:
- BMPOA-Outline.md (primary source)
- BMPOA-entities.txt (verified contacts/entities)
- PDF content (when readable)
- Database exports (for structured data)

Any content not verifiable from these sources should be removed or clearly marked as requiring verification.