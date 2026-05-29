import { getGoogleRedirectUri } from '../lib/googleOAuthRedirect'

export function GoogleOAuthHelp() {
  const redirectUri = getGoogleRedirectUri()

  return (
    <div className="drive-oauth-help">
      <p className="drive-oauth-help-title">App đang ở chế độ Testing — bị chặn 2 bước là bình thường</p>
      <ol className="drive-oauth-help-steps">
        <li>
          Trên Google Cloud: <strong>OAuth consent screen</strong> → thêm email của bạn vào{' '}
          <strong>Test users</strong>.
        </li>
        <li>
          <strong>Credentials</strong> → OAuth client Web → <strong>Authorized JavaScript origins</strong>:{' '}
          <code>{redirectUri}</code>
        </li>
        <li>
          Thêm <strong>Authorized redirect URIs</strong> (cho nút mở trang Google):{' '}
          <code>{redirectUri}</code>
        </li>
        <li>
          Khi Google báo <em>chưa xác minh ứng dụng</em>: <strong>Nâng cao</strong> →{' '}
          <strong>Tiếp tục</strong> → <strong>Cho phép</strong> quyền Drive.
        </li>
        <li>Hoàn tất xác minh 2 bước (SMS/app Google) nếu tài khoản bật 2FA.</li>
      </ol>
    </div>
  )
}
