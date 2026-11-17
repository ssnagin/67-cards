import type { User } from '../user'

export type AuthStatus =
  | 'unknown'
  | 'authenticated'
  | 'guest'
  | 'error'

export type LoginData = {
  email: string
  password: string
}

export type RegisterData = LoginData & {
  username: string
}

export type AuthResponse = {
  accessToken: string
  tokenType: 'Bearer'
}

export type RegisterResponse = { status: 'OK' }
// Данные текущего пользователя, полученные от защищённого API.
export type MeResponse = User

// Описание типа ответа от сервера для защиты от CSRF
// Исторические типы: текущий JWT API и useApi их не используют.
export type CsrfResponse = {
    headerName: string
    token: string
}

export const csrfMethods = new Set<string>([
  'POST', 'PUT', 'PATCH', 'DELETE'
])
