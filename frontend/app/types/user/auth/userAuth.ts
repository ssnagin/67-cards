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

// Описание типа ответа от сервера для защиты от CSRF
export type CsrfResponse = {
    headerName: string
    token: string
}