<script setup lang="ts">
import useAuth from '~/composables/auth/useAuth';

const { user, status, ensureInitialized, refreshUser, logout } = useAuth();

onMounted(async () => {
    // Для публичных страниц проверяем сессию после загрузки.
    // На защищённых страницах её уже проверило middleware.
    await ensureInitialized()
})

onMounted(async () => {
    
    await refreshUser()
})

</script>

<template>
  <div>
    <header>
      <NuxtLink to="/">
        67 cards
      </NuxtLink>

      <nav aria-label="Основная навигация">
        <NuxtLink to="/">
          Главная
        </NuxtLink>

        <template v-if="initialized && !error">
          <template v-if="user">
            <span>{{ user.nickname }}</span>

            <button type="button" @click="handleLogout">
              Выйти
            </button>
          </template>

          <template v-else>
            <NuxtLink to="/login">
              Войти
            </NuxtLink>

            <NuxtLink to="/register">
              Регистрация
            </NuxtLink>
          </template>
        </template>
      </nav>
    </header>

    <p v-if="error" role="alert">
      {{ error }}
    </p>

    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="css" module>

</style>