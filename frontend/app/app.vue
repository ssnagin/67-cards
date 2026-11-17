<script setup lang="ts">
// Режим соответствует выбору адреса в API-клиенте.
const isMock = useRuntimeConfig().public.apiMode === 'mock'
</script>

<template>
  <NuxtLayout class="min-h-dvh bg-brand-dark font-sans text-content">
    <NuxtPage />
  </NuxtLayout>
  <div
    class="pointer-events-none fixed bottom-3 left-3 z-50 inline-flex items-center gap-1.5 rounded-sm border border-divider bg-surface px-2 py-1 text-xs font-medium text-content"
    :aria-label="isMock ? 'Режим: моковые данные' : 'Режим: API'"
  >
    <span aria-hidden="true">{{ isMock ? '◈' : '●' }}</span>
    <span>{{ isMock ? 'МОК' : 'API' }}</span>
  </div>
</template>
