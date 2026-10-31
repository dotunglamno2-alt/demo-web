import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary
      title="Ứng dụng gặp sự cố không mong muốn"
      description="Dữ liệu đã lưu trong trình duyệt vẫn an toàn. Bấm thử lại để tải lại giao diện."
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
