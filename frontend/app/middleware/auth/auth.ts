import useAppAuth from '~/composables/auth/useAppAuth'

// Middleware для защищённых страниц. 
export default defineNuxtRouteMiddleware(async () => {

    const { status, ensureInitialized } = useAppAuth()

    try {

        // Проверка на доступ к серверу
        await ensureInitialized()
    } catch {
        
        throw createError({
            statusCode: 503
        })
    }

    if (status.value === 'unauthenticated') {
        return navigateTo('/auth/login')
    }
})
