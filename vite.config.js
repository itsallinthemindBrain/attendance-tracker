import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5163',
      '/.auth': 'http://localhost:5163',
    },
  },
  build: {
    outDir: 'backend/src/API/wwwroot/dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: ['node_modules/', 'src/test-setup.js', 'src/main.jsx', 'src/attendance-tracker-roadmap.jsx'],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/test-results-frontend.xml',
    },
  },
})
