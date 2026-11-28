// Коллекция карточек (Mongo «decks»). Ответ Spring Page<Deck> приходит как
// { content: Deck[], totalElements, ... } — для списка используем поле content.
export type Deck = {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export type DeckPage = {
  content: Deck[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// Тело запроса на создание коллекции (POST /api/decks). title обязателен, description опционален.
export type CreateDeckPayload = {
  title: string
  description?: string
  isPublic: boolean
}
