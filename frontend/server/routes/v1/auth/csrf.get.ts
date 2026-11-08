import type { CsrfResponse } from '~/types/user/auth/userAuth'



export default defineEventHandler((_event): CsrfResponse => {

    const response: CsrfResponse = {
        headerName: 'X-CSRF-TOKEN',
        token: 'mock-csrf-token'
    }

  return response
})