<script setup lang="ts">
import auth from '~/middleware/auth/auth'

definePageMeta({
  layout: 'default', // просто для примера добавил
  middleware: auth,
})
useHead({ title: '67 Cards' })
</script>

<template>
  <main />
</template>

<style lang="css" scoped>

</style>