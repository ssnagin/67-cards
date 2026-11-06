import type { LoginData } from "~/types/user/auth/userAuth"
import type { User } from "~/types/user/user"

export function useAuth() {
    
    const config = useRuntimeConfig()

    const user = useState<User | null>('auth-user', () => null)
    const initialized = useState<boolean>('auth-initialized', () => false)

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
    })

    async function refreshUser() {
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
        
        // await api('/api/auth/login', {
        //     method: 'POST',
        //     body: data,
        // })

        // После входа получаем профиль из установленной сессии.
        user.value = await api<User>('/api/auth/me')
        initialized.value = true
    }

    async function register(data: RegisterData) {
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
    }

    return {
        user,
        initialized,
        refreshUser,
        login,
        register,
        logout,
    }
}