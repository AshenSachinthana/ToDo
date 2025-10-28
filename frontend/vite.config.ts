import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
  host: '0.0.0.0', // Listen on all interfaces
  port: 5173,
  allowedHosts: true,
  watch: {
      usePolling: true, // actively check for file changes  
      interval: 100     // check every 100ms
    }
}
})
