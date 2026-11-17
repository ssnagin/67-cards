
// Event-надзаглушка, которая ходит сама вместо постоянного вызова fetch. 

import useAuthSession from '../auth/useAuthSession'
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
  const session = useAuthSession()

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

    // Разрешаем браузеру отправлять cookie на API.
    // Комментарий выше относится к прежней cookie-схеме. JWT не использует cookies.
    credentials: 'omit',

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
    // Для текущего JWT API CSRF-запросы не нужны: браузер не отправляет токен автоматически.
    session.restoreSession()
    const isAuthEndpoint = endpoint.path.startsWith('/api/auth/')
    headers.delete('Authorization')
    if (!isAuthEndpoint && session.accessToken.value) {
      headers.set('Authorization', `Bearer ${session.accessToken.value}`)
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
      // Нет действующей сессии (ТОЛЬКО ПОСЛЕ ЭТОГО ЗАПРОСА МЫ ПОНИЖАЕМ РАНГОМ ПОЛЬЗОВАТЕЛЯ ДО GUEST)
      // В JWT-логике также выходим по истечению exp; 403 не сбрасывает вход.
      if (statusCode === 401 && !isAuthEndpoint) session.clearSession()
      throw error
    }
  }

  return {
    request
  }
}


