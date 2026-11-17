<script setup lang="ts">
const model = defineModel<string>({ required: true })

// Обычные атрибуты и обработчики компонента передаются корневому input автоматически.
</script>

<template>
  <input
    v-model="model"
    class="min-h-12 w-full min-w-0 rounded-sm border border-control bg-brand-dark p-3 text-content read-only:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
  >
</template>
