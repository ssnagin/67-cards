<script setup lang="ts">
import { useAuth } from '~/composables/auth/useAuth';


const { refreshUser } = useAuth();

onMounted(async () => {

    await refreshUser()
})

</script>

<template>
    <div>
    <header
      class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <NuxtLink
        to="/"
        class="text-2xl font-extrabold text-white"
      >
        67 <span class="text-violet-400">cards</span>
      </NuxtLink>

      <nav
        aria-label="Основная навигация"
        class="flex flex-wrap items-center gap-4"
      >
        <NuxtLink
          to="/"
          class="text-slate-300 hover:text-white"
        >
          Главная
        </NuxtLink>

        <template>
          <NuxtLink
            to="/login"
            class="text-slate-300 hover:text-white"
          >
            Войти
          </NuxtLink>

          <NuxtLink
            to="/register"
            class="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-500"
          >
            Регистрация
          </NuxtLink>
        </template>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-6 pb-16">
      <slot />
    </main>
  </div>

</template>

<style lang="css" module>

</style>