import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ip-194-99-21-145-139178.vps.hosted-by-mvps.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
