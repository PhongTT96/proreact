import { isFullDriveScopeEnabled } from '../lib/googleDriveClient'
import { getGoogleRedirectUri } from '../lib/googleOAuthRedirect'

export function GoogleOAuthHelp() {
  const redirectUri = getGoogleRedirectUri()

  return (
    <div className="drive-oauth-help">
      <p className="drive-oauth-help-title">Sửa lỗi &quot;chặn quyền / lỗi ủy quyền&quot;</p>
      <ol className="drive-oauth-help-steps">
        <li>
          <strong>OAuth consent screen</strong> → <strong>Test users</strong> → thêm <em>đúng email</em>{' '}
          Gmail bạn dùng đăng nhập.
        </li>
        <li>
          <strong>Data access</strong> → Add scopes → chọn:
          <ul>
            <li>
              <code>.../auth/drive.file</code>
            </li>
            <li>
              <code>.../auth/drive.metadata.readonly</code>
            </li>
            {isFullDriveScopeEnabled() && (
              <li>
                <code>.../auth/drive.readonly</code> (restricted — cần verify app)
              </li>
            )}
          </ul>
        </li>
        <li>
          <strong>Credentials</strong> → OAuth <strong>Web</strong> client → origins + redirect (copy từ ô
          Chẩn đoán):
          <br />
          <code>{redirectUri}</code>
        </li>
        <li>
          Mở app bằng <code>http://localhost:5173</code> (khớp với Console, không lẫn port khác).
        </li>
        <li>
          Màn Google &quot;chưa xác minh&quot;: <strong>Nâng cao</strong> → <strong>Tiếp tục</strong> →{' '}
          <strong>Cho phép</strong>.
        </li>
        <li>
          Nếu vẫn chặn: trong <code>.env</code> <strong>xóa</strong> dòng{' '}
          <code>VITE_GOOGLE_USE_FULL_DRIVE=true</code> (nếu có), restart <code>npm run dev</code>.
        </li>
      </ol>
    </div>
  )
}
