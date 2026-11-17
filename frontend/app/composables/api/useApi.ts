
// Event-надзаглушка, которая ходит сама вместо постоянного вызова fetch. 

import type { EndpointConfig } from "~/utils/apiEndpoints"

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
  const auth = useAuth()

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
    baseURL: config.public.apiMode === 'mock'
      ? config.app.baseURL
      : config.public.apiBase,

    // Bearer передаётся явно, cookies API не отправляются.
    credentials: 'omit',

  })

  async function request<
    Body extends Record<string, unknown> | undefined,
    Response,
  >(
    endpoint: EndpointConfig<Body, Response>,
    options?: RequestOptions<Body>,
  ): Promise<Response> {
    
    const headers = new Headers(options?.headers)


    const isAuthEndpoint = endpoint.path.startsWith('/api/auth/')
    headers.delete('Authorization')
    if (!isAuthEndpoint && auth.token.value) {
      headers.set('Authorization', auth.token.value)
    }

    try {
      return await fetcher<Response>(endpoint.path, {
        ...options,

        // Метод определяется описанием маршрута.
        method: endpoint.method,
        headers,
      }) as Response
    }
    catch (error: unknown) {
      // Если цифры нет, то ничего страшного, ловим null
      const statusCode = (error as { statusCode?: number }).statusCode
      // 401 завершает сессию; 403 означает недостаток прав.
      if (statusCode === 401 && !isAuthEndpoint) await auth.signOut({ redirect: false })
      throw error
    }
  }

  return {
    request
  }
}


