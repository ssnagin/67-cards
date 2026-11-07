<script setup lang="ts">

// Аутентификация
import useAuth from '~/middleware/auth/auth'

definePageMeta({
  middleware: useAuth,
})


</script>

<template>
    <div>
        
    </div>
</template>

<style>

</style>