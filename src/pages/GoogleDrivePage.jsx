import { useCallback, useEffect, useRef, useState } from 'react'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import {
  GOOGLE_DRIVE_SCOPES,
  isGoogleDriveConfigured,
  listDriveFiles,
  openDriveFile,
  readDriveFileContent,
  isTextLikeMime,
  uploadDriveFile,
  uploadTextFile,
} from '../lib/googleDriveClient'
import {
  clearGoogleDriveSession,
  hasGoogleDriveSessionRecord,
  loadGoogleDriveSession,
  saveGoogleDriveSession,
} from '../lib/googleDriveAuthStorage'
import { registerPullRefresh, unregisterPullRefresh } from '../lib/pullRefreshRegistry'
import { formatGoogleOAuthError } from '../lib/googleOAuthErrors'
import {
  clearGoogleOAuthHash,
  getGoogleRedirectUri,
  markGoogleOAuthReturn,
  parseGoogleOAuthCallback,
} from '../lib/googleOAuthRedirect'
import { GoogleOAuthHelp } from '../components/GoogleOAuthHelp'
import { GoogleOAuthDiagnostics } from '../components/GoogleOAuthDiagnostics'

async function refreshFileList(accessToken) {
  return listDriveFiles(accessToken)
}

export function GoogleDrivePage({ onBack }) {
  const [accessToken, setAccessToken] = useState(null)
  const [status, setStatus] = useState(null)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [fileName, setFileName] = useState('demo-proreact.txt')
  const [uploadText, setUploadText] = useState('{"hello":"Google Drive"}')
  const [listLoading, setListLoading] = useState(false)
  const [readLoading, setReadLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const restoreAttempted = useRef(false)

  const applyFileList = (driveFiles) => {
    setFiles(driveFiles)
    setStatus(
      driveFiles.length
        ? `Đã tải ${driveFiles.length} file từ Google Drive.`
        : 'Drive trống hoặc chưa có file. Thử upload bên dưới.',
    )
  }

  const completeLogin = useCallback(async (tokenResponse, { restored = false } = {}) => {
    saveGoogleDriveSession(tokenResponse)
    const token = tokenResponse.access_token
    setAccessToken(token)
    setSelectedFile(null)
    setFileContent('')
    setListLoading(true)
    try {
      const driveFiles = await refreshFileList(token)
      applyFileList(driveFiles)
      if (restored) {
        setStatus('Đã khôi phục phiên đăng nhập Google (đã lưu trên trình duyệt).')
      }
    } catch (error) {
      clearGoogleDriveSession()
      setAccessToken(null)
      setStatus(
        restored
          ? `Phiên đã hết hạn, vui lòng đăng nhập lại: ${error.message}`
          : `Đã đăng nhập nhưng không tải được danh sách: ${error.message}`,
      )
      setFiles([])
    } finally {
      setListLoading(false)
      setSessionLoading(false)
    }
  }, [])

  const handleOAuthError = useCallback((error) => {
    setSessionLoading(false)
    setStatus(formatGoogleOAuthError(error))
  }, [])

  const loginPopup = useGoogleLogin({
    scope: GOOGLE_DRIVE_SCOPES,
    ux_mode: 'popup',
    prompt: 'select_account',
    onSuccess: (tokenResponse) => completeLogin(tokenResponse),
    onError: handleOAuthError,
    onNonOAuthError: handleOAuthError,
  })

  const loginRedirect = useGoogleLogin({
    scope: GOOGLE_DRIVE_SCOPES,
    ux_mode: 'redirect',
    redirect_uri: getGoogleRedirectUri(),
    prompt: 'select_account',
    onSuccess: (tokenResponse) => completeLogin(tokenResponse),
    onError: handleOAuthError,
    onNonOAuthError: handleOAuthError,
  })

  const startRedirectLogin = () => {
    markGoogleOAuthReturn('drive')
    loginRedirect()
  }

  const silentLogin = useGoogleLogin({
    scope: GOOGLE_DRIVE_SCOPES,
    prompt: 'none',
    onSuccess: (tokenResponse) => completeLogin(tokenResponse, { restored: true }),
    onError: () => {
      clearGoogleDriveSession()
      setSessionLoading(false)
    },
  })

  useEffect(() => {
    if (!isGoogleDriveConfigured() || restoreAttempted.current) {
      setSessionLoading(false)
      return
    }

    restoreAttempted.current = true

    const fromRedirect = parseGoogleOAuthCallback()
    if (fromRedirect?.error) {
      clearGoogleOAuthHash()
      handleOAuthError(fromRedirect)
      return
    }
    if (fromRedirect?.access_token) {
      clearGoogleOAuthHash()
      void completeLogin(fromRedirect)
      return
    }

    const saved = loadGoogleDriveSession()
    if (saved?.accessToken) {
      void completeLogin(
        {
          access_token: saved.accessToken,
          expires_in: Math.max(60, Math.floor((saved.expiresAt - Date.now()) / 1000)),
        },
        { restored: true },
      )
      return
    }

    if (hasGoogleDriveSessionRecord()) {
      clearGoogleDriveSession()
      silentLogin()
      return
    }

    setSessionLoading(false)
    // Chỉ chạy một lần khi mở trang Drive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    googleLogout()
    clearGoogleDriveSession()
    setAccessToken(null)
    setFiles([])
    setSelectedFile(null)
    setFileContent('')
    setStatus('Đã đăng xuất Google và xóa phiên đã lưu.')
  }

  const handleListFiles = useCallback(async () => {
    if (!accessToken) {
      setStatus('Vui lòng đăng nhập Google trước.')
      return
    }

    setListLoading(true)
    try {
      const driveFiles = await refreshFileList(accessToken)
      applyFileList(driveFiles)
    } catch (error) {
      setStatus(`Lỗi danh sách file: ${error.message}`)
      setFiles([])
    } finally {
      setListLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    registerPullRefresh('drive', handleListFiles)
    return () => unregisterPullRefresh('drive')
  }, [handleListFiles])

  const handleOpenFile = async (file) => {
    if (!accessToken) return

    setReadLoading(true)
    setSelectedFile(file)
    setFileContent('')

    try {
      await openDriveFile(accessToken, file)
      setStatus(`Đã mở file: ${file.name}`)

      const maxPreviewBytes = 512 * 1024
      const size = Number(file.size) || 0
      if (isTextLikeMime(file.mimeType) && (size === 0 || size <= maxPreviewBytes)) {
        const content = await readDriveFileContent(accessToken, file.id, file.mimeType)
        setFileContent(content)
      }
    } catch (error) {
      setStatus(`Không mở được file: ${error.message}`)
    } finally {
      setReadLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!accessToken) {
      setStatus('Vui lòng đăng nhập Google trước.')
      return
    }

    if (!fileName.trim()) {
      setStatus('Vui lòng nhập tên file.')
      return
    }

    setUploadLoading(true)
    try {
      const uploaded = await uploadTextFile(accessToken, fileName.trim(), uploadText)
      setStatus(`Upload thành công: ${uploaded.name}`)
      const driveFiles = await refreshFileList(accessToken)
      applyFileList(driveFiles)
    } catch (error) {
      setStatus(`Upload lỗi: ${error.message}`)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleUploadFromComputer = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !accessToken) return

    setUploadLoading(true)
    try {
      const uploaded = await uploadDriveFile(accessToken, file)
      setStatus(`Upload thành công: ${uploaded.name}`)
      const driveFiles = await refreshFileList(accessToken)
      applyFileList(driveFiles)
    } catch (error) {
      setStatus(`Upload lỗi: ${error.message}`)
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <div className="App drive-page">
      <header className="page-header">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Quay lại">
          ←
        </button>
        <h1>Google Drive</h1>
      </header>

      <main className="page-content">
        {!isGoogleDriveConfigured() && (
          <p className="drive-hint">
            Thêm <code>VITE_GOOGLE_CLIENT_ID</code> vào file <code>.env</code>, bật Google Drive API
            trên Google Cloud Console, và thêm origin <code>http://localhost:5173</code> vào OAuth.
          </p>
        )}

        {isGoogleDriveConfigured() && !accessToken && (
          <>
            <GoogleOAuthHelp />
            <GoogleOAuthDiagnostics />
          </>
        )}

        <section className="drive-section">
          <h2>Đăng nhập</h2>
          {sessionLoading ? (
            <p className="drive-list-hint">Đang khôi phục phiên đăng nhập...</p>
          ) : accessToken ? (
            <>
              <p className="drive-list-hint">Đã lưu đăng nhập trên trình duyệt — lần sau không cần đăng nhập lại.</p>
              <button type="button" onClick={handleLogout}>
                Đăng xuất Google
              </button>
            </>
          ) : (
            <div className="drive-login-actions">
              <button
                type="button"
                className="drive-login-primary"
                onClick={startRedirectLogin}
                disabled={!isGoogleDriveConfigured()}
              >
                Đăng nhập (mở trang Google)
              </button>
              <button
                type="button"
                className="drive-login-secondary"
                onClick={() => loginPopup()}
                disabled={!isGoogleDriveConfigured()}
              >
                Đăng nhập (cửa sổ popup)
              </button>
            </div>
          )}
        </section>

        <section className="drive-section">
          <h2>File trên Drive</h2>
          <p className="drive-list-hint">Bấm tên file để mở ngay (tab mới hoặc trình xem).</p>
          <button
            type="button"
            onClick={handleListFiles}
            disabled={!accessToken || listLoading}
          >
            {listLoading ? 'Đang tải...' : 'Tải danh sách file'}
          </button>

          {files.length > 0 && (
            <ul className="drive-file-list">
              {files.map((file) => (
                <li key={file.id}>
                  <button
                    type="button"
                    className={`drive-file-btn ${selectedFile?.id === file.id ? 'active' : ''}`}
                    onClick={() => handleOpenFile(file)}
                    disabled={readLoading && selectedFile?.id === file.id}
                  >
                    <span className="drive-file-name">{file.name}</span>
                    {readLoading && selectedFile?.id === file.id && (
                      <span className="drive-file-loading"> Đang mở...</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {fileContent && (
            <pre className="drive-preview">{fileContent}</pre>
          )}
        </section>

        <section className="drive-section">
          <h2>Ghi file (upload text)</h2>
          <label className="drive-label">
            Tên file:
            <input
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder="ten-file.txt"
            />
          </label>
          <label className="drive-label">
            Nội dung:
            <textarea
              value={uploadText}
              onChange={(event) => setUploadText(event.target.value)}
              rows={6}
              placeholder='{"key":"value"}'
            />
          </label>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!accessToken || uploadLoading}
          >
            {uploadLoading ? 'Đang upload...' : 'Upload text lên Drive'}
          </button>

          <label className="drive-label drive-file-input">
            Hoặc chọn file từ máy:
            <input
              type="file"
              onChange={handleUploadFromComputer}
              disabled={!accessToken || uploadLoading}
            />
          </label>
        </section>

        {status && (
          <section className="drive-section">
            <p className={`drive-status ${/lỗi|chặn|thất bại|hủy|denied/i.test(status) ? 'drive-status-error' : ''}`}>
              {status}
            </p>
          </section>
        )}
      </main>
    </div>
  )
}
