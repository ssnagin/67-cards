<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import { formatEditedAt } from '~/utils/format'
import type { Deck } from '~/types/content/deck'

// Строка «Мои коллекции» по макету: иконка, название, дата изменения, меню.
// Счётчик карточек не показываем: бэкенд (Deck) его не возвращает.
defineProps<{ deck: Deck; divider?: boolean }>()
</script>

<template>
  <div class="relative flex h-[62px] items-center rounded-control bg-surface">
    <span v-if="divider" class="absolute left-4 right-4 top-0 h-px bg-divider" aria-hidden="true" />
    <span class="ml-4 grid h-11 w-11 place-items-center rounded-control bg-raised text-muted">
      <AppIcon name="cards" :size="24" />
    </span>
    <span class="ml-4 min-w-0 flex-1 truncate text-[17px] font-medium text-content">{{ deck.title }}</span>
    <span class="hidden min-[1100px]:block text-[15px] text-muted">{{ formatEditedAt(deck.updatedAt) }}</span>
    <button
      type="button"
      class="mr-2 ml-4 grid h-11 w-11 place-items-center rounded-control text-muted hover:bg-raised hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      :aria-label="`Настройки коллекции «${deck.title}»`"
    >
      <AppIcon name="ellipsis-vertical" :size="24" />
    </button>
  </div>
</template>
