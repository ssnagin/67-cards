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
  name: string
}

export type AuthResponse = {
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export type RegisterResponse = {
  status: 'OK' // Чисто ответ что все ок передаем
}

// Описание типа ответа от сервера для защиты от CSRF
export type CsrfResponse = {
    headerName: string
    token: string
}

export const csrfMethods = new Set<string>([
  'POST', 'PUT', 'PATCH', 'DELETE'
])