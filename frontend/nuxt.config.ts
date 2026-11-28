import { createRequire } from 'node:module'
// Пути API живут в одном месте — utils/apiEndpoints.ts, а не дублируются здесь.
import { apiEndpoints } from './app/utils/apiEndpoints'

// Используем nesting из Tailwind, который установлен для Nuxt-модуля.
const require = createRequire(import.meta.url)
const tailwindModuleRequire = createRequire(require.resolve('@nuxtjs/tailwindcss'))
const tailwindNesting = tailwindModuleRequire.resolve('tailwindcss/nesting')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-06',
  devtools: { enabled: true },
  ssr: false,

  postcss: {
    plugins: {
      [tailwindNesting]: {},
      'tailwindcss/nesting': false,
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@sidebase/nuxt-auth',
    'nuxt-security'
  ],

  auth: {
    // Реальный адрес бэкенда задаётся в плагине 00.auth-config.ts из runtimeConfig.apiBase.
    baseURL: '',
    disableInternalRouting: true,
    sessionRefresh: { enableOnWindowFocus: true, enablePeriodically: 60000 },
    provider: {
      type: 'local',
      pages: { login: '/auth/login' },
      endpoints: {
        signIn: { path: apiEndpoints.auth.login.path, method: 'post' },
        signUp: { path: apiEndpoints.auth.register.path, method: 'post' },
        signOut: false,
        getSession: { path: apiEndpoints.users.me.path, method: 'get' },
      },
      token: { signInResponseTokenPointer: '/accessToken', maxAgeInSeconds: 900 },
      session: { dataType: { id: 'number', username: 'string', email: 'string', role: 'string' } },
    },
  },

  security: {
    // JWT передаётся в Authorization, cookie-аутентификации здесь нет.
    csrf: false,
  },

  css: [
    '~/assets/css/main.css',
    // Иконки — Font Awesome (webfont), без ручных SVG-путей.
    '@fortawesome/fontawesome-free/css/all.css',
  ],

  app: {
    baseURL: "/67-cards/"
  },

  // Dev-сервер слушает только IPv4 (127.0.0.1): на части Windows-машин «localhost»
  // резолвится в IPv6 (::1), и фронт/бэкенд не видят друг друга по IPv4.
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },

  experimental: {
    payloadExtraction: false,
  },

  runtimeConfig: {
    public: {
      // Адрес бэкенда. Позже вынесем в переменную окружения (NUXT_PUBLIC_API_BASE).
      apiBase: 'http://127.0.0.1:16768',
    }
  }
})
