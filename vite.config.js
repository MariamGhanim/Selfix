import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { prerenderAboutPlugin } from './scripts/prerenderAbout.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderAboutPlugin()],
})
