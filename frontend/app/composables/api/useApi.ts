import type { EndpointConfig } from "~/utils/apiEndpoints"

// Единый API-клиент. Пути и методы берутся из utils/apiEndpoints (см. EndpointConfig),
// адрес бэкенда — из runtimeConfig.public.apiBase. В компонентах/composable'ах
// вызывается только как `useApi().request(apiEndpoints.xxx.yyy, { body })` —
// голые пути в других файлах не пишутся.
export const useApi = () => {

  const config = useRuntimeConfig()
  const auth = useAuth()

  type FetchOptions = NonNullable<Parameters<typeof fetcher>[1]>

  type RequestOptions<Body> = Omit<
    FetchOptions,
    'method' | 'body' | 'baseURL' | 'credentials'
  > & {
    body?: Body
  }

  const fetcher = $fetch.create({
    baseURL: config.public.apiBase,
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

    // Авторизация не нужна только на самих auth-эндпоинтах (login/register).
    const isAuthEndpoint = endpoint.path.startsWith('/api/auth/')
    headers.delete('Authorization')
    if (!isAuthEndpoint && auth.token.value) {
      // auth.token.value уже содержит префикс «Bearer » (sidebase formatToken).
      headers.set('Authorization', auth.token.value)
    }

    try {
      return await fetcher<Response>(endpoint.path, {
        ...options,
        method: endpoint.method,
        headers,
      }) as Response
    }
    catch (error: unknown) {
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
