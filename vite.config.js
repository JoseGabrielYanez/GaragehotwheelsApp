import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const DAY = 24 * 60 * 60;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "prompt": una versión nueva no reemplaza a la actual por sorpresa (podrías estar subiendo un auto);
      // la app muestra un aviso con el botón "Actualizar" (ver PwaUpdatePrompt).
      registerType: "prompt",
      injectRegister: false, // el registro lo hace PwaUpdatePrompt con useRegisterSW
      includeAssets: ["favicon.ico", "favicon-32.png", "apple-touch-icon.png"],

      manifest: {
        id: "/",
        name: "Collection Garage",
        short_name: "Garage",
        description: "Tu colección de autos a escala, ordenada y a mano",
        lang: "es",
        start_url: "/stock",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        background_color: "#090a0f",
        theme_color: "#090a0f",
        categories: ["lifestyle", "productivity"],
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ],
        // Atajos al mantener pulsado el icono de la app (Android / escritorio)
        shortcuts: [
          { name: "Inventario", short_name: "Stock", url: "/stock", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
          { name: "Carrusel", short_name: "Carrusel", url: "/carousel", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] }
        ]
      },

      workbox: {
        // Todo lo que genera el build (código, estilos, imágenes de la interfaz) queda guardado: la app abre sin conexión
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,webp,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: true, // desde la primera visita el service worker ya guarda datos y fotos para uso sin conexión
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/uploads\//],

        runtimeCaching: [
          {
            // Datos del usuario (inventario y sesión): primero la red; sin conexión, lo último que se vio.
            // La caché "api-data" se borra al cerrar sesión (ver utils/pwa.js), así no queda nada privado en el equipo.
            urlPattern: ({ url }) => /^\/api\/(cars|auth\/me)\/?$/.test(url.pathname),
            method: "GET",
            handler: "NetworkFirst",
            options: {
              cacheName: "api-data",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 40, maxAgeSeconds: 7 * DAY },
              cacheableResponse: { statuses: [200] }
            }
          },
          {
            // Fotos de los autos: cada archivo tiene un nombre único, así que nunca cambian
            urlPattern: ({ url }) => url.pathname.startsWith("/uploads/"),
            handler: "CacheFirst",
            options: {
              cacheName: "car-photos",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * DAY },
              cacheableResponse: { statuses: [200] }
            }
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-css", cacheableResponse: { statuses: [0, 200] } }
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-files",
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * DAY },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },

      devOptions: { enabled: false } // el service worker solo existe en la versión compilada (npm run build + preview)
    })
  ],
  server: {
    port: 5173
  }
});
