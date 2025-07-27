import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const __dirname = path.resolve();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    proxy: {
      '/admin': 'http://43.200.89.83:8080',
    },
  },
});
