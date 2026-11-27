<script setup lang="ts">
// Layout для экранов входа/регистрации: минимальная шапка (только логотип) + контент.
</script>

<template>
  <div class="min-h-dvh bg-canvas font-sans text-content">
    <AppHeader variant="minimal" />
    <slot />
  </div>
</template>
