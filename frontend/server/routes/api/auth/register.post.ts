import { mockAuth } from '../../../utils/mockAuth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  mockAuth(event)
  const body = await readBody(event)

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!username) {
    throw createError({ statusCode: 400, message: 'Укажите имя пользователя.' })
  }
  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Введите корректный адрес почты.' })
  }
  if (password.length < 8 || password.length > 72) {
    throw createError({ statusCode: 400, message: 'Пароль должен быть от 8 до 72 символов.' })
  }

  // Имитируем успешную регистрацию до подключения API из Spring.
  setResponseStatus(event, 201)
  return { status: 'OK' }
})
