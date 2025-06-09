import fs from 'fs-extra'
import path from 'path'

export function copyFilesPlugin() {
  return {
    name: 'copy-files',
    async writeBundle() {
      const filesToCopy = [
        // Copy all CSS files
        'pagination-fixes.css',
        'restored-content-styles.css',
        'professional-design-system.css',
        'professional-contact-cards.css',
        'professional-icons-amenities.css',
        'professional-emergency-visual.css',
        'fire-safety-diagram.css',
        'committee-org-chart.css',
        'professional-event-calendar.css',
        'professional-photo-treatments.css',
        'professional-checklist.css',
        'professional-back-cover.css',
        
        // Copy all JS files
        'auto-pagination.js',
        'directory-monitor-browser.js',
        'fix-pagination.js',
        'pagination-auto-fix.js',
        'pagination-safeguards.js',
        'pagination-test-suite.js',
        'print-preview-testing.js',
        'restore-archive-content.js',
        'professional-components.js',
        'professional-amenities.js',
        'fire-safety-infographic.js',
        'committee-org-chart.js',
        'professional-event-calendar.js',
        'professional-photo-treatments.js',
        'professional-checklist.js',
        'professional-back-cover.js',
        'board-professional-cards.js',
        'final-polish.js',
        
        // Copy other necessary files
        '_redirects'
      ]
      
      // Copy individual files
      for (const file of filesToCopy) {
        const srcPath = path.resolve(file)
        const destPath = path.resolve('dist', file)
        
        if (await fs.pathExists(srcPath)) {
          await fs.copy(srcPath, destPath)
          console.log(`Copied ${file}`)
        }
      }
      
      // Copy directories
      const directories = [
        'images',
        'archives',
        'AllowedContent-Strict'
      ]
      
      for (const dir of directories) {
        const srcPath = path.resolve(dir)
        const destPath = path.resolve('dist', dir)
        
        if (await fs.pathExists(srcPath)) {
          await fs.copy(srcPath, destPath)
          console.log(`Copied directory ${dir}`)
        }
      }
    }
  }
}