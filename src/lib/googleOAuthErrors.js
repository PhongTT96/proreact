const ERROR_MESSAGES = {
  access_denied:
    'Google chặn quyền (access_denied). Email đăng nhập phải có trong Test users. Trên màn "chưa xác minh": Nâng cao → Tiếp tục → Cho phép. Nếu vẫn lỗi: bỏ VITE_GOOGLE_USE_FULL_DRIVE trong .env (dùng scope nhẹ).',
  interaction_required: 'Cần đăng nhập lại — bấm "Đăng nhập (mở trang Google)".',
  login_required: 'Phiên Google hết hạn — đăng nhập lại Gmail trên trình duyệt.',
  popup_closed: 'Cửa sổ đăng nhập bị đóng. Thử nút "Đăng nhập (mở trang Google)" bên dưới.',
  popup_failed_to_open:
    'Trình duyệt chặn cửa sổ popup. Hãy dùng "Đăng nhập (mở trang Google)" hoặc cho phép popup cho localhost.',
  invalid_client: 'Client ID không hợp lệ. Kiểm tra VITE_GOOGLE_CLIENT_ID trong file .env.',
  unauthorized_client:
    'OAuth client sai loại hoặc redirect URI chưa khớp. Thêm http://localhost:5173 vào Authorized redirect URIs.',
  invalid_scope:
    'Scope chưa khai báo trên OAuth consent screen → Data access. Thêm drive.file và drive.metadata.readonly.',
  redirect_uri_mismatch:
    'Redirect URI không khớp. Trên Console thêm đúng URL hiển thị trong ô "Chẩn đoán" bên dưới.',
  temporarily_unavailable: 'Google tạm thời không phản hồi. Thử lại sau vài phút.',
}

export function formatGoogleOAuthError(error = {}) {
  const code = error.error || error.type || ''
  const description = error.error_description || ''

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code]
  }

  if (description) {
    return `${code ? `${code}: ` : ''}${description}`
  }

  if (code) {
    return `Lỗi đăng nhập Google (${code}).`
  }

  return 'Đăng nhập Google thất bại. Kiểm tra Client ID, Test users và Authorized origins trên Google Cloud.'
}
