import { mockAuth } from '../../../utils/mockAuth'

export default defineEventHandler(async (event) => {
  mockAuth(event)
  const body = await readBody(event)
  if (typeof body?.email !== 'string' || !body.email.trim()) {
    throw createError({ statusCode: 400, message: 'Укажите почту.' })
  }
  // Имитируем успешную регистрацию до подключения API из Spring.
  setResponseStatus(event, 201)
  return { id: 1, email: body.email.trim(), role: 'ROLE_USER' }
})
