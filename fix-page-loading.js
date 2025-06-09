/**
 * Fix Page Loading Issues
 * Ensure all content loads properly before applying enhancements
 */

function fixPageLoading() {
    console.log('Fixing page loading issues...');
    
    // Wait for all images to load
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    const totalImages = images.length;
    
    function checkImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            applyEnhancementsSequentially();
        }
    }
    
    if (totalImages === 0) {
        applyEnhancementsSequentially();
    } else {
        images.forEach(img => {
            if (img.complete) {
                checkImagesLoaded();
            } else {
                img.onload = checkImagesLoaded;
                img.onerror = checkImagesLoaded;
            }
        });
    }
}

function applyEnhancementsSequentially() {
    console.log('Applying enhancements sequentially...');
    
    // Step 1: Apply professional components
    setTimeout(() => {
        if (typeof professionalComponents !== 'undefined') {
            try {
                professionalComponents.applyAllEnhancements();
                console.log('✅ Professional components applied');
            } catch (e) {
                console.warn('Professional components error:', e);
            }
        }
        
        // Step 2: Apply final touches after a delay
        setTimeout(() => {
            if (typeof finalTouches !== 'undefined') {
                try {
                    finalTouches.applyFinalTouches();
                    console.log('✅ Final touches applied');
                } catch (e) {
                    console.warn('Final touches error:', e);
                }
            }
            
            // Step 3: Prepare for PDF
            setTimeout(() => {
                preparePDFView();
            }, 1000);
        }, 2000);
    }, 1000);
}

function preparePDFView() {
    console.log('Preparing PDF view...');
    
    // Hide pages after 10
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        if (index >= 10) {
            page.style.display = 'none';
        } else {
            // Ensure first 10 pages are visible
            page.style.display = 'block';
            page.style.pageBreakAfter = 'always';
            page.style.breakAfter = 'page';
        }
    });
    
    // Remove any existing PDF instructions
    const existingInstructions = document.getElementById('pdf-instructions');
    if (existingInstructions) {
        existingInstructions.remove();
    }
    
    // Hide control buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (!btn.id || btn.id !== 'pdf-ready-btn') {
            btn.style.display = 'none';
        }
    });
    
    // Add PDF ready indicator
    const readyIndicator = document.createElement('div');
    readyIndicator.id = 'pdf-ready-indicator';
    readyIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: 600;
        z-index: 10000;
        font-family: 'Montserrat', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    readyIndicator.innerHTML = '✅ PDF Ready - Press Cmd+P';
    
    // Add click handler to open print dialog
    readyIndicator.style.cursor = 'pointer';
    readyIndicator.onclick = () => {
        window.print();
    };
    
    document.body.appendChild(readyIndicator);
    
    // Apply PDF export class
    document.body.classList.add('pdf-export-mode');
    
    console.log('✅ PDF view prepared - First 10 pages ready');
    console.log('📄 Click the green indicator or press Cmd+P to print');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixPageLoading);
} else {
    fixPageLoading();
}