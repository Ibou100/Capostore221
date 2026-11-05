import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const buildId = Date.now().toString(36);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/app-[hash]-${buildId}.js`,
        chunkFileNames: `assets/chunk-[hash]-${buildId}.js`,
        assetFileNames: `assets/style-[hash]-${buildId}.[ext]`,
      },
    },
  },
})
