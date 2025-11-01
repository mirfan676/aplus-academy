import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Build output folder
  },
  publicDir: 'public', // Ensures files like _redirects are copied to dist
  server: {
    port: 5173, // optional: you can change local dev port if needed
  },
})
