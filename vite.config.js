import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFilesPlugin } from './vite-plugin-copy-files.js'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bmpoa: resolve(__dirname, 'bmpoa-print-optimized.html'),
        printTest: resolve(__dirname, 'print-test-pages.html'),
        paginationFix: resolve(__dirname, 'apply-pagination-fixes.html')
      }
    }
  },
  plugins: [copyFilesPlugin()],
  server: {
    port: 5173,
    open: true,
    host: true
  },
  // Ensure all assets are properly handled
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.pdf']
})