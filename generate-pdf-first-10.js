const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('Starting PDF generation for first 10 pages...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport to letter size
        await page.setViewport({
            width: 816,  // 8.5 inches at 96 DPI
            height: 1056 // 11 inches at 96 DPI
        });
        
        // Load the HTML file
        const htmlPath = `file://${path.resolve(__dirname, 'bmpoa-print-optimized.html')}`;
        console.log('Loading HTML from:', htmlPath);
        await page.goto(htmlPath, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        // Wait for page to fully render
        await page.waitForTimeout(2000);
        
        // Apply all enhancements
        await page.evaluate(() => {
            // Apply professional design
            if (typeof professionalComponents !== 'undefined') {
                professionalComponents.applyAllEnhancements();
            }
        });
        
        await page.waitForTimeout(1000);
        
        // Apply final touches
        await page.evaluate(() => {
            if (typeof finalTouches !== 'undefined') {
                finalTouches.applyFinalTouches();
                finalTouches.prepareForPDF();
            }
        });
        
        await page.waitForTimeout(1000);
        
        // Hide pages after the first 10
        await page.evaluate(() => {
            const pages = document.querySelectorAll('.page');
            pages.forEach((page, index) => {
                if (index >= 10) {
                    page.style.display = 'none';
                }
            });
            
            // Add PDF export mode
            document.body.classList.add('pdf-export-mode');
            
            // Hide all control buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => btn.style.display = 'none');
        });
        
        // Generate PDF
        const pdfPath = path.join(__dirname, 'BMPOA-Guide-First-10-Pages.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'Letter',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            displayHeaderFooter: false,
            scale: 1
        });
        
        console.log(`✅ PDF generated successfully: ${pdfPath}`);
        console.log(`File size: ${(fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2)} MB`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        await browser.close();
    }
}

// Run the PDF generation
generatePDF();