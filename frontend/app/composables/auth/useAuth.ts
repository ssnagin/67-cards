import type { AuthStatus, LoginData, RegisterData } from "~/types/user/auth/userAuth"
import type { User } from "~/types/user/user"
import { apiEndpoints } from "~/utils/apiEndpoints"
import { useApi } from "../api/useApi"

export default function useAuth() {

    // Сам юзер
    const user = useState<User | null>('auth-user', () => null)

    // Статус, отражает состояние текущего пользователя
    const status = useState<AuthStatus>('auth-status', () => 'unknown')

    async function refreshUser() {

        try {

            user.value = await useApi().request(apiEndpoints.auth.me)
            status.value = 'authenticated'

        } catch (error: unknown) {

            // Если цифры нет, то ничего страшного, ловим null
            const statusCode = (error as { statusCode?: number }).statusCode
            
            // Нет действующей сессии (ТОЛЬКО ПОСЛЕ ЭТОГО ЗАПРОСА МЫ ПОНИЖАЕМ РАНГОМ ПОЛЬЗОВАТЕЛЯ ДО GUEST)
            if (statusCode === 401) {
                user.value = null
                status.value = 'guest'
                return
            }

            status.value = 'error'
            throw error
        }

        return null
    }

    async function login(data: LoginData) {

        // Первоначальный логин
        // await api('/api/auth/login', {
        //     method: 'POST',
        //     body: data,
        // })

        await useApi().request(apiEndpoints.auth.login, {
            body: data
        })

        await refreshUser()

        if (status.value !== 'authenticated') {
            throw new Error('Сервер не подтвердил вход')
        }
        
    }

    async function register(data: RegisterData) { 
        await useApi().request(apiEndpoints.auth.register, {
            body: data
        })
    }

    async function logout() {
        await useApi().request(apiEndpoints.auth.logout)

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