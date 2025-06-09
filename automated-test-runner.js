#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if jsdom is available, if not provide instructions
try {
    const test = new JSDOM('<div></div>');
} catch (e) {
    console.log('Installing jsdom for testing...');
    const { execSync } = await import('child_process');
    execSync('npm install jsdom', { stdio: 'inherit' });
}

// Now run tests
async function runTests() {
    const htmlPath = path.join(__dirname, 'bmpoa-print-optimized.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    console.log('Running automated tests...\n');
    
    const dom = new JSDOM(htmlContent, {
        resources: "usable",
        runScripts: "dangerously"
    });
    
    const document = dom.window.document;
    const results = {
        pass: 0,
        fail: 0,
        warning: 0,
        errors: []
    };
    
    // Test 1: Page count
    const pages = document.querySelectorAll('.page');
    if (pages.length <= 20) {
        results.pass++;
        console.log('✅ Page count: ' + pages.length + ' (within target)');
    } else {
        results.warning++;
        console.log('⚠️  Page count: ' + pages.length + ' (exceeds target of 20)');
    }
    
    // Test 2: Check for syntax errors in inline styles
    const elementsWithStyle = document.querySelectorAll('[style]');
    elementsWithStyle.forEach((elem, i) => {
        const style = elem.getAttribute('style');
        if (style.includes('<') || style.includes('>')) {
            results.fail++;
            results.errors.push(`Element ${i} has invalid style attribute`);
        }
    });
    
    if (results.errors.length === 0) {
        results.pass++;
        console.log('✅ No syntax errors in inline styles');
    } else {
        console.log('❌ Found ' + results.errors.length + ' style syntax errors');
    }
    
    // Test 3: Check images
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            missingAlt++;
        }
    });
    
    if (missingAlt === 0) {
        results.pass++;
        console.log('✅ All images have alt attributes');
    } else {
        results.warning++;
        console.log('⚠️  ' + missingAlt + ' images missing alt attributes');
    }
    
    // Test 4: Check for broken internal links
    const links = document.querySelectorAll('a[href^="#"]');
    let brokenLinks = 0;
    links.forEach(link => {
        const target = link.getAttribute('href').substring(1);
        if (target && !document.getElementById(target)) {
            brokenLinks++;
        }
    });
    
    if (brokenLinks === 0) {
        results.pass++;
        console.log('✅ No broken internal links');
    } else {
        results.fail++;
        console.log('❌ ' + brokenLinks + ' broken internal links');
    }
    
    // Test 5: Check CSS file references
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const cssFiles = [];
    cssLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            cssFiles.push(href);
        }
    });
    
    console.log('\n📋 CSS files referenced: ' + cssFiles.length);
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    console.log('✅ Passed: ' + results.pass);
    console.log('❌ Failed: ' + results.fail);
    console.log('⚠️  Warnings: ' + results.warning);
    
    return results;
}

// Run the tests
runTests().catch(console.error);