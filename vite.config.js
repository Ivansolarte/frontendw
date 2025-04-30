import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Asegúrate de que la salida sea la carpeta 'dist'
    sourcemap: false,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4173,
    allowedHosts: ['frontendw-hn72.onrender.com']
  }
})
