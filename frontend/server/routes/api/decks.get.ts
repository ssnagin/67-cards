import { mockAuth } from '../../utils/mockAuth'

// Мок списка коллекций (decks) для режима apiMode=mock.
// Повторяет форму ответа Spring Page<Deck>: { content, totalElements, totalPages, ... }.
export default defineEventHandler((event) => {
  mockAuth(event)
  if (getHeader(event, 'authorization') !== 'Bearer mock-token') {
    throw createError({ statusCode: 401 })
  }

  const now = new Date().toISOString()
  const content = [
    {
      id: 'deck-history-spb',
      title: 'История Санкт-Петербурга',
      description: 'Карточки по истории города',
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'deck-science',
      title: 'Наука вокруг нас',
      description: 'Явления и факты',
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'deck-soviet-cinema',
      title: 'Советское кино',
      description: 'Классика отечественного кинематографа',
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    },
  ]

  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    number: 0,
    size: content.length,
  }
})
