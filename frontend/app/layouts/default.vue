<script setup lang="ts">
import useAppAuth from '~/composables/auth/useAppAuth'

const { status, user, logout, ensureInitialized } = useAppAuth()
const pending = ref(false)
const error = ref('')

// Потеря подтверждённой сессии отправляет пользователя на страницу входа.
watch(user, (current, previous) => {
  if (!current && previous) void navigateTo('/auth/login', { replace: true })
})

onMounted(async () => {
  // Для публичных страниц проверяем сессию после загрузки.
  // На защищённых страницах её уже проверило middleware.
  try {
    await ensureInitialized()
  }
  catch (failure) {
    error.value = String(failure)
  }
})

async function signOut() {
  if (pending.value) return
  pending.value = true
  error.value = ''
  try {
    await logout()
    await navigateTo('/auth/login', { replace: true })
  }
  catch (failure) {
    error.value = String(failure)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div>
    <header v-if="status === 'authenticated'" class="border-b border-divider">
      <nav class="flex min-h-[76px] flex-wrap items-center justify-end gap-4 px-6 py-4" aria-label="Основная навигация">
        <p v-if="error" class="break-words text-error" role="alert"><span aria-hidden="true">⚠ </span>{{ error }}</p>
        <button class="min-h-11 rounded-sm border border-control px-5 py-3 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus active:brightness-95 disabled:cursor-wait disabled:opacity-60" type="button" :disabled="pending" @click="signOut">{{ pending ? 'Выход…' : 'Выйти' }}</button>
      </nav>
    </header>
    <slot />
  </div>
</template>
