<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import BrandLogo from '~/components/brand/BrandLogo.vue'
import { useCards } from '~/composables/content/useCards'
import type { Card } from '~/types/content/card'

const route = useRoute()
const deckId = route.params.id as string
// Название коллекции передаём из дашборда через query (пока нет GET /api/decks/{id} на фронте).
const deckTitle = computed(() => (typeof route.query.title === 'string' ? route.query.title : 'Карточки'))

const { cards, pending, error, list, create, update, remove } = useCards(deckId)

// --- Текст карточки: первый text-блок стороны ---
function sideText(side?: Card['front']): string {
  return side?.blocks?.find((b) => b.type === 'text')?.content ?? ''
}

// --- Инлайн-редактирование вопроса/ответа прямо в строке ---
// editing: { cardId, side } — какая ячейка сейчас редактируется; null = ничего.
const editing = ref<{ cardId: string; side: 'front' | 'back' } | null>(null)
const draft = ref('')
const savingInline = ref(false)

function startEdit(card: Card, side: 'front' | 'back') {
  editing.value = { cardId: card.id, side }
  draft.value = sideText(side === 'front' ? card.front : card.back)
  // Фокус ставится после отрисовки input (см. v-focus ниже).
}

function isEditing(cardId: string, side: 'front' | 'back') {
  return editing.value?.cardId === cardId && editing.value?.side === side
}

function cancelEdit() {
  editing.value = null
  draft.value = ''
}

async function commitEdit(card: Card) {
  if (!editing.value || savingInline.value) return
  const { side } = editing.value
  const text = draft.value.trim()

  // Ничего не меняем — просто закрываем редактирование.
  editing.value = null
  draft.value = ''
  if (text === sideText(side === 'front' ? card.front : card.back)) return

  savingInline.value = true
  try {
    const updatedCard: Card = { ...card }
    if (side === 'front') {
      updatedCard.front = { blocks: [{ type: 'text', content: text }] }
    } else {
      updatedCard.back = { blocks: [{ type: 'text', content: text }] }
    }
    await update(card.id, updatedCard)
    await list()
  } catch {
    // ошибку уже поймал и записал useCards
  } finally {
    savingInline.value = false
  }
}

// Директива: автофокус на инлайн-input при появлении.
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus(),
}

// --- Инлайн-форма создания (появляется под списком, как продолжение) ---
const formOpen = ref(false)
const question = ref('')
const answer = ref('')
const saving = ref(false)

function openCreate() {
  question.value = ''
  answer.value = ''
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  question.value = ''
  answer.value = ''
}

async function submitCard() {
  const q = question.value.trim()
  const a = answer.value.trim()
  if (!q) return
  saving.value = true
  try {
    await create({
      id: '',
      deckId,
      front: { blocks: [{ type: 'text', content: q }] },
      back: { blocks: [{ type: 'text', content: a }] },
    })
    closeForm()
    await list()
  } catch {
    // ошибку уже поймал и записал useCards
  } finally {
    saving.value = false
  }
}

// --- Удаление ---
const removingId = ref<string | null>(null)
async function removeCard(cardId: string) {
  if (removingId.value) return
  removingId.value = cardId
  try {
    await remove(cardId)
    await list()
  } finally {
    removingId.value = null
  }
}

onMounted(() => list())
</script>

<template>
  <div class="min-h-dvh">
    <!-- Шапка: логотип + «← название коллекции» + статус сохранения -->
    <header class="border-b border-divider bg-surface">
      <div class="mx-auto flex h-[72px] max-w-[1312px] items-center px-16">
        <BrandLogo />
        <span class="mx-4 h-9 w-px bg-divider" aria-hidden="true" />
        <NuxtLink
          to="/"
          class="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-semibold text-link hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          <AppIcon name="arrow-left" :size="24" />
          <span>{{ deckTitle }}</span>
        </NuxtLink>
        <span class="ml-auto inline-flex items-center gap-2 text-[14px] font-medium text-muted">
          <AppIcon name="check" :size="20" />
          Сохранено
        </span>
      </div>
    </header>

    <!-- Холст карточек -->
    <main class="mx-auto max-w-[880px] px-6 pb-16 pt-12">
      <p v-if="pending" class="text-[15px] text-muted">Загружаем…</p>
      <p v-else-if="error" class="text-[15px] text-danger" role="alert"><span aria-hidden="true">⚠ </span>{{ error }}</p>
      <p v-else-if="cards.length === 0 && !formOpen" class="text-[15px] text-muted">Пока нет карточек.</p>

      <!-- Список карточек: строки 72px. Вопрос и ответ редактируются инлайн по клику. -->
      <ul v-if="!pending && !error" class="flex flex-col">
        <li
          v-for="card in cards"
          :key="card.id"
          class="group flex h-[72px] items-center border-b border-divider"
        >
          <span class="h-[5px] w-[5px] shrink-0 rounded-full bg-link" aria-hidden="true" />

          <!-- Вопрос (инлайн-редактирование) -->
          <div class="ml-[13px] flex min-w-0 flex-1 items-center">
            <input
              v-if="isEditing(card.id, 'front')"
              v-model="draft"
              v-focus
              type="text"
              class="w-full rounded-control border border-focus bg-canvas px-2 py-1 text-[18px] font-medium text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              :disabled="savingInline"
              @keydown.enter.prevent="commitEdit(card)"
              @keydown.esc.prevent="cancelEdit"
              @blur="commitEdit(card)"
            >
            <button
              v-else
              type="button"
              class="w-full truncate text-left text-[18px] font-medium text-content hover:text-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              title="Редактировать вопрос"
              @click="startEdit(card, 'front')"
            >
              {{ sideText(card.front) || '(пустой вопрос)' }}
            </button>
          </div>

          <!-- Ответ (инлайн-редактирование) -->
          <div class="ml-6 flex min-w-0 flex-1 items-center">
            <input
              v-if="isEditing(card.id, 'back')"
              v-model="draft"
              v-focus
              type="text"
              class="w-full rounded-control border border-focus bg-canvas px-2 py-1 text-[16px] text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              :disabled="savingInline"
              @keydown.enter.prevent="commitEdit(card)"
              @keydown.esc.prevent="cancelEdit"
              @blur="commitEdit(card)"
            >
            <button
              v-else
              type="button"
              class="w-full truncate text-left text-[16px] text-content hover:text-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              title="Редактировать ответ"
              @click="startEdit(card, 'back')"
            >
              {{ sideText(card.back) }}
            </button>
          </div>

          <!-- Удаление -->
          <button
            type="button"
            class="ml-4 grid h-11 w-11 shrink-0 place-items-center rounded-control text-muted hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-50"
            :disabled="removingId === card.id"
            :aria-label="`Удалить карточку «${sideText(card.front)}»`"
            title="Удалить"
            @click="removeCard(card.id)"
          >
            <AppIcon name="trash" :size="22" />
          </button>
        </li>
      </ul>

      <!-- Кнопка «Добавить карточку» -->
      <button
        v-if="!formOpen"
        type="button"
        class="mt-6 inline-flex min-h-11 items-center gap-2 rounded-control bg-brand-primary px-5 py-2.5 text-[15px] font-semibold text-content hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        @click="openCreate"
      >
        <AppIcon name="plus" :size="18" />
        Добавить карточку
      </button>

      <!-- Инлайн-форма создания (только для новой карточки) -->
      <form
        v-else
        class="mt-6 relative rounded-control bg-surface p-6 pl-8"
        @submit.prevent="submitCard"
      >
        <span class="absolute left-0 top-0 h-full w-0.5 bg-focus" aria-hidden="true" />
        <p class="mb-5 text-[16px] font-semibold text-content">Новая карточка</p>

        <label for="card-question" class="mb-2 block text-[14px] font-medium text-content">Вопрос</label>
        <textarea
          id="card-question"
          v-model="question"
          rows="2"
          class="mb-5 min-h-12 w-full resize-y rounded-control border border-divider bg-canvas px-3.5 py-3 text-[15px] leading-5 text-content placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          placeholder="Вопрос (лицевая сторона)"
          :disabled="saving"
        />

        <label for="card-answer" class="mb-2 block text-[14px] font-medium text-content">Ответ</label>
        <textarea
          id="card-answer"
          v-model="answer"
          rows="2"
          class="mb-5 min-h-12 w-full resize-y rounded-control border border-divider bg-canvas px-3.5 py-3 text-[15px] leading-5 text-content placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          placeholder="Ответ (обратная сторона)"
          :disabled="saving"
        />

        <div class="flex items-center gap-3">
          <button
            type="submit"
            class="inline-flex min-h-11 items-center gap-2 rounded-control bg-brand-primary px-5 py-2.5 text-[15px] font-semibold text-content hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-60"
            :disabled="saving || !question.trim()"
          >
            {{ saving ? 'Сохраняем…' : 'Добавить' }}
          </button>
          <button
            type="button"
            class="min-h-11 rounded-control px-4 py-2.5 text-[15px] font-medium text-muted hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            :disabled="saving"
            @click="closeForm"
          >
            Отмена
          </button>
        </div>
      </form>
    </main>
  </div>
</template>
