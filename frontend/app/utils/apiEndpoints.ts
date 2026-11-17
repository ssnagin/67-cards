import type { AuthResponse, LoginData, RegisterData, RegisterResponse } from "~/types/user/auth/userAuth"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface EndpointConfig<Req = undefined, Res = undefined> {
  path: string
  method: HttpMethod
  
  // Эти поля нужны исключительно для TypeScript, физически в JS они будут undefined
  _req?: Req 
  _res?: Res
}

export const apiEndpoints = {



    auth: {
        // В дженерики <Req, Res> передаем созданные выше интерфейсы
        login: {
            path: '/api/auth/login',
            method: 'POST',
        } as EndpointConfig<LoginData, AuthResponse>,

        register: {
            path: '/api/auth/register',
            method: 'POST'
        } as EndpointConfig<RegisterData, RegisterResponse>
    }

} as const