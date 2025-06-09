#!/bin/bash

# Script to create a Word template for BMPOA document styling
# This template will be used as a reference document for Pandoc conversion

echo "Creating BMPOA Word Template..."

# Create a simple HTML file with all the styles we need
cat > template-source.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BMPOA Style Template</title>
</head>
<body>
    <h1>Heading 1 - Chapter Title</h1>
    <p>This is the style for chapter titles. They should be centered, 24pt, and force a page break before.</p>
    
    <h2>Heading 2 - Section Title</h2>
    <p>This is the style for main sections. They should be 18pt, colored #1e3a5f, with space before.</p>
    
    <h3>Heading 3 - Subsection</h3>
    <p>This is the style for subsections. They should be 14pt, colored #1e3a5f.</p>
    
    <h4>Heading 4 - Minor Heading</h4>
    <p>This is the style for minor headings. They should be 12pt, bold.</p>
    
    <p>This is Normal body text. It should be 11pt, justified, with 1.5 line spacing.</p>
    
    <p class="First-Paragraph">This is the First Paragraph style, used after headings. No indent.</p>
    
    <blockquote>
        This is Block Text style for quotes and important notices. It should have a left border and background shading.
    </blockquote>
    
    <ul>
        <li>This is a bulleted list item</li>
        <li>Second bullet point</li>
    </ul>
    
    <ol>
        <li>This is a numbered list item</li>
        <li>Second numbered point</li>
    </ol>
    
    <table>
        <caption>Table Caption Style</caption>
        <thead>
            <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
            </tr>
            <tr>
                <td>Cell 4</td>
                <td>Cell 5</td>
                <td>Cell 6</td>
            </tr>
        </tbody>
    </table>
    
    <pre><code>This is Source Code style
for code blocks and technical content</code></pre>
    
    <p>This paragraph contains a <a href="#">Hyperlink</a> which should be blue and underlined.</p>
    
    <figure>
        <img src="placeholder.jpg" alt="Image">
        <figcaption>Figure Caption - Image descriptions go here</figcaption>
    </figure>
</body>
</html>
EOF

# Convert to DOCX using Pandoc
echo "Converting to DOCX..."
pandoc template-source.html -o bmpoa-template.docx \
    --reference-doc=default \
    --metadata title="BMPOA Style Template" \
    --metadata author="BMPOA" \
    --variable mainfont="Georgia" \
    --variable sansfont="Arial" \
    --variable fontsize="11pt" \
    --variable geometry="margin=1in"

echo "Template created: bmpoa-template.docx"
echo ""
echo "Next steps:"
echo "1. Open bmpoa-template.docx in Microsoft Word"
echo "2. Modify the following styles:"
echo "   - Heading 1: 24pt, Centered, Page break before, Color: #1e3a5f"
echo "   - Heading 2: 18pt, Color: #1e3a5f, 24pt space before"
echo "   - Heading 3: 14pt, Color: #1e3a5f, 18pt space before"
echo "   - Normal: 11pt Georgia, Justified, 1.5 line spacing"
echo "   - Block Text: Left border 4pt #1e3a5f, Background: #f5f5f5"
echo "   - Table: Borders, Header row shading"
echo "3. Save the modified template"
echo "4. Use it for conversion: pandoc input.html --reference-doc=bmpoa-template.docx -o output.docx"

# Create conversion script
cat > convert-to-docx.sh << 'EOF'
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
EOF

chmod +x convert-to-docx.sh

# Clean up
rm -f template-source.html

echo ""
echo "Created conversion script: convert-to-docx.sh"
echo "Usage: ./convert-to-docx.sh [input.html] [output.docx] [template.docx]"