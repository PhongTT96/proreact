// Mặc định dùng scope nhẹ (app Testing chưa verify — tránh bị chặn ủy quyền).
// Bật full: .env → VITE_GOOGLE_USE_FULL_DRIVE=true + thêm scope trên Consent screen.
const DRIVE_SCOPES_DEV = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
].join(' ')

const DRIVE_SCOPES_FULL = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
].join(' ')

export const GOOGLE_DRIVE_SCOPES =
  import.meta.env.VITE_GOOGLE_USE_FULL_DRIVE === 'true' ? DRIVE_SCOPES_FULL : DRIVE_SCOPES_DEV

export function isFullDriveScopeEnabled() {
  return import.meta.env.VITE_GOOGLE_USE_FULL_DRIVE === 'true'
}

export function isGoogleDriveConfigured() {
  return Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)
}

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
}

async function driveRequest(accessToken, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || 'Lỗi Google Drive API'
    throw new Error(message)
  }

  return payload
}

export async function listDriveFiles(accessToken, pageSize = 30) {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
    fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink)',
    orderBy: 'modifiedTime desc',
    q: "trashed = false and mimeType != 'application/vnd.google-apps.folder'",
  })

  const data = await driveRequest(
    accessToken,
    `https://www.googleapis.com/drive/v3/files?${params}`,
  )

  return data.files || []
}

export async function uploadTextFile(accessToken, fileName, content) {
  const metadata = { name: fileName, mimeType: 'text/plain' }
  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', new Blob([content], { type: 'text/plain' }))

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    },
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || 'Upload thất bại'
    throw new Error(message)
  }

  return payload
}

export async function uploadDriveFile(accessToken, file) {
  const metadata = { name: file.name }
  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', file)

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    },
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || 'Upload thất bại'
    throw new Error(message)
  }

  return payload
}

export function getDriveFileViewUrl(file) {
  if (file.webViewLink) return file.webViewLink
  return `https://drive.google.com/file/d/${file.id}/view`
}

export function isTextLikeMime(mimeType) {
  if (!mimeType) return false
  return (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/xml'
  )
}

export function canOpenAsBlob(mimeType) {
  if (!mimeType || mimeType.startsWith('application/vnd.google-apps.')) return false
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('audio/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf'
  )
}

export async function openDriveFile(accessToken, file) {
  const viewUrl = getDriveFileViewUrl(file)

  if (file.mimeType?.startsWith('application/vnd.google-apps.')) {
    window.open(viewUrl, '_blank', 'noopener,noreferrer')
    return
  }

  if (canOpenAsBlob(file.mimeType)) {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    if (!response.ok) {
      window.open(viewUrl, '_blank', 'noopener,noreferrer')
      return
    }
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
    return
  }

  window.open(viewUrl, '_blank', 'noopener,noreferrer')
}

export async function readDriveFileContent(accessToken, fileId, mimeType) {
  const isGoogleApp = mimeType?.startsWith('application/vnd.google-apps.')

  const url = isGoogleApp
    ? `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`
    : `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.error?.message || response.statusText || 'Không đọc được file'
    throw new Error(message)
  }

  return response.text()
}
