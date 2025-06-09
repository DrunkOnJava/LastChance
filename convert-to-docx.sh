#!/bin/bash

# BMPOA HTML to DOCX Conversion Script

INPUT_FILE="${1:-bmpoa-print-optimized.html}"
OUTPUT_FILE="${2:-bmpoa-document.docx}"
TEMPLATE="${3:-bmpoa-template.docx}"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found"
    exit 1
fi

echo "Converting $INPUT_FILE to $OUTPUT_FILE..."

# Run optimization first if script exists
if [ -f "optimize-for-docx.js" ]; then
    echo "Note: Run optimize-for-docx.js in the browser first for best results"
fi

# Convert with Pandoc
pandoc "$INPUT_FILE" \
    --from=html \
    --to=docx \
    --reference-doc="$TEMPLATE" \
    --metadata title="Blue Mountain Property Owners Association Community Guide" \
    --metadata author="BMPOA Board of Directors" \
    --metadata date="2025" \
    --metadata subject="Community Guide and Regulations" \
    --toc \
    --toc-depth=3 \
    -o "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "Success! Created $OUTPUT_FILE"
    echo ""
    echo "Post-conversion checklist:"
    echo "- [ ] Check page breaks are correct"
    echo "- [ ] Verify table formatting"
    echo "- [ ] Ensure images are embedded"
    echo "- [ ] Review heading styles"
    echo "- [ ] Check hyperlinks work"
    echo "- [ ] Verify page numbers in TOC"
else
    echo "Error: Conversion failed"
    exit 1
fi
