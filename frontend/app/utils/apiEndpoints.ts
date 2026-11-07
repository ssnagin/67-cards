import type { AuthResponse, CsrfResponse, LoginData, RegisterData } from "~/types/user/auth/userAuth"
import type { User } from "~/types/user/user"

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
            path: '/v1/auth/login',
            method: 'POST',
        } as EndpointConfig<LoginData, AuthResponse>,

        logout: {
            path: '/v1/auth/logout',
            method: 'POST',
        } as EndpointConfig<undefined, undefined>,

        csrf: {
            path: '/v1/auth/csrf',
            method: 'GET',
        } as EndpointConfig<undefined, CsrfResponse>,

        me: {
            path: '/v1/auth/me',
            method: 'GET'
        } as EndpointConfig<undefined, User>,

        register: {
            path: '/v1/auth/register',
            method: 'POST'
        } as EndpointConfig<RegisterData, undefined>
    }

} as const