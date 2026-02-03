
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bus.wawj.dpdns.org',
        changeOrigin: true,
        // 不再 rewrite 掉 /api，因为服务器接口本身带 /api
        rewrite: (path) => path
      },
    },
  },
});
