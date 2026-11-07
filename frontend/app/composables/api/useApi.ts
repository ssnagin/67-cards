
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

  const _config = useRuntimeConfig()

  const fetcher = $fetch // ... дописать

  // const fetcher = $fetch.create({
  //   baseURL: config.public.apiBase,
  //   onRequest({ options }) {

  //     if (token.value) {
  //       options.headers = {
  //         ...options.headers,
  //         Authorization: `Bearer ${token.value}`
  //       }
  //     }
  //   }


  // Возвращаем типизированную функцию-обертку
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async <E extends EndpointConfig<any, any>>(
    endpoint: E, 


    // Если эндпоинт принимает тело (Req не void), делаем body обязательным в опциях
    options?: Omit<Parameters<typeof fetcher>[1], 'method' | 'body'> & {
      body?: E['_req']
    }

  ): Promise<E['_res']> => {
    
    // Передаем в $fetch путь, метод и остальные опции (включая строго типизированный body)
    return fetcher(endpoint.path, {

      method: endpoint.method,
      ...options,

    }) as Promise<E['_res']>
  }
}


