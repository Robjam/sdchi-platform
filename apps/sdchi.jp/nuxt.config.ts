// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ['~/app.css'],
  ssr: false,
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  compatibilityDate: '2025-10-04',
  devtools: { enabled: true },
  modules: ['@nuxt/content', 'nitro-cloudflare-dev'],
})
