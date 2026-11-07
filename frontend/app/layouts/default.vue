<script setup lang="ts">
import useAuth from '~/composables/auth/useAuth';

const {ensureInitialized} = useAuth();

onMounted(async () => {
    // Для публичных страниц проверяем сессию после загрузки.
    // На защищённых страницах её уже проверило middleware.
    await ensureInitialized()
})

</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style lang="css" module>

</style>