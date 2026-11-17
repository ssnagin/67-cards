import useAppAuth from "~/composables/auth/useAppAuth"

export default defineNuxtRouteMiddleware(async () => {

  const { status, ensureInitialized } = useAppAuth()

  try {
    await ensureInitialized()
  }
  catch (error) {
    console.error(error)

    throw createError({
      statusCode: 503
    })
  }

  if (status.value === 'authenticated') {
    return navigateTo('/')
  }
})
