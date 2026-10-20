// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts'
  ],

  app: {
    baseURL: "/67-cards/"
  },

  experimental: {
    payloadExtraction: false,
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:16768',
      apiMode: 'mock'
    }
  }
})
