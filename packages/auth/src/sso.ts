const TOKEN_KEY = 'amakers_token'

export function saveToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export function navigateWithToken(url: string): void {
  if (typeof window === 'undefined') return
  const token = getToken()
  const target = new URL(url, window.location.href)
  if (token) target.searchParams.set('token', token)
  window.location.href = target.toString()
}

export function receiveTokenFromUrl(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  if (token) {
    saveToken(token)
    params.delete('token')
    const cleanQuery = params.toString()
    const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', cleanUrl)
  }
}
