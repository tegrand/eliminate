import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import QueryProvider from './providers/QueryProvider.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import './config/i18n.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
)
