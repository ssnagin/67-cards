import { mockAuth } from '../../../utils/mockAuth'

export default defineEventHandler(async (event) => {
  mockAuth(event)
  const body = await readBody(event)
  if (typeof body?.email !== 'string' || !body.email.trim()) {
    throw createError({ statusCode: 400, message: 'Укажите почту.' })
  }
  // В моке подходит любая почта; пароль не проверяется и не сохраняется.
  return { accessToken: 'mock-token', tokenType: 'Bearer' }
})
