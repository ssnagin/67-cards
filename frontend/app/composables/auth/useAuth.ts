import type { AuthStatus, LoginData, RegisterData } from "~/types/user/auth/userAuth"
import type { User } from "~/types/user/user"
import { apiEndpoints } from "~/utils/apiEndpoints"

export default function useAuth() {

    const config = useRuntimeConfig()

    // Сам юзер
    const user = useState<User | null>('auth-user', () => null)

    // Статус, отражает состояние текущего пользователя
    const status = useState<AuthStatus>('auth-status', () => 'unknown')

    const cookie = import.meta.server
        ? useRequestHeaders(['cookie']).cookie
        : undefined

    // Переделать под useApi, получается. Да?
    const api = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: cookie ? { cookie } : undefined,
    })

    async function refreshUser() {

        try {
            user.value = await api.request(apiEndpoints.auth.me)
            status.value = 'authenticated'
        } catch (error) {
            
        }

        // try {
        //   user.value = await api<User>('/api/auth/me')
        // }
        // catch {
        //   // Гость, завершившаяся сессия или недоступный сервер.
        //   user.value = null
        // }
        // finally {
        //   initialized.value = true
        // }

        return null
    }

    async function login(data: LoginData) {
        await api('/api/auth/login', {
            method: 'POST',
            body: data,
        })

        await refreshUser()

        if (status.value !== 'authenticated') {
            throw new Error('Сервер не подтвердил вход')
        }
        
    }

    async function register(_data: RegisterData) {
        // await api('/api/auth/register', {
        //     method: 'POST',
        //     body: data,
        // })
    }

    async function logout() {
        // await api('/api/auth/logout', {
        // method: 'POST',
        // })

        user.value = null
        status.value = 'guest'
    }

    // При переходах не запрашиваем профиль повторно без необходимости.
    async function ensureInitialized() {
        if (status.value === 'unknown' || status.value === 'error') {
            await refreshUser()
        }
    }

    return {
        user,
        status,
        refreshUser,
        ensureInitialized,
        login,
        register,
        logout,
    }
}