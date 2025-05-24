import { codecovVitePlugin } from '@codecov/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'art-museum',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        "name": "Art Institute of Chicago Gallery",
        "short_name": "Art Gallery",
        "description": "Browse and save artworks from the Art Institute of Chicago.",
        "start_url": ".",
        "display": "standalone",
        "display_override": [
          "window-controls-overlay"
        ],
        "icons": [
          {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/web-app-manifest-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/favicon-96x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/apple-touch-icon.png",
            "sizes": "180x180",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/favicon.svg",
            "sizes": "any",
            "type": "image/svg+xml",
            "purpose": "any"
          },
        ],
        "theme_color": "#ffffff",
        "background_color": "#8a0000",
        "screenshots": [
          {
            "src": "/screenshot-desktop.png",
            "sizes": "2560x1600",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "/screenshot-mobile.png",
            "sizes": "750x1334",
            "type": "image/png"
          }
        ]
      },
      injectRegister: false,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.artic\.edu\/api\/v1\/artworks.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'artwork-api-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/www\.artic\.edu\/iiif\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'artwork-images-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.spec.tsx'],
    globals: true,
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
})
