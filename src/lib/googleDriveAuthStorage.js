const STORAGE_KEY = 'proreact_google_drive_session'

export function saveGoogleDriveSession(tokenResponse) {
  const expiresIn = Number(tokenResponse.expires_in) || 3600
  const session = {
    accessToken: tokenResponse.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function loadGoogleDriveSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const session = JSON.parse(raw)
    if (!session?.accessToken) return null

    // Hết hạn trước 1 phút → coi như hết hạn
    if (Date.now() >= session.expiresAt - 60_000) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export function hasGoogleDriveSessionRecord() {
  return Boolean(localStorage.getItem(STORAGE_KEY))
}

export function clearGoogleDriveSession() {
  localStorage.removeItem(STORAGE_KEY)
}
