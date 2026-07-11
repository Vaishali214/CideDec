import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    // Raise warning threshold (some chunks are legitimately large due to pdfjs)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: core React runtime
          'vendor-react': ['react', 'react-dom'],
          // Vendor chunk: animation library
          'vendor-motion': ['motion'],
          // Vendor chunk: charts
          'vendor-charts': ['recharts'],
          // Vendor chunk: icons
          'vendor-icons': ['lucide-react'],
          // Vendor chunk: PDF parsing (largest single dep)
          'vendor-pdf': ['pdfjs-dist'],
          // Vendor chunk: zip for DOCX
          'vendor-zip': ['jszip'],
          // Vendor chunk: UI framework components
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
          ],
        },
      },
    },
  },
})
