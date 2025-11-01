import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Upewnij się, że masz ten import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // To jest linijka, której prawdopodobnie brakuje
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
