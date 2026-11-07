import type { AuthResponse, LoginData } from "~/types/user/auth/userAuth"

export const API_ENDPOINTS = {
    auth: {
        login: "/v1/auth/login",
        register: "/v1/auth/register",
    }
}

export interface EndpointConfig<Req = void, Res = void> {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  
  // Эти поля нужны исключительно для TypeScript, физически в JS они будут undefined
  _req?: Req 
  _res?: Res
}

export const apiEndpoints = {
    
    auth: {

        // В дженерики <Req, Res> передаем созданные выше интерфейсы
        login: {
        path: '/v1/auth/login',
        method: 'POST',
        } as EndpointConfig<LoginData, AuthResponse>,
    }


} as const