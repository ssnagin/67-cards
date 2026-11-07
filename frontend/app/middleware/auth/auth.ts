import useAuth from '~/composables/auth/useAuth'

// Middleware для защищённых страниц. 
export default defineNuxtRouteMiddleware(async () => {

    const { status, ensureInitialized } = useAuth()
    
    if (status.value === 'guest') {
        return navigateTo('/login')
    }

    try {

        // Проверка на доступ к серверу
        await ensureInitialized()
    } catch {
        
        throw createError({
            statusCode: 503
        })
    }
})