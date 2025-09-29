import { useCookies } from '@vueuse/integrations/useCookies'

const AUTH_TOKEN_COOKIE_KEY = 'auth_token'
const cookies = useCookies(['AUTH_TOKEN_COOKIE_KEY'])

function getAuthToken() {
  return cookies.get(AUTH_TOKEN_COOKIE_KEY)
}

function setAuthToken(token: string) {
  const today = new Date()
  today.setDate(today.getDate() + 13)

  return cookies.set(AUTH_TOKEN_COOKIE_KEY, token, {
    path: '/',
    expires: today,
  })
}

function removeAuthToken() {
  return cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
    path: '/',
  })
}

export { cookies, getAuthToken, removeAuthToken, setAuthToken }
