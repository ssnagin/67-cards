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

// export type RegisterData = LoginData & { // TODO: ДОБАВИТЬ ПОТОМ ПЕРЕДАЧУ ИМЕНИ 
//   name: string
// }
export type RegisterData = LoginData

export type AuthResponse = {
  accessToken: string
  tokenType: 'Bearer'
}

export type RegisterResponse = User
// Чисто ответ что все ок передаем
// Уточнение контракта PR #5: ответ регистрации содержит id, email, role, без токена. TODO: ПОТОМ СДЕЛАТЬ ТОЛЬКО ОК

// Описание типа ответа от сервера для защиты от CSRF
// Исторические типы: текущий JWT API и useApi их не используют.
export type CsrfResponse = {
    headerName: string
    token: string
}

export const csrfMethods = new Set<string>([
  'POST', 'PUT', 'PATCH', 'DELETE'
])