//vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'public', 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'public', 'server.crt'))
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/serial": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
