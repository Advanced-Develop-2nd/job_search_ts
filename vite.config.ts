import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 正しくはこちらです

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // GitHub Pages のリポジトリ名に合わせて base を設定
  base: '/job_search_ts/',
})