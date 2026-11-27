<script setup lang="ts">
import AuthForm from '~/components/auth/AuthForm.vue'
import guest from '~/middleware/auth/01.guest'

definePageMeta({ layout: 'auth', middleware: guest })
useHead({ title: 'Регистрация — 67 Cards' })
</script>

<template>
  <AuthForm mode="register" />
</template>
