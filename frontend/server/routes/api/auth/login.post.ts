import { mockAuth } from '../../../utils/mockAuth'

export default defineEventHandler(async (event) => {
  mockAuth(event)
  const body = await readBody(event)
  if (typeof body?.email !== 'string' || !body.email.trim()) {
    throw createError({ statusCode: 400, message: 'Укажите почту.' })
  }
  // В моке подходит любая почта; пароль не проверяется и не сохраняется.
  const encode = (value: unknown) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const now = Math.floor(Date.now() / 1000)
  // Неподписанный демонстрационный JWT, не предназначенный для настоящего API.
  const payload = { sub: '1', role: 'ROLE_USER', iss: 'cards-api', iat: now, exp: now + 900 }
  return { accessToken: `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.`, tokenType: 'Bearer' }
})
