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

function parseOAuthParams(params) {
  if (params.get('error')) {
    return {
      error: params.get('error'),
      error_description: params.get('error_description') || '',
      error_uri: params.get('error_uri') || '',
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

export function parseGoogleOAuthCallback() {
  const hash = window.location.hash?.replace(/^#/, '')
  if (hash) {
    const fromHash = parseOAuthParams(new URLSearchParams(hash))
    if (fromHash) return fromHash
  }

  const search = window.location.search?.replace(/^\?/, '')
  if (!search) return null

  return parseOAuthParams(new URLSearchParams(search))
}

/** @deprecated dùng parseGoogleOAuthCallback */
export function parseGoogleOAuthHash() {
  return parseGoogleOAuthCallback()
}

export function clearGoogleOAuthHash() {
  const cleanPath = window.location.pathname
  if (window.location.hash || window.location.search) {
    window.history.replaceState(null, '', cleanPath)
  }
}

export function hasGoogleOAuthHash() {
  const url = `${window.location.hash}${window.location.search}`
  return url.includes('access_token=') || url.includes('error=')
}

export function getOAuthDiagnostics() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return {
    origin,
    redirectUri: getGoogleRedirectUri(),
    hostMatches:
      !origin ||
      origin === 'http://localhost:5173' ||
      origin === 'http://127.0.0.1:5173',
  }
}
