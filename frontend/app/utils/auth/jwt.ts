// TODO: убрать к чертям эту штуку и использовать NuxtAuth

/*

Да, на бэкенде потребуется один дополнительный защищённый маршрут — получение текущего пользователя. Использовать будем Sidebase с провайдером local, который предназначен для существующего API с логином и паролем.

*/

export type AccessTokenClaims = {
  sub: string
  role: string
  iss: 'cards-api'
  exp: number
}

// Чтение claims нужно для UI и срока действия. Подпись JWT проверяет только API.
export function readAccessToken(token: string, now = Date.now()): AccessTokenClaims {
  const parts = token.split('.')
  if (parts.length !== 3 || !parts[1]) throw new Error('Некорректный access token')
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), char => char.charCodeAt(0))
  const claims = JSON.parse(new TextDecoder().decode(bytes))
  if (!claims || typeof claims.sub !== 'string' || !claims.sub
    || typeof claims.role !== 'string' || claims.iss !== 'cards-api'
    || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp)
    || claims.exp * 1000 <= now) {
    throw new Error('Access token недействителен или истёк')
  }
  return claims
}
