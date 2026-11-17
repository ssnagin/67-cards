import { mockAuth } from '../../../utils/mockAuth'

export default defineEventHandler((event) => {
  mockAuth(event)
  if (getHeader(event, 'authorization') !== 'Bearer mock-token') {
    throw createError({ statusCode: 401 })
  }
  return { id: 1, username: 'Игрок', email: 'player@example.com', role: 'USER' }
})
