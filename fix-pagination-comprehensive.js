#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the HTML file
const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Parse with JSDOM
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Analysis functions
function analyzePages() {
    const pages = document.querySelectorAll('.page');
    console.log(`\n=== PAGE ANALYSIS ===`);
    console.log(`Total pages: ${pages.length}`);
    
    const pageAnalysis = [];
    
    pages.forEach((page, index) => {
        const content = page.querySelector('.page-content');
        if (!content) {
            pageAnalysis.push({
                pageNum: index + 1,
                type: 'empty',
                contentLength: 0,
                elements: 0
            });
            return;
        }
        
        const text = content.textContent.trim();
        const elements = content.querySelectorAll('*').length;
        const hasImages = content.querySelectorAll('img').length > 0;
        const hasTables = content.querySelectorAll('table').length > 0;
        const headers = content.querySelectorAll('h1, h2, h3, h4').length;
        
        pageAnalysis.push({
            pageNum: index + 1,
            type: determinePageType(page),
            contentLength: text.length,
            elements,
            hasImages,
            hasTables,
            headers,
            canMerge: text.length < 1000 && !hasImages && !hasTables
        });
    });
    
    return pageAnalysis;
}

function determinePageType(page) {
    const template = page.getAttribute('data-template');
    if (template) return template;
    
    const content = page.textContent.toLowerCase();
    if (content.includes('table of contents')) return 'toc';
    if (content.includes('emergency')) return 'emergency';
    if (content.includes('chapter')) return 'chapter';
    if (content.includes('board')) return 'governance';
    if (content.includes('community')) return 'community';
    
    return 'content';
}

function findMergeOpportunities(pageAnalysis) {
    console.log(`\n=== MERGE OPPORTUNITIES ===`);
    const opportunities = [];
    
    for (let i = 0; i < pageAnalysis.length - 1; i++) {
        const current = pageAnalysis[i];
        const next = pageAnalysis[i + 1];
        
        // Don't merge special pages
        if (['cover', 'toc', 'chapter'].includes(current.type) ||
            ['cover', 'toc', 'chapter'].includes(next.type)) {
            continue;
        }
        
        // Check if pages can be merged
        if (current.canMerge && next.canMerge) {
            const combinedLength = current.contentLength + next.contentLength;
            if (combinedLength < 2500) {
                opportunities.push({
                    pages: [current.pageNum, next.pageNum],
                    combinedLength,
                    savings: 1
                });
            }
        }
    }
    
    return opportunities;
}

function createOptimizedCSS() {
    return `
/* Aggressive Space Optimization for 20-page target */
@media print {
    /* Reduce all spacing */
    * {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
    
    /* Specific element spacing */
    p {
        margin-bottom: 0.3em !important;
        line-height: 1.3 !important;
    }
    
    h1 {
        font-size: 1.8em !important;
        margin-top: 0.5em !important;
        margin-bottom: 0.3em !important;
    }
    
    h2 {
        font-size: 1.4em !important;
        margin-top: 0.4em !important;
        margin-bottom: 0.2em !important;
    }
    
    h3 {
        font-size: 1.2em !important;
        margin-top: 0.3em !important;
        margin-bottom: 0.2em !important;
    }
    
    ul, ol {
        margin-left: 1.5em !important;
        margin-bottom: 0.3em !important;
    }
    
    li {
        margin-bottom: 0.1em !important;
        line-height: 1.3 !important;
    }
    
    /* Table compression */
    table {
        font-size: 0.9em !important;
        margin: 0.5em 0 !important;
    }
    
    th, td {
        padding: 0.2em 0.3em !important;
    }
    
    /* Image optimization */
    img {
        max-height: 200px !important;
        width: auto !important;
    }
    
    /* Remove decorative elements */
    .decorative, .spacer, .divider {
        display: none !important;
    }
    
    /* Compress alert boxes */
    .alert-box, .info-box, .warning-box {
        padding: 0.3em !important;
        margin: 0.3em 0 !important;
    }
    
    /* Page content maximization */
    .page-content {
        padding: 0.5in !important;
    }
}
`;
}

function generateReport(pageAnalysis, mergeOpportunities) {
    console.log(`\n=== OPTIMIZATION REPORT ===`);
    
    // Find pages with low content
    const lowContentPages = pageAnalysis.filter(p => p.contentLength < 500 && p.type !== 'cover');
    console.log(`\nPages with low content (<500 chars): ${lowContentPages.length}`);
    lowContentPages.forEach(p => {
        console.log(`  - Page ${p.pageNum}: ${p.contentLength} chars`);
    });
    
    // Find pages that could be compressed
    const compressiblePages = pageAnalysis.filter(p => 
        p.contentLength > 2000 && !p.hasImages && !p.hasTables
    );
    console.log(`\nPages that could be compressed: ${compressiblePages.length}`);
    
    // Calculate potential savings
    const potentialSavings = mergeOpportunities.reduce((sum, opp) => sum + opp.savings, 0);
    console.log(`\nPotential page savings through merging: ${potentialSavings} pages`);
    
    // Final estimate
    const currentPages = pageAnalysis.length;
    const estimatedFinal = currentPages - potentialSavings - Math.floor(compressiblePages.length * 0.3);
    console.log(`\nEstimated pages after optimization: ${estimatedFinal}`);
    
    return {
        currentPages,
        lowContentPages: lowContentPages.length,
        compressiblePages: compressiblePages.length,
        potentialSavings,
        estimatedFinal
    };
}

// Main execution
console.log('Analyzing BMPOA document for pagination optimization...');

const pageAnalysis = analyzePages();
const mergeOpportunities = findMergeOpportunities(pageAnalysis);
const report = generateReport(pageAnalysis, mergeOpportunities);

// Create optimization files
console.log('\n=== CREATING OPTIMIZATION FILES ===');

// 1. Create aggressive CSS
fs.writeFileSync(
    path.join(__dirname, 'pagination-aggressive-fix.css'),
    createOptimizedCSS()
);
console.log('Created: pagination-aggressive-fix.css');

// 2. Create merge recommendations
const mergeRecommendations = {
    analysis: pageAnalysis,
    mergeOpportunities,
    report,
    recommendations: [
        'Apply aggressive CSS spacing reduction',
        'Merge low-content pages where possible',
        'Reduce image sizes where appropriate',
        'Consider moving some content to appendices',
        'Use multi-column layout for lists and simple content'
    ]
};

fs.writeFileSync(
    path.join(__dirname, 'pagination-recommendations.json'),
    JSON.stringify(mergeRecommendations, null, 2)
);
console.log('Created: pagination-recommendations.json');

console.log('\n=== SUMMARY ===');
if (report.estimatedFinal <= 20) {
    console.log(`✓ Target of 20 pages is achievable with recommended optimizations`);
} else {
    console.log(`⚠️  Additional content reduction needed to reach 20-page target`);
    console.log(`   Current: ${report.currentPages} pages`);
    console.log(`   Achievable: ${report.estimatedFinal} pages`);
    console.log(`   Need to cut: ${report.estimatedFinal - 20} more pages`);
}