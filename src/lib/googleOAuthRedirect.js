export function getGoogleRedirectUri() {
  const fromEnv = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function markGoogleOAuthReturn(pageId = 'drive') {
  sessionStorage.setItem('google_oauth_return_page', pageId)
}

export function consumeGoogleOAuthReturnPage() {
  const page = sessionStorage.getItem('google_oauth_return_page')
  sessionStorage.removeItem('google_oauth_return_page')
  return page
}

export function parseGoogleOAuthHash() {
  const hash = window.location.hash?.replace(/^#/, '')
  if (!hash) return null

  const params = new URLSearchParams(hash)

  if (params.get('error')) {
    return {
      error: params.get('error'),
      error_description: params.get('error_description') || '',
    }
  }

  const accessToken = params.get('access_token')
  if (!accessToken) return null

  return {
    access_token: accessToken,
    expires_in: Number(params.get('expires_in')) || 3600,
    token_type: params.get('token_type') || 'Bearer',
    scope: params.get('scope') || '',
  }
}

export function clearGoogleOAuthHash() {
  if (!window.location.hash) return
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}

export function hasGoogleOAuthHash() {
  const hash = window.location.hash || ''
  return hash.includes('access_token=') || hash.includes('error=')
}
