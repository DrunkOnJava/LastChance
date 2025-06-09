/**
 * Browser-based Directory Monitor
 * Works with File System Access API for modern browsers
 */

class BrowserDirectoryMonitor {
    constructor() {
        this.rootHandle = null;
        this.changeLog = [];
        this.maxRecentChanges = 200;
        this.fileSnapshots = new Map();
        this.isMonitoring = false;
        this.monitorInterval = null;
        this.guideContent = '';
        
        this.ignorePatterns = [
            '.git',
            'node_modules',
            '.DS_Store',
            'logs',
            '.env',
            'dist',
            'build'
        ];
    }

    async selectDirectory() {
        try {
            this.rootHandle = await window.showDirectoryPicker({
                mode: 'read'
            });
            
            await this.initialScan();
            this.startMonitoring();
            
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error selecting directory:', error);
            }
            return false;
        }
    }

    shouldIgnore(path) {
        return this.ignorePatterns.some(pattern => path.includes(pattern));
    }

    async initialScan() {
        console.log('Performing initial directory scan...');
        this.fileSnapshots.clear();
        await this.scanDirectory(this.rootHandle, '');
        await this.generateGuide();
    }

    async scanDirectory(dirHandle, path) {
        const entries = [];
        
        for await (const entry of dirHandle.values()) {
            const entryPath = path ? `${path}/${entry.name}` : entry.name;
            
            if (this.shouldIgnore(entryPath)) continue;
            
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                const snapshot = {
                    name: entry.name,
                    path: entryPath,
                    size: file.size,
                    modified: file.lastModified,
                    type: 'file'
                };
                
                this.fileSnapshots.set(entryPath, snapshot);
                entries.push(snapshot);
                
            } else if (entry.kind === 'directory') {
                const snapshot = {
                    name: entry.name,
                    path: entryPath,
                    type: 'directory',
                    children: await this.scanDirectory(entry, entryPath)
                };
                
                entries.push(snapshot);
            }
        }
        
        return entries.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Check for changes every 5 seconds
        this.monitorInterval = setInterval(() => {
            this.checkForChanges();
        }, 5000);
        
        console.log('Directory monitoring started');
    }

    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        this.isMonitoring = false;
        console.log('Directory monitoring stopped');
    }

    async checkForChanges() {
        const currentSnapshots = new Map();
        const changes = [];
        
        // Scan current state
        await this.scanDirectoryForChanges(this.rootHandle, '', currentSnapshots, changes);
        
        // Check for deletions
        for (const [path, oldSnapshot] of this.fileSnapshots) {
            if (!currentSnapshots.has(path)) {
                this.logChange('deleted', path);
                changes.push({ type: 'deleted', path });
            }
        }
        
        // Update snapshots
        this.fileSnapshots = currentSnapshots;
        
        // Regenerate guide if there were changes
        if (changes.length > 0) {
            await this.generateGuide();
            this.notifyChanges(changes);
        }
    }

    async scanDirectoryForChanges(dirHandle, path, snapshots, changes) {
        for await (const entry of dirHandle.values()) {
            const entryPath = path ? `${path}/${entry.name}` : entry.name;
            
            if (this.shouldIgnore(entryPath)) continue;
            
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                const snapshot = {
                    name: entry.name,
                    path: entryPath,
                    size: file.size,
                    modified: file.lastModified,
                    type: 'file'
                };
                
                const oldSnapshot = this.fileSnapshots.get(entryPath);
                
                if (!oldSnapshot) {
                    this.logChange('created', entryPath, { size: file.size });
                    changes.push({ type: 'created', path: entryPath });
                } else if (oldSnapshot.modified !== file.lastModified || oldSnapshot.size !== file.size) {
                    this.logChange('modified', entryPath, { 
                        oldSize: oldSnapshot.size,
                        newSize: file.size 
                    });
                    changes.push({ type: 'modified', path: entryPath });
                }
                
                snapshots.set(entryPath, snapshot);
                
            } else if (entry.kind === 'directory') {
                await this.scanDirectoryForChanges(entry, entryPath, snapshots, changes);
            }
        }
    }

    logChange(type, path, details = {}) {
        const change = {
            timestamp: new Date().toISOString(),
            type,
            path,
            details
        };
        
        this.changeLog.unshift(change);
        
        // Trim to max changes
        if (this.changeLog.length > this.maxRecentChanges) {
            const archived = this.changeLog.splice(this.maxRecentChanges);
            this.archiveChanges(archived);
        }
    }

    async archiveChanges(changes) {
        // In browser, we'll store in localStorage or IndexedDB
        const archiveKey = `directoryMonitor_archive_${Date.now()}`;
        try {
            localStorage.setItem(archiveKey, JSON.stringify(changes));
        } catch (e) {
            console.warn('Failed to archive changes to localStorage:', e);
        }
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

    async generateGuide() {
        const rootName = this.rootHandle.name;
        let content = `# Directory Guide - ${rootName}\n\n`;
        content += `Last Updated: ${new Date().toISOString()}\n\n`;
        
        // Statistics
        const stats = this.calculateStats();
        content += '## Project Statistics\n\n';
        content += `- **Total Files:** ${stats.fileCount}\n`;
        content += `- **Total Directories:** ${stats.dirCount}\n`;
        content += `- **Total Size:** ${this.formatFileSize(stats.totalSize)}\n`;
        content += `- **File Types:** ${Array.from(stats.fileTypes).join(', ')}\n\n`;
        
        // Directory Tree
        content += '## Directory Structure\n\n';
        content += '```\n';
        content += `${rootName}/\n`;
        
        const tree = await this.buildTreeString(this.rootHandle, '');
        content += tree;
        content += '```\n\n';
        
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
                    content += `   - Details: ${JSON.stringify(change.details)}\n`;
                }
            });
        }
        
        this.guideContent = content;
        return content;
    }

    async buildTreeString(dirHandle, indent) {
        let tree = '';
        const entries = [];
        
        // Collect entries
        for await (const entry of dirHandle.values()) {
            if (!this.shouldIgnore(entry.name)) {
                entries.push(entry);
            }
        }
        
        // Sort entries
        entries.sort((a, b) => {
            if (a.kind !== b.kind) {
                return a.kind === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        // Build tree
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const isLast = i === entries.length - 1;
            const prefix = isLast ? '└── ' : '├── ';
            const childIndent = indent + (isLast ? '    ' : '│   ');
            
            if (entry.kind === 'directory') {
                tree += `${indent}${prefix}${entry.name}/\n`;
                tree += await this.buildTreeString(entry, childIndent);
            } else {
                const file = await entry.getFile();
                const size = this.formatFileSize(file.size);
                const date = new Date(file.lastModified).toISOString().split('T')[0];
                tree += `${indent}${prefix}${entry.name} (${size}, ${date})\n`;
            }
        }
        
        return tree;
    }

    calculateStats() {
        let fileCount = 0;
        let dirCount = 0;
        let totalSize = 0;
        const fileTypes = new Set();
        
        for (const [path, snapshot] of this.fileSnapshots) {
            if (snapshot.type === 'file') {
                fileCount++;
                totalSize += snapshot.size || 0;
                
                const ext = path.split('.').pop().toLowerCase();
                if (ext && ext !== path) {
                    fileTypes.add(`.${ext}`);
                }
            }
        }
        
        // Count directories from paths
        const dirs = new Set();
        for (const path of this.fileSnapshots.keys()) {
            const parts = path.split('/');
            for (let i = 1; i < parts.length; i++) {
                dirs.add(parts.slice(0, i).join('/'));
            }
        }
        dirCount = dirs.size;
        
        return { fileCount, dirCount, totalSize, fileTypes };
    }

    getChangeEmoji(type) {
        const emojis = {
            'created': '✨',
            'modified': '📝',
            'deleted': '🗑️',
            'renamed': '📋',
            'moved': '📦'
        };
        return emojis[type] || '📄';
    }

    async downloadGuide() {
        const blob = new Blob([this.guideContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'directoryGuide.md';
        a.click();
        URL.revokeObjectURL(url);
    }

    async saveGuideToFile() {
        if (!this.rootHandle) return;
        
        try {
            const fileHandle = await this.rootHandle.getFileHandle('directoryGuide.md', { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(this.guideContent);
            await writable.close();
            
            console.log('Directory guide saved to file');
            return true;
        } catch (error) {
            console.error('Error saving guide to file:', error);
            return false;
        }
    }

    notifyChanges(changes) {
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('directoryChanges', {
            detail: { changes, changeLog: this.changeLog }
        }));
    }

    getGuideContent() {
        return this.guideContent;
    }

    getChangeLog() {
        return this.changeLog;
    }
}

// Export for use
window.BrowserDirectoryMonitor = BrowserDirectoryMonitor;