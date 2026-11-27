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
const { collections, recentCards, pending, error, refresh } = useWorkspace()

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
          <button type="button" class="inline-flex min-h-11 items-center gap-2.5 text-[16px] font-medium text-link hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
            Все коллекции
            <AppIcon name="arrow-right" :size="24" />
          </button>
        </div>

        <!-- Пустое -->
        <div v-if="!pending && collections.length === 0" class="mt-4 flex h-[96px] items-center justify-center rounded-control border border-dashed border-divider text-[15px] text-muted">
          Пока нет коллекций. Создайте первую, чтобы начать.
        </div>

        <!-- Список: строки идут вплотную, разделены 1px-линией (как в макете) -->
        <div v-else class="mt-4 flex flex-col">
          <CollectionRow v-for="(deck, i) in collections" :key="deck.id" :deck="deck" :divider="i > 0" />
        </div>
      </section>
    </main>
  </div>
</template>
