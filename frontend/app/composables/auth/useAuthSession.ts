import type { AuthStatus } from '~/types/user/auth/userAuth'
import { readAccessToken } from '~/utils/auth/jwt'

export default function useAuthSession() {
  const accessToken = useState<string | null>('auth-access-token', () => null)
  const user = useState<{ id: string, role: string } | null>('auth-user', () => null)
  const status = useState<AuthStatus>('auth-status', () => 'unknown')
  const storageKey = `67cards:${useRuntimeConfig().public.apiMode}:access-token`

  function clearSession() {
    accessToken.value = null
    user.value = null
    status.value = 'guest'
    if (import.meta.client) {
      try { sessionStorage.removeItem(storageKey) }
      catch { /* При запрете хранилища состояние остаётся только в памяти. */ }
    }
  }

  function setSession(token: string) {
    const claims = readAccessToken(token)
    accessToken.value = token
    user.value = { id: claims.sub, role: claims.role }
    status.value = 'authenticated'
    if (import.meta.client) {
      try { sessionStorage.setItem(storageKey, token) }
      catch { /* Вход работает и без доступного sessionStorage. */ }
    }
  }

  function restoreSession() {
    let token = accessToken.value
    if (!token && import.meta.client) {
      try { token = sessionStorage.getItem(storageKey) }
      catch { /* Хранилище может быть отключено в браузере. */ }
    }
    try {
      if (!token) { clearSession(); return }
      setSession(token)
    }
    catch { clearSession() }
  }

  return { accessToken, user, status, setSession, clearSession, restoreSession }
}
