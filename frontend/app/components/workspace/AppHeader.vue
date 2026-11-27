<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import useAppAuth from '~/composables/auth/useAppAuth'

// Шапка по дизайну. Два варианта:
//  - workspace: логотип + навигация + меню профиля (дашборд);
//  - minimal:   только логотип (экран входа/регистрации).
withDefaults(defineProps<{ variant?: 'workspace' | 'minimal' }>(), {
  variant: 'workspace',
})

const { user, logout } = useAppAuth()
const menuOpen = ref(false)
const pending = ref(false)

const initials = computed(() => {
  const name = user.value?.username ?? ''
  const clean = name.trim()
  if (!clean) return '?'
  return clean.slice(0, 2).toUpperCase()
})

async function signOut() {
  if (pending.value) return
  pending.value = true
  try {
    await logout()
    await navigateTo('/auth/login', { replace: true })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <header class="border-b border-divider bg-surface">
    <div class="flex h-[72px] items-center" :class="variant === 'minimal' ? 'px-8' : 'px-16'">
      <BrandLogo />

      <template v-if="variant === 'workspace'">
        <NuxtLink
          to="/"
          class="ml-[28px] inline-flex min-h-11 items-center gap-2.5 text-[16px] font-medium text-content hover:text-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          <AppIcon name="cards" :size="24" />
          <span>Коллекции карточек</span>
        </NuxtLink>

        <div class="relative ml-auto">
          <button
            type="button"
            class="inline-flex min-h-12 items-center gap-2 rounded-control bg-raised pl-2 pr-2 text-content hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            :aria-expanded="menuOpen"
            aria-haspopup="menu"
            @click="menuOpen = !menuOpen"
          >
            <span class="grid h-[34px] w-[34px] place-items-center rounded-full bg-blue text-[13px] font-bold text-canvas">{{ initials }}</span>
            <span class="max-w-[83px] truncate text-[16px] font-medium">{{ user?.username ?? '…' }}</span>
            <AppIcon name="chevron-down" :size="24" class="text-muted" />
          </button>

          <div
            v-if="menuOpen"
            role="menu"
            class="absolute right-0 top-[52px] z-30 w-56 rounded-control border border-divider bg-raised py-1 shadow-lg"
          >
            <div class="border-b border-divider px-4 py-2">
              <p class="truncate text-[14px] font-medium text-content">{{ user?.username }}</p>
              <p class="truncate text-[13px] text-muted">{{ user?.email }}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[14px] text-content hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
              :disabled="pending"
              @click="signOut"
            >
              <AppIcon name="logout" :size="20" class="text-muted" />
              {{ pending ? 'Выход…' : 'Выйти' }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>
