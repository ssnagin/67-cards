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