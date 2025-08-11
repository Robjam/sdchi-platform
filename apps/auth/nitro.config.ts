import nitroCloudflareBindings from "nitro-cloudflare-dev";

export default defineNitroConfig({
  srcDir: "server",
  preset: "cloudflare_module",
  cloudflare: {
      deployConfig: false,
  },
  compatibilityDate: "2025-05-15",
  modules: [nitroCloudflareBindings],
  ignore: [
    '**/*.test.ts',
    '**/*.test.js',
    '**/*.test.tsx',
    '**/*.test.jsx',
  ],
  esbuild: {
    options: {
      jsx: 'automatic',
      jsxImportSource: 'hono/jsx'
    },
  },
  runtimeConfig: {
    // Server-side only runtime config
    baseUrl: process.env.BASE_URL,
    cookieDomain: process.env.COOKIE_DOMAIN,
    sessionMaxAge: process.env.SESSION_MAX_AGE || '172800', // 48 hours default
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureTenantId: process.env.AZURE_TENANT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,

    // Public runtime config (client-side accessible)
    public: {
      appName: process.env.PUBLIC_APP_NAME || 'SDCHI Auth',
    }
  },
});
