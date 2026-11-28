<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import useAppAuth, { SessionConfirmationError } from '~/composables/auth/useAppAuth'

// Форма входа/регистрации по макету (01_Design.figcraft, страница Auth).
// Карточка 480 px шириной, поля 48 px, лейблы 14 px Onest Medium, основной текст 15 px.
const props = defineProps<{ mode: 'login' | 'register' }>()

const auth = useAppAuth()
const email = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const pending = ref(false)
const error = ref('')
const notice = ref('')
const registered = ref(false)
const isRegistration = computed(() => props.mode === 'register')

// Извлекаем человекочитаемое сообщение из ошибки $fetch / NuxtAuth:
// она приходит как { statusCode, data: { message } } либо { statusMessage }.
function errorMessage(failure: unknown): string {
  if (failure instanceof SessionConfirmationError) return failure.message
  if (typeof failure === 'string') return failure
  const f = failure as { data?: { message?: string }; statusMessage?: string; message?: string }
  if (f?.data?.message) return f.data.message
  if (f?.statusMessage) return f.statusMessage
  if (f?.message) return f.message
  return 'Не удалось выполнить действие. Попробуйте ещё раз.'
}

async function submit() {
  if (pending.value) return
  error.value = ''
  notice.value = ''
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
      notice.value = 'Аккаунт создан. Выполняем вход…'
    }
    await auth.login({ email: email.value.trim(), password: password.value })
    password.value = ''
    await navigateTo('/', { replace: true })
  } catch (failure) {
    error.value = errorMessage(failure)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="grid min-h-[calc(100dvh-72px)] place-items-center px-6 py-8">
    <section class="w-full max-w-[480px] rounded-none bg-surface p-8" aria-labelledby="auth-title">
      <h1 id="auth-title" class="mb-6 text-[32px] font-semibold leading-[42px] text-content">
        {{ isRegistration ? 'Регистрация' : 'Вход' }}
      </h1>

      <form :aria-busy="pending" @submit.prevent="submit">
        <fieldset class="min-w-0 disabled:opacity-60" :disabled="pending">
          <div v-if="isRegistration" class="mb-5">
            <label for="auth-user-name" class="mb-2.5 block text-[14px] font-medium text-content">Имя пользователя</label>
            <BaseInput id="auth-user-name" v-model="username" name="username" type="text" autocomplete="nickname" placeholder="Например, anton_s" required maxlength="100" :readonly="registered" />
          </div>

          <div class="mb-5">
            <label for="auth-email" class="mb-2.5 block text-[14px] font-medium text-content">{{ isRegistration ? 'Почта' : 'Логин или почта' }}</label>
            <BaseInput id="auth-email" v-model="email" name="email" type="email" autocomplete="email" :placeholder="isRegistration ? 'anton@example.com' : 'anton_s или anton@example.com'" required maxlength="254" :readonly="registered" />
          </div>

          <div class="mb-5">
            <div class="mb-2.5 flex items-center justify-between">
              <label for="auth-password" class="block text-[14px] font-medium text-content">Пароль</label>
              <NuxtLink
                v-if="!isRegistration"
                to="/auth/login"
                class="text-[14px] font-medium text-link hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >Забыли пароль?</NuxtLink>
            </div>
            <BaseInput id="auth-password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'" :autocomplete="isRegistration ? 'new-password' : 'current-password'" :placeholder="isRegistration ? 'Придумайте пароль' : ''" required minlength="8" maxlength="72">
              <template #trailing>
                <button type="button" class="grid h-11 w-11 place-items-center text-muted hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword">
                  <AppIcon name="eye" :size="24" />
                </button>
              </template>
            </BaseInput>
            <p v-if="isRegistration" id="password-hint" class="mt-2 text-[14px] text-muted">От 8 до 72 символов</p>
          </div>

          <!-- Заглушка-плейсхолдер Cloudflare Turnstile (визуально по макету; интеграция не подключена). -->
          <div
            v-if="!isRegistration"
            class="mx-auto mb-5 flex h-[65px] w-[300px] items-center gap-3.5 rounded-control bg-raised px-4"
            title="Cloudflare Turnstile — заглушка, интеграция не подключена"
          >
            <span class="grid h-6 w-6 place-items-center rounded-control bg-canvas text-muted"><AppIcon name="check" :size="14" /></span>
            <span class="text-[14px] leading-tight">
              <span class="block font-medium text-content">Подтвердите, что вы человек</span>
              <span class="block text-muted">Cloudflare Turnstile</span>
            </span>
          </div>

          <p v-if="error" class="mb-5 break-words text-[14px] text-danger" role="alert"><span aria-hidden="true">⚠ </span>{{ error }}</p>
          <p v-if="notice" class="mb-5 break-words text-[14px] text-warning" role="status"><span aria-hidden="true">✓ </span>{{ notice }}</p>

          <button
            type="submit"
            class="min-h-12 w-full rounded-control bg-brand-primary px-5 py-3 text-[15px] font-semibold text-content hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus active:brightness-95 disabled:cursor-wait disabled:opacity-60"
          >
            {{ pending ? 'Подождите…' : isRegistration && !registered ? 'Зарегистрироваться' : 'Войти' }}
          </button>
        </fieldset>
      </form>

      <template v-if="!isRegistration">
        <div class="my-6 h-px bg-divider" aria-hidden="true" />
        <p class="mb-4 text-[14px] text-muted">Другие способы входа</p>
        <div class="mb-6 grid grid-cols-3 gap-[7px]">
          <button v-for="provider in ['MAX', 'VK', 'Mail']" :key="provider" type="button" disabled class="min-h-11 rounded-control bg-raised text-[14px] font-medium text-muted" :title="`${provider} — недоступно`">{{ provider }}</button>
        </div>
        <NuxtLink to="/auth/register" class="inline-flex min-h-11 items-center text-[14px] font-medium text-link hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">Создать аккаунт</NuxtLink>
      </template>
      <NuxtLink v-else to="/auth/login" class="mt-2 inline-flex min-h-11 items-center text-[14px] font-medium text-link hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">Уже есть аккаунт? Войти</NuxtLink>
    </section>
  </main>
</template>
