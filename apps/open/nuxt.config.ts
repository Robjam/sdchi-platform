import fs from 'fs'
import path from 'path'
import os from 'os'
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css', 'qalendar/dist/style.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'cloudflare_pages',
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/test-utils',
    'nitro-cloudflare-dev',
  ],
  devServer: {
    port: 2500,
    host: '127.0.0.1',
    https: {
      key: `${fs.readFileSync(path.join(os.homedir(), 'certs/localhost.localdomain+3-key.pem'))}`,
      cert: `${fs.readFileSync(path.join(os.homedir(), 'certs/localhost.localdomain+3.pem'))}`,
    }
  },
  runtimeConfig: {
    public: {
      deepseekApiKey: process.env.DEEPSEEK_API_KEY
    }
  }
})
