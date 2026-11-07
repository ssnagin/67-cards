
// Event-надзаглушка, которая ходит сама вместо постоянного вызова fetch. 

import type { CsrfResponse } from "~/types/user/auth/userAuth"
import { apiEndpoints, type EndpointConfig } from "~/utils/apiEndpoints"

/*
  Пример:

  <!-- pages/login.vue -->
  <script setup>
  const api = useApi()

  const email = ref('')
  const password = ref('')

  async function handleLogin() {
    // Вызываем api, передавая объект конфигурации эндпоинта
    const response = await api(API_ENDPOINTS.AUTH.LOGIN, {
      body: {
        email: email.value,
        password: password.value
        // ❌ Если вы напишете сюда несуществующее поле (например, age: 20),
        // TypeScript сразу подсветит это красной ошибкой!
      }
    })

    // ✅ response автоматически имеет тип AuthRes!
    // Вы можете писать response.user.name, и IDE будет автодополнять свойства.
    console.log('Привет, ', response.user.name) 
    
    const token = useCookie('auth_token')
    token.value = response.token
  }
  </script>

*/
export const useApi = () => {

  const config = useRuntimeConfig()

  const fetcher = $fetch.create({
    baseURL: config.public.apiBase,

    // Разрешаем браузеру отправлять cookie на API.
    credentials: 'include',

    // При SSR передаём cookie пользователя в запрос к бэкенду.
    headers: cookie ? { cookie } : undefined,
  })

  async function request<Body, Response>(
    endpoint: EndpointConfig<Body, Response>,
    ...args: Body extends undefined ? [] : [body: Body]
  ): Promise<Response> {
    
    const body = args[0] as Record<string, unknown> | undefined
    

    // Для POST сначала получаем CSRF-токен.
    // Маршрут и формат ответа должны быть реализованы на Spring.
    let csrf: CsrfResponse | undefined

    if (endpoint.method === 'POST') {
      csrf = await fetcher<CsrfResponse>(apiEndpoints.auth.csrf.path)
    }

    return fetcher<Response>(endpoint.path, {
      method: endpoint.method,
      body,
      headers: csrf
        ? { [csrf.headerName]: csrf.token }
        : undefined,
    })
  }



  // Возвращаем типизированную функцию-обертку
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <E extends EndpointConfig<any, any>>(


    endpoint: E, 


    // Если эндпоинт принимает тело (Req не void), делаем body обязательным в опциях
    options?: Omit<Parameters<typeof fetcher>[1], 'method' | 'body'> & {
      body?: E['_req']
    }

  ): Promise<E['_res']> => {

    // Берём переданные заголовки, чтобы добавить к ним CSRF-токен.
    const headers = new Headers(options?.headers)

    const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method)

    if (needsCsrf) {
      const csrfEndpoint = apiEndpoints.auth.csrf

      const csrf = await fetcher<CsrfResponse>(csrfEndpoint.path, {
        method: csrfEndpoint.method,
      })

      headers.set(csrf.headerName, csrf.token)
    }
    
    // Передаем в $fetch путь, метод и остальные опции (включая строго типизированный body)
    return fetcher(endpoint.path, {
      ...options,
      method: endpoint.method,
      headers,
    }) as Promise<E['_res']>
  }
}


