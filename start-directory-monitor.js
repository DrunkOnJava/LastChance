#!/usr/bin/env node

/**
 * Start the Directory Monitor
 * Usage: node start-directory-monitor.js [directory]
 */

const DirectoryMonitor = require('./directory-monitor');
const path = require('path');

// Get directory from command line or use current directory
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log('Starting Directory Monitor for:', targetDir);

// Create and start the monitor
const monitor = new DirectoryMonitor(targetDir);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down Directory Monitor...');
    monitor.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    monitor.stop();
    process.exit(0);
});

// Keep the process running
process.stdin.resume();