import type { H3Event } from 'h3'

// Только моки запросов для интерфейса; аккаунты и пароли здесь не хранятся.
export function mockAuth(event: H3Event) {
  if (useRuntimeConfig(event).public.apiMode !== 'mock') throw createError({ statusCode: 404 })
  setResponseHeader(event, 'Cache-Control', 'no-store')
}
