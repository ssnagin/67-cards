<script setup lang="ts">
import BaseInput from '~/components/base/BaseInput.vue'
import useAppAuth from '~/composables/auth/useAppAuth'

const props = defineProps<{ mode: 'login' | 'register' }>()
const auth = useAppAuth()
const email = ref('')
const username = ref('')
const password = ref('')
const pending = ref(false)
const error = ref('')
const registered = ref(false)
const isRegistration = computed(() => props.mode === 'register')

async function submit() {
  if (pending.value) return
  error.value = ''
  if (isRegistration.value && !registered.value && !username.value.trim()) {
    error.value = 'Укажите имя пользователя.'
    return
  }
  pending.value = true
  try {
    if (isRegistration.value && !registered.value) {
      await auth.register({ username: username.value.trim(), email: email.value.trim(), password: password.value })
      // Если последующий вход временно недоступен, повторяем только его, не регистрацию.
      registered.value = true
    }
    await auth.login({ email: email.value.trim(), password: password.value })
    password.value = ''
    await navigateTo('/', { replace: true })
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
  <main class="grid min-h-dvh place-items-center px-4 py-6">
    <section class="w-full max-w-[400px] bg-surface px-5 py-6 min-[361px]:p-8" aria-labelledby="auth-title">
      <h1 id="auth-title" class="mb-7 break-words text-2xl font-bold sm:text-[32px]">{{ isRegistration ? 'Регистрация' : 'Вход' }}</h1>
      <form :aria-busy="pending" @submit.prevent="submit">
        <fieldset class="min-w-0 disabled:opacity-60" :disabled="pending">
          <label v-if="isRegistration" for="auth-user-name" class="mb-5 grid gap-2">Имя пользователя
            <BaseInput id="auth-user-name" v-model="username" name="username" type="text" autocomplete="nickname" required maxlength="100" :readonly="registered" />
          </label>
          <label for="auth-email" class="mb-5 grid gap-2">Почта
            <BaseInput id="auth-email" v-model="email" name="email" type="email" autocomplete="email" required maxlength="254" :readonly="registered" />
          </label>
          <label for="auth-password" class="mb-5 grid gap-2">Пароль
            <BaseInput id="auth-password" v-model="password" name="password" type="password" :autocomplete="isRegistration ? 'new-password' : 'current-password'" required minlength="8" maxlength="72" :aria-describedby="isRegistration ? 'password-hint' : undefined" />
          </label>
          <p v-if="isRegistration" id="password-hint" class="-mt-3 mb-5 text-sm text-muted">От 8 до 72 символов</p>
          <p v-if="error" class="mb-5 break-words text-error" role="alert"><span aria-hidden="true">⚠ </span>{{ error }}</p>
          <button class="min-h-11 w-full rounded-sm bg-brand-primary px-5 py-3 font-semibold text-content hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus active:brightness-95 disabled:cursor-wait" type="submit">{{ pending ? 'Подождите…' : isRegistration && !registered ? 'Зарегистрироваться' : 'Войти' }}</button>
        </fieldset>
      </form>
      <NuxtLink class="mt-3 inline-flex min-h-11 items-center text-link underline underline-offset-4 hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus" :to="isRegistration ? '/auth/login' : '/auth/register'">{{ isRegistration ? 'Уже есть аккаунт? Войти' : 'Создать аккаунт' }}</NuxtLink>
    </section>
  </main>
</template>
