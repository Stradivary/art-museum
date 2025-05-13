import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.spec.tsx'],
    globals: true,
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    }
  }
})
