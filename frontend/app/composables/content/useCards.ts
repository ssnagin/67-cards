import { useApi } from '~/composables/api/useApi'
import { apiEndpoints } from '~/utils/apiEndpoints'
import type { Card } from '~/types/content/card'

export function useCards(deckId: string) {
  const api = useApi()
  const cards = ref<Card[]>([])
  const pending = ref(false)
  const error = ref('')

  async function list() {
    pending.value = true
    try{
      cards.value = await api.request(apiEndpoints.cards(deckId).list)
    }catch {
      error.value = 'Не удалось загрузить карточки.'
    } finally {
      pending.value = false
    }

  }

  async function create(card: Card) {
    pending.value = true
    try{
      const cardn = await api.request(apiEndpoints.cards(deckId).create , {body: card})
      return cardn


  }catch {
      error.value = 'Не удалось создать карточку.'
    } finally {
      pending.value = false
    }

  }

  async function update(cardId: string, card: Card) {
    pending.value = true
    try{
      const updated = await api.request(apiEndpoints.cards(deckId).update(cardId), {body:card})
      return updated
    }catch {
      error.value = 'Не удалось обновить карточку.'
    } finally {
      pending.value = false
    }
  }

  async function remove(cardId: string) {
    pending.value = true
    try{
      await api.request(apiEndpoints.cards(deckId).delete(cardId))
    }catch {
      error.value = 'Не удалось удалить карточку.'
    } finally {
      pending.value = false
    }
  }

  return { cards, pending, error, list, create, update, remove }
}