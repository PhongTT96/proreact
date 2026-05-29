import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { getGoogleClientId } from './lib/googleDriveClient'

const googleClientId = getGoogleClientId()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId} locale="vi">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
