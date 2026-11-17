import type { AuthResponse, LoginData, UserResponse, RegisterData, StatusResponse } from "~/types/user/auth/userAuth"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface EndpointConfig<Req = undefined, Res = undefined> {
  path: string
  method: HttpMethod
  
  // Эти поля нужны исключительно для TypeScript, физически в JS они будут undefined
  _req?: Req 
  _res?: Res
}

export const apiEndpoints = {



    users: {
        me: {
            path: '/api/users/me',
            method: 'GET'
        } as EndpointConfig<undefined, UserResponse>
    },
    auth: {
        // В дженерики <Req, Res> передаем созданные выше интерфейсы
        login: {
            path: '/api/auth/login',
            method: 'POST',
        } as EndpointConfig<LoginData, AuthResponse>,

        register: {
            path: '/api/auth/register',
            method: 'POST'
        } as EndpointConfig<RegisterData, StatusResponse>
    }

} as const
