
// Event-надзаглушка, которая ходит сама вместо постоянного вызова fetch. 

import { csrfMethods, type CsrfResponse } from "~/types/user/auth/userAuth"
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

  // Второй аргумент $fetch может быть undefined.
  // Убираем undefined, прежде чем исключать отдельные свойства.
  type FetchOptions = NonNullable<Parameters<typeof fetcher>[1]>

  type RequestOptions<Body> = Omit<
    FetchOptions,
    'method' | 'body' | 'baseURL' | 'credentials'
  > & {
    body?: Body
  }

  const fetcher = $fetch.create({
    baseURL: config.public.apiBase,

    // Разрешаем браузеру отправлять cookie на API.
    credentials: 'include',

    // При SSR передаём cookie пользователя в запрос к бэкенду.
    // headers: cookie ? { cookie } : undefined, УБРАНО
  })

  async function request<
    Body extends Record<string, unknown> | undefined,
    Response,
  >(
    endpoint: EndpointConfig<Body, Response>,
    options?: RequestOptions<Body>,
  ): Promise<Response> {
    
    const headers = new Headers(options?.headers)


    // Запросы, требующие csrf токена. Если он нужен, то вызывается метод-фетчер
    const needsCsrf = csrfMethods.has(endpoint.method)
    if (needsCsrf) {

      const csrf = await fetcher<CsrfResponse>(apiEndpoints.auth.csrf.path)

      headers.set(csrf.headerName, csrf.token)
    }

    return fetcher<Response>(endpoint.path, {
      ...options,

      // Метод определяется описанием маршрута.
      method: endpoint.method,
      headers,
    }) as Promise<Response>
  }

  return {
    request
  }
}


