import { csrfMethods } from './app/types/user/auth/userAuth'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-06',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    'nuxt-security'
  ],

  security: {
    csrf: {
      addCsrfTokenToEventCtx: true,
      headerName: 'X-CSRF-TOKEN',
      methodsToProtect: [...csrfMethods]
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    baseURL: "/67-cards/"
  },

  experimental: {
    payloadExtraction: false,
  },

  runtimeConfig: {

    csrfSecret: 'some-super-cool-private-csrf-verification-key-32-symbols-minimum',

    public: {
      apiBase: 'http://localhost:16768',
      apiMode: 'mock',
      
    }
  }
})