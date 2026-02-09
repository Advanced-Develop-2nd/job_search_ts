import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ここを追加！ リポジトリ名が 「job_search_ts」 の場合：
  base: '/job_search_ts/', 
})