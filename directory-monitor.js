/**
 * Directory Monitor and Guide Generator
 * Maintains an always-accurate directory tree and change log
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');

class DirectoryMonitor {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.guideFile = path.join(rootDir, 'directoryGuide.md');
        this.logsDir = path.join(rootDir, 'logs');
        this.changeLog = [];
        this.maxRecentChanges = 200;
        this.fileHashes = new Map();
        this.ignorePatterns = [
            '.git',
            'node_modules',
            '.DS_Store',
            '*.log',
            'logs/',
            '.env',
            'dist/',
            'build/',
            '*.tmp',
            '*.swp'
        ];
        this.watcherMap = new Map();
        this.updateDebounceTimer = null;
        this.isUpdating = false;
        
        this.init();
    }

    async init() {
        // Ensure logs directory exists
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
        
        // Initial scan and guide generation
        await this.generateDirectoryGuide();
        
        // Start watching for changes
        this.startWatching();
        
        console.log('Directory Monitor initialized. Watching:', this.rootDir);
    }

    shouldIgnore(filePath) {
        const relativePath = path.relative(this.rootDir, filePath);
        return this.ignorePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(relativePath);
            }
            return relativePath.includes(pattern);
        });
    }

    async getFileHash(filePath) {
        try {
            const content = await fs.promises.readFile(filePath);
            return crypto.createHash('md5').update(content).digest('hex');
        } catch (error) {
            return null;
        }
    }

    async scanDirectory(dir, indent = '') {
        const items = await fs.promises.readdir(dir, { withFileTypes: true });
        const tree = [];
        const sortedItems = items.sort((a, b) => {
            // Directories first, then files
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        });

        for (const item of sortedItems) {
            const fullPath = path.join(dir, item.name);
            
            if (this.shouldIgnore(fullPath)) continue;

            const stats = await fs.promises.stat(fullPath);
            const isLast = sortedItems.indexOf(item) === sortedItems.length - 1;
            const prefix = isLast ? '└── ' : '├── ';
            const childIndent = indent + (isLast ? '    ' : '│   ');

            if (item.isDirectory()) {
                tree.push(`${indent}${prefix}${item.name}/`);
                const subTree = await this.scanDirectory(fullPath, childIndent);
                tree.push(...subTree);
            } else {
                const size = this.formatFileSize(stats.size);
                const modified = stats.mtime.toISOString().split('T')[0];
                tree.push(`${indent}${prefix}${item.name} (${size}, ${modified})`);
                
                // Track file hash for change detection
                const hash = await this.getFileHash(fullPath);
                if (hash) {
                    const previousHash = this.fileHashes.get(fullPath);
                    if (previousHash && previousHash !== hash) {
                        this.logChange('modified', fullPath, { previousHash, newHash: hash });
                    }
                    this.fileHashes.set(fullPath, hash);
                }
            }
        }

        return tree;
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)}${units[unitIndex]}`;
    }

    logChange(type, filePath, details = {}) {
        const change = {
            timestamp: new Date().toISOString(),
            type,
            path: path.relative(this.rootDir, filePath),
            details
        };
        
        this.changeLog.unshift(change);
        
        // Archive old logs if exceeding limit
        if (this.changeLog.length > this.maxRecentChanges) {
            this.archiveOldLogs();
        }
    }

    async archiveOldLogs() {
        const archiveLogs = this.changeLog.slice(this.maxRecentChanges);
        this.changeLog = this.changeLog.slice(0, this.maxRecentChanges);
        
        const archiveFile = path.join(this.logsDir, `changes-archive-${Date.now()}.json`);
        await fs.promises.writeFile(archiveFile, JSON.stringify(archiveLogs, null, 2));
        
        // Also create a human-readable archive
        const readableArchive = path.join(this.logsDir, `changes-archive-${Date.now()}.md`);
        const readableContent = this.formatChangesForMarkdown(archiveLogs);
        await fs.promises.writeFile(readableArchive, readableContent);
    }

    formatChangesForMarkdown(changes) {
        let content = '# Archived Change Log\n\n';
        content += `Generated: ${new Date().toISOString()}\n\n`;
        
        changes.forEach((change, index) => {
            content += `### ${index + 1}. ${change.type.toUpperCase()} - ${change.path}\n`;
            content += `- **Time:** ${change.timestamp}\n`;
            
            if (change.details && Object.keys(change.details).length > 0) {
                content += `- **Details:** ${JSON.stringify(change.details, null, 2)}\n`;
            }
            
            content += '\n';
        });
        
        return content;
    }

    async generateDirectoryGuide() {
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            const projectName = path.basename(this.rootDir);
            let content = `# Directory Guide - ${projectName}\n\n`;
            content += `Last Updated: ${new Date().toISOString()}\n\n`;
            
            // Directory Statistics
            const stats = await this.getDirectoryStats();
            content += '## Project Statistics\n\n';
            content += `- **Total Files:** ${stats.fileCount}\n`;
            content += `- **Total Directories:** ${stats.dirCount}\n`;
            content += `- **Total Size:** ${this.formatFileSize(stats.totalSize)}\n`;
            content += `- **File Types:** ${stats.fileTypes.join(', ')}\n\n`;
            
            // Directory Tree
            content += '## Directory Structure\n\n';
            content += '```\n';
            content += `${projectName}/\n`;
            const tree = await this.scanDirectory(this.rootDir);
            content += tree.join('\n');
            content += '\n```\n\n';
            
            // Recent Changes
            content += '## Recent Changes (Last 200)\n\n';
            
            if (this.changeLog.length === 0) {
                content += '*No changes recorded yet.*\n\n';
            } else {
                this.changeLog.forEach((change, index) => {
                    const time = new Date(change.timestamp).toLocaleString();
                    const emoji = this.getChangeEmoji(change.type);
                    content += `${index + 1}. ${emoji} **${change.type}** \`${change.path}\` - ${time}\n`;
                    
                    if (change.details && Object.keys(change.details).length > 0) {
                        content += `   - Details: ${this.formatChangeDetails(change.details)}\n`;
                    }
                });
            }
            
            content += '\n---\n\n';
            content += '*This file is automatically maintained by the Directory Monitor.*\n';
            content += `*Archives are stored in the \`${path.relative(this.rootDir, this.logsDir)}\` directory.*\n`;
            
            // Write the guide file
            await fs.promises.writeFile(this.guideFile, content);
            
        } catch (error) {
            console.error('Error generating directory guide:', error);
        } finally {
            this.isUpdating = false;
        }
    }

    getChangeEmoji(type) {
        const emojis = {
            'created': '✨',
            'modified': '📝',
            'deleted': '🗑️',
            'renamed': '📋',
            'moved': '📦',
            'chmod': '🔒'
        };
        return emojis[type] || '📄';
    }

    formatChangeDetails(details) {
        if (details.size) {
            return `Size: ${this.formatFileSize(details.size)}`;
        }
        if (details.oldPath && details.newPath) {
            return `${details.oldPath} → ${details.newPath}`;
        }
        if (details.permissions) {
            return `Permissions: ${details.permissions}`;
        }
        return JSON.stringify(details);
    }

    async getDirectoryStats() {
        const stats = {
            fileCount: 0,
            dirCount: 0,
            totalSize: 0,
            fileTypes: new Set()
        };

        const scanDir = async (dir) => {
            const items = await fs.promises.readdir(dir, { withFileTypes: true });
            
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (this.shouldIgnore(fullPath)) continue;
                
                if (item.isDirectory()) {
                    stats.dirCount++;
                    await scanDir(fullPath);
                } else {
                    stats.fileCount++;
                    const fileStat = await fs.promises.stat(fullPath);
                    stats.totalSize += fileStat.size;
                    
                    const ext = path.extname(item.name).toLowerCase();
                    if (ext) stats.fileTypes.add(ext);
                }
            }
        };

        await scanDir(this.rootDir);
        stats.fileTypes = Array.from(stats.fileTypes).sort();
        return stats;
    }

    startWatching() {
        this.watchDirectory(this.rootDir);
    }

    watchDirectory(dir) {
        if (this.shouldIgnore(dir)) return;

        const watcher = fs.watch(dir, { encoding: 'utf8' }, (eventType, filename) => {
            if (!filename) return;
            
            const fullPath = path.join(dir, filename);
            if (this.shouldIgnore(fullPath)) return;

            // Debounce updates
            clearTimeout(this.updateDebounceTimer);
            this.updateDebounceTimer = setTimeout(() => {
                this.handleFileChange(eventType, fullPath);
            }, 500);
        });

        this.watcherMap.set(dir, watcher);

        // Watch subdirectories
        fs.readdir(dir, { withFileTypes: true }, (err, items) => {
            if (err) return;
            
            items.forEach(item => {
                if (item.isDirectory()) {
                    const subDir = path.join(dir, item.name);
                    if (!this.shouldIgnore(subDir)) {
                        this.watchDirectory(subDir);
                    }
                }
            });
        });
    }

    async handleFileChange(eventType, fullPath) {
        try {
            const exists = fs.existsSync(fullPath);
            const stats = exists ? await fs.promises.stat(fullPath) : null;

            if (eventType === 'rename') {
                if (exists) {
                    if (stats.isDirectory() && !this.watcherMap.has(fullPath)) {
                        this.watchDirectory(fullPath);
                        this.logChange('created', fullPath, { type: 'directory' });
                    } else if (!stats.isDirectory()) {
                        this.logChange('created', fullPath, { 
                            type: 'file',
                            size: stats.size 
                        });
                    }
                } else {
                    this.logChange('deleted', fullPath);
                    
                    // Stop watching deleted directories
                    if (this.watcherMap.has(fullPath)) {
                        this.watcherMap.get(fullPath).close();
                        this.watcherMap.delete(fullPath);
                    }
                }
            } else if (eventType === 'change' && exists && !stats.isDirectory()) {
                this.logChange('modified', fullPath, { 
                    size: stats.size 
                });
            }

            // Regenerate the guide
            await this.generateDirectoryGuide();

        } catch (error) {
            console.error('Error handling file change:', error);
        }
    }

    stop() {
        // Clean up all watchers
        this.watcherMap.forEach(watcher => watcher.close());
        this.watcherMap.clear();
        clearTimeout(this.updateDebounceTimer);
        console.log('Directory Monitor stopped.');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DirectoryMonitor;
}

// Auto-start if run directly
if (require.main === module) {
    const monitor = new DirectoryMonitor(process.cwd());
    
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
}