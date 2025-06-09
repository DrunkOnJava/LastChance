/**
 * Advanced Print Preview Testing System
 * Ensures perfect alignment between screen and print output
 */

class PrintPreviewTester {
    constructor() {
        this.testResults = [];
        this.printMetrics = {
            dpi: 96, // Standard screen DPI
            printDpi: 300, // Standard print DPI
            pageWidthIn: 8.5,
            pageHeightIn: 11,
            marginTopIn: 0.75,
            marginBottomIn: 0.75,
            marginLeftIn: 0.75,
            marginRightIn: 0.75
        };
        
        this.init();
    }

    init() {
        this.createTestUI();
        this.setupPrintListeners();
        this.detectPrintCapabilities();
    }

    createTestUI() {
        const testPanel = document.createElement('div');
        testPanel.id = 'print-test-panel';
        testPanel.className = 'print-test-panel';
        testPanel.innerHTML = `
            <div class="test-panel-header">
                <h3>Print Preview Testing</h3>
                <button onclick="printTester.runAllTests()" class="test-btn primary">Run All Tests</button>
            </div>
            
            <div class="test-section">
                <h4>Print Alignment Tests</h4>
                <button onclick="printTester.generateAlignmentTestPage()">Generate Alignment Test</button>
                <button onclick="printTester.generateMarginTestPage()">Generate Margin Test</button>
                <button onclick="printTester.generateGridTestPage()">Generate Grid Test</button>
                <button onclick="printTester.generateColorTestPage()">Generate Color Test</button>
            </div>
            
            <div class="test-section">
                <h4>Content Tests</h4>
                <button onclick="printTester.generateTextFlowTest()">Text Flow Test</button>
                <button onclick="printTester.generateTableTest()">Table Break Test</button>
                <button onclick="printTester.generateImageTest()">Image Placement Test</button>
                <button onclick="printTester.generateOverflowTest()">Overflow Detection Test</button>
            </div>
            
            <div class="test-section">
                <h4>Measurement Tools</h4>
                <button onclick="printTester.showRuler()">Show Print Ruler</button>
                <button onclick="printTester.calibratePrint()">Calibrate Print Settings</button>
                <button onclick="printTester.measurePrintArea()">Measure Print Area</button>
            </div>
            
            <div class="test-section">
                <h4>CUPS Integration</h4>
                <button onclick="printTester.checkCUPSStatus()">Check CUPS Status</button>
                <button onclick="printTester.getPrinterInfo()">Get Printer Info</button>
                <button onclick="printTester.testPrintJob()">Send Test Print</button>
            </div>
            
            <div class="test-results" id="print-test-results">
                <h4>Test Results</h4>
                <div id="print-test-output"></div>
            </div>
        `;
        
        document.body.appendChild(testPanel);
        this.addTestStyles();
    }

    addTestStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .print-test-panel {
                position: fixed;
                right: 320px;
                top: 50%;
                transform: translateY(-50%);
                width: 300px;
                max-height: 80vh;
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 9998;
                overflow-y: auto;
            }
            
            .test-panel-header {
                background: #2c3e50;
                color: white;
                padding: 15px;
                position: sticky;
                top: 0;
                z-index: 10;
            }
            
            .test-section {
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .test-section h4 {
                margin: 0 0 10px 0;
                color: #333;
            }
            
            .test-section button {
                display: block;
                width: 100%;
                padding: 8px;
                margin-bottom: 5px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .test-section button:hover {
                background: #e8e8e8;
            }
            
            .test-btn.primary {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .print-ruler {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9997;
                display: none;
            }
            
            .print-ruler.active {
                display: block;
            }
            
            .ruler-h {
                position: absolute;
                top: 0;
                left: 0;
                width: 8.5in;
                height: 20px;
                background: rgba(255, 0, 0, 0.3);
                border-right: 2px solid red;
            }
            
            .ruler-v {
                position: absolute;
                top: 0;
                left: 0;
                width: 20px;
                height: 11in;
                background: rgba(255, 0, 0, 0.3);
                border-bottom: 2px solid red;
            }
            
            .ruler-marks {
                position: absolute;
                font-size: 10px;
                color: red;
                font-weight: bold;
            }
            
            @media print {
                .print-test-panel,
                .print-ruler {
                    display: none !important;
                }
            }
            
            /* Test Page Styles */
            .test-page {
                width: 8.5in;
                height: 11in;
                margin: 0 auto 0.5in auto;
                background: white;
                position: relative;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                page-break-after: always;
            }
            
            .test-page-content {
                position: absolute;
                top: 0.75in;
                left: 0.75in;
                right: 0.75in;
                bottom: 0.75in;
                border: 1px solid #000;
            }
            
            .alignment-marks {
                position: absolute;
                width: 0.25in;
                height: 0.25in;
            }
            
            .alignment-marks.top-left {
                top: 0;
                left: 0;
                border-top: 2px solid black;
                border-left: 2px solid black;
            }
            
            .alignment-marks.top-right {
                top: 0;
                right: 0;
                border-top: 2px solid black;
                border-right: 2px solid black;
            }
            
            .alignment-marks.bottom-left {
                bottom: 0;
                left: 0;
                border-bottom: 2px solid black;
                border-left: 2px solid black;
            }
            
            .alignment-marks.bottom-right {
                bottom: 0;
                right: 0;
                border-bottom: 2px solid black;
                border-right: 2px solid black;
            }
            
            .print-grid {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                    repeating-linear-gradient(0deg, #ccc, #ccc 1px, transparent 1px, transparent 0.25in),
                    repeating-linear-gradient(90deg, #ccc, #ccc 1px, transparent 1px, transparent 0.25in);
            }
            
            .print-info {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                font-family: monospace;
            }
        `;
        document.head.appendChild(style);
    }

    // Test Page Generators

    generateAlignmentTestPage() {
        const testPage = document.createElement('div');
        testPage.className = 'test-page';
        testPage.innerHTML = `
            <div class="alignment-marks top-left"></div>
            <div class="alignment-marks top-right"></div>
            <div class="alignment-marks bottom-left"></div>
            <div class="alignment-marks bottom-right"></div>
            
            <div class="test-page-content">
                <h2 style="text-align: center; margin-top: 0;">Print Alignment Test Page</h2>
                <p style="text-align: center;">Generated: ${new Date().toLocaleString()}</p>
                
                <div style="position: absolute; top: 0; left: 0; font-size: 8pt;">
                    TOP LEFT (0, 0)
                </div>
                <div style="position: absolute; top: 0; right: 0; font-size: 8pt; text-align: right;">
                    TOP RIGHT (7", 0)
                </div>
                <div style="position: absolute; bottom: 0; left: 0; font-size: 8pt;">
                    BOTTOM LEFT (0, 9.5")
                </div>
                <div style="position: absolute; bottom: 0; right: 0; font-size: 8pt; text-align: right;">
                    BOTTOM RIGHT (7", 9.5")
                </div>
                
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    <div style="text-align: center;">
                        <h3>Center Point</h3>
                        <p>3.5" × 4.75"</p>
                        <p>Page Size: 8.5" × 11"</p>
                        <p>Margins: 0.75" all sides</p>
                        <p>Content Area: 7" × 9.5"</p>
                    </div>
                </div>
                
                <!-- Measurement rulers -->
                <div style="position: absolute; top: 1in; left: 0; right: 0; border-top: 1px solid red;">
                    <span style="position: absolute; left: -30px; top: -10px; font-size: 8pt; color: red;">1"</span>
                </div>
                <div style="position: absolute; top: 2in; left: 0; right: 0; border-top: 1px solid red;">
                    <span style="position: absolute; left: -30px; top: -10px; font-size: 8pt; color: red;">2"</span>
                </div>
                <div style="position: absolute; left: 1in; top: 0; bottom: 0; border-left: 1px solid blue;">
                    <span style="position: absolute; top: -20px; left: -10px; font-size: 8pt; color: blue;">1"</span>
                </div>
                <div style="position: absolute; left: 2in; top: 0; bottom: 0; border-left: 1px solid blue;">
                    <span style="position: absolute; top: -20px; left: -10px; font-size: 8pt; color: blue;">2"</span>
                </div>
            </div>
        `;
        
        this.appendTestPage(testPage);
        this.logResult('Generated alignment test page');
    }

    generateMarginTestPage() {
        const testPage = document.createElement('div');
        testPage.className = 'test-page';
        testPage.innerHTML = `
            <div class="test-page-content" style="border: 2px solid black;">
                <h2 style="text-align: center;">Margin Test Page</h2>
                <p style="text-align: center;">All text should be within the black border</p>
                
                <!-- Margin indicators -->
                <div style="position: absolute; top: -0.75in; left: 0; right: 0; height: 0.75in; background: rgba(255,0,0,0.2);">
                    <span style="position: absolute; bottom: 5px; left: 5px; font-size: 10pt;">Top Margin: 0.75"</span>
                </div>
                <div style="position: absolute; bottom: -0.75in; left: 0; right: 0; height: 0.75in; background: rgba(255,0,0,0.2);">
                    <span style="position: absolute; top: 5px; left: 5px; font-size: 10pt;">Bottom Margin: 0.75"</span>
                </div>
                <div style="position: absolute; left: -0.75in; top: 0; bottom: 0; width: 0.75in; background: rgba(0,0,255,0.2);">
                    <span style="position: absolute; top: 50%; right: 5px; transform: rotate(-90deg); font-size: 10pt;">Left: 0.75"</span>
                </div>
                <div style="position: absolute; right: -0.75in; top: 0; bottom: 0; width: 0.75in; background: rgba(0,0,255,0.2);">
                    <span style="position: absolute; top: 50%; left: 5px; transform: rotate(90deg); font-size: 10pt;">Right: 0.75"</span>
                </div>
                
                <!-- Content to test margins -->
                <div style="margin-top: 1in;">
                    <p>This text should not extend into the margin areas (shaded in color).</p>
                    <p>The black border represents the exact edge of the content area.</p>
                    <p>If any text appears outside the black border when printed, margins need adjustment.</p>
                    
                    <div style="border: 1px dashed #666; padding: 10px; margin: 20px 0;">
                        <h4>Margin Verification Checklist:</h4>
                        <ul>
                            <li>☐ All text is within the black border</li>
                            <li>☐ No content appears in shaded margin areas</li>
                            <li>☐ Page corners align with alignment marks</li>
                            <li>☐ Measured margins match specified 0.75"</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        this.appendTestPage(testPage);
        this.logResult('Generated margin test page');
    }

    generateGridTestPage() {
        const testPage = document.createElement('div');
        testPage.className = 'test-page';
        testPage.innerHTML = `
            <div class="test-page-content">
                <div class="print-grid"></div>
                <h2 style="text-align: center; position: relative; z-index: 1; background: white; display: inline-block; padding: 0 20px; margin: 0 auto;">Grid Alignment Test</h2>
                
                <div style="position: relative; z-index: 1; background: white; padding: 20px; margin: 20px;">
                    <h4>Grid Information:</h4>
                    <ul>
                        <li>Grid squares: 0.25" × 0.25" (quarter inch)</li>
                        <li>Total grid: 28 × 38 squares</li>
                        <li>Content area: 7" × 9.5"</li>
                    </ul>
                    
                    <p>Use this grid to verify:</p>
                    <ol>
                        <li>Print scaling is correct (measure grid squares)</li>
                        <li>No distortion in horizontal or vertical directions</li>
                        <li>Consistent spacing across entire page</li>
                    </ol>
                    
                    <div style="margin-top: 20px; padding: 10px; border: 2px solid black;">
                        <p style="margin: 0; text-align: center;">
                            <strong>1 inch square</strong><br>
                            (Should measure exactly 1" × 1" when printed)
                        </p>
                        <div style="width: 1in; height: 1in; border: 2px solid red; margin: 10px auto;"></div>
                    </div>
                </div>
                
                <!-- Corner markers -->
                <div style="position: absolute; top: 0; left: 0; width: 1in; height: 1in; border-right: 1px solid red; border-bottom: 1px solid red;">
                    <span style="position: absolute; bottom: 5px; right: 5px; font-size: 8pt;">1"×1"</span>
                </div>
            </div>
        `;
        
        this.appendTestPage(testPage);
        this.logResult('Generated grid test page');
    }

    generateColorTestPage() {
        const testPage = document.createElement('div');
        testPage.className = 'test-page';
        testPage.innerHTML = `
            <div class="test-page-content">
                <h2 style="text-align: center;">Color & Print Quality Test</h2>
                
                <div style="margin: 20px;">
                    <h4>Color Accuracy Test</h4>
                    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                        <div style="text-align: center;">
                            <div style="width: 1in; height: 1in; background: #FF0000; border: 1px solid black;"></div>
                            <p>Red<br>#FF0000</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="width: 1in; height: 1in; background: #00FF00; border: 1px solid black;"></div>
                            <p>Green<br>#00FF00</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="width: 1in; height: 1in; background: #0000FF; border: 1px solid black;"></div>
                            <p>Blue<br>#0000FF</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="width: 1in; height: 1in; background: #000000; border: 1px solid #ccc;"></div>
                            <p>Black<br>#000000</p>
                        </div>
                    </div>
                    
                    <h4>Grayscale Test</h4>
                    <div style="display: flex; margin: 20px 0;">
                        ${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(percent => `
                            <div style="flex: 1; height: 0.5in; background: hsl(0, 0%, ${percent}%); border-right: 1px solid white;">
                                <span style="font-size: 8pt; color: ${percent > 50 ? 'black' : 'white'};">${percent}%</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h4>Line Quality Test</h4>
                    <div style="margin: 20px 0;">
                        <p>1px lines (should be sharp and consistent):</p>
                        <div style="border-top: 1px solid black; margin: 5px 0;"></div>
                        <div style="border-top: 1px dashed black; margin: 5px 0;"></div>
                        <div style="border-top: 1px dotted black; margin: 5px 0;"></div>
                    </div>
                    
                    <h4>Text Quality Test</h4>
                    <div style="margin: 20px 0;">
                        <p style="font-size: 6pt;">6pt: The quick brown fox jumps over the lazy dog. 1234567890</p>
                        <p style="font-size: 8pt;">8pt: The quick brown fox jumps over the lazy dog. 1234567890</p>
                        <p style="font-size: 10pt;">10pt: The quick brown fox jumps over the lazy dog. 1234567890</p>
                        <p style="font-size: 12pt;">12pt: The quick brown fox jumps over the lazy dog. 1234567890</p>
                    </div>
                </div>
            </div>
        `;
        
        this.appendTestPage(testPage);
        this.logResult('Generated color test page');
    }

    generateTextFlowTest() {
        const testPage = document.createElement('div');
        testPage.className = 'test-page';
        
        let content = `
            <div class="test-page-content">
                <h2>Text Flow & Pagination Test</h2>
                <p>This page tests how text flows across page boundaries and whether widow/orphan control is working correctly.</p>
        `;
        
        // Generate enough content to force pagination
        for (let i = 1; i <= 20; i++) {
            content += `
                <h3>Section ${i}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            `;
        }
        
        content += `</div>`;
        testPage.innerHTML = content;
        
        this.appendTestPage(testPage);
        this.logResult('Generated text flow test page');
    }

    // Print Measurement Tools

    showRuler() {
        let ruler = document.querySelector('.print-ruler');
        if (!ruler) {
            ruler = document.createElement('div');
            ruler.className = 'print-ruler';
            ruler.innerHTML = `
                <div class="ruler-h">
                    <div class="ruler-marks" style="top: 22px;">
                        ${Array.from({length: 9}, (_, i) => 
                            `<span style="position: absolute; left: ${i}in;">${i}"</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="ruler-v">
                    <div class="ruler-marks" style="left: 22px;">
                        ${Array.from({length: 12}, (_, i) => 
                            `<span style="position: absolute; top: ${i}in;">${i}"</span>`
                        ).join('')}
                    </div>
                </div>
            `;
            document.body.appendChild(ruler);
        }
        
        ruler.classList.toggle('active');
        this.logResult(`Ruler ${ruler.classList.contains('active') ? 'shown' : 'hidden'}`);
    }

    calibratePrint() {
        const calibrationPage = document.createElement('div');
        calibrationPage.className = 'test-page';
        calibrationPage.innerHTML = `
            <div class="test-page-content">
                <h2 style="text-align: center;">Print Calibration Page</h2>
                
                <div style="margin: 40px;">
                    <h3>Instructions:</h3>
                    <ol>
                        <li>Print this page at 100% scale (no fit to page)</li>
                        <li>Measure the squares below with a ruler</li>
                        <li>Enter measurements to calibrate</li>
                    </ol>
                    
                    <div style="margin: 40px 0;">
                        <h4>1 Inch Calibration Square</h4>
                        <div style="width: 1in; height: 1in; border: 2px solid black; position: relative;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                1" × 1"
                            </div>
                        </div>
                        <p>Measured: <input type="text" id="measured-1in" placeholder="Enter measurement"> inches</p>
                    </div>
                    
                    <div style="margin: 40px 0;">
                        <h4>2 Inch Calibration Square</h4>
                        <div style="width: 2in; height: 2in; border: 2px solid black; position: relative;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                2" × 2"
                            </div>
                        </div>
                        <p>Measured: <input type="text" id="measured-2in" placeholder="Enter measurement"> inches</p>
                    </div>
                    
                    <button onclick="printTester.calculateCalibration()" style="padding: 10px 20px;">Calculate Calibration</button>
                </div>
            </div>
        `;
        
        this.appendTestPage(calibrationPage);
        this.logResult('Generated calibration page');
    }

    calculateCalibration() {
        const measured1 = parseFloat(document.getElementById('measured-1in').value);
        const measured2 = parseFloat(document.getElementById('measured-2in').value);
        
        if (measured1 && measured2) {
            const scale1 = measured1 / 1;
            const scale2 = measured2 / 2;
            const avgScale = (scale1 + scale2) / 2;
            
            this.logResult(`Calibration results:
                1" square measured: ${measured1}" (scale: ${scale1.toFixed(3)})
                2" square measured: ${measured2}" (scale: ${scale2.toFixed(3)})
                Average scale factor: ${avgScale.toFixed(3)}
                ${avgScale < 0.99 || avgScale > 1.01 ? 'Adjustment needed!' : 'Print scaling is accurate!'}`);
            
            if (avgScale < 0.99 || avgScale > 1.01) {
                const adjustment = (1 / avgScale * 100).toFixed(1);
                this.logResult(`Set print scale to ${adjustment}% to correct`);
            }
        }
    }

    // CUPS Integration

    async checkCUPSStatus() {
        // Check if we're on macOS and can use CUPS
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        
        if (isMac) {
            // Since we can't directly execute shell commands from browser,
            // we'll provide instructions for manual checking
            this.logResult(`CUPS Status Check Instructions:
                1. Open Terminal
                2. Run: lpstat -t
                3. Check printer status
                4. Run: lpoptions -l
                5. Review print options`);
            
            // Provide a test command for the user
            const testCommand = `
                # CUPS Print Test Commands:
                # List printers:
                lpstat -p -d
                
                # Print test page:
                lp -d [printer-name] /System/Library/Frameworks/ApplicationServices.framework/Versions/A/Frameworks/PrintCore.framework/Versions/A/Resources/TestPage.pdf
                
                # Check print queue:
                lpq
                
                # Print with specific options:
                lp -d [printer-name] -o media=Letter -o sides=one-sided -o print-quality=high [file]
            `;
            
            this.logResult('CUPS commands:\n' + testCommand);
        } else {
            this.logResult('CUPS testing is available on macOS/Linux systems');
        }
    }

    async getPrinterInfo() {
        // Get browser print info
        if (window.matchMedia) {
            const printInfo = {
                colorMode: window.matchMedia('print and (color)').matches ? 'color' : 'monochrome',
                orientation: window.matchMedia('print and (orientation: portrait)').matches ? 'portrait' : 'landscape',
                resolution: window.devicePixelRatio || 1
            };
            
            this.logResult(`Browser Print Info:
                Color Mode: ${printInfo.colorMode}
                Orientation: ${printInfo.orientation}
                Device Pixel Ratio: ${printInfo.resolution}`);
        }
        
        // For actual printer info, provide CUPS commands
        this.logResult(`To get detailed printer info, run:
            lpstat -v  # Show printer devices
            lpoptions -p [printer-name] -l  # Show printer options`);
    }

    async testPrintJob() {
        // Generate a comprehensive test print
        const testContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Print Test Job</title>
                <style>
                    @page {
                        size: letter;
                        margin: 0.75in;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .page {
                        width: 7in;
                        height: 9.5in;
                        border: 1px solid black;
                        padding: 0.25in;
                        page-break-after: always;
                    }
                    .test-info {
                        background: #f0f0f0;
                        padding: 10px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="page">
                    <h1>Print Test Job</h1>
                    <div class="test-info">
                        <p>Date: ${new Date().toLocaleString()}</p>
                        <p>Browser: ${navigator.userAgent}</p>
                        <p>Page Size: 8.5" × 11" (US Letter)</p>
                        <p>Margins: 0.75" all sides</p>
                    </div>
                    
                    <h2>Alignment Test</h2>
                    <div style="border: 2px solid black; height: 1in; position: relative;">
                        <div style="position: absolute; top: 0; left: 0;">TL</div>
                        <div style="position: absolute; top: 0; right: 0;">TR</div>
                        <div style="position: absolute; bottom: 0; left: 0;">BL</div>
                        <div style="position: absolute; bottom: 0; right: 0;">BR</div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">CENTER</div>
                    </div>
                    
                    <h2>Margin Test</h2>
                    <p style="margin: 0;">This text should be at least 0.75" from all page edges.</p>
                    
                    <h2>Color Test</h2>
                    <div style="display: flex; gap: 10px;">
                        <div style="width: 50px; height: 50px; background: red;"></div>
                        <div style="width: 50px; height: 50px; background: green;"></div>
                        <div style="width: 50px; height: 50px; background: blue;"></div>
                        <div style="width: 50px; height: 50px; background: black;"></div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(testContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print();
            setTimeout(() => printWindow.close(), 1000);
        };
        
        this.logResult('Test print job sent to printer');
    }

    // Print Event Listeners

    setupPrintListeners() {
        window.addEventListener('beforeprint', () => {
            this.logResult('Print dialog opened - validating layout...');
            this.validatePrintLayout();
        });
        
        window.addEventListener('afterprint', () => {
            this.logResult('Print dialog closed');
        });
        
        // Media query listener for print mode
        if (window.matchMedia) {
            const printMedia = window.matchMedia('print');
            printMedia.addListener((mql) => {
                if (mql.matches) {
                    this.logResult('Entered print mode');
                } else {
                    this.logResult('Exited print mode');
                }
            });
        }
    }

    validatePrintLayout() {
        const pages = document.querySelectorAll('.page');
        let issues = [];
        
        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const computed = window.getComputedStyle(page);
            
            // Check dimensions
            const width = parseFloat(computed.width);
            const height = parseFloat(computed.height);
            const expectedWidth = this.printMetrics.pageWidthIn * this.printMetrics.dpi;
            const expectedHeight = this.printMetrics.pageHeightIn * this.printMetrics.dpi;
            
            if (Math.abs(width - expectedWidth) > 1) {
                issues.push(`Page ${index + 1}: Width mismatch (${width}px vs ${expectedWidth}px expected)`);
            }
            
            if (Math.abs(height - expectedHeight) > 1) {
                issues.push(`Page ${index + 1}: Height mismatch (${height}px vs ${expectedHeight}px expected)`);
            }
            
            // Check for overflow
            if (page.scrollHeight > page.clientHeight) {
                issues.push(`Page ${index + 1}: Content overflow detected`);
            }
        });
        
        if (issues.length === 0) {
            this.logResult('✓ Print layout validation passed');
        } else {
            this.logResult('✗ Print layout issues found:\n' + issues.join('\n'));
        }
    }

    detectPrintCapabilities() {
        const capabilities = {
            supportsPageAPI: CSS.supports('break-after', 'page'),
            supportsPageBreak: CSS.supports('page-break-after', 'always'),
            supportsColumns: CSS.supports('column-count', '2'),
            supportsHyphens: CSS.supports('hyphens', 'auto'),
            supportsWritingMode: CSS.supports('writing-mode', 'vertical-rl'),
            supportsPrintColorAdjust: CSS.supports('print-color-adjust', 'exact') || 
                                     CSS.supports('-webkit-print-color-adjust', 'exact')
        };
        
        this.logResult('Print Capabilities:\n' + 
            Object.entries(capabilities)
                .map(([key, value]) => `${key}: ${value ? '✓' : '✗'}`)
                .join('\n'));
    }

    // Utility Methods

    appendTestPage(pageElement) {
        // Find or create test container
        let container = document.getElementById('print-test-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'print-test-container';
            document.body.appendChild(container);
        }
        
        // Clear previous test pages
        container.innerHTML = '';
        container.appendChild(pageElement);
        
        // Scroll to view
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    measurePrintArea() {
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            visibility: hidden;
        `;
        document.body.appendChild(testElement);
        
        const measurements = {
            screenWidth: testElement.offsetWidth,
            screenHeight: testElement.offsetHeight,
            screenDPI: this.printMetrics.dpi,
            printableWidth: `${(testElement.offsetWidth / this.printMetrics.dpi).toFixed(2)}"`,
            printableHeight: `${(testElement.offsetHeight / this.printMetrics.dpi).toFixed(2)}"`,
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        document.body.removeChild(testElement);
        
        this.logResult('Print Area Measurements:\n' + 
            Object.entries(measurements)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n'));
    }

    async runAllTests() {
        this.logResult('Starting comprehensive print tests...');
        
        // Run all tests in sequence
        this.detectPrintCapabilities();
        await this.sleep(500);
        
        this.measurePrintArea();
        await this.sleep(500);
        
        this.generateAlignmentTestPage();
        await this.sleep(500);
        
        this.validatePrintLayout();
        
        this.logResult('All tests completed. Review results above.');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logResult(message) {
        const output = document.getElementById('print-test-output');
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.style.cssText = 'padding: 5px; border-bottom: 1px solid #eee; font-size: 12px;';
        entry.innerHTML = `<strong>[${timestamp}]</strong> ${message.replace(/\n/g, '<br>')}`;
        output.appendChild(entry);
        output.scrollTop = output.scrollHeight;
        
        // Also log to main console if available
        if (window.errorLogger) {
            window.errorLogger.logInfo('Print Test', message);
        }
    }
}

// Initialize print tester
const printTester = new PrintPreviewTester();

// Export for global access
window.printTester = printTester;