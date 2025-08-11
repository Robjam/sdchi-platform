import fs from 'fs'
import path from 'path'
import os from 'os'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['qalendar/dist/style.css'],
  nitro: {
    preset: 'cloudflare_pages',
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    'nitro-cloudflare-dev',
  ],
  devServer: {
    port: 2500,
    host: '127.0.0.1',
    https: process.env.NODE_ENV === 'production' ? false : (() => {
      try {
        const keyPath = path.join(os.homedir(), 'certs/localhost.localdomain+3-key.pem')
        const certPath = path.join(os.homedir(), 'certs/localhost.localdomain+3.pem')
        
        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
          return {
            key: fs.readFileSync(keyPath, 'utf8'),
            cert: fs.readFileSync(certPath, 'utf8'),
          }
        }
        return false
      } catch {
        return false
      }
    })()
  },
  runtimeConfig: {
    public: {
      deepseekApiKey: process.env.DEEPSEEK_API_KEY
    }
  }
})
