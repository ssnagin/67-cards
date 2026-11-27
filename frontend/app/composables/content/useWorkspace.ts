import { useApi } from '~/composables/api/useApi'
import { apiEndpoints } from '~/utils/apiEndpoints'
import type { Deck } from '~/types/content/deck'

// Данные рабочего пространства для дашборда.
//
// «Мои коллекции» — реальный список из GET /api/decks.
// «Недавно отредактированные» — у бэкенда пока нет эндпоинта списка недавних карточек,
// поэтому recentCards всегда пуст (показывается пустое состояние по макету);
// поле recentCardsAvailable зарезервировано на будущее.
export function useWorkspace() {
  const api = useApi()
  const collections = ref<Deck[]>([])
  const recentCards = ref<Deck[]>([])
  const pending = ref(false)
  const error = ref('')

  const recentCardsAvailable = computed(() => recentCards.value.length > 0)

  async function refresh() {
    pending.value = true
    error.value = ''
    try {
      const page = await api.request(apiEndpoints.decks.list)
      // Сортируем по дате изменения: свежие сверху, как в макете.
      collections.value = [...(page.content ?? [])].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      recentCards.value = []
    } catch {
      error.value = 'Не удалось загрузить коллекции.'
      collections.value = []
      recentCards.value = []
    } finally {
      pending.value = false
    }
  }

  return { collections, recentCards, recentCardsAvailable, pending, error, refresh }
}
