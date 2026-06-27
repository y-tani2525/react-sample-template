import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 で待ち受け（コンテナ外からアクセス可能に）
    port: 5173,
    watch: {
      usePolling: true, // Docker のボリュームマウントで HMR を効かせる
    },
  },
})
