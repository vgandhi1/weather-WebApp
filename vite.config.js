import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages expects root deployment usually, or configured otherwise.
  // Output directory changed to 'weather' as requested.
  build: {
    outDir: 'weather',
  },
})
