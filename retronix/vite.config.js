import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-wallpaper-html',
      writeBundle() {
        copyFileSync(
          resolve(__dirname, 'public/wallpaper.html'),
          resolve(__dirname, 'dist/wallpaper.html')
        )
      }
    }
  ],
})