import { mockAuth } from '../../../utils/mockAuth'

export default defineEventHandler(async (event) => {
  mockAuth(event)
  const body = await readBody(event)
  if (typeof body?.email !== 'string' || !body.email.trim() || typeof body?.username !== 'string' || !body.username.trim()) {
    throw createError({ statusCode: 400, message: 'Укажите имя пользователя и почту.' })
  }
  // Имитируем успешную регистрацию до подключения API из Spring.
  setResponseStatus(event, 201)
  return { status: 'OK' }
})
