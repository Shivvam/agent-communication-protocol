import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // Proxy requests from '/api' to your backend API
      '/api': {
        target: 'http://127.0.0.1:8000', // Your Python backend API URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix when forwarding
        // ws: true, // If your backend uses WebSockets
      },
    },
  },
  plugins: [react(), tailwindcss()],
 
})
