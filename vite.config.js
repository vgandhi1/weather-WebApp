import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub project pages live at /<repo-name>/; production base must match or assets load from site root (wrong bundle).
// `npm run dev` keeps base `/` so localhost:5173 works without a subpath.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/weather-WebApp/' : '/',
  plugins: [react()],
  build: {
    outDir: 'weather',
  },
}))
