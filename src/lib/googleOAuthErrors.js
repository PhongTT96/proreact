const ERROR_MESSAGES = {
  access_denied:
    'Bạn đã hủy hoặc Google từ chối quyền. Nếu thấy "ứng dụng chưa được xác minh": chọn Nâng cao → Tiếp tục, rồi Cho phép. Email đăng nhập phải nằm trong Test users trên Google Cloud.',
  popup_closed: 'Cửa sổ đăng nhập bị đóng. Thử nút "Đăng nhập (mở trang Google)" bên dưới.',
  popup_failed_to_open:
    'Trình duyệt chặn cửa sổ popup. Hãy dùng "Đăng nhập (mở trang Google)" hoặc cho phép popup cho localhost.',
  invalid_client: 'Client ID không hợp lệ. Kiểm tra VITE_GOOGLE_CLIENT_ID trong file .env.',
  unauthorized_client: 'OAuth client chưa cấu hình đúng loại Web hoặc thiếu redirect URI.',
  invalid_scope: 'Scope chưa được thêm trên OAuth consent screen → Data access.',
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
