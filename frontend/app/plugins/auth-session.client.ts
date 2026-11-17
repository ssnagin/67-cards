import useAuthSession from '~/composables/auth/useAuthSession'
import { readAccessToken } from '~/utils/auth/jwt'

export default defineNuxtPlugin(() => {
  const session = useAuthSession()
  let timer: ReturnType<typeof setTimeout> | undefined
  session.restoreSession()

  watch(session.accessToken, (token) => {
    clearTimeout(timer)
    if (!token) return
    try {
      const remaining = readAccessToken(token).exp * 1000 - Date.now()
      timer = setTimeout(() => session.restoreSession(), Math.min(remaining, 2_147_483_647))
    }
    catch { session.clearSession() }
  }, { immediate: true })

  // Возврат в вкладку проверяет срок, даже если браузер приостановил таймер.
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') session.restoreSession()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
  const stopWatching = watch(session.status, (status, previous) => {
    if (status === 'guest' && previous === 'authenticated') {
      void navigateTo('/auth/login', { replace: true })
    }
  })
  if (import.meta.hot) import.meta.hot.dispose(() => {
    clearTimeout(timer)
    stopWatching()
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })
})
