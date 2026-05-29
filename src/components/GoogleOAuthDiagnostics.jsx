import { GOOGLE_DRIVE_SCOPES, isFullDriveScopeEnabled } from '../lib/googleDriveClient'
import { getOAuthDiagnostics } from '../lib/googleOAuthRedirect'

export function GoogleOAuthDiagnostics() {
  const { origin, redirectUri, hostMatches } = getOAuthDiagnostics()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  const maskedClientId = clientId
    ? `${clientId.slice(0, 12)}...${clientId.slice(-20)}`
    : '(chưa có)'

  return (
    <div className="drive-oauth-diagnostics">
      <p className="drive-oauth-diagnostics-title">Chẩn đoán OAuth</p>
      <ul>
        <li>
          <strong>URL app:</strong> <code>{origin || '—'}</code>
          {!hostMatches && (
            <span className="drive-oauth-warn">
              {' '}
              — Nên mở <code>http://localhost:5173</code> (không dùng 127.0.0.1 nếu Console chỉ có localhost).
            </span>
          )}
        </li>
        <li>
          <strong>Redirect URI:</strong> <code>{redirectUri}</code>
        </li>
        <li>
          <strong>Client ID:</strong> <code>{maskedClientId}</code>
        </li>
        <li>
          <strong>Scope đang xin:</strong>{' '}
          <code className="drive-scope-code">{GOOGLE_DRIVE_SCOPES}</code>
        </li>
        <li>
          <strong>Chế độ:</strong>{' '}
          {isFullDriveScopeEnabled()
            ? 'Full Drive (dễ bị chặn nếu app chưa verify)'
            : 'Dev (khuyên dùng — ít bị chặn ủy quyền)'}
        </li>
      </ul>
    </div>
  )
}
