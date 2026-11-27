export default defineNuxtPlugin({
  name: 'auth-config',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    // NuxtAuth и обычный API-клиент используют один адрес backend.
    // В mock-режиме моки Nitro лежат на корне dev-сервера, поэтому baseURL пустой.
    config.public.auth.baseURL = config.public.apiMode === 'mock'
      ? ''
      : config.public.apiBase
    const provider = config.public.auth.provider
    if (provider.type === 'local') {
      provider.token.cookieName = `67cards.${config.public.apiMode}.token`
      provider.token.secureCookieAttribute = import.meta.client && location.protocol === 'https:'
    }
  },
})
