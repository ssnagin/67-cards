<script setup lang="ts">
import AuthForm from '~/components/auth/AuthForm.vue'
import guest from '~/middleware/auth/01.guest'

definePageMeta({ layout: 'auth', middleware: guest })
useHead({ title: 'Вход — 67 Cards' })
</script>

<template>
  <AuthForm mode="login" />
</template>
