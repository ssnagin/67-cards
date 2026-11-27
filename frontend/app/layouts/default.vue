<script setup lang="ts">
import useAppAuth from '~/composables/auth/useAppAuth'

const { user } = useAppAuth()

// Потеря подтверждённой сессии отправляет пользователя на страницу входа.
watch(user, (current, previous) => {
  if (!current && previous) void navigateTo('/auth/login', { replace: true })
})
</script>

<template>
  <div class="min-h-dvh bg-canvas font-sans text-content">
    <slot />
  </div>
</template>
