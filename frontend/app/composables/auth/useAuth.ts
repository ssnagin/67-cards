import type { LoginData, RegisterData } from "~/types/user/auth/userAuth"
import { apiEndpoints } from "~/utils/apiEndpoints"
import { useApi } from "../api/useApi"
import useAuthSession from './useAuthSession'

export default function useAuth() {
    const session = useAuthSession()

    // Сам юзер
    const user = session.user

    // Статус, отражает состояние текущего пользователя
    const status = session.status

    async function refreshUser() {
        // В PR нет /me: восстанавливаем данные UI из claims JWT.
        session.restoreSession()
    }

    async function login(data: LoginData) {
        // Первоначальный логин
        // await api('/api/auth/login', {
        //     method: 'POST',
        //     body: data,
        // })

        const response = await useApi().request(apiEndpoints.auth.login, { body: data })
        if (response.tokenType !== 'Bearer' || typeof response.accessToken !== 'string') {
            throw new Error('Сервер не вернул Bearer access token')
        }
        session.setSession(response.accessToken)
    }

    async function register(data: RegisterData) {
        return useApi().request(apiEndpoints.auth.register, { body: data })
    }

    async function logout() {
        // В stateless API нет logout: удаляем токен только на клиенте.
        session.clearSession()
    }

    // При переходах не запрашиваем профиль повторно без необходимости.
    async function ensureInitialized() {
        // Срок проверяем при каждом переходе, без запроса несуществующего /me.
        await refreshUser()
    }

    return { user, status, refreshUser, ensureInitialized, login, register, logout }
}
