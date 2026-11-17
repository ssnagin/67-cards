import type { LoginData, RegisterData } from '~/types/user/auth/userAuth'

export default function useAppAuth() {
  const auth = useAuth()

  async function login(data: LoginData) {
    await auth.signIn(data, { redirect: false })
    // NuxtAuth может вернуть управление без ошибки, если токен или /me не получены.
    if (auth.status.value !== 'authenticated') throw new Error('Не удалось подтвердить вход. Проверьте доступность сервера.')
  }

  async function register(data: RegisterData) {
    return auth.signUp(data, { preventLoginFlow: true, redirect: false })
  }

  async function logout() {
    await auth.signOut({ redirect: false })
  }

  async function ensureInitialized() {
    if (auth.token.value && !auth.data.value) await auth.getSession()
  }

  return { user: auth.data, status: auth.status, login, register, logout, ensureInitialized }
}
