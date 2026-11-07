import useAuth from "~/composables/auth/useAuth"

export default defineNuxtRouteMiddleware(async () => {

  const { status, ensureInitialized } = useAuth()

  try {
    await ensureInitialized()
  }
  catch {
    throw createError({
      statusCode: 503,
    })
  }

  if (status.value === 'authenticated') {
    return navigateTo('/')
  }
})