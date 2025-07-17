import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // This ensures Vite also understands the alias
      // It's often not strictly necessary if jsconfig.json is set up correctly,
      // but can act as an explicit confirmation for Vite.
      '@': path.resolve(__dirname, './src'),
    },
  },
})
