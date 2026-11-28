<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import AppHeader from '~/components/workspace/AppHeader.vue'
import CollectionRow from '~/components/workspace/CollectionRow.vue'
import useAppAuth from '~/composables/auth/useAppAuth'
import { useWorkspace } from '~/composables/content/useWorkspace'
import auth from '~/middleware/auth/auth'

definePageMeta({
  layout: 'default',
  middleware: auth,
})
useHead({ title: '67 Cards — Рабочее пространство' })

const { user } = useAppAuth()
const { collections, recentCards, pending, error, refresh, createDeck } = useWorkspace()

// --- Создание коллекции ---
const creating = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const savingDeck = ref(false)
const deckError = ref('')

function openCreate() {
  creating.value = true
  newTitle.value = ''
  newDescription.value = ''
  deckError.value = ''
}

function cancelCreate() {
  creating.value = false
  newTitle.value = ''
  newDescription.value = ''
  deckError.value = ''
}

async function submitDeck() {
  const title = newTitle.value.trim()
  if (!title) {
    deckError.value = 'Укажите название коллекции.'
    return
  }
  savingDeck.value = true
  deckError.value = ''
  try {
    await createDeck({ title, description: newDescription.value.trim(), isPublic: false })
    creating.value = false
    newTitle.value = ''
    newDescription.value = ''
  } catch {
    deckError.value = 'Не удалось создать коллекцию.'
  } finally {
    savingDeck.value = false
  }
}

onMounted(() => refresh())
</script>

<template>
  <div class="min-h-dvh">
    <AppHeader variant="workspace" />

    <!-- Приветствие + декоративная обложка (свечение и стопка карточек) -->
    <section class="relative mx-auto max-w-[1312px] overflow-hidden px-16 pt-6" aria-label="Рабочее пространство">
      <div class="relative min-h-[152px]">
        <!-- декоративные свечения -->
        <div class="pointer-events-none absolute -top-[220px] left-[747px] h-[520px] w-[760px] rounded-full bg-blue opacity-20 blur-3xl" aria-hidden="true" />
        <div class="pointer-events-none absolute -top-[40px] left-[1007px] h-[360px] w-[405px] rounded-full bg-magenta opacity-20 blur-3xl" aria-hidden="true" />
        <!-- стопка карточек на обложке -->
        <div class="pointer-events-none absolute right-0 top-0 h-[124px] w-[88px]" aria-hidden="true">
          <div class="absolute right-0 top-0 h-[124px] w-[88px] rounded-control bg-blue" />
          <div class="absolute right-4 top-4 h-[124px] w-[88px] rounded-control bg-brand-primary" />
          <span class="absolute right-8 top-16 grid h-6 w-6 place-items-center text-content"><AppIcon name="cards" :size="24" /></span>
        </div>

        <h1 class="text-[48px] font-semibold leading-[61px] text-content">Рабочее пространство</h1>
        <p v-if="error" class="mt-2 text-[17px] text-warning" role="alert">
          <span aria-hidden="true">⚠ </span>Нет связи. Показаны последние сохранённые данные.
        </p>
        <p v-else class="mt-2 text-[17px] text-muted">
          С возвращением, {{ user?.username ?? 'пользователь' }}.
        </p>
      </div>
    </section>

    <main class="mx-auto max-w-[1312px] px-16 pb-16">
      <!-- Недавно отредактированные -->
      <section class="mt-8" aria-labelledby="recent-heading">
        <h2 id="recent-heading" class="text-[26px] font-semibold leading-[33px] text-content">Недавно отредактированные</h2>

        <!-- Загрузка -->
        <div v-if="pending" class="mt-4 grid grid-cols-3 gap-4" aria-label="Загрузка">
          <div v-for="i in 3" :key="i" class="h-[252px] animate-pulse rounded-control bg-surface" />
        </div>

        <!-- Пустое состояние: эндпоинта недавних карточек пока нет -->
        <div v-else-if="recentCards.length === 0" class="mt-4 flex h-[96px] items-center justify-center rounded-control border border-dashed border-divider text-[15px] text-muted">
          Пока нет правок — начните редактировать карточки.
        </div>

        <!-- Плитки карточек (появятся, когда бэкенд отдаст список) -->
        <div v-else class="mt-4 grid grid-cols-3 gap-4">
          <div v-for="card in recentCards" :key="card.id" class="rounded-control bg-surface p-4">
            <p class="text-[14px] font-medium text-link">{{ card.title }}</p>
          </div>
        </div>
      </section>

      <!-- Мои коллекции -->
      <section class="mt-8" aria-labelledby="collections-heading">
        <div class="flex items-center justify-between">
          <h2 id="collections-heading" class="text-[26px] font-semibold leading-[33px] text-content">Мои коллекции</h2>
          <button
            v-if="!creating"
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand-primary px-4 py-2 text-[15px] font-semibold text-content hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            @click="openCreate"
          >
            <AppIcon name="plus" :size="18" />
            Создать коллекцию
          </button>
        </div>

        <!-- Форма создания коллекции -->
        <form v-if="creating" class="mt-4 rounded-control bg-surface p-6" @submit.prevent="submitDeck">
          <label for="new-deck-title" class="mb-2 block text-[14px] font-medium text-content">Название</label>
          <input
            id="new-deck-title"
            v-model="newTitle"
            type="text"
            maxlength="200"
            class="mb-5 min-h-12 w-full rounded-control border border-divider bg-canvas px-3.5 py-3 text-[15px] leading-5 text-content placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            placeholder="Например, История Санкт-Петербурга"
            :disabled="savingDeck"
          >
          <label for="new-deck-description" class="mb-2 block text-[14px] font-medium text-content">Описание</label>
          <textarea
            id="new-deck-description"
            v-model="newDescription"
            rows="2"
            maxlength="2000"
            class="mb-5 min-h-12 w-full resize-y rounded-control border border-divider bg-canvas px-3.5 py-3 text-[15px] leading-5 text-content placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            placeholder="Необязательно"
            :disabled="savingDeck"
          />
          <p v-if="deckError" class="mb-4 text-[14px] text-danger" role="alert"><span aria-hidden="true">⚠ </span>{{ deckError }}</p>
          <div class="flex items-center gap-3">
            <button
              type="submit"
              class="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand-primary px-5 py-2.5 text-[15px] font-semibold text-content hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-60"
              :disabled="savingDeck || !newTitle.trim()"
            >
              {{ savingDeck ? 'Создаём…' : 'Создать' }}
            </button>
            <button
              type="button"
              class="min-h-11 rounded-control px-4 py-2.5 text-[15px] font-medium text-muted hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              :disabled="savingDeck"
              @click="cancelCreate"
            >
              Отмена
            </button>
          </div>
        </form>

        <!-- Пустое -->
        <div v-if="!pending && collections.length === 0" class="mt-4 flex h-[96px] items-center justify-center rounded-control border border-dashed border-divider text-[15px] text-muted">
          Пока нет коллекций. Создайте первую, чтобы начать.
        </div>

        <!-- Список: строки идут вплотную, разделены 1px-линией (как в макете) -->
        <div v-else class="mt-4 flex flex-col">
          <NuxtLink
            v-for="(deck, i) in collections"
            :key="deck.id"
            :to="{ path: `/decks/${deck.id}`, query: { title: deck.title } }"
            class="relative flex h-[62px] items-center rounded-control bg-surface hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <CollectionRow :deck="deck" :divider="i > 0" />
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
