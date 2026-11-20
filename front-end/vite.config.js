import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const backendAPI = loadEnv("development", process.cwd(), "").VITE_BACKEND_URL || "http://localhost:3000";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: backendAPI,
        changeOrigin: true,
      },
    }
  }
});