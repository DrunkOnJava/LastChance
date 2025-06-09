# Pandoc HTML to DOCX Optimization Guide

## Overview
This guide provides best practices for structuring the BMPOA HTML document to ensure clean conversion to Microsoft Word (.docx) format using Pandoc.

## Key Principles for DOCX-Compatible HTML

### 1. Use Semantic HTML Elements
Pandoc maps semantic HTML elements to Word styles:
- `<h1>` → Heading 1
- `<h2>` → Heading 2
- `<h3>` → Heading 3
- `<p>` → Normal/Body Text
- `<blockquote>` → Block Text
- `<code>` → Verbatim Char
- `<pre>` → Source Code
- `<table>` → Table styles
- `<caption>` → Caption

### 2. Avoid Complex CSS
DOCX doesn't support CSS directly. Instead:
- Use semantic HTML for structure
- Apply styling through Word's reference document
- Avoid inline styles that won't transfer

### 3. Recommended HTML Structure

```html
<!-- Page breaks that convert well -->
<div style="page-break-before: always;"></div>

<!-- Headings with clear hierarchy -->
<h1>Chapter Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Paragraphs with semantic meaning -->
<p class="first-paragraph">First paragraph after heading...</p>
<p>Regular body text...</p>

<!-- Tables with simple structure -->
<table>
  <caption>Table 1: Contact Information</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Position</th>
      <th>Contact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>President</td>
      <td>(555) 123-4567</td>
    </tr>
  </tbody>
</table>

<!-- Lists -->
<ul>
  <li>Bullet point</li>
</ul>

<ol>
  <li>Numbered item</li>
</ol>

<!-- Images with captions -->
<figure>
  <img src="image.jpg" alt="Description">
  <figcaption>Figure 1: Image caption</figcaption>
</figure>
```

## Conversion Command

```bash
# Basic conversion
pandoc bmpoa-print-optimized.html -o bmpoa-document.docx

# With reference document for styling
pandoc bmpoa-print-optimized.html --reference-doc=bmpoa-template.docx -o bmpoa-document.docx

# With metadata
pandoc bmpoa-print-optimized.html \
  --metadata title="Blue Mountain Property Owners Association Guide" \
  --metadata author="BMPOA Board" \
  --metadata date="2025" \
  --reference-doc=bmpoa-template.docx \
  -o bmpoa-document.docx
```

## Creating a Reference Document

1. Generate initial DOCX:
   ```bash
   pandoc sample.html -o template.docx
   ```

2. Open template.docx in Word and modify styles:
   - Heading 1-3: Font, size, color, spacing
   - Normal: Body text formatting
   - Table styles: Borders, shading
   - Page setup: Margins, size, orientation

3. Save as your reference template

## HTML Elements to Avoid/Replace

### Avoid:
- Complex div layouts
- CSS Grid/Flexbox
- Absolute positioning
- Custom web fonts
- JavaScript-dependent content
- Complex nested structures

### Replace With:
- Simple semantic elements
- Basic tables for layout if needed
- Linear document flow
- Standard fonts
- Static content
- Clear hierarchy

## Specific Optimizations for BMPOA Document

### 1. Contact Cards
```html
<!-- Instead of complex grid -->
<div class="contact-grid">...</div>

<!-- Use simple table -->
<table class="contacts">
  <tr>
    <td>
      <strong>John Doe - President</strong><br>
      Phone: (555) 123-4567<br>
      Email: president@bmpoa.org
    </td>
    <td>
      <strong>Jane Smith - Vice President</strong><br>
      Phone: (555) 234-5678<br>
      Email: vicepresident@bmpoa.org
    </td>
  </tr>
</table>
```

### 2. Alert Boxes
```html
<!-- Instead of styled div -->
<div class="alert-box critical">...</div>

<!-- Use blockquote with strong -->
<blockquote>
  <strong>⚠️ EMERGENCY: Call 911</strong><br>
  For all life-threatening emergencies
</blockquote>
```

### 3. Page Headers/Footers
```html
<!-- Add metadata for headers/footers -->
<meta name="header-left" content="BMPOA Guide">
<meta name="header-right" content="2025">
<meta name="footer-center" content="Page $page$ of $total$">
```

## Testing Checklist

- [ ] Generate DOCX and check formatting
- [ ] Verify all headings converted properly
- [ ] Check table formatting
- [ ] Ensure images are embedded
- [ ] Test page breaks
- [ ] Verify lists format correctly
- [ ] Check hyperlinks work
- [ ] Review overall document flow

## Common Issues and Solutions

### Issue: Tables breaking across pages
**Solution**: Add `keep-together` class and use simpler tables

### Issue: Images not embedding
**Solution**: Use relative paths and ensure images are accessible

### Issue: Formatting lost
**Solution**: Use reference document with proper styles

### Issue: Page breaks not working
**Solution**: Use explicit page-break divs

## Next Steps

1. Refactor HTML to use more semantic elements
2. Create a Word template with BMPOA branding
3. Test conversion with sample content
4. Iterate based on output quality