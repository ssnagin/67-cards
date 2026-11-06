// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-06',
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts'
  ],

  css: ['~/assets/css/main.css'],

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
