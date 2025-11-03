import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: '/flowrecruit/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    // (opcjonalnie) jeśli overlay Ci przeszkadza przy dev:
    // hmr: { overlay: false }
  },
})
